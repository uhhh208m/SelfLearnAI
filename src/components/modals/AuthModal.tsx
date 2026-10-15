import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  Building,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { storage, DEMO_USERS } from '../../services/storage.ts';
import { User } from '../../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [major, setMajor] = useState('');
  const [university, setUniversity] = useState('Đại học Quốc gia');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Định dạng email không hợp lệ (VD: sv@university.edu.vn)');
      return;
    }

    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (found) {
      storage.setCurrentUser(found.id);
      onLoginSuccess(found);
      onClose();
    } else {
      setErrorMessage(
        'Không tìm thấy tài khoản với email này. Vui lòng chuyển sang tab Đăng ký tài khoản sinh viên mới.'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Định dạng email không hợp lệ');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên');
      return;
    }

    try {
      const newUser = storage.registerStudent({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        studentCode: studentCode.trim() || `SV-${Date.now().toString().slice(-4)}`,
        major: major.trim() || 'Sinh viên Đại học',
        university: university.trim(),
        cohort: 'Khóa 2024 - 2028',
        dataSharingConsent: true,
      });

      onLoginSuccess(newUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isRegisterMode ? 'Đăng Ký Tài Khoản Sinh Viên' : 'Đăng Nhập Khảo Sát Tự Học'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 p-1 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl my-4 text-xs font-semibold">
          <button
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMessage('');
            }}
            className={`py-1.5 rounded-lg transition-all ${
              !isRegisterMode ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMessage('');
            }}
            className={`py-1.5 rounded-lg transition-all ${
              isRegisterMode ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
            }`}
          >
            Đăng ký sinh viên
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isRegisterMode ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ và tên sinh viên *</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn An"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email sinh viên / đại học *</label>
              <input
                type="email"
                required
                placeholder="an.nguyen@student.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã số sinh viên</label>
                <input
                  type="text"
                  placeholder="SV-2026-..."
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngành học</label>
                <input
                  type="text"
                  placeholder="Công nghệ thông tin..."
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Trường đại học</label>
              <input
                type="text"
                placeholder="Đại học Quốc gia / Bách Khoa..."
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              * Mật khẩu được bảo vệ an toàn; không lưu văn bản thuần (plain text).
            </p>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
            >
              Hoàn tất đăng ký & Bắt đầu
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email tài khoản</label>
              <input
                type="email"
                required
                placeholder="an.nguyen@student.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
            >
              Đăng nhập vào hệ thống
            </button>

            {/* Quick Demo Login Preset Buttons */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Hoặc đăng nhập nhanh bằng tài khoản thử nghiệm:
              </span>
              <div className="space-y-1.5">
                {DEMO_USERS.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      storage.setCurrentUser(u.id);
                      onLoginSuccess(u);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700 hover:text-blue-900"
                  >
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">
                      {u.role === 'student' ? 'Sinh viên' : u.role === 'researcher' ? 'Nghiên cứu' : 'Admin'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
