// ==========================================
// CivicSense AI - Central Type Definitions
// ==========================================

export type DatabaseRole = 'citizen' | 'authority' | 'coordinator' | 'field_worker' | 'platform_admin';
export type UserRole = DatabaseRole | 'admin';

export type ComplaintCategory =
  | 'garbage_waste'
  | 'water_leakage'
  | 'road_potholes'
  | 'streetlight_failures'
  | 'drainage_sewage'
  | 'public_sanitation'
  | 'traffic_infrastructure'
  | 'other_civic';

export type ComplaintSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ComplaintStatus =
  | 'submitted'
  | 'ai_analyzed'
  | 'assigned'
  | 'in_progress'
  | 'awaiting_admin_review'
  | 'rework_requested'
  | 'resolved'
  | 'verified'
  | 'rejected'
  | 'reopened';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  databaseRole?: DatabaseRole;
  departmentId?: string;
  avatarUrl?: string;
  address?: string;
  ward?: string;
  verifiedStatus?: boolean;
  active: boolean;
  joinedDate: string;
}

export interface Department {
  id: string;
  name: string;
  shortCode: string;
  category: ComplaintCategory;
  headName: string;
  contactEmail: string;
  phone: string;
  zonesCovered: string[];
  activeStaffCount: number;
  averageResolutionHours: number;
  satisfactionRating: number;
  color: string;
}

export interface ComplaintLocation {
  address: string;
  landmark: string;
  area: string; // e.g. 'Gachibowli', 'Madhapur', 'Kukatpally', 'Miyapur', 'Kondapur', 'Banjara Hills'
  zone: string; // e.g. 'Serilingampally Zone', 'Cyberabad Zone', 'Khairatabad'
  wardNumber: string;
  lat: number;
  lng: number;
}

export interface PriorityBreakdown {
  publicSafetyScore: number; // 0-100
  affectedPopulationScore: number; // 0-100
  infrastructureDamageScore: number; // 0-100
  durationUrgencyScore: number; // 0-100
  locationSensitivityScore: number; // 0-100
  repeatFrequencyScore: number; // 0-100
  overallScore: number; // 0-100
  justification: string;
}

export interface DuplicateDetectionResult {
  isDuplicateLikely: boolean;
  confidenceScore: number; // 0-100
  parentComplaintId?: string;
  similarComplaintIds: string[];
  matchFactors: {
    locationProximityMeters: number;
    categoryMatch: boolean;
    textSimilarityPercentage: number;
    visualSimilarityPercentage: number;
    timeDeltaHours: number;
  };
  recommendation: 'merge_with_existing' | 'link_as_related' | 'treat_as_distinct';
}

export interface SuspiciousReportCheck {
  trustScore: number; // 0-100 (100 is fully trusted, <40 is suspicious)
  isFlagged: boolean;
  flags: string[];
  explanation: string;
  indicators: {
    rapidBurstSubmission: boolean;
    locationMetadataMismatch: boolean;
    duplicateMediaHash: boolean;
    anomalyInDescription: boolean;
  };
  reviewedByAuthority?: string;
  reviewStatus: 'pending' | 'cleared' | 'confirmed_spam';
}

export interface AIAnalysisResult {
  summary: string;
  detectedCategory: ComplaintCategory;
  detectedSubcategory: string;
  confidence: number; // 0-100
  extractedKeywords: string[];
  severity: ComplaintSeverity;
  priorityScore: number; // 0-100
  priorityCategory: 'Critical' | 'High' | 'Medium' | 'Low';
  priorityBreakdown: PriorityBreakdown;
  recommendedDepartmentId: string;
  recommendedDepartmentName: string;
  routingReasoning: string;
  suggestedActionSteps: string[];
  slaTargetHours: number;
  duplicateDetection: DuplicateDetectionResult;
  suspiciousCheck: SuspiciousReportCheck;
  analyzedAt: string;
}

