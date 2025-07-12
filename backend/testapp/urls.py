from django.urls import path
from .views import (
    SendOTPView,
    VerifyOTPView,
    RegisterUserView,
    LogoutView,
    QuestionListView,
    QuestionDetailView,
    AnswerCreateView
)

urlpatterns = [
    path('send-otp/', SendOTPView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/<int:question_id>/', QuestionDetailView.as_view(), name='question-detail'),
    path('answers/', AnswerCreateView.as_view(), name='answer-create'),
]
