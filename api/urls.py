from django.urls import path
from . import views

urlpatterns = [
    path('auth/register', views.auth_register, name='auth_register'),
    path('auth/login', views.auth_login, name='auth_login'),
    path('dashboard/data', views.get_dashboard_data, name='get_dashboard_data'),
    path('profile/update', views.update_profile, name='update_profile'),
    path('quizzes/<str:quiz_id>/complete', views.complete_quiz, name='complete_quiz'),
    path('quizzes/create', views.create_quiz, name='create_quiz'),
    path('classes/create', views.create_class, name='create_class'),
    path('submissions/<str:submission_id>/grade', views.grade_submission, name='grade_submission'),
    path('config/update', views.update_config, name='update_config'),
    path('users/delete/<str:user_id>', views.delete_user, name='delete_user'),
]
