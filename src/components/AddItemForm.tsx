'use client';

import { useState } from 'react';
import { ItemType } from '@/types';
import { useProConStore } from '@/store/procon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

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
      <Button
        variant="outline"
        onClick={() => setIsExpanded(true)}
        className={`w-full h-auto p-4 border-2 border-dashed ${
          type === 'pro' 
            ? 'border-green-300 hover:border-green-400 hover:bg-green-50 text-green-700' 
            : 'border-red-300 hover:border-red-400 hover:bg-red-50 text-red-700'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Add {type === 'pro' ? 'Pro' : 'Con'}
        </div>
      </Button>
    );
  }

  return (
    <Card className={`p-3 border-2 ${
      type === 'pro' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
    }`}>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Enter a ${type === 'pro' ? 'pro' : 'con'}...`}
          className="resize-none border-gray-300 focus:ring-2 focus:ring-blue-500"
          rows={2}
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <Button
            type="submit"
            disabled={!text.trim()}
            variant={type === 'pro' ? 'default' : 'destructive'}
            size="sm"
          >
            Add {type === 'pro' ? 'Pro' : 'Con'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setText('');
              setIsExpanded(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
