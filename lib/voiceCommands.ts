export interface VoiceCommand {
  type: 'add' | 'remove' | 'update' | 'unknown';
  title?: string;
  description?: string;
  time?: string;
  taskIndex?: number;
}

export const parseVoiceCommand = (transcript: string): VoiceCommand => {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  if (lowerTranscript.startsWith('add ')) {
    const title = extractTaskTitle(lowerTranscript, ['add']);
    const time = extractTime(lowerTranscript);
    const description = extractDescription(lowerTranscript);
    
    return {
      type: 'add',
      title: title || undefined,
      time: time || undefined,
      description: description || undefined,
    };
  }
  
  if (lowerTranscript.startsWith('remove ') || lowerTranscript.startsWith('delete ')) {
    const title = extractTaskTitle(lowerTranscript, ['remove', 'delete']);
    
    return {
      type: 'remove',
      title: title || undefined,
    };
  }
  
  if (lowerTranscript.startsWith('update ') || lowerTranscript.startsWith('edit ') || lowerTranscript.startsWith('change ')) {
    const title = extractTaskTitle(lowerTranscript, ['update', 'edit', 'change']);
    const time = extractTime(lowerTranscript);
    const description = extractDescription(lowerTranscript);
    
    return {
      type: 'update',
      title: title || undefined,
      time: time || undefined,
      description: description || undefined,
    };
  }
  
  return { type: 'unknown' };
};

const extractTaskTitle = (transcript: string, triggers: string[]): string | null => {
  for (const trigger of triggers) {
    const index = transcript.indexOf(trigger);
    if (index !== -1) {
      let remaining = transcript.substring(index + trigger.length).trim();
      
      // Remove time and description parts
      remaining = remaining.replace(/at \d{1,2}(:\d{2})?\s*(am|pm)?/gi, '');
      remaining = remaining.replace(/with description .+/gi, '');
      remaining = remaining.replace(/description .+/gi, '');
      
      return remaining.trim() || null;
    }
  }
  return null;
};

const extractTime = (transcript: string): string | null => {
  const timeMatch = transcript.match(/at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();
    
    if (meridiem === 'pm' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'am' && hours === 12) {
      hours = 0;
    }
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  return null;
};

const extractDescription = (transcript: string): string | null => {
  const descMatch = transcript.match(/(?:with )?description (.+?)(?:\s+at|\s*$)/i);
  
  if (descMatch) {
    return descMatch[1].trim();
  }
  
  return null;
};

const extractTaskNumber = (transcript: string): number | null => {
  const numberMatch = transcript.match(/(?:task|number)\s*(\d+)/i);
  
  if (numberMatch) {
    return parseInt(numberMatch[1]) - 1;
  }
  
  return null;
};
