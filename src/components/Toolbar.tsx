import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Menu, FileText, Grape as Graph, Search, ChevronLeft, ChevronRight, LayoutPanelLeft, PanelRight as LayoutPanelRight } from 'lucide-react';

const Toolbar: React.FC = () => {
  const { 
    leftSidebarOpen, 
    rightSidebarOpen, 
    toggleLeftSidebar, 
    toggleRightSidebar,
    toggleCommandPalette
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
        
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
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
      </div>
    </div>
  );
};

export default Toolbar;