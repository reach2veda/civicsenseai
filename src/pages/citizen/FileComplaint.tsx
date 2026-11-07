import React, { useState } from 'react';
import { User, ComplaintCategory, Complaint } from '../../types';
import { StorageService } from '../../services/storageService';
import { ComplaintDbService } from '../../services/complaintDbService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { AISimulationService } from '../../services/aiSimulationService';
import { AIPipelineVisualizer } from '../../components/ai/AIPipelineVisualizer';
import { InteractiveCivicMap } from '../../components/map/InteractiveCivicMap';
import { VoiceInputModal } from '../../components/common/VoiceInputModal';
import {
  FileText,
  Mic,
  MapPin,
  Camera,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

interface FileComplaintProps {
  currentUser: User;
  onComplaintSubmitted: (complaintId: string) => void;
}

export const FileComplaint: React.FC<FileComplaintProps> = ({
  currentUser,
  onComplaintSubmitted
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('road_potholes');
  const [subcategory, setSubcategory] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('Madhapur');
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: 17.4485,
    lng: 78.3740
  });
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'
  );
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Pipeline simulation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingComplaint, setPendingComplaint] = useState<Complaint | null>(null);

  // Hyderabad Areas
  const hyderabadAreas = [
    { name: 'Madhapur', zone: 'Cyberabad Zone', ward: 'Ward 104', lat: 17.4485, lng: 78.3740 },
    { name: 'Gachibowli', zone: 'Cyberabad Zone', ward: 'Ward 106', lat: 17.4401, lng: 78.3489 },
    { name: 'Kondapur', zone: 'Serilingampally Zone', ward: 'Ward 105', lat: 17.4648, lng: 78.3662 },
    { name: 'Miyapur', zone: 'Serilingampally Zone', ward: 'Ward 108', lat: 17.4969, lng: 78.3614 },
    { name: 'Kukatpally', zone: 'Kukatpally Zone', ward: 'Ward 118', lat: 17.4947, lng: 78.4069 },
    { name: 'Banjara Hills', zone: 'Khairatabad Zone', ward: 'Ward 92', lat: 17.4156, lng: 78.4350 }
  ];

  const handleAreaSelect = (areaName: string) => {
    setArea(areaName);
    const match = hyderabadAreas.find((a) => a.name === areaName);
    if (match) {
      setSelectedCoords({ lat: match.lat, lng: match.lng });
    }
  };

  const handleMapPick = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setAddress(`Geo-Coordinates: ${lat.toFixed(4)} N, ${lng.toFixed(4)} E (Ward Area)`);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the complaint title and description.');
      return;
    }

    setSubmitError(null);
    setPendingComplaint(null);
    setIsAnalyzing(true);
    const selectedAreaMeta = hyderabadAreas.find((a) => a.name === area) || hyderabadAreas[0];

    // Generate unique ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CIVIC-2026-HYD-${randomNum}`;

    // Run simulated AI analysis
    const aiAnalysis = await AISimulationService.analyzeComplaint({
      title,
      description,
      category,
      subcategory: subcategory || undefined,
      location: {
        address: address || `${area} Main Road`,
        landmark: landmark || 'Near metro line',
        area: selectedAreaMeta.name,
        zone: selectedAreaMeta.zone,
        wardNumber: selectedAreaMeta.ward,
        lat: selectedCoords.lat,
        lng: selectedCoords.lng
      },
      hasMedia: Boolean(imagePreview),
      mediaUrl: imagePreview || undefined
    });

    const newComplaint: Complaint = {
      id: newId,
      title,
      description,
      category,
      subcategory: subcategory || aiAnalysis.detectedSubcategory,
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenPhone: currentUser.phone,
      submittedAt: new Date().toISOString(),
      location: {
        address: address || `${area} Main Road, Hyderabad`,
        landmark: landmark || 'Near Main Junction',
        area: selectedAreaMeta.name,
        zone: selectedAreaMeta.zone,
        wardNumber: selectedAreaMeta.ward,
        lat: selectedCoords.lat,
        lng: selectedCoords.lng
      },
      mediaUrls: imagePreview ? [imagePreview] : [],
      status: 'submitted',
      assignedDepartmentId: aiAnalysis.recommendedDepartmentId,
      assignedDepartmentName: aiAnalysis.recommendedDepartmentName,
      aiAnalysis,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          status: 'submitted',
          title: 'Complaint Registered',
          description: `Grievance submitted by citizen ${currentUser.name}.`,
          timestamp: new Date().toISOString(),
          performedBy: currentUser.name,
          role: 'citizen'
        }
      ],
      tags: [area, category, aiAnalysis.priorityCategory],
      upvotesCount: 1
    };

    if (isSupabaseConfigured()) {
      const dbRes = await ComplaintDbService.createComplaint({
        title,
        description,
        category,
        citizenId: currentUser.id,
        priority: aiAnalysis.severity,
        latitude: selectedCoords.lat,
        longitude: selectedCoords.lng,
        departmentId: aiAnalysis.recommendedDepartmentId,
        aiAnalysis
      });

      if (dbRes.error) {
        setIsAnalyzing(false);
        setSubmitError(dbRes.error);
        setPendingComplaint(newComplaint);
        return;
      }

      if (dbRes.data) {
        if (!dbRes.aiAnalysisPersisted && dbRes.aiAnalysisError) {
          console.warn(
            'Complaint registered in database, but AI analysis record was rejected by Supabase RLS/constraints:',
            dbRes.aiAnalysisError
          );
        }
        StorageService.saveComplaint(dbRes.data);
        setTimeout(() => {
          setIsAnalyzing(false);
          onComplaintSubmitted(dbRes.data!.id);
        }, 1800);
        return;
      }
    }

    // Local sandbox fallback when Supabase is not configured
    StorageService.saveComplaint(newComplaint);

    setTimeout(() => {
      setIsAnalyzing(false);
      onComplaintSubmitted(newId);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#263A32] font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#123D32]">
          File a Public Civic Grievance
        </h1>
        <p className="text-xs text-[#687A70]">
          Submit road damage, sewage, garbage, or water issues. CivicSense AI will automatically
          assess priority, check duplicates, and route to the authorized department.
        </p>
      </div>

      {/* Database Error State Banner */}
      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 space-y-2">
          <div className="flex items-start gap-2.5 font-bold">
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white uppercase">
              Database Write Failed
            </span>
            <span>{submitError}</span>
          </div>
          <p className="text-[11px] text-red-700 leading-snug">
            Supabase rejected the complaint write (e.g. active authenticated session required by RLS).
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-200"
            >
              Dismiss
            </button>
            {pendingComplaint && (
              <button
                type="button"
                onClick={() => {
                  StorageService.saveComplaint(pendingComplaint);
                  setSubmitError(null);
                  onComplaintSubmitted(pendingComplaint.id);
                }}
                className="rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-50"
              >
                Store in Local Sandbox (Demo Fallback)
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Pipeline Modal or In-place Visualizer when analyzing */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl">
            <AIPipelineVisualizer isSimulating={true} />
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Issue Details */}
        <div className="rounded-xl border border-[#DFE8E1] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#123D32] border-b border-[#DFE8E1] pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#237A57]" />
            <span>1. Issue Details & Categorization</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#263A32]">Complaint Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
              >
                <option value="road_potholes">Road damage and potholes</option>
                <option value="garbage_waste">Garbage and waste management</option>
                <option value="water_leakage">Water leakage</option>
                <option value="drainage_sewage">Drainage and sewage overflow</option>
                <option value="streetlight_failures">Streetlight failures & dark zones</option>
                <option value="public_sanitation">Public sanitation & restrooms</option>
                <option value="traffic_infrastructure">Traffic & public infrastructure</option>
                <option value="other_civic">Other civic issues</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#263A32]">Specific Subcategory (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Deep pothole, missing manhole, burst pipe"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#263A32]">Complaint Title / Summary *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dangerous 4ft Pothole near Hitec City Flyover Ramp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#263A32]">
                Detailed Description & Impact *
              </label>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#123D32] hover:bg-[#D9E8DF] bg-[#E7F2EC] px-2 py-0.5 rounded-md border border-[#DFE8E1]"
              >
                <Mic className="h-3.5 w-3.5 text-[#237A57]" />
                <span>Voice Dictation (EN/HI/TE)</span>
              </button>
            </div>
            <textarea
              required
              rows={4}
              placeholder="Describe what happened, how long the issue has persisted, risks to pedestrians or vehicles, and exact location markers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            />
          </div>
        </div>

        {/* Card 2: Location & Map Pin */}
        <div className="rounded-xl border border-[#DFE8E1] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-2">
            <h2 className="text-sm font-bold text-[#123D32] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#237A57]" />
              <span>2. Geospatial Location (Hyderabad Wards)</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowMapPicker(!showMapPicker)}
              className="text-xs font-semibold text-[#237A57] hover:underline"
            >
              {showMapPicker ? 'Hide Map Picker' : '📍 Drop Pin on Interactive Map'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#263A32]">Hyderabad Area / Ward *</label>
              <select
                value={area}
                onChange={(e) => handleAreaSelect(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
              >
                {hyderabadAreas.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} ({a.ward} - {a.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#263A32]">Street Address / Road Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Near Cyber Gateway, Main Hitec City Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#263A32]">Notable Landmark</label>
              <input
                type="text"
                placeholder="e.g. Opposite Pillar 1142 or Metro Gate 2"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2.5 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#687A70] bg-[#F4F7F5] p-2.5 rounded-lg border border-[#DFE8E1]">
            <span className="font-semibold text-[#263A32]">GPS Coordinates:</span>
            <span className="font-mono text-[#237A57] font-medium">
              {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lng.toFixed(4)}° E
            </span>
          </div>

          {showMapPicker && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-[#687A70]">
                Click anywhere on the map below to drop a pin at the exact grievance location:
              </p>
              <InteractiveCivicMap
                complaints={[]}
                height="320px"
                enablePicker={true}
                pickedCoords={selectedCoords}
                onPickLocation={handleMapPick}
              />
            </div>
          )}
        </div>

        {/* Card 3: Evidence Upload */}
        <div className="rounded-xl border border-[#DFE8E1] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#123D32] border-b border-[#DFE8E1] pb-2 flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#237A57]" />
            <span>3. Photographic & Video Evidence</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-dashed border-[#DFE8E1] p-6 text-center hover:border-[#237A57] transition-colors bg-[#F4F7F5]">
              <Camera className="mx-auto h-8 w-8 text-[#A7C2B4]" />
              <p className="mt-2 text-xs font-bold text-[#263A32]">Upload Photo Evidence</p>
              <p className="text-[11px] text-[#687A70]">Supports JPG, PNG up to 10MB</p>
              <label className="mt-3 inline-block rounded-lg bg-white border border-[#DFE8E1] px-3 py-1.5 text-xs font-semibold text-[#263A32] shadow-2xs hover:bg-[#F4F7F5] cursor-pointer">
                <span>Browse Local Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-[#DFE8E1] p-4 bg-[#F4F7F5] text-center">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="h-32 w-auto max-w-full rounded-lg object-cover shadow-2xs border border-[#DFE8E1] mx-auto"
                  />
                  <p className="text-[11px] text-[#237A57] font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Evidence attached for AI vision check
                  </p>
                </div>
              ) : (
                <div className="text-[#687A70] text-xs">
                  <ImageIcon className="mx-auto h-8 w-8 text-[#A7C2B4] mb-1" />
                  No image attached yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between rounded-xl bg-[#123D32] p-4 text-white shadow-md">
          <div className="text-xs">
            <p className="font-bold text-white">Ready to submit?</p>
            <p className="text-[#A7C2B4]">
              CivicSense AI will immediately compute risk score & route ticket.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-6 py-3 text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
          >
            <span>Submit Grievance</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Voice Input Modal */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={(text) => {
          setDescription((prev) => (prev ? `${prev} ${text}` : text));
        }}
        targetFieldLabel="Complaint Description"
      />
    </div>
  );
};
