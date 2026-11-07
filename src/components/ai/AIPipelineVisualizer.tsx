import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { AIAnalysisResult } from '../../types';

interface AIPipelineVisualizerProps {
  isSimulating: boolean;
  analysisResult?: AIAnalysisResult | null;
  onSimulationComplete?: () => void;
}

export const AIPipelineVisualizer: React.FC<AIPipelineVisualizerProps> = ({
  isSimulating,
  analysisResult,
  onSimulationComplete
}) => {
  const steps = [
    { id: 1, title: 'Understand Complaint', desc: 'NLP semantic extraction of grievance details' },
    { id: 2, title: 'Identify Category', desc: 'Classifying into municipal civic domain' },
    { id: 3, title: 'Analyze Submitted Evidence', desc: 'Computer vision check on photo metadata' },
    { id: 4, title: 'Check for Duplicate Complaints', desc: 'Geospatial & textual similarity matching' },
    { id: 5, title: 'Estimate Severity', desc: 'Assessing public hazard & population impact' },
    { id: 6, title: 'Predict Priority Score', desc: 'Multi-factor risk scoring algorithm (0-100)' },
    { id: 7, title: 'Identify Responsible Department', desc: 'Automated jurisdiction & ward routing' },
    { id: 8, title: 'Generate Reference ID', desc: 'Cryptographically unique tracking ticket' },
    { id: 9, title: 'Route to Live Tracking', desc: 'Publishing ticket to official authority queue' }
  ];

  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (isSimulating) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            if (onSimulationComplete) onSimulationComplete();
            return prev;
          }
        });
      }, 350);
      return () => clearInterval(interval);
    } else if (analysisResult) {
      setCurrentStep(steps.length);
    }
  }, [isSimulating, analysisResult]);

  return (
    <div className="rounded-xl border border-[#DFE8E1] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F2EC] text-[#237A57]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#263A32]">
              CivicSense 9-Stage AI Ingestion Pipeline
            </h3>
            <p className="text-xs text-[#687A70]">
              Automated multi-modal triage, duplicate detection and risk scoring
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#E7F2EC] px-3 py-1 text-xs font-semibold text-[#123D32] border border-[#DFE8E1]">
          {currentStep >= steps.length ? 'Analysis Completed' : `Processing Stage ${currentStep}/${steps.length}`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7F2EC]">
          <div
            className="h-full bg-[#237A57] transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((s, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx && isSimulating;

          return (
            <div
              key={s.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                isDone
                  ? 'border-[#DFE8E1] bg-[#E7F2EC] text-[#123D32]'
                  : isCurrent
                  ? 'border-[#237A57] bg-white ring-2 ring-[#237A57]/20 text-[#263A32]'
                  : 'border-[#DFE8E1] bg-[#F4F7F5] text-[#687A70] opacity-70'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-[#237A57]" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#237A57]" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#DFE8E1] text-[10px] font-bold text-[#687A70]">
                    {s.id}
                  </span>
                )}
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold">{s.title}</p>
                <p className="text-[11px] text-[#687A70] line-clamp-1">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Disclaimer */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50/80 px-3 py-2 text-xs text-amber-800 border border-amber-200/60">
        <span className="flex items-center gap-1.5 font-medium">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
          Simulated AI Pipeline Results: Generated via CivicSense rule & heuristic simulation engine.
        </span>
        <span className="font-mono text-[11px] text-amber-700">Latency: ~280ms / step</span>
      </div>
    </div>
  );
};

