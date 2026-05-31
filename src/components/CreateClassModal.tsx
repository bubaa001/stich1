import React, { useState } from 'react';
import { ClassProgress } from '../types';
import { X, Check } from 'lucide-react';

interface CreateClassModalProps {
  onClose: () => void;
  onSubmit: (cls: ClassProgress) => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ onClose, onSubmit }) => {
  const [className, setClassName] = useState('Mathematics Form 4');
  const [instructor, setInstructor] = useState('Prof. Smith');
  const [room, setRoom] = useState('Section A • Room 402');

  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassProgress = {
      id: `c-added-${Date.now()}`,
      name: className,
      instructor,
      instructorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=155&h=155',
      progressPercent: 10,
      studentsCount: 20,
      newActivitiesCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400&h=200',
      roomName: room
    };
    onSubmit(newClass);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative border border-slate-100 text-left">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-display font-semibold text-lg text-slate-900">Create New Class</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleClassSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-205 focus:border-indigo-600 focus:outline-none text-xs text-slate-800 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Lead Instructor</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-205 focus:border-indigo-600 focus:outline-none text-xs text-slate-800 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Section Room Location</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-205 focus:border-indigo-600 focus:outline-none text-xs text-slate-800 bg-slate-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-indigo-600 text-white font-sans text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" />
            Launch Active Class
          </button>
        </form>
      </div>
    </div>
  );
};
