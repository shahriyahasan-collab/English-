
import React, { useState, useEffect } from 'react';
import { AICoach } from './components/AICoach';
import { FluencyDashboard } from './components/FluencyDashboard';
import { AuthPage } from './components/AuthPage';
import { 
  LayoutDashboard, 
  BookOpen, 
  Map, 
  Trophy, 
  Users, 
  Mic, 
  Moon, 
  Sun,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize auth state from local storage to persist login across refreshes
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lingua_session') === 'active';
  });

  // Initialize dark mode based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle dark class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogin = () => {
    localStorage.setItem('lingua_session', 'active');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('lingua_session');
    setIsAuthenticated(false);
    // Optional: Reset specific app states if needed
  };

  const menuItems = [
    { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Courses', icon: BookOpen, label: 'Courses' },
    { id: 'Roadmap', icon: Map, label: 'Roadmap' },
    { id: 'Progress', icon: Trophy, label: 'Progress' },
    { id: 'Role-Play', icon: Users, label: 'Role-Play' },
    { id: 'AI Coach', icon: Mic, label: 'AI Coach' },
  ];

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 text-charcoal dark:text-gray-100 transition-colors duration-300 flex font-sans">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-24 flex items-center px-8 border-b border-gray-50 dark:border-gray-800/50">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-lg shadow-teal-500/20">
            <Mic size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal dark:text-white tracking-tight">LinguaLens</h1>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Fluency Coach</p>
          </div>
          <button 
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group
                  ${isActive 
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-charcoal dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon size={20} className={`transition-colors ${isActive ? 'text-teal-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-charcoal dark:text-white truncate">Student Account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Free Plan</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2.5 text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-300 transition-colors rounded-xl hover:bg-teal-50 dark:hover:bg-gray-800"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
             </div>
             <button 
               onClick={handleLogout}
               className="text-xs font-semibold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
             >
               <LogOut size={14} /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scroll-smooth">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Menu size={24} />
              </button>
              <h2 className="font-serif font-bold text-lg text-charcoal dark:text-white">{currentView}</h2>
           </div>
           <div className="w-8 h-8 bg-teal-DEFAULT rounded-lg flex items-center justify-center text-white">
             <Mic size={16} />
           </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {/* View Header (Desktop) */}
          <div className="mb-10 hidden lg:block animate-fade-in">
            <h2 className="text-4xl font-serif font-bold text-charcoal dark:text-white mb-2">{currentView}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {currentView === 'AI Coach' 
                ? 'Analyze your speech patterns and get instant feedback.' 
                : 'Track your daily progress and master English fluency.'}
            </p>
          </div>

          <div className="animate-fade-in-up">
            {currentView === 'AI Coach' ? (
              <AICoach />
            ) : (
              <FluencyDashboard activeView={currentView} onNavigate={setCurrentView} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
