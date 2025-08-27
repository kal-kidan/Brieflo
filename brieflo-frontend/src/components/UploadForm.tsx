// src/components/UploadForm.tsx
import { useState } from 'react';
import type { ChangeEvent } from 'react';


function UploadForm() {
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
    formData.append('pdfFlie', file);

    setUploading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/scripts/generate-from-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Upload successful!');
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

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Upload your PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {file && <p className="mt-2">Selected File: {file.name}</p>}
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={uploading || !file}
      >
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}

export default UploadForm;
