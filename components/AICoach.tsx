import React, { useState, useRef } from 'react';
import { FileUpload } from './FileUpload';
import { ScopeSelector } from './ScopeSelector';
import { ResultsDisplay } from './ResultsDisplay';
import { analyzeConversation } from '../services/geminiService';
import { MistakeScope, AnalysisState } from '../types';
import { Wand2, Loader2 } from 'lucide-react';

export const AICoach: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scope, setScope] = useState<MistakeScope>(MistakeScope.ME_ONLY);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalysis({ isLoading: true, error: null, result: null });

    try {
      const result = await analyzeConversation(file, scope);
      setAnalysis({ isLoading: false, error: null, result });
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setAnalysis({
        isLoading: false,
        error: err.message || "Something went wrong during analysis.",
        result: null,
      });
    }
  };

  const resetApp = () => {
    setFile(null);
    setAnalysis({ isLoading: false, error: null, result: null });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header within tab */}
      {!analysis.result && (
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">AI Conversation Coach</h2>
          <p className="text-teal-100">Upload your recordings to receive instant feedback on grammar, pronunciation, and phrasing.</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-brownish dark:border-gray-700 p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-charcoal dark:text-white uppercase tracking-wide">
            <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs">1</span>
            Upload Media
          </div>
          <FileUpload selectedFile={file} onFileSelect={setFile} onClear={resetApp} />
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-2 text-sm font-bold text-charcoal dark:text-white uppercase tracking-wide">
            <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs">2</span>
            Choose Analysis Scope
          </div>
          <ScopeSelector scope={scope} onChange={setScope} disabled={analysis.isLoading} />
        </div>

        <div className="pt-4">
          <button
            onClick={handleAnalyze}
            disabled={!file || analysis.isLoading}
            className={`
              w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-md
              ${!file || analysis.isLoading
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-teal-DEFAULT text-white hover:bg-teal-dark hover:shadow-lg hover:-translate-y-0.5'
              }
            `}
          >
            {analysis.isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 />
                Analyze Now
              </>
            )}
          </button>
        </div>
      </div>

      {analysis.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 flex items-start gap-3 animate-fade-in">
          <div className="mt-0.5 font-bold">Error:</div>
          <div>{analysis.error}</div>
        </div>
      )}

      <div ref={resultsRef}>
          {analysis.result && file && (
            <ResultsDisplay result={analysis.result} mediaFile={file} />
          )}
      </div>
    </div>
  );
};