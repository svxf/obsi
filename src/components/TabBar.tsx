import React from 'react';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';

const TabBar: React.FC = () => {
  const { tabs, setActiveTab, closeTab } = useAppContext();
  
  if (tabs.length === 0) {
    return null;
  }
  
  return (
    <div className="flex overflow-x-auto border-b border-[#333] bg-[#252525] hide-scrollbar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center min-w-0 max-w-xs px-3 py-1 text-sm cursor-pointer border-r border-[#333] ${
            tab.active ? 'bg-[#1e1e1e] text-white' : 'text-gray-500 hover:bg-[#2a2a2a]'
          }`}
          onClick={() => setActiveTab(tab.id)}
          onMouseDown={(e) => {
            if (e.button === 1) {
              e.preventDefault();
              closeTab(tab.id);
            }
          }}
        >
          <span className="truncate mr-2">{tab.note.title}</span>
          <button
            className="p-0.5 rounded-full hover:bg-[#333] opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TabBar;