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
import { Plus, FileText, Star, X, Trash2 } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pros & Cons Lists</h1>
        <p className="text-gray-600">
          Create and manage your decision-making lists. Weigh the advantages and disadvantages to make better choices.
        </p>
      </div>

      {/* Create New List Button */}
      {!isCreating && (
        <Button
          variant="outline"
          onClick={() => setIsCreating(true)}
          className="w-full mb-6 h-auto p-6 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 text-blue-600"
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-6 h-6" />
            <span className="text-lg font-medium">Create New Pros & Cons List</span>
          </div>
        </Button>
      )}

      {/* Create List Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New List</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Should I move to a new city?"
                  autoFocus
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add context or details about this decision..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!newTitle.trim()}
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
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lists yet</h3>
          <p className="text-gray-500">Create your first pros and cons list to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <Card
              key={list.id}
              onClick={() => setCurrentList(list.id)}
              className="group relative hover:shadow-lg transition-all cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {list.title}
                  </CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
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
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{list.description}</p>
                )}
                
                <div className="flex gap-4 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1 text-green-600">
                    <Star className="w-4 h-4 fill-current" />
                    {list.pros.length}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 text-red-600">
                    <X className="w-4 h-4" />
                    {list.cons.length}
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-500">
                  Updated {formatDate(list.updatedAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
