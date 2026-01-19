'use client';

import { useState, useEffect, useRef } from 'react';
import { parseVoiceCommand, VoiceCommand } from '@/lib/voiceCommands';

interface VoiceCommandProps {
  onCommand: (command: VoiceCommand, transcript: string) => void;
}

export default function VoiceCommandComponent({ onCommand }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('Listening...');
        };
        
        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptResult = event.results[current][0].transcript;
          setTranscript(transcriptResult);
          
          // Process final result
          if (event.results[current].isFinal) {
            const command = parseVoiceCommand(transcriptResult);
            onCommand(command, transcriptResult);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'no-speech') {
            setTranscript('No speech detected. Try again.');
          } else if (event.error === 'not-allowed') {
            setTranscript('Microphone permission denied.');
          } else {
            setTranscript(`Error: ${event.error}`);
          }
          
          setTimeout(() => setTranscript(''), 3000);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onCommand]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
        <p className="text-white text-sm">
          Web Speech API is not supported in your browser. 
          Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={startListening}
          disabled={isListening}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            isListening
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          } text-white shadow-lg`}
        >
          {isListening ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Listening...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🎤 Start Voice Command
            </span>
          )}
        </button>
        
        {isListening && (
          <button
            onClick={stopListening}
            className="px-4 py-3 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all"
          >
            ⏹ Stop
          </button>
        )}
      </div>
      
      {transcript && (
        <div className="p-3 bg-white/10 border border-white/20 rounded-lg">
          <p className="text-white text-sm">
            <span className="font-semibold">Transcript:</span> {transcript}
          </p>
        </div>
      )}
      
      <div className="text-xs text-white/60 space-y-1">
        <p className="font-semibold">Voice Commands:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>"Add [title] at [time]" - e.g., "Add Meeting at 2:30 PM"</li>
          <li>"Remove [title]" - e.g., "Remove Meeting"</li>
          <li>"Update [title] at [time]" - e.g., "Update Meeting at 3 PM"</li>
          <li>"Edit [title] at [time]" - e.g., "Edit Review at 4 PM"</li>
        </ul>
      </div>
    </div>
  );
}
