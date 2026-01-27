import { FileText, Hash, ListChecks, Loader2, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

const blockTypes = [
  { value: 'checklist', label: 'Checklist', icon: ListChecks, description: 'Track tasks with checkboxes' },
  { value: 'counter', label: 'Counter', icon: Hash, description: 'Track numbers and totals' },
  { value: 'text', label: 'Notes', icon: FileText, description: 'Free-form text entries' },
];

const colorOptions = [
  { value: 'indigo', bg: 'bg-indigo-500', label: 'Indigo' },
  { value: 'rose', bg: 'bg-rose-500', label: 'Rose' },
  { value: 'emerald', bg: 'bg-emerald-500', label: 'Emerald' },
  { value: 'amber', bg: 'bg-amber-500', label: 'Amber' },
  { value: 'violet', bg: 'bg-violet-500', label: 'Violet' },
];

const iconOptions = [
  { value: 'Star', icon: Star },
  { value: 'ListChecks', icon: ListChecks },
  { value: 'Hash', icon: Hash },
  { value: 'FileText', icon: FileText },
];

export default function CreateBlockModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [blockType, setBlockType] = useState('checklist');
  const [color, setColor] = useState('indigo');
  const [icon, setIcon] = useState('Star');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onCreate({
      name: name.trim(),
      block_type: blockType,
      color,
      icon,
      items: [],
    });
    setName('');
    setBlockType('checklist');
    setColor('indigo');
    setIcon('Star');
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">

            <div className="p-2 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600">
              <Plus className="w-5 h-5 text-white" />
            </div>
            Create Custom Block
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Block Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Block Name</label>
            <Input
              placeholder="e.g., Habits, Goals, Shopping List..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark:bg-slate-800 dark:border-slate-700"
            />
          </div>

          {/* Block Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Block Type</label>
            <div className="grid grid-cols-3 gap-2">
              {blockTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setBlockType(type.value)}
                  className={`p-3 rounded-xl border-2 transition-all ${blockType === type.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  <type.icon className={`w-5 h-5 mx-auto mb-1 ${blockType === type.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                    }`} />
                  <p className={`text-xs font-medium ${blockType === type.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                    {type.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Color</label>
            <div className="flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-10 h-10 rounded-xl ${c.bg} transition-all ${color === c.value
                      ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                      : 'hover:scale-105'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Icon</label>
            <div className="flex gap-2">
              {iconOptions.map((i) => (
                <button
                  key={i.value}
                  onClick={() => setIcon(i.value)}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${icon === i.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <i.icon className={`w-5 h-5 ${icon === i.value ? 'text-indigo-600' : 'text-slate-500'
                    }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || saving}
            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 h-12"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}