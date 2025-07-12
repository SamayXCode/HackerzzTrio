from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Question, Answer, Tag

User = get_user_model()

class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError("Email not registered. Please register first.")
        return value.strip()

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)

class RegisterUserSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

class QuestionSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    answer_count = serializers.SerializerMethodField()
    tags = serializers.StringRelatedField(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50), write_only=True
    )

    class Meta:
        model = Question
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author', 'tags', 'tag_names', 'author_name', 'answer_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'author', 'author_name', 'answer_count']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip()

    def get_answer_count(self, obj):
        return obj.answers.count()

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names')
        question = Question.objects.create(**validated_data)
        for tag_name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            question.tags.add(tag)
        return question

class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['id', 'content', 'created_at', 'updated_at', 'author', 'question', 'author_name']
        read_only_fields = ['id', 'created_at', 'updated_at', 'author', 'author_name']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip()