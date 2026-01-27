import { format, isThisMonth, isThisWeek, isToday } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, DollarSign, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../ui/use-toast';

const categories = ['groceries', 'utilities', 'entertainment', 'transport', 'dining', 'shopping', 'health', 'other'];

const categoryColors = {
  groceries: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  utilities: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  transport: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  dining: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
  shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
  health: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400',
  other: 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300',
};

export default function SpendingsModal({ isOpen, onClose, spendings, onCreate, onDelete }) {
  const [newSpending, setNewSpending] = useState({ title: '', amount: '', category: 'other' });
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filter, setFilter] = useState('all'); // all, today, week, month

  const total = spendings.reduce((sum, s) => sum + (s.amount || 0), 0);

  const todayTotal = spendings
    .filter(s => isToday(new Date(s.date || s.created_date)))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const weekTotal = spendings
    .filter(s => isThisWeek(new Date(s.date || s.created_date)))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const monthTotal = spendings
    .filter(s => isThisMonth(new Date(s.date || s.created_date)))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const filteredSpendings = spendings.filter(s => {
    const date = new Date(s.date || s.created_date);
    if (filter === 'today') return isToday(date);
    if (filter === 'week') return isThisWeek(date);
    if (filter === 'month') return isThisMonth(date);
    return true;
  });

  const { toast } = useToast();

  const handleCreate = async () => {
    if (!newSpending.title || !newSpending.amount) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter both a title and an amount.",
      });
      return;
    }
    setSaving(true);
    await onCreate({
      ...newSpending,
      amount: parseFloat(newSpending.amount),
      date: new Date().toISOString().split('T')[0],
    });
    setNewSpending({ title: '', amount: '', category: 'other' });
    setIsAdding(false);
    setSaving(false);
  };

  // Group by category
  const byCategory = spendings.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.amount;
    return acc;
  }, {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            Spending Tracker
          </DialogTitle>

        </DialogHeader>

        {/* KPIs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Today</p>
            <p className="text-lg font-bold text-orange-700 dark:text-orange-300">${todayTotal.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Week</p>
            <p className="text-lg font-bold text-purple-700 dark:text-purple-300">${weekTotal.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Month</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">${monthTotal.toFixed(0)}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
          {['all', 'today', 'week', 'month'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 text-xs font-medium py-1.5 rounded-lg capitalize transition-all ${filter === f
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Add New Spending */}
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <Input
                placeholder="What did you spend on?"
                value={newSpending.title}
                onChange={(e) => setNewSpending({ ...newSpending, title: e.target.value })}
                className="dark:bg-slate-900 dark:border-slate-700"
              />

              <div className="gap-2">
                <div className="relative flex-1 min-w-0">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-9 text-lg font-medium dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    value={newSpending.amount}
                    onChange={(e) => setNewSpending({ ...newSpending, amount: e.target.value })}
                  />
                </div>
                <Select
                  value={newSpending.category}
                  onValueChange={(v) => setNewSpending({ ...newSpending, category: v })}
                >
                  <SelectTrigger className="w-36 dark:bg-slate-900 dark:border-slate-700">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={saving} className="flex-1 bg-linear-to-r from-emerald-500 to-teal-600">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Expense'}
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="dark:text-slate-200 dark:hover:bg-slate-800">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Spendings List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredSpendings.map((spending) => (
                <motion.div
                  key={spending.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[spending.category]}`}>
                          {spending.category}
                        </span>
                        {spending.date && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(spending.date), 'MMM d')}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{spending.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">${spending.amount?.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(spending.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {spendings.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No expenses tracked</p>
                <p className="text-sm">Add your first expense above</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}