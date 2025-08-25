// src/App.jsx
import UploadForm from './components/UploadForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Brieflo 📄</h1>
      <UploadForm />
    </div>
  );
}

export default App;
