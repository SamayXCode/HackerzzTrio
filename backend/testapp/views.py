import random
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework import status
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterUserSerializer, SendOTPSerializer, VerifyOTPSerializer, QuestionSerializer, AnswerSerializer
from .models import Question, Answer

User = get_user_model()
OTP_EXPIRY_SECONDS = 300

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data
        user = User.objects.create_user(
            username=validated['email'],
            email=validated['email'],
            first_name=validated['first_name'],
            last_name=validated['last_name'],
            password=None
        )

        return Response({
            'detail': 'User registered successfully. Please verify OTP to login.',
        }, status=status.HTTP_201_CREATED)

class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        if cache.get(f"otp_cooldown:{email}"):
            return Response({'detail': 'Please wait before requesting another OTP.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp = str(random.randint(100000, 999999))
        cache.set(f"otp:{email}", otp, timeout=OTP_EXPIRY_SECONDS)
        cache.set(f"otp_cooldown:{email}", True, timeout=60)

        try:
            send_mail(
                'Your OTP Code',
                f'Your OTP is {otp}. It expires in 5 minutes.',
                'trialofproject@gmail.com',
                [email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({'detail': f'Failed to send OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'detail': 'OTP sent to your email'}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        cached_otp = cache.get(f"otp:{email}")
        if cached_otp != otp:
            return Response({'detail': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        user, _ = User.objects.get_or_create(username=email, defaults={'email': email})

        cache.delete(f"otp:{email}")

        refresh = RefreshToken.for_user(user)

        return Response({
            'detail': f'Logged in as {email}',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'username': user.username,
                'name': f"{user.first_name} {user.last_name}".strip(),
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out successfully"}, status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class QuestionListView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        questions = Question.objects.all().order_by('-created_at')
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuestionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuestionDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, question_id):
        question = get_object_or_404(Question, pk=question_id)
        answers = Answer.objects.filter(question=question).order_by('-created_at')

        question_data = {
            'id': question.id,
            'title': question.title,
            'content': question.content,
            'author': {
                'id': question.author.id,
                'name': f"{question.author.first_name} {question.author.last_name}".strip(),
                'email': question.author.email
            },
            'created_at': question.created_at,
            'updated_at': question.updated_at,
            'tags': [tag.name for tag in question.tags.all()],
            'answers': [{
                'id': answer.id,
                'content': answer.content,
                'author': {
                    'id': answer.author.id,
                    'name': f"{answer.author.first_name} {answer.author.last_name}".strip(),
                    'email': answer.author.email
                },
                'created_at': answer.created_at,
                'updated_at': answer.updated_at
            } for answer in answers]
        }

        return Response(question_data, status=status.HTTP_200_OK)

class AnswerCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AnswerSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
