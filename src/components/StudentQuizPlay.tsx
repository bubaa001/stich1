import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, UserProfile } from '../types';
import { X, Bolt, HelpCircle, ArrowRight, CheckCircle, Timer } from 'lucide-react';

interface StudentQuizPlayProps {
  quiz: Quiz;
  user: UserProfile;
  onUpdateXp: (xpToAdd: number) => void;
  onCloseQuiz: () => void;
}

export const StudentQuizPlay: React.FC<StudentQuizPlayProps> = ({
  quiz,
  user,
  onUpdateXp,
  onCloseQuiz
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(105); // 01:45 countdown
  const [shakeCard, setShakeCard] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Initialize questions
  const defaultQuestions: QuizQuestion[] = quiz.questions || [
    {
      id: 'q-std-1',
      category: 'LINEAR EQUATIONS',
      text: 'Solve for x:',
      expression: '2x + 5 = 15',
      options: ['x = 2', 'x = 5', 'x = 10', 'x = 15'],
      correctAnswerIndex: 1
    },
    {
      id: 'q-std-2',
      category: 'QUADRATIC EQUATIONS',
      text: 'Calculate root of:',
      expression: 'x² - 16 = 0',
      options: ['x = 2', 'x = 4', 'x = 8', 'x = 16'],
      correctAnswerIndex: 1
    },
    {
      id: 'q-std-3',
      category: 'ALGEBRA BASICS',
      text: 'Find value of y:',
      expression: '3y - 6 = 18',
      options: ['y = 4', 'y = 6', 'y = 8', 'y = 12'],
      correctAnswerIndex: 2
    }
  ];

  const currentQuestion = defaultQuestions[currentIdx];

  // Timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 105));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptionIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedOptionIdx === null || isSubmitted) return;

    if (selectedOptionIdx === currentQuestion.correctAnswerIndex) {
      // Correct Root!
      setScoreCount((prev) => prev + 1);
      setShowReward(true);
      onUpdateXp(150); // rewarding 150 XP per right choice
      
      // Auto advance to next question after rewarding
      setTimeout(() => {
        setShowReward(false);
        if (currentIdx < defaultQuestions.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedOptionIdx(null);
          setIsSubmitted(false);
        } else {
          setQuizDone(true);
        }
      }, 2500);

    } else {
      // Wrong Root -> Trigger physical vibration shake feedback
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col pt-16 relative">
      
      {/* Top App Bar inside active Quiz challenge */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onCloseQuiz}
            className="text-slate-500 hover:text-indigo-650 hover:bg-slate-100 p-2 rounded-full transition-transform active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="font-display font-bold text-lg text-slate-950">{quiz.title}</h1>
        </div>

        <div className="bg-indigo-50 text-indigo-750 px-3.5 py-1 rounded-full flex items-center gap-1 border border-indigo-100 font-sans text-xs font-bold shadow-sm">
          <span>{user.xp} XP</span>
          <Bolt className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 pb-32 flex flex-col justify-center">
        
        {quizDone ? (
          <div className="bg-white rounded-3xl p-8 card-shadow border border-[#EEEAFF] text-center space-y-6 animate-fade-in my-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-slate-900">Quiz Completed!</h2>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Excellent progression. You correctly evaluated <span className="font-bold text-indigo-600">{scoreCount}</span> out of {defaultQuestions.length} root solutions!
              </p>
            </div>

            <div className="inline-block px-5 py-2.5 bg-indigo-550 text-white rounded-full text-xs font-bold tracking-wider uppercase shadow-md shadow-indigo-600/10">
              ⚡ +{scoreCount * 150} XP Claimed
            </div>

            <button 
              onClick={onCloseQuiz}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-sm font-semibold py-3.5 rounded-xl transition-colors active:scale-95"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Dynamic Question Progress Tracker */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-end text-xs font-semibold text-slate-600">
                <span className="text-indigo-600 font-bold">Question {currentIdx + 1} of {defaultQuestions.length}</span>
                <span>{Math.round(((currentIdx + 1) / defaultQuestions.length) * 100)}% Complete</span>
              </div>
              <div className="h-3 w-full bg-slate-200/60 rounded-full overflow-hidden border border-slate-250/20">
                <div 
                  className="h-full bg-indigo-650 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(83,8,231,0.25)] xp-progress-shine"
                  style={{ width: `${((currentIdx + 1) / defaultQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Glowing Question card with shake feedback support */}
            <div 
              className={`bg-white rounded-3xl p-6 md:p-8 card-shadow border border-[#EEEAFF] text-center relative overflow-hidden transition-transform duration-300 ${
                shakeCard ? 'shake-animation border-red-500/50 bg-red-50/10' : ''
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
                {currentQuestion.category}
              </span>
              
              <h2 className="font-display font-medium text-lg text-slate-800 mb-6">{currentQuestion.text}</h2>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 inline-block">
                <p className="font-display font-bold text-3xl text-indigo-650 tracking-wider">
                  {currentQuestion.expression}
                </p>
              </div>
            </div>

            {/* Answer multiple option choices selector */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, oIdx) => {
                const optLabels = ['A', 'B', 'C', 'D'];
                const isSelected = selectedOptionIdx === oIdx;

                return (
                  <label 
                    key={opt}
                    onClick={() => handleOptionSelect(oIdx)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99] hover:bg-slate-50 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/30'
                        : 'border-slate-200/60 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-xs transition-colors ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {optLabels[oIdx]}
                      </div>
                      <span className={`font-sans text-xs font-semibold ${isSelected ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
                        {opt}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-600' 
                        : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Fixed bottom Submit panel and triggers */}
            <div className="pt-4 space-y-4">
              <button
                onClick={handleSubmit}
                disabled={selectedOptionIdx === null}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-sans text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center px-2 text-xs font-semibold text-slate-500">
                <button type="button" className="flex items-center gap-1 hover:text-indigo-600">
                  <HelpCircle className="w-4 h-4" />
                  Get a Hint
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    if (currentIdx < defaultQuestions.length - 1) {
                      setCurrentIdx((prev) => prev + 1);
                      setSelectedOptionIdx(null);
                      setIsSubmitted(false);
                    } else {
                      setQuizDone(true);
                    }
                  }}
                  className="flex items-center gap-1 hover:text-indigo-600"
                >
                  Skip Question
                </button>
              </div>
            </div>

            {/* Stats badges */}
            <div className="flex justify-center gap-4 pt-4">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full border border-emerald-100 font-sans text-xs font-bold text-center">
                <span>⚡ +150 XP Streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 px-4 py-2 rounded-full border border-indigo-150 font-sans text-xs font-bold text-center">
                <Timer className="w-4 h-4 text-indigo-600" />
                <span>Timer: {formatTimer(secondsLeft)}</span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Floating Sparkle Reward Splash Screen modal popup */}
      {showReward && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center space-y-4 reward-pop shadow-2xl relative border border-slate-100">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Bolt className="w-10 h-10 fill-white text-white" />
            </div>
            <div className="pt-8 space-y-1">
              <h4 className="font-display font-bold text-xl text-indigo-950">Awesome Answer!</h4>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Your math calculations are absolutely correct.</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100/50">
              <p className="font-display font-extrabold text-2xl text-indigo-750">+150 XP rewarded!</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#B45309] mt-0.5">Multipier Applied (1.0x)</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
