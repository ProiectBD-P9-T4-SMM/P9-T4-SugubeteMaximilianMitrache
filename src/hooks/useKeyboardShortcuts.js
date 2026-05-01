import { useEffect } from 'react';

/**
 * Custom hook to register keyboard shortcuts.
 * @param {Object} shortcuts - Mapping of key combos to callbacks (e.g. { 'Alt+1': () => ... })
 */
export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Build the key string (e.g. "Alt+1", "Ctrl+K", "Enter")
      const keys = [];
      if (event.ctrlKey) keys.push('Ctrl');
      if (event.altKey) keys.push('Alt');
      if (event.shiftKey) keys.push('Shift');
      
      // Standardize key name
      let key = event.key;
      if (key === ' ') key = 'Space';
      if (key.length === 1) key = key.toUpperCase();
      
      keys.push(key);
      const combo = keys.join('+');

      // Check if we have a match
      if (shortcuts[combo]) {
        // Prevent default if it's a known shortcut to avoid browser behavior
        // But only if it's an Alt or Ctrl combo (to allow typing in inputs)
        if (event.altKey || event.ctrlKey || (event.key === 'Escape') || (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA')) {
          event.preventDefault();
        }
        shortcuts[combo](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
