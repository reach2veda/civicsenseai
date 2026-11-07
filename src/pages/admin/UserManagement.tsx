import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { StorageService } from '../../services/storageService';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  UserPlus
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onRefreshData: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onRefreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filtered = users.filter((u) => {
    if (selectedRole !== 'all' && u.role !== selectedRole) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.ward && u.ward.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleToggleActive = (userId: string) => {
    StorageService.toggleUserActive(userId);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">User Management</h1>
          <p className="text-xs text-[#687A70]">
            Control citizen access, departmental engineer credentials, and administrator accounts
          </p>
        </div>

        <span className="rounded-lg bg-[#E7F2EC] border border-[#DFE8E1] px-3 py-1.5 text-xs font-bold text-[#123D32]">
          Total Users: {users.length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#687A70]" />
            <input
              type="text"
              placeholder="Search user by name, email, phone or ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] pl-9 pr-3 py-2 text-xs text-[#263A32] placeholder-[#687A70] focus:border-[#237A57] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-3 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="citizen">Citizens</option>
              <option value="authority">Authorities / Engineers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-[#DFE8E1] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#263A32]">
            <thead className="border-b border-[#DFE8E1] bg-[#E7F2EC] text-[11px] font-bold uppercase tracking-wider text-[#123D32]">
              <tr>
                <th className="px-4 py-3">User & Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Ward / Jurisdiction</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE8E1]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#E7F2EC]/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="h-8 w-8 rounded-full object-cover border border-[#DFE8E1]"
                      />
                      <div>
                        <p className="font-bold text-[#263A32]">{u.name}</p>
                        <p className="text-[11px] text-[#687A70]">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                        u.role === 'admin'
                          ? 'bg-[#123D32] text-white'
                          : u.role === 'authority'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-[#E7F2EC] text-[#123D32] border border-[#DFE8E1]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-medium text-[#263A32]">
                    {u.ward || 'Greater Hyderabad Region'}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#237A57]">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        u.active
                          ? 'bg-[#E7F2EC] text-[#123D32] border border-[#DFE8E1]'
                          : 'bg-[#F4F7F5] text-[#687A70] border border-[#DFE8E1]'
                      }`}
                    >
                      {u.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(u.id)}
                      className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        u.active
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-[#237A57] hover:bg-[#E7F2EC]'
                      }`}
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
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

