import React from 'react';
import { 
  X, 
  CheckCircle2, 
  CalendarClock, 
  MapPin, 
  Clock, 
  UserCheck, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SessionActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any;
  onAdjust: () => void;
}

export default function SessionActionModal({ isOpen, onClose, eventData, onAdjust }: SessionActionModalProps) {
  const router = useRouter();

  if (!isOpen || !eventData) return null;

  const handleGoToAttendance = () => {
    router.push(`/dashboard/lecturer/attendance?classId=${eventData.courseClassId}&date=${eventData.date}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chi tiết buổi dạy</h2>
              <p className="text-sm text-slate-500 font-medium">{eventData.courseClassCode}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
              {eventData.courseClassName || 'Tên môn học'}
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CalendarClock size={16} className="text-emerald-500" />
                <span className="font-medium">Ngày: {eventData.date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Clock size={16} className="text-emerald-500" />
                <span className="font-medium">Ca dạy: {eventData.timeSlotLabel || 'Chưa xác định'} ({eventData.periods || 3} tiết)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <MapPin size={16} className="text-emerald-500" />
                <span className="font-medium">Phòng: {eventData.roomCode || 'Chưa xếp'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button 
              onClick={handleGoToAttendance}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl text-base font-bold shadow-lg shadow-emerald-500/20"
            >
              <UserCheck size={20} />
              Xác nhận & Điểm danh
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={onAdjust}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold border-slate-200 dark:border-slate-700"
              >
                <AlertTriangle size={16} className="text-amber-500" />
                Báo vắng/Đổi lịch
              </Button>
            </div>
          </div>
          
          <p className="text-[11px] text-center text-slate-400 px-4">
            Lưu ý: Giảng viên cần xác nhận đã dạy và cập nhật nội dung bài giảng để hệ thống ghi nhận tiến độ.
          </p>
        </div>
      </div>
    </div>
  );
}
