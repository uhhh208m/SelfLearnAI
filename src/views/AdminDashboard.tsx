import React, { useState } from 'react';
import {
  Shield,
  Users,
  FileText,
  RotateCcw,
  Download,
  Trash2,
  Lock,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Database,
  History,
  Key,
} from 'lucide-react';
import { User, AuditLog, Role } from '../types/index.ts';
import { storage, DEMO_USERS } from '../services/storage.ts';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  auditLogs: AuditLog[];
  onUsersUpdated: () => void;
  onResetAllData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  auditLogs,
  onUsersUpdated,
  onResetAllData,
}) => {
  const [selectedUserToErase, setSelectedUserToErase] = useState<string>('');
  const [erasureSuccessMsg, setErasureSuccessMsg] = useState('');

  const handleRoleChange = (userId: string, newRole: Role) => {
    storage.updateUserProfile(userId, { role: newRole });
    storage.logAction(
      currentUser.id,
      currentUser.name,
      'admin',
      'CHANGE_ROLE',
      'user',
      userId,
      `Thay đổi vai trò người dùng thành: ${newRole}`
    );
    onUsersUpdated();
  };

  const handleWithdrawAndErase = () => {
    if (!selectedUserToErase) {
      alert('Vui lòng chọn người dùng cần rút dữ liệu');
      return;
    }
    const target = users.find((u) => u.id === selectedUserToErase);
    if (!target) return;

    if (
      window.confirm(
        `XÁC NHẬN BẢO MẬT: Xóa toàn bộ dữ liệu khảo sát, lịch sử đánh giá và minh chứng của ${target.name} (${target.email}) theo chính sách bảo vệ quyền riêng tư người học?`
      )
    ) {
      storage.withdrawAndEraseUserData(target.id);
      setErasureSuccessMsg(`Đã xóa hoàn toàn dữ liệu của ${target.name} theo yêu cầu rút lui.`);
      setTimeout(() => setErasureSuccessMsg(''), 4000);
      onUsersUpdated();
      setSelectedUserToErase('');
    }
  };

  const handleExportSystemBackup = () => {
    const backupData = {
      users: storage.getUsers(),
      domains: storage.getDomains(),
      criteria: storage.getCriteria(),
      sessions: storage.getSessions(),
      evidence: storage.getEvidence(),
      plans: storage.getPlans(),
      studyBatches: storage.getStudyBatches(),
      auditLogs: storage.getAuditLogs(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SelfLearn_AI_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Trung tâm Quản trị Hệ thống
            </span>
            <span className="text-xs text-slate-400">Quyền hạn tối cao (Super Admin)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản trị Người dùng, Quyền riêng tư & Nhật ký Thao tác
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Kiểm soát tài khoản, thực thi chính sách bảo vệ quyền dữ liệu của người học và giám sát an toàn thông tin toàn hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportSystemBackup}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Sao lưu JSON</span>
          </button>
          <button
            onClick={onResetAllData}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 border border-rose-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt lại toàn bộ dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Danh sách Tài khoản & Phân quyền ({users.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Nguyên tắc tối thiểu quyền hạn (Least Privilege)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5">Họ tên & Email</th>
                <th className="py-2.5">Mã định danh</th>
                <th className="py-2.5">Đơn vị / Trường</th>
                <th className="py-2.5 text-center">Vai trò hệ thống</th>
                <th className="py-2.5 text-right">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="py-3">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3 font-mono text-slate-600">
                    {u.studentCode || 'N/A'}
                  </td>
                  <td className="py-3 text-slate-600">
                    {u.university || 'Cơ sở giáo dục đại học'}
                  </td>
                  <td className="py-3 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      <option value="student">Sinh viên</option>
                      <option value="researcher">Nhà nghiên cứu / Giảng viên</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </td>
                  <td className="py-3 text-right text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right to Erasure / GDPR Policy Tool (Required by Section II.A, IX) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Thực thi Quyền Rút lui khỏi Nghiên cứu & Xóa Dữ liệu (Right to Erasure)
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Theo quy chuẩn đạo đức nghiên cứu, bất kỳ sinh viên nào gửi yêu cầu rút lui sẽ được xóa sạch toàn bộ các phiên tự đánh giá, điểm số, nhật ký câu lệnh AI và minh chứng học tập liên quan khỏi cơ sở dữ liệu.
        </p>

        {erasureSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{erasureSuccessMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <select
            value={selectedUserToErase}
            onChange={(e) => setSelectedUserToErase(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium min-w-[260px]"
          >
            <option value="">-- Chọn tài khoản sinh viên yêu cầu xóa --</option>
            {users
              .filter((u) => u.role === 'student')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.studentCode || u.email})
                </option>
              ))}
          </select>

          <button
            onClick={handleWithdrawAndErase}
            disabled={!selectedUserToErase}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              selectedUserToErase
                ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Thực hiện xóa toàn bộ dữ liệu cá nhân</span>
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <span>Nhật ký Thao tác Hệ thống (Audit Logs) ({auditLogs.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Không thể chỉnh sửa hoặc xóa log</span>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Người thực hiện</th>
                <th className="py-2.5 px-3">Hành động</th>
                <th className="py-2.5 px-3">Loại đối tượng</th>
                <th className="py-2.5 px-3">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800">{log.actorName}</span>{' '}
                    <span className="text-[10px] text-slate-400 capitalize">
                      ({log.actorRole})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 capitalize">
                    {log.entityType}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
