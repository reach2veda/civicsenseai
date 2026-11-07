import {
  Complaint,
  Department,
  User,
  AppNotification,
  ComplaintStatus,
  ResolutionRecord,
  StatusTimelineEvent,
  UserRole,
  FieldWorker,
  WorkerTask,
  TaskEvidence,
  WorkerTaskStatus,
  ComplaintSeverity
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_DEPARTMENTS,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FIELD_WORKERS,
  INITIAL_WORKER_TASKS
} from './mockData';

const STORAGE_KEYS = {
  COMPLAINTS: 'civicsense_complaints_v2',
  DEPARTMENTS: 'civicsense_departments_v2',
  USERS: 'civicsense_users_v2',
  NOTIFICATIONS: 'civicsense_notifications_v2',
  FIELD_WORKERS: 'civicsense_field_workers_v2',
  WORKER_TASKS: 'civicsense_worker_tasks_v2',
  CURRENT_USER: 'civicsense_current_user_v2',
  CURRENT_ROLE: 'civicsense_current_role_v2',
  LANGUAGE: 'civicsense_lang_v2',
};

export class StorageService {
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;

    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FIELD_WORKERS)) {
      localStorage.setItem(STORAGE_KEYS.FIELD_WORKERS, JSON.stringify(INITIAL_FIELD_WORKERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORKER_TASKS)) {
      localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(INITIAL_WORKER_TASKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'citizen');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'en');
    }

    this.isInitialized = true;
  }

  // --- Complaints ---
  public static getComplaints(): Complaint[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return data ? JSON.parse(data) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  }

  public static getComplaintById(id: string): Complaint | undefined {
    const list = this.getComplaints();
    return list.find((c) => c.id === id);
  }

  public static saveComplaint(complaint: Complaint): void {
    const list = this.getComplaints();
    const existingIndex = list.findIndex((c) => c.id === complaint.id);
    if (existingIndex >= 0) {
      list[existingIndex] = complaint;
    } else {
      list.unshift(complaint);
    }
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));

    // Also notify coordinator/authority
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      roleTarget: 'admin',
      title: `New Grievance Registered: ${complaint.title}`,
      message: `Priority: ${complaint.aiAnalysis.priorityScore} (${complaint.aiAnalysis.priorityCategory}). Awaiting field personnel assignment.`,
      complaintId: complaint.id,
      type: complaint.aiAnalysis.severity === 'critical' ? 'critical_alert' : 'assignment',
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  public static updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    timelineEvent: StatusTimelineEvent
  ): Complaint | undefined {
    const list = this.getComplaints();
    const item = list.find((c) => c.id === id);
    if (!item) return undefined;

    item.status = newStatus;
    item.timeline.push(timelineEvent);

    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));

    // Notify citizen
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: item.citizenId,
      roleTarget: 'citizen',
      title: `Update on ${item.id}`,
      message: `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}: ${timelineEvent.description}`,
      complaintId: item.id,
      type: 'status_update',
      read: false,
      createdAt: new Date().toISOString()
    });

    return item;
  }

  public static resolveComplaint(id: string, resolution: ResolutionRecord): Complaint | undefined {
    const list = this.getComplaints();
    const item = list.find((c) => c.id === id);
    if (!item) return undefined;

    item.status = 'resolved';
    item.resolution = resolution;
    item.timeline.push({
      id: `tl-${Date.now()}`,
      status: 'resolved',
      title: 'Work Completed by Field Personnel',
      description: resolution.workDescription,
      timestamp: resolution.resolvedAt,
      performedBy: resolution.authorityName,
      role: 'authority',
      evidenceUrl: resolution.afterImageUrl
    });

    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));

    // Notify citizen for verification
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: item.citizenId,
      roleTarget: 'citizen',
      title: `Resolution Verification Requested (${item.id})`,
      message: `Field personnel have completed remediation. Please review the after-photos and approve or reject.`,
      complaintId: item.id,
      type: 'verification_request',
      read: false,
      createdAt: new Date().toISOString()
    });

    return item;
  }

  public static verifyResolution(
    id: string,
    approved: boolean,
    feedback: string,
    citizenName: string,
    rating?: number
  ): Complaint | undefined {
    const list = this.getComplaints();
    const item = list.find((c) => c.id === id);
    if (!item || !item.resolution) return undefined;

    const newStatus: ComplaintStatus = approved ? 'verified' : 'reopened';
    item.status = newStatus;
    item.resolution.citizenVerification = {
      status: approved ? 'verified_approved' : 'verified_rejected',
      verifiedAt: new Date().toISOString(),
      citizenFeedback: feedback,
      rating: rating || (approved ? 5 : 1),
      rejectionReason: approved ? undefined : feedback
    };

    item.timeline.push({
      id: `tl-${Date.now()}`,
      status: newStatus,
      title: approved ? 'Resolution Approved by Citizen' : 'Citizen Rejected Resolution (Reopened)',
      description: feedback || (approved ? 'Citizen confirmed problem was satisfactorily resolved.' : 'Citizen stated issue still persists.'),
      timestamp: new Date().toISOString(),
      performedBy: citizenName,
      role: 'citizen'
    });

    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));

    // Notify admin / coordinator
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      roleTarget: 'admin',
      title: approved ? `Citizen Verified Resolution (${item.id})` : `Resolution Rejected by Citizen (${item.id})`,
      message: feedback,
      complaintId: item.id,
      type: approved ? 'status_update' : 'critical_alert',
      read: false,
      createdAt: new Date().toISOString()
    });

    return item;
  }

  public static addInternalNote(id: string, note: string): void {
    const list = this.getComplaints();
    const item = list.find((c) => c.id === id);
    if (!item) return;

    if (!item.internalNotes) item.internalNotes = [];
    item.internalNotes.push(`[${new Date().toLocaleDateString()}] ${note}`);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));
  }

  public static reassignDepartment(id: string, departmentId: string, departmentName: string, reason?: string): void {
    const list = this.getComplaints();
    const item = list.find((c) => c.id === id);
    if (!item) return;

    item.assignedDepartmentId = departmentId;
    item.assignedDepartmentName = departmentName;
    item.timeline.push({
      id: `tl-${Date.now()}`,
      status: item.status,
      title: 'Jurisdiction Reassigned',
      description: `Reassigned to ${departmentName}. ${reason ? `Reason: ${reason}` : ''}`,
      timestamp: new Date().toISOString(),
      performedBy: 'Work Coordinator',
      role: 'admin'
    });
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));
  }

  // ==========================================
  // Field Workers & Task Assignment Workflow
  // ==========================================

  public static getFieldWorkers(): FieldWorker[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FIELD_WORKERS);
      return data ? JSON.parse(data) : INITIAL_FIELD_WORKERS;
    } catch {
      return INITIAL_FIELD_WORKERS;
    }
  }

  public static saveFieldWorker(worker: FieldWorker): void {
    const list = this.getFieldWorkers();
    const idx = list.findIndex((w) => w.id === worker.id);
    if (idx >= 0) {
      list[idx] = worker;
    } else {
      list.push(worker);
    }
    localStorage.setItem(STORAGE_KEYS.FIELD_WORKERS, JSON.stringify(list));
  }

  public static getWorkerTasks(workerId?: string): WorkerTask[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKER_TASKS);
      const list: WorkerTask[] = data ? JSON.parse(data) : INITIAL_WORKER_TASKS;
      if (workerId) {
        return list.filter((t) => t.assignedWorkerId === workerId);
      }
      return list;
    } catch {
      return INITIAL_WORKER_TASKS;
    }
  }

  public static getWorkerTaskById(id: string): WorkerTask | undefined {
    const tasks = this.getWorkerTasks();
    return tasks.find((t) => t.id === id);
  }

  public static assignComplaintToWorker(params: {
    complaintId: string;
    workerId: string;
    deadlineHours: number;
    instructions: string;
    adminId: string;
    adminName: string;
  }): { task: WorkerTask; complaint: Complaint } | undefined {
    const complaints = this.getComplaints();
    const complaint = complaints.find((c) => c.id === params.complaintId);
    if (!complaint) return undefined;

    const workers = this.getFieldWorkers();
    const worker = workers.find((w) => w.id === params.workerId);
    if (!worker) return undefined;

    const deadlineDate = new Date(Date.now() + params.deadlineHours * 3600 * 1000).toISOString();
    const taskId = `TASK-2026-HYD-${Math.floor(100 + Math.random() * 900)}`;

    const newTask: WorkerTask = {
      id: taskId,
      complaintId: complaint.id,
      complaintTitle: complaint.title,
      complaintCategory: complaint.category,
      location: complaint.location,
      priorityScore: complaint.aiAnalysis.priorityScore,
      severity: complaint.aiAnalysis.severity,
      departmentId: complaint.assignedDepartmentId,
      departmentName: complaint.assignedDepartmentName,
      assigningAdminId: params.adminId,
      assigningAdminName: params.adminName,
      assignedWorkerId: worker.id,
      assignedWorkerName: worker.name,
      assignedAt: new Date().toISOString(),
      deadline: deadlineDate,
      instructions: params.instructions,
      status: 'not_accepted',
      progressNotes: []
    };

    // Save task
    const tasks = this.getWorkerTasks();
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(tasks));

    // Update worker status and active task count
    worker.activeTaskCount += 1;
    worker.status = 'busy';
    this.saveFieldWorker(worker);

    // Update complaint
    complaint.status = 'assigned';
    complaint.assignedWorkerId = worker.id;
    complaint.assignedWorkerName = worker.name;
    complaint.taskId = taskId;
    complaint.deadline = deadlineDate;
    complaint.timeline.push({
      id: `tl-${Date.now()}`,
      status: 'assigned',
      title: `Assigned to Field Specialist: ${worker.name}`,
      description: `Task ${taskId} generated. Deadline: ${new Date(deadlineDate).toLocaleString()}. Instructions: "${params.instructions}"`,
      timestamp: new Date().toISOString(),
      performedBy: params.adminName,
      role: 'admin'
    });

    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    // Notify field worker
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: worker.id,
      roleTarget: 'field_worker',
      title: `New Assignment (${taskId})`,
      message: `Assigned to ${complaint.title}. Priority ${complaint.aiAnalysis.priorityScore}. Deadline: ${params.deadlineHours}h`,
      complaintId: complaint.id,
      taskId: taskId,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString()
    });

    return { task: newTask, complaint };
  }

  public static workerAcceptTask(taskId: string): WorkerTask | undefined {
    const tasks = this.getWorkerTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return undefined;

    task.status = 'accepted';
    if (!task.progressNotes) task.progressNotes = [];
    task.progressNotes.push({
      timestamp: new Date().toISOString(),
      note: `Task formally accepted by field personnel. Preparing tools & materials.`,
      author: task.assignedWorkerName
    });
    localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(tasks));

    // Update complaint timeline
    const complaints = this.getComplaints();
    const c = complaints.find((comp) => comp.id === task.complaintId);
    if (c) {
      c.timeline.push({
        id: `tl-${Date.now()}`,
        status: 'assigned',
        title: 'Task Accepted by Field Personnel',
        description: `${task.assignedWorkerName} acknowledged assignment and is en route.`,
        timestamp: new Date().toISOString(),
        performedBy: task.assignedWorkerName,
        role: 'field_worker'
      });
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    }

    return task;
  }

  public static workerStartTask(taskId: string): WorkerTask | undefined {
    const tasks = this.getWorkerTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return undefined;

    task.status = 'in_progress';
    if (!task.progressNotes) task.progressNotes = [];
    task.progressNotes.push({
      timestamp: new Date().toISOString(),
      note: `On-site work commenced. Safety perimeter and excavation initiated.`,
      author: task.assignedWorkerName
    });
    localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(tasks));

    // Update complaint status to in_progress
    const complaints = this.getComplaints();
    const c = complaints.find((comp) => comp.id === task.complaintId);
    if (c) {
      c.status = 'in_progress';
      c.timeline.push({
        id: `tl-${Date.now()}`,
        status: 'in_progress',
        title: 'Work In Progress on Site',
        description: `Field team active on site: ${task.location.address}.`,
        timestamp: new Date().toISOString(),
        performedBy: task.assignedWorkerName,
        role: 'field_worker'
      });
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    }

    return task;
  }

  public static workerAddProgressNote(taskId: string, note: string, author: string): void {
    const tasks = this.getWorkerTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (!task.progressNotes) task.progressNotes = [];
    task.progressNotes.push({
      timestamp: new Date().toISOString(),
      note,
      author
    });
    localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(tasks));
  }

  public static workerSubmitEvidence(taskId: string, evidence: TaskEvidence): WorkerTask | undefined {
    const tasks = this.getWorkerTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return undefined;

    task.status = 'submitted_for_verification';
    task.evidence = evidence;
    if (!task.progressNotes) task.progressNotes = [];
    task.progressNotes.push({
      timestamp: new Date().toISOString(),
      note: `Work completed. Submitted ${evidence.afterImageUrls.length} after-photographs for Admin approval.`,
      author: task.assignedWorkerName
    });
    localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(tasks));

    // Update complaint status to awaiting_admin_review
    const complaints = this.getComplaints();
    const c = complaints.find((comp) => comp.id === task.complaintId);
    if (c) {
      c.status = 'awaiting_admin_review';
      c.timeline.push({
        id: `tl-${Date.now()}`,
        status: 'awaiting_admin_review',
        title: 'Remediation Proof Submitted by Field Personnel',
        description: `Field specialist ${task.assignedWorkerName} uploaded photographic evidence. Awaiting Work Coordinator sign-off.`,
        timestamp: new Date().toISOString(),
        performedBy: task.assignedWorkerName,
        role: 'field_worker',
        evidenceUrl: evidence.afterImageUrls[0]
      });
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    }

    // Notify Admin / Work Coordinator
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      roleTarget: 'admin',
      title: `Task Awaiting Verification (${taskId})`,
      message: `${task.assignedWorkerName} submitted completion evidence for "${task.complaintTitle}". Ready for inspection.`,
      complaintId: task.complaintId,
      taskId: task.id,
      type: 'verification_request',
      read: false,
      createdAt: new Date().toISOString()
    });

    return task;
  }

  public static adminApproveTaskEvidence(taskId: string, adminName: string): WorkerTask | undefined {
    const tasks = this.getWorkerTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.evidence) return undefined;

    task.status = 'approved_by_admin';
    if (!task.progressNotes) task.progressNotes = [];
    task.progressNotes.push({
      timestamp: new Date().toISOString(),
      note: `Evidence approved by Work Coordinator ${adminName}. Transmitted to Citizen for sign-off.`,
      author: adminName
    });
    localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(tasks));

    // Decrement worker active tasks and increment completed
    const workers = this.getFieldWorkers();
    const worker = workers.find((w) => w.id === task.assignedWorkerId);
    if (worker) {
      worker.activeTaskCount = Math.max(0, worker.activeTaskCount - 1);
      worker.completedTaskCount += 1;
      worker.status = worker.activeTaskCount === 0 ? 'available' : 'busy';
      this.saveFieldWorker(worker);
    }

    // Mark complaint resolved and attach ResolutionRecord
    const resolution: ResolutionRecord = {
      resolvedAt: new Date().toISOString(),
      authorityId: task.assigningAdminId,
      authorityName: `${adminName} (Coordinator) & ${task.assignedWorkerName} (Field Specialist)`,
      departmentId: task.departmentId,
      workDescription: task.evidence.description,
      beforeImageUrl: task.evidence.beforeImageUrls[0] || undefined,
      afterImageUrl: task.evidence.afterImageUrls[0] || '',
      contractorName: `Municipal Fast-Response Squad (${task.departmentName})`,
      materialsUsed: task.evidence.materialsUsed || ['Bituminous Asphalt', 'Hydraulic Compact'],
      expensesIncurredINR: task.evidence.expensesINR || 14500,
      citizenVerification: {
        status: 'pending'
      }
    };

    this.resolveComplaint(task.complaintId, resolution);

    // Notify Field Worker
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: task.assignedWorkerId,
      roleTarget: 'field_worker',
      title: `Work Approved by Admin (${taskId})`,
      message: `Your remediation proof was approved by ${adminName}. Good job!`,
      taskId: taskId,
      type: 'status_update',
      read: false,
      createdAt: new Date().toISOString()
    });

    return task;
  }

  public static adminApproveTask(taskId: string, _adminId?: string, adminName?: string): WorkerTask | undefined {
    return this.adminApproveTaskEvidence(taskId, adminName || 'Work Coordinator');
  }

  public static adminRequestRework(
    taskId: string,
    arg1: string,
    arg2: string,
    arg3: string,
    arg4?: string
  ): WorkerTask | undefined {
    const adminName = arg4 !== undefined ? arg2 : arg1;
    const reason = arg4 !== undefined ? arg3 : arg2;
    const requiredCorrections = arg4 !== undefined ? arg4 : arg3;

    const tasks = this.getWorkerTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return undefined;

    task.status = 'rework_requested';
    task.rework = {
      requestedAt: new Date().toISOString(),
      adminName,
      reason,
      requiredCorrections
    };
    if (!task.progressNotes) task.progressNotes = [];
    task.progressNotes.push({
      timestamp: new Date().toISOString(),
      note: `Rework requested by ${adminName}: ${reason}`,
      author: adminName
    });
    localStorage.setItem(STORAGE_KEYS.WORKER_TASKS, JSON.stringify(tasks));

    // Update complaint status
    const complaints = this.getComplaints();
    const c = complaints.find((comp) => comp.id === task.complaintId);
    if (c) {
      c.status = 'rework_requested';
      c.timeline.push({
        id: `tl-${Date.now()}`,
        status: 'rework_requested',
        title: 'Rework Requested by Work Coordinator',
        description: `Reason: ${reason}. Required corrections: ${requiredCorrections}`,
        timestamp: new Date().toISOString(),
        performedBy: adminName,
        role: 'admin'
      });
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    }

    // Notify field worker
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: task.assignedWorkerId,
      roleTarget: 'field_worker',
      title: `Rework Required on Task ${taskId}`,
      message: `Admin ${adminName} requested corrections: ${reason}`,
      taskId: taskId,
      complaintId: task.complaintId,
      type: 'rework',
      read: false,
      createdAt: new Date().toISOString()
    });

    return task;
  }

  // --- Departments ---
  public static getDepartments(): Department[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      return data ? JSON.parse(data) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  }

  public static saveDepartment(dept: Department): void {
    const list = this.getDepartments();
    const idx = list.findIndex((d) => d.id === dept.id);
    if (idx >= 0) {
      list[idx] = dept;
    } else {
      list.push(dept);
    }
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(list));
  }

  // --- Users ---
  public static getUsers(): User[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  public static saveUser(user: User): void {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
  }

  public static toggleUserActive(userId: string): void {
    const list = this.getUsers();
    const user = list.find((u) => u.id === userId);
    if (user) {
      user.active = !user.active;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
    }
  }

  public static getCurrentRole(): UserRole {
    this.initialize();
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as UserRole) || 'citizen';
  }

  public static setCurrentRole(role: UserRole): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    const users = this.getUsers();
    const matchingUser = users.find((u) => u.role === role) || users[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(matchingUser));
  }

  public static getCurrentUser(): User {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  }

  public static setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, user.role);
  }

  // --- Notifications ---
  public static getNotifications(role?: UserRole): AppNotification[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const list: AppNotification[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
      if (role) {
        return list.filter((n) => n.roleTarget === role || n.roleTarget === 'admin');
      }
      return list;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public static addNotification(notif: AppNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  public static markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const n = list.find((item) => item.id === id);
    if (n) {
      n.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    }
  }

  public static markAllNotificationsRead(): void {
    const list = this.getNotifications();
    list.forEach((n) => (n.read = true));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  // --- Reset to Demo State ---
  public static resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.FIELD_WORKERS);
    localStorage.removeItem(STORAGE_KEYS.WORKER_TASKS);
    this.isInitialized = false;
    this.initialize();
  }
}
