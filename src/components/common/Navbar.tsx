import React, { useState } from 'react';
import {
  GraduationCap,
  User as UserIcon,
  FlaskConical,
  Shield,
  ChevronDown,
  RotateCcw,
  BookOpen,
  Award,
  FileText,
  Target,
  Info,
  Menu,
  X,
  History,
} from 'lucide-react';
import { User, Role } from '../../types/index.ts';
import { DEMO_USERS, storage } from '../../services/storage.ts';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  activeTab,
  onTabChange,
  onResetData,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Quản trị viên',
          icon: Shield,
          className: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'researcher':
        return {
          label: 'Nhà nghiên cứu / Giảng viên',
          icon: FlaskConical,
          className: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'student':
      default:
        return {
          label: 'Sinh viên',
          icon: GraduationCap,
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);
  const RoleIcon = roleInfo.icon;

  const handleSelectUser = (user: User) => {
    storage.setCurrentUser(user.id);
    onUserChange(user);
    setShowUserDropdown(false);
    // Switch to appropriate default dashboard
    if (user.role === 'student' && (activeTab === 'researcher' || activeTab === 'admin')) {
      onTabChange('dashboard');
    } else if (user.role === 'researcher' && activeTab !== 'researcher' && activeTab !== 'criteria' && activeTab !== 'batches') {
      onTabChange('researcher');
    } else if (user.role === 'admin' && activeTab !== 'admin' && activeTab !== 'criteria' && activeTab !== 'batches') {
      onTabChange('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('intro')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    SelfLearn
                  </span>
                  <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 hidden sm:block">
                  Đánh giá năng lực tự học trong môi trường AI
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('intro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'intro'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Giới thiệu đề tài
            </button>

            {/* Student Links */}
            {currentUser.role === 'student' && (
              <>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Tổng quan cá nhân
                </button>
                <button
                  onClick={() => onTabChange('assessment')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    activeTab === 'assessment'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Tự đánh giá
                </button>
                <button
                  onClick={() => onTabChange('evidence')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    activeTab === 'evidence'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Minh chứng
                </button>
                <button
                  onClick={() => onTabChange('plans')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    activeTab === 'plans'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  Kế hoạch cải thiện
                </button>
                <button
                  onClick={() => onTabChange('history')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    activeTab === 'history'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Lịch sử
                </button>
              </>
            )}

            {/* Researcher Links */}
            {(currentUser.role === 'researcher' || currentUser.role === 'admin') && (
              <>
                <button
                  onClick={() => onTabChange('researcher')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    activeTab === 'researcher'
                      ? 'bg-purple-100 text-purple-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  Dữ liệu nghiên cứu
                </button>
                <button
                  onClick={() => onTabChange('criteria')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    activeTab === 'criteria'
                      ? 'bg-purple-100 text-purple-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Bộ tiêu chí (26 câu)
                </button>
              </>
            )}

            {/* Admin Links */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => onTabChange('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  activeTab === 'admin'
                    ? 'bg-rose-100 text-rose-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Quản trị hệ thống
              </button>
            )}

            {/* Guide & Help */}
            <button
              onClick={() => onTabChange('guide')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                activeTab === 'guide'
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Hướng dẫn sử dụng & Đạo đức nghiên cứu"
            >
              <Info className="w-3.5 h-3.5" />
              Hướng dẫn
            </button>
          </nav>

          {/* User Role Switcher & Profile Dropdown */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                data-testid="role-switcher-btn"
                aria-label="Chuyển đổi vai trò người dùng"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-bold text-slate-900 text-xs truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role === 'student' ? 'Sinh viên' : currentUser.role === 'researcher' ? 'Nhà nghiên cứu' : 'Quản trị viên'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Switch Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Chuyển đổi vai trò thử nghiệm
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Chọn tài khoản để kiểm tra phân quyền & giao diện:
                    </p>
                  </div>

                  <div className="py-1">
                    {DEMO_USERS.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          data-testid={`switch-user-${user.id}`}
                          onClick={() => handleSelectUser(user)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-blue-50/70 text-blue-900 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="font-medium text-slate-900">{user.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {user.email} • {user.role === 'student' ? 'SV' : user.role === 'researcher' ? 'Nghiên cứu' : 'Admin'}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onResetData();
                        setShowUserDropdown(false);
                      }}
                      className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1"
                      title="Khôi phục toàn bộ dữ liệu mẫu ban đầu"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Đặt lại dữ liệu demo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1">
            <button
              onClick={() => {
                onTabChange('intro');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Giới thiệu đề tài
            </button>
            {currentUser.role === 'student' && (
              <>
                <button
                  onClick={() => {
                    onTabChange('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Tổng quan sinh viên
                </button>
                <button
                  onClick={() => {
                    onTabChange('assessment');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 font-bold"
                >
                  Làm bài tự đánh giá
                </button>
                <button
                  onClick={() => {
                    onTabChange('evidence');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Minh chứng học tập
                </button>
                <button
                  onClick={() => {
                    onTabChange('plans');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Kế hoạch cải thiện
                </button>
                <button
                  onClick={() => {
                    onTabChange('history');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Lịch sử đánh giá
                </button>
              </>
            )}
            {(currentUser.role === 'researcher' || currentUser.role === 'admin') && (
              <>
                <button
                  onClick={() => {
                    onTabChange('researcher');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs font-semibold text-purple-700"
                >
                  Dashboard Nghiên cứu
                </button>
                <button
                  onClick={() => {
                    onTabChange('criteria');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Bộ tiêu chí & Trọng số
                </button>
              </>
            )}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  onTabChange('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-xs font-semibold text-rose-700"
              >
                Quản trị hệ thống
              </button>
            )}
            <button
              onClick={() => {
                onTabChange('guide');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-500"
            >
              Hướng dẫn & Đạo đức
            </button>
          </div>
        )}
      </div>

      {/* Demo Data Alert Banner */}
      <div className="bg-amber-50/90 border-b border-amber-200/60 px-4 py-1 text-center text-[11px] text-amber-800 flex items-center justify-center gap-1.5 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
        <span>
          MÔI TRƯỜNG NGHIÊN CỨU THỬ NGHIỆM: Dữ liệu hiện tại là <strong>DỮ LIỆU MINH HỌA</strong> phục vụ kiểm tra tính khả thi và thẩm định bộ tiêu chí.
        </span>
      </div>
    </header>
  );
};
