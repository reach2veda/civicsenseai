import React from 'react';
import {
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  MapPin,
  Clock,
  Activity,
  Layers,
  Search,
  Copy,
  TrendingUp,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Bot,
  ExternalLink,
  Wrench
} from 'lucide-react';
import { Complaint } from '../../types';
import { InteractiveCivicMap } from '../../components/map/InteractiveCivicMap';

interface LandingPageProps {
  complaints: Complaint[];
  onOpenAuth: () => void;
  onExploreDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  complaints,
  onOpenAuth,
  onExploreDashboard
}) => {
  return (
    <div className="min-h-screen bg-[#F4F7F5] font-sans text-[#263A32] selection:bg-[#237A57] selection:text-white overflow-x-hidden">
      {/* ================= TOP NAVIGATION ================= */}
      <header className="sticky top-0 z-50 border-b border-[#DFE8E1] bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onExploreDashboard}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#123D32] to-[#237A57] text-white shadow-md">
              <Shield className="h-6 w-6 font-black" />
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-lg font-black tracking-tight text-[#123D32]">
                CivicSense <span className="text-[#237A57]">AI</span>
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#687A70]">
                GovTech Intelligence Mesh
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#687A70]">
            <a href="#how-it-works" className="hover:text-[#237A57] transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-[#237A57] transition-colors">
              Citizen & Authority Benefits
            </a>
            <a href="#capabilities" className="hover:text-[#237A57] transition-colors">
              11 AI Capabilities
            </a>
            <a href="#map-preview" className="hover:text-[#237A57] transition-colors">
              City Map Preview
            </a>
            <a href="#impact" className="hover:text-[#237A57] transition-colors">
              Platform Impact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold text-[#263A32] hover:text-[#237A57] px-3 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAuth}
              className="rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-[#237A57]/20 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-[#F4F7F5] to-[#F4F7F5]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DFE8E1] bg-[#E7F2EC] px-4 py-1.5 text-xs font-bold text-[#123D32] shadow-xs">
            <Sparkles className="h-4 w-4 text-[#237A57]" />
            <span>Next-Generation AI Grievance Intelligence</span>
            <span className="hidden sm:inline text-[#687A70]">•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#237A57]">
              Your City. Your Voice. Our Intelligence.
            </span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#123D32] leading-[1.1]">
              Transforming Complaints Into{' '}
              <span className="text-[#237A57]">
                Smarter Cities.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#687A70] max-w-2xl mx-auto leading-relaxed">
              CivicSense AI replaces broken complaint portals with an enterprise GovTech operations
              mesh — featuring multi-factor risk scoring, duplicate detection, smart department
              routing, and citizen verification.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-[#237A57]/30 hover:scale-105 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreDashboard}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DFE8E1] bg-white px-6 py-3.5 text-sm font-semibold text-[#263A32] shadow-xs hover:bg-[#F4F7F5] transition-all"
            >
              <Activity className="h-4 w-4 text-[#237A57]" />
              <span>Explore Live Platform</span>
            </button>
          </div>

          {/* AI City Connected Illustration Card */}
          <div className="relative mt-12 max-w-5xl mx-auto rounded-3xl border border-[#DFE8E1] bg-white p-5 sm:p-8 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-4 mb-6 text-xs text-[#687A70]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#237A57] animate-ping" />
                <span className="font-mono text-[#123D32] font-bold">
                  CIVICSENSE AUTONOMOUS CITY GRID • HYDERABAD MESH
                </span>
              </div>
              <span className="hidden sm:inline font-mono text-[#687A70]">
                142 Wards Telemetry Active
              </span>
            </div>

            {/* Smart City Schematic Network */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-red-100 px-2 py-0.5 font-bold text-red-700 border border-red-200">
                    CRITICAL HAZARD
                  </span>
                  <span className="font-mono text-[#687A70] text-[11px]">Madhapur Node</span>
                </div>
                <h4 className="text-sm font-bold text-[#263A32]">4ft Pothole at Cyber Towers</h4>
                <p className="text-xs text-[#687A70]">
                  AI Risk Score: <strong className="text-red-600">94/100</strong> • Dispatched to
                  Roads Division QRV-04.
                </p>
                <div className="w-full bg-red-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-red-500 h-full w-[94%]" />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-[#123D32] border border-emerald-200">
                    RESOLVED & VERIFIED
                  </span>
                  <span className="font-mono text-[#687A70] text-[11px]">Gachibowli ORR</span>
                </div>
                <h4 className="text-sm font-bold text-[#263A32]">Streetlight Cluster Restored</h4>
                <p className="text-xs text-[#687A70]">
                  Citizen verified via after-photo • Rating:{' '}
                  <strong className="text-[#237A57]">5.0 / 5.0</strong>.
                </p>
                <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#237A57] h-full w-[100%]" />
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 font-bold text-blue-700 border border-blue-200">
                    SEWERAGE CONTROL
                  </span>
                  <span className="font-mono text-[#687A70] text-[11px]">Kukatpally Y-Junction</span>
                </div>
                <h4 className="text-sm font-bold text-[#263A32]">Manhole Hazard Secured</h4>
                <p className="text-xs text-[#687A70]">
                  SFRC cover locked • Jetting unit cleared downstream block.
                </p>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-blue-500 h-full w-[88%]" />
                </div>
              </div>
            </div>

            {/* Micro Live Nodes Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-around gap-4 rounded-xl bg-[#E7F2EC] p-3 text-xs text-[#263A32] border border-[#DFE8E1]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#237A57]" /> Duplicate Suppression: 23.6%
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-[#237A57]" /> Emergency SLA Target: &lt; 8 Hours
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#237A57]" /> Trust Verification: 99.1%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-20 border-t border-[#DFE8E1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#237A57]">
              The 5-Step Civic Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D32]">
              How CivicSense AI Works
            </h2>
            <p className="text-sm text-[#687A70] max-w-xl mx-auto">
              From grievance registration to field remediation and citizen confirmation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Citizen Files Grievance',
                desc: 'Uploads photo evidence, GPS location pin, or dictates with voice in EN/HI/TE.',
                icon: Users
              },
              {
                step: '02',
                title: 'AI Ingestion Analysis',
                desc: 'Evaluates priority (0–100), checks 60m duplicate radii, and spots spam anomalies.',
                icon: Sparkles
              },
              {
                step: '03',
                title: 'Smart Agency Dispatch',
                desc: 'Auto-routed to responsible engineers (GHMC, HMWSSB, TSSPDCL) with SLA deadlines.',
                icon: Building2
              },
              {
                step: '04',
                title: 'Technician Remediation',
                desc: 'Field teams upload before & after photographs, material logs, and contractor sign-off.',
                icon: Wrench
              },
              {
                step: '05',
                title: 'Citizen Verification',
                desc: 'Citizen approves or rejects the outcome with star rating before the ticket permanently closes.',
                icon: CheckCircle2
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#DFE8E1] bg-[#F4F7F5] p-5 space-y-3 relative group hover:border-[#237A57] hover:bg-white transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-[#237A57]/30 group-hover:text-[#237A57] transition-colors">
                      {item.step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F2EC] text-[#237A57] border border-[#DFE8E1]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#263A32]">{item.title}</h3>
                  <p className="text-xs text-[#687A70] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CITIZEN & AUTHORITY BENEFITS ================= */}
      <section id="benefits" className="py-20 border-t border-[#DFE8E1] bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#237A57]">
              Built For The Entire Civic Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D32]">
              Two Sides. One Unified Platform.
            </h2>
            <p className="text-sm text-[#687A70] max-w-xl mx-auto">
              Empowering citizens with radical transparency while equipping engineers with autonomous operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Citizen Benefits Card */}
            <div className="rounded-3xl border border-[#DFE8E1] bg-white p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-3 border-b border-[#DFE8E1] pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F2EC] text-[#237A57] border border-[#DFE8E1]">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#123D32]">Citizen Portal Experience</h3>
                  <p className="text-xs text-[#687A70]">Accountability, speed, and genuine voice</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'One-Click Voice Grievance',
                    desc: 'Dictate in Telugu, Hindi, or English. AI extracts problem, landmark, and severity automatically.'
                  },
                  {
                    title: '6-Stage Transparent Tracking',
                    desc: 'Know exactly which officer has your ticket, what materials are ordered, and the target SLA.'
                  },
                  {
                    title: 'Resolution Power in Your Hands',
                    desc: 'A complaint cannot be closed by authorities alone. You inspect after-photos and sign off.'
                  },
                  {
                    title: 'Interactive City Hazard Map',
                    desc: 'Discover recurring potholes, water leaks, and uncollected waste across your neighborhood.'
                  }
                ].map((b, i) => (
                  <div key={i} className="rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-4 space-y-1.5">
                    <p className="text-xs font-bold text-[#123D32] flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#237A57]" />
                      {b.title}
                    </p>
                    <p className="text-xs text-[#687A70] leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Authority Benefits Card */}
            <div className="rounded-3xl border border-[#DFE8E1] bg-white p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-3 border-b border-[#DFE8E1] pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F2EC] text-[#237A57] border border-[#DFE8E1]">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#123D32]">Authority Operations Command</h3>
                  <p className="text-xs text-[#687A70]">Automated triage, duplicate suppression, and field dispatch</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Autonomous Duplicate Suppression',
                    desc: 'Fuses identical complaints within 60 meters to save up to 30% of unnecessary inspection trips.'
                  },
                  {
                    title: 'Multi-Factor AI Priority (0–100)',
                    desc: 'Objectively ranks grievances by public safety risk, affected population, and infrastructure damage.'
                  },
                  {
                    title: 'SLA Escalation Matrix',
                    desc: 'Automatic sirens and auto-reallocation to higher zonal directors before public SLAs breach.'
                  },
                  {
                    title: 'Anti-Spam & Trust Telemetry',
                    desc: 'Heuristic anomaly detection flags fabricated complaints, duplicate media hashes, and bot floods.'
                  }
                ].map((b, i) => (
                  <div key={i} className="rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-4 space-y-1.5">
                    <p className="text-xs font-bold text-[#123D32] flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#237A57]" />
                      {b.title}
                    </p>
                    <p className="text-xs text-[#687A70] leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 11 AI CAPABILITIES ================= */}
      <section id="capabilities" className="py-20 border-t border-[#DFE8E1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#237A57]">
              Intelligent GovTech Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D32]">
              11 Core AI Intelligence Capabilities
            </h2>
            <p className="text-sm text-[#687A70] max-w-xl mx-auto">
              Every submitted grievance runs through our autonomous multimodal intelligence pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: '01',
                title: 'Automated Grievance Classification',
                desc: 'NLP taxonomy categorizes road hazards, water leaks, sewage, garbage, and streetlights with 98.4% precision.',
                icon: Layers
              },
              {
                id: '02',
                title: 'Multi-Factor Priority Scoring',
                desc: 'Calculates objective 0–100 urgency using public safety risk, population density, and infrastructure impact.',
                icon: TrendingUp
              },
              {
                id: '03',
                title: 'Geospatial Duplicate Detection',
                desc: 'Detects spatial clusters within 60 meters and aggregates redundant reports under master tickets.',
                icon: Copy
              },
              {
                id: '04',
                title: 'Intelligent Department Routing',
                desc: 'Determines jurisdictional ownership between GHMC, HMWSSB, and TSSPDCL based on issue ontology.',
                icon: Building2
              },
              {
                id: '05',
                title: 'Computer Vision Evidence Verification',
                desc: 'Audits before-and-after photographs to confirm pothole patching, debris removal, or pipe restoration.',
                icon: Search
              },
              {
                id: '06',
                title: 'SLA Breach Prediction',
                desc: 'Machine learning forecasting models alert coordinators before severe public safety deadlines expire.',
                icon: Clock
              },
              {
                id: '07',
                title: 'Trust & Anti-Spam Detection',
                desc: 'Heuristics score user credibility, image hash uniqueness, and submission frequency to prevent fake alerts.',
                icon: ShieldAlert
              },
              {
                id: '08',
                title: 'Multilingual Ingestion & Speech',
                desc: 'Instant voice transcription and natural language translation in English, Telugu, and Hindi.',
                icon: Globe
              },
              {
                id: '09',
                title: 'Citizen Resolution Verification',
                desc: 'Enforces proof-of-work closure where citizens rate remediated sites before official archiving.',
                icon: CheckCircle2
              },
              {
                id: '10',
                title: 'Geospatial Telemetry & Hotspots',
                desc: 'Generates live municipal density heatmaps to identify chronic infrastructure decay zones.',
                icon: MapPin
              },
              {
                id: '11',
                title: 'Autonomous Civic AI Assistant',
                desc: 'Conversational agent answering queries on department workloads, SLA status, and municipal history.',
                icon: Bot
              }
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-[#DFE8E1] bg-[#F4F7F5] p-5 space-y-3 hover:border-[#237A57] hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#123D32] bg-[#E7F2EC] px-2 py-0.5 rounded border border-[#DFE8E1]">
                      AI #{c.id}
                    </span>
                    <Icon className="h-5 w-5 text-[#237A57]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#263A32]">{c.title}</h4>
                  <p className="text-xs text-[#687A70] leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE MAP PREVIEW ================= */}
      <section id="map-preview" className="py-20 border-t border-[#DFE8E1] bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#237A57]">
                Live City Intelligence
              </span>
              <h2 className="text-3xl font-extrabold text-[#123D32]">
                Geospatial Incident Telemetry
              </h2>
              <p className="text-xs text-[#687A70]">
                Explore live potholes, water leaks, and waste reports mapped across Greater Hyderabad
              </p>
            </div>

            <button
              onClick={onExploreDashboard}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-white px-4 py-2 text-xs font-bold text-[#263A32] hover:bg-[#E7F2EC] hover:text-[#123D32] transition-colors shadow-2xs"
            >
              <span>Open Full Operations Map</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#237A57]" />
            </button>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#DFE8E1] shadow-xl bg-white">
            <InteractiveCivicMap complaints={complaints} height="520px" />
          </div>
        </div>
      </section>

      {/* ================= PLATFORM IMPACT STATS ================= */}
      <section id="impact" className="py-20 border-t border-[#DFE8E1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#237A57]">
              Demonstrated Operational Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123D32]">
              Civic Platform Impact
            </h2>
            <p className="text-xs text-[#687A70]">Simulated telemetry based on real-world municipal workflows</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#DFE8E1] bg-[#F4F7F5] p-6 text-center space-y-1 shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-[#123D32] font-mono">
                98.4%
              </span>
              <p className="text-xs font-bold text-[#263A32]">Classification Precision</p>
              <p className="text-[11px] text-[#687A70]">Across 6 civic categories</p>
            </div>

            <div className="rounded-2xl border border-[#DFE8E1] bg-[#F4F7F5] p-6 text-center space-y-1 shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-[#237A57] font-mono">
                91.4%
              </span>
              <p className="text-xs font-bold text-[#263A32]">Citizen Approval Rating</p>
              <p className="text-[11px] text-[#687A70]">Post-resolution sign-offs</p>
            </div>

            <div className="rounded-2xl border border-[#DFE8E1] bg-[#F4F7F5] p-6 text-center space-y-1 shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">
                23.6%
              </span>
              <p className="text-xs font-bold text-[#263A32]">Duplicates Merged</p>
              <p className="text-[11px] text-[#687A70]">Suppresses redundant dispatches</p>
            </div>

            <div className="rounded-2xl border border-[#DFE8E1] bg-[#F4F7F5] p-6 text-center space-y-1 shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-[#123D32] font-mono">
                18 Hours
              </span>
              <p className="text-xs font-bold text-[#263A32]">Average Resolution Time</p>
              <p className="text-[11px] text-[#687A70]">Critical incidents prioritized</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#1B5244] bg-[#123D32] py-12 text-[#A7C2B4] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#123D32]">
                  <Shield className="h-5 w-5 font-black text-[#123D32]" />
                </div>
                <span className="text-base font-black text-white">
                  CivicSense <span className="text-[#A3E0C8]">AI</span>
                </span>
              </div>
              <p className="text-[#A7C2B4] leading-relaxed">
                Autonomous GovTech civic intelligence mesh uniting citizens, municipal engineers,
                and administrative leaders.
              </p>
              <p className="font-mono text-[11px] text-[#A3E0C8]">
                Your City. Your Voice. Our Intelligence.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Platform Links
              </p>
              <ul className="space-y-1.5 text-[#A7C2B4]">
                <li>
                  <button onClick={onOpenAuth} className="hover:text-white transition-colors">
                    Citizen Portal
                  </button>
                </li>
                <li>
                  <button onClick={onOpenAuth} className="hover:text-white transition-colors">
                    Authority Queue
                  </button>
                </li>
                <li>
                  <button onClick={onOpenAuth} className="hover:text-white transition-colors">
                    Central Admin
                  </button>
                </li>
                <li>
                  <button onClick={onExploreDashboard} className="hover:text-white transition-colors">
                    Geospatial Map
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Participating Agencies
              </p>
              <ul className="space-y-1.5 text-[#A7C2B4]">
                <li>Greater Hyderabad Municipal Corporation (GHMC)</li>
                <li>HMWSSB Water Supply & Sewerage</li>
                <li>TSSPDCL Public Power & Streetlighting</li>
                <li>Cyberabad Traffic Enforcement Mesh</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Demo & Architecture
              </p>
              <p className="text-[#A7C2B4] leading-relaxed text-[11px]">
                Prototype Phase: Frontend simulation running on React 18, TypeScript, Tailwind CSS,
                and Leaflet. Prepared for Supabase Auth, PostgreSQL (PostGIS / pgvector), and FastAPI
                ML inference services.
              </p>
            </div>
          </div>

          <div className="border-t border-[#1B5244] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#A7C2B4] text-[11px]">
            <p>© 2026 CivicSense AI Inc. All rights reserved. Demo Environment.</p>
            <p>Designed for Modern AI GovTech Innovation & Smart Cities</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
