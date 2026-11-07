import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../../types';
import { ListChecks, Clock, AlertTriangle, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AuthorityWorkflowIntelligenceCardProps {
  complaint: Complaint;
  onUpdateStatus?: (newStatus: ComplaintStatus) => void;
}

export const AuthorityWorkflowIntelligenceCard: React.FC<AuthorityWorkflowIntelligenceCardProps> = ({
  complaint,
  onUpdateStatus
}) => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getRecommendedNextAction = (status: ComplaintStatus) => {
    switch (status) {
      case 'submitted':
        return 'Verify citizen geotag and formally assign division crew.';
      case 'ai_analyzed':
        return 'Review AI risk score & dispatch emergency response vehicle.';
      case 'assigned':
        return 'Mobilize field team to location and begin physical containment.';
      case 'in_progress':
        return 'Complete physical repairs, take timestamped "After" photo, and submit resolution.';
      case 'resolved':
        return 'Awaiting citizen verification. Follow up if no verification within 48h.';
      case 'verified':
        return 'Complaint successfully verified and archived.';
      default:
        return 'Review status notes and coordinate with zonal engineer.';
    }
  };

  return (
    <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F2EC] text-[#237A57]">
            <ListChecks className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#263A32]">
              Authority Workflow & Triage Intelligence
            </h3>
            <p className="text-xs text-[#687A70]">
              Dynamic operational checklist and SLA timer guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" /> SLA Target: {complaint.aiAnalysis.slaTargetHours} Hours
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Recommended Next Action Banner */}
        <div className="rounded-lg bg-[#E7F2EC] p-3.5 border border-[#DFE8E1] text-xs text-[#123D32]">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 text-[#123D32]">
              <ArrowUpRight className="h-4 w-4 text-[#237A57]" />
              Recommended Next Action:
            </span>
            <span className="font-mono text-[11px] text-[#237A57] font-semibold">
              Status: {complaint.status.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-[#263A32] font-medium">
            {getRecommendedNextAction(complaint.status)}
          </p>
        </div>

        {/* Suggested Step-by-Step Field SOP */}
        <div>
          <p className="text-xs font-bold text-[#263A32] mb-2">
            Suggested Field Standard Operating Procedure (SOP):
          </p>
          <div className="space-y-1.5">
            {complaint.aiAnalysis.suggestedActionSteps.map((step, idx) => {
              const isChecked = completedTasks.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleTask(idx)}
                  className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors cursor-pointer ${
                    isChecked
                      ? 'border-[#DFE8E1] bg-[#F4F7F5] text-[#687A70]'
                      : 'border-[#DFE8E1] bg-white text-[#263A32] hover:bg-[#F4F7F5]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-[#DFE8E1] text-[#237A57] focus:ring-[#237A57] cursor-pointer"
                  />
                  <span className={`flex-1 ${isChecked ? 'line-through text-[#687A70]' : ''}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escalation Recommendation */}
        {complaint.aiAnalysis.severity === 'critical' && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800 border border-red-200">
            <ShieldAlert className="h-4 w-4 text-red-600 flex-shrink-0" />
            <div className="text-[11px]">
              <strong>Emergency Escalation Rule Active:</strong> Grievance has priority score &gt; 90.
              If unattended within 4 hours, auto-escalation alert transmits directly to Additional Commissioner's dashboard.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

