from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, default='student')
    xp = models.IntegerField(default=1250)
    streak = models.IntegerField(default=4)
    streak_freeze_count = models.IntegerField(default=2)
    streak_freeze_active = models.BooleanField(default=False)
    avatar = models.CharField(max_length=500, default='https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200')
    badges = models.JSONField(default=list)  # list of badges, e.g. ["explorer"]
    daily_mission_progress = models.IntegerField(default=2)
    daily_mission_completed = models.BooleanField(default=False)
    daily_mission_claimed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class SchoolClass(models.Model):
    name = models.CharField(max_length=200)
    instructor = models.CharField(max_length=200)
    instructor_avatar = models.CharField(max_length=500)
    progress_percent = models.IntegerField(default=0)
    students_count = models.IntegerField(default=0)
    new_activities_count = models.IntegerField(default=0)
    image_url = models.CharField(max_length=500)
    room_name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    class_name = models.CharField(max_length=200)
    xp_reward = models.IntegerField(default=100)
    due_date = models.CharField(max_length=100)
    total_questions = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    questions = models.JSONField(default=list)  # Quiz questions payload

    def __str__(self):
        return self.title

class Submission(models.Model):
    student_name = models.CharField(max_length=200)
    student_initials = models.CharField(max_length=20)
    student_avatar = models.CharField(max_length=500, blank=True, null=True)
    quiz_title = models.CharField(max_length=200)
    submitted_time = models.CharField(max_length=200)
    status = models.CharField(max_length=50, default='READY')
    grade = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.student_name} - {self.quiz_title}"

class AppConfig(models.Model):
    xp_multiplier = models.FloatField(default=1.0)
    xp_decay_rate = models.FloatField(default=0.0)
    event_multiplier = models.FloatField(default=1.5)
    explorer_milestone = models.IntegerField(default=1000)
    champion_milestone = models.IntegerField(default=3000)
    legend_milestone = models.IntegerField(default=5000)

    def __str__(self):
        return "App Settings"
