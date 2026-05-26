import React, { useState, useEffect } from 'react';
import { scheduleAdjustmentApi, ScheduleAdjustmentSubmitRequest } from '@/api/schedule-adjustment';
import { toast } from 'sonner';
import { X, Loader2, CalendarRange } from 'lucide-react';
import { timeSlotApi } from '@/api/timeSlot';
import { roomApi } from '@/api/room';

interface AdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any; // { id, courseClassId, courseClassName, date, ... }
  onSuccess: () => void;
}

export default function AdjustmentModal({ isOpen, onClose, eventData, onSuccess }: AdjustmentModalProps) {
  const [requestType, setRequestType] = useState<'ABSENT_MAKEUP' | 'EXTRA_SESSION' | 'RESCHEDULE' | 'ROOM_CHANGE'>('ABSENT_MAKEUP');
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTimeSlotId, setProposedTimeSlotId] = useState('');
  const [proposedRoomId, setProposedRoomId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      timeSlotApi.getAll().then(res => setTimeSlots(res.data || []));
      roomApi.getAll().then(res => setRooms(res.data?.data || res.data || []));
      
      setType('ABSENT_MAKEUP');
      setProposedDate('');
      setProposedTimeSlotId('');
      setProposedRoomId('');
      setReason('');
    }
  }, [isOpen]);

  const type = requestType;
  const setType = setRequestType; // alias for backwards compat in rendering
  const newDate = proposedDate;
  const setNewDate = setProposedDate;
  const newTimeSlotId = proposedTimeSlotId;
  const setNewTimeSlotId = setProposedTimeSlotId;
  const newRoomId = proposedRoomId;
  const setNewRoomId = setProposedRoomId;
  
  const needsProposed = requestType !== 'ABSENT_MAKEUP'; // Simplification: we might always need it if they combine it. Let's just say for simplicity we ask for proposed unless they just want to ABSENT. Wait, the docs say ABSENT_MAKEUP "Nghỉ và dạy bù", so it always needs proposed! Let's just always show proposed unless we add a pure ABSENT type later.
  // Wait, let's keep it simple: ALL types need proposedDate/proposedTimeSlotId except maybe we assume ABSENT_MAKEUP needs it.
  const needsProposedForm = true; 

  if (!isOpen || !eventData) return null;

  const handleValidate = async () => {
    if (!proposedDate || !proposedTimeSlotId || !proposedRoomId) {
      toast.error('Vui lòng điền đủ Ngày, Ca, Phòng học mới');
      return false;
    }
    
    setIsValidating(true);
    try {
      const res = await scheduleAdjustmentApi.validate({
        courseClassId: eventData.courseClassId,
        originalScheduleId: eventData.originalScheduleId,
        requestType,
        absentDate: eventData.date,
        absentTimeSlotId: eventData.timeSlotId,
        absentPeriods: eventData.periods,
        proposedDate,
        proposedTimeSlotId,
        proposedRoomId,
        proposedPeriods: eventData.periods
      });
      const data = res.data?.data;
      if (data?.isValid) {
        toast.success('Lịch hợp lệ, bạn có thể gửi yêu cầu!');
        return true;
      } else {
        toast.error('Lịch bị trùng: ' + (data?.conflicts?.join(', ') || 'Kiểm tra lại'));
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi kiểm tra lịch');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do');
      return;
    }

    const isValid = await handleValidate();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await scheduleAdjustmentApi.submit({
        courseClassId: eventData.courseClassId,
        originalScheduleId: eventData.originalScheduleId,
        requestType,
        absentDate: eventData.date,
        absentTimeSlotId: eventData.timeSlotId,
        absentPeriods: eventData.periods,
        proposedDate,
        proposedTimeSlotId,
        proposedRoomId,
        proposedPeriods: eventData.periods,
        reason
      });
      toast.success('Đã gửi yêu cầu thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi gửi yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold">
            <CalendarRange className="w-5 h-5" />
            <h2>Yêu cầu Điều chỉnh Lịch</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Lớp học phần đang chọn:</p>
            <p className="font-semibold">{eventData.courseClassName}</p>
            <p className="text-sm mt-1">Lịch cũ: <span className="font-medium text-amber-600">{eventData.date}</span></p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Loại yêu cầu</label>
            <select 
              value={requestType} 
              onChange={e => setRequestType(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
            >
              <option value="ABSENT_MAKEUP">Nghỉ và dạy bù</option>
              <option value="RESCHEDULE">Đổi lịch</option>
              <option value="ROOM_CHANGE">Đổi phòng</option>
              <option value="EXTRA_SESSION">Tăng tiết / Học thêm</option>
            </select>
          </div>

          {needsProposedForm && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20">
              <div className="col-span-2 text-sm font-semibold text-emerald-600 mb-1">Lịch dự kiến thay thế:</div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium opacity-70">Ngày mới</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium opacity-70">Ca mới</label>
                <select 
                  value={newTimeSlotId} 
                  onChange={e => setNewTimeSlotId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="">-- Chọn ca --</option>
                  {timeSlots.map(s => <option key={s.timeSlotId} value={s.timeSlotId}>{s.slotCode}</option>)}
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-medium opacity-70">Phòng mới</label>
                <select 
                  value={newRoomId} 
                  onChange={e => setNewRoomId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="">-- Chọn phòng --</option>
                  {rooms.map(r => <option key={r.roomId || r.id} value={r.roomId || r.id}>{r.code}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Lý do</label>
            <textarea 
              value={reason} 
              onChange={e => setReason(e.target.value)}
              placeholder="Nhập lý do xin nghỉ/đổi lịch..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent min-h-[80px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Hủy
          </button>
          
          {needsProposedForm && (
            <button 
              onClick={handleValidate}
              disabled={isValidating}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 transition-colors flex items-center gap-2"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Kiểm tra
            </button>
          )}

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Gửi yêu cầu
          </button>
        </div>

      </div>
    </div>
  );
}
