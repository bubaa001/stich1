import React, { useState } from 'react';
import { UserProfile, ConfigSettings } from '../types';
import { Sparkles, Trash2, ShieldAlert, Award, Sliders, Settings, Users, Percent, Flame } from 'lucide-react';

interface SimulatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  year?: string;
  subject?: string;
  avatar: string;
}

interface AdminDashboardProps {
  user: UserProfile;
  simulatedUsers: SimulatedUser[];
  config: ConfigSettings;
  onDeleteSimulatedUser: (id: string) => void;
  onUpdateConfig: (newConfig: ConfigSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  simulatedUsers,
  config,
  onDeleteSimulatedUser,
  onUpdateConfig
}) => {
  const [multiplier, setMultiplier] = useState(config.xpMultiplier);
  const [decay, setDecay] = useState(config.xpDecayRate);
  const [explorerVal, setExplorerVal] = useState(config.milestones.explorer);
  const [championVal, setChampionVal] = useState(config.milestones.champion);
  const [legendVal, setLegendVal] = useState(config.milestones.legend);
  const [doubleXpActive, setDoubleXpActive] = useState(false);

  const handleApplySettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      xpMultiplier: multiplier,
      xpDecayRate: decay,
      eventMultiplier: doubleXpActive ? 2.0 : 1.5,
      milestones: {
        explorer: Number(explorerVal),
        champion: Number(championVal),
        legend: Number(legendVal)
      }
    });
  };

  const toggleDoubleXp = () => {
    const nextVal = !doubleXpActive;
    setDoubleXpActive(nextVal);
    onUpdateConfig({
      ...config,
      xpMultiplier: nextVal ? multiplier * 2 : multiplier,
      eventMultiplier: nextVal ? 2.0 : 1.0
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in text-left">
      
      {/* Header Banner */}
      <section className="bg-[#1E1B4B] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-505/20 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Aris Administration Controls</span>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl leading-tight">Gamification Engine Settings</h2>
          <p className="text-indigo-200 text-xs md:text-sm font-sans max-w-xl">
            Configure system parameters, XP decay algorithms, verify educator account statuses, or activate global double-XP learning surges!
          </p>
        </div>
      </section>

      {/* Grid metrics blocks */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Users Stat card */}
        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold">Active Users Simulator</p>
            <h4 className="font-display font-bold text-2xl text-slate-900 mt-0.5">{simulatedUsers.length} Logged</h4>
          </div>
        </div>

        {/* Global usage */}
        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold">Class Usage Index</p>
            <h4 className="font-display font-bold text-2xl text-slate-900 mt-0.5">88.4% Rate</h4>
          </div>
        </div>

        {/* Surge Activations Status */}
        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF] flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold">Surge Action Status</p>
            <h4 className="font-display font-bold text-lg text-slate-900 mt-0.5">
              {doubleXpActive ? '🔥 DOUBLE XP ACTIVE' : 'Inactive'}
            </h4>
          </div>
        </div>

      </section>

      {/* Configurator Panels and User tables split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column (Users dashboard delete actions) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF]">
          <h3 className="font-display font-semibold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            User Account Simulator
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase">
                  <th className="py-3 px-2">Account Name</th>
                  <th className="py-3 px-2">System Role</th>
                  <th className="py-3 px-2">Context Metric</th>
                  <th className="py-3 px-2 text-right">Disconnect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {simulatedUsers.map((usr) => (
                  <tr key={usr.id} className="text-xs hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-2 flex items-center gap-3 font-semibold text-slate-800">
                      <img 
                        src={usr.avatar} 
                        alt={usr.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{usr.name}</span>
                    </td>
                    <td className="py-3.5 px-2 font-display font-bold uppercase text-[10px] tracking-widest">
                      <span className={`px-2 py-0.5 rounded ${
                        usr.role === 'instructor' 
                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                          : 'bg-indigo-50 text-indigo-805'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-500 font-sans">
                      {usr.year || usr.subject || 'All Curriculum'}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <button 
                        onClick={() => onDeleteSimulatedUser(usr.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column (Gamification Sliders) */}
        <aside className="bg-white rounded-3xl p-6 card-shadow border border-[#EEEAFF]">
          <h3 className="font-display font-semibold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Engine Sliders
          </h3>

          <form onSubmit={handleApplySettings} className="space-y-6">
            
            {/* Surge multiplier slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>XP Reward Multiplier</span>
                <span className="text-indigo-650 font-mono font-extrabold">{multiplier}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-ew-resize"
              />
            </div>

            {/* Decay slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>XP Decay Rate/Day</span>
                <span className="text-amber-600 font-mono font-extrabold">{Math.round(decay * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.5"
                step="0.05"
                value={decay}
                onChange={(e) => setDecay(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-ew-resize"
              />
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Title milestones inputs */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Milestones (Thresholds)</h4>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Explorer</label>
                  <input
                    type="number"
                    value={explorerVal}
                    onChange={(e) => setExplorerVal(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center font-bold font-mono focus:border-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Champion</label>
                  <input
                    type="number"
                    value={championVal}
                    onChange={(e) => setChampionVal(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center font-bold font-mono focus:border-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Legend</label>
                  <input
                    type="number"
                    value={legendVal}
                    onChange={(e) => setLegendVal(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center font-bold font-mono focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Special event Double-XP active surge */}
            <div className="flex items-center justify-between p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
              <div>
                <p className="text-xs font-bold text-indigo-950">SURGE DOUBLE XP EVENT</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Launches Double XP on student dashboards</p>
              </div>

              <button
                type="button"
                onClick={toggleDoubleXp}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  doubleXpActive ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    doubleXpActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold rounded-xl active:scale-95 transition-all text-center"
            >
              Apply Global Formulas
            </button>

          </form>
        </aside>

      </div>

    </div>
  );
};
