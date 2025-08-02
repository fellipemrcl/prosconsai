'use client';

import { useState } from 'react';
import { ProConList } from '@/types';
import { useProConStore } from '@/store/procon';
import { ProConItemComponent } from './ProConItemComponent';
import { AddItemForm } from './AddItemForm';

interface ProConListViewProps {
  list: ProConList;
}

export const ProConListView: React.FC<ProConListViewProps> = ({ list }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editDescription, setEditDescription] = useState(list.description || '');
  
  const { updateListTitle, updateListDescription, deleteList, clearCurrentList } = useProConStore();

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateListTitle(list.id, editTitle.trim());
      setIsEditingTitle(false);
    }
  };

  const handleSaveDescription = () => {
    updateListDescription(list.id, editDescription);
    setIsEditingDescription(false);
  };

  const handleDeleteList = () => {
    if (confirm('Are you sure you want to delete this list?')) {
      deleteList(list.id);
      clearCurrentList();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditTitle(list.title);
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveDescription();
    } else if (e.key === 'Escape') {
      setEditDescription(list.description || '');
      setIsEditingDescription(false);
    }
  };

  const prosCount = list.pros.length;
  const consCount = list.cons.length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {isEditingTitle ? (
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={handleSaveTitle}
                className="text-3xl font-bold w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          ) : (
            <h1 
              className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex-1"
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit title"
            >
              {list.title}
            </h1>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => clearCurrentList()}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Back to Lists
            </button>
            <button
              onClick={handleDeleteList}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Delete List
            </button>
          </div>
        </div>
        
        {isEditingDescription ? (
          <div>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              onBlur={handleSaveDescription}
              placeholder="Add a description (optional)..."
              className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-1">Press Ctrl+Enter to save, Esc to cancel</p>
          </div>
        ) : (
          <p 
            className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setIsEditingDescription(true)}
            title="Click to edit description"
          >
            {list.description || 'Click to add a description...'}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-green-800">Pros</h3>
          <p className="text-2xl font-bold text-green-600">{prosCount}</p>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-red-800">Cons</h3>
          <p className="text-2xl font-bold text-red-600">{consCount}</p>
        </div>
      </div>

      {/* Pros and Cons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pros Column */}
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Pros
          </h2>
          <div className="space-y-3">
            {list.pros.map((pro) => (
              <ProConItemComponent
                key={pro.id}
                item={pro}
                type="pro"
                listId={list.id}
              />
            ))}
            <AddItemForm listId={list.id} type="pro" />
          </div>
        </div>

        {/* Cons Column */}
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cons
          </h2>
          <div className="space-y-3">
            {list.cons.map((con) => (
              <ProConItemComponent
                key={con.id}
                item={con}
                type="con"
                listId={list.id}
              />
            ))}
            <AddItemForm listId={list.id} type="con" />
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
        <p>
          Created: {list.createdAt.toLocaleDateString()} | 
          Last updated: {list.updatedAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
