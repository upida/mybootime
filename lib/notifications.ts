export const speak = (text: string): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    
    const preferredVoices = [
      'Samantha', 'Alex', 'Karen', 'Moira', 'Tessa', 'Victoria', 'Fiona'
    ];
    
    let selectedVoice = voices.find(voice => 
      preferredVoices.some(name => voice.name.includes(name)) && voice.localService
    );
    
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      );
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('id') || voice.lang.includes('ID')
      );
    }
    
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
    };

    window.speechSynthesis.speak(utterance);
    
    setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 100);
  }, 100);
};

export const showNotification = (title: string, body: string): void => {
  if (typeof window === 'undefined') return;

  if ('Notification' in window) {
    const permission = Notification.permission;
    console.log('Current notification permission:', permission);

    if (permission === 'granted') {
      try {
        const uniqueTag = `mybootime-reminder-${Date.now()}`;
        
        const notification = new Notification(title, {
          body,
          tag: uniqueTag,
          requireInteraction: true,
          silent: false,
        });

        console.log('Notification created successfully');

        window.focus();

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        notification.onerror = (event) => {
          console.error('Notification error:', event);
        };
      } catch (error) {
        console.error('Notification creation error:', error);
      }
    } else if (permission === 'denied') {
      console.warn('Notification permission denied. Please enable in browser settings.');
    } else {
      console.warn('Notification permission not set:', permission);
    }
  } else {
    console.warn('Notification API not available');
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};
