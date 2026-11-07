import React from 'react';
import { Database, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface DemoNoticeBannerProps {
  dataSource: 'supabase' | 'demo_fallback';
  complaintCount: number;
  onToggleDataSource: (source: 'supabase' | 'demo_fallback') => void;
  onReset: () => void;
}

export const DemoNoticeBanner: React.FC<DemoNoticeBannerProps> = ({
  dataSource,
  complaintCount,
  onToggleDataSource,
  onReset
}) => {
  const isSupabase = dataSource === 'supabase';

  return (
    <div
      className={`border-b px-4 py-1.5 text-xs transition-colors ${
        isSupabase
          ? 'bg-[#0E2E25] border-[#1B5244] text-[#A3E0C8]'
          : 'bg-[#2A2315] border-[#4A3D24] text-amber-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-2 w-2 rounded-full ${
              isSupabase ? 'bg-[#237A57] animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            {isSupabase ? 'LIVE SUPABASE POSTGRESQL' : 'LOCAL DEMO FALLBACK'}
          </span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="hidden md:inline text-[11px] opacity-85">
            {isSupabase
              ? `Connected to Supabase PostgreSQL database (${complaintCount} live ${
                  complaintCount === 1 ? 'complaint' : 'complaints'
                }).`
              : 'Viewing simulated sample records. These are local fallback data, not retrieved from Supabase.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSupabase ? (
            <button
              onClick={() => onToggleDataSource('demo_fallback')}
              className="inline-flex items-center gap-1 rounded bg-[#123D32] hover:bg-[#1B5244] text-[#A3E0C8] border border-[#237A57]/40 px-2 py-0.5 text-[11px] font-medium transition-colors"
              title="Switch to local demo mock data"
            >
              <AlertTriangle className="h-3 w-3 text-amber-300" />
              <span>Load Mock Demo Data</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleDataSource('supabase')}
              className="inline-flex items-center gap-1 rounded bg-[#237A57] hover:bg-[#1B6346] text-white px-2 py-0.5 text-[11px] font-semibold transition-colors shadow-xs"
              title="Return to live Supabase database"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Switch to Live Supabase DB</span>
            </button>
          )}

          {!isSupabase && (
            <button
              onClick={() => {
                if (window.confirm('Reset all demo complaints and state back to default?')) {
                  StorageService.resetDemoData();
                  onReset();
                }
              }}
              className="inline-flex items-center gap-1 rounded bg-[#1A1813] hover:bg-black/40 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[11px] font-medium transition-colors"
              title="Reset complaints back to default state"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Demo State</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
