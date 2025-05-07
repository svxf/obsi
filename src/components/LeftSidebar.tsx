import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronDown, ChevronRight, FileText, Folder, Search, Settings, Star } from 'lucide-react';

const LeftSidebar: React.FC = () => {
  const { notes, openNote, searchQuery, setSearchQuery } = useAppContext();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Projects': true,
    'Daily Notes': true,
  });

  // group notes by folder
  const folders: Record<string, typeof notes> = notes.reduce((acc, note) => {
    if (note.folder) {
      if (!acc[note.folder]) {
        acc[note.folder] = [];
      }
      acc[note.folder].push(note);
    } else {
      if (!acc['root']) {
        acc['root'] = [];
      }
      acc['root'].push(note);
    }
    return acc;
  }, {} as Record<string, typeof notes>);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderName]: !expandedFolders[folderName],
    });
  };

  // filter notes by search
  const filterNotes = () => {
    if (!searchQuery) return folders;

    const filteredFolders: Record<string, typeof notes> = {};
    
    Object.entries(folders).forEach(([folder, folderNotes]) => {
      const matchingNotes = folderNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchingNotes.length > 0) {
        filteredFolders[folder] = matchingNotes;
      }
    });
    
    return filteredFolders;
  };

  const filteredFolders = filterNotes();

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#dcddde]">
      {/* Sidebar Header */}
      <div className="p-2 border-b border-[#333] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-[#a47ddc] p-1">
            <Star size={16} />
          </div>
          <span className="text-sm font-medium">obsi</span>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-2 border-b border-[#333]">
        <div className="flex items-center bg-[#2a2a2a] rounded px-2 py-1">
          <Search size={14} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-[#dcddde] placeholder-gray-500"
          />
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex text-xs border-b border-[#333]">
        <button className="flex-1 py-1 px-2 text-[#a47ddc] border-b-2 border-[#a47ddc]">
          Files
        </button>
        <button className="flex-1 py-1 px-2 text-gray-500">
          Bookmarks
        </button>
      </div>
      
      {/* Files List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-1">
          {/* Root files */}
          {filteredFolders['root']?.map((note) => (
            <div
              key={note.id}
              className="flex items-center px-2 py-1 rounded hover:bg-[#2a2a2a] cursor-pointer text-sm"
              onClick={() => openNote(note.id)}
            >
              <FileText size={14} className="mr-2 text-gray-500" />
              <span className="truncate">{note.title}</span>
            </div>
          ))}
          
          {/* Folders */}
          {Object.entries(filteredFolders)
            .filter(([folder]) => folder !== 'root')
            .map(([folder, folderNotes]) => (
              <div key={folder}>
                <div
                  className="flex items-center px-2 py-1 rounded hover:bg-[#2a2a2a] cursor-pointer text-sm"
                  onClick={() => toggleFolder(folder)}
                >
                  {expandedFolders[folder] ? (
                    <ChevronDown size={14} className="mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight size={14} className="mr-1 text-gray-500" />
                  )}
                  <Folder size={14} className="mr-2 text-gray-500" />
                  <span>{folder}</span>
                </div>
                
                {expandedFolders[folder] && (
                  <div className="ml-4">
                    {folderNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center px-2 py-1 rounded hover:bg-[#2a2a2a] cursor-pointer text-sm"
                        onClick={() => openNote(note.id)}
                      >
                        <FileText size={14} className="mr-2 text-gray-500" />
                        <span className="truncate">{note.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      
      {/* Sidebar Footer */}
      {/* <div className="p-2 border-t border-[#333] flex justify-end">
        <button className="p-1 rounded hover:bg-[#2a2a2a]">
          <Settings size={16} className="text-gray-500" />
        </button>
      </div> */}
    </div>
  );
};

export default LeftSidebar;