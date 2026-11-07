import React, { useState } from 'react';
import { Complaint, Department } from '../../types';
import { PriorityScoreGauge } from '../../components/ai/PriorityScoreGauge';
import { DuplicateDetectionCard } from '../../components/ai/DuplicateDetectionCard';
import { DepartmentRoutingCard } from '../../components/ai/DepartmentRoutingCard';
import { SuspiciousTrustIndicator } from '../../components/ai/SuspiciousTrustIndicator';
import { AuthorityWorkflowIntelligenceCard } from '../../components/ai/AuthorityWorkflowIntelligenceCard';
import { AIPipelineVisualizer } from '../../components/ai/AIPipelineVisualizer';
import { InteractiveCivicMap } from '../../components/map/InteractiveCivicMap';
import { VoiceInputModal } from '../../components/common/VoiceInputModal';
import {
  Sparkles,
  Search,
  Copy,
  TrendingUp,
  Building2,
  ListChecks,
  MapPin,
  BarChart3,
  CheckCircle2,
  Globe,
  ShieldAlert,
  Bot,
  ArrowRight,
  Play
} from 'lucide-react';

interface AIIntelligenceHubProps {
  complaints: Complaint[];
  departments: Department[];
  onOpenAssistant: () => void;
  onOpenInvestigation: (complaintId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AIIntelligenceHub: React.FC<AIIntelligenceHubProps> = ({
  complaints,
  departments,
  onOpenAssistant,
  onOpenInvestigation,
  onNavigateTab
}) => {
  const [activeWorkflowId, setActiveWorkflowId] = useState<number>(1);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [pipelineSimulating, setPipelineSimulating] = useState(false);

  const sampleComplaint = complaints[0];
  const duplicateComplaint = complaints.find((c) => c.aiAnalysis.duplicateDetection.isDuplicateLikely) || complaints[0];
  const suspiciousComplaint = complaints.find((c) => c.aiAnalysis.suspiciousCheck.isFlagged) || complaints[complaints.length - 1];

  const workflows = [
    {
      id: 1,
      title: '1. Intelligent Complaint Understanding',
      icon: Search,
      desc: 'NLP semantic extraction of keywords, category prediction, and issue categorization from unstructured text.'
    },
    {
      id: 2,
      title: '2. Duplicate Complaint Detection',
      icon: Copy,
      desc: 'Geospatial proximity + text cosine similarity + image perceptual hash to identify duplicate submissions.'
    },
    {
      id: 3,
      title: '3. Severity & Priority Prediction',
      icon: TrendingUp,
      desc: 'Multi-criteria 6-factor risk algorithm (0-100) assessing public safety, population impact, and infrastructure damage.'
    },
    {
      id: 4,
      title: '4. Intelligent Department Routing',
      icon: Building2,
      desc: 'Automated jurisdiction mapping matching grievance category to GHMC, HMWSSB, or TSSPDCL with confidence scores.'
    },
    {
      id: 5,
      title: '5. Authority Workflow Intelligence',
      icon: ListChecks,
      desc: 'Field Standard Operating Procedure (SOP) generator, task checklist, and automated SLA breach escalation.'
    },
    {
      id: 6,
      title: '6. Geospatial Civic Intelligence',
      icon: MapPin,
      desc: 'Dynamic interactive map with risk pin color-coding, ward clusters, and density heatmap overlay.'
    },
    {
      id: 7,
      title: '7. City-Level Civic Intelligence',
      icon: BarChart3,
      desc: 'Macro pattern analytics identifying chronic drainage failures, frequent pothole clusters, and department workloads.'
    },
    {
      id: 8,
      title: '8. Resolution Tracking & Verification',
      icon: CheckCircle2,
      desc: 'End-to-end audit loop: authority before/after evidence photos + citizen approval/rejection sign-off.'
    },
    {
      id: 9,
      title: '9. Multilingual & Voice Accessibility',
      icon: Globe,
      desc: 'Tri-lingual support (English, Hindi हिन्दी, Telugu తెలుగు) with speech-to-text voice recognition and TTS.'
    },
    {
      id: 10,
      title: '10. Suspicious-Report & Trust Layer',
      icon: ShieldAlert,
      desc: 'Anti-spam defense evaluating burst frequencies, GPS EXIF mismatches, and duplicate image hashes with human review.'
    },
    {
      id: 11,
      title: '11. Civic Intelligence AI Assistant',
      icon: Bot,
      desc: 'Natural language conversational assistant querying live registry for workload stats, critical complaints, and procedure guides.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#E7F2EC] px-2.5 py-0.5 text-xs font-bold text-[#123D32] border border-[#DFE8E1]">
            Differentiating Architecture
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#263A32] mt-1">
          The 11 Core AI Civic Intelligence Workflows
        </h1>
        <p className="text-xs text-[#687A70]">
          CivicSense AI combines multi-modal computer vision, natural language triage, geospatial
          clustering, and citizen verification loops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Workflow Selector List */}
        <div className="lg:col-span-5 space-y-2">
          {workflows.map((wf) => {
            const Icon = wf.icon;
            const isActive = activeWorkflowId === wf.id;

            return (
              <div
                key={wf.id}
                onClick={() => setActiveWorkflowId(wf.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#237A57] bg-[#E7F2EC] shadow-sm ring-2 ring-[#237A57]/20'
                    : 'border-[#DFE8E1] bg-white hover:bg-[#F4F7F5]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      isActive ? 'bg-[#237A57] text-white' : 'bg-[#F4F7F5] text-[#263A32]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p
                      className={`text-xs font-bold ${
                        isActive ? 'text-[#123D32]' : 'text-[#263A32]'
                      }`}
                    >
                      {wf.title}
                    </p>
                    <p className="text-[11px] text-[#687A70] line-clamp-2 leading-relaxed">
                      {wf.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Interactive Live Workflow Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123D32]">
              Live Workflow Interface Preview (Workflow #{activeWorkflowId})
            </span>
            <span className="text-[11px] text-[#687A70] font-mono">Demo Environment</span>
          </div>

          {/* Workflow 1: Intelligent Understanding */}
          {activeWorkflowId === 1 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#263A32]">
                    Semantic Extractor & Ingestion Pipeline
                  </h3>
                  <button
                    onClick={() => {
                      setPipelineSimulating(true);
                      setTimeout(() => setPipelineSimulating(false), 3000);
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-[#237A57] px-3 py-1 text-xs font-semibold text-white hover:bg-[#123D32] transition-colors"
                  >
                    <Play className="h-3 w-3" /> Re-run 9 Stages
                  </button>
                </div>
                <AIPipelineVisualizer
                  isSimulating={pipelineSimulating}
                  analysisResult={sampleComplaint.aiAnalysis}
                />
              </div>

              <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-2 text-xs">
                <span className="font-semibold text-[#263A32]">Extracted Keywords:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sampleComplaint.aiAnalysis.extractedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-[#E7F2EC] px-2.5 py-1 text-xs font-semibold text-[#123D32] border border-[#DFE8E1]"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Workflow 2: Duplicate Detection */}
          {activeWorkflowId === 2 && (
            <div className="space-y-4">
              <DuplicateDetectionCard
                currentComplaintId={duplicateComplaint.id}
                result={duplicateComplaint.aiAnalysis.duplicateDetection}
              />
            </div>
          )}

          {/* Workflow 3: Severity & Priority */}
          {activeWorkflowId === 3 && (
            <div className="space-y-4">
              <PriorityScoreGauge
                score={sampleComplaint.aiAnalysis.priorityScore}
                severity={sampleComplaint.aiAnalysis.severity}
                category={sampleComplaint.aiAnalysis.priorityCategory}
                breakdown={sampleComplaint.aiAnalysis.priorityBreakdown}
              />
            </div>
          )}

          {/* Workflow 4: Intelligent Department Routing */}
          {activeWorkflowId === 4 && (
            <div className="space-y-4">
              <DepartmentRoutingCard
                complaintId={sampleComplaint.id}
                recommendedDepartmentId={sampleComplaint.aiAnalysis.recommendedDepartmentId}
                recommendedDepartmentName={sampleComplaint.aiAnalysis.recommendedDepartmentName}
                routingReasoning={sampleComplaint.aiAnalysis.routingReasoning}
                currentAssignedDepartmentId={sampleComplaint.assignedDepartmentId}
                wardZone={`${sampleComplaint.location.wardNumber} (${sampleComplaint.location.zone})`}
              />
            </div>
          )}

          {/* Workflow 5: Authority Workflow Intelligence */}
          {activeWorkflowId === 5 && (
            <div className="space-y-4">
              <AuthorityWorkflowIntelligenceCard complaint={sampleComplaint} />
            </div>
          )}

          {/* Workflow 6: Geospatial Civic Intelligence */}
          {activeWorkflowId === 6 && (
            <div className="space-y-3">
              <p className="text-xs text-[#687A70]">
                Interactive city-wide pins color-coded by severity, with circle heatmap overlay for
                high-density problem corridors:
              </p>
              <InteractiveCivicMap complaints={complaints} height="380px" />
            </div>
          )}

          {/* Workflow 7: City-Level Civic Intelligence */}
          {activeWorkflowId === 7 && (
            <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#263A32]">
                Chronic Hotspot Identification & Municipal Insights
              </h3>
              <div className="space-y-2.5">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-950">
                  <p className="font-bold flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-red-600" /> Chronic Road Depression: Madhapur Cyber Towers
                  </p>
                  <p className="text-[11px] text-red-800 mt-0.5">
                    18 grievances reported in 3 weeks. Recommendation: Full structural sub-base resurfacing instead of patch cold-mix.
                  </p>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-950">
                  <p className="font-bold flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-amber-600" /> SWM Waste Cluster: Kondapur Botanical Garden
                  </p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Footpath dumping recurring every 48 hours. Recommendation: Install permanent CCTV deterrent and deploy 2x secondary collection bins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Workflow 8: Resolution Tracking & Verification */}
          {activeWorkflowId === 8 && (
            <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#263A32]">
                Citizen Verification Protocol
              </h3>
              <p className="text-xs text-[#687A70]">
                Authorities submit before-and-after photographs. The grievance is not considered
                closed until the citizen inspects the work and formally verifies completion.
              </p>
              <button
                onClick={() => onNavigateTab('citizen_track')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-4 py-2 text-xs font-bold text-white hover:bg-[#123D32] transition-colors"
              >
                <span>Test Citizen Verification Flow</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Workflow 9: Multilingual & Voice Accessibility */}
          {activeWorkflowId === 9 && (
            <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#263A32]">
                Multilingual & Voice Interface (English, Hindi, Telugu)
              </h3>
              <p className="text-[#687A70] leading-relaxed">
                Empowering all citizens with voice dictation in their mother tongue, wave animation,
                sample prompts, and text-to-speech audio feedback.
              </p>

              <button
                onClick={() => setIsVoiceOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Launch Voice Input Simulator</span>
              </button>
            </div>
          )}

          {/* Workflow 10: Suspicious Report Layer */}
          {activeWorkflowId === 10 && (
            <div className="space-y-4">
              <SuspiciousTrustIndicator
                complaintId={suspiciousComplaint.id}
                check={suspiciousComplaint.aiAnalysis.suspiciousCheck}
              />
            </div>
          )}

          {/* Workflow 11: Civic Intelligence AI Assistant */}
          {activeWorkflowId === 11 && (
            <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#263A32]">
                Civic Intelligence AI Assistant
              </h3>
              <p className="text-[#687A70] leading-relaxed">
                Answers natural language questions about the live complaint dataset, department
                backlogs, critical incidents, and procedure guidelines.
              </p>

              <button
                onClick={onOpenAssistant}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
              >
                <Bot className="h-4 w-4" />
                <span>Open Conversational AI Assistant</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Voice Modal instance */}
      <VoiceInputModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptComplete={(txt) => {
          alert(`Recognized Voice Transcript: "${txt}"`);
        }}
      />
    </div>
  );
};

