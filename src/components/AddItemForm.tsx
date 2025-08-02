'use client';

import { useState } from 'react';
import { ItemType } from '@/types';
import { useProConStore } from '@/store/procon';

interface AddItemFormProps {
  listId: string;
  type: ItemType;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ listId, type }) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { addItem } = useProConStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addItem(listId, type, text.trim());
      setText('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setText('');
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`w-full p-4 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700 transition-colors ${
          type === 'pro' 
            ? 'border-green-300 hover:border-green-400 hover:bg-green-50' 
            : 'border-red-300 hover:border-red-400 hover:bg-red-50'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add {type === 'pro' ? 'Pro' : 'Con'}
        </div>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`p-3 border-2 rounded-lg ${
      type === 'pro' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
    }`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Enter a ${type === 'pro' ? 'pro' : 'con'}...`}
        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={!text.trim()}
          className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
            text.trim()
              ? type === 'pro'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Add {type === 'pro' ? 'Pro' : 'Con'}
        </button>
        <button
          type="button"
          onClick={() => {
            setText('');
            setIsExpanded(false);
          }}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
