import { addDays, format, isPast, isToday } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Bell, CheckCircle2, Circle, Clock, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const priorityOptions = ['low', 'medium', 'high'];
const priorityColors = {
  low: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-700',
  medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
  high: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
};

export default function RemindersModal({ isOpen, onClose, reminders, onCreate, onUpdate, onDelete }) {
  const [newReminder, setNewReminder] = useState({
    title: '',
    due_date: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    priority: 'medium'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newReminder.title) return;
    setSaving(true);
    await onCreate({
      ...newReminder,
      completed: false,
    });
    setNewReminder({
      title: '',
      due_date: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
      priority: 'medium'
    });
    setIsAdding(false);
    setSaving(false);
  };

  const toggleComplete = async (reminder) => {
    await onUpdate(reminder.id, { ...reminder, completed: !reminder.completed });
  };

  const pendingReminders = reminders.filter(r => !r.completed);
  const overdueReminders = pendingReminders.filter(r => r.due_date && isPast(new Date(r.due_date)) && !isToday(new Date(r.due_date)));
  const upcomingReminders = pendingReminders.filter(r => !r.due_date || !isPast(new Date(r.due_date)) || isToday(new Date(r.due_date)));
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Reminders
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Add New Reminder */}
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <Input
                placeholder="What do you need to remember?"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />

              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  className="flex-1 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark]"
                  value={newReminder.due_date}
                  onChange={(e) => setNewReminder({ ...newReminder, due_date: e.target.value })}
                />
                <Select
                  value={newReminder.priority}
                  onValueChange={(v) => setNewReminder({ ...newReminder, priority: v })}
                >
                  <SelectTrigger className="w-32 dark:bg-slate-900 dark:border-slate-700">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(p => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={saving} className="flex-1 bg-linear-to-r from-violet-500 to-purple-600">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Reminder'}
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Overdue Reminders */}
          {overdueReminders.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wide flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Overdue ({overdueReminders.length})
              </h4>
              <AnimatePresence>
                {overdueReminders.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 rounded-2xl border shadow-sm bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(reminder)}
                        className="mt-0.5 text-rose-400 hover:text-emerald-500 transition-colors"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-800 dark:text-slate-100">{reminder.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs flex items-center gap-1 text-rose-600 dark:text-rose-400">
                            <Clock className="w-3 h-3" />
                            {format(new Date(reminder.due_date), 'MMM d, h:mm a')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[reminder.priority]}`}>
                            {reminder.priority}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(reminder.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Upcoming Reminders */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Upcoming ({upcomingReminders.length})
            </h4>
            <AnimatePresence>
              {upcomingReminders.map((reminder) => {
                const isDueToday = reminder.due_date && isToday(new Date(reminder.due_date));
                // ... logic for upcoming ...
                let cardClasses = `p-4 rounded-2xl border shadow-sm `;
                if (isDueToday) {
                  cardClasses += 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
                } else {
                  cardClasses += 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                }

                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cardClasses}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(reminder)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-800 dark:text-slate-100">{reminder.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {reminder.due_date && (
                            <span className={`text-xs flex items-center gap-1 ${isDueToday ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                              <Clock className="w-3 h-3" />
                              {isDueToday ? 'Today' : format(new Date(reminder.due_date), 'MMM d, h:mm a')}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[reminder.priority]}`}>
                            {reminder.priority}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(reminder.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {upcomingReminders.length === 0 && overdueReminders.length === 0 && (
              <p className="text-center py-4 text-slate-400 dark:text-slate-500 text-sm">No pending reminders</p>
            )}
          </div>

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Completed ({completedReminders.length})
              </h4>
              <AnimatePresence>
                {completedReminders.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(reminder)}
                        className="mt-0.5 text-emerald-500 hover:text-slate-400 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-500 line-through dark:text-slate-500">{reminder.title}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(reminder.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {reminders.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No reminders yet</p>
              <p className="text-sm">Add your first reminder above</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}