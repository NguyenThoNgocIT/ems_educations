'use client';

import React, { useEffect, useState } from 'react';
import { scheduleAdjustmentApi } from '@/api/schedule-adjustment';
import { toast } from 'sonner';
import { FileText, Loader2, Check, X, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminScheduleAdjustmentsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT' | 'RETURN'>('APPROVE');
  const [adminNote, setAdminNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : undefined;
      const res = await scheduleAdjustmentApi.searchAdmin(params);
      setRequests(res.data?.data || res.data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReview = (req: any, action: 'APPROVE' | 'REJECT' | 'RETURN') => {
    setSelectedRequest(req);
    setReviewAction(action);
    setAdminNote('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!adminNote.trim()) {
      toast.error('Vui lòng nhập ghi chú');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (reviewAction === 'APPROVE') {
        await scheduleAdjustmentApi.approve(selectedRequest.requestId, { adminNote });
        toast.success('Đã duyệt đơn thành công');
      } else if (reviewAction === 'REJECT') {
        await scheduleAdjustmentApi.reject(selectedRequest.requestId, { adminNote });
        toast.success('Đã từ chối đơn');
      } else if (reviewAction === 'RETURN') {
        await scheduleAdjustmentApi.returnToInstructor(selectedRequest.requestId, { adminNote });
        toast.success('Đã trả đơn về cho Giảng viên');
      }
      setReviewModalOpen(false);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xử lý đơn');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Chờ duyệt</Badge>;
      case 'APPROVED': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Đã duyệt</Badge>;
      case 'REJECTED': return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">Từ chối</Badge>;
      case 'RETURNED': return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Yêu cầu sửa</Badge>;
      case 'CONFLICT_DETECTED': return <Badge className="bg-red-500/10 text-red-600 border-red-200">Có xung đột</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ABSENT_MAKEUP': return 'Nghỉ và Dạy bù';
      case 'EXTRA_SESSION': return 'Tăng tiết';
      case 'RESCHEDULE': return 'Đổi lịch';
      case 'ROOM_CHANGE': return 'Đổi phòng';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Xét duyệt Điều chỉnh lịch</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các yêu cầu đổi lịch, báo bù từ Giảng viên.</p>
        </div>
        
        <select 
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
          <option value="RETURNED">Yêu cầu sửa</option>
          <option value="CONFLICT_DETECTED">Có xung đột</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Giảng viên / Lớp</th>
                <th className="px-6 py-4">Loại yêu cầu</th>
                <th className="px-6 py-4">Chi tiết đề xuất</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <FileText className="w-8 h-8 opacity-20 mx-auto mb-2" />
                    Không tìm thấy yêu cầu nào
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.requestId} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">ID Lớp: {req.courseClassId}</div>
                      <div className="text-xs text-slate-500 mt-1">GV ID: {req.requestedByInstructorId}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{getTypeLabel(req.requestType)}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      <div><strong className="text-amber-600">Nghỉ:</strong> {req.absentDate || '-'} | Ca: {req.absentTimeSlotId || '-'}</div>
                      <div className="mt-1"><strong className="text-emerald-600">Bù:</strong> {req.proposedDate || '-'} | Ca: {req.proposedTimeSlotId || '-'}</div>
                      <div className="mt-1 italic truncate max-w-[200px]" title={req.reason}>Lý do: {req.reason}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {req.status === 'PENDING' || req.status === 'CONFLICT_DETECTED' ? (
                        <>
                          <button onClick={() => handleOpenReview(req, 'APPROVE')} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors" title="Duyệt">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenReview(req, 'RETURN')} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Trả về bổ sung">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenReview(req, 'REJECT')} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors" title="Từ chối">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                         <span className="text-xs text-slate-400">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-lg font-bold">
              {reviewAction === 'APPROVE' ? 'Duyệt yêu cầu' : reviewAction === 'REJECT' ? 'Từ chối yêu cầu' : 'Yêu cầu sửa đổi'}
            </h3>
            <p className="text-sm text-slate-500">
              Bạn đang thao tác với đơn xin <strong>{getTypeLabel(selectedRequest.requestType)}</strong>. Vui lòng nhập ghi chú.
            </p>
            <textarea 
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              placeholder="Ghi chú của admin..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent min-h-[100px]"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className={`px-5 py-2 text-sm font-medium rounded-xl text-white flex items-center gap-2 ${
                  reviewAction === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  reviewAction === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
