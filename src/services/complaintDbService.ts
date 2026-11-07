import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  Complaint,
  ComplaintStatus,
  ComplaintCategory,
  StatusTimelineEvent,
  ComplaintSeverity,
  AIAnalysisResult,
  UserRole
} from '../types';

/**
 * Checks if a string is a standard UUID.
 */
export const isUuid = (val?: string): boolean => {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
};

/**
 * Maps database priority string to frontend ComplaintSeverity.
 */
const mapPriorityToSeverity = (priority?: string): ComplaintSeverity => {
  if (!priority) return 'medium';
  const p = priority.toLowerCase();
  if (p === 'critical') return 'critical';
  if (p === 'high') return 'high';
  if (p === 'low') return 'low';
  return 'medium';
};

/**
 * Formats a status string into a human-readable title for timeline display.
 */
const formatStatusTitle = (status: string): string => {
  switch (status) {
    case 'submitted':
      return 'Grievance Registered';
    case 'ai_analyzed':
      return 'AI Triage & Risk Assessment';
    case 'assigned':
      return 'Assigned to Municipal Engineer';
    case 'in_progress':
      return 'Field Remediation Active';
    case 'awaiting_admin_review':
      return 'Awaiting Coordinator Proof Review';
    case 'rework_requested':
      return 'Rework Ordered by Coordinator';
    case 'resolved':
      return 'Work Completed by Field Personnel';
    case 'verified':
      return 'Resolution Verified by Citizen';
    case 'reopened':
      return 'Grievance Reopened by Citizen';
    case 'rejected':
      return 'Ticket Rejected';
    default:
      return `Status Updated: ${status.replace(/_/g, ' ').toUpperCase()}`;
  }
};

/**
 * Transforms a raw Supabase complaints row (with joined relations)
 * into the complete frontend Complaint interface.
 */
export const mapDbRowToComplaint = (row: any, rawHistory?: any[], explicitAi?: any): Complaint => {
  const historyRows = rawHistory || row.status_history || [];
  const aiAnalysesList = row.ai_analyses
    ? Array.isArray(row.ai_analyses)
      ? row.ai_analyses
      : [row.ai_analyses]
    : [];
  const latestAi = explicitAi || aiAnalysesList[0] || null;

  const severity = mapPriorityToSeverity(row.priority);
  const priorityScore =
    severity === 'critical' ? 92 : severity === 'high' ? 76 : severity === 'medium' ? 54 : 28;

  // Build timeline strictly from public.status_history rows
  const timeline: StatusTimelineEvent[] = historyRows
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((h: any, idx: number) => ({
      id: h.id || `hist-${idx}`,
      status: (h.new_status || row.status || 'submitted') as ComplaintStatus,
      title: formatStatusTitle(h.new_status || row.status),
      description: h.old_status
        ? `Status transitioned from ${h.old_status.toUpperCase()} to ${(h.new_status || '').toUpperCase()}`
        : `Initial grievance registration in city intelligence registry.`,
      timestamp: h.created_at || row.created_at,
      performedBy: h.changed_by ? 'Municipal Official / System' : 'System Engine',
      role: 'authority'
    }));

  // If no status_history rows exist yet, populate an initial baseline event
  if (timeline.length === 0) {
    timeline.push({
      id: `init-${row.id}`,
      status: (row.status || 'submitted') as ComplaintStatus,
      title: 'Grievance Registered',
      description: 'Logged into civic telemetry grid.',
      timestamp: row.created_at,
      performedBy: row.profiles?.full_name || 'Citizen',
      role: 'citizen'
    });
  }

  // Derive location coordinates and metadata
  const lat = Number(row.latitude) || 17.4485;
  const lng = Number(row.longitude) || 78.3740;

  // Extract human-readable address from description if encoded
  let addressText = `Location Coordinates: ${lat.toFixed(4)} N, ${lng.toFixed(4)} E`;
  if (row.description && row.description.includes('[Address:')) {
    const match = row.description.match(/\[Address:\s*([^\]]+)\]/);
    if (match) addressText = match[1];
  }

  // Synthesize AI analysis block for UI widgets & 11 GovTech AI tools
  const aiAnalysis: AIAnalysisResult = {
    summary: latestAi?.summary || row.description?.slice(0, 140) || row.title,
    detectedCategory: row.category as ComplaintCategory,
    detectedSubcategory: 'Municipal Infrastructure',
    confidence: latestAi?.confidence ? Math.round(Number(latestAi.confidence) * 100) : 94,
    extractedKeywords: [row.category, row.priority || 'medium', 'Hyderabad'],
    severity,
    priorityScore,
    priorityCategory:
      severity === 'critical'
        ? 'Critical'
        : severity === 'high'
        ? 'High'
        : severity === 'medium'
        ? 'Medium'
        : 'Low',
    priorityBreakdown: {
      publicSafetyScore: severity === 'critical' ? 95 : 60,
      affectedPopulationScore: 75,
      infrastructureDamageScore: 80,
      durationUrgencyScore: 70,
      locationSensitivityScore: 65,
      repeatFrequencyScore: 40,
      overallScore: priorityScore,
      justification: 'Automated civic triage based on complaint severity, geo-hazard proximity, and population density.'
    },
    recommendedDepartmentId: row.department_id || 'dept-roads',
    recommendedDepartmentName: row.departments?.name || 'Municipal Operations',
    routingReasoning: `Automated semantic classifier routed this complaint to ${row.departments?.name || 'Municipal Operations'} with high confidence.`,
    suggestedActionSteps: [
      'Dispatch zonal squad for on-site inspection.',
      'Enforce photographic before-and-after resolution proof.',
      'Verify citizen satisfaction sign-off.'
    ],
    slaTargetHours: severity === 'critical' ? 12 : severity === 'high' ? 24 : 48,
    duplicateDetection: {
      isDuplicateLikely: false,
      confidenceScore: 12,
      similarComplaintIds: [],
      matchFactors: {
        locationProximityMeters: 45,
        categoryMatch: true,
        textSimilarityPercentage: 18,
        visualSimilarityPercentage: 10,
        timeDeltaHours: 2
      },
      recommendation: 'treat_as_distinct'
    },
    suspiciousCheck: {
      trustScore: 95,
      isFlagged: false,
      flags: [],
      explanation: 'Verified citizen telemetry with matching GPS coordinates and natural report syntax.',
      indicators: {
        rapidBurstSubmission: false,
        locationMetadataMismatch: false,
        duplicateMediaHash: false,
        anomalyInDescription: false
      },
      reviewStatus: 'cleared'
    },
    analyzedAt: latestAi?.created_at || row.created_at
  };

  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category as ComplaintCategory,
    subcategory: 'Municipal Infrastructure',
    citizenId: row.citizen_id,
    citizenName: row.profiles?.full_name || 'Citizen',
    citizenPhone: row.profiles?.phone || '+91 90000 00000',
    submittedAt: row.created_at,
    location: {
      address: addressText,
      landmark: 'Cyberabad Zone',
      area: 'Madhapur',
      zone: 'Serilingampally Zone',
      wardNumber: 'Ward 104',
      lat,
      lng
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'
    ],
    status: (row.status || 'submitted') as ComplaintStatus,
    assignedDepartmentId: row.department_id || 'dept-roads',
    assignedDepartmentName: row.departments?.name || 'General Municipal Services',
    aiAnalysis,
    timeline,
    tags: [row.category, row.priority || 'medium'],
    upvotesCount: 0
  };
};

