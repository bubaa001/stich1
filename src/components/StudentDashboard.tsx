import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, Quiz, ClassProgress, LeaderboardEntry, ConfigSettings } from '../types';
import { Calendar, Award, Zap, BookOpen, ChevronRight, Binary, Microscope, Languages, Star, TrendingUp, Compass, Crown, Shield, Sparkles, Flame, Target, RefreshCw, Gift, ListTodo, CheckSquare, Plus, Trash2, Clock } from 'lucide-react';

interface StudentDashboardProps {
  user: UserProfile;
  quizzes: Quiz[];
  classes: ClassProgress[];
  leaderboard: LeaderboardEntry[];
  config: ConfigSettings;
  onSelectMathQuiz: () => void;
  onOpenEssayDetails: (text: string) => void;
  onToggleStreakFreeze?: () => void;
  onPurchaseStreakFreeze?: () => void;
  onSimulateMissedDay?: () => void;
  streakSimulationNotification?: { text: string; type: 'success' | 'error' | 'warning' | null } | null;
  onClearStreakSimulationNotification?: () => void;
  onProgressDailyMission?: () => void;
  onClaimDailyMissionReward?: () => void;
  onResetDailyMission?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  quizzes,
  classes,
  leaderboard,
  config,
  onSelectMathQuiz,
  onOpenEssayDetails,
  onToggleStreakFreeze,
  onPurchaseStreakFreeze,
  onSimulateMissedDay,
  streakSimulationNotification,
  onClearStreakSimulationNotification,
  onProgressDailyMission,
  onClaimDailyMissionReward,
  onResetDailyMission
}) => {
  // Weekly Study Plan Checklist states
  const [completedTaskIds, setCompletedTaskIds] = React.useState<string[]>(() => {
    const cached = localStorage.getItem('aris_weekly_study_completed');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    // Initialize with completed quizzes from the props
    const defaultCompleted = quizzes
      .filter((q) => q.completed)
      .map((q) => `quiz-${q.id}`);
    return defaultCompleted;
  });

  const [customTasks, setCustomTasks] = React.useState<{ id: string; title: string; dueDateLabel: string; isCompleted: boolean }[]>(() => {
    const cached = localStorage.getItem('aris_weekly_study_custom');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [newCustomTaskTitle, setNewCustomTaskTitle] = React.useState('');

  // Persist checks to localStorage
  React.useEffect(() => {
    localStorage.setItem('aris_weekly_study_completed', JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  React.useEffect(() => {
    localStorage.setItem('aris_weekly_study_custom', JSON.stringify(customTasks));
  }, [customTasks]);

  // Derive full study tasks list from quizzes, classes, and custom tasks
  const studyTasks = React.useMemo(() => {
    const list: {
      id: string;
      title: string;
      subtitle: string;
      dueDateLabel: string;
      category: 'quiz' | 'class' | 'custom';
      completedByDefault: boolean;
    }[] = [];

    // 1. Pull quizzes
    quizzes.forEach((quiz) => {
      list.push({
        id: `quiz-${quiz.id}`,
        title: `Submit "${quiz.title}" Quiz`,
        subtitle: `${quiz.className}`,
        dueDateLabel: quiz.dueDate,
        category: 'quiz',
        completedByDefault: quiz.completed,
      });
    });

    // 2. Pull classes
    classes.forEach((cls) => {
      list.push({
        id: `class-${cls.id}`,
        title: `Review "${cls.name}" Lectures`,
        subtitle: `${cls.instructor} • ${cls.roomName}`,
        dueDateLabel: cls.newActivitiesCount > 0 ? `${cls.newActivitiesCount} new activities` : 'No new notifications',
        category: 'class',
        completedByDefault: false,
      });
    });

    // 3. Custom tasks
    customTasks.forEach((task) => {
      list.push({
        id: task.id,
        title: task.title,
        subtitle: 'Custom Objective',
        dueDateLabel: task.dueDateLabel || 'Due Today',
        category: 'custom',
        completedByDefault: task.isCompleted,
      });
    });

    return list;
  }, [quizzes, classes, customTasks]);

  // Handlers
  const handleToggleTask = (taskId: string, category: 'quiz' | 'class' | 'custom') => {
    if (category === 'custom') {
      setCustomTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
      );
    } else {
      setCompletedTaskIds((prev) =>
        prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
      );
    }
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTaskTitle.trim()) return;
    const newTask = {
      id: `custom-${Date.now()}`,
      title: newCustomTaskTitle.trim(),
      dueDateLabel: 'Due Today',
      isCompleted: false,
    };
    setCustomTasks((prev) => [...prev, newTask]);
    setNewCustomTaskTitle('');
  };

  const handleDeleteCustomTask = (taskId: string) => {
    setCustomTasks((prev) => prev.filter((t) => t.id !== taskId));
    setCompletedTaskIds((prev) => prev.filter((id) => id !== taskId));
  };

  const totalTasksCount = studyTasks.length;
  const completedTasksCount = studyTasks.filter((task) => {
    if (task.category === 'custom') {
      const ct = customTasks.find((item) => item.id === task.id);
      return ct ? ct.isCompleted : false;
    }
    return task.completedByDefault || completedTaskIds.includes(task.id);
  }).length;

  const weeklyCompletionPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Pre-calculate class items metadata
  const classProgressIcons = [
    { name: 'Math', color: 'text-blue-600', bg: 'bg-blue-100', stroke: '#2563eb', icon: Binary },
    { name: 'Science', color: 'text-emerald-600', bg: 'bg-emerald-100', stroke: '#059669', icon: Microscope },
    { name: 'English', color: 'text-purple-600', bg: 'bg-purple-100', stroke: '#7c3aed', icon: Languages },
  ];

  // Find the student's own leaderboard entry to show their trend next to their rank in StudentDashboard
  const myLeaderboardEntry = leaderboard.find(
    (player) => player.name.toLowerCase().includes('you') || player.name.toLowerCase().includes('alex')
  );
  const myRank = myLeaderboardEntry ? myLeaderboardEntry.rank : undefined;
  const myRankDelta = myLeaderboardEntry ? myLeaderboardEntry.rankDelta : undefined;

  // Find dynamic level name, next milestone, and calculation range based on config milestones
  const currentXp = user.xp;
  let currentRankName = 'Novice';
  let nextMilestone = config.milestones.explorer;
  let prevMilestone = 0;
  let nextRankName = 'Explorer';

  if (currentXp >= config.milestones.legend) {
    currentRankName = 'Legendary Scholar';
    nextMilestone = config.milestones.legend * 1.5; // Cap extension
    prevMilestone = config.milestones.legend;
    nextRankName = 'Grand Master';
  } else if (currentXp >= config.milestones.champion) {
    currentRankName = 'Elite Champion';
    nextMilestone = config.milestones.legend;
    prevMilestone = config.milestones.champion;
    nextRankName = 'Legendary Scholar';
  } else if (currentXp >= config.milestones.explorer) {
    currentRankName = 'Active Explorer';
    nextMilestone = config.milestones.champion;
    prevMilestone = config.milestones.explorer;
    nextRankName = 'Elite Champion';
  } else {
    currentRankName = 'Math Novice';
    nextMilestone = config.milestones.explorer;
    prevMilestone = 0;
    nextRankName = 'Active Explorer';
  }

  const range = nextMilestone - prevMilestone;
  const progressPercent = Math.min(100, Math.max(5, ((currentXp - prevMilestone) / range) * 100));
  const xpRemaining = Math.max(0, nextMilestone - currentXp);

  // Dynamic Badges List based on actual config thresholds
  const badgesList = [
    {
      id: 'explorer',
      name: 'XP Explorer',
      description: `Reached ${config.milestones.explorer.toLocaleString()} XP milestone`,
      threshold: config.milestones.explorer,
      icon: Compass,
      unlockedBg: 'bg-teal-50 text-teal-600 border border-teal-200',
    },
    {
      id: 'champion',
      name: 'XP Champion',
      description: `Reached ${config.milestones.champion.toLocaleString()} XP milestone`,
      threshold: config.milestones.champion,
      icon: Award,
      unlockedBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    },
    {
      id: 'legend',
      name: 'XP Legend',
      description: `Reached ${config.milestones.legend.toLocaleString()} XP milestone`,
      threshold: config.milestones.legend,
      icon: Crown,
      unlockedBg: 'bg-amber-50 text-amber-600 border border-amber-200',
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
      
      {/* Welcome Greeting Strip */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight leading-none">Hi, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500 font-sans text-sm mt-1.5">Ready to crush your goals today?</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {myRank && (
            <div className="bg-indigo-50 text-indigo-750 px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-200 shadow-sm">
              <Award className="w-4 h-4 text-indigo-650" />
              <span className="font-sans text-xs font-extrabold uppercase tracking-wider">Rank #{myRank}</span>
              {myRankDelta !== undefined && (
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  myRankDelta > 0 
                    ? 'text-emerald-700 bg-emerald-100/70' 
                    : myRankDelta < 0 
                      ? 'text-red-700 bg-red-100/70' 
                      : 'text-slate-600 bg-slate-100'
                }`}>
                  {myRankDelta > 0 ? `▲ ${myRankDelta}` : myRankDelta < 0 ? `▼ ${Math.abs(myRankDelta)}` : '• 0'}
                </span>
              )}
            </div>
          )}
          <div className="self-start md:self-auto bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200 shadow-sm">
            <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider">{user.streak} Day Streak!</span>
          </div>
        </div>
      </section>

      {/* Gamified XP Progress Indicator Widget */}
      <section className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50/40 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <motion.div 
              key={currentRankName}
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ 
                scale: [0.85, 1.15, 1],
                opacity: [0, 1, 1],
                y: [10, -3, 0],
                filter: ['drop-shadow(0px 0px 0px rgba(99,102,241,0))', 'drop-shadow(0px 4px 12px rgba(99,102,241,0.4))', 'drop-shadow(0px 0px 0px rgba(99,102,241,0))']
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                times: [0, 0.4, 1]
              }}
              className="flex items-center gap-3"
            >
              <Star className="w-5 h-5 text-indigo-600 fill-indigo-500 animate-pulse" />
              <h3 className="font-display font-bold text-lg text-indigo-905 leading-tight">{currentRankName}</h3>
              {myRank && (
                <span className="inline-flex items-center gap-1 bg-indigo-100/70 text-indigo-805 px-2.5 py-1 rounded-full font-sans text-[10px] font-extrabold border border-indigo-200/50">
                  Rank #{myRank}
                  {myRankDelta !== undefined && (
                    <span className={`inline-flex items-center ml-1 ${
                      myRankDelta > 0 ? 'text-emerald-600' : myRankDelta < 0 ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {myRankDelta > 0 ? `▲${myRankDelta}` : myRankDelta < 0 ? `▼${Math.abs(myRankDelta)}` : '•'}
                    </span>
                  )}
                </span>
              )}
            </motion.div>
            <p className="text-slate-500 font-sans text-xs">Based on current active milestones settings</p>
          </div>
          
          <div className="text-left md:text-right">
            <span className="font-display font-bold text-3xl text-indigo-600 tracking-tight">{user.xp.toLocaleString()}</span>
            <span className="text-slate-400 font-sans text-xs font-semibold ml-1">/ {nextMilestone.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Shimmer metallic progress bar */}
        <div className="mt-6 relative h-5 bg-[#EFF4FF] rounded-full overflow-hidden border border-slate-200/50">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(83,8,231,0.25)] shine-effect"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="mt-3.5 font-sans text-xs text-slate-500 flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          {xpRemaining > 0 ? `${xpRemaining.toLocaleString()} XP to achieve ${nextRankName} status` : 'You have reached maximum rank!'}
        </p>
      </section>

      {/* Streak Freeze & Protection Hub */}
      <section className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="text-left max-w-sm">
            <span className="micro-label text-indigo-600 font-bold uppercase tracking-wider">Quality of Life Features</span>
            <h4 className="font-display font-bold text-lg text-slate-950 mt-0.5">Streak Protection Station</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Equip a Streak Freeze to safeguard your hard-earned streak. If you skip a day or miss learning, the system consumes the active freeze to keep your progress intact!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap flex-1 justify-end items-stretch sm:items-center gap-4 w-full">
            
            {/* Status Panel */}
            <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center min-w-[150px] transition-all ${
              user.streakFreezeActive 
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950' 
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              <div className="relative">
                <Shield className={`w-8 h-8 ${user.streakFreezeActive ? 'text-emerald-600 fill-emerald-500' : 'text-slate-300'}`} />
                {user.streakFreezeActive && (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 absolute -top-1 -right-1 animate-pulse" />
                )}
              </div>
              <span className="font-display font-bold text-xs uppercase mt-2 tracking-wider">Shield Status</span>
              <span className={`text-[11px] font-extrabold mt-0.5 px-2 py-0.5 rounded-full ${
                user.streakFreezeActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {user.streakFreezeActive ? 'ACTIVE PROTECTION' : 'SHIELD OFF'}
              </span>
            </div>

            {/* Inventory / Trigger Action Box */}
            <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 flex-1 flex flex-col justify-between min-w-[200px] text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-indigo-605" />
                  <span className="font-sans font-bold text-xs text-slate-850">Your Frozen Items</span>
                </div>
                <span className="bg-indigo-600 text-white font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-[0_2px_4px_rgba(83,8,231,0.2)]">
                  {user.streakFreezeCount} Left
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={onToggleStreakFreeze}
                  disabled={user.streakFreezeCount <= 0 && !user.streakFreezeActive}
                  className={`w-full font-sans text-[11px] font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    user.streakFreezeActive 
                      ? 'bg-rose-50 hover:bg-rose-105 text-rose-700 border border-rose-200 cursor-pointer'
                      : user.streakFreezeCount > 0
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {user.streakFreezeActive ? 'Deactivate (Returns +1)' : 'Activate Streak Freeze'}
                </button>
                
                <button
                  onClick={onPurchaseStreakFreeze}
                  disabled={user.xp < 150}
                  className={`w-full font-sans text-[11px] font-bold py-2 px-3 rounded-xl transition-all border flex items-center justify-center gap-1.5 ${
                    user.xp >= 150
                      ? 'border-indigo-200 bg-white hover:bg-indigo-100 text-indigo-700 active:scale-95 cursor-pointer'
                      : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                  }`}
                  title={user.xp < 150 ? "Requires 150 XP" : "Costs 150 XP"}
                >
                  <span>Buy with 150 XP</span>
                </button>
              </div>
            </div>

            {/* Simulation Block */}
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/55 flex-1 flex flex-col justify-between min-w-[200px] text-left">
              <div>
                <span className="font-sans font-extrabold text-xs text-amber-800 flex items-center gap-1">
                  🧪 Sandbox Testing
                </span>
                <p className="text-[10px] text-amber-900/70 leading-normal mt-1">
                  Simulate missing/skipping a day to see the Streak Freeze actively guard or fail to defend your {user.streak}-day streak!
                </p>
              </div>
              
              <button
                onClick={onSimulateMissedDay}
                className="w-full mt-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-sans text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                Simulate Missed Day
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic Simulation Feedback Inline Alerts */}
        {streakSimulationNotification && streakSimulationNotification.text && (
          <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between text-xs font-sans animate-bounce ${
            streakSimulationNotification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : streakSimulationNotification.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <span className="flex items-center gap-2 font-bold leading-normal">
              {streakSimulationNotification.type === 'success' ? '🛡️' : '🚨'} {streakSimulationNotification.text}
            </span>
            <button 
              onClick={onClearStreakSimulationNotification} 
              className="font-bold underline ml-2 hover:text-black shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </section>

      {/* Earned Badges Collection Shelf */}
      <section className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="text-left">
            <span className="micro-label text-indigo-600">Your Achievements</span>
            <h4 className="font-display font-bold text-lg text-slate-950 mt-0.5">Earned Badge Milestones</h4>
          </div>
          <span className="self-start sm:self-auto bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
            {badgesList.filter(b => currentXp >= b.threshold).length} / {badgesList.length} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {badgesList.map((badge) => {
            const isUnlocked = currentXp >= badge.threshold;
            const BadgeIcon = badge.icon;
            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${
                  isUnlocked 
                    ? 'border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-sm' 
                    : 'border-slate-100 bg-slate-50/50 opacity-55'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isUnlocked ? badge.unlockedBg : 'bg-slate-100 text-slate-300 border border-slate-200'
                }`}>
                  <BadgeIcon className="w-6 h-6" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-sans font-extrabold text-sm text-slate-905">{badge.name}</span>
                    {isUnlocked ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Clean
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight truncate">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grid Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Activities and Quizzes) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Mission Card */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/30 to-rose-100/20 rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-655 flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <span className="micro-label text-amber-600 font-bold uppercase tracking-wider">Today's Quest</span>
                  <h4 className="font-display font-bold text-base text-slate-950 mt-0.5">Daily Mission: Quadratic Conqueror</h4>
                </div>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-amber-50 text-amber-850 text-[11px] font-extrabold px-3 py-1 rounded-full border border-amber-200/50 shadow-sm animate-pulse">
                <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span>+{Math.round(250 * config.xpMultiplier)} XP Bonus</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <p className="text-xs font-semibold text-slate-705">
                  Solve <span className="font-bold text-indigo-600">5 math problems</span> correctly in math quizzes.
                </p>
                <div className="font-mono font-extrabold text-xs text-slate-600 shrink-0">
                  {user.dailyMissionProgress ?? 0} / 5 Solved
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-3 bg-slate-200/70 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-indigo-650 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((user.dailyMissionProgress ?? 0) / 5) * 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {/* Reward Actions */}
                {user.dailyMissionCompleted && !user.dailyMissionClaimed && (
                  <button
                    onClick={onClaimDailyMissionReward}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 active:scale-95 text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all animate-bounce"
                  >
                    <Gift className="w-4 h-4 fill-white" />
                    Claim +{Math.round(250 * config.xpMultiplier)} XP Reward!
                  </button>
                )}

                {user.dailyMissionClaimed && (
                  <div className="flex-1 bg-emerald-50 border border-emerald-205 text-emerald-805 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Mission Perfected! Reward Claimed successfully.</span>
                  </div>
                )}

                {!user.dailyMissionCompleted && (
                  <div className="flex-1 bg-indigo-50/50 border border-indigo-100 text-indigo-700 text-xs font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
                    <span>Solve {5 - (user.dailyMissionProgress ?? 0)} more correct problems to unlock reward!</span>
                  </div>
                )}

                {/* Sandbox helpers inside Daily Mission Card */}
                <div className="flex items-center gap-2 self-stretch">
                  <button
                    onClick={onProgressDailyMission}
                    disabled={user.dailyMissionCompleted}
                    className={`px-3 py-2.5 rounded-xl border font-sans text-[11px] font-bold flex items-center gap-1 transition-all ${
                      user.dailyMissionCompleted
                        ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 active:scale-95 cursor-pointer shadow-sm'
                    }`}
                    title="Simulate solving a correct problem instantly"
                  >
                    <span>🧪 Solve +1</span>
                  </button>

                  <button
                    onClick={onResetDailyMission}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 active:scale-95 cursor-pointer shadow-sm"
                    title="Reset Mission Progress"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Weekly Study Plan Card */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] relative overflow-hidden group text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/20 to-purple-100/10 rounded-full pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
                  <ListTodo className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="micro-label text-indigo-600 font-bold uppercase tracking-wider">Learning Organizer</span>
                  <h4 className="font-display font-bold text-base text-slate-950 mt-0.5">Weekly Study Plan</h4>
                </div>
              </div>

              {/* Progress Summary badge */}
              <div className="bg-indigo-50 text-indigo-750 text-[11px] font-extrabold px-3 py-1 rounded-full border border-indigo-200/50 shadow-sm flex items-center gap-1.5 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Today's Tasks Tracker</span>
              </div>
            </div>

            {/* Weekdays Row Picker */}
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50">
              <div className="grid grid-cols-7 gap-2 text-center">
                {[
                  { name: 'Mon', date: '25', isPast: true },
                  { name: 'Tue', date: '26', isPast: true },
                  { name: 'Wed', date: '27', isPast: true },
                  { name: 'Thu', date: '28', isPast: true },
                  { name: 'Fri', date: '29', isPast: true },
                  { name: 'Sat', date: '30', isPast: true },
                  { name: 'Sun', date: '31', isToday: true, isPast: false },
                ].map((day) => (
                  <div 
                    key={day.name} 
                    className={`p-2 rounded-xl flex flex-col items-center transition-all ${
                      day.isToday 
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md' 
                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${day.isToday ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {day.name}
                    </span>
                    <span className="font-display font-semibold text-xs mt-0.5">
                      {day.date}
                    </span>
                    {day.isToday && (
                      <span className="bg-white text-indigo-750 font-extrabold text-[8px] px-1.5 py-0.5 rounded-full mt-1 uppercase scale-90 tracking-wide">
                        Today
                      </span>
                    )}
                    {!day.isToday && day.isPast && (
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 animate-pulse" title="All Completed" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Progress Bar */}
            <div className="mb-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 font-sans">Weekly Achievement Goals</span>
                <span className="font-mono text-indigo-600 font-extrabold">{completedTasksCount} / {totalTasksCount} completed ({weeklyCompletionPercent}%)</span>
              </div>
              <div className="relative w-full h-3 bg-slate-100 rounded-full border border-slate-200/40 overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-650 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${weeklyCompletionPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              {weeklyCompletionPercent === 100 && totalTasksCount > 0 ? (
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                  🌟 All study tasks completed successfully! Excellent work!
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Complete classroom study objectives to lock in high performance standings.
                </p>
              )}
            </div>

            {/* List of study plan tasks */}
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {studyTasks.map((task) => {
                const isChecked = task.category === 'custom' 
                  ? (customTasks.find(ct => ct.id === task.id)?.isCompleted || false)
                  : (task.completedByDefault || completedTaskIds.includes(task.id));

                let badgeColor = 'bg-indigo-50 border-indigo-100 text-indigo-700';
                if (task.category === 'class') {
                  badgeColor = 'bg-teal-50 border-teal-100 text-teal-700';
                } else if (task.category === 'custom') {
                  badgeColor = 'bg-violet-50 border-violet-100 text-violet-700';
                }

                return (
                  <div 
                    key={task.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group/item ${
                      isChecked 
                        ? 'border-emerald-105 bg-emerald-50/15 text-slate-400' 
                        : 'border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox button */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id, task.category)}
                        className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'border-slate-300 hover:border-indigo-500 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <motion.svg 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            className="w-3.5 h-3.5"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.15 }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        )}
                      </button>

                      {/* Text details */}
                      <div className="text-left flex-1 min-w-0">
                        <span 
                          onClick={() => handleToggleTask(task.id, task.category)}
                          className={`font-sans text-xs tracking-tight select-none cursor-pointer leading-snug block ${
                            isChecked 
                              ? 'line-through text-slate-400' 
                              : 'font-semibold text-slate-900 group-hover/item:text-indigo-650'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-450 mt-0.5 block truncate font-medium">
                          {task.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Deadline Tags */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
                        {task.dueDateLabel}
                      </span>

                      {task.category === 'custom' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomTask(task.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {studyTasks.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-slate-205 rounded-2xl">
                  <p className="text-xs text-slate-500 font-medium">No active tasks. Free to explore lectures!</p>
                </div>
              )}
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddCustomTask} className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Pin a custom learning goal (e.g., Read physics notes)..."
                value={newCustomTaskTitle}
                onChange={(e) => setNewCustomTaskTitle(e.target.value)}
                maxLength={60}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-sans border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 text-slate-900"
              />
              <button
                type="submit"
                disabled={!newCustomTaskTitle.trim()}
                className={`py-2 px-3.5 rounded-xl font-sans text-xs font-extrabold transition-all flex items-center justify-center gap-1 shrink-0 ${
                  newCustomTaskTitle.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-205/50'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

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
                      <div className="font-sans font-bold text-xs p-1 flex flex-col items-center justify-center min-w-[28px] text-center">
                        <div>{rankIdx + 1}</div>
                        {player.rankDelta !== undefined && (
                          <span className={`inline-flex items-center text-[9px] font-extrabold mt-0.5 leading-none ${
                            player.rankDelta > 0 
                              ? 'text-emerald-500' 
                              : player.rankDelta < 0 
                                ? 'text-red-500' 
                                : 'text-slate-405'
                          }`} title={`${player.rankDelta > 0 ? 'Gained' : player.rankDelta < 0 ? 'Lost' : 'No change in'} positions since last week`}>
                            {player.rankDelta > 0 ? `▲${player.rankDelta}` : player.rankDelta < 0 ? `▼${Math.abs(player.rankDelta)}` : '•'}
                          </span>
                        )}
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
