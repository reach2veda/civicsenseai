import React, { useState } from 'react';
import { Department, ComplaintCategory } from '../../types';
import { StorageService } from '../../services/storageService';
import { Building2, Plus, Edit2, Users, Clock, Star, MapPin, Check } from 'lucide-react';

interface DepartmentManagementProps {
  departments: Department[];
  onRefreshData: () => void;
}

export const DepartmentManagement: React.FC<DepartmentManagementProps> = ({
  departments,
  onRefreshData
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('road_potholes');
  const [headName, setHeadName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zonesCovered, setZonesCovered] = useState('');
  const [activeStaffCount, setActiveStaffCount] = useState(45);
  const [color, setColor] = useState('#0D9488');

  const openCreate = () => {
    setName('');
    setShortCode('');
    setCategory('road_potholes');
    setHeadName('');
    setContactEmail('');
    setPhone('');
    setZonesCovered('Cyberabad, Serilingampally');
    setActiveStaffCount(45);
    setColor('#0D9488');
    setEditingDept(null);
    setShowCreateModal(true);
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setShortCode(dept.shortCode);
    setCategory(dept.category);
    setHeadName(dept.headName);
    setContactEmail(dept.contactEmail);
    setPhone(dept.phone);
    setZonesCovered(dept.zonesCovered.join(', '));
    setActiveStaffCount(dept.activeStaffCount);
    setColor(dept.color);
    setShowCreateModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDept: Department = {
      id: editingDept ? editingDept.id : `dept-${Date.now()}`,
      name,
      shortCode,
      category,
      headName,
      contactEmail,
      phone,
      zonesCovered: zonesCovered.split(',').map((z) => z.trim()),
      activeStaffCount: Number(activeStaffCount),
      averageResolutionHours: editingDept ? editingDept.averageResolutionHours : 24,
      satisfactionRating: editingDept ? editingDept.satisfactionRating : 4.5,
      color
    };

    StorageService.saveDepartment(newDept);
    setShowCreateModal(false);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">
            Department & Agency Registry
          </h1>
          <p className="text-xs text-[#687A70]">
            Configure municipal line departments, assign divisional heads, and define ward jurisdictions
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-4 hover:border-[#237A57]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shadow-xs"
                    style={{ backgroundColor: dept.color }}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#263A32]">{dept.name}</h3>
                    <span className="font-mono text-xs font-semibold text-[#687A70]">
                      {dept.shortCode}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openEdit(dept)}
                  className="rounded-lg p-1.5 text-[#687A70] hover:bg-[#F4F7F5] hover:text-[#263A32] transition-colors"
                  title="Edit Department"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-lg bg-[#F4F7F5] p-3 space-y-1 text-xs border border-[#DFE8E1]">
                <p className="font-semibold text-[#263A32]">{dept.headName}</p>
                <p className="text-[#687A70]">{dept.contactEmail}</p>
                <p className="text-[#687A70]">{dept.phone}</p>
              </div>

              <div className="text-xs space-y-1.5">
                <p className="font-semibold text-[#263A32] flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#237A57]" /> Jurisdictions:
                </p>
                <div className="flex flex-wrap gap-1">
                  {dept.zonesCovered.map((z, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-[#E7F2EC] px-2 py-0.5 text-[10px] font-medium text-[#123D32]"
                    >
                      {z}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-[#DFE8E1] pt-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-[#687A70] uppercase">Staff</span>
                <p className="font-bold text-[#263A32]">{dept.activeStaffCount}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#687A70] uppercase">Avg SLA</span>
                <p className="font-bold text-[#263A32]">{dept.averageResolutionHours}h</p>
              </div>
              <div>
                <span className="text-[10px] text-[#687A70] uppercase">Rating</span>
                <p className="font-bold text-amber-600">{dept.satisfactionRating}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D32]/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#DFE8E1]">
            <h3 className="text-base font-bold text-[#263A32] border-b border-[#DFE8E1] pb-3">
              {editingDept ? 'Edit Municipal Department' : 'Register New Municipal Agency'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Roads & Infrastructure"
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Short Code *</label>
                  <input
                    type="text"
                    required
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    placeholder="e.g. GHMC-ROADS"
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#263A32]">Superintending Head / Engineer</label>
                <input
                  type="text"
                  required
                  value={headName}
                  onChange={(e) => setHeadName(e.target.value)}
                  placeholder="e.g. Er. Rameshwar Rao"
                  className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Official Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="dept@civicsense.gov.in"
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Contact Helpline</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 40 2322 0000"
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#263A32]">Zones Covered (comma separated)</label>
                <input
                  type="text"
                  value={zonesCovered}
                  onChange={(e) => setZonesCovered(e.target.value)}
                  placeholder="Serilingampally, Cyberabad, Kukatpally"
                  className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Active Field Staff</label>
                  <input
                    type="number"
                    value={activeStaffCount}
                    onChange={(e) => setActiveStaffCount(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Brand Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 h-8 w-full rounded-lg border border-[#DFE8E1] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFE8E1]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-[#DFE8E1] px-4 py-2 text-xs font-semibold text-[#687A70] hover:bg-[#F4F7F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#237A57] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

