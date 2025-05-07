import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeGoogleDrive, listFiles, getFileContent, saveFileContent, createFile } from '../services/googleDrive';

const sampleNotes = [
  {
    id: '1',
    title: 'Welcome to Obsi',
    content: '# Welcome to Obsi\n\nObsi uses Markdown files.\n\n## Quick start\n\n- [[Basic Formatting]]\n- [[Embed files]]\n- [[Create notes]]\n\n## Advanced\n\n- [[Graph view]]\n- [[Workspaces]]\n- [[Search]]\n',
    path: 'Welcome to Obsi.md',
    folder: '',
    lastModified: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Basic Formatting',
    content: '# Basic Formatting\n\nObsi uses Markdown for formatting.\n\n## Headers\n\n# Header 1\n## Header 2\n### Header 3\n\n## Lists\n- Item 1\n- Item 2\n\n1. Numbered item 1\n2. Numbered item 2\n\n## Formatting\n**Bold text**\n*Italic text*\n~~Strikethrough~~\n\n> This is a quote\n\n`code`\n\n```js\nconsole.log("Code block");\n```\n',
    path: 'Basic Formatting.md',
    folder: '',
    lastModified: new Date().toISOString(),
  },
];

export interface Note {
  id: string;
  title: string;
  content: string;
  path: string;
  folder: string;
  lastModified: string;
}

export interface Tab {
  id: string;
  note: Note;
  active: boolean;
}

interface AppContextType {
  notes: Note[];
  tabs: Tab[];
  activeTab: Tab | null;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  commandPaletteOpen: boolean;
  searchQuery: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  openNote: (noteId: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleCommandPalette: () => void;
  setSearchQuery: (query: string) => void;
  updateNoteContent: (noteId: string, content: string) => void;
  createNewNote: (title: string, content: string) => Promise<void>;
  authenticate: () => Promise<void>;
  refreshFiles: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTabState] = useState<Tab | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeGoogleDrive();
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google Drive:', error);
        setError('Failed to initialize Google Drive');
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const refreshFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const files = await listFiles();
      setNotes(files);
    } catch (error) {
      console.error('Error refreshing files:', error);
      setError('Failed to refresh files');
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await refreshFiles();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error authenticating:', error);
      setError('Failed to authenticate with Google Drive');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openNote = async (noteId: string) => {
    try {
      setError(null);
      const existingTab = tabs.find((tab) => tab.note.id === noteId);
      
      if (existingTab) {
        setTabs(
          tabs.map((tab) => ({
            ...tab,
            active: tab.id === existingTab.id,
          }))
        );
        setActiveTabState(existingTab);
      } else {
        const content = await getFileContent(noteId);
        const note = notes.find((n) => n.id === noteId);
        
        if (!note) {
          setError('Note not found');
          return;
        }

        const newTab: Tab = {
          id: `tab-${note.id}`,
          note: { ...note, content },
          active: true,
        };
        
        const updatedTabs = tabs.map((tab) => ({
          ...tab,
          active: false,
        }));
        
        setTabs([...updatedTabs, newTab]);
        setActiveTabState(newTab);
      }
    } catch (error) {
      console.error('Error opening note:', error);
      setError('Failed to open note');
    }
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = [...tabs];
    newTabs.splice(tabIndex, 1);

    if (tabs[tabIndex].active && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].active = true;
      setActiveTabState(newTabs[newActiveIndex]);
    } else if (newTabs.length === 0) {
      setActiveTabState(null);
    }

    setTabs(newTabs);
  };

  const setActiveTab = (tabId: string) => {
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      active: tab.id === tabId,
    }));
    
    const activeTab = updatedTabs.find((tab) => tab.active);
    
    setTabs(updatedTabs);
    setActiveTabState(activeTab || null);
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  const toggleCommandPalette = () => {
    setCommandPaletteOpen(!commandPaletteOpen);
  };

  // todo: redo this
  const updateNoteContent = async (noteId: string, content: string) => {
    try {
      setError(null);
      // update in Google Drive
      await saveFileContent(noteId, content);

      // Update local state
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, content, lastModified: new Date().toISOString() } : note
        )
      );

      // update in tabs
      setTabs(
        tabs.map((tab) =>
          tab.note.id === noteId
            ? { ...tab, note: { ...tab.note, content, lastModified: new Date().toISOString() } }
            : tab
        )
      );
    } catch (error) {
      console.error('Error updating note content:', error);
      setError('Failed to save note');
    }
  };

  const createNewNote = async (title: string, content: string) => {
    try {
      setError(null);
      const newNote = await createFile(title, content);
      setNotes([...notes, newNote]);
      await openNote(newNote.id);
    } catch (error) {
      console.error('Error creating new note:', error);
      setError('Failed to create new note');
    }
  };

  return (
    <AppContext.Provider
      value={{
        notes,
        tabs,
        activeTab,
        leftSidebarOpen,
        rightSidebarOpen,
        commandPaletteOpen,
        searchQuery,
        isAuthenticated,
        isLoading,
        error,
        openNote,
        closeTab,
        setActiveTab,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleCommandPalette,
        setSearchQuery,
        updateNoteContent,
        createNewNote,
        authenticate,
        refreshFiles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};