from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    votes = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag, related_name='questions')

    def __str__(self):
        return self.title

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer to {self.question.title}"

class BlacklistedToken(models.Model):
    token = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Blacklisted token: {self.token}"
