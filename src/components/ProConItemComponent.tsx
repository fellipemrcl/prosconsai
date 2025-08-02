'use client';

import { useState } from 'react';
import { ProConItem, ItemType } from '@/types';
import { useProConStore } from '@/store/procon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2 } from 'lucide-react';

interface ProConItemComponentProps {
  item: ProConItem;
  type: ItemType;
  listId: string;
}

export const ProConItemComponent: React.FC<ProConItemComponentProps> = ({
  item,
  type,
  listId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const { updateItem, deleteItem } = useProConStore();

  const handleSave = () => {
    if (editText.trim()) {
      updateItem(listId, type, item.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteItem(listId, type, item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Card className={`group relative border-2 ${
      type === 'pro' 
        ? 'border-green-200 bg-green-50 hover:border-green-300' 
        : 'border-red-200 bg-red-50 hover:border-red-300'
    }`}>
      <div className="p-3">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none border-gray-300 focus:ring-2 focus:ring-blue-500"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                variant="default"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 leading-relaxed pr-12">{item.text}</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-1 h-auto text-gray-500 hover:text-blue-600"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-gray-500 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this {type}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
