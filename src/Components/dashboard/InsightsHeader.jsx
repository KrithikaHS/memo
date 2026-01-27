import { motion } from 'framer-motion';
import { Bell, DollarSign, Shirt, StickyNote, TrendingUp } from 'lucide-react';

export default function InsightsHeader({ laundryCount, spendingTotal, notesCount, remindersCount }) {
  const insights = [
    {
      label: 'Laundry Loads',
      value: laundryCount,
      icon: Shirt,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
    },
    {
      label: 'This Week',
      value: `$${spendingTotal.toFixed(0)}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Notes',
      value: notesCount,
      icon: StickyNote,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Reminders',
      value: remindersCount,
      icon: Bell,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Quick Insights</h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl ${insight.bgColor} p-5 border border-white/50`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  {insight.label}
                </p>
                <p className={`text-3xl font-bold bg-linear-to-r ${insight.color} bg-clip-text text-transparent`}>
                  {insight.value}
                </p>
              </div>
              <div className={`p-2 rounded-xl bg-linear-to-br ${insight.color} shadow-lg`}>
                <insight.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-linear-to-br ${insight.color} opacity-10`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}