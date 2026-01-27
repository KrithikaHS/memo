import { format, isPast, isToday } from 'date-fns';
import { AlertCircle, Bell, CheckCircle2, Clock } from 'lucide-react';
import BlockCard from './BlockCard';

export default function RemindersBlock({ reminders, onClick }) {
  const pendingReminders = reminders.filter(r => !r.completed);
  const urgentReminders = pendingReminders.filter(r => {
    if (!r.due_date) return false;
    return isPast(new Date(r.due_date)) || isToday(new Date(r.due_date));
  });
  
  const priorityColors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
  };

  const recentReminders = reminders.filter(r => !r.completed).slice(0, 3);

  return (
    <BlockCard
      title="Reminders"
      icon={Bell}
      gradient="from-violet-500 to-purple-600"
      bgColor="text-violet-600"
      badge={urgentReminders.length > 0 ? `${urgentReminders.length} urgent` : null}
      onClick={onClick}
      index={3}
    >
      {recentReminders.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No pending reminders</p>
      ) : (
        <div className="space-y-2.5">
          {recentReminders.map((reminder, idx) => {
            const isOverdue = reminder.due_date && isPast(new Date(reminder.due_date)) && !isToday(new Date(reminder.due_date));
            const isDueToday = reminder.due_date && isToday(new Date(reminder.due_date));
            
            return (
              <div 
                key={reminder.id || idx}
                className={`p-3 rounded-xl ${isOverdue ? 'bg-rose-50' : isDueToday ? 'bg-amber-50' : 'bg-slate-50/80'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                      <h4 className="text-sm font-medium text-slate-800 truncate">
                        {reminder.title}
                      </h4>
                    </div>
                    {reminder.due_date && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className={`text-xs ${isOverdue ? 'text-rose-600' : isDueToday ? 'text-amber-600' : 'text-slate-500'}`}>
                          {isDueToday ? 'Today' : format(new Date(reminder.due_date), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[reminder.priority]}`}>
                    {reminder.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">{pendingReminders.length} pending</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-xs">{reminders.length - pendingReminders.length} done</span>
        </div>
      </div>
    </BlockCard>
  );
}