
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Globe, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    if (type === 'success') {
        setTimeout(() => setNotification(null), 3000);
    }
  };

  // Mock Backend Helpers
  const getUsers = () => {
    const users = localStorage.getItem('lingua_mock_users');
    return users ? JSON.parse(users) : {};
  };

  const saveUser = (email: string, pass: string) => {
    const users = getUsers();
    users[email] = pass;
    localStorage.setItem('lingua_mock_users', JSON.stringify(users));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);

    const users = getUsers();

    if (authMode === 'forgot') {
        if (users[email]) {
            showNotification(`Reset link sent to ${email}`, 'success');
            setTimeout(() => setAuthMode('login'), 2000);
        } else {
            showNotification("No account found with this email address.", 'error');
        }
        return;
    }

    if (authMode === 'signup') {
        if (users[email]) {
            showNotification("Account already exists. Please log in.", 'error');
        } else {
            saveUser(email, password);
            showNotification("Account created successfully!", 'success');
            setTimeout(() => onLogin(), 1000);
        }
    } else {
        // Login Logic
        if (!users[email]) {
            showNotification("Account not found. Please sign up.", 'error');
        } else if (users[email] !== password) {
            showNotification("Incorrect password. Please try again.", 'error');
        } else {
            onLogin();
        }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setNotification(null);
    // Simulate Google Popup interaction and OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setIsLoading(false);
    
    // Show success feedback before redirecting
    showNotification("Successfully logged in with Google", 'success');
    
    // Short delay to allow user to read the success message
    setTimeout(() => onLogin(), 1000);
  };

  // Render logic helpers
  const isForgot = authMode === 'forgot';
  const title = isForgot ? 'Reset Password' : (authMode === 'login' ? 'Welcome Back' : 'Create Account');
  const subtitle = isForgot 
    ? 'Enter your email to receive a reset link.' 
    : (authMode === 'login' ? 'Continue your journey to fluency.' : 'Start mastering English today.');

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-950 p-4 transition-colors duration-300 font-sans">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* Notification Toast */}
        {notification && (
            <div className={`absolute top-0 left-0 w-full text-white text-sm font-bold py-3 px-4 text-center animate-fade-in flex items-center justify-center gap-2 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {notification.message}
            </div>
        )}

        {/* Header */}
        <div className="px-8 pt-12 pb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/30">
            <Globe size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-charcoal dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-10 space-y-6">
          
          {!isForgot && (
              <>
                {/* Google Button */}
                <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors font-medium text-charcoal dark:text-gray-200 shadow-sm relative overflow-hidden group"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Continue with Google</span>
                    {isLoading && <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center"><Loader2 size={20} className="animate-spin text-teal-600" /></div>}
                </button>

                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-gray-400 uppercase font-bold tracking-wider">Or with email</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                </div>
              </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-charcoal dark:text-white placeholder-gray-400"
                />
              </div>
            </div>

            {!isForgot && (
                <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-charcoal dark:text-white placeholder-gray-400"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                </div>
            )}

            {authMode === 'login' && (
              <div className="flex justify-end">
                <button 
                    type="button" 
                    onClick={() => {
                        setAuthMode('forgot');
                        setNotification(null);
                    }}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                ${isLoading ? 'bg-teal-600/80 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500'}
              `}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isForgot ? 'Send Reset Link' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
          {isForgot ? (
              <button 
                onClick={() => {
                    setAuthMode('login');
                    setNotification(null);
                }}
                className="flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                  <ArrowLeft size={16} /> Back to Login
              </button>
          ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login');
                      setNotification(null);
                  }}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline ml-1"
                >
                  {authMode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
          )}
        </div>
      </div>
    </div>
  );
};
