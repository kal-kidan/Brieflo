// src/components/UploadForm.tsx
import { useState } from 'react';
import type { ChangeEvent } from 'react';


type UploadFormProps = {
  onSuccess?: () => void;
  theme?: 'light' | 'dark';
  accentBtn?: string;
};

function UploadForm({ onSuccess, theme = 'light', accentBtn }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    // Backend expects field name 'pdfFile'
    formData.append('pdfFile', file);

    setUploading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/scripts/generate-from-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Upload successful!');
        onSuccess?.();
      } else {
        setMessage('Upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  const subtleText = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const inputStyle = theme === 'dark'
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Upload your PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className={`w-full border ${inputStyle} rounded px-3 py-2`}
      />
      {file && <p className={`mt-2 text-sm ${subtleText}`}>Selected: {file.name}</p>}
      <button
        onClick={handleUpload}
        className={`mt-4 ${accentBtn || 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded disabled:opacity-50`}
        disabled={uploading || !file}
      >
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
      {message && (
        <p className={`mt-3 text-sm ${subtleText}`}>{message}</p>
      )}
    </div>
  );
}

export default UploadForm;
