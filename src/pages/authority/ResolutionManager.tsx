import React, { useState } from 'react';
import { Complaint, User, ResolutionRecord } from '../../types';
import { StorageService } from '../../services/storageService';
import { ComplaintDbService, isUuid } from '../../services/complaintDbService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import {
  CheckCircle2,
  Upload,
  Camera,
  FileCheck2,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ResolutionManagerProps {
  complaints: Complaint[];
  currentUser: User;
  onRefreshData: () => void;
  onOpenComplaint: (id: string) => void;
}

export const ResolutionManager: React.FC<ResolutionManagerProps> = ({
  complaints,
  currentUser,
  onRefreshData,
  onOpenComplaint
}) => {
  // Pending resolution (not yet marked resolved or verified)
  const pendingGrievances = complaints.filter(
    (c) => c.status === 'in_progress' || c.status === 'assigned' || c.status === 'ai_analyzed'
  );

  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(
    pendingGrievances[0]?.id || ''
  );
  const [workDescription, setWorkDescription] = useState(
    'Remediation squad completed pavement cold-mix asphalt overlay, compacted subgrade, and cleared surface aggregate. Street safe for normal vehicular transit.'
  );
  const [afterImageUrl, setAfterImageUrl] = useState(
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
  );
  const [contractorName, setContractorName] = useState('GHMC Rapid Maintenance Division Unit 2');
  const [materialsUsed, setMaterialsUsed] = useState('Hot-mix Bituminous Concrete (4.5T), Stone Aggregate');
  const [expensesINR, setExpensesINR] = useState(16500);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId);

  const handleSubmitResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setResolutionError(null);

    const resolution: ResolutionRecord = {
      resolvedAt: new Date().toISOString(),
      authorityId: currentUser.id,
      authorityName: currentUser.name,
      departmentId: selectedComplaint.assignedDepartmentId,
      workDescription,
      beforeImageUrl: selectedComplaint.mediaUrls[0] || undefined,
      afterImageUrl,
      contractorName,
      expensesIncurredINR: Number(expensesINR),
      materialsUsed: materialsUsed.split(',').map((m) => m.trim()),
      citizenVerification: {
        status: 'pending'
      }
    };

    if (isSupabaseConfigured() && isUuid(selectedComplaint.id)) {
      const res = await ComplaintDbService.updateComplaintStatus(selectedComplaint.id, 'resolved');
      if (res.error) {
        setResolutionError(`Database resolution update failed: ${res.error}`);
        return;
      }
    }

    StorageService.resolveComplaint(selectedComplaint.id, resolution);
    setIsSuccess(true);
    onRefreshData();
    setTimeout(() => setIsSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">
          Resolution Management & Field Closeout
        </h1>
        <p className="text-xs text-[#687A70]">
          Upload verified before-and-after photographic evidence and transmit resolution to citizen
          for formal sign-off.
        </p>
      </div>

      {resolutionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-center justify-between">
          <span>{resolutionError}</span>
          <button
            type="button"
            onClick={() => setResolutionError(null)}
            className="font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {isSuccess && (
        <div className="rounded-xl border border-[#237A57]/30 bg-[#E7F2EC] p-4 text-[#123D32] flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#237A57] flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Resolution Submitted Successfully!</p>
            <p className="text-[#687A70]">
              Complaint has been marked RESOLVED and queued for Citizen Verification.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 1 Col: Selector list */}
        <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#687A70]">
            Select Active Grievance ({pendingGrievances.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {pendingGrievances.length === 0 ? (
              <p className="text-xs text-[#687A70] py-4 text-center">No open grievances pending resolution.</p>
            ) : (
              pendingGrievances.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaintId(c.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedComplaintId === c.id
                      ? 'border-[#237A57] bg-[#E7F2EC] ring-2 ring-[#237A57]/20'
                      : 'border-[#DFE8E1] bg-white hover:bg-[#F4F7F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#237A57]">{c.id}</span>
                    <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                  </div>
                  <p className="font-semibold text-[#263A32] mt-1 line-clamp-1">{c.title}</p>
                  <p className="text-[11px] text-[#687A70]">{c.location.area}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 2 Cols: Resolution Form */}
        <div className="md:col-span-2 space-y-6">
          {selectedComplaint ? (
            <form onSubmit={handleSubmitResolution} className="rounded-xl border border-[#DFE8E1] bg-white p-6 shadow-sm space-y-4">
              <div className="border-b border-[#DFE8E1] pb-3">
                <span className="font-mono text-xs font-bold text-[#237A57]">{selectedComplaint.id}</span>
                <h2 className="text-base font-bold text-[#263A32] mt-0.5">{selectedComplaint.title}</h2>
                <p className="text-xs text-[#687A70] flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-[#237A57]" />
                  {selectedComplaint.location.address}
                </p>
              </div>

              {/* Before Photo Comparison */}
              <div>
                <label className="text-xs font-semibold text-[#263A32] mb-1.5 block">
                  Original Citizen-Submitted Evidence (Before):
                </label>
                {selectedComplaint.mediaUrls.length > 0 ? (
                  <img
                    src={selectedComplaint.mediaUrls[0]}
                    alt="Before"
                    className="h-36 w-full rounded-lg object-cover border border-[#DFE8E1]"
                  />
                ) : (
                  <div className="h-28 rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] flex items-center justify-center text-xs text-[#687A70]">
                    No initial photo available
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#263A32]">
                  After-Remediation Evidence Photo URL *
                </label>
                <input
                  type="text"
                  required
                  value={afterImageUrl}
                  onChange={(e) => setAfterImageUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                />
                {afterImageUrl && (
                  <img
                    src={afterImageUrl}
                    alt="After preview"
                    className="mt-2 h-36 w-full rounded-lg object-cover border-2 border-[#237A57]/60"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#263A32]">
                  Official Work Description & Remediation Report *
                </label>
                <textarea
                  required
                  rows={3}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Contractor / Field Squad</label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">Expenses Incurred (INR)</label>
                  <input
                    type="number"
                    value={expensesINR}
                    onChange={(e) => setExpensesINR(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#DFE8E1]">
                <button
                  type="button"
                  onClick={() => onOpenComplaint(selectedComplaint.id)}
                  className="text-xs font-semibold text-[#237A57] hover:underline"
                >
                  View Full Investigation
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Resolution for Citizen Verification</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-[#DFE8E1] bg-white p-8 text-center text-[#687A70] text-xs">
              Select a grievance from the left to start resolution report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

