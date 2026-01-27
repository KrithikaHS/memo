import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { base44 } from '../api/localClient';
import { Button } from '../Components/ui/button';

import CustomBlockCard from '../Components/dashboard/CustomBlockCard';
import InsightsHeader from '../Components/dashboard/InsightsHeader';
import LaundryBlock from '../Components/dashboard/LaundryBlock';
import NotesBlock from '../Components/dashboard/NotesBlock';
import RemindersBlock from '../Components/dashboard/RemindersBlock';
import SpendingsBlock from '../Components/dashboard/SpendingsBlock';
import { NotificationManager } from '../Components/NotificationManager';

import CreateBlockModal from '../Components/modals/CreateBlockModal';
import CustomBlockModal from '../Components/modals/CustomBlockModal';
import LaundryModal from '../Components/modals/LaundryModal';
import NotesModal from '../Components/modals/NotesModal';
import RemindersModal from '../Components/modals/RemindersModal';
import SpendingsModal from '../Components/modals/SpendingsModal';

import { ThemeToggle } from '../Components/ThemeToggle';

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Modal states
  const [laundryModalOpen, setLaundryModalOpen] = useState(false);
  const [spendingsModalOpen, setSpendingsModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [remindersModalOpen, setRemindersModalOpen] = useState(false);
  const [createBlockModalOpen, setCreateBlockModalOpen] = useState(false);
  const [selectedCustomBlock, setSelectedCustomBlock] = useState(null);

  // Fetch data
  /* Fetch data */
  const { data: laundryLoads = [], isLoading: loadingLaundry } = useQuery({
    queryKey: ['laundryLoads'],
    queryFn: () => base44.LaundryLoad.list('-created_date'),
  });

  const { data: spendings = [], isLoading: loadingSpendings } = useQuery({
    queryKey: ['spendings'],
    queryFn: () => base44.Spending.list('-created_date'),
  });

  const { data: notes = [], isLoading: loadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => base44.Note.list('-created_date'),
  });

  const { data: reminders = [], isLoading: loadingReminders } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => base44.Reminder.list('-created_date'),
  });

  const { data: customBlocks = [], isLoading: loadingCustomBlocks } = useQuery({
    queryKey: ['customBlocks'],
    queryFn: () => base44.CustomBlock.list('-created_date'),
  });

  /* Mutations */
  const createLaundry = useMutation({
    mutationFn: (data) => base44.LaundryLoad.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['laundryLoads'] }),
  });

  const updateLaundry = useMutation({
    mutationFn: ({ id, data }) => base44.LaundryLoad.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['laundryLoads'] }),
  });

  const deleteLaundry = useMutation({
    mutationFn: (id) => base44.LaundryLoad.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['laundryLoads'] }),
  });

  const createSpending = useMutation({
    mutationFn: (data) => base44.Spending.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spendings'] }),
  });

  const deleteSpending = useMutation({
    mutationFn: (id) => base44.Spending.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spendings'] }),
  });

  const createNote = useMutation({
    mutationFn: (data) => base44.Note.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const updateNote = useMutation({
    mutationFn: ({ id, data }) => base44.Note.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const deleteNote = useMutation({
    mutationFn: (id) => base44.Note.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const createReminder = useMutation({
    mutationFn: (data) => base44.Reminder.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  });

  const updateReminder = useMutation({
    mutationFn: ({ id, data }) => base44.Reminder.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  });

  const deleteReminder = useMutation({
    mutationFn: (id) => base44.Reminder.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  });

  const createCustomBlock = useMutation({
    mutationFn: (data) => base44.CustomBlock.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customBlocks'] }),
  });

  const updateCustomBlock = useMutation({
    mutationFn: ({ id, data }) => base44.CustomBlock.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customBlocks'] }),
  });

  const deleteCustomBlock = useMutation({
    mutationFn: (id) => base44.CustomBlock.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customBlocks'] });
      setSelectedCustomBlock(null);
    },
  });

  // Calculate insights
  const weeklySpending = spendings
    .filter(s => {
      const date = new Date(s.date || s.created_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    })
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const pendingReminders = reminders.filter(r => !r.completed).length;

  const isLoading = loadingLaundry || loadingSpendings || loadingNotes || loadingReminders || loadingCustomBlocks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Memo</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 ml-11">Remember Your Day!</p>
          </div>
          <ThemeToggle />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {/* Insights Header */}
            <InsightsHeader
              laundryCount={laundryLoads.filter(l => l.status !== 'complete').length}
              spendingTotal={weeklySpending}
              notesCount={notes.length}
              remindersCount={pendingReminders}
            />

            {/* Main Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <LaundryBlock
                loads={laundryLoads}
                onClick={() => setLaundryModalOpen(true)}
              />
              <SpendingsBlock
                spendings={spendings}
                onClick={() => setSpendingsModalOpen(true)}
              />
              <NotesBlock
                notes={notes}
                onClick={() => setNotesModalOpen(true)}
              />
              <RemindersBlock
                reminders={reminders}
                onClick={() => setRemindersModalOpen(true)}
              />
            </div>

            {/* Custom Blocks */}
            {customBlocks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
                  Custom Blocks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customBlocks.map((block, index) => (
                    <CustomBlockCard
                      key={block.id}
                      block={block}
                      index={index + 4}
                      onClick={() => setSelectedCustomBlock(block)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Add Custom Block Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={() => setCreateBlockModalOpen(true)}
                className="w-full h-20 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 rounded-2xl transition-all duration-300 group"
              >
                <Plus className="w-5 h-5 mr-2 text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400 transition-colors">
                  Add Custom Block
                </span>
              </Button>
            </motion.div>
          </>
        )}

        {/* Modals */}
        <LaundryModal
          isOpen={laundryModalOpen}
          onClose={() => setLaundryModalOpen(false)}
          loads={laundryLoads}
          onCreate={(data) => createLaundry.mutateAsync(data)}
          onUpdate={(id, data) => updateLaundry.mutateAsync({ id, data })}
          onDelete={(id) => deleteLaundry.mutateAsync(id)}
        />

        <SpendingsModal
          isOpen={spendingsModalOpen}
          onClose={() => setSpendingsModalOpen(false)}
          spendings={spendings}
          onCreate={(data) => createSpending.mutateAsync(data)}
          onDelete={(id) => deleteSpending.mutateAsync(id)}
        />

        <NotesModal
          isOpen={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          notes={notes}
          onCreate={(data) => createNote.mutateAsync(data)}
          onUpdate={(id, data) => updateNote.mutateAsync({ id, data })}
          onDelete={(id) => deleteNote.mutateAsync(id)}
        />

        <RemindersModal
          isOpen={remindersModalOpen}
          onClose={() => setRemindersModalOpen(false)}
          reminders={reminders}
          onCreate={(data) => createReminder.mutateAsync(data)}
          onUpdate={(id, data) => updateReminder.mutateAsync({ id, data })}
          onDelete={(id) => deleteReminder.mutateAsync(id)}
        />

        <CreateBlockModal
          isOpen={createBlockModalOpen}
          onClose={() => setCreateBlockModalOpen(false)}
          onCreate={(data) => createCustomBlock.mutateAsync(data)}
        />

        <CustomBlockModal
          isOpen={!!selectedCustomBlock}
          onClose={() => setSelectedCustomBlock(null)}
          block={selectedCustomBlock}
          onUpdate={async (id, data) => {
            setSelectedCustomBlock(data);
            await updateCustomBlock.mutateAsync({ id, data });
          }}
          onDelete={(id) => deleteCustomBlock.mutateAsync(id)}
        />
        <NotificationManager />
      </div>
    </div>

  );
}