export interface StatusTimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  role: 'citizen' | 'ai_system' | 'authority' | 'admin' | 'field_worker';
  evidenceUrl?: string;
  notes?: string;
}

export interface ResolutionRecord {
  resolvedAt: string;
  authorityId: string;
  authorityName: string;
  departmentId: string;
  workDescription: string;
  beforeImageUrl?: string;
  afterImageUrl: string;
  contractorName?: string;
  expensesIncurredINR?: number;
  materialsUsed?: string[];
  citizenVerification?: {
    status: 'pending' | 'verified_approved' | 'verified_rejected';
    verifiedAt?: string;
    citizenFeedback?: string;
    rating?: number; // 1-5
    rejectionReason?: string;
  };
}

export interface Complaint {
  id: string; // e.g. 'CIVIC-2026-HYD-1092'
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  submittedAt: string;
  location: ComplaintLocation;
  mediaUrls: string[];
  videoUrl?: string;
  status: ComplaintStatus;
  assignedDepartmentId: string;
  assignedDepartmentName: string;
  assignedAuthorityId?: string;
  assignedAuthorityName?: string;
  // Field worker integration
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  taskId?: string;
  deadline?: string;
  aiAnalysis: AIAnalysisResult;
  timeline: StatusTimelineEvent[];
  resolution?: ResolutionRecord;
  internalNotes?: string[];
  tags: string[];
  upvotesCount: number;
}

// ==========================================
// Field Worker & Task Management Types
// ==========================================

export type WorkerTaskStatus =
  | 'not_accepted'
  | 'accepted'
  | 'in_progress'
  | 'awaiting_evidence'
  | 'submitted_for_verification'
  | 'rework_requested'
  | 'approved_by_admin'
  | 'completed';

export interface FieldWorker {
  id: string;
  name: string;
  phone: string;
  email: string;
  departmentId: string;
  departmentName: string;
  jurisdictionWard: string;
  skills: string[];
  status: 'available' | 'busy' | 'off_duty';
  activeTaskCount: number;
  completedTaskCount: number;
  rating: number; // 1-5
  avatarUrl: string;
  joinedDate: string;
}

export interface TaskEvidence {
  beforeImageUrls: string[];
  afterImageUrls: string[];
  videoUrl?: string;
  description: string;
  submittedAt: string;
  materialsUsed?: string[];
  expensesINR?: number;
  additionalRemarks?: string;
}

export interface ReworkRequest {
  requestedAt: string;
  adminName: string;
  reason: string;
  requiredCorrections: string;
}

export interface WorkerTask {
  id: string; // e.g. 'TASK-2026-HYD-772'
  complaintId: string;
  complaintTitle: string;
  complaintCategory: ComplaintCategory;
  location: ComplaintLocation;
  priorityScore: number;
  severity: ComplaintSeverity;
  departmentId: string;
  departmentName: string;
  assigningAdminId: string;
  assigningAdminName: string;
  assignedWorkerId: string;
  assignedWorkerName: string;
  assignedAt: string;
  deadline: string;
  instructions: string;
  status: WorkerTaskStatus;
  evidence?: TaskEvidence;
  rework?: ReworkRequest;
  progressNotes?: { timestamp: string; note: string; author: string }[];
}

export interface AppNotification {
  id: string;
  userId: string;
  roleTarget: UserRole;
  title: string;
  message: string;
  complaintId?: string;
  taskId?: string;
  type: 'status_update' | 'assignment' | 'verification_request' | 'critical_alert' | 'rework' | 'system';
  read: boolean;
  createdAt: string;
}

export interface CityAnalyticsSummary {
  totalComplaints: number;
  resolvedComplaints: number;
  inProgressComplaints: number;
  pendingReviewComplaints: number;
  criticalComplaints: number;
  averageResolutionDays: number;
  citizenSatisfactionPercent: number;
  aiDuplicateCatchRate: number;
  suspiciousReportsBlocked: number;
  wardPerformance: {
    ward: string;
    total: number;
    resolved: number;
    critical: number;
  }[];
}
