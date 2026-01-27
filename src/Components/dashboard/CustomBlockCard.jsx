import { CheckCircle2, FileText, Hash, ListChecks, Star } from 'lucide-react';
import BlockCard from './BlockCard';

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

export default function CustomBlockCard({ block, onClick, index }) {
  const Icon = iconMap[block.icon] || Star;
  const gradient = gradientMap[block.color] || gradientMap.indigo;
  const items = block.items || [];

  const renderContent = () => {
    switch (block.block_type) {
      case 'checklist':
        const checkedCount = items.filter(i => i.checked).length;
        return (
          <>
            <div className="space-y-2">
              {items.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/50"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                    {item.checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${item.checked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 py-2 text-center">No items yet</p>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              {checkedCount}/{items.length} completed
            </div>
          </>
        );

      case 'counter':
        const total = items.reduce((sum, i) => sum + (i.value || 0), 0);
        return (
          <div className="py-4 text-center">
            <p className={`text-4xl font-bold bg-linear-to-r ${gradient} bg-clip-text text-transparent`}>
              {total}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{items.length} entries</p>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            {items.slice(0, 2).map((item, idx) => (
              <div key={item.id || idx} className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/50">
                <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">{item.text}</p>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-2 text-center">No entries yet</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BlockCard
      title={block.name}
      icon={Icon}
      gradient={gradient}
      bgColor={`text-${block.color}-600`}
      onClick={onClick}
      index={index}
    >
      {renderContent()}
    </BlockCard>
  );
}