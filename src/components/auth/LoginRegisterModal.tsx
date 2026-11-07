import React, { useState } from 'react';
import { UserRole, User } from '../../types';
import { StorageService } from '../../services/storageService';
import { Shield, User as UserIcon, Building2, Key, Check, X, AlertCircle } from 'lucide-react';

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, role: UserRole) => void;
}

export const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('demo1234');
  const [fullName, setFullName] = useState('Aarav Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [ward, setWard] = useState('Ward 105 - Kondapur');

  const users = StorageService.getUsers();

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'citizen') {
      setEmail('aarav.sharma@example.com');
      setFullName('Aarav Sharma');
    } else if (role === 'authority') {
      setEmail('rameshwar.rao@civicsense.gov.in');
      setFullName('Er. Rameshwar Rao');
    } else {
      setEmail('commissioner@civicsense.gov.in');
      setFullName('Sri S. Balasubrahmanyam, IAS');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let user = users.find((u) => u.role === selectedRole);

    if (isRegistering) {
      user = {
        id: `user-${Date.now()}`,
        name: fullName,
        email,
        phone,
        role: selectedRole,
        ward,
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verifiedStatus: true,
        active: true,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      // save into users
      const allUsers = StorageService.getUsers();
      allUsers.push(user);
      localStorage.setItem('civicsense_users_v1', JSON.stringify(allUsers));
    }

    if (user) {
      StorageService.setCurrentUser(user);
      StorageService.setCurrentRole(selectedRole);
      onLoginSuccess(user, selectedRole);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              CivicSense AI Access Portal
            </h3>
            <p className="text-xs text-slate-500">
              {isRegistering ? 'Create demo account' : 'Simulated Role-Based Authentication'}
            </p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
          {(['citizen', 'authority', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleSelect(r)}
              className={`rounded-lg py-1.5 text-xs font-bold capitalize transition-all ${
                selectedRole === r
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {isRegistering && (
            <div>
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          {isRegistering && selectedRole === 'citizen' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Ward</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-800 border border-amber-200 flex items-start gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Simulated Auth: Instant one-click switch into demo {selectedRole.toUpperCase()} workspace.
              No password verification required for demo.
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            {isRegistering ? 'Register & Enter Portal' : `Login as ${selectedRole.toUpperCase()}`}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            {isRegistering
              ? 'Already registered? Switch to Demo Login'
              : 'Need a new citizen account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};

