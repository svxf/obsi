import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText } from 'lucide-react';

const Login: React.FC = () => {
  const { authenticate, isLoading, error } = useAppContext();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#1e1e1e]">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <FileText size={64} className="text-[#a47ddc]" />
        </div>
        <h1 className="text-3xl font-bold text-[#dcddde] mb-4">Welcome to Obsi</h1>
        <p className="text-gray-400 mb-8">Connect your Google Drive to get started</p>
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}
        <button
          onClick={authenticate}
          disabled={isLoading}
          className="px-6 py-3 bg-[#a47ddc] text-white rounded-lg hover:bg-[#8e6cc0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Connecting...' : 'Connect Google Drive'}
        </button>
      </div>
    </div>
  );
};

export default Login; 