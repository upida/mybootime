export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Format: YYYY-MM-DD
  dueTime: string; // Format: HH:MM
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'mybootime_tasks';

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): void => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === id);
  
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
  }
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  saveTasks(filteredTasks);
};

export const toggleTaskComplete = (id: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
  }
};

export const getTasksByDate = (date: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter(task => task.dueDate === date);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};
