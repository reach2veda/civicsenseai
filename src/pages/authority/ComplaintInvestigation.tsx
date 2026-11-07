import React, { useState } from 'react';
import { Complaint, User, ComplaintStatus, ResolutionRecord } from '../../types';
import { StorageService } from '../../services/storageService';
import { ComplaintDbService, isUuid } from '../../services/complaintDbService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import { PriorityScoreGauge } from '../../components/ai/PriorityScoreGauge';
import { DuplicateDetectionCard } from '../../components/ai/DuplicateDetectionCard';
import { DepartmentRoutingCard } from '../../components/ai/DepartmentRoutingCard';
import { SuspiciousTrustIndicator } from '../../components/ai/SuspiciousTrustIndicator';
import { AuthorityWorkflowIntelligenceCard } from '../../components/ai/AuthorityWorkflowIntelligenceCard';
import { InteractiveCivicMap } from '../../components/map/InteractiveCivicMap';
import {
  FileText,
  MapPin,
  Clock,
  User as UserIcon,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  ExternalLink
} from 'lucide-react';

interface ComplaintInvestigationProps {
  complaintId?: string;
  complaints: Complaint[];
  currentUser: User;
  onRefreshData: () => void;
  onBackToQueue: () => void;
}

export const ComplaintInvestigation: React.FC<ComplaintInvestigationProps> = ({
  complaintId,
  complaints,
  currentUser,
  onRefreshData,
  onBackToQueue
}) => {
  const complaint =
    complaints.find((c) => c.id === complaintId) || complaints[0];

  // Action Form State
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [workDescription, setWorkDescription] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState(
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
  );
  const [materialsUsed, setMaterialsUsed] = useState('Hot-mix bituminous asphalt, 50mm aggregate');
  const [expensesINR, setExpensesINR] = useState(14500);

  if (!complaint) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm font-semibold text-[#263A32]">No complaint selected for investigation.</p>
        <button
          onClick={onBackToQueue}
          className="mt-3 rounded-lg bg-[#237A57] px-4 py-2 text-xs font-semibold text-white hover:bg-[#123D32] transition-colors"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: ComplaintStatus, description: string) => {
    if (isSupabaseConfigured() && isUuid(complaint.id)) {
      const res = await ComplaintDbService.updateComplaintStatus(complaint.id, newStatus);
      if (res.error) {
        alert(`Supabase database update rejected: ${res.error}`);
        return;
      }
    }

    StorageService.updateComplaintStatus(complaint.id, newStatus, {
      id: `tl-${Date.now()}`,
      status: newStatus,
      title: `Status set to ${newStatus.replace('_', ' ').toUpperCase()}`,
      description,
      timestamp: new Date().toISOString(),
      performedBy: currentUser.name,
      role: 'authority'
    });
    onRefreshData();
  };

  const handleAddInternalNote = () => {
    if (!internalNoteInput.trim()) return;
    StorageService.addInternalNote(complaint.id, `${internalNoteInput} (Logged by ${currentUser.name})`);
    setInternalNoteInput('');
    onRefreshData();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    handleStatusChange('rejected', `Rejected by Authority: ${rejectReason}`);
    setShowRejectModal(false);
  };

  const handleMarkResolved = (e: React.FormEvent) => {
    e.preventDefault();
    const resolution: ResolutionRecord = {
      resolvedAt: new Date().toISOString(),
      authorityId: currentUser.id,
      authorityName: currentUser.name,
      departmentId: complaint.assignedDepartmentId,
      workDescription,
      beforeImageUrl: complaint.mediaUrls[0] || undefined,
      afterImageUrl,
      expensesIncurredINR: Number(expensesINR),
      materialsUsed: materialsUsed.split(',').map((m) => m.trim()),
      citizenVerification: {
        status: 'pending'
      }
    };

    StorageService.resolveComplaint(complaint.id, resolution);
    setShowResolveModal(false);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToQueue}
              className="text-xs font-semibold text-[#237A57] hover:underline"
            >
              ← Back to Official Queue
            </button>
            <span className="text-[#687A70]/40">/</span>
            <span className="font-mono text-xs font-extrabold text-[#123D32]">{complaint.id}</span>
            <SeverityBadge severity={complaint.aiAnalysis.severity} size="sm" />
            <StatusBadge status={complaint.status} size="sm" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#263A32] mt-1">
            {complaint.title}
          </h1>
          <p className="text-xs text-[#687A70] flex items-center gap-1.5 mt-0.5">
            <MapPin className="h-3.5 w-3.5 text-[#237A57]" />
            {complaint.location.address} ({complaint.location.area})
          </p>
        </div>

        {/* Quick Authority Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {complaint.status !== 'in_progress' && complaint.status !== 'resolved' && complaint.status !== 'verified' && (
            <button
              onClick={() => handleStatusChange('in_progress', 'Field inspection squad dispatched.')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" /> Accept & Start Work
            </button>
          )}

          {complaint.status !== 'resolved' && complaint.status !== 'verified' && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
            >
              <Upload className="h-4 w-4" /> Submit Resolution Evidence
            </button>
          )}

          {complaint.status !== 'rejected' && complaint.status !== 'resolved' && complaint.status !== 'verified' && (
            <button
              onClick={() => setShowRejectModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
            >
              <XCircle className="h-4 w-4" /> Reject Grievance
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left 2 cols, Right 1 col */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Evidence, Location & AI Intelligence Workflows */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Workflow Intelligence SOP Card */}
          <AuthorityWorkflowIntelligenceCard complaint={complaint} />

          {/* Citizen Description & Evidence */}
          <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#263A32] border-b border-[#DFE8E1] pb-2">
              Citizen Grievance & Submitted Evidence
            </h3>

            <p className="text-xs text-[#263A32] leading-relaxed bg-[#F4F7F5] p-3.5 rounded-lg border border-[#DFE8E1]">
              {complaint.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#687A70] mb-1.5">Submitted Photograph:</p>
                {complaint.mediaUrls.length > 0 ? (
                  <img
                    src={complaint.mediaUrls[0]}
                    alt="Citizen Evidence"
                    className="h-48 w-full rounded-lg object-cover border border-[#DFE8E1] shadow-xs"
                  />
                ) : (
                  <div className="h-48 rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] flex items-center justify-center text-xs text-[#687A70]">
                    No image attached
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#687A70] mb-1.5">Geospatial Pin on Map:</p>
                <InteractiveCivicMap
                  complaints={[complaint]}
                  height="192px"
                  selectedComplaintId={complaint.id}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-[#DFE8E1] pt-3 text-xs">
              <div>
                <span className="text-[#687A70]">Citizen:</span>
                <p className="font-bold text-[#263A32]">{complaint.citizenName}</p>
              </div>
              <div>
                <span className="text-[#687A70]">Contact:</span>
                <p className="font-semibold text-[#263A32]">{complaint.citizenPhone}</p>
              </div>
              <div>
                <span className="text-[#687A70]">Date Logged:</span>
                <p className="font-semibold text-[#263A32]">
                  {new Date(complaint.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Duplicate Detection Card */}
          <DuplicateDetectionCard
            currentComplaintId={complaint.id}
            result={complaint.aiAnalysis.duplicateDetection}
            onActionComplete={onRefreshData}
          />

          {/* Department Routing Card */}
          <DepartmentRoutingCard
            complaintId={complaint.id}
            recommendedDepartmentId={complaint.aiAnalysis.recommendedDepartmentId}
            recommendedDepartmentName={complaint.aiAnalysis.recommendedDepartmentName}
            routingReasoning={complaint.aiAnalysis.routingReasoning}
            currentAssignedDepartmentId={complaint.assignedDepartmentId}
            wardZone={`${complaint.location.wardNumber} (${complaint.location.zone})`}
            onDepartmentChanged={onRefreshData}
          />

          {/* Suspicious Trust Indicator */}
          <SuspiciousTrustIndicator
            complaintId={complaint.id}
            check={complaint.aiAnalysis.suspiciousCheck}
            onReviewed={onRefreshData}
          />
        </div>

        {/* Right 1 Col: AI Priority Breakdown & Internal Notes */}
        <div className="space-y-6">
          {/* AI Priority Breakdown Gauge */}
          <PriorityScoreGauge
            score={complaint.aiAnalysis.priorityScore}
            severity={complaint.aiAnalysis.severity}
            category={complaint.aiAnalysis.priorityCategory}
            breakdown={complaint.aiAnalysis.priorityBreakdown}
          />

          {/* Internal Notes & Logs */}
          <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#263A32] border-b border-[#DFE8E1] pb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#237A57]" />
              <span>Official Internal Notes</span>
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {!complaint.internalNotes || complaint.internalNotes.length === 0 ? (
                <p className="text-xs text-[#687A70] italic">No internal notes added yet.</p>
              ) : (
                complaint.internalNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] border border-[#DFE8E1] leading-snug"
                  >
                    {note}
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DFE8E1]">
              <textarea
                rows={2}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Add confidential departmental note (e.g. dispatched vehicle TS-09-412)..."
                className="w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] placeholder-[#687A70] focus:border-[#237A57] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddInternalNote}
                disabled={!internalNoteInput.trim()}
                className="w-full rounded-lg bg-[#123D32] py-1.5 text-xs font-semibold text-white hover:bg-[#237A57] disabled:opacity-50 transition-colors"
              >
                Log Internal Note
              </button>
            </div>
          </div>

          {/* Timeline Audit Trail */}
          <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#263A32] border-b border-[#DFE8E1] pb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#237A57]" />
              <span>Grievance Audit Log</span>
            </h3>

            <div className="space-y-3 text-xs">
              {complaint.timeline.map((evt) => (
                <div key={evt.id} className="border-l-2 border-[#237A57] pl-3 space-y-0.5">
                  <p className="font-bold text-[#263A32]">{evt.title}</p>
                  <p className="text-[#687A70] text-[11px]">{evt.description}</p>
                  <p className="text-[10px] text-[#687A70]">
                    {new Date(evt.timestamp).toLocaleString()} • {evt.performedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION SUBMISSION MODAL */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D32]/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-[#DFE8E1]">
            <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
              <h3 className="text-base font-bold text-[#263A32]">
                Submit Resolution & Close Ticket
              </h3>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-[#687A70] hover:text-[#263A32]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMarkResolved} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#263A32]">
                  Detailed Work Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Detail exact remediation actions, machinery utilized, and safety verifications completed..."
                  className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#263A32]">
                  After-Remediation Photo URL *
                </label>
                <input
                  type="text"
                  required
                  value={afterImageUrl}
                  onChange={(e) => setAfterImageUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-[#687A70]">
                  Demo image URL pre-filled. Citizen will review this image for verification.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">
                    Materials Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={materialsUsed}
                    onChange={(e) => setMaterialsUsed(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263A32]">
                    Expenses Incurred (INR)
                  </label>
                  <input
                    type="number"
                    value={expensesINR}
                    onChange={(e) => setExpensesINR(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DFE8E1]">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="rounded-lg border border-[#DFE8E1] px-4 py-2 text-xs font-semibold text-[#687A70] hover:bg-[#F4F7F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#237A57] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
                >
                  Confirm & Request Citizen Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D32]/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#DFE8E1]">
            <h3 className="text-base font-bold text-[#263A32]">Reject Grievance</h3>
            <p className="mt-1 text-xs text-[#687A70]">
              Provide an official justifiable reason for grievance rejection.
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate report already being serviced under ticket #CIVIC-1092..."
              className="mt-3 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-red-500 focus:outline-none"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="rounded-lg border border-[#DFE8E1] px-4 py-2 text-xs font-semibold text-[#687A70] hover:bg-[#F4F7F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Reject Grievance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

