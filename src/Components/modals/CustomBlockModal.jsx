import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Circle, FileText, Hash, ListChecks, Loader2, Plus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

const iconMap = {
  Star: Star,
  ListChecks: ListChecks,
  Hash: Hash,
  FileText: FileText,
};

const gradientMap = {
  indigo: 'from-indigo-500 to-blue-600',
  rose: 'from-rose-500 to-pink-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  violet: 'from-violet-500 to-purple-600',
};

export default function CustomBlockModal({ isOpen, onClose, block, onUpdate, onDelete }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { toast } = useToast();

  if (!block) return null;

  const Icon = iconMap[block.icon] || Star;
  const gradient = gradientMap[block.color] || gradientMap.indigo;
  const items = block.items || [];

  const addItem = async () => {
    const blockType = block.block_type?.toLowerCase() || 'text';
    if ((!newItemText && blockType !== 'counter') || (blockType === 'counter' && !newItemValue)) {
      toast({
        variant: "destructive",
        title: "Empty Field",
        description: "Please enter a value or text for the item.",
      });
      return;
    }

    setSaving(true);
    const newItem = {
      id: Date.now().toString(),
      text: newItemText,
      checked: false,
      value: parseFloat(newItemValue) || 0,
    };

    await onUpdate(block.id, {
      ...block,
      items: [...items, newItem],
    });

    setNewItemText('');
    setNewItemValue('');
    setIsAdding(false);
    setSaving(false);
  };

  const toggleItem = async (itemId) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    await onUpdate(block.id, { ...block, items: updatedItems });
  };

  const deleteItem = async (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    await onUpdate(block.id, { ...block, items: updatedItems });
  };

  console.log('Rendering CustomBlockModal', { isOpen, block });

  const blockType = block.block_type?.toLowerCase() || 'text';

  const renderAddForm = () => {
    switch (blockType) {
      case 'checklist':
        return (
          <div className="flex gap-2">
            <Input
              placeholder="New item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="dark:bg-slate-900 dark:border-slate-700"
            />
            <Button onClick={addItem} disabled={saving} className={`bg-linear-to-r ${gradient}`}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
            </Button>
          </div>
        );
      case 'counter':
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Value"
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="dark:bg-slate-900 dark:border-slate-700"
            />
            <Input
              placeholder="Label (optional)"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="dark:bg-slate-900 dark:border-slate-700"
            />
            <Button onClick={addItem} disabled={saving} className={`bg-linear-to-r ${gradient}`}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
            </Button>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <Textarea
              placeholder="Write something..."
              rows={3}
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="dark:bg-slate-900 dark:border-slate-700"
            />
            <Button onClick={addItem} disabled={saving} className={`w-full bg-linear-to-r ${gradient}`}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Entry'}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderItems = () => {
    switch (blockType) {
      case 'checklist':
        return items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={`${item.checked ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'} hover:text-emerald-500 transition-colors`}
            >
              {item.checked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
            <span className={`flex-1 ${item.checked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
              {item.text}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteItem(item.id)}
              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ));

      case 'counter':
        const total = items.reduce((sum, i) => sum + (i.value || 0), 0);
        return (
          <>
            <div className={`p-6 rounded-2xl bg-linear-to-br ${gradient} text-white text-center mb-4`}>
              <p className="text-5xl font-bold">{total}</p>
              <p className="text-sm opacity-80 mt-1">Total</p>
            </div>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <span className="text-slate-700 dark:text-slate-200">{item.text || 'Entry'}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">+{item.value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </>
        );

      case 'text':
        return items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap flex-1">{item.text}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem(item.id)}
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 h-8 w-8 p-0 ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ));

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-linear-to-br ${gradient}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {block.name}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Add Form */}
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {block.block_type === 'checklist' ? 'Item' : block.block_type === 'counter' ? 'Value' : 'Entry'}
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {renderAddForm()}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="mt-2 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
            </motion.div>
          )}

          {/* Items */}
          <div className="space-y-3">
            <AnimatePresence>
              {renderItems()}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <Icon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No items yet</p>
                <p className="text-sm">Add your first item above</p>
              </div>
            )}
          </div>
        </div>
        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            className="w-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}