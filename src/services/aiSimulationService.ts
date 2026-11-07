import {
  Complaint,
  ComplaintCategory,
  ComplaintSeverity,
  AIAnalysisResult,
  DuplicateDetectionResult,
  SuspiciousReportCheck,
  PriorityBreakdown,
  Department,
  UserRole
} from '../types';
import { StorageService } from './storageService';

export class AISimulationService {
  /**
   * Run the complete 9-stage AI ingestion analysis for a newly submitted grievance.
   */
  public static async analyzeComplaint(params: {
    title: string;
    description: string;
    category: ComplaintCategory;
    subcategory?: string;
    location: {
      address: string;
      landmark: string;
      area: string;
      zone: string;
      wardNumber: string;
      lat: number;
      lng: number;
    };
    hasMedia: boolean;
    mediaUrl?: string;
  }): Promise<AIAnalysisResult> {
    const { title, description, category, location, hasMedia } = params;
    const combinedText = `${title} ${description}`.toLowerCase();

    // 1. Keyword extraction & issue detection
    const extractedKeywords = this.extractKeywords(combinedText);

    // 2. Priority Calculation (6 factors)
    const priorityBreakdown = this.calculatePriority(combinedText, category, location.area);
    const overallScore = priorityBreakdown.overallScore;

    // Severity mapping
    let severity: ComplaintSeverity = 'low';
    let priorityCategory: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
    let slaTargetHours = 48;

    if (overallScore >= 90) {
      severity = 'critical';
      priorityCategory = 'Critical';
      slaTargetHours = 8;
    } else if (overallScore >= 75) {
      severity = 'high';
      priorityCategory = 'High';
      slaTargetHours = 24;
    } else if (overallScore >= 50) {
      severity = 'medium';
      priorityCategory = 'Medium';
      slaTargetHours = 36;
    } else {
      severity = 'low';
      priorityCategory = 'Low';
      slaTargetHours = 72;
    }

    // 3. Department Routing
    const departments = StorageService.getDepartments();
    const routing = this.routeDepartment(category, combinedText, departments);

    // 4. Duplicate Detection
    const duplicateDetection = this.detectDuplicates({
      title,
      description,
      category,
      lat: location.lat,
      lng: location.lng
    });

    // 5. Suspicious Report & Trust Layer
    const suspiciousCheck = this.evaluateTrust({
      title,
      description,
      hasMedia,
      lat: location.lat,
      lng: location.lng
    });

    // 6. Action Steps recommendation
    const suggestedActionSteps = this.generateActionSteps(category, severity, routing.departmentName);

    // 7. Summary generation
    const summary = this.generateSummary(title, location.area, severity, priorityCategory);

    return {
      summary,
      detectedCategory: category,
      detectedSubcategory: params.subcategory || this.detectSubcategory(category, combinedText),
      confidence: Math.floor(92 + Math.random() * 7), // 92-98%
      extractedKeywords,
      severity,
      priorityScore: overallScore,
      priorityCategory,
      priorityBreakdown,
      recommendedDepartmentId: routing.departmentId,
      recommendedDepartmentName: routing.departmentName,
      routingReasoning: routing.reasoning,
      suggestedActionSteps,
      slaTargetHours,
      duplicateDetection,
      suspiciousCheck,
      analyzedAt: new Date().toISOString()
    };
  }

  // --- Sub-routines ---

  private static extractKeywords(text: string): string[] {
    const vocabulary = [
      'pothole', 'sewage', 'water leak', 'garbage', 'street light', 'blackout',
      'drainage', 'manhole', 'mosquitoes', 'stench', 'flood', 'accident',
      'pedestrian', 'arterial road', 'pipeline', 'overflow', 'danger', 'hazard',
      'broken', 'electric wire', 'traffic jam', 'school zone', 'hospital'
    ];
    const found = vocabulary.filter((word) => text.includes(word));
    return found.length > 0 ? found : ['civic issue', 'public maintenance', 'infrastructure'];
  }

