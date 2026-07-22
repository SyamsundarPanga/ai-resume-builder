import React from 'react';
import Card from '@components/common/Card';
import { useAuth } from '@hooks/useAuth';
import { motion } from 'framer-motion';

export const WelcomeSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="text-left bg-gradient-to-br from-white to-[#F7F4ED] dark:from-[#141311] dark:to-[#0A0A09] border border-[#B8860B]/15 p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#B8860B]/5 rounded-full filter blur-2xl" />
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] dark:text-[#F7F4ED]">
          Welcome back, <span className="text-[#B8860B]">{user?.name || 'Candidate'}</span>!
        </h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
          Yukti AI is your strategic workspace to optimize your resume, evaluate ATS compliance, and land target roles. Scroll below or navigate directly through each block to refine your documents.
        </p>
      </Card>
    </motion.div>
  );
};

export default WelcomeSection;
