import { Complaint, Department, User, AppNotification, CityAnalyticsSummary, FieldWorker, WorkerTask } from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-roads',
    name: 'Roads & Infrastructure Engineering',
    shortCode: 'GHMC-ROADS',
    category: 'road_potholes',
    headName: 'Er. Rameshwar Rao, Superintending Engineer',
    contactEmail: 'roads.hyderabad@civicsense.gov.in',
    phone: '+91 40 2322 5397',
    zonesCovered: ['Serilingampally', 'Cyberabad', 'Kukatpally', 'Khairatabad', 'Charminar'],
    activeStaffCount: 84,
    averageResolutionHours: 36,
    satisfactionRating: 4.3,
    color: '#F97316'
  },
  {
    id: 'dept-sanitation',
    name: 'Municipal Solid Waste & Sanitation',
    shortCode: 'GHMC-SWM',
    category: 'garbage_waste',
    headName: 'Dr. Sunita Varma, Additional Commissioner (Sanitation)',
    contactEmail: 'sanitation@civicsense.gov.in',
    phone: '+91 40 2322 8841',
    zonesCovered: ['Serilingampally', 'Cyberabad', 'Kukatpally', 'Secunderabad'],
    activeStaffCount: 142,
    averageResolutionHours: 18,
    satisfactionRating: 4.5,
    color: '#10B981'
  },
  {
    id: 'dept-water',
    name: 'HMWSSB Water Supply & Transmission',
    shortCode: 'HMWSSB-WATER',
    category: 'water_leakage',
    headName: 'Er. K. Venkat Narayana, General Manager (Operations)',
    contactEmail: 'operations@hmwssb.gov.in',
    phone: '+91 40 2344 2844',
    zonesCovered: ['Zone IV', 'Zone V (Cyberabad)', 'Zone VI (Serilingampally)'],
    activeStaffCount: 96,
    averageResolutionHours: 24,
    satisfactionRating: 4.1,
    color: '#06B6D4'
  },
  {
    id: 'dept-drainage',
    name: 'Stormwater Drainage & Sewerage Control',
    shortCode: 'HMWSSB-DRAIN',
    category: 'drainage_sewage',
    headName: 'Er. Anand Kumar, Director (Sewerage Maintenance)',
    contactEmail: 'drainage.hyderabad@civicsense.gov.in',
    phone: '+91 40 2344 5512',
    zonesCovered: ['Kukatpally', 'Miyapur', 'Begumpet', 'Banjara Hills'],
    activeStaffCount: 68,
    averageResolutionHours: 30,
    satisfactionRating: 3.9,
    color: '#8B5CF6'
  },
  {
    id: 'dept-electricity',
    name: 'TSSPDCL Street Lighting & Public Power',
    shortCode: 'TSSPDCL-LIGHTS',
    category: 'streetlight_failures',
    headName: 'Er. Mohammed Farooq, Divisional Engineer',
    contactEmail: 'lighting@tsspdcl.gov.in',
    phone: '+91 40 2345 6198',
    zonesCovered: ['Cyberabad West', 'Kukatpally Circle', 'Hi-Tech City Area'],
    activeStaffCount: 52,
    averageResolutionHours: 16,
    satisfactionRating: 4.6,
    color: '#EAB308'
  },
  {
    id: 'dept-health',
    name: 'Public Health, Vector Control & Safety',
    shortCode: 'GHMC-HEALTH',
    category: 'public_sanitation',
    headName: 'Dr. Chaitanya Murthy, Chief Medical Officer',
    contactEmail: 'publichealth@civicsense.gov.in',
    phone: '+91 40 2322 1010',
    zonesCovered: ['All Greater Hyderabad Zones'],
    activeStaffCount: 77,
    averageResolutionHours: 42,
    satisfactionRating: 4.2,
    color: '#EC4899'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-citizen-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'citizen',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: 'Flat 402, Sai Nilayam, Botanical Garden Rd, Kondapur',
    ward: 'Ward 105 - Kondapur',
    verifiedStatus: true,
    active: true,
    joinedDate: '2026-01-12'
  },
  {
    id: 'user-citizen-2',
    name: 'Priya Reddy',
    email: 'priya.reddy@example.com',
    phone: '+91 98490 11223',
    role: 'citizen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    address: 'House 12-4B, KPHB Colony Phase 3, Kukatpally',
    ward: 'Ward 118 - Kukatpally',
    verifiedStatus: true,
    active: true,
    joinedDate: '2026-02-05'
  },
  {
    id: 'user-auth-roads',
    name: 'Er. Rameshwar Rao',
    email: 'rameshwar.rao@civicsense.gov.in',
    phone: '+91 94401 23456',
    role: 'authority',
    departmentId: 'dept-roads',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: 'GHMC Zonal Office, Serilingampally',
    ward: 'Serilingampally Zone',
    verifiedStatus: true,
    active: true,
    joinedDate: '2025-06-15'
  },
  {
    id: 'user-auth-sanitation',
    name: 'Dr. Sunita Varma',
    email: 'sunita.varma@civicsense.gov.in',
    phone: '+91 94402 34567',
    role: 'authority',
    departmentId: 'dept-sanitation',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    address: 'GHMC Head Office, Tank Bund',
    ward: 'All Zones',
    verifiedStatus: true,
    active: true,
    joinedDate: '2025-04-10'
  },
  {
    id: 'user-auth-water',
    name: 'Er. K. Venkat Narayana',
    email: 'venkat.narayana@hmwssb.gov.in',
    phone: '+91 94403 45678',
    role: 'authority',
    departmentId: 'dept-water',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: 'HMWSSB Divisional Office, Madhapur',
    ward: 'Cyberabad Zone',
    verifiedStatus: true,
    active: true,
    joinedDate: '2025-08-20'
  },
  {
    id: 'user-admin',
    name: 'Sri S. Balasubrahmanyam, IAS',
    email: 'commissioner@civicsense.gov.in',
    phone: '+91 40 2322 0001',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    address: 'Civic Command & Operations Centre, Integrated Control Room, Hyderabad',
    ward: 'Greater Hyderabad Municipal Corporation',
    verifiedStatus: true,
    active: true,
    joinedDate: '2025-01-01'
  },
  {
    id: 'user-field-suresh',
    name: 'Suresh Gowd',
    email: 'suresh.gowd@field.civicsense.gov.in',
    phone: '+91 94405 88991',
    role: 'field_worker',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    address: 'GHMC Roads Maintenance Depot, Serilingampally',
    ward: 'Serilingampally Zone',
    verifiedStatus: true,
    active: true,
    joinedDate: '2025-07-01'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CIVIC-2026-HYD-1092',
    title: 'Severe Deep Pothole & Cave-in at Cyber Towers Junction',
    description: 'A massive 4-foot wide pothole and asphalt cave-in has formed right near the Cyber Towers flyover entrance ramp in Madhapur. Multiple two-wheelers have skid during evening peak hours, creating extreme safety risk and severe traffic jams stretching past Hitec City MMTS station.',
    category: 'road_potholes',
    subcategory: 'Deep Pothole / Road Cave-in',
    citizenId: 'user-citizen-1',
    citizenName: 'Aarav Sharma',
    citizenPhone: '+91 98765 43210',
    submittedAt: '2026-11-01T08:30:00Z',
    location: {
      address: 'Cyber Towers Junction, Main Flyover Entrance, Hitec City',
      landmark: 'Opposite Cyber Pearl Building',
      area: 'Madhapur',
      zone: 'Cyberabad Zone',
      wardNumber: 'Ward 104',
      lat: 17.4504,
      lng: 78.3808
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'in_progress',
    assignedDepartmentId: 'dept-roads',
    assignedDepartmentName: 'Roads & Infrastructure Engineering',
    assignedAuthorityId: 'user-auth-roads',
    assignedAuthorityName: 'Er. Rameshwar Rao',
    tags: ['CyberTowers', 'TrafficHazard', 'HighTrafficZone', 'Pothole'],
    upvotesCount: 47,
    internalNotes: [
      'Asphalt cold mix squad dispatched at 10:15 AM.',
      'Barricades placed by Cyberabad Traffic Police in coordination with GHMC.'
    ],
    aiAnalysis: {
      summary: 'High-risk road depression/pothole (approx. 4ft dia, 8in depth) situated on high-speed arterial corridor causing recurring two-wheeler skids and severe bottle-neck traffic.',
      detectedCategory: 'road_potholes',
      detectedSubcategory: 'Deep Pothole / Arterial Cave-in',
      confidence: 96,
      extractedKeywords: ['pothole', 'cave-in', 'flyover entrance', 'Cyber Towers', 'two-wheeler skid', 'arterial road'],
      severity: 'critical',
      priorityScore: 94,
      priorityCategory: 'Critical',
      priorityBreakdown: {
        publicSafetyScore: 98,
        affectedPopulationScore: 92,
        infrastructureDamageScore: 89,
        durationUrgencyScore: 95,
        locationSensitivityScore: 97,
        repeatFrequencyScore: 90,
        overallScore: 94,
        justification: 'Located on high-density tech corridor (120,000+ daily commuter volume). High imminent probability of fatal two-wheeler accidents and heavy transit disruption.'
      },
      recommendedDepartmentId: 'dept-roads',
      recommendedDepartmentName: 'Roads & Infrastructure Engineering',
      routingReasoning: 'Primary jurisdiction is GHMC West Zone Road Maintenance Division with emergency hot-mix asphalt patching equipment required immediately.',
      suggestedActionSteps: [
        'Deploy warning hazard cones immediately within 15 meters buffer',
        'Direct heavy vehicle diversion via Mindspace slip road',
        'Dispatch Quick Response Road Patching vehicle (QRV-04)',
        'Compact sub-base with crushed aggregate and apply dense bituminous macadam (DBM)'
      ],
      slaTargetHours: 12,
      duplicateDetection: {
        isDuplicateLikely: true,
        confidenceScore: 89,
        parentComplaintId: 'CIVIC-2026-HYD-1092',
        similarComplaintIds: ['CIVIC-2026-HYD-1088'],
        matchFactors: {
          locationProximityMeters: 45,
          categoryMatch: true,
          textSimilarityPercentage: 82,
          visualSimilarityPercentage: 88,
          timeDeltaHours: 2.5
        },
        recommendation: 'link_as_related'
      },
      suspiciousCheck: {
        trustScore: 95,
        isFlagged: false,
        flags: [],
        explanation: 'Verified citizen profile with authentic geotagged photo, accurate EXIF coordinates matching Madhapur Cyber Towers junction.',
        indicators: {
          rapidBurstSubmission: false,
          locationMetadataMismatch: false,
          duplicateMediaHash: false,
          anomalyInDescription: false
        },
        reviewStatus: 'cleared'
      },
      analyzedAt: '2026-11-01T08:31:12Z'
    },
    timeline: [
      {
        id: 'tl-1',
        status: 'submitted',
        title: 'Complaint Registered',
        description: 'Citizen Aarav Sharma filed civic grievance via Mobile Web Portal.',
        timestamp: '2026-11-01T08:30:00Z',
        performedBy: 'Aarav Sharma',
        role: 'citizen'
      },
      {
        id: 'tl-2',
        status: 'ai_analyzed',
        title: 'AI Ingestion & Analysis Completed',
        description: 'Computer vision verified asphalt rupture. Priority calculated as 94 (Critical). Auto-routed to Roads Dept.',
        timestamp: '2026-11-01T08:31:12Z',
        performedBy: 'CivicSense AI Engine',
        role: 'ai_system'
      },
      {
        id: 'tl-3',
        status: 'assigned',
        title: 'Assigned to Superintending Engineer',
        description: 'Assigned to Er. Rameshwar Rao (Roads West Zone) with 12h emergency SLA.',
        timestamp: '2026-11-01T08:45:00Z',
        performedBy: 'GHMC Central Dispatcher',
        role: 'authority'
      },
      {
        id: 'tl-4',
        status: 'in_progress',
        title: 'Rapid Response Team on Site',
        description: 'Safety barricading installed. Asphalt compacting equipment active.',
        timestamp: '2026-11-01T10:30:00Z',
        performedBy: 'Er. Rameshwar Rao',
        role: 'authority'
      }
    ]
  },
  {
    id: 'CIVIC-2026-HYD-1093',
    title: 'Severe Potable Water Pipeline Burst & Flooding in Miyapur',
    description: 'HMWSSB 600mm drinking water main line has cracked near Miyapur Allwyn X Roads, gushing thousands of liters of clean water onto the highway and flooding low-lying residential apartment cellars. Drinking water pressure in Miyapur Ward 108 completely halted.',
    category: 'water_leakage',
    subcategory: 'Main Supply Pipeline Rupture',
    citizenId: 'user-citizen-2',
    citizenName: 'Priya Reddy',
    citizenPhone: '+91 98490 11223',
    submittedAt: '2026-11-02T06:15:00Z',
    location: {
      address: 'Allwyn X Roads, Near Metro Station Pillar 1142, Miyapur',
      landmark: 'Beside HP Petrol Pump',
      area: 'Miyapur',
      zone: 'Serilingampally Zone',
      wardNumber: 'Ward 108',
      lat: 17.4969,
      lng: 78.3614
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'assigned',
    assignedDepartmentId: 'dept-water',
    assignedDepartmentName: 'HMWSSB Water Supply & Transmission',
    assignedAuthorityId: 'user-auth-water',
    assignedAuthorityName: 'Er. K. Venkat Narayana',
    tags: ['WaterWastage', 'PipelineBurst', 'MiyapurFlooding', 'CriticalSupply'],
    upvotesCount: 63,
    aiAnalysis: {
      summary: 'High-pressure transmission pipeline rupture discharging high water volume onto transit carriageway; affecting potable water access for an estimated 15,000 households.',
      detectedCategory: 'water_leakage',
      detectedSubcategory: 'Transmission Main Rupture',
      confidence: 98,
      extractedKeywords: ['pipeline burst', 'drinking water wasted', 'flooding', 'Allwyn X roads', 'Miyapur Metro', 'cellar inundation'],
      severity: 'critical',
      priorityScore: 92,
      priorityCategory: 'Critical',
      priorityBreakdown: {
        publicSafetyScore: 85,
        affectedPopulationScore: 96,
        infrastructureDamageScore: 94,
        durationUrgencyScore: 98,
        locationSensitivityScore: 90,
        repeatFrequencyScore: 78,
        overallScore: 92,
        justification: 'Acute water loss (approx. 40,000 L/hr) with severe disruption of municipal drinking supply to Miyapur and KPHB Phase 6. Immediate valve closure mandatory.'
      },
      recommendedDepartmentId: 'dept-water',
      recommendedDepartmentName: 'HMWSSB Water Supply & Transmission',
      routingReasoning: 'Emergency hydraulic transmission failure falls directly under HMWSSB Operations Division VI.',
      suggestedActionSteps: [
        'Close Sub-Sluice Valve SV-14 at Allwyn junction immediately to isolate section',
        'Send dewatering pumps for residential basements',
        'Mobilize pipe welding crew with 600mm MS sleeve collar',
        'Arrange emergency drinking water tankers for affected residential colonies'
      ],
      slaTargetHours: 8,
      duplicateDetection: {
        isDuplicateLikely: false,
        confidenceScore: 22,
        similarComplaintIds: [],
        matchFactors: {
          locationProximityMeters: 620,
          categoryMatch: false,
          textSimilarityPercentage: 15,
          visualSimilarityPercentage: 20,
          timeDeltaHours: 12
        },
        recommendation: 'treat_as_distinct'
      },
      suspiciousCheck: {
        trustScore: 98,
        isFlagged: false,
        flags: [],
        explanation: 'Geotag matches HMWSSB telemetry showing sudden pressure drop in Sector 4 feeder line.',
        indicators: {
          rapidBurstSubmission: false,
          locationMetadataMismatch: false,
          duplicateMediaHash: false,
          anomalyInDescription: false
        },
        reviewStatus: 'cleared'
      },
      analyzedAt: '2026-11-02T06:16:04Z'
    },
    timeline: [
      {
        id: 'tl-w1',
        status: 'submitted',
        title: 'Reported by Citizen',
        description: 'Citizen filed grievance with geolocated photo evidence.',
        timestamp: '2026-11-02T06:15:00Z',
        performedBy: 'Priya Reddy',
        role: 'citizen'
      },
      {
        id: 'tl-w2',
        status: 'ai_analyzed',
        title: 'AI Ingestion Completed',
        description: 'Identified major hydraulic burst. Priority 92. Auto-notified emergency engineer.',
        timestamp: '2026-11-02T06:16:04Z',
        performedBy: 'CivicSense AI Engine',
        role: 'ai_system'
      },
      {
        id: 'tl-w3',
        status: 'assigned',
        title: 'Assigned to General Manager',
        description: 'Er. K. Venkat Narayana acknowledged and initiated valve isolation.',
        timestamp: '2026-11-02T06:30:00Z',
        performedBy: 'HMWSSB Central Control',
        role: 'authority'
      }
    ]
  },
  {
    id: 'CIVIC-2026-HYD-1094',
    title: 'Chronic Overflowing Garbage Dumpsite on Botanical Garden Road',
    description: 'Unregulated municipal waste accumulation and open dumping near the Botanical Garden rear boundary wall in Kondapur. Debris is spilling onto pedestrian walkway, emitting noxious odor, attracting stray animals, and creating health hazard for schoolchildren.',
    category: 'garbage_waste',
    subcategory: 'Open Waste Dumping / Uncollected Garbage',
    citizenId: 'user-citizen-1',
    citizenName: 'Aarav Sharma',
    citizenPhone: '+91 98765 43210',
    submittedAt: '2026-10-28T11:00:00Z',
    location: {
      address: 'Botanical Garden Peripheral Road, Kondapur',
      landmark: 'Near Gate No. 3, Beside Heritage Supermarket',
      area: 'Kondapur',
      zone: 'Serilingampally Zone',
      wardNumber: 'Ward 105',
      lat: 17.4648,
      lng: 78.3662
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'resolved',
    assignedDepartmentId: 'dept-sanitation',
    assignedDepartmentName: 'Municipal Solid Waste & Sanitation',
    assignedAuthorityId: 'user-auth-sanitation',
    assignedAuthorityName: 'Dr. Sunita Varma',
    tags: ['Sanitation', 'GarbageOverflow', 'Kondapur', 'PublicHealth'],
    upvotesCount: 38,
    aiAnalysis: {
      summary: 'Illegal chronic solid waste dumping site exceeding 4 metric tons of mixed organic and plastic waste obstructing public footpath.',
      detectedCategory: 'garbage_waste',
      detectedSubcategory: 'Chronic Footpath Dumpsite',
      confidence: 94,
      extractedKeywords: ['garbage dumping', 'foul smell', 'footpath blocked', 'Kondapur', 'Botanical Garden', 'health hazard'],
      severity: 'high',
      priorityScore: 78,
      priorityCategory: 'High',
      priorityBreakdown: {
        publicSafetyScore: 72,
        affectedPopulationScore: 84,
        infrastructureDamageScore: 50,
        durationUrgencyScore: 88,
        locationSensitivityScore: 85,
        repeatFrequencyScore: 92,
        overallScore: 78,
        justification: 'High pedestrian movement near school and park. Recurring complaints from same location over last 3 weeks indicate chronic logistics breakdown.'
      },
      recommendedDepartmentId: 'dept-sanitation',
      recommendedDepartmentName: 'Municipal Solid Waste & Sanitation',
      routingReasoning: 'Under Serilingampally Circle 20 SWM unit requiring compactor vehicle and mechanical sweeper.',
      suggestedActionSteps: [
        'Deploy 14-ton hydraulic waste compactor truck',
        'Apply lime powder and disinfectant sanitization spray',
        'Install "No Dumping / Fine Rs. 5000" surveillance signpost',
        'Notify residential welfare association (RWA) regarding door-to-door collection schedule'
      ],
      slaTargetHours: 24,
      duplicateDetection: {
        isDuplicateLikely: true,
        confidenceScore: 75,
        parentComplaintId: 'CIVIC-2026-HYD-1070',
        similarComplaintIds: ['CIVIC-2026-HYD-1070'],
        matchFactors: {
          locationProximityMeters: 60,
          categoryMatch: true,
          textSimilarityPercentage: 70,
          visualSimilarityPercentage: 75,
          timeDeltaHours: 48
        },
        recommendation: 'link_as_related'
      },
      suspiciousCheck: {
        trustScore: 90,
        isFlagged: false,
        flags: [],
        explanation: 'Regular active citizen with verified track record.',
        indicators: {
          rapidBurstSubmission: false,
          locationMetadataMismatch: false,
          duplicateMediaHash: false,
          anomalyInDescription: false
        },
        reviewStatus: 'cleared'
      },
      analyzedAt: '2026-10-28T11:01:25Z'
    },
    resolution: {
      resolvedAt: '2026-10-29T16:45:00Z',
      authorityId: 'user-auth-sanitation',
      authorityName: 'Dr. Sunita Varma',
      departmentId: 'dept-sanitation',
      workDescription: 'Cleared 4.2 metric tons of mixed accumulated waste using 2 compactor trucks (TS-09-UB-4122). Footpath washed and treated with calcium hypochlorite disinfectant. Installed 2 twin-litter bins and permanent warning sign with CCTV advisory.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      contractorName: 'GHMC Clean Hyderabad Green Fleet Unit 4',
      expensesIncurredINR: 18500,
      materialsUsed: ['Lime disinfectant (50kg)', '2x Twin Galvanized Waste Bins', 'Reflective Signage'],
      citizenVerification: {
        status: 'pending'
      }
    },
    timeline: [
      {
        id: 'tl-s1',
        status: 'submitted',
        title: 'Complaint Registered',
        description: 'Citizen Aarav Sharma reported chronic garbage pile.',
        timestamp: '2026-10-28T11:00:00Z',
        performedBy: 'Aarav Sharma',
        role: 'citizen'
      },
      {
        id: 'tl-s2',
        status: 'ai_analyzed',
        title: 'AI Classification & Duplicate Link',
        description: 'Severity classified as High. Linked to previous report in same ward.',
        timestamp: '2026-10-28T11:01:25Z',
        performedBy: 'CivicSense AI Engine',
        role: 'ai_system'
      },
      {
        id: 'tl-s3',
        status: 'assigned',
        title: 'Assigned to Sanitation Division',
        description: 'Assigned to Dr. Sunita Varma, Additional Commissioner (Sanitation).',
        timestamp: '2026-10-28T13:00:00Z',
        performedBy: 'Zonal SWM Office',
        role: 'authority'
      },
      {
        id: 'tl-s4',
        status: 'in_progress',
        title: 'Compactor Trucks Deployed',
        description: '2 compactor vehicles mobilized on Botanical Garden road.',
        timestamp: '2026-10-29T09:00:00Z',
        performedBy: 'Dr. Sunita Varma',
        role: 'authority'
      },
      {
        id: 'tl-s5',
        status: 'resolved',
        title: 'Work Completed & Marked Resolved',
        description: 'Waste cleared, sanitized, and new bins placed. Awaiting citizen verification.',
        timestamp: '2026-10-29T16:45:00Z',
        performedBy: 'Dr. Sunita Varma',
        role: 'authority'
      }
    ]
  },
  {
    id: 'CIVIC-2026-HYD-1095',
    title: 'Streetlight Failure & Dark Zone on Outer Ring Road Feeder, Gachibowli',
    description: 'A stretch of 14 consecutive LED streetlights is completely dead for the past 4 nights on the Gachibowli junction to Financial District feeder road. Total pitch darkness has led to 2 minor car crashes and creates severe safety concerns for night-shift female IT professionals walking to bus stops.',
    category: 'streetlight_failures',
    subcategory: 'Feeder Line Blackout / Cluster Failure',
    citizenId: 'user-citizen-2',
    citizenName: 'Priya Reddy',
    citizenPhone: '+91 98490 11223',
    submittedAt: '2026-10-30T19:20:00Z',
    location: {
      address: 'Gachibowli Outer Ring Road Service Lane',
      landmark: 'Between IIIT Junction and Wipro Circle',
      area: 'Gachibowli',
      zone: 'Cyberabad Zone',
      wardNumber: 'Ward 106',
      lat: 17.4401,
      lng: 78.3489
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'verified',
    assignedDepartmentId: 'dept-electricity',
    assignedDepartmentName: 'TSSPDCL Street Lighting & Public Power',
    assignedAuthorityId: 'user-auth-water',
    assignedAuthorityName: 'Er. Mohammed Farooq',
    tags: ['WomenSafety', 'Streetlights', 'Gachibowli', 'DarkZone', 'ITCorridor'],
    upvotesCount: 52,
    aiAnalysis: {
      summary: 'Consecutive multi-pole electrical blackout covering 600m arterial feeder road connecting major IT campuses, presenting high crime vulnerability and traffic collision risks.',
      detectedCategory: 'streetlight_failures',
      detectedSubcategory: 'Circuit Breaker / Cable Severance',
      confidence: 97,
      extractedKeywords: ['dark zone', 'streetlights off', 'Gachibowli', 'women safety', 'accidents', 'IT corridor'],
      severity: 'high',
      priorityScore: 86,
      priorityCategory: 'High',
      priorityBreakdown: {
        publicSafetyScore: 94,
        affectedPopulationScore: 88,
        infrastructureDamageScore: 65,
        durationUrgencyScore: 90,
        locationSensitivityScore: 95,
        repeatFrequencyScore: 68,
        overallScore: 86,
        justification: 'High sensitivity zone due to 24/7 IT workforce shift changes and female pedestrian transit. Darkness creates immediate security vulnerability.'
      },
      recommendedDepartmentId: 'dept-electricity',
      recommendedDepartmentName: 'TSSPDCL Street Lighting & Public Power',
      routingReasoning: 'Central timer switch or feeder underground cable fault under TSSPDCL Cyberabad division jurisdiction.',
      suggestedActionSteps: [
        'Check phase fuse and MCCB in Pillar Box PB-18',
        'Conduct underground cable megger insulation test',
        'Replace blown ballast modules on poles #12 through #26',
        'Verify lux levels with lux meter post-restoration'
      ],
      slaTargetHours: 16,
      duplicateDetection: {
        isDuplicateLikely: false,
        confidenceScore: 30,
        similarComplaintIds: [],
        matchFactors: {
          locationProximityMeters: 800,
          categoryMatch: true,
          textSimilarityPercentage: 20,
          visualSimilarityPercentage: 15,
          timeDeltaHours: 72
        },
        recommendation: 'treat_as_distinct'
      },
      suspiciousCheck: {
        trustScore: 96,
        isFlagged: false,
        flags: [],
        explanation: 'Authentic night-time photographic verification with valid time stamp.',
        indicators: {
          rapidBurstSubmission: false,
          locationMetadataMismatch: false,
          duplicateMediaHash: false,
          anomalyInDescription: false
        },
        reviewStatus: 'cleared'
      },
      analyzedAt: '2026-10-30T19:21:40Z'
    },
    resolution: {
      resolvedAt: '2026-10-31T14:30:00Z',
      authorityId: 'user-auth-water',
      authorityName: 'Er. Mohammed Farooq',
      departmentId: 'dept-electricity',
      workDescription: 'Identified underground 4-core cable short-circuit caused by third-party fiber trenching. Re-laid 45 meters of armored cable, replaced 2 burnt MCBs, and re-lamped 3 faulty 120W LED fixtures. All 14 poles tested and operational.',
      beforeImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
      materialsUsed: ['45m 4-core armored copper cable', '2x 63A 4-pole MCBs', '3x 120W Philips LED fittings'],
      citizenVerification: {
        status: 'verified_approved',
        verifiedAt: '2026-10-31T20:15:00Z',
        citizenFeedback: 'Verified! All streetlights are working brightly tonight. Feeling much safer walking from office to metro station. Great job!',
        rating: 5
      }
    },
    timeline: [
      {
        id: 'tl-e1',
        status: 'submitted',
        title: 'Complaint Registered',
        description: 'Citizen Priya Reddy reported dark zone.',
        timestamp: '2026-10-30T19:20:00Z',
        performedBy: 'Priya Reddy',
        role: 'citizen'
      },
      {
        id: 'tl-e2',
        status: 'ai_analyzed',
        title: 'AI Analysis Completed',
        description: 'Women safety & high transit priority applied. Score: 86.',
        timestamp: '2026-10-30T19:21:40Z',
        performedBy: 'CivicSense AI Engine',
        role: 'ai_system'
      },
      {
        id: 'tl-e3',
        status: 'assigned',
        title: 'Assigned to TSSPDCL Engineer',
        description: 'Er. Mohammed Farooq assigned.',
        timestamp: '2026-10-30T20:00:00Z',
        performedBy: 'TSSPDCL Automation',
        role: 'authority'
      },
      {
        id: 'tl-e4',
        status: 'in_progress',
        title: 'Cable Splicing & Trenching',
        description: 'Underground cable repaired and fixtures replaced.',
        timestamp: '2026-10-31T10:00:00Z',
        performedBy: 'Er. Mohammed Farooq',
        role: 'authority'
      },
      {
        id: 'tl-e5',
        status: 'resolved',
        title: 'Marked as Resolved',
        description: 'Lights powered on and illumination verified.',
        timestamp: '2026-10-31T14:30:00Z',
        performedBy: 'Er. Mohammed Farooq',
        role: 'authority'
      },
      {
        id: 'tl-e6',
        status: 'verified',
        title: 'Citizen Verified & Closed',
        description: 'Citizen verified in person and gave 5-star rating.',
        timestamp: '2026-10-31T20:15:00Z',
        performedBy: 'Priya Reddy',
        role: 'citizen'
      }
    ]
  },
  {
    id: 'CIVIC-2026-HYD-1096',
    title: 'Open Manhole & Toxic Sewage Overflow near Kukatpally Y-Junction',
    description: 'A heavy cast-iron manhole cover is missing near Kukatpally Y-Junction bus shelter. Black untreated sewage is bubbling onto the main road, leaving an open 10-foot vertical fall hazard hidden beneath foul water puddle. High danger for school buses and pedestrians.',
    category: 'drainage_sewage',
    subcategory: 'Missing Manhole Cover & Sewage Overflow',
    citizenId: 'user-citizen-2',
    citizenName: 'Priya Reddy',
    citizenPhone: '+91 98490 11223',
    submittedAt: '2026-11-02T14:10:00Z',
    location: {
      address: 'Kukatpally Y-Junction Main Bus Stop, Mumbai Highway',
      landmark: 'Near Balanagar Flyover Ramp',
      area: 'Kukatpally',
      zone: 'Kukatpally Zone',
      wardNumber: 'Ward 118',
      lat: 17.4947,
      lng: 78.4069
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'ai_analyzed',
    assignedDepartmentId: 'dept-drainage',
    assignedDepartmentName: 'Stormwater Drainage & Sewerage Control',
    tags: ['ManholeHazard', 'SewageOverflow', 'Kukatpally', 'LifeHazard', 'SchoolBusRoute'],
    upvotesCount: 88,
    aiAnalysis: {
      summary: 'Extreme life safety hazard: unshielded missing manhole cavity submerged under flowing sewage adjacent to high-occupancy bus terminus.',
      detectedCategory: 'drainage_sewage',
      detectedSubcategory: 'Missing Manhole & Inundation',
      confidence: 99,
      extractedKeywords: ['missing manhole', 'open drain', 'toxic sewage', 'bus stop', 'Kukatpally Y-Junction', 'drowning hazard'],
      severity: 'critical',
      priorityScore: 97,
      priorityCategory: 'Critical',
      priorityBreakdown: {
        publicSafetyScore: 100,
        affectedPopulationScore: 95,
        infrastructureDamageScore: 92,
        durationUrgencyScore: 98,
        locationSensitivityScore: 98,
        repeatFrequencyScore: 91,
        overallScore: 97,
        justification: 'Open subterranean manhole hidden under muddy sewage constitutes direct life-threatening hazard. Immediate physical barricading and cover replacement required within 2 hours.'
      },
      recommendedDepartmentId: 'dept-drainage',
      recommendedDepartmentName: 'Stormwater Drainage & Sewerage Control',
      routingReasoning: 'Emergency drainage safety protocol requires instant Super Sucker jetting vehicle and heavy-duty SFRC manhole slab installation.',
      suggestedActionSteps: [
        'Dispatch emergency field crew with red hazard barricades immediately',
        'Deploy mobile warning siren vehicle to divert pedestrians away from submerged hole',
        'Install heavy-duty fiber reinforced concrete (SFRC) lockable manhole cover',
        'Run jetting machine to clear downstream sewer silt blockage'
      ],
      slaTargetHours: 4,
      duplicateDetection: {
        isDuplicateLikely: true,
        confidenceScore: 92,
        parentComplaintId: 'CIVIC-2026-HYD-1096',
        similarComplaintIds: ['CIVIC-2026-HYD-1090'],
        matchFactors: {
          locationProximityMeters: 20,
          categoryMatch: true,
          textSimilarityPercentage: 88,
          visualSimilarityPercentage: 91,
          timeDeltaHours: 1.0
        },
        recommendation: 'merge_with_existing'
      },
      suspiciousCheck: {
        trustScore: 99,
        isFlagged: false,
        flags: [],
        explanation: 'Validated complaint with matching audio/video cues and multiple citizen endorsements.',
        indicators: {
          rapidBurstSubmission: false,
          locationMetadataMismatch: false,
          duplicateMediaHash: false,
          anomalyInDescription: false
        },
        reviewStatus: 'cleared'
      },
      analyzedAt: '2026-11-02T14:11:15Z'
    },
    timeline: [
      {
        id: 'tl-d1',
        status: 'submitted',
        title: 'Critical Emergency Submitted',
        description: 'Citizen Priya Reddy flagged open manhole with photograph.',
        timestamp: '2026-11-02T14:10:00Z',
        performedBy: 'Priya Reddy',
        role: 'citizen'
      },
      {
        id: 'tl-d2',
        status: 'ai_analyzed',
        title: 'Emergency Life Safety Trigger',
        description: 'AI Engine assigned Priority 97 (Critical). Automated siren alert sent to Drainage rapid crew.',
        timestamp: '2026-11-02T14:11:15Z',
        performedBy: 'CivicSense AI Engine',
        role: 'ai_system'
      }
    ]
  },
  {
    id: 'CIVIC-2026-HYD-1097',
    title: 'Suspicious Duplicate & Stock Image Report: Road Damage in Banjara Hills',
    description: 'Report claiming road collapsed near Road No. 12 Banjara Hills with stock imagery found on external search engines.',
    category: 'road_potholes',
    subcategory: 'Suspect Road Damage',
    citizenId: 'user-suspicious-99',
    citizenName: 'Anonymous Account 409',
    citizenPhone: '+91 91111 00000',
    submittedAt: '2026-11-03T02:00:00Z',
    location: {
      address: 'Road No. 12, Banjara Hills',
      landmark: 'Near MLA Colony',
      area: 'Banjara Hills',
      zone: 'Khairatabad',
      wardNumber: 'Ward 92',
      lat: 17.4156,
      lng: 78.4350
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'submitted',
    assignedDepartmentId: 'dept-roads',
    assignedDepartmentName: 'Roads & Infrastructure Engineering',
    tags: ['SuspiciousFlag', 'TrustReview', 'DuplicateImage'],
    upvotesCount: 0,
    aiAnalysis: {
      summary: 'Report flagged by Trust & Moderation layer due to media hash duplicate detected across 4 previous submissions and EXIF GPS mismatch.',
      detectedCategory: 'road_potholes',
      detectedSubcategory: 'Suspect Submission',
      confidence: 45,
      extractedKeywords: ['road damage', 'pothole', 'Banjara Hills'],
      severity: 'low',
      priorityScore: 35,
      priorityCategory: 'Low',
      priorityBreakdown: {
        publicSafetyScore: 30,
        affectedPopulationScore: 25,
        infrastructureDamageScore: 40,
        durationUrgencyScore: 30,
        locationSensitivityScore: 60,
        repeatFrequencyScore: 20,
        overallScore: 35,
        justification: 'Low reliability score. Image has identical perceptual hash to internet stock photo. Coordinate telemetry shows client IP 1,200 km away from claimed Banjara Hills location.'
      },
      recommendedDepartmentId: 'dept-roads',
      recommendedDepartmentName: 'Roads & Infrastructure Engineering',
      routingReasoning: 'Requires Authority verification before field crew dispatch.',
      suggestedActionSteps: [
        'Request additional live in-app camera verification from submitter',
        'Cross-reference with Ward 92 beat constable patrolling log',
        'Do not dispatch physical crew until verified'
      ],
      slaTargetHours: 72,
      duplicateDetection: {
        isDuplicateLikely: true,
        confidenceScore: 98,
        parentComplaintId: 'CIVIC-2026-HYD-0812',
        similarComplaintIds: ['CIVIC-2026-HYD-0812', 'CIVIC-2026-HYD-0799'],
        matchFactors: {
          locationProximityMeters: 4500,
          categoryMatch: true,
          textSimilarityPercentage: 94,
          visualSimilarityPercentage: 100,
          timeDeltaHours: 140
        },
        recommendation: 'merge_with_existing'
      },
      suspiciousCheck: {
        trustScore: 24,
        isFlagged: true,
        flags: [
          'Duplicate media perceptual hash match (Identical to 2 existing web images)',
          'EXIF GPS location mismatch (Device reported IP differs by >1000km)',
          'Rapid burst submission behavior (4 complaints submitted within 2 minutes)'
        ],
        explanation: 'Suspicious submission warning: This complaint uses recycled imagery and exhibits bot-like burst frequency. Human authority review required before mobilizing public resources.',
        indicators: {
          rapidBurstSubmission: true,
          locationMetadataMismatch: true,
          duplicateMediaHash: true,
          anomalyInDescription: true
        },
        reviewStatus: 'pending'
      },
      analyzedAt: '2026-11-03T02:01:00Z'
    },
    timeline: [
      {
        id: 'tl-sus1',
        status: 'submitted',
        title: 'Report Submitted',
        description: 'Submission registered via Web API.',
        timestamp: '2026-11-03T02:00:00Z',
        performedBy: 'Anonymous Account 409',
        role: 'citizen'
      },
      {
        id: 'tl-sus2',
        status: 'submitted',
        title: 'Trust & Moderation Flagged',
        description: 'Trust score 24/100. Flagged for image hash duplicate and GPS mismatch.',
        timestamp: '2026-11-03T02:01:00Z',
        performedBy: 'CivicSense Trust Engine',
        role: 'ai_system'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-citizen-1',
    roleTarget: 'citizen',
    title: 'Resolution Ready for Verification',
    message: 'Your complaint regarding Botanical Garden Road garbage has been marked as RESOLVED by Dr. Sunita Varma. Please verify the work and submit your feedback.',
    complaintId: 'CIVIC-2026-HYD-1094',
    type: 'verification_request',
    read: false,
    createdAt: '2026-10-29T16:50:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-auth-roads',
    roleTarget: 'authority',
    title: 'Critical Emergency Dispatched (SLA 12h)',
    message: 'New Critical Pothole (Priority 94) at Cyber Towers Junction assigned to your division. Quick Response vehicle mobilized.',
    complaintId: 'CIVIC-2026-HYD-1092',
    type: 'critical_alert',
    read: false,
    createdAt: '2026-11-01T08:46:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-auth-water',
    roleTarget: 'authority',
    title: 'Transmission Main Leak Reported',
    message: '600mm potable water line break in Miyapur Ward 108. Rapid pressure drop detected by hydraulic sensors.',
    complaintId: 'CIVIC-2026-HYD-1093',
    type: 'assignment',
    read: true,
    createdAt: '2026-11-02T06:31:00Z'
  },
  {
    id: 'notif-4',
    userId: 'user-citizen-2',
    roleTarget: 'citizen',
    title: 'Streetlight Verification Confirmed',
    message: 'Thank you for verifying the streetlight restoration on Gachibowli ORR feeder road. Your 5-star rating has been recorded.',
    complaintId: 'CIVIC-2026-HYD-1095',
    type: 'status_update',
    read: true,
    createdAt: '2026-10-31T20:20:00Z'
  },
  {
    id: 'notif-5',
    userId: 'user-admin',
    roleTarget: 'admin',
    title: 'Trust Layer Alert: Suspicious Submission Flagged',
    message: 'Complaint CIVIC-2026-HYD-1097 flagged with 24/100 trust score (duplicate media hash and GPS anomaly). Pending moderator review.',
    complaintId: 'CIVIC-2026-HYD-1097',
    type: 'system',
    read: false,
    createdAt: '2026-11-03T02:05:00Z'
  }
];

export const INITIAL_CITY_ANALYTICS: CityAnalyticsSummary = {
  totalComplaints: 1420,
  resolvedComplaints: 1184,
  inProgressComplaints: 148,
  pendingReviewComplaints: 88,
  criticalComplaints: 18,
  averageResolutionDays: 1.8,
  citizenSatisfactionPercent: 91.4,
  aiDuplicateCatchRate: 23.6,
  suspiciousReportsBlocked: 42,
  wardPerformance: [
    { ward: 'Ward 104 - Madhapur', total: 240, resolved: 210, critical: 4 },
    { ward: 'Ward 105 - Kondapur', total: 195, resolved: 172, critical: 2 },
    { ward: 'Ward 106 - Gachibowli', total: 310, resolved: 275, critical: 5 },
    { ward: 'Ward 108 - Miyapur', total: 280, resolved: 228, critical: 3 },
    { ward: 'Ward 118 - Kukatpally', total: 265, resolved: 215, critical: 4 },
    { ward: 'Ward 92 - Banjara Hills', total: 130, resolved: 114, critical: 0 }
  ]
};

export const INITIAL_FIELD_WORKERS: FieldWorker[] = [
  {
    id: 'fw-suresh',
    name: 'Suresh Gowd',
    phone: '+91 94405 88991',
    email: 'suresh.gowd@field.civicsense.gov.in',
    departmentId: 'dept-roads',
    departmentName: 'Roads & Infrastructure Engineering',
    jurisdictionWard: 'Serilingampally Zone (Wards 104-106)',
    skills: ['Cold-Mix Bituminous Patching', 'Subgrade Compaction', 'Emergency Barricading'],
    status: 'busy',
    activeTaskCount: 1,
    completedTaskCount: 42,
    rating: 4.8,
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-07-01'
  },
  {
    id: 'fw-naresh',
    name: 'K. Naresh',
    phone: '+91 94406 11223',
    email: 'naresh.water@field.civicsense.gov.in',
    departmentId: 'dept-water',
    departmentName: 'HMWSSB Water Supply & Transmission',
    jurisdictionWard: 'Serilingampally Zone (Ward 108 Miyapur)',
    skills: ['Sluice Valve Isolation', '600mm Collar Welding', 'Pressure Joint Testing'],
    status: 'busy',
    activeTaskCount: 1,
    completedTaskCount: 38,
    rating: 4.7,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-08-15'
  },
  {
    id: 'fw-ismail',
    name: 'Mohammed Ismail',
    phone: '+91 94407 33445',
    email: 'ismail.sanitation@field.civicsense.gov.in',
    departmentId: 'dept-sanitation',
    departmentName: 'Municipal Solid Waste & Sanitation',
    jurisdictionWard: 'Kondapur / Madhapur Circle',
    skills: ['Hydraulic Compactor Operation', 'Hazardous Debris Removal', 'Chemical Sanitization'],
    status: 'available',
    activeTaskCount: 0,
    completedTaskCount: 65,
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-03-10'
  },
  {
    id: 'fw-venkatesh',
    name: 'B. Venkatesh',
    phone: '+91 94408 55667',
    email: 'venkatesh.lights@field.civicsense.gov.in',
    departmentId: 'dept-electricity',
    departmentName: 'TSSPDCL Street Lighting & Public Power',
    jurisdictionWard: 'Gachibowli IT Corridor',
    skills: ['Underground Armored Cable Splicing', 'MCCB Calibration', 'High-Mast LED Replacement'],
    status: 'available',
    activeTaskCount: 0,
    completedTaskCount: 51,
    rating: 4.6,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-05-18'
  },
  {
    id: 'fw-raju',
    name: 'Raju Nayak',
    phone: '+91 94409 77889',
    email: 'raju.drainage@field.civicsense.gov.in',
    departmentId: 'dept-drainage',
    departmentName: 'Stormwater Drainage & Sewerage Control',
    jurisdictionWard: 'Kukatpally Circle (Ward 118)',
    skills: ['Super Sucker Jetting', 'SFRC Manhole Fitting', 'Underground Silt Clearance'],
    status: 'busy',
    activeTaskCount: 1,
    completedTaskCount: 29,
    rating: 4.5,
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-09-01'
  }
];

export const INITIAL_WORKER_TASKS: WorkerTask[] = [
  {
    id: 'TASK-2026-HYD-771',
    complaintId: 'CIVIC-2026-HYD-1092',
    complaintTitle: 'Severe Deep Pothole & Cave-in at Cyber Towers Junction',
    complaintCategory: 'road_potholes',
    location: {
      address: 'Cyber Towers Junction, Main Flyover Entrance, Hitec City',
      landmark: 'Opposite Cyber Pearl Building',
      area: 'Madhapur',
      zone: 'Cyberabad Zone',
      wardNumber: 'Ward 104',
      lat: 17.4504,
      lng: 78.3808
    },
    priorityScore: 94,
    severity: 'critical',
    departmentId: 'dept-roads',
    departmentName: 'Roads & Infrastructure Engineering',
    assigningAdminId: 'user-admin',
    assigningAdminName: 'Sri S. Balasubrahmanyam, IAS',
    assignedWorkerId: 'fw-suresh',
    assignedWorkerName: 'Suresh Gowd',
    assignedAt: '2026-11-01T08:50:00Z',
    deadline: '2026-11-01T20:50:00Z',
    instructions: 'Priority 94 Critical: Two-wheelers at high accident risk. Place reflective cones at 15m distance. Excavate collapsed crater and apply 60mm dense bituminous macadam (DBM). Take clear Before and After photos.',
    status: 'in_progress',
    progressNotes: [
      { timestamp: '2026-11-01T09:15:00Z', note: 'Assignment accepted. En route with QRV-04 patching vehicle.', author: 'Suresh Gowd' },
      { timestamp: '2026-11-01T10:30:00Z', note: 'Arrived on site. Traffic Police diverted left lane. Excavation underway.', author: 'Suresh Gowd' }
    ]
  },
  {
    id: 'TASK-2026-HYD-772',
    complaintId: 'CIVIC-2026-HYD-1093',
    complaintTitle: 'Severe Potable Water Pipeline Burst & Flooding in Miyapur',
    complaintCategory: 'water_leakage',
    location: {
      address: 'Allwyn X Roads, Near Metro Station Pillar 1142, Miyapur',
      landmark: 'Beside HP Petrol Pump',
      area: 'Miyapur',
      zone: 'Serilingampally Zone',
      wardNumber: 'Ward 108',
      lat: 17.4969,
      lng: 78.3614
    },
    priorityScore: 92,
    severity: 'critical',
    departmentId: 'dept-water',
    departmentName: 'HMWSSB Water Supply & Transmission',
    assigningAdminId: 'user-admin',
    assigningAdminName: 'Sri S. Balasubrahmanyam, IAS',
    assignedWorkerId: 'fw-naresh',
    assignedWorkerName: 'K. Naresh',
    assignedAt: '2026-11-02T06:35:00Z',
    deadline: '2026-11-02T14:35:00Z',
    instructions: 'Turn off Sub-Sluice Valve SV-14 immediately to halt water loss. Prepare 600mm MS collar sleeve and dewatering suction pipe for basements.',
    status: 'accepted',
    progressNotes: [
      { timestamp: '2026-11-02T06:45:00Z', note: 'Task accepted. Mobilizing welding team and suction rig.', author: 'K. Naresh' }
    ]
  },
  {
    id: 'TASK-2026-HYD-773',
    complaintId: 'CIVIC-2026-HYD-1096',
    complaintTitle: 'Open Manhole & Toxic Sewage Overflow near Kukatpally Y-Junction',
    complaintCategory: 'drainage_sewage',
    location: {
      address: 'Kukatpally Y-Junction Main Bus Stop, Mumbai Highway',
      landmark: 'Near Balanagar Flyover Ramp',
      area: 'Kukatpally',
      zone: 'Kukatpally Zone',
      wardNumber: 'Ward 118',
      lat: 17.4947,
      lng: 78.4069
    },
    priorityScore: 97,
    severity: 'critical',
    departmentId: 'dept-drainage',
    departmentName: 'Stormwater Drainage & Sewerage Control',
    assigningAdminId: 'user-admin',
    assigningAdminName: 'Sri S. Balasubrahmanyam, IAS',
    assignedWorkerId: 'fw-raju',
    assignedWorkerName: 'Raju Nayak',
    assignedAt: '2026-11-02T14:15:00Z',
    deadline: '2026-11-02T18:15:00Z',
    instructions: 'Immediate life hazard near bus stop. Erect red warning perimeter immediately. Install heavy-duty SFRC lockable cover and jet sewer line.',
    status: 'not_accepted'
  }
];