  private static calculatePriority(text: string, category: ComplaintCategory, area: string): PriorityBreakdown {
    let safety = 50;
    let population = 55;
    let damage = 50;
    let urgency = 50;
    let sensitivity = 55;
    let repeat = 45;

    // Safety weights
    if (text.includes('accident') || text.includes('manhole') || text.includes('wire') || text.includes('electric') || text.includes('hazard') || text.includes('skid')) {
      safety += 35;
      urgency += 30;
    }
    if (category === 'road_potholes' && (text.includes('deep') || text.includes('flyover') || text.includes('highway'))) {
      safety += 25;
      damage += 25;
    }
    if (category === 'drainage_sewage' && text.includes('overflow')) {
      safety += 20;
      urgency += 25;
    }
    if (category === 'water_leakage' && (text.includes('burst') || text.includes('main line') || text.includes('thousands'))) {
      damage += 35;
      population += 30;
      urgency += 35;
    }

    // High sensitivity zones in Hyderabad
    const highDensityAreas = ['Madhapur', 'Gachibowli', 'Hitec City', 'Kukatpally', 'Banjara Hills'];
    if (highDensityAreas.some((a) => area.toLowerCase().includes(a.toLowerCase()))) {
      sensitivity += 25;
      population += 20;
    }

    // Clamp scores 15 to 99
    safety = Math.min(99, Math.max(20, safety));
    population = Math.min(98, Math.max(25, population));
    damage = Math.min(98, Math.max(20, damage));
    urgency = Math.min(99, Math.max(25, urgency));
    sensitivity = Math.min(98, Math.max(30, sensitivity));
    repeat = Math.min(95, Math.max(20, repeat));

    // Weighted composite score
    // Safety: 30%, Urgency: 20%, Damage: 15%, Population: 15%, Sensitivity: 10%, Repeat: 10%
    const overallScore = Math.round(
      safety * 0.3 +
      urgency * 0.2 +
      damage * 0.15 +
      population * 0.15 +
      sensitivity * 0.1 +
      repeat * 0.1
    );

    let justification = `Calculated using CivicSense Multi-Factor Risk Assessment (Score: ${overallScore}/100). `;
    if (safety > 80) justification += 'High life-safety risk detected in public transit corridor. ';
    if (damage > 80) justification += 'Significant municipal infrastructure deterioration requires immediate mechanical intervention. ';
    if (urgency > 85) justification += 'Time-sensitive issue impacting high pedestrian volume.';

    return {
      publicSafetyScore: safety,
      affectedPopulationScore: population,
      infrastructureDamageScore: damage,
      durationUrgencyScore: urgency,
      locationSensitivityScore: sensitivity,
      repeatFrequencyScore: repeat,
      overallScore,
      justification
    };
  }

  private static routeDepartment(
    category: ComplaintCategory,
    text: string,
    departments: Department[]
  ): { departmentId: string; departmentName: string; reasoning: string } {
    const match = departments.find((d) => d.category === category);
    if (match) {
      return {
        departmentId: match.id,
        departmentName: match.name,
        reasoning: `Primary jurisdiction for ${category.replace('_', ' ')} assigned to ${match.name} with standard SLA guidelines.`
      };
    }

    if (text.includes('pothole') || text.includes('road')) {
      const d = departments.find((x) => x.id === 'dept-roads') || departments[0];
      return { departmentId: d.id, departmentName: d.name, reasoning: 'Classified under Road Maintenance & Engineering.' };
    }

    const fallback = departments[0];
    return {
      departmentId: fallback.id,
      departmentName: fallback.name,
      reasoning: 'Routed to general municipal operations for secondary triage.'
    };
  }

  private static detectDuplicates(params: {
    title: string;
    description: string;
    category: ComplaintCategory;
    lat: number;
    lng: number;
  }): DuplicateDetectionResult {
    const existing = StorageService.getComplaints();
    const text = `${params.title} ${params.description}`.toLowerCase();

    for (const c of existing) {
      if (c.category !== params.category) continue;

      // Distance in meters using Haversine
      const distance = this.calculateDistanceMeters(params.lat, params.lng, c.location.lat, c.location.lng);

      if (distance < 250) {
        // High geospatial proximity
        const similarity = this.calculateStringSimilarity(text, `${c.title} ${c.description}`.toLowerCase());
        const confidenceScore = Math.min(98, Math.round((1 - distance / 300) * 40 + similarity * 60));

        if (confidenceScore > 65) {
          return {
            isDuplicateLikely: true,
            confidenceScore,
            parentComplaintId: c.id,
            similarComplaintIds: [c.id],
            matchFactors: {
              locationProximityMeters: Math.round(distance),
              categoryMatch: true,
              textSimilarityPercentage: Math.round(similarity * 100),
              visualSimilarityPercentage: 85,
              timeDeltaHours: 6
            },
            recommendation: confidenceScore > 85 ? 'merge_with_existing' : 'link_as_related'
          };
        }
      }
    }

    return {
      isDuplicateLikely: false,
      confidenceScore: 12,
      similarComplaintIds: [],
      matchFactors: {
        locationProximityMeters: 1200,
        categoryMatch: false,
        textSimilarityPercentage: 10,
        visualSimilarityPercentage: 5,
        timeDeltaHours: 24
      },
      recommendation: 'treat_as_distinct'
    };
  }

