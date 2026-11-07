import React, { useState } from 'react';
import { UserRole, User, AppNotification } from '../../types';
import { StorageService } from '../../services/storageService';
import { I18nService, AppLanguage } from '../../services/i18nService';
import {
  Shield,
  Bell,
  Globe,
  Bot,
  Mic,
  Menu,
  Check,
  Building2,
  ChevronDown,
  LogOut,
  Home
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  onDepartmentFilterChange?: (deptId: string) => void;
  selectedDepartmentId?: string;
  onOpenVoiceModal: () => void;
  onOpenAIAssistant: () => void;
  onOpenComplaint?: (id: string) => void;
  onToggleSidebar?: () => void;
  onNavigateLanding?: () => void;
  onNavigateAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  onDepartmentFilterChange,
  selectedDepartmentId,
  onOpenVoiceModal,
  onOpenAIAssistant,
  onOpenComplaint,
  onToggleSidebar,
  onNavigateLanding,
  onNavigateAuth
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = StorageService.getNotifications(currentRole);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const departments = StorageService.getDepartments();
  const currentLang = I18nService.getLanguage();

  const handleLangChange = (lang: AppLanguage) => {
    I18nService.setLanguage(lang);
    setShowLangMenu(false);
    window.location.reload();
  };

  const handleNotificationClick = (notif: AppNotification) => {
    StorageService.markNotificationRead(notif.id);
    if (notif.complaintId && onOpenComplaint) {
      onOpenComplaint(notif.complaintId);
      setShowNotifications(false);
    }
  };

  const roleLabels: { role: UserRole; label: string }[] = [
    { role: 'citizen', label: 'Citizen' },
    { role: 'field_worker', label: 'Field Worker' },
    { role: 'coordinator', label: 'Coordinator' },
    { role: 'authority', label: 'Authority' },
    { role: 'platform_admin', label: 'Platform Admin' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#DFE8E1] bg-white text-[#263A32] shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-xl p-2 text-[#687A70] hover:bg-[#F4F7F5] hover:text-[#263A32] lg:hidden transition-colors"
              title="Toggle Navigation Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div
            onClick={onNavigateLanding}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#123D32] to-[#237A57] text-white shadow-md shadow-[#123D32]/20 group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6 text-white font-black" />
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-base font-black tracking-tight text-[#123D32]">
                CivicSense <span className="text-[#237A57]">AI</span>
              </span>
              <p className="hidden text-[10px] font-semibold text-[#687A70] sm:block leading-none">
                Your City. Your Voice. Our Intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Role Switcher Tabs */}
        <div className="hidden lg:flex items-center rounded-xl bg-[#E7F2EC] p-1 border border-[#DFE8E1]">
          {roleLabels.map((tab) => {
            const isTabActive =
              currentRole === tab.role ||
              (currentRole === 'admin' && tab.role === 'coordinator');
            return (
              <button
                key={tab.role}
                onClick={() => onRoleChange(tab.role)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isTabActive
                    ? 'bg-[#237A57] text-white shadow-sm font-bold'
                    : 'text-[#263A32] hover:text-[#123D32] hover:bg-[#DAE9E0]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-2">
          {/* Landing Page Button */}
          {onNavigateLanding && (
            <button
              onClick={onNavigateLanding}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#263A32] hover:bg-[#F4F7F5] transition-colors"
              title="Return to Public Landing Page"
            >
              <Home className="h-3.5 w-3.5 text-[#237A57]" />
              <span className="hidden xl:inline">Landing Page</span>
            </button>
          )}

          {/* Department Filter for Authority */}
          {currentRole === 'authority' && onDepartmentFilterChange && (
            <div className="hidden xl:flex items-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-white px-2 py-1 text-xs">
              <Building2 className="h-3.5 w-3.5 text-[#237A57]" />
              <select
                value={selectedDepartmentId || 'all'}
                onChange={(e) => onDepartmentFilterChange(e.target.value)}
                className="bg-transparent font-medium text-[#263A32] focus:outline-none"
              >
                <option value="all" className="bg-white text-[#263A32]">
                  All Departments
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-white text-[#263A32]">
                    {d.shortCode}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Voice Input Button */}
          <button
            onClick={onOpenVoiceModal}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#263A32] hover:border-[#237A57] hover:text-[#237A57] transition-colors"
            title="Speech to Text in English, Hindi, Telugu"
          >
            <Mic className="h-4 w-4 text-[#237A57]" />
            <span className="hidden lg:inline">Voice Input</span>
          </button>

          {/* AI Civic Assistant Button */}
          <button
            onClick={onOpenAIAssistant}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7F2EC] border border-[#237A57]/30 px-3 py-1.5 text-xs font-bold text-[#123D32] hover:bg-[#237A57] hover:text-white transition-all shadow-xs"
          >
            <Bot className="h-4 w-4 text-[#237A57] group-hover:text-white" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 rounded-xl border border-[#DFE8E1] bg-white p-2 text-xs font-medium text-[#263A32] hover:bg-[#F4F7F5] transition-colors"
              title="Select Language"
            >
              <Globe className="h-4 w-4 text-[#237A57]" />
              <span className="hidden uppercase font-semibold sm:inline">{currentLang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[#DFE8E1] bg-white p-1.5 shadow-xl z-50">
                <p className="px-2 py-1 text-[10px] font-bold text-[#687A70] uppercase tracking-wider">
                  Language / భాష / भाषा
                </p>
                {[
                  { code: 'en' as AppLanguage, name: 'English' },
                  { code: 'hi' as AppLanguage, name: 'हिन्दी (Hindi)' },
                  { code: 'te' as AppLanguage, name: 'తెలుగు (Telugu)' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLangChange(item.code)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-[#263A32] hover:bg-[#E7F2EC] transition-colors"
                  >
                    <span>{item.name}</span>
                    {currentLang === item.code && <Check className="h-3.5 w-3.5 text-[#237A57]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl border border-[#DFE8E1] bg-white p-2 text-[#263A32] hover:bg-[#F4F7F5] transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4 text-[#237A57]" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-extrabold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#DFE8E1] bg-white shadow-2xl overflow-hidden z-50">
                <div className="flex items-center justify-between border-b border-[#DFE8E1] bg-[#E7F2EC] px-4 py-2.5">
                  <span className="text-xs font-bold text-[#123D32]">
                    Live Alerts & Notifications ({notifications.length})
                  </span>
                  <button
                    onClick={() => StorageService.markAllNotificationsRead()}
                    className="text-[11px] font-semibold text-[#237A57] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#DFE8E1]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#687A70]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3 text-xs transition-colors cursor-pointer hover:bg-[#F4F7F5] ${
                          !n.read ? 'bg-[#E7F2EC]/60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-bold text-[#263A32]">{n.title}</p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[#687A70] text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                        <p className="mt-1 text-[10px] text-[#A7C2B4]">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl border border-[#DFE8E1] bg-white p-1.5 hover:bg-[#F4F7F5] transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-7 w-7 rounded-full object-cover border border-[#237A57]"
              />
              <div className="hidden xl:block text-left text-xs">
                <p className="font-bold text-[#263A32] leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#237A57] font-semibold capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown className="h-3 w-3 text-[#687A70]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#DFE8E1] bg-white p-3 shadow-2xl z-50">
                <div className="border-b border-[#DFE8E1] pb-2 mb-2">
                  <p className="text-xs font-bold text-[#263A32]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#687A70]">{currentUser.email}</p>
                  <span className="mt-1 inline-block rounded bg-[#E7F2EC] px-2 py-0.5 text-[10px] font-bold text-[#123D32] border border-[#237A57]/30 uppercase">
                    Role: {currentUser.role.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-[10px] font-bold uppercase text-[#687A70] px-1">
                    Switch Workspace Role:
                  </p>
                  {roleLabels.map((r) => {
                    const isActive =
                      currentRole === r.role ||
                      (currentRole === 'admin' && r.role === 'coordinator');
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          onRoleChange(r.role);
                          setShowProfileMenu(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 capitalize ${
                          isActive
                            ? 'bg-[#E7F2EC] text-[#123D32] font-bold'
                            : 'text-[#687A70] hover:bg-[#F4F7F5] hover:text-[#263A32]'
                        }`}
                      >
                        <span>{r.label}</span>
                        {isActive && <Check className="h-3.5 w-3.5 text-[#237A57]" />}
                      </button>
                    );
                  })}

                  <div className="border-t border-[#DFE8E1] pt-2 mt-2">
                    {onNavigateAuth && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onNavigateAuth();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out / Switch Account</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Role Switcher Strip */}
      <div className="flex lg:hidden items-center justify-around border-t border-[#DFE8E1] bg-[#E7F2EC] px-2 py-1.5 text-xs">
        {roleLabels.map((r) => (
          <button
            key={r.role}
            onClick={() => onRoleChange(r.role)}
            className={`rounded-md px-2.5 py-1 font-semibold text-[11px] capitalize ${
              currentRole === r.role
                ? 'bg-[#237A57] text-white font-bold'
                : 'text-[#263A32] hover:text-[#123D32]'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </header>
  );
};
