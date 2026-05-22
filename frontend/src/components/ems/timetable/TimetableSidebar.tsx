import React from 'react';
import { Search, CalendarDays, Clock, Users } from 'lucide-react';

interface Props {
  courseClasses: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  externalEventsRef: React.RefObject<HTMLDivElement | null>;
}

export default function TimetableSidebar({ courseClasses, searchTerm, setSearchTerm, externalEventsRef }: Props) {
  const filteredClasses = courseClasses.filter(c => 
    c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.classCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 flex-shrink-0 flex flex-col bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <CalendarDays className="text-brand-500" size={20} />
          Lớp chưa có lịch
        </h2>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Tìm kiếm môn học, mã lớp..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        ref={externalEventsRef}
      >
        {filteredClasses.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10 text-sm">
            Không tìm thấy lớp học nào.
          </div>
        ) : (
          filteredClasses.map((c) => (
            <div
              key={c.id || c.courseClassId}
              className="fc-event cursor-grab active:cursor-grabbing group relative p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-200"
              data-id={c.id || c.courseClassId}
              data-title={`${c.classCode} - ${c.courseName}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  {c.classCode}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {c.credits || 3} TC
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mt-2">
                {c.courseName}
              </h3>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Users size={13} /> {c.currentStudents || 0}/{c.maxStudents || 40} Sinh viên
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
