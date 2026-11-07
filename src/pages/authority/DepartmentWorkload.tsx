import React from 'react';
import { Department, Complaint } from '../../types';
import { Building2, Users, Clock, Star, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface DepartmentWorkloadProps {
  departments: Department[];
  complaints: Complaint[];
  onSelectDepartment?: (deptId: string) => void;
  onOpenInvestigation: (complaintId: string) => void;
}

export const DepartmentWorkload: React.FC<DepartmentWorkloadProps> = ({
  departments,
  complaints,
  onSelectDepartment,
  onOpenInvestigation
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">
          Department Workload & Performance
        </h1>
        <p className="text-xs text-[#687A70]">
          Capacity monitoring across Greater Hyderabad municipal departments & utilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptComplaints = complaints.filter((c) => c.assignedDepartmentId === dept.id);
          const pending = deptComplaints.filter(
            (c) => c.status !== 'resolved' && c.status !== 'verified'
          ).length;
          const resolved = deptComplaints.filter(
            (c) => c.status === 'resolved' || c.status === 'verified'
          ).length;
          const critical = deptComplaints.filter(
            (c) => c.aiAnalysis.severity === 'critical' && c.status !== 'resolved'
          ).length;

          return (
            <div
              key={dept.id}
              className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm hover:border-[#237A57]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: dept.color }}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#263A32]">{dept.name}</h3>
                      <span className="font-mono text-[10px] text-[#687A70] font-semibold">
                        {dept.shortCode}
                      </span>
                    </div>
                  </div>

                  {critical > 0 && (
                    <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-[10px] font-bold border border-red-200 animate-pulse">
                      {critical} Critical
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#687A70]">
                  <p className="font-semibold text-[#263A32]">{dept.headName}</p>
                  <p className="text-[11px] text-[#687A70]">{dept.phone}</p>
                </div>

                {/* Workload Stats Grid */}
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-[#F4F7F5] p-2.5 text-center text-xs border border-[#DFE8E1]">
                  <div>
                    <span className="text-[10px] text-[#687A70] uppercase font-semibold">Open</span>
                    <p className="font-bold text-[#263A32] text-sm">{pending}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#687A70] uppercase font-semibold">Resolved</span>
                    <p className="font-bold text-[#237A57] text-sm">{resolved}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#687A70] uppercase font-semibold">Staff</span>
                    <p className="font-bold text-[#263A32] text-sm">{dept.activeStaffCount}</p>
                  </div>
                </div>

                {/* KPI metrics */}
                <div className="space-y-1.5 text-[11px] text-[#687A70] pt-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#687A70]" /> Avg SLA:
                    </span>
                    <span className="font-semibold text-[#263A32]">
                      {dept.averageResolutionHours} Hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Citizen Rating:
                    </span>
                    <span className="font-semibold text-[#263A32]">
                      {dept.satisfactionRating} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* View active complaints button */}
              <div className="mt-4 border-t border-[#DFE8E1] pt-3">
                {deptComplaints.length > 0 ? (
                  <button
                    onClick={() => onOpenInvestigation(deptComplaints[0].id)}
                    className="w-full rounded-lg bg-[#E7F2EC] hover:bg-[#237A57] hover:text-white text-[#123D32] py-1.5 text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-[#DFE8E1]"
                  >
                    <span>Inspect Active Ticket ({deptComplaints[0].id})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span className="text-center text-[11px] text-[#687A70] block py-1">
                    No open tickets
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

