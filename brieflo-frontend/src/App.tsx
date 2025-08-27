// src/App.jsx
import UploadForm from './components/UploadForm';
import ScriptsList from './components/ScriptsList';
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Dashboard-only list is delegated to ScriptsList component

function App() {
  const [refreshTick, setRefreshTick] = useState<number>(0);
  const triggerRefresh = () => setRefreshTick((v) => v + 1);

  type Theme = 'light' | 'dark';
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem('brieflo-theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else {
      // Respect system preference on first load
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('brieflo-theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';
  const bgApp = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const headerBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const subtleText = isDark ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-200';
  const accentBtn = isDark ? 'bg-violet-500 hover:bg-violet-600' : 'bg-indigo-600 hover:bg-indigo-700';
  const neutralBtn = isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700';

  return (
    <div className={`min-h-screen ${bgApp} ${textPrimary}`}>
      <header className={`${headerBg} border-b`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-md ${isDark ? 'bg-violet-500' : 'bg-indigo-600'}`}></div>
            <h1 className="text-2xl font-bold">Brieflo</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${subtleText}`}>AI script generator</span>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`text-sm px-3 py-1.5 rounded ${neutralBtn} text-white`}
              aria-label="Toggle theme"
            >
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-1">
          <div className={`${cardBg} border ${cardBorder} p-6 rounded-lg shadow-sm`}>
            <h2 className="text-lg font-semibold mb-2">Upload PDF</h2>
            <p className={`text-sm mb-4 ${subtleText}`}>Upload a PDF to generate a script.</p>
            <UploadForm onSuccess={triggerRefresh} theme={theme} accentBtn={accentBtn} />
          </div>
        </section>
        <section className="md:col-span-2">
          <div className={`${cardBg} border ${cardBorder} p-0 rounded-lg shadow-sm`}>
            <div className="p-6">
              <ScriptsList refreshTrigger={refreshTick} theme={theme} neutralBtn={neutralBtn} accentBtn={accentBtn} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
