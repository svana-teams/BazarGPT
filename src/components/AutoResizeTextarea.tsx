'use client';

import { useEffect, useRef } from 'react';

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
}

export default function AutoResizeTextarea({
  value,
  onChange,
  onKeyPress,
  placeholder,
  className = '',
  minHeight = 48,
  maxHeight = 120,
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the new height
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      // Set the new height
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, minHeight, maxHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className={className}
      style={{
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
      }}
    />
  );
}
