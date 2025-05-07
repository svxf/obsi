import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initializeGoogleDrive, listFiles, getFileContent, saveFileContent, createFile, clearAuthToken } from '../services/googleDrive';

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
  isOpeningFile: boolean;
  isSavingFile: boolean;
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
  logout: () => void;
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
  const [isOpeningFile, setIsOpeningFile] = useState(false);
  const [isSavingFile, setIsSavingFile] = useState(false);
  const saveTimeoutRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const init = async () => {
      try {
        await initializeGoogleDrive();
        const hasToken = localStorage.getItem('googleDriveAccessToken');
        if (hasToken) {
          await refreshFiles();
          setIsAuthenticated(true);
        }
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
      setIsOpeningFile(true);
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
    } finally {
      setIsOpeningFile(false);
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

  const debouncedSave = useCallback((noteId: string, content: string) => {
    if (saveTimeoutRef.current[noteId]) {
      clearTimeout(saveTimeoutRef.current[noteId]);
    }

    saveTimeoutRef.current[noteId] = window.setTimeout(async () => {
      try {
        setError(null);
        setIsSavingFile(true);
        await saveFileContent(noteId, content);

        setNotes(
          notes.map((note) =>
            note.id === noteId ? { ...note, content, lastModified: new Date().toISOString() } : note
          )
        );

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
      } finally {
        setIsSavingFile(false);
      }
    }, 1000);
  }, [notes, tabs]);

  const updateNoteContent = async (noteId: string, content: string) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, content, lastModified: new Date().toISOString() } : note
      )
    );

    setTabs(
      tabs.map((tab) =>
        tab.note.id === noteId
          ? { ...tab, note: { ...tab.note, content, lastModified: new Date().toISOString() } }
          : tab
      )
    );

    debouncedSave(noteId, content);
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

  const logout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setNotes([]);
    setTabs([]);
    setActiveTabState(null);
  };

  useEffect(() => {
    return () => {
      Object.values(saveTimeoutRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

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
        isOpeningFile,
        isSavingFile,
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
        logout,
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