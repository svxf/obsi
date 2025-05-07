import React from 'react';

interface MarkdownPreviewProps {
  content: string;
}

// not needed anymore, swapped to milkdown
const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    // headers
    text = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
    
    // bold and italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // lists
    text = text.replace(/^\s*- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
    text = text.replace(/^\s*\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');
    
    // code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-[#2a2a2a] px-1 rounded text-[#a47ddc]">$1</code>');
    
    // links (internal wiki links)
    text = text.replace(/\[\[(.*?)\]\]/g, '<a href="#" class="text-[#a47ddc]">$1</a>');
    
    // images
    text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full my-2 rounded" />');
    
    // blockquotes
    text = text.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-[#a47ddc] pl-4 italic py-1 my-2 text-gray-400">$1</blockquote>');
    
    // horizontal lines
    text = text.replace(/^\s*---\s*$/gm, '<hr class="my-4 border-t border-[#333]" />');
    
    // paragraphs
    text = text.replace(/^\s*(.+)(?:\n|$)/gm, (match, p1) => {
      if (/<\/(h1|h2|h3|li|blockquote)>/.test(p1)) {
        return p1;
      }
      return `<p class="my-2">${p1}</p>`;
    });
    
    return text.trim();
  };
  
  const renderedHtml = renderMarkdown(content);
  
  return (
    <div 
      className="text-[#dcddde] leading-relaxed markdown-preview"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MarkdownPreview;