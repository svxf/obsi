import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Note } from '../context/AppContext';
import { Crepe } from "@milkdown/crepe";
import '@milkdown/crepe/theme/common/style.css';
import '../editor.css';

interface EditorProps {
  note: Note;
}

const E: React.FC<EditorProps> = ({ note }) => {
  const { updateNoteContent } = useAppContext();
  const [content, setContent] = useState(note.content);

  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const crepeInstance = new Crepe({
        root: editorRef.current,
        defaultValue: content,
      });

      crepeInstance.create().then(() => {
        console.log("Editor created");
      });

      crepeInstance.on((listener) => {
        listener.updated((_ctx, _doc, _prevDoc) => {
          updateNoteContent(note.id, crepeInstance.getMarkdown());
        });
      })

      return () => {
        crepeInstance.destroy().then(() => {
            console.log("Editor destroyed");
        });
      };
    }
  }, [content]);

  useEffect(() => {
    setContent(note.content);
  }, [note]);

  return (
    <div
      className="h-full overflow-auto bg-[#1e1e1e] text-[#dcddde] p-4 space-y-6"
      ref={editorRef}
    >
    </div>
  );
};

export default E;
