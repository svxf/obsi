import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, List, Hash, Calendar, Tag, BookOpen } from 'lucide-react';

const RightSidebar: React.FC = () => {
  const { noteContent } = useAppContext();
  
  const extractHeadings = (content: string) => {
    const headings: { level: number; text: string }[] = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        headings.push({
          level: headingMatch[1].length,
          text: headingMatch[2].trim()
        });
      }
    });
    
    return headings;
  };
  
  const headings = noteContent ? extractHeadings(noteContent) : [];

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#dcddde]">
      {/* Sidebar Header */}
      <div className="p-2 border-b border-[#333] flex items-center justify-between">
        <span className="text-sm font-medium">Outline</span>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex text-xs border-b border-[#333]">
        <button className="flex-1 py-1 px-2 text-[#a47ddc] border-b-2 border-[#a47ddc]">
          Outline
        </button>
        <button className="flex-1 py-1 px-2 text-gray-500">
          Backlinks
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {noteContent ? (
          <>
            {headings.length > 0 ? (
              <div className="space-y-1">
                {headings.map((heading, index) => (
                  <div 
                    key={index} 
                    className="flex items-center px-2 py-0.5 rounded hover:bg-[#2a2a2a] cursor-pointer text-sm"
                    style={{ paddingLeft: `${heading.level * 8}px` }}
                  >
                    <Hash size={14} className="mr-2 text-gray-500" />
                    <span className="truncate">{heading.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm text-center pt-4">
                No headings found
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-sm text-center pt-4">
            No note selected
          </div>
        )}
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-2 border-t border-[#333] flex justify-between text-gray-500">
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <List size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <BookOpen size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <Calendar size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <Tag size={16} />
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;