  private static evaluateTrust(params: {
    title: string;
    description: string;
    hasMedia: boolean;
    lat: number;
    lng: number;
  }): SuspiciousReportCheck {
    const flags: string[] = [];
    const text = `${params.title} ${params.description}`.toLowerCase();

    // Check suspicious patterns
    if (text.length < 15) {
      flags.push('Low character count in grievance description');
    }
    if (text.includes('test test') || text.includes('asdf') || text.includes('fake complaint')) {
      flags.push('Gibberish or repetitive test tokens detected');
    }

    // Check latitude/longitude bounds for Hyderabad (Roughly 17.1 to 17.7 N, 78.1 to 78.7 E)
    const isWithinHyderabad = params.lat >= 17.0 && params.lat <= 17.8 && params.lng >= 78.0 && params.lng <= 78.8;
    if (!isWithinHyderabad && params.lat !== 0) {
      flags.push('Reported GPS coordinates fall outside municipal municipal jurisdiction');
    }

    const isFlagged = flags.length > 0;
    const trustScore = isFlagged ? 35 : 96;

    return {
      trustScore,
      isFlagged,
      flags,
      explanation: isFlagged
        ? `Warning indicators detected by CivicSense Trust Layer: ${flags.join('; ')}`
        : 'High-confidence citizen grievance with valid geospatial coordinates and metadata consistency.',
      indicators: {
        rapidBurstSubmission: false,
        locationMetadataMismatch: !isWithinHyderabad,
        duplicateMediaHash: false,
        anomalyInDescription: text.length < 15
      },
      reviewStatus: isFlagged ? 'pending' : 'cleared'
    };
  }

  private static generateActionSteps(category: ComplaintCategory, severity: ComplaintSeverity, deptName: string): string[] {
    const generic = [
      `Acknowledge and assign field inspection crew from ${deptName}`,
      'Perform on-site safety assessment and establish safety perimeter',
      'Execute repair or remediation according to municipal standard operating guidelines',
      'Upload geolocated resolution photo evidence for citizen verification'
    ];

    if (category === 'road_potholes') {
      return [
        'Deploy reflective warning barricades and safety markers',
        'Excavate and square-edge damaged pavement patch',
        'Apply dense bitumen base and compact hot-mix asphalt',
        'Verify level smoothness and reopen traffic lane'
      ];
    }
    if (category === 'water_leakage') {
      return [
        'Isolate upstream sluice valve to stop high-pressure water loss',
        'Excavate trench using mini-JCB and expose damaged pipeline segment',
        'Install mechanical clamp collar or replace defective pipe spool',
        'Re-pressurize line and test joints before backfilling'
      ];
    }
    if (category === 'garbage_waste') {
      return [
        'Dispatch hydraulic waste compactor vehicle (14T capacity)',
        'Clear accumulated debris and sweep roadside margins',
        'Disinfect surface area with bleaching powder and anti-odor spray',
        'Place dual segregated bins and caution notice'
      ];
    }
    return generic;
  }

  private static detectSubcategory(category: ComplaintCategory, text: string): string {
    switch (category) {
      case 'road_potholes':
        return text.includes('cave') ? 'Road Cave-in' : 'Deep Pothole / Crater';
      case 'water_leakage':
        return text.includes('burst') ? 'Main Line Burst' : 'Pipeline Seepage';
      case 'garbage_waste':
        return text.includes('overflow') ? 'Bin Overflow' : 'Open Illegal Dumping';
      case 'streetlight_failures':
        return text.includes('all') || text.includes('blackout') ? 'Street Circuit Blackout' : 'Single Fixture Outage';
      case 'drainage_sewage':
        return text.includes('manhole') ? 'Missing / Broken Manhole' : 'Sewage Water Overflow';
      case 'public_sanitation':
        return 'Public Restroom / Facility Sanitation';
      case 'traffic_infrastructure':
        return 'Signage / Signal / Barrier Damage';
      default:
        return 'General Public Infrastructure';
    }
  }

