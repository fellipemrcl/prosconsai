'use client';

import { useProConStore } from '@/store/procon';
import { ListsOverview } from '@/components/ListsOverview';
import { ProConListView } from '@/components/ProConListView';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { currentList } = useProConStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 bg-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentList ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ProConListView list={currentList} />
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ListsOverview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
