import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import LoadingIndicator from './LoadingIndicator';
import MarkdownPreview from './MarkdownPreview';

const Editor: React.FC = () => {
  const { activeTab, updateNoteContent, isOpeningFile, isSavingFile } = useAppContext();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && activeTab) {
      editorRef.current.innerHTML = activeTab.note.content;
    }
  }, [activeTab]);

  const handleInput = () => {
    if (editorRef.current && activeTab) {
      updateNoteContent(activeTab.note.id, editorRef.current.innerHTML);
    }
  };

  if (!activeTab) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">No note selected</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {isOpeningFile && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="flex flex-col items-center gap-2">
            <LoadingIndicator size="large" />
            <p className="text-gray-600">Opening file...</p>
          </div>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable
        className="w-full h-full p-4 focus:outline-none"
        onInput={handleInput}
        suppressContentEditableWarning
      />
      {isSavingFile && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md">
          <LoadingIndicator size="small" />
          <span className="text-sm text-gray-600">Saving...</span>
        </div>
      )}
    </div>
  );
};

export default Editor;
