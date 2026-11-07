import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Search,
  MapPin,
  Bot,
  UserCheck,
  Building2,
  CheckCircle2,
  BarChart3,
  Users,
  ShieldAlert,
  Sparkles,
  FileText,
  Clock,
  Layers,
  LucideIcon,
  Wrench,
  Camera,
  Navigation
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeCount?: number;
  badgeColor?: string;
}

interface SidebarProps {
  currentRole: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  openGrievanceCount?: number;
  criticalGrievanceCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentTab,
  onSelectTab,
  openGrievanceCount = 0,
  criticalGrievanceCount = 0
}) => {
  const citizenNav: NavItem[] = [
    { id: 'citizen_dashboard', label: 'Citizen Dashboard', icon: LayoutDashboard },
    { id: 'citizen_file', label: 'File a Complaint', icon: PlusCircle, badge: 'AI Ingestion' },
    { id: 'citizen_my_complaints', label: 'My Complaints', icon: FolderOpen },
    { id: 'citizen_track', label: 'Track Grievance', icon: Search },
    { id: 'citizen_map', label: 'Civic Issue Map', icon: MapPin },
    { id: 'citizen_assistant', label: 'AI Citizen Guide', icon: Bot },
    { id: 'citizen_profile', label: 'Citizen Profile', icon: UserCheck }
  ];

  const authorityNav: NavItem[] = [
    { id: 'auth_dashboard', label: 'Authority Overview', icon: LayoutDashboard },
    {
      id: 'auth_queue',
      label: 'Official Queue',
      icon: Clock,
      badgeCount: openGrievanceCount,
      badgeColor: 'bg-[#237A57] text-white'
    },
    {
      id: 'auth_investigation',
      label: 'Complaint Investigation',
      icon: ShieldAlert,
      badgeCount: criticalGrievanceCount,
      badgeColor: 'bg-red-500/80 text-white'
    },
    { id: 'auth_departments', label: 'Department Workload', icon: Building2 },
    { id: 'auth_resolutions', label: 'Resolution Manager', icon: CheckCircle2 },
    { id: 'auth_map', label: 'Geospatial Intelligence', icon: MapPin },
    { id: 'auth_assistant', label: 'Civic AI Assistant', icon: Sparkles }
  ];

  const adminNav: NavItem[] = [
    { id: 'admin_coordinator', label: 'Work Coordinator', icon: Layers, badge: 'Dispatch & QA' },
    { id: 'admin_overview', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'admin_users', label: 'User Management', icon: Users },
    { id: 'admin_departments', label: 'Department Registry', icon: Building2 },
    { id: 'admin_monitoring', label: 'Complaint Monitoring', icon: FileText },
    { id: 'admin_ai_hub', label: 'AI Intelligence Hub', icon: Sparkles, badge: '11 AI Tools' },
    { id: 'admin_analytics', label: 'Platform Analytics', icon: BarChart3 }
  ];

  const fieldWorkerNav: NavItem[] = [
    { id: 'worker_dashboard', label: 'Field Operations', icon: LayoutDashboard, badge: 'Tasks' },
    { id: 'worker_tasks', label: 'My Work Orders', icon: Wrench },
    { id: 'worker_history', label: 'Completion Evidence', icon: Camera },
    { id: 'worker_map', label: 'GPS Route Map', icon: Navigation }
  ];

  const navItems: NavItem[] = {
    citizen: citizenNav,
    authority: authorityNav,
    admin: adminNav,
    coordinator: adminNav,
    platform_admin: adminNav,
    field_worker: fieldWorkerNav
  }[currentRole] || citizenNav;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#1B5244] bg-[#123D32] min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 text-white">
      <div className="space-y-6">
        {/* Role Badge Indicator */}
        <div className="rounded-2xl border border-[#1B5244] bg-[#0E2E25] p-3.5 shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7C2B4]">
            Active Workspace
          </p>
          <p className="mt-0.5 text-xs font-bold text-white capitalize flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                currentRole === 'admin' || currentRole === 'coordinator' || currentRole === 'platform_admin'
                  ? 'bg-amber-400 shadow-sm shadow-amber-400'
                  : currentRole === 'authority'
                  ? 'bg-[#237A57] shadow-sm shadow-[#237A57]'
                  : currentRole === 'field_worker'
                  ? 'bg-blue-400 shadow-sm shadow-blue-400'
                  : 'bg-[#A3E0C8] shadow-sm shadow-[#A3E0C8]'
              }`}
            />
            {currentRole === 'citizen' && 'Citizen Operations'}
            {currentRole === 'authority' && 'Municipal Authority'}
            {currentRole === 'coordinator' && 'Work Coordinator (Dispatch)'}
            {currentRole === 'platform_admin' && 'Platform Admin (Governance)'}
            {currentRole === 'admin' && 'Central Operations'}
            {currentRole === 'field_worker' && 'Field Specialist'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#237A57] text-white shadow-md shadow-[#0E2E25] font-bold border-l-4 border-[#A3E0C8]'
                    : 'text-[#E7F2EC]/85 hover:bg-[#1B5244]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-[#A7C2B4] group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#1B5244] text-[#E7F2EC] border border-[#237A57]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-[#1B5244] text-[#E7F2EC]'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Card */}
      <div className="rounded-2xl border border-[#1B5244] bg-[#0E2E25] p-3.5 text-[11px] text-[#A7C2B4] shadow-md">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Layers className="h-3.5 w-3.5 text-[#237A57]" />
          <span>Greater Hyderabad Zone</span>
        </div>
        <p className="mt-1 leading-snug text-[#A7C2B4]">
          GHMC & HMWSSB Telemetry Grid • 142 Wards active on CivicSense AI.
        </p>
      </div>
    </aside>
  );
};
