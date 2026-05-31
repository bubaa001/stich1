from django.contrib.auth.models import User
from .models import UserProfile, SchoolClass, Quiz, Submission, AppConfig

def seed_database():
    # 1. Seed Config if not exists
    if not AppConfig.objects.exists():
        AppConfig.objects.create(
            xp_multiplier=1.0,
            xp_decay_rate=0.0,
            event_multiplier=1.5,
            explorer_milestone=1000,
            champion_milestone=3000,
            legend_milestone=5000
        )

    # 2. Seed Classes if not exists
    if not SchoolClass.objects.exists():
        SchoolClass.objects.create(
            name='Mathematics Form 4',
            instructor='Mr. Smith',
            instructor_avatar='https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=155&h=155',
            progress_percent=85,
            students_count=32,
            new_activities_count=4,
            image_url='https://lh3.googleusercontent.com/aida-public/AB6AXuDg1_30GWzScvi3_dyjgW2qsAxSzIpwkhxjEypXOBxspKKZXKNmsETZkyBPoHqGUY3OLhpJM8nhfQp_OcgxUAdPRXs_Iz3DF3R8AB4pDFXfzMC-FXpgxcCxPENyCXWYme6qfVn2ILZq_fVv5-V1F_Fn6a4N930UYV3YWEBcWdjtcdsKiqzRs083LJp6y1j-qnL_Xd5sqsD-xTjgED9XgjnQ1Msxl8BU3RZa8vL0jHT6emcJj5mvyybIN29TgnDUZDjZWswT5sq5zgM',
            room_name='Section A • Room 402'
        )
        SchoolClass.objects.create(
            name='Advanced Physics (S4-A)',
            instructor='Prof. Christopher',
            instructor_avatar='https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150&h=150',
            progress_percent=65,
            students_count=32,
            new_activities_count=4,
            image_url='https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400&h=200',
            room_name='Section A • Room 402'
        )
        SchoolClass.objects.create(
            name='Intro to Quantum Computing',
            instructor='Dr. Aris',
            instructor_avatar='https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
            progress_percent=20,
            students_count=28,
            new_activities_count=8,
            image_url='https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400&h=200',
            room_name='Section B • Online'
        )

    # 3. Seed Quizzes if not exists
    if not Quiz.objects.exists():
        Quiz.objects.create(
            title='Quadratic Equations',
            class_name='Mathematics Form 4',
            xp_reward=450,
            due_date='Due: Oct 24',
            total_questions=3,
            completed=False,
            questions=[
                {
                    'id': 'q1-1',
                    'category': 'LINEAR EQUATIONS',
                    'text': 'Solve for x:',
                    'expression': '2x + 5 = 15',
                    'options': ['x = 2', 'x = 5', 'x = 10', 'x = 15'],
                    'correctAnswerIndex': 1
                },
                {
                    'id': 'q1-2',
                    'category': 'QUADRATIC EQUATIONS',
                    'text': 'Find the positive root of:',
                    'expression': 'x² - 9 = 0',
                    'options': ['x = 1', 'x = 3', 'x = 9', 'x = 4'],
                    'correctAnswerIndex': 1
                },
                {
                    'id': 'q1-3',
                    'category': 'EXPONENTS',
                    'text': 'Evaluate:',
                    'expression': '3^x = 27',
                    'options': ['x = 2', 'x = 3', 'x = 4', 'x = 9'],
                    'correctAnswerIndex': 1
                }
            ]
        )
        Quiz.objects.create(
            title='Trigonometric Functions',
            class_name='Mathematics Form 4',
            xp_reward=300,
            due_date='Completed',
            total_questions=8,
            completed=True,
            questions=[]
        )
        Quiz.objects.create(
            title='Linear Inequalities',
            class_name='Mathematics Form 4',
            xp_reward=500,
            due_date='Due: Tomorrow',
            total_questions=2,
            completed=False,
            questions=[
                {
                    'id': 'q3-1',
                    'category': 'INEQUALITIES',
                    'text': 'Solve the inequality:',
                    'expression': '3x - 4 < 8',
                    'options': ['x < 4', 'x < 3', 'x < 2', 'x > 4'],
                    'correctAnswerIndex': 0
                },
                {
                    'id': 'q3-2',
                    'category': 'INEQUALITIES',
                    'text': 'Which integer satisfies:',
                    'expression': '5 < 2x - 1 < 10',
                    'options': ['x = 2', 'x = 3', 'x = 4', 'x = 6'],
                    'correctAnswerIndex': 2
                }
            ]
        )

    # 4. Seed Submissions if not exists
    if not Submission.objects.exists():
        Submission.objects.create(
            student_name='Sarah Miller',
            student_initials='SM',
            student_avatar='https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
            quiz_title='Mid-Term Algebra Quiz',
            submitted_time='Submitted 2h ago',
            status='READY'
        )
        Submission.objects.create(
            student_name='James Doe',
            student_initials='JD',
            student_avatar='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
            quiz_title='Mid-Term Algebra Quiz',
            submitted_time='Submitted 5h ago',
            status='LATE'
        )
        Submission.objects.create(
            student_name='Kevin Lee',
            student_initials='KL',
            student_avatar='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
            quiz_title='Mid-Term Algebra Quiz',
            submitted_time='Graded (95/100)',
            status='DONE',
            grade='95/100'
        )

    # 5. Seed simulated users/students in Django DB
    students_to_seed = [
        ('sarah_j', 'sarah.j@school.edu', 'Sarah Jenkins', 'Quiz King', 8450, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'),
        ('mike_t', 'mike.t@school.edu', 'Mike Thompson', 'Science Wizard', 1520, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'),
        ('emma_w', 'emma.w@school.edu', 'Emma Watson', 'English Scholar', 1490, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'),
        ('julian_d', 'julian.d@school.edu', 'Julian Dasher', 'Student', 950, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'),
        ('sarah_m', 's.miller@school.edu', 'Sarah Miller', 'Student', 1100, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'),
        ('james_d', 'j.doe@school.edu', 'James Doe', 'Student', 800, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150'),
        ('ray_k', 'ray.kinsley@learner.org', 'Ray Kinsley', 'Student', 500, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150'),
    ]

    for username, email, name, title, xp, avatar in students_to_seed:
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, email=email, password='password123', first_name=name)
            UserProfile.objects.create(
                user=user,
                role='student' if 'instructor' not in username else 'instructor',
                xp=xp,
                streak=random_streak(),
                streak_freeze_count=1,
                streak_freeze_active=False,
                avatar=avatar,
                badges=['explorer'] if xp >= 1000 else []
            )

    # Seed an instructor too
    if not User.objects.filter(username='mia_stone').exists():
        user = User.objects.create_user(username='mia_stone', email='m.stone@academy.com', password='password123', first_name='Mia Stone')
        UserProfile.objects.create(
            user=user,
            role='instructor',
            xp=0,
            streak=0,
            avatar='https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150'
        )

def random_streak():
    import random
    return random.randint(1, 10)
