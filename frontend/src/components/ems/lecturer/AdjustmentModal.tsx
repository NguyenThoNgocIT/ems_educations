import React, { useEffect, useMemo, useState } from 'react';
import { scheduleAdjustmentApi } from '@/api/schedule-adjustment';
import { roomApi } from '@/api/room';
import { scheduleApi } from '@/api/schedule';
import { timeSlotApi } from '@/api/timeSlot';
import { useAuth } from '@/context/AuthContext';
import { fixMojibakeText } from '@/utils/text';
import { AlertTriangle, CalendarRange, CheckCircle2, Lightbulb, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface AdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any;
  onSuccess: () => void;
}

const REQUEST_TYPES = [
  { value: 'ABSENT_MAKEUP', label: 'Nghỉ và dạy bù' },
  { value: 'RESCHEDULE', label: 'Đổi lịch' },
  { value: 'ROOM_CHANGE', label: 'Đổi phòng' },
  { value: 'EXTRA_SESSION', label: 'Tăng tiết / học thêm' },
] as const;

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  return [];
};

const getTimeSlotId = (timeSlot: any) => timeSlot.timeSlotId || timeSlot.id || '';
const getRoomId = (room: any) => room.roomId || room.id || '';

const formatDate = (date?: string) => {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}/${month}/${year}` : date;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString().split('T')[0];
};

export default function AdjustmentModal({ isOpen, onClose, eventData, onSuccess }: AdjustmentModalProps) {
  const { user } = useAuth();
  const [courseClassId, setCourseClassId] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [requestType, setRequestType] = useState<(typeof REQUEST_TYPES)[number]['value']>('ABSENT_MAKEUP');
  const [absentDate, setAbsentDate] = useState('');
  const [absentTimeSlotId, setAbsentTimeSlotId] = useState('');
  const [absentPeriods, setAbsentPeriods] = useState(3);
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTimeSlotId, setProposedTimeSlotId] = useState('');
  const [proposedRoomId, setProposedRoomId] = useState('');
  const [proposedPeriods, setProposedPeriods] = useState(3);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any[]>([]);

  const activeCourseClassId = eventData ? eventData.courseClassId : courseClassId;
  const activeOriginalScheduleId = eventData
    ? eventData.originalScheduleId || eventData.scheduleId || eventData.id
    : selectedScheduleId || undefined;
  const requiresOriginalSession = requestType !== 'EXTRA_SESSION';

  const selectedRoom = useMemo(
    () => rooms.find((room) => getRoomId(room) === proposedRoomId),
    [proposedRoomId, rooms],
  );

  useEffect(() => {
    if (!isOpen) return;

    Promise.all([
      timeSlotApi.getAll(),
      roomApi.getAll(),
      scheduleApi.getTeachingProgress(user?.id ? { instructorId: user.id } : undefined),
    ]).then(([slotRes, roomRes, classRes]) => {
      setTimeSlots(toArray(slotRes));
      setRooms(toArray(roomRes));
      setMyClasses(toArray(classRes));
    }).catch(() => {
      toast.error('Không thể tải dữ liệu lớp, ca học hoặc phòng học');
    });

    setCourseClassId(eventData?.courseClassId || '');
    setSelectedScheduleId(eventData?.originalScheduleId || eventData?.scheduleId || eventData?.id || '');
    setRequestType(eventData?.requestType || 'ABSENT_MAKEUP');
    setAbsentDate(eventData?.date || '');
    setAbsentTimeSlotId(eventData?.timeSlotId || '');
    setAbsentPeriods(eventData?.periods || 3);
    setProposedDate(eventData?.proposedDate || '');
    setProposedTimeSlotId(eventData?.proposedTimeSlotId || '');
    setProposedRoomId(eventData?.proposedRoomId || '');
    setProposedPeriods(eventData?.periods || 3);
    setReason('');
    setSuggestions([]);
    setValidationResults([]);
  }, [eventData, isOpen, user?.id]);

  useEffect(() => {
    if (!courseClassId || eventData) {
      setSchedules([]);
      return;
    }

    scheduleApi.getByCourseClass(courseClassId)
      .then((res) => setSchedules(toArray(res)))
      .catch(() => {
        setSchedules([]);
        toast.error('Không thể tải lịch gốc của lớp học phần');
      });
  }, [courseClassId, eventData]);

  useEffect(() => {
    if (!selectedScheduleId) {
      if (!eventData) {
        setAbsentDate('');
        setAbsentTimeSlotId('');
        setAbsentPeriods(3);
      }
      return;
    }

    const selected = schedules.find((schedule) => schedule.scheduleId === selectedScheduleId);
    if (!selected) return;
    setAbsentDate(selected.date || '');
    setAbsentTimeSlotId(selected.timeSlotId || '');
    setAbsentPeriods(selected.numberOfPeriods || 3);
    setProposedPeriods(selected.numberOfPeriods || 3);
  }, [eventData, schedules, selectedScheduleId]);

  if (!isOpen) return null;

  const buildValidationPayload = () => ({
    courseClassId: activeCourseClassId,
    originalScheduleId: activeOriginalScheduleId,
    requestType,
    absentDate: requestType === 'EXTRA_SESSION' ? undefined : absentDate || undefined,
    absentTimeSlotId: requestType === 'EXTRA_SESSION' ? undefined : absentTimeSlotId || undefined,
    absentPeriods: requestType === 'EXTRA_SESSION' ? undefined : absentPeriods || undefined,
    proposedDate,
    proposedTimeSlotId,
    proposedRoomId,
    proposedPeriods,
  });

  const handleSuggest = async () => {
    if (!activeCourseClassId) {
      toast.error('Vui lòng chọn lớp học phần');
      return;
    }
    if (requiresOriginalSession && !activeOriginalScheduleId && !absentDate) {
      toast.error('Vui lòng chọn buổi học gốc cần điều chỉnh');
      return;
    }

    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const today = new Date();
      const response = await scheduleAdjustmentApi.suggest({
        courseClassId: activeCourseClassId,
        originalScheduleId: activeOriginalScheduleId,
        requestType,
        absentDate: requestType === 'EXTRA_SESSION' ? undefined : absentDate || undefined,
        absentTimeSlotId: requestType === 'EXTRA_SESSION' ? undefined : absentTimeSlotId || undefined,
        absentPeriods: requestType === 'EXTRA_SESSION' ? undefined : absentPeriods || undefined,
        proposedPeriods,
        fromDate: addDays(today, 1),
        toDate: addDays(today, 45),
        preferredTimeSlotIds: proposedTimeSlotId ? [proposedTimeSlotId] : undefined,
        preferredRoomId: proposedRoomId || undefined,
        preferSameRoom: true,
        maxSuggestions: 8,
      });
      const data = response.data?.data || response.data;
      const items = Array.isArray(data?.suggestions) ? data.suggestions : [];
      setSuggestions(items);
      if (items.length === 0) {
        toast.warning('Chưa tìm được lịch trống phù hợp trong khoảng thời gian gợi ý');
      } else {
        toast.success(`Tìm thấy ${items.length} phương án phù hợp`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể lấy gợi ý lịch trống');
    } finally {
      setIsSuggesting(false);
    }
  };

  const applySuggestion = (suggestion: any) => {
    setProposedDate(suggestion.date || '');
    setProposedTimeSlotId(suggestion.timeSlotId || '');
    setProposedRoomId(suggestion.roomId || '');
    setProposedPeriods(suggestion.proposedPeriods || proposedPeriods);
    setValidationResults(suggestion.checks || []);
    toast.success('Đã chọn phương án gợi ý');
  };

  const handleValidate = async () => {
    if (!activeCourseClassId) {
      toast.error('Vui lòng chọn lớp học phần');
      return false;
    }
    if (requiresOriginalSession && !activeOriginalScheduleId && !absentDate) {
      toast.error('Vui lòng chọn buổi học gốc cần điều chỉnh');
      return false;
    }
    if (!proposedDate || !proposedTimeSlotId || !proposedRoomId) {
      toast.error('Vui lòng chọn ngày, ca và phòng dự kiến');
      return false;
    }

    setIsValidating(true);
    try {
      const response = await scheduleAdjustmentApi.validate(buildValidationPayload());
      const data = response.data?.data || response.data;
      setValidationResults(Array.isArray(data?.results) ? data.results : []);
      if (data?.valid) {
        toast.success('Lịch hợp lệ, có thể gửi yêu cầu');
        return true;
      }
      const errors = data?.results
        ?.filter((result: any) => result.status === 'ERROR')
        .map((result: any) => result.message)
        .filter(Boolean);
      toast.error(errors?.length ? errors.join(', ') : 'Lịch chưa hợp lệ, vui lòng kiểm tra lại');
      return false;
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
        ...buildValidationPayload(),
        reason: reason.trim(),
      });
      toast.success('Bạn đã gửi yêu cầu thành công cho Admin!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể gửi yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-400">
            <CalendarRange className="h-5 w-5" />
            <h2>Yêu cầu điều chỉnh lịch</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[72vh] space-y-5 overflow-y-auto p-5">
          {eventData ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Lớp học phần đang chọn</p>
              <p className="mt-1 font-semibold">{fixMojibakeText(eventData.courseClassName || eventData.courseClassCode || 'Lớp học phần')}</p>
              <p className="mt-1 text-sm">
                Lịch gốc: <span className="font-medium text-amber-600">{formatDate(eventData.date)}</span>
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Lớp học phần</label>
                <select
                  value={courseClassId}
                  onChange={(event) => setCourseClassId(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">Chọn lớp học phần</option>
                  {myClasses.map((item: any) => (
                    <option key={item.courseClassId} value={item.courseClassId}>
                      {fixMojibakeText(`${item.courseClassCode || ''} - ${item.courseName || ''}`)}
                    </option>
                  ))}
                </select>
              </div>

              {requiresOriginalSession && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Buổi học gốc</label>
                  <select
                    value={selectedScheduleId}
                    onChange={(event) => setSelectedScheduleId(event.target.value)}
                    disabled={!courseClassId}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">Chọn buổi cần điều chỉnh</option>
                    {schedules.map((schedule: any) => (
                      <option key={schedule.scheduleId} value={schedule.scheduleId}>
                        {formatDate(schedule.date)} · {schedule.slotCode || 'Ca học'} · {schedule.roomCode || 'Chưa phòng'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Loại yêu cầu</label>
              <select
                value={requestType}
                onChange={(event) => {
                  setRequestType(event.target.value as any);
                  setSuggestions([]);
                  setValidationResults([]);
                }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                {REQUEST_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Số tiết dự kiến</label>
              <input
                type="number"
                min={1}
                max={12}
                value={proposedPeriods}
                onChange={(event) => setProposedPeriods(Number(event.target.value))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/40 p-4 dark:bg-emerald-950/20">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Lịch dự kiến thay thế / bổ sung</p>
              <button
                type="button"
                onClick={handleSuggest}
                disabled={isSuggesting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
              >
                {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                Gợi ý lịch trống
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Ngày mới</label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(event) => setProposedDate(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Ca học</label>
                <select
                  value={proposedTimeSlotId}
                  onChange={(event) => setProposedTimeSlotId(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">Chọn ca</option>
                  {timeSlots.map((slot) => (
                    <option key={getTimeSlotId(slot)} value={getTimeSlotId(slot)}>
                      {slot.slotCode} · {slot.startTime?.slice(0, 5)}-{slot.endTime?.slice(0, 5)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Phòng</label>
                <select
                  value={proposedRoomId}
                  onChange={(event) => setProposedRoomId(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map((room) => (
                    <option key={getRoomId(room)} value={getRoomId(room)}>
                      {fixMojibakeText(room.roomCode || room.code || room.name || 'Phòng học')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedRoom && (
              <p className="mt-2 text-xs text-slate-500">
                Phòng đã chọn: {fixMojibakeText(selectedRoom.roomName || selectedRoom.name || selectedRoom.roomCode || selectedRoom.code)}
                {selectedRoom.capacity ? ` · Sức chứa ${selectedRoom.capacity}` : ''}
              </p>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Phương án hệ thống gợi ý</p>
              <div className="grid gap-2 md:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.date}-${suggestion.timeSlotId}-${suggestion.roomId}`}
                    type="button"
                    onClick={() => applySuggestion(suggestion)}
                    className="rounded-xl border border-slate-200 p-3 text-left text-sm transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-950/20"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{suggestion.dayLabel || formatDate(suggestion.date)}</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Điểm {suggestion.score ?? 0}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      {suggestion.timeSlotLabel || suggestion.slotCode} · {suggestion.roomCode} · {suggestion.proposedPeriods} tiết
                    </p>
                    {(suggestion.warnings || []).length > 0 && (
                      <p className="mt-2 text-xs text-amber-600">{suggestion.warnings.join(', ')}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {validationResults.length > 0 && (
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <p className="mb-2 text-sm font-semibold">Kết quả kiểm tra tự động</p>
              <div className="space-y-2">
                {validationResults.map((result, index) => {
                  const isError = result.status === 'ERROR';
                  const isWarn = result.status === 'WARN';
                  return (
                    <div
                      key={`${result.rule || 'rule'}-${index}`}
                      className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                        isError
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-300'
                          : isWarn
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300'
                      }`}
                    >
                      {isError || isWarn ? <AlertTriangle className="mt-0.5 h-4 w-4" /> : <CheckCircle2 className="mt-0.5 h-4 w-4" />}
                      <span>{fixMojibakeText(result.message || result.rule || 'Đã kiểm tra')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Lý do</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Nhập lý do xin nghỉ, dạy bù, đổi lịch hoặc tăng tiết..."
              className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            Hủy
          </button>
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-300 disabled:opacity-70 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Kiểm tra
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}
