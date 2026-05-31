import { UserProfile, Quiz, ClassProgress, Submission, LeaderboardEntry, ConfigSettings } from './types';

export const INITIAL_USER: UserProfile = {
  id: 'u-1',
  name: 'Alex Rivera',
  username: 'alex_stone',
  email: 'alex.rivera@school.edu',
  role: 'student',
  xp: 1250,
  streak: 4,
  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200'
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Sarah Jenkins',
    title: 'Quiz King',
    xp: 8450,
    rankDelta: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    rank: 2,
    name: 'Alex Rivera (You)',
    title: 'Math Ninja',
    xp: 1250,
    rankDelta: 0,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    rank: 3,
    name: 'Mike Thompson',
    title: 'Science Wizard',
    xp: 1520,
    rankDelta: -1,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    rank: 4,
    name: 'Emma Watson',
    title: 'English Scholar',
    xp: 1490,
    rankDelta: 3,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

export const INITIAL_USER_ACCOUNTS = [
  { id: 'usr-1', name: 'Julian Dasher', email: 'julian.d@school.edu', role: 'student', year: 'Year 11', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'usr-2', name: 'Mia Stone', email: 'm.stone@academy.com', role: 'instructor', subject: 'Mathematics', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'usr-3', name: 'Ray Kinsley', email: 'ray.kinsley@learner.org', role: 'student', year: 'Year 10', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'usr-4', name: 'Sarah Miller', email: 's.miller@school.edu', role: 'student', year: 'Year 11', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'usr-5', name: 'James Doe', email: 'j.doe@school.edu', role: 'student', year: 'Year 12', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150' }
];

export const INITIAL_CLASSES: ClassProgress[] = [
  {
    id: 'c-1',
    name: 'Mathematics Form 4',
    instructor: 'Mr. Smith',
    instructorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=155&h=155',
    progressPercent: 85,
    studentsCount: 32,
    newActivitiesCount: 4,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg1_30GWzScvi3_dyjgW2qsAxSzIpwkhxjEypXOBxspKKZXKNmsETZkyBPoHqGUY3OLhpJM8nhfQp_OcgxUAdPRXs_Iz3DF3R8AB4pDFXfzMC-FXpgxcCxPENyCXWYme6qfVn2ILZq_fVv5-V1F_Fn6a4N930UYV3YWEBcWdjtcdsKiqzRs083LJp6y1j-qnL_Xd5sqsD-xTjgED9XgjnQ1Msxl8BU3RZa8vL0jHT6emcJj5mvyybIN29TgnDUZDjZWswT5sq5zgM',
    roomName: 'Section A • Room 402'
  },
  {
    id: 'c-2',
    name: 'Advanced Physics (S4-A)',
    instructor: 'Prof. Christopher',
    instructorAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150&h=150',
    progressPercent: 65,
    studentsCount: 32,
    newActivitiesCount: 4,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400&h=200',
    roomName: 'Section A • Room 402'
  },
  {
    id: 'c-3',
    name: 'Intro to Quantum Computing',
    instructor: 'Dr. Aris',
    instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
    progressPercent: 20,
    studentsCount: 28,
    newActivitiesCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400&h=200',
    roomName: 'Section B • Online'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q-1',
    title: 'Quadratic Equations',
    className: 'Mathematics Form 4',
    xpReward: 450,
    dueDate: 'Due: Oct 24',
    totalQuestions: 10,
    completed: false,
    questions: [
      {
        id: 'q1-1',
        category: 'LINEAR EQUATIONS',
        text: 'Solve for x:',
        expression: '2x + 5 = 15',
        options: ['x = 2', 'x = 5', 'x = 10', 'x = 15'],
        correctAnswerIndex: 1
      },
      {
        id: 'q1-2',
        category: 'QUADRATIC EQUATIONS',
        text: 'Find the positive root of:',
        expression: 'x² - 9 = 0',
        options: ['x = 1', 'x = 3', 'x = 9', 'x = 4'],
        correctAnswerIndex: 1
      },
      {
        id: 'q1-3',
        category: 'EXPONENTS',
        text: 'Evaluate:',
        expression: '3^x = 27',
        options: ['x = 2', 'x = 3', 'x = 4', 'x = 9'],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'q-2',
    title: 'Trigonometric Functions',
    className: 'Mathematics Form 4',
    xpReward: 300,
    dueDate: 'Completed',
    totalQuestions: 8,
    completed: true,
    score: 100
  },
  {
    id: 'q-3',
    title: 'Linear Inequalities',
    className: 'Mathematics Form 4',
    xpReward: 500,
    dueDate: 'Due: Tomorrow',
    totalQuestions: 5,
    completed: false,
    questions: [
      {
        id: 'q3-1',
        category: 'INEQUALITIES',
        text: 'Solve the inequality:',
        expression: '3x - 4 < 8',
        options: ['x < 4', 'x < 3', 'x < 2', 'x > 4'],
        correctAnswerIndex: 0
      },
      {
        id: 'q3-2',
        category: 'INEQUALITIES',
        text: 'Which integer satisfies:',
        expression: '5 < 2x - 1 < 10',
        options: ['x = 2', 'x = 3', 'x = 4', 'x = 6'],
        correctAnswerIndex: 2
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 's-1',
    studentName: 'Sarah Miller',
    studentInitials: 'SM',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
    quizTitle: 'Mid-Term Algebra Quiz',
    submittedTime: 'Submitted 2h ago',
    status: 'READY'
  },
  {
    id: 's-2',
    studentName: 'James Doe',
    studentInitials: 'JD',
    studentAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
    quizTitle: 'Mid-Term Algebra Quiz',
    submittedTime: 'Submitted 5h ago',
    status: 'LATE'
  },
  {
    id: 's-3',
    studentName: 'Kevin Lee',
    studentInitials: 'KL',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    quizTitle: 'Mid-Term Algebra Quiz',
    submittedTime: 'Graded (95/100)',
    status: 'DONE',
    grade: '95/100'
  }
];

export const INITIAL_CONFIG: ConfigSettings = {
  xpMultiplier: 1.0,
  xpDecayRate: 0.0,
  eventMultiplier: 1.5,
  milestones: {
    explorer: 1000,
    champion: 3000,
    legend: 5000
  }
};
