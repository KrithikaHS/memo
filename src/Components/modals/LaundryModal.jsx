import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, Plus, Shirt, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const loadTypes = ['whites', 'colors', 'darks', 'delicates', 'bedding', 'towels'];
const statusOptions = ['pending', 'washing', 'drying', 'complete'];

const statusColors = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
  washing: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  drying: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30',
  complete: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
};

export default function LaundryModal({ isOpen, onClose, loads, onCreate, onUpdate, onDelete }) {
  const [newLoad, setNewLoad] = useState({ load_type: 'colors', status: 'pending', notes: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newLoad.load_type) return;
    setSaving(true);
    await onCreate({
      ...newLoad,
      scheduled_date: new Date().toISOString().split('T')[0],
    });
    setNewLoad({ load_type: 'colors', status: 'pending', notes: '' });
    setIsAdding(false);
    setSaving(false);
  };

  const handleStatusChange = async (load, newStatus) => {
    await onUpdate(load.id, { ...load, status: newStatus });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            Laundry Manager
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Add New Load */}
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Load
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <Select
                value={newLoad.load_type}
                onValueChange={(v) => setNewLoad({ ...newLoad, load_type: v })}
              >
                <SelectTrigger className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectValue placeholder="Load type" />
                </SelectTrigger>
                <SelectContent>
                  {loadTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Notes (optional)"
                value={newLoad.notes}
                onChange={(e) => setNewLoad({ ...newLoad, notes: e.target.value })}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />

              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={saving} className="flex-1 bg-linear-to-r from-cyan-500 to-blue-600">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Load'}
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Loads List */}
          <div className="space-y-3">
            <AnimatePresence>
              {loads.map((load) => (
                <motion.div
                  key={load.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 capitalize">{load.load_type}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(load.id)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(load, status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${load.status === status
                          ? statusColors[status] + ' ring-2 ring-offset-1 ring-slate-300 dark:ring-slate-600'
                          : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                          }`}
                      >
                        {status === 'complete' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        {status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                        {status}
                      </button>
                    ))}
                  </div>

                  {load.notes && (
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{load.notes}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loads.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <Shirt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No laundry loads yet</p>
                <p className="text-sm">Add your first load above</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}