// File 1 - useAddItemShortcut.js
import { useEffect, useCallback } from 'react';

export function useAltShortcut(callback, keyCode) {
    // Use useCallback to memoize the event handler
    const handleKeyPress = useCallback((event) => {
        if (event.altKey && event.keyCode === keyCode) { // Alt + N
            callback();
        }
    }, [callback, keyCode]); // Include callback in dependencies

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener on cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]); // Include handleKeyPress in dependencies
}