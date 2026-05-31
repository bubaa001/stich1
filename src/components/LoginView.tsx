import React, { useState } from 'react';
import { UserRole } from '../types';
import { School, Award, ArrowRight } from 'lucide-react';

import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { School, Award, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (userProfile: UserProfile, role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('alex_stone');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [email, setEmail] = useState('alex.rivera@school.edu');
  const [name, setName] = useState('Alex Rivera');
  const [roleSelect, setRoleSelect] = useState<UserRole>('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (activeTab === 'register' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (activeTab === 'login') {
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error || 'Authentication failed');
        }
        
        onLoginSuccess(data.user, data.user.role);
      } else {
        const resp = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            email,
            name,
            role: roleSelect
          })
        });
        
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        
        onLoginSuccess(data.user, data.user.role);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (usr: string) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usr, password: 'password123' })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error);
      }
      onLoginSuccess(data.user, data.user.role);
    } catch (err: any) {
      setErrorMsg(`Demo login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 to-indigo-50/50 flex items-center justify-center p-4 md:p-8">
      {/* Decorative Atmosphere Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-[120px] -z-10"></div>

      <main className="w-full max-w-[1024px] grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(108,59,255,0.12)] border border-[#EEEAFF] animate-fade-in relative z-10">
        
        {/* Left Side: Brand Visual Panel (Visible on Desktop) */}
        <div className="purple-card-gradient hidden md:flex flex-col justify-between p-12 text-white relative overflow-hidden">
          {/* Abstract background overlays */}
          <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-[60px]"></div>
          <div className="absolute bottom-[-10%] left-[-20%] w-[280px] h-[280px] bg-indigo-500/30 rounded-full blur-[50px]"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-md">
                <School className="w-8 h-8 text-white" />
              </div>
              <span className="font-display font-bold text-3xl tracking-tight">aris4.0</span>
            </div>
            
            <h2 className="font-display font-bold text-[40px] leading-[48px] tracking-tight mb-6">
              Ignite your <br/>learning journey.
            </h2>
            <p className="font-sans text-base text-indigo-100 font-normal leading-relaxed max-w-sm mb-8">
              The premium educational arena where secondary school students compete, grow, and master their academic future.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
              <div className="w-11 h-11 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-sans font-bold text-[15px] text-white">Join 15,000+ Students</p>
                <p className="font-sans text-xs text-indigo-200">Compete for the weekly dashboard leaderboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Forms */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            
            {/* Logo in view for Mobile */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <School className="w-6 h-6" />
              </div>
              <span className="font-display text-2xl font-bold text-indigo-900 tracking-tight">aris4.0</span>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Welcome to aris4.0</h1>
              <p className="text-sm text-slate-500 mt-1">Please log in to continue your path.</p>
            </div>

            {/* Switchable Authentication Tab Selector */}
            <div className="flex mb-6 bg-slate-100/90 p-1 rounded-xl border border-slate-200/50">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-500 hover:text-indigo-950'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-500 hover:text-indigo-950'
                }`}
              >
                Register
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-655 text-xs font-semibold rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {/* Authenticating Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 px-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200/80 focus:border-indigo-600 focus:ring-0 transition-all font-sans text-[15px] text-slate-800"
                      placeholder="e.g. Alex Rivera"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 px-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200/80 focus:border-indigo-600 focus:ring-0 transition-all font-sans text-[15px] text-slate-800"
                      placeholder="e.g. alex@school.edu"
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 px-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-200/80 focus:border-indigo-600 focus:ring-0 transition-all font-sans text-[15px] text-slate-800"
                  placeholder="e.g. alex_stone"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  {activeTab === 'login' && (
                    <a href="#forgot" className="text-xs font-medium text-indigo-600 hover:underline">Forgot?</a>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-200/80 focus:border-indigo-600 focus:ring-0 transition-all font-sans text-[15px]"
                  placeholder="••••••••"
                  required
                />
              </div>

              {activeTab === 'register' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-xs font-semibold text-slate-600 px-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200/80 focus:border-indigo-600 focus:ring-0 transition-all font-sans text-[15px]"
                    required
                  />
                </div>
              )}

              {/* Role Selection Panel for registration */}
              {activeTab === 'register' && (
                <div className="space-y-1 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/30">
                  <label className="text-[11px] font-bold text-indigo-900 tracking-wider uppercase">Select Registering Role:</label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    <label className="flex flex-col items-center justify-center p-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="role-select"
                        checked={roleSelect === 'student'}
                        onChange={() => setRoleSelect('student')}
                        className="text-indigo-600 focus:ring-indigo-500 scale-75"
                      />
                      <span className="text-[10px] font-bold text-indigo-950 mt-1">Student</span>
                    </label>

                    <label className="flex flex-col items-center justify-center p-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="role-select"
                        checked={roleSelect === 'instructor'}
                        onChange={() => setRoleSelect('instructor')}
                        className="text-indigo-600 focus:ring-indigo-500 scale-75"
                      />
                      <span className="text-[10px] font-bold text-indigo-950 mt-1">Instructor</span>
                    </label>

                    <label className="flex flex-col items-center justify-center p-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="role-select"
                        checked={roleSelect === 'admin'}
                        onChange={() => setRoleSelect('admin')}
                        className="text-indigo-600 focus:ring-indigo-500 scale-75"
                      />
                      <span className="text-[10px] font-bold text-indigo-950 mt-1">Admin</span>
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 purple-card-gradient text-white font-sans text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shine-effect mt-6 disabled:opacity-50"
              >
                <span>{isLoading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Create Account'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase text-slate-400">
                <span className="bg-white px-3">Or continue with</span>
              </div>
            </div>

            {/* Social options */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleQuickLogin('sarah_j')}
                className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-slate-150 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
              >
                <img
                  alt="Google"
                  className="w-4 h-4"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpNeRPWvZlrVbB0-AKW3DGP6KLoxokVpLEKM8GXZX_bEKuhlEQfJvYwRG8ThOj6a2j2P55rHpeNlo8du5hBMFAdb8x4hvFfVWBVoMPfKmcQVm8qx5CkzhMeMPC7GkXKFEdV71oLh63wGmYpmEGg5pf5QwrqjlN-76MWOmbnBTfMi7VBoBxVdII56qJSjQYU4C_G0J2DhjKGjOWAW10t01SVtD_fQNIcC1ncm79Kb_GrFYRs9HqvB50_2fRCmhYWIN0tB_dWBOtlCA"
                />
                Sarah (Google)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('mike_t')}
                className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-slate-150 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700"
              >
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px]">M</span>
                Mike (Apple)
              </button>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => handleQuickLogin('mia_stone')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
              >
                Apply as Instructor (Mia Stone)
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};
