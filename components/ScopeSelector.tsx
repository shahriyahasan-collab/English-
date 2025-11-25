import React from 'react';
import { MistakeScope } from '../types';
import { User, Users } from 'lucide-react';

interface ScopeSelectorProps {
  scope: MistakeScope;
  onChange: (scope: MistakeScope) => void;
  disabled?: boolean;
}

export const ScopeSelector: React.FC<ScopeSelectorProps> = ({ scope, onChange, disabled }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button
        onClick={() => onChange(MistakeScope.ME_ONLY)}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200
          ${scope === MistakeScope.ME_ONLY 
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-200 dark:ring-indigo-900 ring-offset-2 dark:ring-offset-gray-800' 
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <User size={20} />
        <div className="text-left">
          <span className="block font-semibold text-sm uppercase tracking-wide">Analyze Me Only</span>
          <span className="block text-xs opacity-70">Focus on my grammar errors</span>
        </div>
      </button>

      <button
        onClick={() => onChange(MistakeScope.BOTH)}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200
          ${scope === MistakeScope.BOTH 
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-200 dark:ring-indigo-900 ring-offset-2 dark:ring-offset-gray-800' 
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Users size={20} />
        <div className="text-left">
          <span className="block font-semibold text-sm uppercase tracking-wide">Analyze Both</span>
          <span className="block text-xs opacity-70">Check errors for everyone</span>
        </div>
      </button>
    </div>
  );
};