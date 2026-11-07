import React, { useState } from 'react';
import {
  Complaint,
  Department,
  User,
  FieldWorker,
  WorkerTask
} from '../../types';
import { StorageService } from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import {
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserPlus,
  Send,
  RotateCcw,
  Check,
  Search,
  Eye,
  MapPin,
  Camera,
  Phone,
  Mail
} from 'lucide-react';

interface WorkCoordinatorDashboardProps {
  currentUser: User;
  complaints: Complaint[];
  departments: Department[];
  fieldWorkers: FieldWorker[];
  workerTasks: WorkerTask[];
  onRefreshData: () => void;
  onOpenComplaint?: (id: string) => void;
}

export const WorkCoordinatorDashboard: React.FC<WorkCoordinatorDashboardProps> = ({
  currentUser,
  complaints,
  departments,
  fieldWorkers,
  workerTasks,
  onRefreshData,
  onOpenComplaint
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'workers' | 'monitoring'>(
    'overview'
  );

  // Assignment Modal State
  const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [deadlineHours, setDeadlineHours] = useState<number>(12);
  const [assignInstructions, setAssignInstructions] = useState<string>('');

  // Inspection / Work Review Modal State
  const [inspectTask, setInspectTask] = useState<WorkerTask | null>(null);
  const [reworkModalOpen, setReworkModalOpen] = useState(false);
  const [reworkReason, setReworkReason] = useState('');
  const [reworkCorrections, setReworkCorrections] = useState('');

  // Add Worker Modal State
  const [addWorkerModalOpen, setAddWorkerModalOpen] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerPhone, setNewWorkerPhone] = useState('+91 9440');
  const [newWorkerEmail, setNewWorkerEmail] = useState('');
  const [newWorkerDeptId, setNewWorkerDeptId] = useState(departments[0]?.id || 'dept-roads');
  const [newWorkerWard, setNewWorkerWard] = useState('Serilingampally Zone');
  const [newWorkerSkills, setNewWorkerSkills] = useState('Asphalt Patching, Subgrade Compaction');

  // Search & Filter in Assignment Table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterTaskStatus, setFilterTaskStatus] = useState('all');

  // Overview metrics
  const totalComplaints = complaints.length;
  const unassignedComplaints = complaints.filter(
    (c) => c.status === 'submitted' || c.status === 'ai_analyzed' || !c.assignedWorkerId
  ).length;
  const assignedComplaints = complaints.filter((c) => Boolean(c.assignedWorkerId)).length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'in_progress').length;
  const awaitingVerificationComplaints = workerTasks.filter(
    (t) => t.status === 'submitted_for_verification'
  ).length;
  const verifiedComplaints = complaints.filter((c) => c.status === 'verified').length;
  const overdueTasks = workerTasks.filter(
    (t) => new Date(t.deadline).getTime() < Date.now() && t.status !== 'approved_by_admin' && t.status !== 'completed'
  ).length;

  const handleOpenAssignModal = (complaint: Complaint) => {
    setAssignModalComplaint(complaint);
    const deptMatchWorkers = fieldWorkers.filter(
      (w) => w.departmentId === complaint.assignedDepartmentId
    );
    setSelectedWorkerId(deptMatchWorkers[0]?.id || fieldWorkers[0]?.id || '');
    setDeadlineHours(complaint.aiAnalysis.slaTargetHours || 12);
    setAssignInstructions(
      complaint.aiAnalysis.suggestedActionSteps?.join('. ') ||
        'Inspect site, verify safety perimeter, and execute remediation according to municipal SOP.'
    );
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint || !selectedWorkerId) return;

    StorageService.assignComplaintToWorker({
      complaintId: assignModalComplaint.id,
      workerId: selectedWorkerId,
      deadlineHours: Number(deadlineHours),
      instructions: assignInstructions,
      adminId: currentUser.id,
      adminName: currentUser.name
    });

    setAssignModalComplaint(null);
    onRefreshData();
  };

  const handleApproveWork = (task: WorkerTask) => {
    StorageService.adminApproveTask(task.id, currentUser.id, currentUser.name);
    setInspectTask(null);
    onRefreshData();
  };

  const handleRequestRework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectTask || !reworkReason.trim()) return;

    StorageService.adminRequestRework(
      inspectTask.id,
      currentUser.id,
      currentUser.name,
      reworkReason.trim(),
      reworkCorrections.trim()
    );

    setReworkModalOpen(false);
    setInspectTask(null);
    setReworkReason('');
    setReworkCorrections('');
    onRefreshData();
  };

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === newWorkerDeptId) || departments[0];
    const newWorker: FieldWorker = {
      id: `fw-${Date.now()}`,
      name: newWorkerName,
      phone: newWorkerPhone,
      email: newWorkerEmail || `${newWorkerName.toLowerCase().replace(/\s+/g, '.')}@field.civicsense.gov.in`,
      departmentId: dept.id,
      departmentName: dept.name,
      jurisdictionWard: newWorkerWard,
      skills: newWorkerSkills.split(',').map((s) => s.trim()),
      status: 'available',
      activeTaskCount: 0,
      completedTaskCount: 0,
      rating: 5.0,
      avatarUrl:
        'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    StorageService.saveFieldWorker(newWorker);
    setAddWorkerModalOpen(false);
    onRefreshData();
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterDept !== 'all' && c.assignedDepartmentId !== filterDept) return false;
    if (filterSeverity !== 'all' && c.aiAnalysis.severity !== filterSeverity) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.location.area.toLowerCase().includes(q) ||
        (c.assignedWorkerName && c.assignedWorkerName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const filteredTasks = workerTasks.filter((t) => {
    if (filterTaskStatus !== 'all' && t.status !== filterTaskStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-[#263A32] font-sans">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#DFE8E1] bg-white p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#237A57] animate-pulse" />
              <span className="rounded-full bg-[#E7F2EC] px-2.5 py-0.5 text-xs font-bold text-[#123D32] border border-[#DFE8E1]">
                Work Coordinator & Operations Portal
              </span>
              <span className="text-xs text-[#687A70]">
                Admin: {currentUser.name} (Greater Hyderabad Command)
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#123D32]">
              Civic Operations & Personnel Dispatch Mesh
            </h1>
            <p className="text-xs text-[#687A70] max-w-2xl leading-relaxed">
              Triage AI-classified grievances, dispatch specialized municipal field workers with
              task deadlines, and review remediation photographic evidence before citizen sign-off.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('assignments')}
              className="rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-extrabold text-white shadow-xs transition-all"
            >
              Dispatch Work
            </button>
            <button
              onClick={() => setAddWorkerModalOpen(true)}
              className="rounded-xl border border-[#DFE8E1] bg-white px-4 py-2 text-xs font-bold text-[#263A32] hover:bg-[#F4F7F5] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <UserPlus className="h-4 w-4 text-[#237A57]" /> Add Personnel
            </button>
          </div>
        </div>

        {/* Tab navigation strip */}
        <div className="mt-6 flex items-center gap-1 border-t border-[#DFE8E1] pt-4 overflow-x-auto text-xs font-bold">
          {[
            { id: 'overview' as const, label: 'Operations Overview' },
            { id: 'assignments' as const, label: `Assign Work (${unassignedComplaints} Pending)` },
            { id: 'monitoring' as const, label: `Task Monitoring (${awaitingVerificationComplaints} Awaiting Proof)` },
            { id: 'workers' as const, label: `Field Personnel (${fieldWorkers.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#237A57] text-white shadow-xs font-bold'
                  : 'text-[#687A70] hover:text-[#123D32] hover:bg-[#E7F2EC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            <StatCard
              title="Total Complaints"
              value={totalComplaints}
              icon={FileText}
              iconColor="text-[#123D32]"
            />
            <StatCard
              title="Unassigned"
              value={unassignedComplaints}
              icon={Clock}
              iconColor="text-amber-600"
              highlight={unassignedComplaints > 0}
            />
            <StatCard
              title="Assigned to Field"
              value={assignedComplaints}
              icon={Send}
              iconColor="text-blue-600"
            />
            <StatCard
              title="In Progress"
              value={inProgressComplaints}
              icon={Clock}
              iconColor="text-[#237A57]"
            />
            <StatCard
              title="Overdue Tasks"
              value={overdueTasks}
              icon={AlertTriangle}
              iconColor="text-red-600"
              highlight={overdueTasks > 0}
            />
            <StatCard
              title="Awaiting Approval"
              value={awaitingVerificationComplaints}
              icon={Eye}
              iconColor="text-[#123D32]"
              highlight={awaitingVerificationComplaints > 0}
            />
            <StatCard
              title="Verified & Closed"
              value={verifiedComplaints}
              icon={CheckCircle2}
              iconColor="text-[#237A57]"
            />
          </div>

          {/* Quick Action Alerts */}
          {awaitingVerificationComplaints > 0 && (
            <div className="rounded-xl border border-[#237A57]/30 bg-[#E7F2EC] p-4 text-[#123D32] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-[#237A57] border border-[#DFE8E1]">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#123D32] uppercase tracking-wider">
                    {awaitingVerificationComplaints} Tasks Submitted with Remediation Proof
                  </p>
                  <p className="text-xs text-[#687A70]">
                    Field workers have completed on-site repairs. Inspect photographs and approve to
                    prompt citizen sign-off.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('monitoring')}
                className="rounded-xl bg-[#237A57] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1B6346] transition-colors"
              >
                Inspect Proofs
              </button>
            </div>
          )}

          {/* Side by side: Recent Unassigned & Active Field Personnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unassigned Urgent Complaints */}
            <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
                <h3 className="text-sm font-bold text-[#123D32] flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Unassigned Civic Grievances</span>
                </h3>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="text-xs text-[#237A57] hover:underline font-semibold"
                >
                  View All ({unassignedComplaints})
                </button>
              </div>

              <div className="space-y-3">
                {complaints
                  .filter((c) => !c.assignedWorkerId && c.status !== 'resolved' && c.status !== 'verified')
                  .slice(0, 3)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3.5 space-y-2 hover:border-[#237A57] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#237A57]">{c.id}</span>
                        <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                      </div>
                      <p className="text-xs font-bold text-[#263A32]">{c.title}</p>
                      <p className="text-[11px] text-[#687A70] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#237A57]" /> {c.location.address} ({c.location.area})
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-[#DFE8E1] text-[11px]">
                        <span className="text-[#687A70]">
                          Recommended: <strong className="text-[#263A32]">{c.assignedDepartmentName}</strong>
                        </span>
                        <button
                          onClick={() => handleOpenAssignModal(c)}
                          className="rounded-lg bg-[#E7F2EC] text-[#123D32] border border-[#DFE8E1] px-2.5 py-1 font-bold hover:bg-[#237A57] hover:text-white transition-colors"
                        >
                          Assign Worker →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Field Personnel Overview */}
            <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
                <h3 className="text-sm font-bold text-[#123D32] flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#237A57]" />
                  <span>Available Field Workers & Capacity</span>
                </h3>
                <button
                  onClick={() => setActiveTab('workers')}
                  className="text-xs text-[#237A57] hover:underline font-semibold"
                >
                  Manage Roster ({fieldWorkers.length})
                </button>
              </div>

              <div className="space-y-3">
                {fieldWorkers.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={w.avatarUrl}
                        alt={w.name}
                        className="h-9 w-9 rounded-full object-cover border border-[#237A57]"
                      />
                      <div>
                        <p className="font-bold text-[#263A32]">{w.name}</p>
                        <p className="text-[11px] text-[#687A70]">{w.departmentName}</p>
                        <p className="text-[10px] text-[#237A57]">{w.jurisdictionWard}</p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          w.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {w.status === 'available' ? 'Available' : `${w.activeTaskCount} Active Task`}
                      </span>
                      <p className="text-[10px] text-[#687A70]">
                        ⭐ {w.rating} • {w.completedTaskCount} completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: COMPLAINT ASSIGNMENT PAGE ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="rounded-2xl border border-[#DFE8E1] bg-white p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#687A70]" />
              <input
                type="text"
                placeholder="Search complaints by ID, title, area or assigned worker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] pl-9 pr-3 py-2 text-[#263A32] placeholder-[#A7C2B4] focus:border-[#237A57] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="rounded-xl border border-[#DFE8E1] bg-white px-3 py-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortCode}
                  </option>
                ))}
              </select>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="rounded-xl border border-[#DFE8E1] bg-white px-3 py-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Assignments Table */}
          <div className="overflow-hidden rounded-2xl border border-[#DFE8E1] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#687A70]">
                <thead className="border-b border-[#DFE8E1] bg-[#E7F2EC] text-[11px] font-bold uppercase tracking-wider text-[#123D32]">
                  <tr>
                    <th className="px-4 py-3">Complaint ID</th>
                    <th className="px-4 py-3">Issue Title</th>
                    <th className="px-4 py-3">Location & Ward</th>
                    <th className="px-4 py-3">AI Priority</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Recommended Dept</th>
                    <th className="px-4 py-3">Assigned Personnel</th>
                    <th className="px-4 py-3">Current Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE8E1]">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F4F7F5] transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-[#237A57]">
                        {c.id}
                      </td>

                      <td className="px-4 py-3 font-bold text-[#263A32] max-w-xs truncate">
                        {c.title}
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-[#263A32] font-medium">{c.location.area}</p>
                        <p className="text-[10px] text-[#687A70]">{c.location.wardNumber}</p>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-[#263A32]">
                        {c.aiAnalysis.priorityScore} / 100
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-[#237A57] font-medium">
                        {c.assignedDepartmentName}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        {c.assignedWorkerName ? (
                          <span className="font-bold text-[#263A32] flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#237A57]" />
                            {c.assignedWorkerName}
                          </span>
                        ) : (
                          <span className="rounded bg-amber-50 text-amber-800 px-2 py-0.5 text-[10px] font-semibold border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={c.status} size="sm" />
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAssignModal(c)}
                            className="rounded-xl bg-[#E7F2EC] text-[#123D32] border border-[#DFE8E1] px-3 py-1.5 text-xs font-bold hover:bg-[#237A57] hover:text-white transition-colors"
                          >
                            {c.assignedWorkerId ? 'Reassign' : 'Assign Work'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: WORK MONITORING & INSPECTION ================= */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="rounded-2xl border border-[#DFE8E1] bg-white p-4 flex items-center justify-between text-xs shadow-xs">
            <span className="text-[#687A70]">
              Monitoring active field assignments and submitted evidence:
            </span>
            <select
              value={filterTaskStatus}
              onChange={(e) => setFilterTaskStatus(e.target.value)}
              className="rounded-xl border border-[#DFE8E1] bg-white px-3 py-1.5 text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Task Statuses</option>
              <option value="not_accepted">Not Yet Accepted</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">Work In Progress</option>
              <option value="submitted_for_verification">Submitted For Verification</option>
              <option value="rework_requested">Rework Requested</option>
              <option value="approved_by_admin">Approved by Admin</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-[#DFE8E1] bg-white p-5 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-2.5">
                    <span className="font-mono text-xs font-black text-[#237A57]">{task.id}</span>
                    <StatusBadge status={task.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-[#263A32] line-clamp-1">{task.complaintTitle}</h3>
                  <p className="text-[11px] text-[#687A70] flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#237A57]" /> {task.location.address}
                  </p>

                  <div className="rounded-xl bg-[#F4F7F5] p-3 space-y-1.5 text-xs border border-[#DFE8E1]">
                    <p className="text-[#687A70]">
                      Assigned Personnel:{' '}
                      <strong className="text-[#263A32]">{task.assignedWorkerName}</strong>
                    </p>
                    <p className="text-[#687A70]">
                      Department: <span className="text-[#237A57]">{task.departmentName}</span>
                    </p>
                    <p className="text-[#687A70] flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-600" /> Deadline:{' '}
                      <span className="text-amber-700 font-mono font-medium">
                        {new Date(task.deadline).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {/* Progress notes if any */}
                  {task.progressNotes && task.progressNotes.length > 0 && (
                    <div className="text-[11px] text-[#687A70] bg-[#E7F2EC] p-2 rounded-lg border border-[#DFE8E1]">
                      <span className="text-[#123D32] font-semibold">Latest Field Log:</span>
                      <p className="text-[#263A32] italic mt-0.5">
                        "{task.progressNotes[task.progressNotes.length - 1].note}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#DFE8E1] flex items-center justify-between">
                  {task.evidence ? (
                    <button
                      onClick={() => setInspectTask(task)}
                      className="w-full rounded-xl bg-[#E7F2EC] text-[#123D32] border border-[#DFE8E1] py-2 text-xs font-bold hover:bg-[#237A57] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Inspect Submitted Evidence</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#687A70] italic">
                      Awaiting on-site field proof
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: WORKER MANAGEMENT ================= */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#687A70]">
              Municipal field technician personnel roster across Greater Hyderabad departments
            </p>
            <button
              onClick={() => setAddWorkerModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              <UserPlus className="h-4 w-4" /> Add Field Worker
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldWorkers.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl border border-[#DFE8E1] bg-white p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatarUrl}
                      alt={w.name}
                      className="h-12 w-12 rounded-xl object-cover border border-[#237A57]"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#263A32]">{w.name}</h3>
                      <p className="text-xs text-[#237A57] font-medium">{w.departmentName}</p>
                      <span className="text-[10px] text-[#687A70]">{w.jurisdictionWard}</span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      w.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {w.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#687A70]">
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-[#237A57]" /> {w.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-[#237A57]" /> {w.email}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#687A70]">Specializations:</span>
                  <div className="flex flex-wrap gap-1">
                    {w.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-[#F4F7F5] border border-[#DFE8E1] px-2 py-0.5 text-[10px] font-medium text-[#263A32]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Workload Stats */}
                <div className="grid grid-cols-3 gap-2 border-t border-[#DFE8E1] pt-3 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#687A70] uppercase">Active</span>
                    <p className="font-bold text-[#263A32]">{w.activeTaskCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#687A70] uppercase">Completed</span>
                    <p className="font-bold text-[#237A57]">{w.completedTaskCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#687A70] uppercase">Rating</span>
                    <p className="font-bold text-amber-600">⭐ {w.rating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ASSIGN WORK MODAL ================= */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-[#DFE8E1] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#263A32]">
            <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#237A57]">
                  {assignModalComplaint.id}
                </span>
                <h3 className="text-base font-bold text-[#123D32]">
                  Assign Field Personnel & Dispatch Task
                </h3>
              </div>
              <button
                onClick={() => setAssignModalComplaint(null)}
                className="text-[#687A70] hover:text-[#263A32]"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-4 space-y-2 text-xs">
              <h4 className="font-bold text-[#123D32]">{assignModalComplaint.title}</h4>
              <p className="text-[#687A70] leading-relaxed">{assignModalComplaint.description}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#687A70]">
                <span>Location: <strong className="text-[#263A32]">{assignModalComplaint.location.address}</strong></span>
                <span>AI Priority: <strong className="text-amber-600">{assignModalComplaint.aiAnalysis.priorityScore}/100</strong></span>
                <span>Dept: <strong className="text-[#237A57]">{assignModalComplaint.assignedDepartmentName}</strong></span>
              </div>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#123D32]">Select Field Personnel *</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                  {fieldWorkers.map((worker) => {
                    const isSelected = selectedWorkerId === worker.id;
                    const matchesDept = worker.departmentId === assignModalComplaint.assignedDepartmentId;

                    return (
                      <div
                        key={worker.id}
                        onClick={() => setSelectedWorkerId(worker.id)}
                        className={`rounded-xl border p-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#237A57] bg-[#E7F2EC] ring-1 ring-[#237A57]'
                            : 'border-[#DFE8E1] bg-[#F4F7F5] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#263A32]">{worker.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              worker.status === 'available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {worker.activeTaskCount} Active Tasks
                          </span>
                        </div>
                        <p className="text-[11px] text-[#237A57] mt-0.5">{worker.departmentName}</p>
                        <p className="text-[10px] text-[#687A70]">{worker.jurisdictionWard}</p>
                        {matchesDept && (
                          <span className="mt-1.5 inline-block text-[10px] font-semibold text-[#237A57]">
                            ✓ Primary Dept Match
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#123D32]">Resolution Deadline (Hours) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={72}
                    value={deadlineHours}
                    onChange={(e) => setDeadlineHours(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-[#687A70]">
                    AI Recommended Target: {assignModalComplaint.aiAnalysis.slaTargetHours}h
                  </p>
                </div>

                <div>
                  <label className="font-bold text-[#123D32]">Specialized Field Squad Priority</label>
                  <input
                    type="text"
                    disabled
                    value={`${assignModalComplaint.aiAnalysis.priorityCategory} (Score: ${assignModalComplaint.aiAnalysis.priorityScore})`}
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-amber-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#123D32]">Admin Directives & Field Instructions *</label>
                <textarea
                  required
                  rows={3}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  placeholder="Provide precise equipment directives, safety precautions, and required remediation steps..."
                  className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFE8E1]">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="rounded-xl border border-[#DFE8E1] px-4 py-2 text-[#687A70] hover:text-[#263A32]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-5 py-2 font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Confirm Assignment & Generate Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= INSPECT EVIDENCE MODAL ================= */}
      {inspectTask && inspectTask.evidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl border border-[#DFE8E1] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#263A32]">
            <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#237A57]">{inspectTask.id}</span>
                <h3 className="text-base font-bold text-[#123D32]">
                  Inspect Field Remediation Proof
                </h3>
              </div>
              <button
                onClick={() => setInspectTask(null)}
                className="text-[#687A70] hover:text-[#263A32]"
              >
                ✕
              </button>
            </div>

            {/* Task summary */}
            <div className="rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3.5 space-y-1 text-xs">
              <p className="font-bold text-[#123D32]">{inspectTask.complaintTitle}</p>
              <p className="text-[#687A70]">
                Completed by: <strong className="text-[#237A57]">{inspectTask.assignedWorkerName}</strong> •{' '}
                Submitted at: {new Date(inspectTask.evidence.submittedAt).toLocaleString()}
              </p>
              <p className="text-[#263A32] bg-white p-2 rounded border border-[#DFE8E1] mt-1">
                "{inspectTask.evidence.description}"
              </p>
            </div>

            {/* Side by side Before and After evidence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-[#687A70] block mb-1">
                  Before Work / Citizen Evidence:
                </span>
                {inspectTask.evidence.beforeImageUrls && inspectTask.evidence.beforeImageUrls.length > 0 ? (
                  <img
                    src={inspectTask.evidence.beforeImageUrls[0]}
                    alt="Before"
                    className="h-48 w-full rounded-xl object-cover border border-[#DFE8E1]"
                  />
                ) : (
                  <div className="h-48 rounded-xl bg-[#F4F7F5] flex items-center justify-center text-xs text-[#687A70]">
                    No initial photo
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-[#237A57] block mb-1">
                  After Work / Field Technician Proof:
                </span>
                <img
                  src={inspectTask.evidence.afterImageUrls[0]}
                  alt="After"
                  className="h-48 w-full rounded-xl object-cover border border-[#237A57]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F4F7F5] p-3 rounded-xl border border-[#DFE8E1]">
              <div>
                <span className="text-[#687A70]">Materials Used:</span>
                <p className="font-bold text-[#263A32]">
                  {inspectTask.evidence.materialsUsed?.join(', ') || 'Hot-Mix Bitumen, Stone Aggregates'}
                </p>
              </div>
              <div>
                <span className="text-[#687A70]">Expenses Incurred:</span>
                <p className="font-bold text-[#123D32] font-mono">
                  ₹{inspectTask.evidence.expensesINR || 14500} INR
                </p>
              </div>
            </div>

            {/* Admin Decision Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#DFE8E1]">
              <button
                type="button"
                onClick={() => setReworkModalOpen(true)}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reject & Request Rework</span>
              </button>

              <button
                type="button"
                onClick={() => handleApproveWork(inspectTask)}
                className="rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve Work & Route to Citizen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REWORK REQUEST MODAL ================= */}
      {reworkModalOpen && inspectTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl space-y-4 text-[#263A32]">
            <h3 className="text-base font-bold text-[#123D32]">Request Field Rework</h3>
            <p className="text-xs text-[#687A70]">
              Explain required corrections for field technician {inspectTask.assignedWorkerName}.
            </p>

            <form onSubmit={handleRequestRework} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#123D32]">Reason for Rework *</label>
                <input
                  type="text"
                  required
                  value={reworkReason}
                  onChange={(e) => setReworkReason(e.target.value)}
                  placeholder="e.g. Surface patch uneven, debris left on sidewalk"
                  className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#123D32]">Required Corrections *</label>
                <textarea
                  required
                  rows={3}
                  value={reworkCorrections}
                  onChange={(e) => setReworkCorrections(e.target.value)}
                  placeholder="Detail exact remediation adjustments and re-photograph requirements..."
                  className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-red-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReworkModalOpen(false)}
                  className="rounded-xl border border-[#DFE8E1] px-3 py-1.5 text-[#687A70] hover:text-[#263A32]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-1.5 font-bold text-white shadow-xs hover:bg-red-700"
                >
                  Send Rework Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD WORKER MODAL ================= */}
      {addWorkerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#DFE8E1] bg-white p-6 shadow-2xl space-y-4 text-[#263A32]">
            <h3 className="text-base font-bold text-[#123D32]">Add Field Personnel Account</h3>
            <form onSubmit={handleCreateWorker} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#123D32]">Technician Name *</label>
                <input
                  type="text"
                  required
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#123D32]">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={newWorkerPhone}
                    onChange={(e) => setNewWorkerPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#123D32]">Official Email</label>
                  <input
                    type="email"
                    value={newWorkerEmail}
                    onChange={(e) => setNewWorkerEmail(e.target.value)}
                    placeholder="worker@field.civicsense.gov.in"
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#123D32]">Department *</label>
                  <select
                    value={newWorkerDeptId}
                    onChange={(e) => setNewWorkerDeptId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.shortCode}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#123D32]">Jurisdiction Ward</label>
                  <input
                    type="text"
                    value={newWorkerWard}
                    onChange={(e) => setNewWorkerWard(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#123D32]">Specialized Skills (comma separated)</label>
                <input
                  type="text"
                  value={newWorkerSkills}
                  onChange={(e) => setNewWorkerSkills(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-2 text-[#263A32] focus:border-[#237A57] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DFE8E1]">
                <button
                  type="button"
                  onClick={() => setAddWorkerModalOpen(false)}
                  className="rounded-xl border border-[#DFE8E1] px-3 py-1.5 text-[#687A70] hover:text-[#263A32]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-4 py-1.5 font-bold text-white shadow-xs"
                >
                  Create Personnel Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
