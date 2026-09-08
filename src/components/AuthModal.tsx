import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAuth, HARDCODED_ADMIN_EMAIL, HARDCODED_ADMIN_PASSWORD } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    loading,
    error,
    clearError
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enableAdminAccess, setEnableAdminAccess] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Real-time admin credential validation
  const isAdminEmail = loginEmail.trim().toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase();
  const isAdminPasswordValid = isAdminEmail && loginPassword.trim() === HARDCODED_ADMIN_PASSWORD;
  const isInvalidAdminPassword = isAdminEmail && loginPassword.length > 0 && !isAdminPasswordValid;

  // Auto-enable admin privileges when admin credentials are validated
  useEffect(() => {
    if (isAdminPasswordValid) {
      setEnableAdminAccess(true);
    }
  }, [isAdminPasswordValid]);

  if (!isAuthModalOpen) return null;

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    clearError();
    setValidationError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!loginEmail.trim() || !loginPassword) {
      setValidationError('Please enter both email and password.');
      return;
    }

    if (isAdminEmail && !isAdminPasswordValid) {
      setValidationError('Invalid administrator password. Please check your credentials.');
      return;
    }

    try {
      await login(loginEmail.trim(), loginPassword, enableAdminAccess);
      // Closed upon success
    } catch {
      // Error handled by context
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!regName.trim() || regName.trim().length < 2) {
      setValidationError('Please provide your name (at least 2 characters).');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 4) {
      setValidationError('Password must be at least 4 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setValidationError('Passwords do not match. Please re-type.');
      return;
    }

    try {
      await register(regName.trim(), regEmail.trim(), regPassword);
    } catch {
      // Error handled by context
    }
  };

  const displayError = validationError || error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-3 shadow-inner">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              {authModalTab === 'login' ? 'Welcome to MovieLot' : 'Join MovieLot'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {authModalTab === 'login'
                ? 'Sign in to access your curated watchlist and recommendations.'
                : 'Create an account to save favorites and unlock full discovery features.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'login'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'register'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{displayError}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Email or Gmail
                  </label>
                  {isAdminEmail && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Shield size={10} /> Root Admin
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border text-white text-sm placeholder-zinc-500 transition-colors outline-none ${
                      isAdminEmail
                        ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                        : 'border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  {isAdminPasswordValid && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle size={11} /> Password Verified
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border text-white text-sm placeholder-zinc-500 transition-colors outline-none ${
                      isAdminPasswordValid
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : isInvalidAdminPassword
                        ? 'border-red-500/70 focus:border-red-400'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Real-time Admin Validation & Access Toggle */}
              {isAdminEmail && (
                <div className={`p-3.5 rounded-xl border transition-all ${
                  isAdminPasswordValid
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-400'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isAdminPasswordValid ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {isAdminPasswordValid ? <ShieldCheck size={18} /> : <Shield size={18} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Root Administrator Access</span>
                          {isAdminPasswordValid ? (
                            <span className="text-[10px] text-emerald-400 font-semibold">(Verified)</span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-semibold">(Verification Required)</span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                          {isAdminPasswordValid
                            ? enableAdminAccess
                              ? 'Admin privileges will be toggled ON. You will have full access to the administration portal.'
                              : 'Admin privileges toggled OFF. Signing in under standard member preview mode.'
                            : 'Enter root administrator password to enable dashboard access.'}
                        </div>
                      </div>
                    </div>

                    {/* Toggle Admin Access Switch */}
                    {isAdminPasswordValid && (
                      <button
                        type="button"
                        onClick={() => setEnableAdminAccess(!enableAdminAccess)}
                        className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        title={enableAdminAccess ? 'Toggle Admin Access Off' : 'Toggle Admin Access On'}
                      >
                        {enableAdminAccess ? (
                          <ToggleRight size={28} className="text-amber-400 fill-amber-500/20" />
                        ) : (
                          <ToggleLeft size={28} className="text-zinc-600" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Validating credentials...</span>
                  </>
                ) : isAdminPasswordValid ? (
                  <>
                    <ShieldCheck size={16} />
                    <span>
                      {enableAdminAccess ? 'Sign In & Toggle Admin Access ON' : 'Sign In as Standard Member'}
                    </span>
                  </>
                ) : (
                  <span>Sign In to MovieLot</span>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm placeholder-zinc-500 transition-colors outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Email or Gmail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm placeholder-zinc-500 transition-colors outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm placeholder-zinc-500 transition-colors outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm placeholder-zinc-500 transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                <CheckCircle size={14} className="text-amber-500 shrink-0" />
                <span>Instant access to unlimited watchlists & AI recommendations</span>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Free Account</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
