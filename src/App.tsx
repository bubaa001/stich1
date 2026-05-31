import { useState, useEffect } from 'react';
import { UserRole, UserProfile, Quiz, ClassProgress, Submission, LeaderboardEntry, ConfigSettings } from './types';
import { INITIAL_USER, INITIAL_CLASSES, INITIAL_QUIZZES, INITIAL_SUBMISSIONS, INITIAL_LEADERBOARD, INITIAL_USER_ACCOUNTS, INITIAL_CONFIG } from './mockData';
import { RoleSwitcher } from './components/RoleSwitcher';
import { LoginView } from './components/LoginView';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentClassView } from './components/StudentClassView';
import { StudentQuizPlay } from './components/StudentQuizPlay';
import { InstructorDashboard } from './components/InstructorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AIConsultant } from './components/AIConsultant';
import { School, User, GraduationCap, Trophy, LogOut, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('aris_role') as UserRole) || 'student';
  });

  const [studentProfile, setStudentProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('aris_student_profile');
    return cached ? JSON.parse(cached) : INITIAL_USER;
  });

  const [classes, setClasses] = useState<ClassProgress[]>(() => {
    const cached = localStorage.getItem('aris_classes');
    return cached ? JSON.parse(cached) : INITIAL_CLASSES;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const cached = localStorage.getItem('aris_quizzes');
    return cached ? JSON.parse(cached) : INITIAL_QUIZZES;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const cached = localStorage.getItem('aris_submissions');
    return cached ? JSON.parse(cached) : INITIAL_SUBMISSIONS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const cached = localStorage.getItem('aris_leaderboard');
    return cached ? JSON.parse(cached) : INITIAL_LEADERBOARD;
  });

  const [simulatedUsers, setSimulatedUsers] = useState(() => {
    const cached = localStorage.getItem('aris_simulated_users');
    return cached ? JSON.parse(cached) : INITIAL_USER_ACCOUNTS;
  });

  const [config, setConfig] = useState<ConfigSettings>(() => {
    const cached = localStorage.getItem('aris_config');
    return cached ? JSON.parse(cached) : INITIAL_CONFIG;
  });

  // UI status views and active tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'rankings' | 'profile'>('dashboard');
  const [activePlayQuizId, setActivePlayQuizId] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');

  // Synchronize localStorage on states update mutation
  useEffect(() => {
    localStorage.setItem('aris_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('aris_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('aris_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('aris_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('aris_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('aris_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('aris_simulated_users', JSON.stringify(simulatedUsers));
  }, [simulatedUsers]);

  useEffect(() => {
    localStorage.setItem('aris_config', JSON.stringify(config));
  }, [config]);

  // --- Handlers & Mutators ---

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setActivePlayQuizId(null);
  };

  const handleLoginSuccess = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    setRole('anonymous');
  };

  // Student awards progression
  const rewardXpToStudent = (xpReward: number) => {
    // Apply double XP active multiplier formulas
    const finalXp = Math.round(xpReward * config.xpMultiplier);
    
    setStudentProfile((prev) => {
      const updatedXp = prev.xp + finalXp;
      return {
        ...prev,
        xp: updatedXp
      };
    });

    // Update students entry inside leaderboard state
    setLeaderboard((prev) => 
      prev.map((player) => {
        if (player.name.includes('(You)')) {
          return {
            ...player,
            xp: player.xp + finalXp
          };
        }
        return player;
      })
    );
  };

  const handleStartQuizSelection = (quizId: string) => {
    setActivePlayQuizId(quizId);
  };

  const handleCloseQuizSubmission = () => {
    // Flag respective quiz completed
    if (activePlayQuizId) {
      setQuizzes((prev) => 
        prev.map((qz) => {
          if (qz.id === activePlayQuizId) {
            return {
              ...qz,
              completed: true,
              dueDate: 'Completed'
            };
          }
          return qz;
        })
      );
    }
    setActivePlayQuizId(null);
  };

  const openAiTutorWithPrompt = (promptText: string) => {
    setAiInitialPrompt(promptText);
    setIsAiOpen(true);
  };

  // Instructor creators handlers
  const handleAddNewPublishedQuiz = (qz: Quiz) => {
    setQuizzes((prev) => [qz, ...prev]);
  };

  const handleAddNewPublishedClass = (cl: ClassProgress) => {
    setClasses((prev) => [cl, ...prev]);
  };

  const handleGradeSubmission = (subId: string, grade: string) => {
    setSubmissions((prev) => 
      prev.map((sub) => {
        if (sub.id === subId) {
          return {
            ...sub,
            status: 'DONE',
            submittedTime: `Graded (${grade})`,
            grade
          };
        }
        return sub;
      })
    );
  };

  // Admin metrics managers handlers
  const handleDeleteSimulatedUser = (userId: string) => {
    setSimulatedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleUpdateConfigFromSettings = (newConfig: ConfigSettings) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans select-none antialiased selection:bg-indigo-600/10 pb-24 md:pb-12">
      
      {/* Global double-XP event banner notification */}
      {config.xpMultiplier > 1.0 && (
        <div className="bg-gradient-to-r from-violet-600 via-indigo-650 to-indigo-600 text-white py-2 px-4 shadow-sm relative z-50 text-center text-xs font-bold leading-none animate-bounce">
          🔥 ACTIVE ACADEMIC DOUBLE XP SURGE IS LIVE IN THE PORTAL! ALL QUIZZES REWARD 2X VALUE!
        </div>
      )}

      {role === 'anonymous' ? (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Main Layout Header navigation */}
          <header className="bg-white border-b border-slate-200/60 sticky top-0 z-45 h-16 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
                <School className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg text-indigo-950 tracking-tight">aris4.0</span>
              <span className="hidden sm:inline bg-slate-100 text-slate-500 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-slate-200">
                {role} mode
              </span>
            </div>

            {/* Right session header profiles */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-sans font-bold text-slate-800 text-xs">{studentProfile.name}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{studentProfile.email}</p>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          <main className="flex-grow p-4 md:p-8">
            {/* Active playable student Math Quiz resolver viewport */}
            {activePlayQuizId ? (
              <StudentQuizPlay
                quiz={quizzes.find((q) => q.id === activePlayQuizId) || quizzes[0]}
                user={studentProfile}
                onUpdateXp={rewardXpToStudent}
                onCloseQuiz={handleCloseQuizSubmission}
              />
            ) : (
              <>
                {/* Switch context views in Student container */}
                {role === 'student' && (
                  <>
                    {activeTab === 'dashboard' && (
                      <StudentDashboard
                        user={studentProfile}
                        quizzes={quizzes}
                        classes={classes}
                        leaderboard={leaderboard}
                        onSelectMathQuiz={() => setActiveTab('classes')}
                        onOpenEssayDetails={(msg) => openAiTutorWithPrompt(msg)}
                      />
                    )}

                    {activeTab === 'classes' && (
                      <StudentClassView
                        cls={classes[0]}
                        quizzes={quizzes}
                        leaderboard={leaderboard}
                        onStartQuiz={handleStartQuizSelection}
                        onOpenConsultant={() => openAiTutorWithPrompt("Tell me the factoring trick for quadratic equations, Professor.")}
                      />
                    )}

                    {activeTab === 'rankings' && (
                      <div className="max-w-xl mx-auto space-y-4 text-left animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-6 h-6 text-amber-500 fill-amber-50" />
                          <h2 className="font-display font-bold text-xl text-slate-900">Weekly Standings</h2>
                        </div>
                        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF]">
                          <div className="divide-y divide-slate-105">
                            {leaderboard.map((usr, index) => (
                              <div key={usr.name} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <span className="font-sans font-bold text-[#64748B] w-6">{index + 1}</span>
                                  <img src={usr.avatar} alt={usr.name} className="w-9 h-9 rounded-full object-cover" />
                                  <div>
                                    <p className="font-sans font-bold text-slate-800 text-xs">{usr.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{usr.title}</p>
                                  </div>
                                </div>
                                <span className="font-sans font-extrabold text-xs text-indigo-600">{usr.xp.toLocaleString()} XP</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'profile' && (
                      <div className="max-w-md mx-auto space-y-6 text-left animate-fade-in">
                        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] text-center space-y-4">
                          <img 
                            src={studentProfile.avatar} 
                            alt={studentProfile.name} 
                            className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-indigo-50 border border-white"
                          />
                          <div>
                            <h3 className="font-display font-bold text-lg text-slate-900">{studentProfile.name}</h3>
                            <p className="font-sans text-xs text-slate-500">Student Account ID: @{studentProfile.username}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Level XP</p>
                              <p className="font-sans font-bold text-lg text-indigo-650 mt-0.5">{studentProfile.xp} XP</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Work Streak</p>
                              <p className="font-sans font-bold text-lg text-emerald-650 mt-0.5">{studentProfile.streak} Days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Switch context views in Instructor view */}
                {role === 'instructor' && (
                  <InstructorDashboard
                    user={studentProfile}
                    quizzes={quizzes}
                    classes={classes}
                    submissions={submissions}
                    onAddNewQuiz={handleAddNewPublishedQuiz}
                    onAddNewClass={handleAddNewPublishedClass}
                    onGradeStudent={handleGradeSubmission}
                  />
                )}

                {role === 'admin' && (
                  <AdminDashboard
                    user={studentProfile}
                    simulatedUsers={simulatedUsers}
                    config={config}
                    onDeleteSimulatedUser={handleDeleteSimulatedUser}
                    onUpdateConfig={handleUpdateConfigFromSettings}
                  />
                )}
              </>
            )}
          </main>

          {/* Student Screen Sticky Bottom Navigation bar */}
          {role === 'student' && !activePlayQuizId && (
            <div className="fixed bottom-0 left-0 w-full z-45 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-2 flex items-center justify-around shadow-lg">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: School },
                { id: 'classes', label: 'Classes', icon: GraduationCap },
                { id: 'rankings', label: 'Rankings', icon: Trophy },
                { id: 'profile', label: 'Profile', icon: User }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                      isSelected ? 'text-indigo-650 bg-indigo-50/50 scale-105 font-bold' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-[10px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Floating Action Button to toggle virtual AI tutor helper */}
          {!activePlayQuizId && (
            <button
              onClick={() => setIsAiOpen(true)}
              className="fixed bottom-20 md:bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-600/30 hover:bg-indigo-750 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
              title="Assistant"
            >
              <MessageCircle className="w-5 h-5 fill-white text-white" />
            </button>
          )}

          {/* Floating AI Consultant side drawer panel */}
          {isAiOpen && (
            <AIConsultant
              onClose={() => {
                setIsAiOpen(false);
                setAiInitialPrompt('');
              }}
              initialMessage={aiInitialPrompt}
            />
          )}
        </>
      )}

      {/* Floating simulator control switcher widgets */}
      <RoleSwitcher currentRole={role} onRoleChange={handleRoleChange} />

    </div>
  );
}
