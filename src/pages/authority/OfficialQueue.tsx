import React, { useState } from 'react';
import { Complaint, ComplaintCategory, ComplaintSeverity, ComplaintStatus } from '../../types';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import {
  Search,
  ArrowUpDown,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Building2
} from 'lucide-react';

interface OfficialQueueProps {
  complaints: Complaint[];
  selectedDepartmentId?: string;
  onOpenInvestigation: (complaintId: string) => void;
}

export const OfficialQueue: React.FC<OfficialQueueProps> = ({
  complaints,
  selectedDepartmentId,
  onOpenInvestigation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'id'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter
  const filtered = complaints.filter((c) => {
    if (selectedDepartmentId && selectedDepartmentId !== 'all') {
      if (c.assignedDepartmentId !== selectedDepartmentId) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.location.area.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && c.aiAnalysis.priorityCategory.toLowerCase() !== selectedPriority)
      return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') {
      return sortOrder === 'desc'
        ? b.aiAnalysis.priorityScore - a.aiAnalysis.priorityScore
        : a.aiAnalysis.priorityScore - b.aiAnalysis.priorityScore;
    }
    if (sortBy === 'date') {
      const tA = new Date(a.submittedAt).getTime();
      const tB = new Date(b.submittedAt).getTime();
      return sortOrder === 'desc' ? tB - tA : tA - tB;
    }
    return a.id.localeCompare(b.id);
  });

  const toggleSort = (type: 'priority' | 'date' | 'id') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">
            Official Grievance Queue
          </h1>
          <p className="text-xs text-[#687A70]">
            Interactive authority dispatch roster with automated priority ranking
          </p>
        </div>

        <span className="rounded-lg bg-[#E7F2EC] border border-[#DFE8E1] px-3 py-1.5 text-xs font-bold text-[#123D32]">
          Showing {sorted.length} Active Records
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#687A70]" />
            <input
              type="text"
              placeholder="Search by Complaint ID, title, area or street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] pl-9 pr-3 py-2 text-xs text-[#263A32] placeholder-[#687A70] focus:border-[#237A57] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="road_potholes">Roads & Potholes</option>
              <option value="water_leakage">Water Leakage</option>
              <option value="garbage_waste">Garbage & Waste</option>
              <option value="streetlight_failures">Streetlights</option>
              <option value="drainage_sewage">Drainage & Sewage</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="ai_analyzed">AI Analyzed</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Official Table */}
      <div className="overflow-hidden rounded-xl border border-[#DFE8E1] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#263A32]">
            <thead className="border-b border-[#DFE8E1] bg-[#E7F2EC] text-[11px] font-bold uppercase tracking-wider text-[#123D32]">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="cursor-pointer px-4 py-3 hover:text-[#237A57] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Complaint ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Title & Issue</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Location / Ward</th>
                <th
                  onClick={() => toggleSort('priority')}
                  className="cursor-pointer px-4 py-3 hover:text-[#237A57] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>AI Priority</span>
                    <ArrowUpDown className="h-3 w-3 text-[#237A57]" />
                  </div>
                </th>
                <th className="px-4 py-3">Severity</th>
                <th
                  onClick={() => toggleSort('date')}
                  className="cursor-pointer px-4 py-3 hover:text-[#237A57] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Assigned Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE8E1]">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#687A70]">
                    No matching grievances found in queue.
                  </td>
                </tr>
              ) : (
                sorted.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onOpenInvestigation(c.id)}
                    className="hover:bg-[#E7F2EC]/40 transition-colors cursor-pointer"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-[#237A57]">
                      {c.id}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-bold text-[#263A32] line-clamp-1 max-w-xs">{c.title}</p>
                      <p className="text-[11px] text-[#687A70] truncate max-w-xs">{c.subcategory}</p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="capitalize">{c.category.replace('_', ' ')}</span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#263A32]">{c.location.area}</p>
                      <p className="text-[10px] text-[#687A70]">{c.location.wardNumber}</p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono font-extrabold ${
                            c.aiAnalysis.priorityScore >= 90
                              ? 'text-red-600'
                              : c.aiAnalysis.priorityScore >= 75
                              ? 'text-orange-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {c.aiAnalysis.priorityScore}
                        </span>
                        <span className="text-[10px] text-[#687A70]">/ 100</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#687A70]">
                      {new Date(c.submittedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenInvestigation(c.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-[#E7F2EC] px-2.5 py-1 text-xs font-semibold text-[#123D32] hover:bg-[#237A57] hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Investigate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

