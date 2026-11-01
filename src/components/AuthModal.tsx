import React, { useState } from 'react';
import { X, GraduationCap, ArrowRight, ShieldCheck, BookOpen, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialRole = 'student',
  onClose,
  onSuccess
}) => {
  const { setCurrentUser } = usePortal();
  
  // 3 Distinct Role Portals
  const [activePortal, setActivePortal] = useState<UserRole>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // Form Fields
  const [identifier, setIdentifier] = useState<string>('CS2026-042');
  const [password, setPassword] = useState<string>('student123');
  const [adminKey, setAdminKey] = useState<string>('admin2026');

  // Register Fields
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>(''); // Roll No or Staff ID
  const [department, setDepartment] = useState<string>('Computer Science & Engineering');

  const [errorNotice, setErrorNotice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Switch Portal tab
  const handleSelectPortal = (role: UserRole) => {
    setActivePortal(role);
    setIsRegisterMode(false);
    setErrorNotice('');
    if (role === 'student') {
      setIdentifier('CS2026-042');
      setPassword('student123');
    } else if (role === 'faculty') {
      setIdentifier('FAC-AI-108');
      setPassword('faculty123');
    } else if (role === 'admin') {
      setIdentifier('admin@campus.edu');
      setPassword('admin123');
      setAdminKey('admin2026');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');
    setLoading(true);

    try {
      let res;
      if (activePortal === 'student') {
        res = await authApi.studentLogin({ identifier, password });
      } else if (activePortal === 'faculty') {
        res = await authApi.facultyLogin({ identifier, password });
      } else {
        res = await authApi.adminLogin({ email: identifier, password, adminKey });
      }

      if (res && res.user) {
        localStorage.setItem('portal_token', res.token);
        localStorage.setItem('portal_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');
    setLoading(true);

    try {
      let res;
      if (activePortal === 'student') {
        res = await authApi.studentRegister({
          name: fullName,
          email,
          studentId: idNumber,
          department,
          password
        });
      } else if (activePortal === 'faculty') {
        res = await authApi.facultyRegister({
          name: fullName,
          email,
          staffId: idNumber,
          department,
          password
        });
      }

      if (res && res.user) {
        localStorage.setItem('portal_token', res.token);
        localStorage.setItem('portal_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md overflow-y-auto animate-fade-down">
      <div className="relative w-full max-w-lg bg-brand-cream rounded-3xl shadow-2xl border border-brand-dark/15 overflow-hidden my-8">
        
        {/* Modal Top Header */}
        <div className="p-6 sm:p-8 bg-white border-b border-brand-dark/10 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-light text-brand-dark/50 hover:text-brand-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-dark text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-lg text-brand-dark tracking-tight">
              CAMPUS<span className="text-brand-green">PORTAL</span>
            </span>
          </div>

          <h3 className="font-display text-2xl font-extrabold text-brand-dark tracking-tight">
            Institutional Role Gate
          </h3>
          <p className="text-xs text-brand-dark/70 mt-1">
            Dedicated multi-tenant gateway with role-segregated authorization.
          </p>

          {/* 3 Distinct Role Portal Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-brand-light rounded-xl mt-6 border border-brand-dark/10">
            <button
              type="button"
              onClick={() => handleSelectPortal('student')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                activePortal === 'student'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-500/20'
                  : 'text-brand-dark/60 hover:text-brand-dark'
              }`}
            >
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-700 font-normal">Roll No / Email</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPortal('faculty')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                activePortal === 'faculty'
                  ? 'bg-white text-blue-800 shadow-sm border border-blue-500/20'
                  : 'text-brand-dark/60 hover:text-brand-dark'
              }`}
            >
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Faculty</span>
              </div>
              <span className="text-[9px] font-mono text-blue-700 font-normal">Staff ID / Email</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPortal('admin')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                activePortal === 'admin'
                  ? 'bg-white text-amber-900 shadow-sm border border-amber-500/20'
                  : 'text-brand-dark/60 hover:text-brand-dark'
              }`}
            >
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Gate</span>
              </div>
              <span className="text-[9px] font-mono text-amber-800 font-normal">Security Key</span>
            </button>
          </div>
        </div>

        {/* Portal Role Badge & Notice */}
        <div className="px-6 sm:px-8 py-3 bg-brand-light/50 border-b border-brand-dark/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              activePortal === 'student' ? 'bg-emerald-600' : activePortal === 'faculty' ? 'bg-blue-600' : 'bg-amber-600'
            }`} />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-dark">
              {activePortal === 'student' && '🎓 Student Portal Access'}
              {activePortal === 'faculty' && '🏛️ Faculty & Staff Gateway'}
              {activePortal === 'admin' && '🛡️ Administrator Management Console'}
            </span>
          </div>

          {activePortal !== 'admin' && (
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-brand-green hover:underline font-semibold"
            >
              {isRegisterMode ? 'Back to Sign In' : 'Create New Account'}
            </button>
          )}
        </div>

        {/* Active Portal Form */}
        <div className="p-6 sm:p-8 bg-white space-y-4">
          
          {errorNotice && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {!isRegisterMode ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1">
                  {activePortal === 'student' && 'Student Roll No / University Email'}
                  {activePortal === 'faculty' && 'Faculty Staff ID / University Email'}
                  {activePortal === 'admin' && 'Administrator Institutional Email'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={activePortal === 'student' ? 'e.g. CS2026-042 or hari@campus.edu' : activePortal === 'faculty' ? 'e.g. FAC-AI-108 or svance@campus.edu' : 'admin@campus.edu'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-mono"
                  required
                />
              </div>

              {activePortal === 'admin' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                      <span>Administrator Security Key</span>
                    </label>
                    <span className="text-[10px] text-amber-700 font-mono">Key: admin2026</span>
                  </div>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter Master Security Key"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs text-brand-dark focus:outline-none focus:border-amber-600 font-mono"
                    required
                  />
                </div>
              )}

              {/* Demo Fill Helper Pill */}
              <div className="p-2.5 rounded-xl bg-brand-light/70 border border-brand-dark/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-brand-dark/60">Demo Credentials:</span>
                <span className="font-bold text-brand-green">
                  {activePortal === 'student' && 'CS2026-042 / student123'}
                  {activePortal === 'faculty' && 'FAC-AI-108 / faculty123'}
                  {activePortal === 'admin' && 'admin@campus.edu / admin123'}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-dark hover:bg-brand-green text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md mt-2 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating with Server...' : `Sign in to ${activePortal.toUpperCase()} Portal`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Form for Student or Faculty */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Harihar Velram"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1">
                  {activePortal === 'student' ? 'Student Roll Number / Enrollment ID' : 'Faculty Staff Employee ID'}
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={activePortal === 'student' ? 'e.g. CS2026-088' : 'e.g. FAC-BIO-204'}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1">
                  Academic Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & AI"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-dark hover:bg-brand-green text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md mt-4 disabled:opacity-50"
              >
                <span>{loading ? 'Registering with Server...' : `Register as ${activePortal.toUpperCase()}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
