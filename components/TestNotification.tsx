'use client';

import { useEffect, useState } from 'react';
import { speak, showNotification, requestNotificationPermission } from '@/lib/notifications';

export default function TestNotification() {
  const [permission, setPermission] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleTestBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
  };

  const handleTestLoop = () => {
    const wordsToSpeak = ['Hello', 'testing', 'one', 'two', 'three'];
    
    for (var i = 0; i < wordsToSpeak.length; i++) {
      speak(wordsToSpeak[i]);
    }
  };

  const handleTestSpeak = () => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          speak('Hello testing one two three');
        };
      } else {
        speak('Hello testing one two three');
      }
    }
  };

  const handleTestNotification = () => {
    showNotification('Test Notification', 'Ini adalah test notifikasi browser');
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    if (granted) {
      alert('Izin notifikasi diberikan!');
    } else {
      alert('Izin notifikasi ditolak');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white/20 backdrop-blur-md px-4 py-3 rounded-lg text-white text-sm space-y-2 max-w-xs">
      <div className="font-semibold">Test Notifikasi</div>
      <div className="text-xs">Permission: {permission || 'unknown'}</div>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleTestBeep}
          className="px-3 py-1 bg-yellow-500/30 hover:bg-yellow-500/50 rounded text-xs"
        >
          🔊 Test Beep (Audio Check)
        </button>
        <button
          onClick={handleTestLoop}
          className="px-3 py-1 bg-green-500/30 hover:bg-green-500/50 rounded text-xs"
        >
          🔁 Test Loop Speak
        </button>
        <button
          onClick={handleRequestPermission}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs"
        >
          Minta Izin
        </button>
        <button
          onClick={handleTestSpeak}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs"
        >
          Test Suara
        </button>
        <button
          onClick={handleTestNotification}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs"
        >
          Test Notifikasi
        </button>
      </div>
    </div>
  );
}
