import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, FileText, Settings, FolderPlus, FilePlus } from 'lucide-react';

const CommandPalette: React.FC = () => {
  const { 
    notes, 
    openNote, 
    toggleCommandPalette,
  } = useAppContext();
  
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Array<{id: string, title: string, type: string}>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  useEffect(() => {
    if (!query) {
      setFilteredItems([
        { id: 'cmd-new-note', title: 'New note', type: 'command' },
        { id: 'cmd-new-folder', title: 'New folder', type: 'command' },
        { id: 'cmd-settings', title: 'Open settings', type: 'command' },
        ...notes.map(note => ({ id: note.id, title: note.title, type: 'note' })),
      ]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // filter notes
    const matchingNotes = notes
      .filter(note => note.title.toLowerCase().includes(lowerQuery))
      .map(note => ({ id: note.id, title: note.title, type: 'note' }));
    
    // filter commands
    const commands = [
      { id: 'cmd-new-note', title: 'New note', type: 'command' },
      { id: 'cmd-new-folder', title: 'New folder', type: 'command' },
      { id: 'cmd-settings', title: 'Open settings', type: 'command' },
    ].filter(cmd => cmd.title.toLowerCase().includes(lowerQuery));
    
    setFilteredItems([...commands, ...matchingNotes]);
    setSelectedIndex(0);
  }, [query, notes]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggleCommandPalette();
    }
  };
  
  // item selection
  const handleSelectItem = (item: {id: string, title: string, type: string}) => {
    if (item.type === 'note') {
      openNote(item.id);
      toggleCommandPalette();
    } else if (item.type === 'command') {
      // command execution
      console.log('Execute command:', item.title);
      toggleCommandPalette();
    }
  };
  
  // get icon for item
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText size={16} className="text-gray-500" />;
      case 'command':
        if (filteredItems[selectedIndex]?.id === 'cmd-new-note') {
          return <FilePlus size={16} className="text-gray-500" />;
        } else if (filteredItems[selectedIndex]?.id === 'cmd-new-folder') {
          return <FolderPlus size={16} className="text-gray-500" />;
        } else if (filteredItems[selectedIndex]?.id === 'cmd-settings') {
          return <Settings size={16} className="text-gray-500" />;
        }
        return <Search size={16} className="text-gray-500" />;
      default:
        return <Search size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50" onClick={toggleCommandPalette}>
      <div 
        className="w-full max-w-md bg-[#1e1e1e] rounded-lg shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-3 border-b border-[#333] flex items-center">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes, commands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-[#dcddde] placeholder-gray-500 w-full"
          />
        </div>
        
        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="py-2">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center px-3 py-2 cursor-pointer ${
                    index === selectedIndex ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'
                  }`}
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="mr-3">
                    {getItemIcon(item.type)}
                  </div>
                  <span className="text-sm text-[#dcddde]">{item.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
        
        {/* Keyboard shortcuts */}
        <div className="px-3 py-2 border-t border-[#333] text-xs text-gray-500 flex justify-between">
          <div className="flex space-x-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <div>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;