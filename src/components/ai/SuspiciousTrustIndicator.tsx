import React, { useState } from 'react';
import { SuspiciousReportCheck } from '../../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Flag, Info } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface SuspiciousTrustIndicatorProps {
  complaintId: string;
  check: SuspiciousReportCheck;
  onReviewed?: () => void;
}

export const SuspiciousTrustIndicator: React.FC<SuspiciousTrustIndicatorProps> = ({
  complaintId,
  check,
  onReviewed
}) => {
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'cleared' | 'confirmed_spam'>(
    check.reviewStatus
  );

  const handleReview = (status: 'cleared' | 'confirmed_spam') => {
    setReviewStatus(status);
    StorageService.addInternalNote(
      complaintId,
      status === 'cleared'
        ? 'Authority verified submission authenticity: Cleared trust warning flags.'
        : 'Authority marked submission as unverified/spam. Resources withheld.'
    );
    if (onReviewed) onReviewed();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#237A57] bg-[#E7F2EC] border-[#DFE8E1]';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              check.isFlagged ? 'bg-red-50 text-red-600' : 'bg-[#E7F2EC] text-[#237A57]'
            }`}
          >
            {check.isFlagged ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#263A32]">
              Civic Trust & Anti-Spam Moderation Layer
            </h3>
            <p className="text-xs text-[#687A70]">
              Integrity verification & suspicious indicator detection
            </p>
          </div>
        </div>

        <div className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${getScoreColor(check.trustScore)}`}>
          Trust Index: {check.trustScore} / 100
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Explanation text */}
        <div
          className={`rounded-lg p-3 text-xs border ${
            check.isFlagged
              ? 'bg-red-50/60 border-red-200 text-red-950'
              : 'bg-[#E7F2EC] border-[#DFE8E1] text-[#123D32]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {check.isFlagged ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-[#237A57]" />
            )}
            <span>{check.isFlagged ? 'Warning Flags Detected' : 'Authentic Submission Verified'}</span>
          </div>
          <p className="leading-relaxed">{check.explanation}</p>
        </div>

        {/* Indicator Checkpoints */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-[11px]">
          <div className="rounded-md border border-[#DFE8E1] bg-[#F4F7F5] p-2">
            <span className="text-[#687A70]">Burst Rate:</span>
            <p className={`font-semibold ${check.indicators.rapidBurstSubmission ? 'text-red-600' : 'text-[#237A57]'}`}>
              {check.indicators.rapidBurstSubmission ? '⚠️ Rapid Burst' : '✓ Normal Interval'}
            </p>
          </div>

          <div className="rounded-md border border-[#DFE8E1] bg-[#F4F7F5] p-2">
            <span className="text-[#687A70]">GPS EXIF Match:</span>
            <p className={`font-semibold ${check.indicators.locationMetadataMismatch ? 'text-red-600' : 'text-[#237A57]'}`}>
              {check.indicators.locationMetadataMismatch ? '⚠️ IP/GPS Mismatch' : '✓ Ward Verified'}
            </p>
          </div>

          <div className="rounded-md border border-[#DFE8E1] bg-[#F4F7F5] p-2">
            <span className="text-[#687A70]">Media Hash:</span>
            <p className={`font-semibold ${check.indicators.duplicateMediaHash ? 'text-red-600' : 'text-[#237A57]'}`}>
              {check.indicators.duplicateMediaHash ? '⚠️ Duplicate Hash' : '✓ Unique Capture'}
            </p>
          </div>

          <div className="rounded-md border border-[#DFE8E1] bg-[#F4F7F5] p-2">
            <span className="text-[#687A70]">Description Semantics:</span>
            <p className={`font-semibold ${check.indicators.anomalyInDescription ? 'text-red-600' : 'text-[#237A57]'}`}>
              {check.indicators.anomalyInDescription ? '⚠️ Anomaly / Sparse' : '✓ Coherent'}
            </p>
          </div>
        </div>

        {/* Specific Flag list if any */}
        {check.flags.length > 0 && (
          <div className="space-y-1 rounded-lg bg-[#F4F7F5] p-3 text-xs border border-[#DFE8E1]">
            <p className="font-semibold text-[#263A32]">Detailed Indicators:</p>
            <ul className="list-disc pl-4 space-y-1 text-[#687A70]">
              {check.flags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Human Moderation Note & Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-[#F4F7F5] p-3 border border-[#DFE8E1]">
          <div className="text-xs text-[#263A32]">
            <span className="font-semibold text-[#263A32] flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-[#237A57]" /> Human-in-the-Loop Policy:
            </span>
            <p className="text-[11px] text-[#687A70]">
              Citizens are never penalized automatically. Authorities verify before status changes.
            </p>
          </div>

          {check.isFlagged && reviewStatus === 'pending' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleReview('cleared')}
                className="inline-flex items-center gap-1 rounded-md bg-[#237A57] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#123D32] transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Clear & Approve
              </button>
              <button
                type="button"
                onClick={() => handleReview('confirmed_spam')}
                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 transition-colors"
              >
                <Flag className="h-3.5 w-3.5" /> Flag As Invalid
              </button>
            </div>
          )}

          {reviewStatus !== 'pending' && (
            <span className="text-xs font-bold text-[#263A32]">
              Moderation Status:{' '}
              <span className={reviewStatus === 'cleared' ? 'text-[#237A57]' : 'text-red-600'}>
                {reviewStatus === 'cleared' ? 'Cleared by Officer' : 'Marked Spam'}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

