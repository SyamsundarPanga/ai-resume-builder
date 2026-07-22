import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '@components/common/Button';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  onStay,
  onLeave
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onStay();
      } else if (e.key === 'Enter') {
        onStay(); // Stay is the safest default choice
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStay]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onStay}
            className="absolute inset-0 bg-[#0A0A09]/60 backdrop-blur-sm"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#141311] border border-[#B8860B]/15 rounded-3xl p-6 shadow-2xl space-y-6 text-left"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center text-[#B8860B] shrink-0">
                <FiAlertTriangle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#1A1A1A] dark:text-[#F7F4ED]">
                  Unsaved Changes
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You have unsaved changes on this form. Leaving or navigating away will discard them permanently.
                </p>
              </div>
            </div>

            <div className="flex space-x-2.5 pt-2">
              <Button size="sm" variant="ghost" fullWidth onClick={onStay} className="font-bold">
                Stay & Edit
              </Button>
              <Button size="sm" variant="primary" fullWidth onClick={onLeave} className="font-bold">
                Discard Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UnsavedChangesDialog;
