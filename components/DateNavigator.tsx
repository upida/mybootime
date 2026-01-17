'use client';

import { useState } from 'react';
import { formatDate, getTodayDate } from '@/lib/storage';

interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const today = getTodayDate();
  const selected = new Date(selectedDate);

  const goToPreviousDay = () => {
    const prev = new Date(selected);
    prev.setDate(prev.getDate() - 1);
    onDateChange(formatDate(prev));
  };

  const goToNextDay = () => {
    const next = new Date(selected);
    next.setDate(next.getDate() + 1);
    onDateChange(formatDate(next));
  };

  const goToToday = () => {
    onDateChange(today);
  };

  const isToday = selectedDate === today;

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="mb-6 flex items-center justify-between gap-2">
      <button
        onClick={goToPreviousDay}
        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
        title="Previous Day"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex-1 text-center">
        <div className="text-lg font-semibold text-white">
          {formatDisplayDate(selectedDate)}
        </div>
        {!isToday && (
          <button
            onClick={goToToday}
            className="mt-1 text-xs text-white/70 hover:text-white underline"
          >
            Back to Today
          </button>
        )}
      </div>

      <button
        onClick={goToNextDay}
        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
        title="Next Day"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
