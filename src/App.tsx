import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { AppContextProvider, useAppContext } from './context/AppContext';
import LoadingSkeleton from './components/LoadingSkeleton';
import Login from './components/Login';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Layout />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // todo: this is bad! 🤮
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;