import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Toolbar from './Toolbar';
import TabBar from './TabBar';
import CommandPalette from './CommandPalette';
import E from './E';
import LoadingIndicator from './LoadingIndicator';

const Layout: React.FC = () => {
  const { 
    leftSidebarOpen, 
    rightSidebarOpen, 
    activeTab, 
    isOpeningFile,
    isSavingFile,
    commandPaletteOpen,
    toggleCommandPalette
  } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // command palette (Ctrl+P)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleCommandPalette]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-[#dcddde] overflow-hidden">
      <Toolbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div 
          className={`border-r border-[#333] transition-all duration-200 ${
            leftSidebarOpen ? 'w-60' : 'w-0 opacity-0'
          }`}
        >
          {leftSidebarOpen && <LeftSidebar />}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabBar />
          <div className="flex-1 overflow-auto">
            {isOpeningFile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                <div className="flex flex-col items-center gap-2">
                  <LoadingIndicator size="large" />
                  <p className="text-white-600">Opening file...</p>
                </div>
              </div>
            )}

            {activeTab ? (
              <E note={activeTab.note}/>
              // <Editor note={activeTab.note} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No note open</p>
              </div>
            )}

            {isSavingFile && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#252525] px-3 py-2 rounded-lg shadow-md">
                <LoadingIndicator size="small" />
                <span className="text-sm text-white-600">Saving...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div 
          className={`border-l border-[#333] transition-all duration-200 ${
            rightSidebarOpen ? 'w-60' : 'w-0 opacity-0'
          }`}
        >
          {rightSidebarOpen && <RightSidebar />}
        </div>
      </div>

      {/* Command Palette */}
      {commandPaletteOpen && <CommandPalette />}
    </div>
  );
};

export default Layout;