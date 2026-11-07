import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { Department } from '../../types';
import { Building2, Check, ArrowRightLeft, ShieldCheck, MapPin } from 'lucide-react';

interface DepartmentRoutingCardProps {
  complaintId: string;
  recommendedDepartmentId: string;
  recommendedDepartmentName: string;
  routingReasoning: string;
  currentAssignedDepartmentId: string;
  wardZone: string;
  onDepartmentChanged?: (newDeptName: string) => void;
}

export const DepartmentRoutingCard: React.FC<DepartmentRoutingCardProps> = ({
  complaintId,
  recommendedDepartmentId,
  recommendedDepartmentName,
  routingReasoning,
  currentAssignedDepartmentId,
  wardZone,
  onDepartmentChanged
}) => {
  const departments = StorageService.getDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState(currentAssignedDepartmentId);
  const [isEditing, setIsEditing] = useState(false);
  const [reassignReason, setReassignReason] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveReassignment = () => {
    const dept = departments.find((d) => d.id === selectedDeptId);
    if (dept) {
      StorageService.reassignDepartment(complaintId, dept.id, dept.name, reassignReason);
      setSavedSuccess(true);
      setIsEditing(false);
      if (onDepartmentChanged) onDepartmentChanged(dept.name);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const currentDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F2EC] text-[#237A57]">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#263A32]">
              Intelligent Department Routing & Jurisdiction
            </h3>
            <p className="text-xs text-[#687A70]">
              AI-assisted municipal jurisdiction classification
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F2EC] px-2.5 py-0.5 text-xs font-semibold text-[#123D32] border border-[#DFE8E1]">
          <ShieldCheck className="h-3 w-3 text-[#237A57]" /> 97% AI Routing Match
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-[#F4F7F5] p-3.5 border border-[#DFE8E1]">
          <div className="space-y-1">
            <p className="text-xs text-[#687A70] font-medium">Assigned Department:</p>
            <p className="text-sm font-bold text-[#263A32] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#237A57]" />
              {currentDept?.name || recommendedDepartmentName}
            </p>
            <p className="text-[11px] text-[#687A70] flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#237A57]" /> Jurisdiction Ward: <strong className="text-[#263A32]">{wardZone}</strong>
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded-md border border-[#DFE8E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#263A32] shadow-2xs hover:bg-[#E7F2EC] transition-colors"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-[#687A70]" /> Reassign Department
            </button>
          )}
        </div>

        {/* AI Routing Reasoning */}
        <div className="rounded-lg border border-[#DFE8E1] bg-[#E7F2EC] p-3 text-xs text-[#123D32]">
          <p className="font-semibold text-[#123D32]">AI Routing Reasoning:</p>
          <p className="mt-1 leading-relaxed text-[#263A32]">{routingReasoning}</p>
        </div>

        {/* Reassignment Form */}
        {isEditing && (
          <div className="space-y-3 rounded-lg border border-[#DFE8E1] bg-white p-3.5">
            <h4 className="text-xs font-bold text-[#263A32]">Change Assigned Department</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-[#687A70]">New Department</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.shortCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#687A70]">Reassignment Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Falls under water drainage division"
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] placeholder-[#687A70] focus:border-[#237A57] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-md border border-[#DFE8E1] px-3 py-1.5 text-xs font-medium text-[#687A70] hover:bg-[#F4F7F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReassignment}
                className="inline-flex items-center gap-1 rounded-md bg-[#237A57] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#123D32] transition-colors"
              >
                <Check className="h-3.5 w-3.5" /> Confirm Reassignment
              </button>
            </div>
          </div>
        )}

        {savedSuccess && (
          <p className="text-xs font-semibold text-[#237A57] flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> Department reassignment saved to timeline.
          </p>
        )}
      </div>
    </div>
  );
};

