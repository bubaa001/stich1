import React, { useState } from 'react';
import { Quiz, ClassProgress, LeaderboardEntry } from '../types';
import { Sparkles, Calendar, BookOpen, Clock, Play, GraduationCap, ArrowRight, Lightbulb, MessageSquare, Database, CheckCircle } from 'lucide-react';

interface StudentClassViewProps {
  cls: ClassProgress;
  quizzes: Quiz[];
  leaderboard: LeaderboardEntry[];
  onStartQuiz: (quizId: string) => void;
  onOpenConsultant: () => void;
}

export const StudentClassView: React.FC<StudentClassViewProps> = ({
  cls,
  quizzes,
  leaderboard,
  onStartQuiz,
  onOpenConsultant
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'quizzes' | 'assignments' | 'leaderboard' | 'chat'>('quizzes');

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in text-left">
      
      {/* Interactive Chalkboard Hero Banner with Neon Glow Overlay */}
      <section className="relative rounded-3xl overflow-hidden h-52 flex flex-col justify-end p-8 group shadow-xl">
        <img 
          src={cls.imageUrl} 
          alt={cls.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10"></div>
        
        <div className="relative z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 border border-indigo-400 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest">
              Active Class
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight leading-tight mb-2">
            {cls.name}
          </h2>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-200">
            <div className="flex items-center gap-2">
              <img 
                src={cls.instructorAvatar} 
                alt={cls.instructor} 
                className="w-7 h-7 rounded-full border border-white/40 shadow-sm"
              />
              <span className="font-sans text-xs">Instructor: <span className="font-bold">{cls.instructor}</span></span>
            </div>
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full hidden md:inline"></span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span className="font-sans text-xs">24 Core Lessons</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation selectors */}
      <nav className="flex items-center overflow-x-auto no-scrollbar gap-2 py-1.5 border-b border-slate-200/60 sticky top-0 bg-white/95 backdrop-blur-md z-30">
        {[
          { id: 'library', label: 'Library', icon: BookOpen },
          { id: 'quizzes', label: 'Quizzes', icon: Clock },
          { id: 'assignments', label: 'Assignments', icon: Calendar },
          { id: 'leaderboard', label: 'Leaderboard', icon: Sparkles },
          { id: 'chat', label: 'Chat Pool', icon: MessageSquare }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap px-4 py-2.5 font-sans text-sm font-semibold flex items-center gap-2 transition-all relative ${
              activeTab === tab.id
                ? 'text-indigo-650'
                : 'text-slate-500 hover:text-indigo-550'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && <div className="active-tab-indicator"></div>}
          </button>
        ))}
      </nav>

      {/* Dynamic Tab Switcher Content Renderer */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {quizzes.map((quiz) => {
              const quizIcon = quiz.title.includes('Math') ? BookOpen : Sparkles;
              return (
                <div 
                  key={quiz.id} 
                  className={`bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] flex flex-col justify-between hover:shadow-lg transition-all group relative overflow-hidden ${
                    quiz.completed ? 'opacity-90' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      quiz.completed 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {quiz.completed ? <CheckCircle className="w-5 h-5" /> : <quizIcon className="w-5 h-5" />}
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      quiz.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-50 text-indigo-750'
                    }`}>
                      ⚡ {quiz.xpReward} XP
                    </span>
                  </div>

                  <div>
                    <h3 className="font-hans font-bold text-slate-900 text-[17px] leading-tight mb-2 tracking-tight group-hover:text-indigo-700 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-relaxed max-w-xs mb-6">
                      {quiz.title.includes('Quadratic') 
                        ? 'Master the art of solving second-degree expressions and graphing parabolas.'
                        : quiz.title.includes('Linear')
                        ? 'Learn to solve and shade regions on a Cartesian plane using linear inequalities.'
                        : 'Understanding sin, cos, and tan in right-angled triangles and unit circles.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${quiz.completed ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: quiz.completed ? '100%' : '30%' }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">{quiz.dueDate}</p>
                    </div>

                    {quiz.completed ? (
                      <span className="text-emerald-600 font-sans text-xs font-bold whitespace-nowrap">
                        100% Completed
                      </span>
                    ) : (
                      <button 
                        onClick={() => onStartQuiz(quiz.id)}
                        className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1 shadow-md shadow-indigo-650/10 active:scale-95 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Start Quiz
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Class Insights (Bento section) */}
          <section className="pt-2">
            <h4 className="font-display font-semibold text-lg mb-4 text-slate-950">Class Insights</h4>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Progress Stat Tracker */}
              <div className="lg:col-span-8 bg-slate-50 border border-slate-150 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                <div className="relative z-10 space-y-4 text-left flex-1">
                  <h5 className="font-display font-bold text-2xl text-indigo-905">Your Progress</h5>
                  <p className="font-sans text-slate-600 text-sm leading-relaxed max-w-md">
                    You're doing better than 85% of the class this week. Keep solving questions and maintaining your daily streak to preserve your global rankings!
                  </p>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weekly XP</p>
                      <p className="font-sans font-bold text-2xl text-slate-800">1,240 XP</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Class Rank</p>
                      <p className="font-sans font-bold text-2xl text-slate-800">#12 / 32</p>
                    </div>
                  </div>
                </div>

                {/* Simulated charts */}
                <div className="w-full md:w-48 h-28 flex items-end justify-between gap-1 mt-4 md:mt-0">
                  <div className="flex-1 bg-indigo-200 rounded-t-lg h-[40%]"></div>
                  <div className="flex-1 bg-indigo-300 rounded-t-lg h-[65%]"></div>
                  <div className="flex-1 bg-indigo-200 rounded-t-lg h-[50%]"></div>
                  <div className="flex-1 bg-indigo-400 rounded-t-lg h-[80%]"></div>
                  <div className="flex-1 bg-indigo-600 rounded-t-lg h-[100%] shadow-[0px_-2px_8px_rgba(83,8,231,0.25)]"></div>
                </div>
              </div>

              {/* Study Hint Call to Action */}
              <div className="lg:col-span-4 bg-indigo-600 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-indigo-650/15">
                <div>
                  <Lightbulb className="w-10 h-10 text-indigo-200 fill-indigo-200 mt-1 mb-4" />
                  <h5 className="font-display font-semibold text-lg mb-2">Study Hint</h5>
                  <p className="font-sans text-xs text-indigo-100 leading-relaxed">
                    Review 'Quadratic Formula' before starting the active quiz for a <span className="font-bold underline text-white">+50 XP bonus</span> once validated!
                  </p>
                </div>
                
                <button 
                  onClick={onOpenConsultant}
                  className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-200 hover:text-white transition-colors group text-left"
                >
                  Review Now 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </section>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="bg-white rounded-3xl p-8 card-shadow border border-[#EEEAFF] text-center space-y-4">
          <BookOpen className="w-12 h-12 text-indigo-600 mx-auto" />
          <h4 className="font-display font-semibold text-lg text-slate-900">Digital Classroom Library</h4>
          <p className="text-sm text-slate-500 tracking-tight max-w-sm mx-auto">
            Review Mr. Smith's uploaded presentations, LaTeX calculus formulas cheat sheet, and custom algebraic proofs anytime.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 cursor-pointer text-left">
              📚 Quadratic_Formula_Proof.pdf
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600 hover:bg-indigo-50 cursor-pointer text-left">
              📒 Trig_Identities_Formula_Sheet.pdf
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="bg-white rounded-3xl p-8 card-shadow border border-[#EEEAFF] text-center space-y-4">
          <Calendar className="w-12 h-12 text-indigo-600 mx-auto" />
          <h4 className="font-display font-semibold text-lg text-slate-900">Pending Homework Assignments</h4>
          <p className="text-sm text-slate-500 tracking-tight max-w-sm mx-auto">Upcoming weekly hand-ins. Your teacher can grade submitted writing files immediately.</p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-left max-w-md mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Homework #4: Compound Inequalities</p>
              <p className="text-[10px] text-slate-400 uppercase mt-0.5">Assigned: May 28</p>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">DUE FRI</span>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] space-y-4">
          <h4 className="font-display font-semibold text-lg text-slate-950">Active Class Leaderboard</h4>
          <div className="space-y-2">
            {leaderboard.map((student, idx) => (
              <div key={student.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-sans font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
                  <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-800">{student.name}</span>
                </div>
                <span className="text-xs font-bold text-indigo-600">{student.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl p-8 card-shadow border border-[#EEEAFF] text-center space-y-4">
          <MessageSquare className="w-12 h-12 text-indigo-600 mx-auto" />
          <h4 className="font-display font-semibold text-lg text-slate-900">Mathematics Chat Pool</h4>
          <p className="text-sm text-slate-500 tracking-tight max-w-sm mx-auto">Collaborate with fellow peers. Discuss root solutions and quadratic algebra questions.</p>
          <button 
            onClick={onOpenConsultant}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            Ask AI Assistant
          </button>
        </div>
      )}

    </div>
  );
};
