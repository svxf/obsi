import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Note } from '../context/AppContext';
import MarkdownPreview from './MarkdownPreview';

interface EditorProps {
  note: Note;
}

const Editor: React.FC<EditorProps> = ({ note }) => {
  const { updateNoteContent } = useAppContext();
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setContent(note.content);
  }, [note]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateNoteContent(note.id, newContent);
  };

  return (
    <div className="h-full overflow-auto bg-[#1e1e1e] text-[#dcddde] p-4 space-y-6">
      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full min-h-[200px] p-4 resize-none outline-none bg-[#2a2a2a] text-[#dcddde] font-mono text-sm leading-relaxed rounded"
        spellCheck={false}
      />
      
      <hr className="border-[#333]" />
      
      <div className="markdown-preview">
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
};

export default Editor;
