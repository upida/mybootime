'use client';

import { useState } from 'react';
import { Task } from '@/lib/storage';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: Task;
  selectedDate: string;
}

export default function TaskForm({ onSubmit, onCancel, initialData, selectedDate }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueTime, setDueTime] = useState(initialData?.dueTime || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueTime) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: initialData?.dueDate || selectedDate,
      dueTime,
      completed: initialData?.completed || false,
    });

    if (!initialData) {
      setTitle('');
      setDescription('');
      setDueTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          required
        />
      </div>

      <div>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
        />
      </div>

      <div>
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-6 py-3 rounded-xl bg-white/30 backdrop-blur-md text-white font-medium hover:bg-white/40 transition-all"
        >
          {initialData ? 'Update' : 'Add'} Task
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white font-medium hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
