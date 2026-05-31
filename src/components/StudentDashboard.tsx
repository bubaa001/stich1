import React from 'react';
import { UserProfile, Quiz, ClassProgress, LeaderboardEntry } from '../types';
import { Calendar, Award, Zap, BookOpen, ChevronRight, Binary, Microscope, Languages, Star, TrendingUp } from 'lucide-react';

interface StudentDashboardProps {
  user: UserProfile;
  quizzes: Quiz[];
  classes: ClassProgress[];
  leaderboard: LeaderboardEntry[];
  onSelectMathQuiz: () => void;
  onOpenEssayDetails: (text: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  quizzes,
  classes,
  leaderboard,
  onSelectMathQuiz,
  onOpenEssayDetails
}) => {
  // Pre-calculate class items metadata
  const classProgressIcons = [
    { name: 'Math', color: 'text-blue-600', bg: 'bg-blue-100', stroke: '#2563eb', icon: Binary },
    { name: 'Science', color: 'text-emerald-600', bg: 'bg-emerald-100', stroke: '#059669', icon: Microscope },
    { name: 'English', color: 'text-purple-600', bg: 'bg-purple-100', stroke: '#7c3aed', icon: Languages },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
      
      {/* Welcome Greeting Strip */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight leading-none">Hi, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500 font-sans text-sm mt-1.5">Ready to crush your goals today?</p>
        </div>
        <div className="self-start md:self-auto bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200 shadow-sm">
          <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider">{user.streak} Day Streak!</span>
        </div>
      </section>

      {/* Gamified XP Progress Indicator Widget */}
      <section className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50/40 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-600 fill-indigo-500" />
              <h3 className="font-display font-medium text-lg text-indigo-900 leading-tight">Master Explorer</h3>
            </div>
            <p className="text-slate-500 font-sans text-xs">Level 12 • 750 XP until next rank</p>
          </div>
          
          <div className="text-left md:text-right">
            <span className="font-display font-bold text-3xl text-indigo-600 tracking-tight">{user.xp.toLocaleString()}</span>
            <span className="text-slate-400 font-sans text-xs font-semibold ml-1">/ 2,000 XP</span>
          </div>
        </div>

        {/* Shimmer metallic progress bar */}
        <div className="mt-6 relative h-5 bg-[#EFF4FF] rounded-full overflow-hidden border border-slate-200/50">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(83,8,231,0.25)] shine-effect"
            style={{ width: `${(user.xp / 2000) * 100}%` }}
          ></div>
        </div>

        <p className="mt-3.5 font-sans text-xs text-slate-500 flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          750 XP to achieve legendary status
        </p>
      </section>

      {/* Grid Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Activities and Quizzes) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Quizzes */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-semibold text-lg text-slate-950">Upcoming Quizzes</h4>
              <button 
                onClick={onSelectMathQuiz}
                className="text-indigo-600 font-sans text-xs font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {/* Math quiz item - trigger mathematical screen flow */}
              <div 
                onClick={onSelectMathQuiz}
                className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-400/50 hover:bg-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Binary className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-hans font-bold text-[15px] text-slate-900">Math Quiz</h5>
                    <p className="text-xs text-slate-500">Algebraic Foundations • 20 mins</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[13px] font-bold text-red-500">Tomorrow</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">09:00 AM</p>
                </div>
              </div>

              {/* History quiz item - custom modal trigger */}
              <div 
                onClick={() => onOpenEssayDetails("The Industrial Revolution - 500 words. Read about steam power development, carbon impacts, and the workforce shift in early Europe.")}
                className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-400/50 hover:bg-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-hans font-bold text-[15px] text-slate-900 font-semibold">History Essay</h5>
                    <p className="text-xs text-slate-500">The Industrial Revolution • 500 words</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[13px] font-semibold text-slate-500">Due tomorrow</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">11:59 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Classes Grid Panel rendering circles */}
          <div>
            <h4 className="font-display font-semibold text-lg text-slate-950 mb-4 text-left">My Classes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {classProgressIcons.map((cls, idx) => {
                const percentage = idx === 0 ? 85 : idx === 1 ? 64 : 92;
                const radius = 16;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (percentage / 100) * circumference;

                return (
                  <div key={cls.name} className="bg-white rounded-3xl p-5 card-shadow border border-[#EEEAFF] flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                      <div className={`w-10 h-10 rounded-lg ${cls.bg} ${cls.color} flex items-center justify-center`}>
                        <cls.icon className="w-5 h-5" />
                      </div>
                      
                      {/* Radial Progress SVGs */}
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle 
                            className="text-slate-100" 
                            cx="24" cy="24" r={radius} 
                            fill="transparent" 
                            stroke="currentColor" 
                            strokeWidth="3"
                          />
                          <circle 
                            className={cls.color} 
                            cx="24" cy="24" r={radius} 
                            fill="transparent" 
                            stroke="currentColor" 
                            strokeWidth="3.5"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute font-sans font-bold text-[10px] text-slate-900">{percentage}%</span>
                      </div>

                    </div>
                    <div>
                      <h4 className="font-hans font-bold text-slate-900 text-sm">{cls.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Academic Performance</p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* Right Column (High Fidelity Leaderboard) */}
        <aside className="space-y-6">
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-indigo-600 fill-indigo-50" />
              <h4 className="font-display font-semibold text-lg text-slate-950">Leaderboard</h4>
            </div>

            <div className="space-y-3 flex-1">
              {leaderboard.map((player, rankIdx) => {
                const rankLabels = ['1st Place', '2nd Place', '3rd Place', '4th Place'];
                
                // Set custom color codes based on Rank heights representation
                let containerColor = 'bg-slate-50 border-slate-100';
                let trophyColor = 'text-slate-400';
                if (player.name.includes('Sarah')) {
                  containerColor = 'bg-[#FEF3C7]/40 border-[#FEF3C7]';
                  trophyColor = 'text-amber-500 fill-amber-100';
                } else if (player.name.includes('You')) {
                  containerColor = 'bg-indigo-50/50 border-indigo-100/30 ring-1 ring-indigo-500/20';
                  trophyColor = 'text-indigo-600 fill-indigo-100';
                } else if (player.name.includes('Mike')) {
                  containerColor = 'bg-[#F3F4F6]/60 border-[#F3F4F6]';
                  trophyColor = 'text-slate-500';
                } else if (player.name.includes('Emma')) {
                  containerColor = 'bg-[#FFEDD5]/40 border-[#FFEDD5]';
                  trophyColor = 'text-amber-750 font-bold';
                }

                return (
                  <div 
                    key={player.name} 
                    className={`flex items-center justify-between p-3 rounded-2xl border ${containerColor} hover:-translate-y-0.5 transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-sans font-bold text-xs p-1">
                        {rankIdx + 1}
                      </div>
                      <img 
                        src={player.avatar} 
                        alt={player.name} 
                        className="w-10 h-10 rounded-full border border-white shadow-sm object-cover"
                      />
                      <div>
                        <p className="font-sans font-bold text-slate-900 text-xs tracking-tight">{player.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{rankLabels[rankIdx] || 'Scholar'}</p>
                      </div>
                    </div>
                    <span className="font-sans font-bold text-xs text-indigo-600">{player.xp.toLocaleString()} XP</span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onSelectMathQuiz}
              className="w-full mt-6 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-sans text-xs font-semibold py-3 rounded-xl transition-colors"
            >
              View Full Standings
            </button>
          </div>
        </aside>

      </div>

    </div>
  );
};
