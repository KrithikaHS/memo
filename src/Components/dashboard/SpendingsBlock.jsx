import { DollarSign } from 'lucide-react';
import BlockCard from './BlockCard';

export default function SpendingsBlock({ spendings, onClick }) {
  const total = spendings.reduce((sum, s) => sum + (s.amount || 0), 0);
  
  const categoryColors = {
    groceries: 'bg-emerald-100 text-emerald-700',
    utilities: 'bg-blue-100 text-blue-700',
    entertainment: 'bg-purple-100 text-purple-700',
    transport: 'bg-amber-100 text-amber-700',
    dining: 'bg-rose-100 text-rose-700',
    shopping: 'bg-pink-100 text-pink-700',
    health: 'bg-cyan-100 text-cyan-700',
    other: 'bg-slate-100 text-slate-700',
  };

  const recentSpendings = spendings.slice(0, 3);

  // Group by category for summary
  const byCategory = spendings.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <BlockCard
      title="Spendings"
      icon={DollarSign}
      gradient="from-emerald-500 to-teal-600"
      bgColor="text-emerald-600"
      badge={`$${total.toFixed(0)}`}
      onClick={onClick}
      index={1}
    >
      {recentSpendings.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No expenses tracked</p>
      ) : (
        <div className="space-y-2.5">
          {recentSpendings.map((spending, idx) => (
            <div 
              key={spending.id || idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${categoryColors[spending.category]}`}>
                  {spending.category}
                </span>
                <span className="text-sm text-slate-600 truncate max-w-25">
                  {spending.title}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                ${spending.amount?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {topCategories.length > 0 && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          {topCategories.map(([cat, amount]) => (
            <span 
              key={cat}
              className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${categoryColors[cat]} opacity-80`}
            >
              {cat}: ${amount.toFixed(0)}
            </span>
          ))}
        </div>
      )}
    </BlockCard>
  );
}