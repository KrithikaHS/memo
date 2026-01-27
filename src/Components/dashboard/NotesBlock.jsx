import { Pin, StickyNote } from 'lucide-react';
import BlockCard from './BlockCard';

export default function NotesBlock({ notes, onClick }) {
  const pinnedNotes = notes.filter(n => n.pinned);
  
  const colorStyles = {
    yellow: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-emerald-50 border-emerald-200',
    pink: 'bg-pink-50 border-pink-200',
    purple: 'bg-violet-50 border-violet-200',
  };

  const recentNotes = notes.slice(0, 3);

  return (
    <BlockCard
      title="Notes"
      icon={StickyNote}
      gradient="from-amber-500 to-orange-600"
      bgColor="text-amber-600"
      badge={pinnedNotes.length > 0 ? `${pinnedNotes.length} pinned` : null}
      onClick={onClick}
      index={2}
    >
      {recentNotes.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No notes yet</p>
      ) : (
        <div className="space-y-2.5">
          {recentNotes.map((note, idx) => (
            <div 
              key={note.id || idx}
              className={`p-3 rounded-xl border ${colorStyles[note.color] || colorStyles.yellow}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {note.pinned && <Pin className="w-3 h-3 text-amber-600" />}
                    <h4 className="text-sm font-medium text-slate-800 truncate">
                      {note.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {note.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">{notes.length} total notes</span>
        <span className="text-xs text-amber-600 font-medium">{pinnedNotes.length} pinned</span>
      </div>
    </BlockCard>
  );
}