import React, { useState } from 'react';
import { User, Complaint } from '../../types';
import { StorageService } from '../../services/storageService';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CitizenProfileProps {
  currentUser: User;
  complaints: Complaint[];
}

export const CitizenProfile: React.FC<CitizenProfileProps> = ({ currentUser, complaints }) => {
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address || '');
  const [ward, setWard] = useState(currentUser.ward || 'Ward 105 - Kondapur');
  const [isSaved, setIsSaved] = useState(false);

  const userComplaints = complaints.filter(
    (c) => c.citizenId === currentUser.id || c.citizenName === currentUser.name
  );
  const verifiedCount = userComplaints.filter((c) => c.status === 'verified').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...currentUser, phone, address, ward };
    StorageService.setCurrentUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-[#263A32] font-sans">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#123D32]">Citizen Profile</h1>
        <p className="text-xs text-[#687A70]">
          Manage your contact credentials and municipal ward registration
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl border border-[#DFE8E1] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="h-20 w-20 rounded-full object-cover border-4 border-[#E7F2EC] shadow-sm"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-[#123D32]">{currentUser.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Citizen
              </span>
            </div>
            <p className="text-xs text-[#687A70]">{currentUser.email}</p>
            <p className="text-xs text-[#237A57] font-medium">{ward}</p>
          </div>

          <div className="rounded-xl bg-[#F4F7F5] p-3 text-center border border-[#DFE8E1] min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-[#687A70]">Citizen Score</span>
            <p className="text-xl font-extrabold text-[#237A57]">98 / 100</p>
            <span className="text-[10px] text-[#123D32] font-semibold">Tier 1 Contributor</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#DFE8E1] pt-4 text-center">
          <div>
            <p className="text-lg font-bold text-[#123D32]">{userComplaints.length}</p>
            <p className="text-[11px] text-[#687A70]">Grievances Filed</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[#237A57]">{verifiedCount}</p>
            <p className="text-[11px] text-[#687A70]">Resolutions Verified</p>
          </div>
          <div>
            <p className="text-lg font-bold text-amber-600">100%</p>
            <p className="text-[11px] text-[#687A70]">AI Trust Authenticity</p>
          </div>
        </div>
      </div>

      {/* Edit Contact Information */}
      <form onSubmit={handleSave} className="rounded-xl border border-[#DFE8E1] bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#123D32] border-b border-[#DFE8E1] pb-2">
          Contact & Ward Registration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#263A32]">Registered Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#263A32]">Residential Ward Jurisdiction</label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="Ward 104 - Madhapur">Ward 104 - Madhapur</option>
              <option value="Ward 105 - Kondapur">Ward 105 - Kondapur</option>
              <option value="Ward 106 - Gachibowli">Ward 106 - Gachibowli</option>
              <option value="Ward 108 - Miyapur">Ward 108 - Miyapur</option>
              <option value="Ward 118 - Kukatpally">Ward 118 - Kukatpally</option>
              <option value="Ward 92 - Banjara Hills">Ward 92 - Banjara Hills</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#263A32]">Permanent Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs font-semibold text-[#237A57] flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Profile credentials updated successfully.
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="rounded-lg bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-bold text-white shadow-xs"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
