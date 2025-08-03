'use client';

import { useState } from 'react';
import { ProConList } from '@/types';
import { useProConStore } from '@/store/procon';
import { ProConItemComponent } from './ProConItemComponent';
import { AddItemForm } from './AddItemForm';
import { AIAnalysisCard } from './AIAnalysisCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

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
    deleteList(list.id);
    clearCurrentList();
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          {isEditingTitle ? (
            <div className="flex-1 mr-4">
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={handleSaveTitle}
                className="text-3xl font-bold h-auto py-3 border-slate-300 focus:border-blue-400 focus:ring-blue-400"
                autoFocus
              />
            </div>
          ) : (
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex-1"
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit title"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {list.title}
            </motion.h1>
          )}
          
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => clearCurrentList()}
                className="border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lists
              </Button>
            </motion.div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="destructive" className="shadow-sm hover:shadow-md transition-shadow">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete List
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete List</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this list? This action cannot be undone and will remove all pros and cons.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteList}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {isEditingDescription ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              onBlur={handleSaveDescription}
              placeholder="Add a description (optional)..."
              className="resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400"
              rows={2}
              autoFocus
            />
            <p className="text-sm text-slate-500 mt-1">Press Ctrl+Enter to save, Esc to cancel</p>
          </motion.div>
        ) : (
          <motion.p 
            className="text-slate-600 cursor-pointer hover:text-blue-600 transition-colors text-lg"
            onClick={() => setIsEditingDescription(true)}
            title="Click to edit description"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            {list.description || 'Click to add a description...'}
          </motion.p>
        )}
      </motion.div>

      {/* Summary */}
      <motion.div 
        className="grid grid-cols-2 gap-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-emerald-800">Pros</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-600">{prosCount}</p>
              <p className="text-sm text-emerald-600 mt-1">Positive aspects</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-red-800">Cons</h3>
              </div>
              <p className="text-4xl font-bold text-red-600">{consCount}</p>
              <p className="text-sm text-red-600 mt-1">Negative aspects</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Pros and Cons Grid */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Pros Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100">
                <Plus className="w-6 h-6" />
              </div>
              Pros
              <span className="text-sm font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {prosCount}
              </span>
            </h2>
            <div className="space-y-3">
              {list.pros.map((pro, index) => (
                <motion.div
                  key={pro.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <ProConItemComponent
                    item={pro}
                    type="pro"
                    listId={list.id}
                  />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * prosCount }}
              >
                <AddItemForm listId={list.id} type="pro" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Cons Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-red-100">
            <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <X className="w-6 h-6" />
              </div>
              Cons
              <span className="text-sm font-normal text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {consCount}
              </span>
            </h2>
            <div className="space-y-3">
              {list.cons.map((con, index) => (
                <motion.div
                  key={con.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <ProConItemComponent
                    item={con}
                    type="con"
                    listId={list.id}
                  />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * consCount }}
              >
                <AddItemForm listId={list.id} type="con" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* AI Analysis Section */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <AIAnalysisCard />
      </motion.div>

      {/* Meta Information */}
      <motion.div 
        className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex justify-center items-center gap-6 text-center">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Created: {new Date(list.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Last updated: {new Date(list.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