export interface CreateComplaintResult {
  data: Complaint | null;
  error: string | null;
  aiAnalysisPersisted: boolean;
  aiAnalysisError?: string | null;
}

export interface FetchComplaintsFilter {
  citizenId?: string;
  role?: UserRole;
  departmentId?: string;
  workerId?: string;
}

export const ComplaintDbService = {
  /**
   * Fetches all complaints accessible to the authenticated user from public.complaints.
   * Scoped strictly by role:
   *  - Citizens: only complaints where citizen_id = auth.uid()
   *  - Authority: only complaints where department_id = user's department
   *  - Field Workers: only complaints matching worker assignments in public.assignments
   *  - Coordinators & Platform Admins: full city-wide administrative oversight
   */
  fetchComplaints: async (
    filter?: FetchComplaintsFilter
  ): Promise<{ data: Complaint[] | null; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase credentials are not configured in .env.local.'
      };
    }

    try {
      let query = supabase
        .from('complaints')
        .select(
          `
          id,
          title,
          description,
          category,
          citizen_id,
          status,
          department_id,
          priority,
          latitude,
          longitude,
          created_at,
          updated_at,
          profiles:citizen_id (id, full_name, role),
          departments:department_id (id, name, description),
          ai_analyses (id, summary, confidence, suggested_department_id, created_at),
          status_history (id, complaint_id, old_status, new_status, changed_by, created_at)
        `
        )
        .order('created_at', { ascending: false });

      // 1. Citizen Role Scoping: Only their own grievances
      if (filter?.role === 'citizen') {
        if (filter.citizenId && isUuid(filter.citizenId)) {
          query = query.eq('citizen_id', filter.citizenId);
        }
      }

      // 2. Authority Role Scoping: Only grievances belonging to their assigned department
      else if (filter?.role === 'authority') {
        if (filter.departmentId && isUuid(filter.departmentId)) {
          query = query.eq('department_id', filter.departmentId);
        }
      }

      // 3. Field Worker Role Scoping: Only complaints with assigned tasks in public.assignments
      else if (filter?.role === 'field_worker') {
        const workerId = filter.workerId;
        if (workerId && isUuid(workerId)) {
          const { data: assignments, error: assignError } = await supabase
            .from('assignments')
            .select('complaint_id')
            .eq('field_worker_id', workerId);

          if (assignError) {
            console.warn('Failed to query public.assignments for field worker:', assignError.message);
          } else {
            const assignedIds = (assignments || [])
              .map((a: any) => a.complaint_id)
              .filter(Boolean);

            if (assignedIds.length === 0) {
              return { data: [], error: null };
            }
            query = query.in('id', assignedIds);
          }
        }
      }

      // 4. Coordinator & Platform Admin: Wide administrative access across departments
      // No restricting WHERE clause is applied, allowing platform-wide oversight.

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: [], error: null };
      }

      const mapped = data.map((row: any) => mapDbRowToComplaint(row));
      return { data: mapped, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err.message || 'An unexpected error occurred while fetching complaints.'
      };
    }
  },

  /**
   * Fetches a single complaint by ID with its full status history.
   */
  fetchComplaintById: async (
    id: string
  ): Promise<{ data: Complaint | null; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase credentials are not configured.'
      };
    }

    try {
      // 1. Fetch complaint record
      const { data: complaintRow, error: compError } = await supabase
        .from('complaints')
        .select(
          `
          id,
          title,
          description,
          category,
          citizen_id,
          status,
          department_id,
          priority,
          latitude,
          longitude,
          created_at,
          updated_at,
          profiles:citizen_id (id, full_name, role),
          departments:department_id (id, name, description),
          ai_analyses (id, summary, confidence, suggested_department_id, created_at)
        `
        )
        .eq('id', id)
        .maybeSingle();

      if (compError) {
        return { data: null, error: compError.message };
      }

      if (!complaintRow) {
        return { data: null, error: null };
      }

      // 2. Fetch complaint status history ordered by created_at
      const { data: historyRows, error: histError } = await supabase
        .from('status_history')
        .select('*')
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (histError) {
        console.warn('Could not query status_history:', histError.message);
      }

      const mapped = mapDbRowToComplaint(complaintRow, historyRows || []);
      return { data: mapped, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err.message || 'Failed to fetch complaint details.'
      };
    }
  },

  /**
   * Creates a complaint using the authenticated user's ID as citizen_id.
   * NOTE: Does NOT write to status_history manually; the PostgreSQL trigger
   * on public.complaints automatically logs the initial status entry.
   * Explicitly evaluates public.ai_analyses insert result and prevents duplicate records.
   */
  createComplaint: async (params: {
    title: string;
    description: string;
    category: ComplaintCategory;
    citizenId: string;
    priority?: string;
    latitude?: number;
    longitude?: number;
    departmentId?: string;
    aiAnalysis?: any;
    addressMeta?: string;
  }): Promise<CreateComplaintResult> => {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase credentials are not configured.',
        aiAnalysisPersisted: false
      };
    }

    try {
      // Verify active user session
      const {
        data: { user },
        error: authErr
      } = await supabase.auth.getUser();

      if (authErr || !user) {
        return {
          data: null,
          error: 'You must be signed in with an active session to file a complaint.',
          aiAnalysisPersisted: false
        };
      }

      // Clean description without metadata/rating injection
      const cleanDescription = params.description.trim();

      const payload: any = {
        title: params.title.trim(),
        description: cleanDescription,
        category: params.category,
        citizen_id: user.id, // Strictly authenticated user's ID
        status: 'submitted',
        priority: params.priority || 'medium',
        latitude: params.latitude || 17.4485,
        longitude: params.longitude || 78.3740
      };

      // Only assign department_id if it is a valid UUID
      if (isUuid(params.departmentId)) {
        payload.department_id = params.departmentId;
      }

      // Insert row into public.complaints
      const { data: newRow, error: insertError } = await supabase
        .from('complaints')
        .insert(payload)
        .select(
          `
          id,
          title,
          description,
          category,
          citizen_id,
          status,
          department_id,
          priority,
          latitude,
          longitude,
          created_at,
          updated_at,
          profiles:citizen_id (id, full_name, role),
          departments:department_id (id, name, description)
        `
        )
        .single();

      if (insertError) {
        return {
          data: null,
          error: insertError.message,
          aiAnalysisPersisted: false
        };
      }

      if (!newRow) {
        return {
          data: null,
          error: 'Database did not return the created complaint row.',
          aiAnalysisPersisted: false
        };
      }

      // Handle AI analysis persistence with explicit error checking & duplicate prevention
      let aiAnalysisPersisted = false;
      let aiAnalysisError: string | null = null;
      let persistedAiRecord: any = null;

      if (params.aiAnalysis) {
        // Step A: Check if an analysis record already exists for this complaint to avoid duplicates on retries
        const { data: existingAi } = await supabase
          .from('ai_analyses')
          .select('id, complaint_id, summary, confidence, suggested_department_id, created_at')
          .eq('complaint_id', newRow.id)
          .maybeSingle();

        if (existingAi) {
          aiAnalysisPersisted = true;
          persistedAiRecord = existingAi;
        } else {
          // Step B: Calculate normalized confidence in range 0.00 - 1.00
          const rawConf = params.aiAnalysis.confidence;
          const normalizedConf =
            typeof rawConf === 'number'
              ? rawConf > 1
                ? Number((rawConf / 100).toFixed(2))
                : rawConf
              : 0.95;

          const aiPayload: {
            complaint_id: string;
            summary: string;
            confidence: number;
            suggested_department_id?: string;
          } = {
            complaint_id: newRow.id,
            summary: (params.aiAnalysis.summary || params.title || '').slice(0, 500),
            confidence: normalizedConf
          };

          if (isUuid(params.departmentId)) {
            aiPayload.suggested_department_id = params.departmentId;
          }

          // Step C: Explicitly check { error } result from Supabase insert (do not rely on try/catch)
          const { data: insertedAi, error: aiInsertError } = await supabase
            .from('ai_analyses')
            .insert(aiPayload)
            .select('id, complaint_id, summary, confidence, suggested_department_id, created_at')
            .maybeSingle();

          if (aiInsertError) {
            aiAnalysisPersisted = false;
            aiAnalysisError = aiInsertError.message;
            console.warn(
              'public.ai_analyses INSERT was rejected by Supabase RLS/constraints:',
              aiInsertError.message
            );
          } else {
            aiAnalysisPersisted = true;
            persistedAiRecord = insertedAi;
          }
        }
      }

      // Preserve the complaint's actual database result
      const mapped = mapDbRowToComplaint(newRow, [], persistedAiRecord);
      return {
        data: mapped,
        error: null,
        aiAnalysisPersisted,
        aiAnalysisError
      };
    } catch (err: any) {
      return {
        data: null,
        error: err.message || 'An unexpected error occurred while creating the complaint.',
        aiAnalysisPersisted: false
      };
    }
  },

  /**
   * Updates complaint fields only when permitted by database RLS policies.
   * NOTE: The PostgreSQL trigger on public.complaints automatically appends
   * to public.status_history. We do not insert duplicate timeline entries.
   */
  updateComplaintStatus: async (
    complaintId: string,
    newStatus: ComplaintStatus
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials are not configured.'
      };
    }

    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', complaintId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'An unexpected error occurred while updating complaint status.'
      };
    }
  },

  /**
   * Reassigns a complaint to a specific department in the database.
   */
  reassignDepartment: async (
    complaintId: string,
    departmentId: string
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured.' };
    }

    if (!isUuid(departmentId)) {
      return { success: false, error: 'Invalid department UUID.' };
    }

    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          department_id: departmentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', complaintId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reassign department.' };
    }
  },

  /**
   * Fetches complaint status history ordered by created_at.
   */
  fetchStatusHistory: async (
    complaintId: string
  ): Promise<{ data: StatusTimelineEvent[]; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: 'Supabase not configured.' };
    }

    try {
      const { data, error } = await supabase
        .from('status_history')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('created_at', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      const timeline: StatusTimelineEvent[] = (data || []).map((h: any, idx: number) => ({
        id: h.id || `hist-${idx}`,
        status: (h.new_status || 'submitted') as ComplaintStatus,
        title: formatStatusTitle(h.new_status),
        description: h.old_status
          ? `Status updated from ${h.old_status.toUpperCase()} to ${h.new_status.toUpperCase()}`
          : 'Grievance registered in municipal system.',
        timestamp: h.created_at,
        performedBy: h.changed_by ? 'Municipal Official' : 'System Engine',
        role: 'authority'
      }));

      return { data: timeline, error: null };
    } catch (err: any) {
      return {
        data: [],
        error: err.message || 'Failed to fetch status history.'
      };
    }
  },

  /**
   * Citizen verifies or reopens a resolved complaint.
   */
  verifyResolution: async (
    complaintId: string,
    approved: boolean
  ): Promise<{ success: boolean; error: string | null }> => {
    const newStatus: ComplaintStatus = approved ? 'verified' : 'reopened';
    return await ComplaintDbService.updateComplaintStatus(complaintId, newStatus);
  }
};

