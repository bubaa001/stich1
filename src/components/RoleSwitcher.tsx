import React from 'react';
import { UserRole } from '../types';
import { Shield, GraduationCap, Users, LogOut } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col md:flex-row items-center gap-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-mono text-[11px] text-slate-300 tracking-wider uppercase font-bold">aris4.0 Simulator Controls:</span>
      </div>
      
      <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
        <button
          onClick={() => onRoleChange('student')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentRole === 'student'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Student View
        </button>

        <button
          onClick={() => onRoleChange('instructor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentRole === 'instructor'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Instructor View
        </button>

        <button
          onClick={() => onRoleChange('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentRole === 'admin'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Admin View
        </button>

        <button
          onClick={() => onRoleChange('anonymous')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentRole === 'anonymous'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout / Gateway
        </button>
      </div>
    </div>
  );
};
