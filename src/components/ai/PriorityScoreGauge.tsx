import React from 'react';
import { PriorityBreakdown, ComplaintSeverity } from '../../types';
import { SeverityBadge } from '../common/Badge';
import { ShieldAlert, AlertTriangle, Users, Clock, MapPin, Repeat, Info } from 'lucide-react';

interface PriorityScoreGaugeProps {
  score: number;
  severity: ComplaintSeverity;
  category: 'Critical' | 'High' | 'Medium' | 'Low';
  breakdown: PriorityBreakdown;
}

export const PriorityScoreGauge: React.FC<PriorityScoreGaugeProps> = ({
  score,
  severity,
  category,
  breakdown
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-red-600 bg-red-500';
    if (val >= 75) return 'text-orange-600 bg-orange-500';
    if (val >= 50) return 'text-amber-600 bg-amber-500';
    return 'text-emerald-600 bg-emerald-500';
  };

  const factorList = [
    {
      label: 'Public Safety Impact',
      score: breakdown.publicSafetyScore,
      icon: ShieldAlert,
      weight: '30%'
    },
    {
      label: 'Duration Urgency',
      score: breakdown.durationUrgencyScore,
      icon: Clock,
      weight: '20%'
    },
    {
      label: 'Infrastructure Damage',
      score: breakdown.infrastructureDamageScore,
      icon: AlertTriangle,
      weight: '15%'
    },
    {
      label: 'Affected Population',
      score: breakdown.affectedPopulationScore,
      icon: Users,
      weight: '15%'
    },
    {
      label: 'Location Sensitivity',
      score: breakdown.locationSensitivityScore,
      icon: MapPin,
      weight: '10%'
    },
    {
      label: 'Repeat Complaint Frequency',
      score: breakdown.repeatFrequencyScore,
      icon: Repeat,
      weight: '10%'
    }
  ];

  return (
    <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#263A32]">
            AI Severity & Priority Prediction
          </h3>
          <p className="text-xs text-[#687A70]">
            Algorithmic 6-factor civic risk assessment
          </p>
        </div>
        <SeverityBadge severity={severity} size="md" />
      </div>

      {/* Main Score Display */}
      <div className="mt-4 flex flex-col md:flex-row items-center gap-6 rounded-lg bg-[#F4F7F5] p-4 border border-[#DFE8E1]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#DFE8E1] bg-white shadow-inner">
            <span className={`text-3xl font-extrabold ${getScoreColor(score).split(' ')[0]}`}>
              {score}
            </span>
            <span className="absolute -bottom-2 rounded-full bg-[#123D32] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              Score / 100
            </span>
          </div>
          <span className="mt-3 text-xs font-bold text-[#263A32]">
            {category} Priority Tier
          </span>
        </div>

        {/* Explainability Justification */}
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex items-center gap-1 font-semibold text-[#263A32]">
            <Info className="h-4 w-4 text-[#237A57]" />
            <span>AI Risk Scoring Explanation:</span>
          </div>
          <p className="leading-relaxed text-[#263A32] bg-white p-3 rounded-lg border border-[#DFE8E1]">
            {breakdown.justification}
          </p>
        </div>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {factorList.map((f, i) => (
          <div key={i} className="rounded-lg border border-[#DFE8E1] bg-white p-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-[#263A32]">
                <f.icon className="h-3.5 w-3.5 text-[#237A57]" />
                {f.label}
              </span>
              <span className="font-bold text-[#263A32]">{f.score}/100</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E7F2EC]">
              <div
                className={`h-full ${getScoreColor(f.score).split(' ')[1]}`}
                style={{ width: `${f.score}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-[#687A70] text-right">Weight: {f.weight}</p>
          </div>
        ))}
      </div>

      {/* Simulation note */}
      <p className="mt-3 text-[11px] text-[#687A70] italic">
        * Note: Priority scores are simulated demo predictions using multi-criteria weighted scoring.
      </p>
    </div>
  );
};

