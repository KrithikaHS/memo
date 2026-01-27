import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function BlockCard({
  title,
  icon: Icon,
  gradient,
  bgColor,
  children,
  onClick,
  badge,
  index = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl cursor-pointer
        bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-white/10
        shadow-lg shadow-slate-200/50 dark:shadow-black/20
        hover:shadow-xl hover:shadow-slate-300/50 dark:hover:shadow-black/40
        transition-shadow duration-300
      `}
    >
      {/* Header */}
      <div className={`px-5 pt-5 pb-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-linear-to-br ${gradient} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} bg-opacity-20`}>
              {badge}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        {children}
      </div>

      {/* Decorative gradient */}
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-linear-to-br ${gradient} opacity-5`} />
    </motion.div>
  );
}