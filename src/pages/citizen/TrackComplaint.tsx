import React, { useState, useEffect } from 'react';
import { Complaint, User, ComplaintStatus } from '../../types';
import { StorageService } from '../../services/storageService';
import { ComplaintDbService, isUuid } from '../../services/complaintDbService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { I18nService } from '../../services/i18nService';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import { PriorityScoreGauge } from '../../components/ai/PriorityScoreGauge';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Volume2,
  Star,
  ThumbsUp,
  RotateCcw,
  UserCheck
} from 'lucide-react';

interface TrackComplaintProps {
  currentUser: User;
  complaints: Complaint[];
  initialComplaintId?: string;
  onRefreshData: () => void;
}

export const TrackComplaint: React.FC<TrackComplaintProps> = ({
  currentUser,
  complaints,
  initialComplaintId,
  onRefreshData
}) => {
  const [searchId, setSearchId] = useState(initialComplaintId || complaints[0]?.id || '');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | undefined>(
    complaints.find((c) => c.id === initialComplaintId) || complaints[0]
  );

  // Verification Form & Async State
  const [rating, setRating] = useState<number>(5);
  const [citizenFeedback, setCitizenFeedback] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialComplaintId) {
      setSearchId(initialComplaintId);
      const match = complaints.find((c) => c.id === initialComplaintId);
      if (match) {
        setSelectedComplaint(match);
      } else if (isSupabaseConfigured()) {
        ComplaintDbService.fetchComplaintById(initialComplaintId).then((res) => {
          if (res.data) setSelectedComplaint(res.data);
        });
      }
    } else if (complaints.length > 0 && !selectedComplaint) {
      setSelectedComplaint(complaints[0]);
      setSearchId(complaints[0].id);
    }
  }, [initialComplaintId, complaints]);

  const handleSearch = async (idToFind: string) => {
    const trimmed = idToFind.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    // 1. In-memory check
    const match = complaints.find(
      (c) => c.id.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      setSelectedComplaint(match);
      setSearchId(match.id);
      setIsSearching(false);
      return;
    }

    // 2. Database query for direct reference or UUID
    if (isSupabaseConfigured()) {
      const dbRes = await ComplaintDbService.fetchComplaintById(trimmed);
      if (dbRes.data) {
        setSelectedComplaint(dbRes.data);
        setSearchId(dbRes.data.id);
        setIsSearching(false);
        return;
      }
    }

    setIsSearching(false);
    setFeedbackError(`Complaint with reference ID "${trimmed}" was not found in the database.`);
  };

  const handleVerificationSubmit = async (approved: boolean) => {
    if (!selectedComplaint) return;
    setIsSubmitting(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    if (isSupabaseConfigured() && isUuid(selectedComplaint.id)) {
      const res = await ComplaintDbService.verifyResolution(selectedComplaint.id, approved);
      if (res.error) {
        setFeedbackError(`Database update rejected: ${res.error}`);
        setIsSubmitting(false);
        return;
      }

      // Re-fetch fresh complaint with updated status history
      const fresh = await ComplaintDbService.fetchComplaintById(selectedComplaint.id);
      if (fresh.data) {
        setSelectedComplaint(fresh.data);
      }
      setFeedbackSuccess(
        approved
          ? 'Resolution verified and closed by citizen.'
          : 'Grievance reopened. Authority has been alerted.'
      );
      onRefreshData();
    } else {
      StorageService.verifyResolution(
        selectedComplaint.id,
        approved,
        citizenFeedback || (approved ? 'Resolution confirmed on-site by citizen.' : 'Issue persists.'),
        currentUser.name,
        rating
      );
      onRefreshData();
      const updated = StorageService.getComplaintById(selectedComplaint.id);
      setSelectedComplaint(updated);
      setFeedbackSuccess(
        approved ? 'Resolution verified (Demo Sandbox).' : 'Grievance reopened (Demo Sandbox).'
      );
    }

    setIsSubmitting(false);
  };

  const statusStages: { key: ComplaintStatus; label: string; desc: string }[] = [
    { key: 'submitted', label: 'Submitted', desc: 'Registered in municipal database' },
    { key: 'ai_analyzed', label: 'AI Analyzed', desc: 'Risk evaluated & department routed' },
    { key: 'assigned', label: 'Assigned', desc: 'Assigned to executive engineer' },
    { key: 'in_progress', label: 'In Progress', desc: 'Field repair team active on site' },
    { key: 'resolved', label: 'Resolved', desc: 'Work completed by authority' },
    { key: 'verified', label: 'Verified', desc: 'Citizen confirmed resolution' }
  ];

  const getStageIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'ai_analyzed':
        return 1;
      case 'assigned':
        return 2;
      case 'in_progress':
        return 3;
      case 'resolved':
        return 4;
      case 'verified':
        return 5;
      case 'reopened':
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIdx = selectedComplaint ? getStageIndex(selectedComplaint.status) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-[#263A32] font-sans">
      {/* Search Bar */}
      <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#687A70]" />
            <input
              type="text"
              placeholder="Search by Complaint ID (e.g. CIVIC-2026-HYD-1092)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchId);
              }}
              className="w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] pl-9 pr-3 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            onClick={() => handleSearch(searchId)}
            className="rounded-lg bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-semibold text-white shadow-xs"
          >
            Track Grievance
          </button>
        </div>

        {/* Quick ID switcher chips */}
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto text-[11px] text-[#687A70]">
          <span className="font-semibold text-[#263A32] flex-shrink-0">Sample Grievances:</span>
          {complaints.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedComplaint(c);
                setSearchId(c.id);
              }}
              className={`rounded-md px-2 py-0.5 font-mono font-medium transition-colors ${
                selectedComplaint?.id === c.id
                  ? 'bg-[#237A57] text-white font-bold'
                  : 'bg-[#F4F7F5] text-[#263A32] hover:bg-[#E7F2EC]'
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {feedbackError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center justify-between">
          <span>{feedbackError}</span>
          <button
            type="button"
            onClick={() => setFeedbackError(null)}
            className="font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {feedbackSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-[#123D32] flex items-center justify-between">
          <span>{feedbackSuccess}</span>
          <button
            type="button"
            onClick={() => setFeedbackSuccess(null)}
            className="font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {selectedComplaint ? (
        <div className="space-y-6">
          {/* Main Status Header Card */}
          <div className="rounded-xl border border-[#DFE8E1] bg-white p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DFE8E1] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-[#237A57]">
                    {selectedComplaint.id}
                  </span>
                  <SeverityBadge severity={selectedComplaint.aiAnalysis.severity} size="md" />
                  <StatusBadge status={selectedComplaint.status} size="md" />
                </div>
                <h1 className="text-xl font-bold text-[#123D32]">{selectedComplaint.title}</h1>
                <p className="text-xs text-[#687A70] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#237A57]" />
                  {selectedComplaint.location.address} ({selectedComplaint.location.wardNumber})
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    I18nService.speak(
                      `Grievance ${selectedComplaint.id}: Current status is ${selectedComplaint.status}. Assigned to ${selectedComplaint.assignedDepartmentName}.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#DFE8E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#263A32] hover:bg-[#F4F7F5]"
                >
                  <Volume2 className="h-3.5 w-3.5 text-[#237A57]" /> Listen to Status
                </button>
              </div>
            </div>

            {/* Status Timeline Stepper */}
            <div className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {statusStages.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div
                      key={stage.key}
                      className={`relative flex flex-col p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-[#237A57] bg-[#E7F2EC] ring-2 ring-[#237A57]/20'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-[#DFE8E1] bg-[#F4F7F5] text-[#687A70] opacity-60'
                      }`}
                    >
                      <div className="mx-auto mb-1.5">
                        {isCompleted ? (
                          <CheckCircle2
                            className={`h-5 w-5 ${
                              isCurrent ? 'text-[#237A57] animate-pulse' : 'text-[#237A57]'
                            }`}
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-[#DFE8E1] mx-auto" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#123D32]">{stage.label}</span>
                      <span className="text-[10px] text-[#687A70] line-clamp-1">{stage.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CITIZEN RESOLUTION VERIFICATION PANEL */}
          {selectedComplaint.status === 'resolved' && (
            <div className="rounded-xl border-2 border-[#237A57] bg-[#E7F2EC]/60 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="rounded-full bg-[#237A57] text-white px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                    Action Required: Citizen Verification
                  </span>
                  <h3 className="text-base font-bold text-[#123D32]">
                    The Municipal Authority Marked this Grievance Resolved
                  </h3>
                  <p className="text-xs text-[#687A70]">
                    Please inspect the work description and before/after photographs below. As a citizen,
                    you have the authority to confirm completion or reopen the grievance.
                  </p>
                </div>
              </div>

              {/* Resolution Evidence Display */}
              {selectedComplaint.resolution && (
                <div className="space-y-3 rounded-lg border border-[#DFE8E1] bg-white p-4">
                  <p className="text-xs font-bold text-[#123D32]">
                    Authority Work Report by{' '}
                    <span className="text-[#237A57]">{selectedComplaint.resolution.authorityName}</span>:
                  </p>
                  <p className="text-xs text-[#263A32] leading-relaxed bg-[#F4F7F5] p-2.5 rounded border border-[#DFE8E1]">
                    "{selectedComplaint.resolution.workDescription}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {selectedComplaint.resolution.beforeImageUrl && (
                      <div>
                        <p className="text-[11px] font-bold text-[#687A70] uppercase mb-1">
                          Before Remediation:
                        </p>
                        <img
                          src={selectedComplaint.resolution.beforeImageUrl}
                          alt="Before"
                          className="h-40 w-full rounded-lg object-cover border border-[#DFE8E1]"
                        />
                      </div>
                    )}
                    {selectedComplaint.resolution.afterImageUrl && (
                      <div>
                        <p className="text-[11px] font-bold text-[#237A57] uppercase mb-1">
                          After Municipal Completion:
                        </p>
                        <img
                          src={selectedComplaint.resolution.afterImageUrl}
                          alt="After"
                          className="h-40 w-full rounded-lg object-cover border border-emerald-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Citizen Approval / Rejection Controls */}
              <div className="space-y-3 border-t border-[#DFE8E1] pt-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-[#123D32]">Your Rating:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#123D32]">
                    Citizen Feedback / Verification Remarks:
                  </label>
                  <textarea
                    rows={2}
                    value={citizenFeedback}
                    onChange={(e) => setCitizenFeedback(e.target.value)}
                    placeholder="e.g. Verified on site, road surface is smooth and clean. Thank you GHMC team!"
                    className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-white p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleVerificationSubmit(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] hover:bg-[#1B6346] px-5 py-2.5 text-xs font-bold text-white shadow-xs"
                  >
                    <ThumbsUp className="h-4 w-4" /> Approve & Confirm Resolution
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerificationSubmit(false)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100"
                  >
                    <RotateCcw className="h-4 w-4" /> Reject (Reopen Grievance)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If already verified, show citizen verification badge */}
          {selectedComplaint.status === 'verified' && selectedComplaint.resolution?.citizenVerification && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-[#123D32] flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-[#237A57] flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold">
                  Citizen Verified & Approved (Rated {selectedComplaint.resolution.citizenVerification.rating}/5 Stars)
                </p>
                <p className="text-[#263A32]">
                  "{selectedComplaint.resolution.citizenVerification.citizenFeedback}"
                </p>
                <p className="text-[10px] text-[#687A70]">
                  Verified at: {new Date(selectedComplaint.resolution.citizenVerification.verifiedAt || '').toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Details & AI Priority Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Complaint Metadata */}
            <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#123D32] border-b border-[#DFE8E1] pb-2">
                Grievance Particulars
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-[#687A70]">Citizen Description:</span>
                  <p className="mt-1 leading-relaxed text-[#263A32] bg-[#F4F7F5] p-3 rounded-lg border border-[#DFE8E1]">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-[#F4F7F5] p-2.5 border border-[#DFE8E1]">
                    <span className="text-[#687A70]">Assigned Department:</span>
                    <p className="font-bold text-[#123D32]">{selectedComplaint.assignedDepartmentName}</p>
                  </div>
                  <div className="rounded-lg bg-[#F4F7F5] p-2.5 border border-[#DFE8E1]">
                    <span className="text-[#687A70]">Responsible Officer:</span>
                    <p className="font-bold text-[#123D32]">
                      {selectedComplaint.assignedAuthorityName || 'Pending Assignment'}
                    </p>
                  </div>
                </div>

                {selectedComplaint.mediaUrls.length > 0 && (
                  <div>
                    <span className="font-semibold text-[#687A70]">Citizen Submitted Photo:</span>
                    <img
                      src={selectedComplaint.mediaUrls[0]}
                      alt="Citizen Evidence"
                      className="mt-1.5 h-48 w-full rounded-lg object-cover border border-[#DFE8E1]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: AI Score Breakdown */}
            <div className="space-y-4">
              <PriorityScoreGauge
                score={selectedComplaint.aiAnalysis.priorityScore}
                severity={selectedComplaint.aiAnalysis.severity}
                category={selectedComplaint.aiAnalysis.priorityCategory}
                breakdown={selectedComplaint.aiAnalysis.priorityBreakdown}
              />
            </div>
          </div>

          {/* Full Audit Timeline */}
          <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#123D32] border-b border-[#DFE8E1] pb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#237A57]" />
              <span>Complete Grievance Audit Trail</span>
            </h3>

            <div className="relative border-l-2 border-[#DFE8E1] ml-4 space-y-5 py-2">
              {selectedComplaint.timeline.map((evt) => (
                <div key={evt.id} className="relative pl-6">
                  <span className="absolute -left-2.5 top-0.5 h-5 w-5 rounded-full border-2 border-white bg-[#237A57] text-white shadow-xs" />
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#123D32]">{evt.title}</span>
                      <span className="rounded bg-[#E7F2EC] px-1.5 py-0.5 text-[10px] font-semibold text-[#123D32]">
                        {evt.performedBy}
                      </span>
                    </div>
                    <p className="text-[#687A70]">{evt.description}</p>
                    <p className="text-[10px] text-[#A7C2B4]">
                      {new Date(evt.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-[#687A70]">Complaint not found.</div>
      )}
    </div>
  );
};
