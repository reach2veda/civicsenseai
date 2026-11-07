import React, { useState } from 'react';
import {
  User,
  FieldWorker,
  WorkerTask,
  Complaint,
  TaskEvidence
} from '../../types';
import { StorageService } from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { InteractiveCivicMap } from '../../components/map/InteractiveCivicMap';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Send,
  Camera,
  FileText,
  RotateCcw,
  Check,
  ExternalLink,
  Phone,
  Navigation,
  Sparkles,
  Image,
  ShieldAlert
} from 'lucide-react';

interface FieldWorkerDashboardProps {
  currentUser: User;
  complaints: Complaint[];
  workerTasks: WorkerTask[];
  fieldWorkers: FieldWorker[];
  onRefreshData: () => void;
  onOpenComplaint?: (id: string) => void;
}

export const FieldWorkerDashboard: React.FC<FieldWorkerDashboardProps> = ({
  currentUser,
  complaints,
  workerTasks,
  fieldWorkers,
  onRefreshData,
  onOpenComplaint
}) => {
  // Current active worker profile (match current user or fallback to Suresh Kumar)
  const currentWorker =
    fieldWorkers.find(
      (w) => w.email.toLowerCase() === currentUser.email.toLowerCase() || w.id === currentUser.id
    ) ||
    fieldWorkers[0] || {
      id: 'worker-suresh-1',
      name: currentUser.name || 'Suresh Kumar',
      email: currentUser.email || 'suresh.kumar@ghmc.gov.in',
      phone: '+91 98490 12345',
      departmentId: 'dept-roads',
      departmentName: 'Roads & Infrastructure',
      jurisdictionWard: 'Serilingampally Zone (Ward 104)',
      skills: ['Senior Asphalt Paving Specialist', 'Bitumen Sealing'],
      activeTaskCount: 2,
      completedTaskCount: 42,
      rating: 4.8,
      status: 'available' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      joinedDate: '2025-01-10'
    };

  // Filter tasks belonging to this worker
  const myTasks = workerTasks.filter(
    (t) => t.assignedWorkerId === currentWorker.id || t.assignedWorkerName === currentWorker.name
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string>(myTasks[0]?.id || '');
  const [filterTab, setFilterTab] = useState<'all' | 'todo' | 'in_progress' | 'rework' | 'done'>('all');
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  // Modals state
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Evidence Form State
  const [evidenceBeforeUrl, setEvidenceBeforeUrl] = useState(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800'
  );
  const [evidenceAfterUrl, setEvidenceAfterUrl] = useState(
    'https://images.unsplash.com/photo-1584463699042-4545ca87c2bf?w=800'
  );
  const [workDescription, setWorkDescription] = useState(
    'Applied high-performance cold bituminous mix, roller compacted and sealed margins with bitumen emulsion. Site cleaned and reopened to traffic.'
  );
  const [materialsUsed, setMaterialsUsed] = useState('Cold mix asphalt (60kg), CRS-2 emulsion (15L), warning cones');
  const [expenses, setExpenses] = useState<number>(4200);

  // Progress Note Form State
  const [newNote, setNewNote] = useState('');

  // Selected Task
  const selectedTask = myTasks.find((t) => t.id === selectedTaskId) || myTasks[0];
  const linkedComplaint = complaints.find((c) => c.id === selectedTask?.complaintId);

  // KPI Calculations
  const notAcceptedCount = myTasks.filter((t) => t.status === 'not_accepted').length;
  const acceptedCount = myTasks.filter((t) => t.status === 'accepted').length;
  const inProgressCount = myTasks.filter((t) => t.status === 'in_progress').length;
  const reworkCount = myTasks.filter((t) => t.status === 'rework_requested').length;
  const awaitingReviewCount = myTasks.filter((t) => t.status === 'submitted_for_verification').length;
  const completedCount = myTasks.filter(
    (t) => t.status === 'approved_by_admin' || t.status === 'completed'
  ).length;

  // Filtered Task List
  const filteredTasks = myTasks.filter((task) => {
    if (filterTab === 'todo') return task.status === 'not_accepted' || task.status === 'accepted';
    if (filterTab === 'in_progress') return task.status === 'in_progress';
    if (filterTab === 'rework') return task.status === 'rework_requested';
    if (filterTab === 'done')
      return (
        task.status === 'submitted_for_verification' ||
        task.status === 'approved_by_admin' ||
        task.status === 'completed'
      );
    return true;
  });

  // Action Handlers
  const handleAcceptTask = (taskId: string) => {
    StorageService.workerAcceptTask(taskId);
    onRefreshData();
  };

  const handleStartTask = (taskId: string) => {
    StorageService.workerStartTask(taskId);
    onRefreshData();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedTask) return;
    StorageService.workerAddProgressNote(selectedTask.id, newNote.trim(), currentWorker.name);
    setNewNote('');
    setIsNoteModalOpen(false);
    onRefreshData();
  };

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    const evidence: TaskEvidence = {
      beforeImageUrls: [evidenceBeforeUrl],
      afterImageUrls: [evidenceAfterUrl],
      description: workDescription,
      materialsUsed: materialsUsed ? materialsUsed.split(',').map((s) => s.trim()) : [],
      submittedAt: new Date().toISOString(),
      expensesINR: expenses
    };

    StorageService.workerSubmitEvidence(selectedTask.id, evidence);
    setIsEvidenceModalOpen(false);
    onRefreshData();
  };

  return (
    <div className="space-y-6 text-[#263A32] font-sans">
      {/* ================= 1. FIELD WORKER HEADER CARD ================= */}
      <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#123D32] to-[#237A57] text-white font-black text-xl shadow-md">
                <Wrench className="h-7 w-7 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#237A57] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#237A57] border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-[#123D32]">
                  {currentWorker.name}
                </h1>
                <span className="rounded-full bg-[#E7F2EC] border border-[#DFE8E1] px-2.5 py-0.5 text-[11px] font-extrabold text-[#123D32]">
                  Field Personnel
                </span>
              </div>
              <p className="text-xs text-[#687A70] flex items-center gap-2 mt-0.5">
                <span>{currentWorker.skills?.[0] || 'Technical Specialist'}</span>
                <span>•</span>
                <span className="text-[#237A57] font-semibold">{currentWorker.jurisdictionWard}</span>
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-[#687A70]">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#237A57]" /> {currentWorker.phone}
                </span>
                <span>•</span>
                <span className="text-amber-600 font-semibold">★ {currentWorker.rating} Rating</span>
                <span>•</span>
                <span className="text-[#237A57] font-semibold">
                  {currentWorker.completedTaskCount} Remediations
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                isMapExpanded
                  ? 'border-[#237A57] bg-[#E7F2EC] text-[#123D32]'
                  : 'border-[#DFE8E1] bg-white hover:bg-[#F4F7F5] text-[#263A32]'
              }`}
            >
              <Navigation className="h-3.5 w-3.5 text-[#237A57]" />
              <span>{isMapExpanded ? 'Hide Map' : 'Task Route Map'}</span>
            </button>

            <a
              href="tel:100"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-red-500" />
              <span className="hidden sm:inline">Emergency Dispatch</span>
            </a>
          </div>
        </div>

        {/* Route Map Preview Toggle */}
        {isMapExpanded && (
          <div className="mt-5 pt-4 border-t border-[#DFE8E1] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#687A70]">
              <span className="font-semibold text-[#123D32] flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#237A57]" /> Active Field Assignment Route
              </span>
              <span>Showing {myTasks.length} geo-tagged work orders in your jurisdiction</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#DFE8E1]">
              <InteractiveCivicMap complaints={complaints} height="320px" />
            </div>
          </div>
        )}
      </div>

      {/* ================= 2. DASHBOARD SUMMARY STATS (6 KPIs) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="New Directives"
          value={notAcceptedCount}
          subtitle="Pending acceptance"
          icon={Clock}
          iconColor={notAcceptedCount > 0 ? 'text-amber-600' : 'text-[#237A57]'}
        />
        <StatCard
          title="Accepted Tasks"
          value={acceptedCount}
          subtitle="Ready to commence"
          icon={Wrench}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Work In Progress"
          value={inProgressCount}
          subtitle="Active on field"
          icon={Clock}
          iconColor="text-[#237A57]"
        />
        <StatCard
          title="Rework Demanded"
          value={reworkCount}
          subtitle="Requires correction"
          icon={AlertTriangle}
          iconColor={reworkCount > 0 ? 'text-red-600' : 'text-[#237A57]'}
        />
        <StatCard
          title="Under Review"
          value={awaitingReviewCount}
          subtitle="Evidence submitted"
          icon={FileText}
          iconColor="text-amber-600"
        />
        <StatCard
          title="Completed Work"
          value={completedCount}
          subtitle="Verified & signed off"
          icon={CheckCircle2}
          iconColor="text-[#237A57]"
        />
      </div>

      {/* ================= 3. SPLIT WORKSPACE: TASK LIST & TASK DETAILS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Task List / Queue (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between rounded-xl border border-[#DFE8E1] bg-white p-1.5 shadow-2xs">
            {[
              { id: 'all', label: 'All', count: myTasks.length },
              { id: 'todo', label: 'To-Do', count: notAcceptedCount + acceptedCount },
              { id: 'in_progress', label: 'Active', count: inProgressCount },
              { id: 'rework', label: 'Rework', count: reworkCount },
              { id: 'done', label: 'Done', count: awaitingReviewCount + completedCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  filterTab === tab.id
                    ? 'bg-[#237A57] text-white shadow-2xs'
                    : 'text-[#687A70] hover:text-[#123D32] hover:bg-[#E7F2EC]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    filterTab === tab.id
                      ? 'bg-black/20 text-white'
                      : 'bg-[#F4F7F5] text-[#687A70]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Task Cards Container */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-[#DFE8E1] bg-white p-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-[#237A57] mx-auto opacity-60" />
                <p className="text-sm font-bold text-[#123D32]">No tasks in this category</p>
                <p className="text-xs text-[#687A70]">
                  You are all caught up! Switch tabs or wait for new work assignments.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                const isRework = task.status === 'rework_requested';

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-[#237A57] bg-[#E7F2EC]/40 shadow-xs ring-1 ring-[#237A57]/30'
                        : 'border-[#DFE8E1] bg-white hover:bg-[#F4F7F5] hover:border-[#DFE8E1]'
                    } ${isRework ? 'ring-1 ring-amber-500/50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-[#237A57]">
                            {task.id}
                          </span>
                          <span className="text-[#A7C2B4]">•</span>
                          <span className="text-[10px] text-[#687A70] font-mono">
                            {task.complaintId}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#263A32] line-clamp-1">
                          {task.complaintTitle}
                        </h3>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>

                    {/* Urgent Alert Banner on Rework */}
                    {isRework && task.rework && (
                      <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                        <span className="truncate">Rework: {task.rework.reason}</span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-[#687A70] border-t border-[#DFE8E1] pt-2.5">
                      <span className="flex items-center gap-1 text-[11px] truncate max-w-[200px]">
                        <MapPin className="h-3 w-3 text-[#237A57] flex-shrink-0" />
                        {task.location.address}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Task Detailed Operations Panel (7 Cols on LG) */}
        <div className="lg:col-span-7">
          {selectedTask ? (
            <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 sm:p-6 space-y-6 shadow-xs">
              {/* Task Header & Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DFE8E1] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#237A57] bg-[#E7F2EC] px-2 py-0.5 rounded border border-[#DFE8E1]">
                      {selectedTask.id}
                    </span>
                    <span className="text-xs text-[#687A70] font-mono">
                      Ref: {selectedTask.complaintId}
                    </span>
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-200 uppercase">
                      Priority {selectedTask.priorityScore}
                    </span>
                  </div>
                  <h2 className="mt-1 text-lg font-black tracking-tight text-[#123D32]">
                    {selectedTask.complaintTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedTask.status} />
                  {onOpenComplaint && (
                    <button
                      onClick={() => onOpenComplaint(selectedTask.complaintId)}
                      className="p-1.5 rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] text-[#687A70] hover:text-[#237A57] transition-colors"
                      title="Inspect Full Complaint Dossier"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* REWORK REQUEST ALERT BANNER (If Applicable) */}
              {selectedTask.status === 'rework_requested' && selectedTask.rework && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800">
                      <ShieldAlert className="h-4 w-4 text-amber-600" /> Rework Required by Work
                      Coordinator
                    </span>
                    <span className="text-[11px] text-amber-700">
                      Requested by {selectedTask.rework.adminName}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium bg-white p-2.5 rounded-lg border border-amber-200">
                    "{selectedTask.rework.requiredCorrections}"
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setIsEvidenceModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-1.5 text-xs font-black text-white shadow-xs transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Upload Corrected Evidence</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Location & Navigation Card */}
              <div className="rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#687A70] flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#237A57]" /> Geographic Work Site
                    </p>
                    <p className="text-xs font-bold text-[#263A32]">{selectedTask.location.address}</p>
                    {selectedTask.location.landmark && (
                      <p className="text-[11px] text-[#687A70]">
                        Landmark: <span className="text-[#237A57]">{selectedTask.location.landmark}</span>
                      </p>
                    )}
                  </div>

                  {/* Direct Google Maps Navigation Button */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedTask.location.lat},${selectedTask.location.lng}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-white hover:bg-[#E7F2EC] px-3 py-2 text-xs font-bold text-[#123D32] transition-all shadow-2xs flex-shrink-0"
                  >
                    <Navigation className="h-3.5 w-3.5 text-[#237A57]" />
                    <span>Navigate (GPS)</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] border-t border-[#DFE8E1] pt-2 text-[#687A70]">
                  <div>
                    <span>Zone / Ward:</span>{' '}
                    <span className="text-[#263A32] font-semibold">
                      {selectedTask.location.wardNumber || selectedTask.location.zone || 'Serilingampally Zone'}
                    </span>
                  </div>
                  <div>
                    <span>Target SLA:</span>{' '}
                    <span className="text-amber-700 font-semibold">
                      {new Date(selectedTask.deadline).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span>Assigned On:</span>{' '}
                    <span className="text-[#263A32]">
                      {new Date(selectedTask.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complaint Dossier & Citizen Evidence */}
              <div className="rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#123D32] flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-[#237A57]" /> Citizen Complaint & AI Findings
                  </p>
                  {linkedComplaint && (
                    <SeverityBadge severity={linkedComplaint.aiAnalysis.severity} />
                  )}
                </div>

                {linkedComplaint ? (
                  <div className="space-y-3">
                    <p className="text-xs text-[#263A32] leading-relaxed bg-white p-3 rounded-lg border border-[#DFE8E1]">
                      "{linkedComplaint.description}"
                    </p>

                    {/* Uploaded Citizen Photo Preview */}
                    {linkedComplaint.mediaUrls && linkedComplaint.mediaUrls.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-[#687A70] mb-1.5 flex items-center gap-1">
                          <Image className="h-3 w-3 text-[#237A57]" /> Citizen Photo Evidence
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {linkedComplaint.mediaUrls.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="group relative block h-20 w-28 rounded-lg overflow-hidden border border-[#DFE8E1] flex-shrink-0"
                            >
                              <img
                                src={url}
                                alt="Citizen Evidence"
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ExternalLink className="h-4 w-4 text-white" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#687A70]">
                    Citizen grievance details linked via reference {selectedTask.complaintId}.
                  </p>
                )}
              </div>

              {/* Coordinator Directives */}
              <div className="rounded-xl border border-[#DFE8E1] bg-[#E7F2EC] p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#123D32] flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#237A57]" /> Coordinator Special Instructions
                </p>
                <p className="text-xs text-[#263A32] font-medium bg-white p-3 rounded-lg border border-[#DFE8E1]">
                  {selectedTask.instructions || 'Standard remediation protocol per municipal manual.'}
                </p>
              </div>

              {/* Submitted Remediation Evidence (If already submitted) */}
              {selectedTask.evidence && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#123D32] flex items-center gap-1.5">
                      <Camera className="h-4 w-4 text-[#237A57]" /> Submitted Work Completion Evidence
                    </p>
                    <span className="text-[10px] font-mono text-[#687A70]">
                      {new Date(selectedTask.evidence.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#687A70] mb-1">BEFORE WORK</p>
                      <div className="h-28 rounded-lg overflow-hidden border border-[#DFE8E1]">
                        <img
                          src={selectedTask.evidence.beforeImageUrls[0]}
                          alt="Before"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#237A57] mb-1">AFTER WORK (REMEDIED)</p>
                      <div className="h-28 rounded-lg overflow-hidden border border-[#237A57]">
                        <img
                          src={selectedTask.evidence.afterImageUrls[0]}
                          alt="After"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#263A32]">
                    <span className="font-bold text-[#123D32]">Summary:</span>{' '}
                    {selectedTask.evidence.description}
                  </p>
                  {selectedTask.evidence.materialsUsed && (
                    <p className="text-xs text-[#263A32]">
                      <span className="font-bold text-[#123D32]">Materials:</span>{' '}
                      {selectedTask.evidence.materialsUsed.join(', ')}
                    </p>
                  )}
                  {selectedTask.evidence.expensesINR !== undefined && (
                    <p className="text-xs text-[#123D32] font-bold">
                      Expenses: ₹{selectedTask.evidence.expensesINR.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Progress Log / Field Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#123D32] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#237A57]" /> Field Activity Timeline
                  </p>
                  <button
                    onClick={() => setIsNoteModalOpen(true)}
                    className="text-xs font-bold text-[#237A57] hover:underline flex items-center gap-1"
                  >
                    + Add Field Note
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedTask.progressNotes && selectedTask.progressNotes.length > 0 ? (
                    selectedTask.progressNotes.map((pn, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="font-medium">{pn.note}</p>
                          <p className="text-[10px] text-[#687A70] mt-0.5">By {pn.author}</p>
                        </div>
                        <span className="text-[10px] text-[#A7C2B4] font-mono flex-shrink-0">
                          {new Date(pn.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#687A70] italic">No field notes logged yet.</p>
                  )}
                </div>
              </div>

              {/* DYNAMIC ACTION BAR BASED ON TASK STATUS */}
              <div className="border-t border-[#DFE8E1] pt-4">
                {/* 1. NOT ACCEPTED */}
                {selectedTask.status === 'not_accepted' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#E7F2EC] border border-[#DFE8E1] p-3.5 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-[#123D32]">Assignment Pending Acceptance</p>
                      <p className="text-[11px] text-[#687A70]">
                        Confirm receipt of work directive and initiate route dispatch.
                      </p>
                    </div>
                    <button
                      onClick={() => handleAcceptTask(selectedTask.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-5 py-2.5 text-xs font-black text-white shadow-xs transition-all active:scale-95"
                    >
                      <Check className="h-4 w-4" />
                      <span>Accept Assignment</span>
                    </button>
                  </div>
                )}

                {/* 2. ACCEPTED */}
                {selectedTask.status === 'accepted' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-50 border border-blue-200 p-3.5 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-blue-900">Assignment Acknowledged</p>
                      <p className="text-[11px] text-[#687A70]">
                        Signal arrival on site and mark operation in progress.
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartTask(selectedTask.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-black text-white shadow-xs transition-all active:scale-95"
                    >
                      <Wrench className="h-4 w-4" />
                      <span>Start Work (On Site)</span>
                    </button>
                  </div>
                )}

                {/* 3. IN PROGRESS OR REWORK REQUESTED */}
                {(selectedTask.status === 'in_progress' ||
                  selectedTask.status === 'rework_requested') && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F4F7F5] p-3.5 rounded-xl border border-[#DFE8E1]">
                    <div>
                      <p className="text-xs font-bold text-[#263A32]">Active Field Operation</p>
                      <p className="text-[11px] text-[#687A70]">
                        Log progress notes or submit before/after photo evidence upon completion.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setIsNoteModalOpen(true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-white hover:bg-[#F4F7F5] px-3.5 py-2 text-xs font-bold text-[#263A32] transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#237A57]" />
                        <span>Add Note</span>
                      </button>
                      <button
                        onClick={() => setIsEvidenceModalOpen(true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-black text-white shadow-xs transition-all active:scale-95"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Submit Evidence</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. SUBMITTED FOR VERIFICATION */}
                {selectedTask.status === 'submitted_for_verification' && (
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">
                          Awaiting Work Coordinator Sign-off
                        </p>
                        <p className="text-[11px] text-[#687A70]">
                          Evidence submitted. The Admin will review photos before notifying the citizen.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. APPROVED OR COMPLETED */}
                {(selectedTask.status === 'approved_by_admin' ||
                  selectedTask.status === 'completed') && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#237A57] flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#123D32]">
                          Remediation Formally Approved
                        </p>
                        <p className="text-[11px] text-[#687A70]">
                          Verified by Work Coordinator and archived into municipal audit log.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#DFE8E1] bg-white p-12 text-center text-[#687A70]">
              Select an assignment from the list to view instructions and submit field evidence.
            </div>
          )}
        </div>
      </div>

      {/* ================= 4. MODAL: SUBMIT EVIDENCE & COMPLETION ================= */}
      {isEvidenceModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#DFE8E1] bg-white p-6 shadow-2xl space-y-5 my-8 text-[#263A32]">
            <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
              <div>
                <h3 className="text-base font-black text-[#123D32] flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#237A57]" /> Submit Work Completion Evidence
                </h3>
                <p className="text-xs text-[#687A70]">
                  Task: {selectedTask.id} • {selectedTask.complaintTitle}
                </p>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="text-[#687A70] hover:text-[#263A32] p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              {/* Photo Evidence Side-by-Side with Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Photo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#263A32] flex items-center justify-between">
                    <span>1. Before Photograph</span>
                    <span className="text-[10px] text-[#687A70]">Site condition before work</span>
                  </label>
                  <div className="h-32 rounded-xl overflow-hidden border border-[#DFE8E1] bg-[#F4F7F5]">
                    <img
                      src={evidenceBeforeUrl}
                      alt="Before Work Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={evidenceBeforeUrl}
                    onChange={(e) => setEvidenceBeforeUrl(e.target.value)}
                    placeholder="Before image URL..."
                    className="w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] px-3 py-1.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
                    required
                  />
                  {/* Preset quick buttons */}
                  <div className="flex gap-1">
                    {[
                      {
                        label: 'Pothole',
                        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800'
                      },
                      {
                        label: 'Garbage',
                        url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800'
                      },
                      {
                        label: 'Leak',
                        url: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800'
                      }
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => setEvidenceBeforeUrl(p.url)}
                        className="rounded px-2 py-0.5 text-[10px] font-semibold bg-[#F4F7F5] text-[#263A32] hover:text-[#237A57] border border-[#DFE8E1]"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* After Photo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#263A32] flex items-center justify-between">
                    <span className="text-[#237A57]">2. After Remediation Photograph *</span>
                    <span className="text-[10px] text-[#237A57] font-semibold">Proof of work</span>
                  </label>
                  <div className="h-32 rounded-xl overflow-hidden border border-[#237A57] bg-[#F4F7F5]">
                    <img
                      src={evidenceAfterUrl}
                      alt="After Work Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={evidenceAfterUrl}
                    onChange={(e) => setEvidenceAfterUrl(e.target.value)}
                    placeholder="After image URL..."
                    className="w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] px-3 py-1.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
                    required
                  />
                  {/* Preset quick buttons */}
                  <div className="flex gap-1">
                    {[
                      {
                        label: 'Fresh Asphalt',
                        url: 'https://images.unsplash.com/photo-1584463699042-4545ca87c2bf?w=800'
                      },
                      {
                        label: 'Clean Road',
                        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800'
                      },
                      {
                        label: 'Fixed Pipe',
                        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
                      }
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => setEvidenceAfterUrl(p.url)}
                        className="rounded px-2 py-0.5 text-[10px] font-semibold bg-[#F4F7F5] text-[#263A32] hover:text-[#237A57] border border-[#DFE8E1]"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work Description */}
              <div>
                <label className="text-xs font-bold text-[#263A32]">Remediation Work Description *</label>
                <textarea
                  required
                  rows={3}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Detail the technical remediation steps executed on site..."
                  className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
                />
              </div>

              {/* Materials & Expenses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#263A32]">Materials / Equipment Used</label>
                  <input
                    type="text"
                    value={materialsUsed}
                    onChange={(e) => setMaterialsUsed(e.target.value)}
                    placeholder="e.g. 50kg asphalt, compact roller..."
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] px-3 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#263A32]">Remediation Cost / Expenses (₹)</label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] px-3 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DFE8E1]">
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="rounded-xl border border-[#DFE8E1] bg-white px-4 py-2 text-xs font-bold text-[#687A70] hover:text-[#263A32]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-5 py-2 text-xs font-black text-white shadow-xs"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Proof for Admin Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 5. MODAL: ADD PROGRESS NOTE ================= */}
      {isNoteModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#DFE8E1] bg-white p-6 shadow-2xl space-y-4 text-[#263A32]">
            <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
              <h3 className="text-sm font-black text-[#123D32] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#237A57]" /> Add Field Progress Note
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-[#687A70] hover:text-[#263A32] p-1 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                required
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log activity, delay reason, or material arrival..."
                className="w-full rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
              />

              {/* Quick note buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Traffic barricades deployed.',
                  'Awaiting supply delivery.',
                  'Compacting surface with roller.',
                  'Debris cleared from storm drain.'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewNote(preset)}
                    className="rounded-lg bg-[#F4F7F5] border border-[#DFE8E1] px-2 py-1 text-[11px] text-[#687A70] hover:text-[#123D32] hover:border-[#237A57] transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DFE8E1]">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="rounded-xl border border-[#DFE8E1] bg-white px-4 py-1.5 text-xs font-bold text-[#687A70] hover:text-[#263A32]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#237A57] px-4 py-1.5 text-xs font-black text-white hover:bg-[#1B6346]"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
