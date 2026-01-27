import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Pin, PinOff, Plus, StickyNote, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

const colorOptions = [
  { value: 'yellow', bg: 'bg-amber-50 dark:bg-amber-900/40', border: 'border-amber-200 dark:border-amber-700/50', ring: 'ring-amber-400' },
  { value: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-700/50', ring: 'ring-blue-400' },
  { value: 'green', bg: 'bg-emerald-50 dark:bg-emerald-900/40', border: 'border-emerald-200 dark:border-emerald-700/50', ring: 'ring-emerald-400' },
  { value: 'pink', bg: 'bg-pink-50 dark:bg-pink-900/40', border: 'border-pink-200 dark:border-pink-700/50', ring: 'ring-pink-400' },
  { value: 'purple', bg: 'bg-violet-50 dark:bg-violet-900/40', border: 'border-violet-200 dark:border-violet-700/50', ring: 'ring-violet-400' },
];

export default function NotesModal({ isOpen, onClose, notes, onCreate, onUpdate, onDelete }) {
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'yellow', pinned: false });
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  const handleCreate = async () => {
    if (!newNote.title || !newNote.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter both a title and content for your note.",
      });
      return;
    }
    setSaving(true);
    await onCreate(newNote);
    setNewNote({ title: '', content: '', color: 'yellow', pinned: false });
    setIsAdding(false);
    setSaving(false);
  };

  const togglePin = async (note) => {
    await onUpdate(note.id, { ...note, pinned: !note.pinned });
  };

  const pinnedNotes = notes.filter(n => n.pinned);
  const unpinnedNotes = notes.filter(n => !n.pinned);

  const getColorStyle = (color) => {
    return colorOptions.find(c => c.value === color) || colorOptions[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-amber-500 to-orange-600">
              <StickyNote className="w-5 h-5 text-white" />
            </div>
            Notes
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Add New Note */}
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Note
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="dark:bg-slate-900 dark:border-slate-700"
              />

              <Textarea
                placeholder="Write your note..."
                rows={3}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Color:</span>
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewNote({ ...newNote, color: color.value })}
                    className={`w-6 h-6 rounded-full ${color.bg} border-2 ${color.border} ${newNote.color === color.value ? `ring-2 ${color.ring}` : ''
                      }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={saving} className="flex-1 bg-linear-to-r from-amber-500 to-orange-600">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Note'}
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="dark:text-slate-200 dark:hover:bg-slate-800">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </h4>
              <AnimatePresence>
                {pinnedNotes.map((note) => {
                  const colorStyle = getColorStyle(note.color);
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-2xl ${colorStyle.bg} border ${colorStyle.border}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">{note.title}</h4>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePin(note)}
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 h-8 w-8 p-0"
                          >
                            <PinOff className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(note.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Other Notes */}
          <div className="space-y-3">
            {unpinnedNotes.length > 0 && pinnedNotes.length > 0 && (
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Other Notes</h4>
            )}
            <AnimatePresence>
              {unpinnedNotes.map((note) => {
                const colorStyle = getColorStyle(note.color);
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-4 rounded-2xl ${colorStyle.bg} border ${colorStyle.border}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{note.title}</h4>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePin(note)}
                          className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 h-8 w-8 p-0"
                        >
                          <Pin className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(note.id)}
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {notes.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notes yet</p>
                <p className="text-sm">Add your first note above</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}