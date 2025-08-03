'use client';

import { useState } from 'react';
import { ItemType } from '@/types';
import { useProConStore } from '@/store/procon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="outline"
          onClick={() => setIsExpanded(true)}
          className={`w-full h-auto p-5 border-2 border-dashed transition-all duration-300 ${
            type === 'pro' 
              ? 'border-emerald-300 hover:border-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 text-emerald-700 hover:text-emerald-800' 
              : 'border-red-300 hover:border-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 text-red-700 hover:text-red-800'
          } shadow-sm hover:shadow-md`}
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className={`p-2 rounded-full ${
                type === 'pro' ? 'bg-emerald-100' : 'bg-red-100'
              }`}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-5 h-5" />
            </motion.div>
            <div className="text-left">
              <div className="font-semibold">Add {type === 'pro' ? 'Pro' : 'Con'}</div>
              <div className="text-sm opacity-80">Click to add a new point</div>
            </div>
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, height: 0 }}
        animate={{ opacity: 1, scale: 1, height: "auto" }}
        exit={{ opacity: 0, scale: 0.95, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <Card className={`p-4 border-2 shadow-md transition-all duration-200 ${
          type === 'pro' 
            ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50' 
            : 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50'
        }`}>
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Enter a ${type === 'pro' ? 'pro' : 'con'}...`}
                className={`resize-none border-2 focus:ring-2 transition-colors ${
                  type === 'pro'
                    ? 'border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200'
                    : 'border-red-200 focus:border-red-400 focus:ring-red-200'
                }`}
                rows={2}
                autoFocus
              />
            </motion.div>
            <motion.div 
              className="flex gap-2 mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={!text.trim()}
                  className={`shadow-sm hover:shadow-md transition-shadow ${
                    type === 'pro' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                  size="sm"
                >
                  Add {type === 'pro' ? 'Pro' : 'Con'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 hover:bg-slate-50"
                  onClick={() => {
                    setText('');
                    setIsExpanded(false);
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
