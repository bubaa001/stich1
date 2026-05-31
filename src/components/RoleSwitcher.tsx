import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { Shield, GraduationCap, Users, LogOut, GripVertical, Minimize2, Maximize2 } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const [isMinimized, setIsMinimized] = React.useState(false);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ x: 0, y: 0 }}
      className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-[9999] bg-slate-950/95 text-white p-3 rounded-2xl shadow-2xl border border-slate-800/80 flex flex-col gap-2.5 backdrop-blur-md cursor-grab active:cursor-grabbing select-none transition-all duration-350 ${
        isMinimized ? 'w-[180px]' : 'w-[280px] md:w-[320px]'
      }`}
      title="Drag me anywhere!"
    >
      {/* Draggable and Minimizable Header */}
      <header className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 w-full">
        <div className="flex items-center gap-1.5 text-slate-305">
          <GripVertical className="w-3.5 h-3.5 text-slate-500 shrink-0 pointer-events-none" />
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[9px] text-slate-400 tracking-wider uppercase font-bold">Simulator</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isMinimized && (
            <span className="font-mono text-[8px] bg-slate-800/60 text-slate-300 font-extrabold px-1.5 py-0.5 rounded border border-slate-700/50 uppercase scale-90">
              {currentRole}
            </span>
          )}
          {/* Minimize Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1 rounded-md hover:bg-slate-800/80 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0 border border-slate-800/40"
            title={isMinimized ? "Maximize Control Panel" : "Minimize Control Panel"}
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </button>
        </div>
      </header>
      
      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div 
            key="expanded-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-1.5 w-full overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
              <button
                onClick={() => onRoleChange('student')}
                className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  currentRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                Student
              </button>

              <button
                onClick={() => onRoleChange('instructor')}
                className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  currentRole === 'instructor'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5 shrink-0" />
                Instructor
              </button>

              <button
                onClick={() => onRoleChange('admin')}
                className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                Admin
              </button>

              <button
                onClick={() => onRoleChange('anonymous')}
                className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  currentRole === 'anonymous'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                Logout
              </button>
            </div>
            <p className="text-[9px] text-slate-500 font-medium text-center">Drag panel to position anywhere on screen</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
