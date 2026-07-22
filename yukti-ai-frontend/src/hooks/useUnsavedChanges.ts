import { useState, useEffect } from 'react';

export const useUnsavedChanges = (initialVal = false) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(initialVal);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges
  };
};

export default useUnsavedChanges;