  private static generateSummary(title: string, area: string, severity: ComplaintSeverity, priority: string): string {
    return `AI Assessment [${priority} Priority]: Grievance reported in ${area} involves "${title}". Severity classified as ${severity.toUpperCase()} with active field tracking enabled.`;
  }

  private static calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private static calculateStringSimilarity(s1: string, s2: string): number {
    const words1 = new Set(s1.split(/\s+/).filter((w) => w.length > 3));
    const words2 = new Set(s2.split(/\s+/).filter((w) => w.length > 3));
    if (words1.size === 0 || words2.size === 0) return 0;

    let matchCount = 0;
    words1.forEach((w) => {
      if (words2.has(w)) matchCount++;
    });

    return matchCount / Math.max(words1.size, words2.size);
  }

  /**
   * AI Assistant Query Engine - provides intelligent natural language responses
   * to queries based on the live complaint dataset.
   */
  public static queryAssistant(
    question: string,
    role: UserRole
  ): {
    answer: string;
    quickStats?: { label: string; value: string | number }[];
    relevantComplaints?: Complaint[];
    suggestedActions?: string[];
  } {
    const q = question.toLowerCase();
    const complaints = StorageService.getComplaints();
    const departments = StorageService.getDepartments();

    // 1. Garbage inquiries
    if (q.includes('garbage') || q.includes('waste') || q.includes('dump')) {
      const garbageComplaints = complaints.filter((c) => c.category === 'garbage_waste');
      const areas = garbageComplaints.map((c) => c.location.area);
      const uniqueAreas = Array.from(new Set(areas));
      return {
        answer: `According to the current live civic registry, there are ${garbageComplaints.length} active solid waste and garbage reports. The highest concentration is in **${uniqueAreas.join(', ') || 'Kondapur & Serilingampally'}**. Sanitation trucks are on scheduled daily rounds.`,
        quickStats: [
          { label: 'Garbage Reports', value: garbageComplaints.length },
          { label: 'Resolved This Week', value: garbageComplaints.filter((c) => c.status === 'resolved' || c.status === 'verified').length },
          { label: 'Avg Cleanup SLA', value: '18 Hours' }
        ],
        relevantComplaints: garbageComplaints.slice(0, 3),
        suggestedActions: [
          'View sanitation compactor schedules',
          'Deploy emergency mobile sweeper unit',
          'Export Ward 105 waste density heatmap'
        ]
      };
    }

    // 2. Department workload inquiries
    if (q.includes('workload') || q.includes('highest pending') || q.includes('department workload')) {
      const deptCounts = departments.map((d) => {
        const count = complaints.filter((c) => c.assignedDepartmentId === d.id && c.status !== 'resolved' && c.status !== 'verified').length;
        return { name: d.name, code: d.shortCode, pending: count };
      }).sort((a, b) => b.pending - a.pending);

      const top = deptCounts[0];
      return {
        answer: `**${top.name} (${top.code})** currently carries the highest active backlog with **${top.pending} unresolved grievances**, followed by ${deptCounts[1].name} (${deptCounts[1].pending} grievances).`,
        quickStats: deptCounts.slice(0, 3).map((d) => ({ label: d.code, value: `${d.pending} open` })),
        suggestedActions: [
          'Reallocate field inspectors to high-backlog divisions',
          'Inspect SLA breach threshold alerts',
          'Trigger auto-escalation to Zonal Commissioner'
        ]
      };
    }

    // 3. Top critical complaints
    if (q.includes('critical') || q.includes('top five') || q.includes('highest priority') || q.includes('urgent')) {
      const criticalList = complaints
        .filter((c) => c.aiAnalysis.severity === 'critical' || c.aiAnalysis.priorityScore >= 85)
        .sort((a, b) => b.aiAnalysis.priorityScore - a.aiAnalysis.priorityScore);

      return {
        answer: `CivicSense AI has identified **${criticalList.length} high-severity critical grievances** requiring emergency containment. The most acute is **${criticalList[0]?.id || 'CIVIC-1092'}** (${criticalList[0]?.title || 'Pothole'}), scoring ${criticalList[0]?.aiAnalysis.priorityScore || 94}/100.`,
        quickStats: [
          { label: 'Critical Open', value: criticalList.filter((c) => c.status !== 'resolved').length },
          { label: 'Avg Priority Score', value: '94 / 100' },
          { label: 'Rapid Units Deployed', value: '3 Active' }
        ],
        relevantComplaints: criticalList.slice(0, 3),
        suggestedActions: [
          'Open live incident tracking map',
          'Send automated SMS sirens to Zonal Engineers',
          'Broadcast traffic diversion notices'
        ]
      };
    }

    // 4. Drainage / sewage
    if (q.includes('drainage') || q.includes('sewage') || q.includes('waterlogging') || q.includes('manhole')) {
      const drainageComplaints = complaints.filter((c) => c.category === 'drainage_sewage');
      return {
        answer: `Drainage & Sewerage Control records indicate **${drainageComplaints.length} reported issues**, with critical open-manhole alerts logged near **Kukatpally Y-Junction**. Super Sucker jetting machines are currently deployed.`,
        quickStats: [
          { label: 'Drainage Incidents', value: drainageComplaints.length },
          { label: 'Sewer Blocks Cleared', value: '8 today' },
          { label: 'High Risk Manholes', value: '1 monitored' }
        ],
        relevantComplaints: drainageComplaints.slice(0, 2),
        suggestedActions: [
          'Verify SFRC manhole cover inventory',
          'Dispatch de-silting suction truck',
          'Inspect storm water culverts'
        ]
      };
    }

    // 5. Unresolved / Longest time
    if (q.includes('longest') || q.includes('unresolved') || q.includes('overdue') || q.includes('delay')) {
      const pending = complaints
        .filter((c) => c.status !== 'resolved' && c.status !== 'verified')
        .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

      const oldest = pending[0];
      return {
        answer: `The grievance open for the longest duration is **${oldest?.id}** ("${oldest?.title}") submitted on ${new Date(oldest?.submittedAt || '').toLocaleDateString()}. Assigned department is **${oldest?.assignedDepartmentName}**.`,
        quickStats: [
          { label: 'Oldest Ticket ID', value: oldest?.id || 'None' },
          { label: 'Open Duration', value: '4 days' },
          { label: 'Current Status', value: oldest?.status.toUpperCase() || 'N/A' }
        ],
        relevantComplaints: pending.slice(0, 2),
        suggestedActions: [
          'Send reminder to assigned officer',
          'Escalate to Superintending Engineer',
          'Request status memo from department'
        ]
      };
    }

    // 6. Generic guidance for citizens / authorities
    if (role === 'citizen') {
      return {
        answer: `Hello! I am your **CivicSense AI Citizen Assistant**. I can help you understand how to file grievances, look up tracking IDs (e.g. CIVIC-2026-HYD-1092), identify responsible departments, or understand resolution verification. What civic concern would you like help with today?`,
        suggestedActions: [
          'How do I file a pothole complaint?',
          'What happens after I submit a photo?',
          'How do I verify a resolved grievance?',
          'Which department handles streetlights?'
        ]
      };
    }

    if (role === 'field_worker') {
      return {
        answer: `Hello Specialist! I am your **CivicSense Field Operations Assistant**. I can assist you with understanding work orders, uploading before/after evidence photos, logging remediation expenses, and handling coordinator feedback. What field directive can I help clarify?`,
        suggestedActions: [
          'How do I accept new work orders?',
          'What evidence is required for road paving?',
          'How do I update progress after starting work?',
          'How do I respond to a rework request?'
        ]
      };
    }

    // Default response for authority / admin
    return {
      answer: `CivicSense AI Assistant is monitoring **${complaints.length} total civic records** across 6 GHMC and HMWSSB departments. Ask me about critical complaints, department workloads, area hotspots (Gachibowli, Madhapur, Kukatpally, Miyapur), or duplicate detection analysis.`,
      quickStats: [
        { label: 'Total Complaints', value: complaints.length },
        { label: 'Resolved & Verified', value: complaints.filter((c) => c.status === 'resolved' || c.status === 'verified').length },
        { label: 'Active Departments', value: departments.length }
      ],
      suggestedActions: [
        'Which department has the highest pending workload?',
        'What are the top five critical complaints?',
        'Which areas have the most garbage complaints?',
        'Which complaints have remained unresolved for the longest time?'
      ]
    };
  }
}

