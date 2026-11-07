import React, { useState } from 'react';
import { DuplicateDetectionResult, Complaint } from '../../types';
import { StorageService } from '../../services/storageService';
import { Copy, MapPin, Image as ImageIcon, Clock, Check, GitMerge, Link, ExternalLink, ShieldAlert } from 'lucide-react';

interface DuplicateDetectionCardProps {
  currentComplaintId: string;
  result: DuplicateDetectionResult;
  onActionComplete?: () => void;
}

export const DuplicateDetectionCard: React.FC<DuplicateDetectionCardProps> = ({
  currentComplaintId,
  result,
  onActionComplete
}) => {
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const relatedComplaints: Complaint[] = result.similarComplaintIds
    .map((id) => StorageService.getComplaintById(id))
    .filter((c): c is Complaint => Boolean(c));

  const handleAction = (type: 'merge' | 'link' | 'separate') => {
    if (type === 'merge') {
      StorageService.addInternalNote(
        currentComplaintId,
        `Authority merged this complaint with Parent Ticket #${result.parentComplaintId || 'N/A'}. Field tasks consolidated.`
      );
      setActionTaken('Merged with Parent Ticket');
    } else if (type === 'link') {
      StorageService.addInternalNote(
        currentComplaintId,
        `Linked as related corroborating grievance to #${result.similarComplaintIds.join(', ')}.`
      );
      setActionTaken('Linked as Related Issue');
    } else {
      StorageService.addInternalNote(
        currentComplaintId,
        'Authority reviewed duplicate suggestion and confirmed this issue is distinct.'
      );
      setActionTaken('Marked as Distinct Ticket');
    }

    if (onActionComplete) onActionComplete();
  };

  return (
    <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F2EC] text-[#237A57]">
            <Copy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#263A32]">
              Duplicate & Related Complaint Detection
            </h3>
            <p className="text-xs text-[#687A70]">
              Cross-referenced against active geospatial complaints
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            result.isDuplicateLikely
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-[#E7F2EC] text-[#123D32] border border-[#DFE8E1]'
          }`}
        >
          {result.isDuplicateLikely
            ? `Duplicate Suspected (${result.confidenceScore}% Confidence)`
            : 'Unique Issue Confirmed'}
        </span>
      </div>

      {result.isDuplicateLikely ? (
        <div className="mt-4 space-y-4">
          {/* Match Factors Grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 rounded-lg bg-[#F4F7F5] p-3 text-xs border border-[#DFE8E1]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#237A57]" />
              <div>
                <p className="text-[10px] text-[#687A70]">Distance</p>
                <p className="font-semibold text-[#263A32]">
                  {result.matchFactors.locationProximityMeters}m away
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#237A57]" />
              <div>
                <p className="text-[10px] text-[#687A70]">Time Delta</p>
                <p className="font-semibold text-[#263A32]">
                  {result.matchFactors.timeDeltaHours} hrs apart
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Copy className="h-4 w-4 text-[#237A57]" />
              <div>
                <p className="text-[10px] text-[#687A70]">Text Match</p>
                <p className="font-semibold text-[#263A32]">
                  {result.matchFactors.textSimilarityPercentage}% Match
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#237A57]" />
              <div>
                <p className="text-[10px] text-[#687A70]">Visual Similarity</p>
                <p className="font-semibold text-[#263A32]">
                  {result.matchFactors.visualSimilarityPercentage}% Match
                </p>
              </div>
            </div>
          </div>

          {/* Related Complaints List */}
          {relatedComplaints.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#263A32]">
                Matching Active Complaints in Same Vicinity:
              </p>
              <div className="space-y-2">
                {relatedComplaints.map((rc) => (
                  <div
                    key={rc.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border border-[#DFE8E1] bg-white p-3 text-xs hover:border-[#237A57]/40 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#237A57]">{rc.id}</span>
                        <span className="rounded bg-[#E7F2EC] px-1.5 py-0.5 text-[10px] font-medium text-[#123D32]">
                          {rc.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-semibold text-[#263A32]">{rc.title}</p>
                      <p className="text-[11px] text-[#687A70]">{rc.location.address}</p>
                    </div>

                    {rc.mediaUrls.length > 0 && (
                      <img
                        src={rc.mediaUrls[0]}
                        alt="Evidence"
                        className="h-12 w-16 rounded object-cover border border-[#DFE8E1]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Authority Review Decision Buttons */}
          <div className="rounded-lg bg-[#E7F2EC] p-3 border border-[#DFE8E1]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#123D32]">Authority Review Required</h4>
                <p className="text-[11px] text-[#687A70]">
                  AI does not auto-merge grievances. Choose official action:
                </p>
              </div>
              {actionTaken && (
                <span className="inline-flex items-center gap-1 rounded bg-[#237A57] px-2 py-0.5 text-xs font-bold text-white">
                  <Check className="h-3 w-3" /> {actionTaken}
                </span>
              )}
            </div>

            {!actionTaken && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAction('merge')}
                  className="inline-flex items-center gap-1 rounded-md bg-[#237A57] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#123D32] transition-colors"
                >
                  <GitMerge className="h-3.5 w-3.5" /> Merge with Primary Ticket
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('link')}
                  className="inline-flex items-center gap-1 rounded-md border border-[#237A57] bg-white px-3 py-1.5 text-xs font-semibold text-[#237A57] hover:bg-[#E7F2EC] transition-colors"
                >
                  <Link className="h-3.5 w-3.5" /> Link as Corroborating Report
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('separate')}
                  className="rounded-md border border-[#DFE8E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#687A70] hover:bg-[#F4F7F5] transition-colors"
                >
                  Keep Separate
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-[#E7F2EC] p-3 text-xs text-[#123D32] border border-[#DFE8E1]">
          <p className="font-semibold">No Duplicate Found</p>
          <p className="mt-0.5 text-[11px] text-[#687A70]">
            No active civic reports with matching descriptors or proximity within 250 meters was
            detected in this municipal ward.
          </p>
        </div>
      )}
    </div>
  );
};

