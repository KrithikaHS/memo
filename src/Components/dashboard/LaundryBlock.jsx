import { CheckCircle2, Clock, Shirt } from 'lucide-react';
import BlockCard from './BlockCard';

export default function LaundryBlock({ loads, onClick }) {
  const pendingLoads = loads.filter(l => l.status === 'pending' || l.status === 'washing' || l.status === 'drying');
  const completedLoads = loads.filter(l => l.status === 'complete');
  
  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    washing: 'bg-blue-100 text-blue-700',
    drying: 'bg-cyan-100 text-cyan-700',
    complete: 'bg-emerald-100 text-emerald-700',
  };

  const recentLoads = loads.slice(0, 3);

  return (
    <BlockCard
      title="Laundry"
      icon={Shirt}
      gradient="from-cyan-500 to-blue-600"
      bgColor="text-cyan-600"
      badge={pendingLoads.length > 0 ? `${pendingLoads.length} active` : null}
      onClick={onClick}
      index={0}
    >
      {recentLoads.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No laundry loads yet</p>
      ) : (
        <div className="space-y-2.5">
          {recentLoads.map((load, idx) => (
            <div 
              key={load.id || idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${load.status === 'complete' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {load.load_type?.replace('_', ' ')}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[load.status]}`}>
                {load.status}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">{pendingLoads.length} pending</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-xs">{completedLoads.length} complete</span>
        </div>
      </div>
    </BlockCard>
  );
}