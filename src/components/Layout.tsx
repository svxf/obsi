import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Editor from './Editor';
import Toolbar from './Toolbar';
import TabBar from './TabBar';
import CommandPalette from './CommandPalette';
import E from './E';

const Layout: React.FC = () => {
  const { 
    leftSidebarOpen, 
    rightSidebarOpen, 
    activeTab, 
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
            {activeTab ? (
              <E note={activeTab.note}/>
              // <Editor note={activeTab.note} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No note open</p>
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