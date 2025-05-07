import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Menu, FileText, Grape as Graph, Search, ChevronLeft, ChevronRight, LayoutPanelLeft, PanelRight as LayoutPanelRight, Circle } from 'lucide-react';

const Toolbar: React.FC = () => {
  const { 
    leftSidebarOpen, 
    rightSidebarOpen, 
    toggleLeftSidebar, 
    toggleRightSidebar,
    toggleCommandPalette,
    createNewNote,
    logout
  } = useAppContext();
  
  return (
    <div className="flex items-center p-1 border-b border-[#333] bg-[#1e1e1e] text-[#dcddde]">
      {/* Left Section */}
      <div className="flex items-center space-x-1">
        <button 
          className="p-1 rounded hover:bg-[#2a2a2a]"
          onClick={toggleLeftSidebar}
        >
          <Menu size={16} className="text-gray-500" />
        </button>
        
        {/* temporary new note button */}
        <button 
          className="p-1 rounded hover:bg-[#2a2a2a]"
          onClick={() => createNewNote('test', 'emp')}
        >
          <FileText size={16} className="text-gray-500" />
        </button>
        
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <Graph size={16} className="text-gray-500" />
        </button>
        
        <button 
          className="p-1 rounded hover:bg-[#2a2a2a]"
          onClick={toggleCommandPalette}
        >
          <Search size={16} className="text-gray-500" />
        </button>
      </div>
      
      {/* Middle Section */}
      <div className="flex-1 flex justify-center space-x-2">
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <ChevronLeft size={16} className="text-gray-500" />
        </button>
        
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>
      
      {/* Right Section */}
      <div className="flex space-x-1">
        <button 
          className={`p-1 rounded hover:bg-[#2a2a2a] ${leftSidebarOpen ? 'bg-[#2a2a2a]' : ''}`}
          onClick={toggleLeftSidebar}
        >
          <LayoutPanelLeft size={16} className={leftSidebarOpen ? 'text-[#a47ddc]' : 'text-gray-500'} />
        </button>
        
        <button 
          className={`p-1 rounded hover:bg-[#2a2a2a] ${rightSidebarOpen ? 'bg-[#2a2a2a]' : ''}`}
          onClick={toggleRightSidebar}
        >
          <LayoutPanelRight size={16} className={rightSidebarOpen ? 'text-[#a47ddc]' : 'text-gray-500'} />
        </button>

        <button
          onClick={logout}
          className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:bg-gray-100 transition-colors"
          title={'Logout'}
        >
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              ?
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;