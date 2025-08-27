import { useEffect, useState } from 'react';

type ScriptItem = {
  _id: string;
  pdfFilePath: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ScriptsListProps = {
  refreshTrigger?: number;
  theme?: 'light' | 'dark';
  neutralBtn?: string;
  accentBtn?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function ScriptsList({ refreshTrigger = 0, theme = 'light', neutralBtn, accentBtn }: ScriptsListProps) {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchScripts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/scripts`);
      if (!res.ok) throw new Error('Failed to fetch scripts');
      const data = await res.json();
      setScripts(data);
    } catch (e) {
      setError('Failed to load scripts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/scripts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchScripts();
    } catch (e) {
      setError('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const subtleText = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const borderCol = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';
  const summaryText = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';
  const preBg = theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Scripts</h2>
        <button
          onClick={fetchScripts}
          className={`text-sm text-white px-3 py-1 rounded ${neutralBtn || 'bg-slate-800 hover:bg-slate-700'}`}
        >
          Refresh
        </button>
      </div>
      {loading && <p className={subtleText}>Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && scripts.length === 0 && (
        <p className={subtleText}>No scripts yet. Upload a PDF to get started.</p>
      )}
      <ul className="space-y-3">
        {scripts.map((s) => (
          <li key={s._id} className={`border ${borderCol} rounded p-3`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${subtleText}`}>{new Date(s.createdAt).toLocaleString()}</p>
                <p className="text-sm break-all">Path: {s.pdfFilePath}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(s.content)}
                  className={`text-sm text-white px-3 py-1 rounded ${accentBtn || 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-sm bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            <details className="mt-2">
              <summary className={`cursor-pointer text-sm ${summaryText}`}>Show content</summary>
              <pre className={`mt-2 whitespace-pre-wrap text-sm ${preBg} p-2 rounded max-h-64 overflow-auto`}>{s.content}</pre>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}


