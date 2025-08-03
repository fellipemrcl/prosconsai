'use client';

import { useState } from 'react';
import { ProConItem, ItemType } from '@/types';
import { useProConStore } from '@/store/procon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card className={`group relative border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
        type === 'pro' 
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:border-emerald-300 hover:from-emerald-100 hover:to-green-100' 
          : 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50 hover:border-red-300 hover:from-red-100 hover:to-rose-100'
      }`}>
        <div className="p-4">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`resize-none border-2 focus:ring-2 transition-colors ${
                    type === 'pro' 
                      ? 'border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200' 
                      : 'border-red-200 focus:border-red-400 focus:ring-red-200'
                  }`}
                  rows={2}
                  autoFocus
                />
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className={`${
                        type === 'pro' 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white shadow-sm`}
                    >
                      Save
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="outline"
                      className="border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <p className={`leading-relaxed pr-16 text-slate-800 font-medium ${
                  type === 'pro' ? 'text-emerald-900' : 'text-red-900'
                }`}>
                  {item.text}
                </p>
                <motion.div 
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1"
                  initial={{ x: 10 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="p-2 h-auto text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-auto text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};
