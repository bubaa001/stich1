import React, { useState } from 'react';
import { UserProfile, Quiz, ClassProgress, Submission } from '../types';
import { CreateClassModal } from './CreateClassModal';
import { CreateQuizModal } from './CreateQuizModal';
import { PlusCircle, Award, CheckCircle, Clock, AlertTriangle, Play, BookOpen, Send, Check } from 'lucide-react';

interface InstructorDashboardProps {
  user: UserProfile;
  quizzes: Quiz[];
  classes: ClassProgress[];
  submissions: Submission[];
  onAddNewQuiz: (quiz: Quiz) => void;
  onAddNewClass: (cls: ClassProgress) => void;
  onGradeStudent: (submissionId: string, grade: string) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  user,
  quizzes,
  classes,
  submissions,
  onAddNewQuiz,
  onAddNewClass,
  onGradeStudent
}) => {
  const [showClassModal, setShowClassModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // Grading modal helper states
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [customGrade, setCustomGrade] = useState('95/100');

  const openGradingField = (subId: string) => {
    setGradingSubmissionId(subId);
  };

  const submitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (gradingSubmissionId) {
      onGradeStudent(gradingSubmissionId, customGrade);
      setGradingSubmissionId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in text-left">
      
      {/* Welcome strip */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-indigo-950 tracking-tight leading-none">Instructor Dashboard</h2>
          <p className="text-slate-500 font-sans text-sm mt-1.5">Good afternoon, Prof. Aris.</p>
        </div>

        {/* Dynamic pending grades container */}
        <div className="self-start md:self-auto bg-red-50 text-red-700 px-4 py-2 rounded-2xl flex items-center gap-2 border border-red-100 shadow-sm">
          <AlertTriangle className="w-4 h-4 fill-red-200" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider">12 Items Pending Evaluation</span>
        </div>
      </section>

      {/* Primary Action creators */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowClassModal(true)}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-600/10 active:scale-98 transition-all hover:brightness-110 cursor-pointer text-center"
        >
          <PlusCircle className="w-8 h-8" />
          <span className="font-sans font-bold text-sm">Create Class</span>
        </button>

        <button
          onClick={() => setShowQuizModal(true)}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-indigo-50 border-2 border-dashed border-indigo-400/50 text-indigo-900 rounded-3xl shadow-md hover:bg-indigo-100/50 transition-all cursor-pointer text-center"
        >
          <Award className="w-8 h-8 text-indigo-600" />
          <span className="font-sans font-bold text-sm">New Quiz</span>
        </button>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column (Syllabus Active classes) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-slate-900">Active Classes</h3>
            <button className="text-indigo-605 font-sans text-xs hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.filter(c => c.name.includes('Physics') || c.name.includes('Quantum')).map((c) => {
              const acts = c.name.includes('Physics') ? 4 : 8;
              return (
                <div 
                  key={c.id} 
                  className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-hans font-bold text-slate-800 text-[16px] mb-1">{c.name}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">{c.studentsCount} Students • {acts} Pending Grades</p>
                    </div>
                    <div className="p-2 bg-indigo-50 text-indigo-605 rounded-xl">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Progressive indicator */}
                  <div className="space-y-1.5 mb-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <div className="flex justify-between">
                      <span>Syllabus Progress</span>
                      <span>{c.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.progressPercent}%` }}></div>
                    </div>
                  </div>

                  <button className="w-full bg-indigo-600 text-white font-sans text-xs font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all">
                    Grade Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column (Instructors detailed student Grading queue) */}
        <aside className="space-y-6">
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <h4 className="font-display font-semibold text-lg text-slate-950">Quick Grading Queue</h4>
            </div>

            <div className="space-y-3 flex-1">
              {submissions.map((sub) => {
                const isDone = sub.status === 'DONE';
                const isLate = sub.status === 'LATE';

                return (
                  <div key={sub.id} className="flex flex-col p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {sub.studentInitials}
                        </div>
                        <div>
                          <p className="font-sans font-bold text-slate-800 text-xs">{sub.studentName}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{sub.quizTitle}</p>
                        </div>
                      </div>

                      {/* Display Status indicators */}
                      {isDone ? (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200/90 px-2 py-0.5 rounded-full">
                          {sub.grade || 'GRADED'}
                        </span>
                      ) : (
                        <button 
                          onClick={() => openGradingField(sub.id)}
                          className={`text-[9px] font-bold px-2 py-1 rounded-full cursor-pointer hover:brightness-95 transition-all ${
                            isLate 
                              ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isLate ? 'LATE (Grade)' : 'READY (Grade)'}
                        </button>
                      )}
                    </div>

                    {/* Expandable inline Grading form */}
                    {gradingSubmissionId === sub.id && (
                      <form onSubmit={submitGrade} className="mt-3 pt-3 border-t border-slate-200 flex gap-2 animate-fade-in justify-between">
                        <input
                          type="text"
                          value={customGrade}
                          onChange={(e) => setCustomGrade(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:border-indigo-600 bg-white w-28"
                          placeholder="e.g. 95/100"
                          required
                        />
                        <button 
                          type="submit"
                          className="bg-indigo-605 text-white font-sans text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save
                        </button>
                      </form>
                    )}

                  </div>
                );
              })}
            </div>

            <button className="w-full mt-6 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-sans text-xs font-semibold py-3 rounded-xl transition-all">
              Show All submissions
            </button>
          </div>
        </aside>

      </div>

      {/* Simulated Create Class Modal */}
      {showClassModal && (
        <CreateClassModal 
          onClose={() => setShowClassModal(false)}
          onSubmit={(cl) => {
            onAddNewClass(cl);
            setShowClassModal(false);
          }}
        />
      )}

      {/* Simulated Create Quiz Modal */}
      {showQuizModal && (
        <CreateQuizModal 
          onClose={() => setShowQuizModal(false)}
          onSubmit={(qz) => {
            onAddNewQuiz(qz);
            setShowQuizModal(false);
          }}
        />
      )}

    </div>
  );
};
