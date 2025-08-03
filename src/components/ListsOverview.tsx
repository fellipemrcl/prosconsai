'use client';

import { useState } from 'react';
import { useProConStore } from '@/store/procon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, FileText, Star, X, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ListsOverview: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  const { lists, createList, setCurrentList, deleteList } = useProConStore();

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      const listId = createList(newTitle.trim(), newDescription.trim() || undefined);
      setNewTitle('');
      setNewDescription('');
      setIsCreating(false);
      setCurrentList(listId);
    }
  };

  const handleDeleteList = (listId: string) => {
    deleteList(listId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div 
        className="mb-16 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Pros & Cons Lists
          </h1>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Create and manage your decision-making lists with AI-powered insights. 
          Weigh the advantages and disadvantages to make better, more informed choices.
        </p>
      </motion.div>

      {/* Create New List Button */}
      {!isCreating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={() => setIsCreating(true)}
            className="w-full mb-8 h-auto p-8 border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-blue-600 hover:text-blue-700 transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-center gap-3">
              <motion.div
                className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-6 h-6" />
              </motion.div>
              <div className="text-left">
                <div className="text-lg font-semibold">Create New Pros & Cons List</div>
                <div className="text-sm text-blue-500">Start organizing your thoughts</div>
              </div>
            </div>
          </Button>
        </motion.div>
      )}

      {/* Create List Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100/50 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">Create New List</CardTitle>
                </div>
                <p className="text-sm text-slate-600 mt-2 ml-11">Fill out the details below to create your new pros and cons list</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreateList} className="space-y-6">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Label htmlFor="title" className="text-sm font-medium text-slate-700">Title *</Label>
                    <Input
                      id="title"
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Should I move to a new city?"
                      autoFocus
                      required
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-colors"
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Add context or details about this decision..."
                      rows={3}
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-colors resize-none"
                    />
                  </motion.div>
                  <motion.div 
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Button
                      type="submit"
                      disabled={!newTitle.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Create List
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setNewTitle('');
                        setNewDescription('');
                      }}
                      className="border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="inline-block p-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FileText className="w-16 h-16 text-blue-500" />
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No lists yet</h3>
          <p className="text-slate-500 max-w-md mx-auto">Create your first pros and cons list to get started on making better decisions!</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {lists.map((list, index) => (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.1 * index,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => setCurrentList(list.id)}
                className="group relative hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2 font-semibold">
                      {list.title}
                    </CardTitle>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all duration-200 hover:bg-red-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete List</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this list? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteList(list.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {list.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">{list.description}</p>
                  )}
                  
                  <div className="flex gap-3 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 transition-colors">
                        <Star className="w-4 h-4 fill-current" />
                        {list.pros.length}
                      </Badge>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1 text-red-600 bg-red-50 border-red-200 hover:bg-red-100 transition-colors">
                        <X className="w-4 h-4" />
                        {list.cons.length}
                      </Badge>
                    </motion.div>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    Updated {formatDate(list.updatedAt)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
