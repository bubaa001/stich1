import React, { useState } from 'react';
import { Quiz } from '../types';
import { X, Check } from 'lucide-react';

interface CreateQuizModalProps {
  onClose: () => void;
  onSubmit: (quiz: Quiz) => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('Algebra Challenge');
  const [className, setClassName] = useState('Mathematics Form 4');
  const [reward, setReward] = useState('500');

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuiz: Quiz = {
      id: `q-added-${Date.now()}`,
      title,
      className,
      xpReward: parseInt(reward) || 500,
      dueDate: 'Due Friday',
      totalQuestions: 3,
      completed: false,
      questions: [
        {
          id: `q-sub-${Date.now()}-1`,
          category: 'INEQUALITIES',
          text: 'Solve inequality:',
          expression: 'x - 4 > 6',
          options: ['x > 10', 'x > 2', 'x < 10', 'x = 10'],
          correctAnswerIndex: 0
        }
      ]
    };
    onSubmit(newQuiz);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative border border-slate-100 text-left">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-display font-semibold text-lg text-slate-900">Create New Quiz</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitQuiz} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-205 focus:border-indigo-600 focus:outline-none text-xs text-slate-800 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Target Class</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-205 focus:border-indigo-600 focus:outline-none text-xs text-slate-800 bg-slate-50"
            >
              <option value="Mathematics Form 4">Mathematics Form 4</option>
              <option value="Advanced Physics (S4-A)">Advanced Physics (S4-A)</option>
              <option value="Intro to Quantum Computing">Intro to Quantum Computing</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">XP Reward</label>
            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-205 focus:border-indigo-600 focus:outline-none text-xs text-slate-800 bg-slate-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-indigo-600 text-white font-sans text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" />
            Publish Quiz Challenge
          </button>
        </form>
      </div>
    </div>
  );
};
