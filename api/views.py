import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile, SchoolClass, Quiz, Submission, AppConfig
from .seed import seed_database

# Ensure database is seeded with initial data
try:
    seed_database()
except Exception as e:
    print("Database seeding deferred (tables may not exist yet):", e)

@csrf_exempt
def auth_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')
    role = data.get('role', 'student')
    
    if not username or not password or not email or not name:
        return JsonResponse({'error': 'Missing required fields'}, status=400)
        
    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already exists'}, status=400)
        
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already exists'}, status=400)
        
    user = User.objects.create_user(username=username, email=email, password=password, first_name=name)
    avatar = data.get('avatar', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200')
    
    profile = UserProfile.objects.create(
        user=user,
        role=role,
        avatar=avatar,
        xp=1250 if role == 'student' else 0,
        streak=4 if role == 'student' else 0,
        streak_freeze_count=2 if role == 'student' else 0,
        badges=['explorer'] if role == 'student' else []
    )
    
    return JsonResponse({
        'status': 'success',
        'user': {
            'id': f"u-{profile.id}",
            'username': user.username,
            'email': user.email,
            'name': user.first_name,
            'role': profile.role,
            'xp': profile.xp,
            'streak': profile.streak,
            'streakFreezeCount': profile.streak_freeze_count,
            'streakFreezeActive': profile.streak_freeze_active,
            'avatar': profile.avatar,
            'badges': profile.badges,
            'dailyMissionProgress': profile.daily_mission_progress,
            'dailyMissionCompleted': profile.daily_mission_completed,
            'dailyMissionClaimed': profile.daily_mission_claimed
        }
    })

@csrf_exempt
def auth_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return JsonResponse({'error': 'Missing credentials'}, status=400)
        
    user = authenticate(username=username, password=password)
    
    if user is not None:
        profile = getattr(user, 'profile', None)
        if not profile:
            # Fallback if profile doesn't exist
            profile = UserProfile.objects.create(user=user, role='student')
            
        return JsonResponse({
            'status': 'success',
            'user': {
                'id': f"u-{profile.id}",
                'username': user.username,
                'email': user.email,
                'name': user.first_name,
                'role': profile.role,
                'xp': profile.xp,
                'streak': profile.streak,
                'streakFreezeCount': profile.streak_freeze_count,
                'streakFreezeActive': profile.streak_freeze_active,
                'avatar': profile.avatar,
                'badges': profile.badges,
                'dailyMissionProgress': profile.daily_mission_progress,
                'dailyMissionCompleted': profile.daily_mission_completed,
                'dailyMissionClaimed': profile.daily_mission_claimed
            }
        })
    else:
        return JsonResponse({'error': 'Invalid username or password'}, status=401)

def get_dashboard_data(request):
    username = request.GET.get('username')
    
    # 1. Fetch user profile
    profile_data = None
    if username:
        try:
            user = User.objects.get(username=username)
            profile = user.profile
            profile_data = {
                'id': f"u-{profile.id}",
                'username': user.username,
                'email': user.email,
                'name': user.first_name,
                'role': profile.role,
                'xp': profile.xp,
                'streak': profile.streak,
                'streakFreezeCount': profile.streak_freeze_count,
                'streakFreezeActive': profile.streak_freeze_active,
                'avatar': profile.avatar,
                'badges': profile.badges,
                'dailyMissionProgress': profile.daily_mission_progress,
                'dailyMissionCompleted': profile.daily_mission_completed,
                'dailyMissionClaimed': profile.daily_mission_claimed
            }
        except User.DoesNotExist:
            pass

    # 2. Classes
    classes_list = list(SchoolClass.objects.all().values())
    for cl in classes_list:
        cl['id'] = f"c-{cl['id']}" # map id key to string format
        # rename keys to camelCase
        cl['instructorAvatar'] = cl.pop('instructor_avatar')
        cl['progressPercent'] = cl.pop('progress_percent')
        cl['studentsCount'] = cl.pop('students_count')
        cl['newActivitiesCount'] = cl.pop('new_activities_count')
        cl['imageUrl'] = cl.pop('image_url')
        cl['roomName'] = cl.pop('room_name')

    # 3. Quizzes
    quizzes_list = list(Quiz.objects.all().values())
    for qz in quizzes_list:
        qz['id'] = f"q-{qz['id']}"
        qz['className'] = qz.pop('class_name')
        qz['xpReward'] = qz.pop('xp_reward')
        qz['dueDate'] = qz.pop('due_date')
        qz['totalQuestions'] = qz.pop('total_questions')

    # 4. Submissions
    submissions_list = list(Submission.objects.all().values())
    for sub in submissions_list:
        sub['id'] = f"s-{sub['id']}"
        sub['studentName'] = sub.pop('student_name')
        sub['studentInitials'] = sub.pop('student_initials')
        sub['studentAvatar'] = sub.pop('student_avatar')
        sub['quizTitle'] = sub.pop('quiz_title')
        sub['submittedTime'] = sub.pop('submitted_time')

    # 5. Dynamic Leaderboard
    students = UserProfile.objects.filter(role='student').select_related('user')
    leaderboard = []
    for idx, s in enumerate(sorted(students, key=lambda x: x.xp, reverse=True)):
        name_str = s.user.first_name
        if username and s.user.username == username:
            name_str += " (You)"
            
        title = "Math Ninja"
        if s.xp >= 5000:
            title = "XP Legend"
        elif s.xp >= 3000:
            title = "Quiz King"
        elif s.xp >= 1500:
            title = "Science Wizard"

        leaderboard.append({
            'rank': idx + 1,
            'name': name_str,
            'title': title,
            'xp': s.xp,
            'rankDelta': 0,  # neutral delta
            'avatar': s.avatar
        })

    # 6. Admin Users List
    users_list = []
    for usr in User.objects.all():
        profile = getattr(usr, 'profile', None)
        if profile:
            user_data = {
                'id': f"usr-{usr.id}",
                'name': usr.first_name,
                'email': usr.email,
                'role': profile.role,
                'avatar': profile.avatar
            }
            if profile.role == 'student':
                user_data['year'] = 'Year 11'
            elif profile.role == 'instructor':
                user_data['subject'] = 'Mathematics'
            users_list.append(user_data)

    # 7. Config
    config_obj = AppConfig.objects.first()
    if not config_obj:
        config_obj = AppConfig.objects.create()
        
    config_data = {
        'xpMultiplier': config_obj.xp_multiplier,
        'xpDecayRate': config_obj.xp_decay_rate,
        'eventMultiplier': config_obj.event_multiplier,
        'milestones': {
            'explorer': config_obj.explorer_milestone,
            'champion': config_obj.champion_milestone,
            'legend': config_obj.legend_milestone
        }
    }

    return JsonResponse({
        'profile': profile_data,
        'classes': classes_list,
        'quizzes': quizzes_list,
        'submissions': submissions_list,
        'leaderboard': leaderboard,
        'simulatedUsers': users_list,
        'config': config_data
    })

@csrf_exempt
def update_profile(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    username = data.get('username')
    if not username:
        return JsonResponse({'error': 'Missing username'}, status=400)
        
    try:
        user = User.objects.get(username=username)
        profile = user.profile
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
        
    # Update fields if sent
    if 'xp' in data:
        profile.xp = data['xp']
    if 'streak' in data:
        profile.streak = data['streak']
    if 'streakFreezeCount' in data:
        profile.streak_freeze_count = data['streakFreezeCount']
    if 'streakFreezeActive' in data:
        profile.streak_freeze_active = data['streakFreezeActive']
    if 'badges' in data:
        profile.badges = data['badges']
    if 'dailyMissionProgress' in data:
        profile.daily_mission_progress = data['dailyMissionProgress']
    if 'dailyMissionCompleted' in data:
        profile.daily_mission_completed = data['dailyMissionCompleted']
    if 'dailyMissionClaimed' in data:
        profile.daily_mission_claimed = data['dailyMissionClaimed']
        
    profile.save()
    return JsonResponse({'status': 'success'})

@csrf_exempt
def complete_quiz(request, quiz_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    # Remove standard prefix if present
    pk = quiz_id.replace('q-', '')
    try:
        quiz = Quiz.objects.get(id=pk)
        quiz.completed = True
        quiz.due_date = 'Completed'
        quiz.save()
        return JsonResponse({'status': 'success'})
    except Quiz.DoesNotExist:
        return JsonResponse({'error': 'Quiz not found'}, status=404)

@csrf_exempt
def create_quiz(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    title = data.get('title')
    class_name = data.get('className')
    xp_reward = data.get('xpReward', 100)
    due_date = data.get('dueDate', 'Due: Next Week')
    questions = data.get('questions', [])
    
    if not title or not class_name:
        return JsonResponse({'error': 'Missing title or className'}, status=400)
        
    quiz = Quiz.objects.create(
        title=title,
        class_name=class_name,
        xp_reward=xp_reward,
        due_date=due_date,
        total_questions=len(questions),
        completed=False,
        questions=questions
    )
    
    return JsonResponse({
        'status': 'success',
        'quiz': {
            'id': f"q-{quiz.id}",
            'title': quiz.title,
            'className': quiz.class_name,
            'xpReward': quiz.xp_reward,
            'dueDate': quiz.due_date,
            'totalQuestions': quiz.total_questions,
            'completed': quiz.completed,
            'questions': quiz.questions
        }
    })

@csrf_exempt
def create_class(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    name = data.get('name')
    instructor = data.get('instructor')
    instructor_avatar = data.get('instructorAvatar', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=155&h=155')
    image_url = data.get('imageUrl', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400&h=200')
    room_name = data.get('roomName', 'Section A • Room 101')
    
    if not name or not instructor:
        return JsonResponse({'error': 'Missing name or instructor'}, status=400)
        
    cl = SchoolClass.objects.create(
        name=name,
        instructor=instructor,
        instructor_avatar=instructor_avatar,
        progress_percent=0,
        students_count=1,
        new_activities_count=0,
        image_url=image_url,
        room_name=room_name
    )
    
    return JsonResponse({
        'status': 'success',
        'class': {
            'id': f"c-{cl.id}",
            'name': cl.name,
            'instructor': cl.instructor,
            'instructorAvatar': cl.instructor_avatar,
            'progressPercent': cl.progress_percent,
            'studentsCount': cl.students_count,
            'newActivitiesCount': cl.new_activities_count,
            'imageUrl': cl.image_url,
            'roomName': cl.room_name
        }
    })

@csrf_exempt
def grade_submission(request, submission_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    grade = data.get('grade')
    if not grade:
        return JsonResponse({'error': 'Missing grade'}, status=400)
        
    pk = submission_id.replace('s-', '')
    try:
        sub = Submission.objects.get(id=pk)
        sub.status = 'DONE'
        sub.grade = grade
        sub.submitted_time = f"Graded ({grade})"
        sub.save()
        return JsonResponse({'status': 'success'})
    except Submission.DoesNotExist:
        return JsonResponse({'error': 'Submission not found'}, status=404)

@csrf_exempt
def update_config(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    config = AppConfig.objects.first()
    if not config:
        config = AppConfig.objects.create()
        
    if 'xpMultiplier' in data:
        config.xp_multiplier = data['xpMultiplier']
    if 'xpDecayRate' in data:
        config.xp_decay_rate = data['xpDecayRate']
    if 'eventMultiplier' in data:
        config.event_multiplier = data['eventMultiplier']
    if 'milestones' in data:
        milestones = data['milestones']
        if 'explorer' in milestones:
            config.explorer_milestone = milestones['explorer']
        if 'champion' in milestones:
            config.champion_milestone = milestones['champion']
        if 'legend' in milestones:
            config.legend_milestone = milestones['legend']
            
    config.save()
    return JsonResponse({'status': 'success'})

@csrf_exempt
def delete_user(request, user_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    pk = user_id.replace('usr-', '')
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return JsonResponse({'status': 'success'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
