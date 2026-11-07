# CivicSense AI — Civic Intelligence & Public Grievance Operations Platform

> **A modern, responsive, enterprise-grade civic technology platform** empowering citizens, government authorities, and city administrators to report, triage, analyze, and resolve public infrastructure grievances with AI-driven intelligence.

---

## 🌟 Key Features & Ecosystem Architecture

CivicSense AI is designed not merely as a complaint registration form, but as a complete civic intelligence operations platform featuring 3 distinct user portals and **11 Core AI Intelligence Workflows**.

### 1. Three Dedicated User Portals
- **Citizen Portal**:
  - Personal complaint history and live status tracking
  - File grievances with photo evidence, landmark tags, GPS coordinates, and interactive map pin dropping
  - **9-Stage AI Ingestion Pipeline** visualizer running semantic classification, duplicate detection, and risk scoring
  - **Citizen Resolution Verification**: Citizens review before-and-after photographic evidence, provide 1-5 star ratings, and formally approve resolution or reopen grievances
  - Multilingual voice dictation simulator (English, हिन्दी, తెలుగు)
  - Citizen AI Assistant with guidance on filing and municipal services
- **Government Authority Operations**:
  - Real-time command dashboard with KPI counters (Critical, High, Medium, Low) and Recharts telemetry
  - Official grievance queue with multi-criteria filtering (category, severity, status, ward) and sorting
  - Comprehensive **Complaint Investigation View** featuring AI summaries, keyword tags, duplicate comparison, 6-factor priority breakdown, department jurisdiction routing, and anti-spam indicators
  - Interactive SOP task checklists and automatic SLA countdown alerts
  - Field closeout manager with before/after evidence uploads and contractor documentation
- **Central Administrator Portal**:
  - Municipal line department registry (GHMC, HMWSSB, TSSPDCL) with staff allocation and jurisdiction ward mapping
  - User and authority credential management with instant status activation/deactivation
  - Platform-wide monitoring with Leaflet geospatial maps, risk pins, and hotspot heatmap overlays
  - Dedicated **AI Intelligence Hub** showcasing all 11 AI workflows with live interactive previews

---

## 🧠 The 11 Core AI Intelligence Workflows

| # | Workflow | Description |
|---|---|---|
| **1** | **Intelligent Complaint Understanding** | NLP semantic extraction of keywords, category prediction, and issue categorization from unstructured text descriptions. |
| **2** | **Duplicate Complaint Detection** | Geospatial distance calculation + text cosine similarity + image hash matching to identify duplicate submissions with human-in-the-loop review. |
| **3** | **Severity & Priority Prediction** | Multi-factor risk algorithm scoring grievances from 0–100 across 6 dimensions: Public Safety, Duration Urgency, Infrastructure Damage, Population Impact, Location Sensitivity, and Repeat Frequency. |
| **4** | **Intelligent Department Routing** | Automatic jurisdiction classification routing tickets to Roads, Solid Waste, Water Works, Drainage, Electricity, or Public Health with confidence percentages and reassignment tools. |
| **5** | **Authority Workflow Intelligence** | Standard Operating Procedure (SOP) generator, task checklists, and automated 4-hour SLA breach escalation alerts. |
| **6** | **Geospatial Civic Intelligence** | Dynamic Leaflet interactive map with custom severity pin markers, ward clusters, and circle heatmap overlays in Greater Hyderabad (Madhapur, Gachibowli, Kondapur, Miyapur, Kukatpally, Banjara Hills). |
| **7** | **City-Level Civic Intelligence** | Macro pattern analytics identifying chronic road depressions, repeat dumping hotspots, and ward efficiency metrics. |
| **8** | **Resolution Tracking & Verification** | End-to-end accountability loop where authorities submit before/after evidence and citizens formally approve or reject with star ratings. |
| **9** | **Multilingual & Voice Accessibility** | Tri-lingual interface supporting English, Hindi (हिन्दी), and Telugu (తెలుగు) with simulated speech-to-text voice recognition and Web Speech synthesis. |
| **10** | **Suspicious-Report & Trust Layer** | Anti-spam moderation evaluating burst frequencies, GPS EXIF mismatches, and recycled image hashes without penalizing citizens automatically. |
| **11** | **Civic Intelligence AI Assistant** | Conversational AI assistant providing structured insights, quick stats, and deep links into the live complaint registry. |

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling & Design System**: Tailwind CSS with custom Civic palette
- **Interactive Geospatial Maps**: Leaflet & React-Leaflet
- **Data Visualizations & Analytics**: Recharts
- **Icons**: Lucide Icons
- **State Management & Persistence**: LocalStorage-backed Centralized Storage Service (`StorageService`) with realistic Greater Hyderabad seed records

---

## 🚀 Running the Application Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Production Build**:
   ```bash
   npm run build
   ```

4. **Reset Demo Data**:
   Click the **"Reset Demo Data"** button in the top navigation bar at any time to restore the default seed dataset.

---

## 🔮 Future Backend Architecture Plan

The codebase is modularly partitioned to facilitate future backend integration:
- **API Services**: FastAPI (Python) for microservices & ML inference
- **Database**: Supabase PostgreSQL with PostGIS for geospatial indexing and `pgvector` for semantic complaint embeddings
- **Authentication & Storage**: Supabase Auth and Supabase Storage for secure media uploads
- **Real-Time Mesh**: Supabase Realtime for instant field authority notifications

