'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, getTasks, addTask, updateTask, deleteTask, toggleTaskComplete, getTasksByDate, getTodayDate, formatDate } from '@/lib/storage';
import { speak, showNotification, requestNotificationPermission } from '@/lib/notifications';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import DateNavigator from './DateNavigator';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function TaskList() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; taskId: string; taskTitle: string }>({
    isOpen: false,
    taskId: '',
    taskTitle: '',
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTasksForDate(selectedDate);
  }, [selectedDate]);

  const loadTasksForDate = (date: string) => {
    const dateTasks = getTasksByDate(date);
    setTasks(dateTasks);
  };

  useEffect(() => {
    const initPermission = async () => {
      const granted = await requestNotificationPermission();
      console.log('Notification permission:', granted ? 'granted' : 'not granted');
      if (!granted && typeof window !== 'undefined' && 'Notification' in window) {
        console.warn('Notification permission status:', window.Notification.permission);
      }
    };

    initPermission();

    const checkTaskTimes = () => {
      const now = new Date();
      const currentDate = formatDate(now);
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentTasks = getTasks();

      currentTasks.forEach(task => {
        if (!task.completed && task.dueDate === currentDate && task.dueTime === currentTime) {
          const message = `Time to work on: ${task.title}`;
          console.log('Task time matched! Sending notification...', { task: task.title, time: currentTime });
          speak(message);
          showNotification('MyBooTime Reminder', message);
        }
      });
    };

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    checkTaskTimes();
    
    intervalRef.current = setInterval(checkTaskTimes, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = addTask(taskData);
    loadTasksForDate(selectedDate);
    setShowForm(false);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      loadTasksForDate(selectedDate);
      setEditingTask(null);
    }
  };

  const handleToggle = (id: string) => {
    toggleTaskComplete(id);
    loadTasksForDate(selectedDate);
  };

  const handleDelete = (id: string, taskTitle: string) => {
    setDeleteConfirmModal({
      isOpen: true,
      taskId: id,
      taskTitle,
    });
  };

  const confirmDelete = () => {
    deleteTask(deleteConfirmModal.taskId);
    loadTasksForDate(selectedDate);
    setDeleteConfirmModal({
      isOpen: false,
      taskId: '',
      taskTitle: '',
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.dueTime.localeCompare(b.dueTime);
  });

  return (
    <div className="space-y-6">
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
      
      {!showForm && !editingTask && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-6 py-4 rounded-xl bg-white/30 backdrop-blur-md text-white font-medium text-lg hover:bg-white/40 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Task
        </button>
      )}

      {showForm && (
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">New Task</h2>
          <TaskForm 
            onSubmit={handleAddTask} 
            onCancel={() => setShowForm(false)}
            selectedDate={selectedDate}
          />
        </div>
      )}

      {editingTask && (
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Edit Task</h2>
          <TaskForm 
            onSubmit={handleUpdateTask} 
            onCancel={() => setEditingTask(null)}
            initialData={editingTask}
            selectedDate={selectedDate}
          />
        </div>
      )}

      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No tasks yet. Add your first task!</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        taskTitle={deleteConfirmModal.taskTitle}
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteConfirmModal({
            isOpen: false,
            taskId: '',
            taskTitle: '',
          })
        }
      />
    </div>
  );
}
