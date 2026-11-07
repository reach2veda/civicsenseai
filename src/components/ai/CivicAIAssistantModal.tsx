import React, { useState, useRef, useEffect } from 'react';
import { AISimulationService } from '../../services/aiSimulationService';
import { StorageService } from '../../services/storageService';
import { UserRole, Complaint } from '../../types';
import {
  Bot,
  User,
  Send,
  X,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Volume2,
  TrendingUp,
  BarChart2,
  MapPin
} from 'lucide-react';
import { I18nService } from '../../services/i18nService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  quickStats?: { label: string; value: string | number }[];
  relevantComplaints?: Complaint[];
  suggestedActions?: string[];
  timestamp: string;
}

interface CivicAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  onOpenComplaint?: (complaintId: string) => void;
}

export const CivicAIAssistantModal: React.FC<CivicAIAssistantModalProps> = ({
  isOpen,
  onClose,
  role,
  onOpenComplaint
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialPrompts: Record<UserRole, string[]> = {
    citizen: [
      'How do I file a pothole grievance?',
      'How do I track complaint CIVIC-2026-HYD-1092?',
      'Which department is responsible for water leakage?',
      'How does citizen resolution verification work?'
    ],
    authority: [
      'Which department has the highest pending workload?',
      'What are the top critical complaints currently open?',
      'Which areas have the most garbage complaints?',
      'Which complaints have remained unresolved the longest?'
    ],
    admin: [
      'Show me city-wide civic statistics and hotspots',
      'What are the suspicious report telemetry indicators?',
      'Which wards have recurring drainage problems?',
      'What are the major civic issues this month?'
    ],
    coordinator: [
      'Show tasks awaiting completion review and proof verification',
      'Which field squads are currently overloaded with work orders?',
      'List tasks approaching SLA breach in next 6 hours',
      'How do I issue a formal rework request to field personnel?'
    ],
    platform_admin: [
      'Show me city-wide civic statistics and geospatial hotspots',
      'What are the suspicious report telemetry indicators?',
      'Which wards have recurring drainage and road failures?',
      'Generate platform audit report for municipal commissioner'
    ],
    field_worker: [
      'What are my urgent assigned tasks for today?',
      'How do I submit before and after photo evidence?',
      'Where can I navigate to my next work order site?',
      'How do I handle a rework request from the coordinator?'
    ]
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcome = AISimulationService.queryAssistant('hello', role);
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: welcome.answer,
          quickStats: welcome.quickStats,
          suggestedActions: welcome.suggestedActions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = AISimulationService.queryAssistant(text, role);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        quickStats: response.quickStats,
        relevantComplaints: response.relevantComplaints,
        suggestedActions: response.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D32]/60 p-4 backdrop-blur-xs">
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-[#DFE8E1] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0E2E25] bg-[#123D32] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">CivicSense AI Assistant</h3>
                <span className="rounded-full bg-[#237A57] px-2 py-0.5 text-[10px] font-semibold text-white">
                  {role.toUpperCase()} MODE
                </span>
              </div>
              <p className="text-xs text-[#A3E0C8]">
                Natural Language Intelligence & Grievance Guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Demo banner */}
        <div className="bg-[#E7F2EC] px-4 py-1.5 text-[11px] font-medium text-[#123D32] border-b border-[#DFE8E1] flex items-center justify-between">
          <span>💡 Demo Assistant: Generates responses directly from Hyderabad civic dataset.</span>
          <span className="text-[#237A57] font-mono">v1.2-sim</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F7F5]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#123D32] text-white shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#237A57] text-white rounded-tr-none'
                    : 'bg-white text-[#263A32] border border-[#DFE8E1] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Quick Stats Grid if present */}
                {m.quickStats && m.quickStats.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-[#DFE8E1] pt-3">
                    {m.quickStats.map((st, i) => (
                      <div key={i} className="rounded-lg bg-[#F4F7F5] p-2 border border-[#DFE8E1]">
                        <p className="text-[10px] text-[#687A70]">{st.label}</p>
                        <p className="font-bold text-[#263A32] text-xs">{st.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Relevant Complaints Cards */}
                {m.relevantComplaints && m.relevantComplaints.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-[#DFE8E1] pt-3">
                    <p className="font-bold text-[11px] text-[#263A32]">Referenced Complaints:</p>
                    {m.relevantComplaints.map((rc) => (
                      <div
                        key={rc.id}
                        onClick={() => {
                          if (onOpenComplaint) {
                            onOpenComplaint(rc.id);
                            onClose();
                          }
                        }}
                        className="flex items-center justify-between gap-2 rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-2 hover:bg-[#E7F2EC] hover:border-[#237A57] cursor-pointer transition-colors"
                      >
                        <div className="overflow-hidden">
                          <span className="font-mono text-[10px] font-bold text-[#237A57]">{rc.id}</span>
                          <p className="truncate font-semibold text-[#263A32] text-[11px]">{rc.title}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-[#687A70] flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#DFE8E1] pt-2.5">
                    {m.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(act)}
                        className="rounded-full border border-[#DFE8E1] bg-[#E7F2EC] px-2.5 py-1 text-[11px] font-medium text-[#123D32] hover:bg-[#237A57] hover:text-white transition-colors"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-1 flex items-center justify-between text-[10px] opacity-70">
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => I18nService.speak(m.text)}
                      className="inline-flex items-center gap-0.5 hover:text-[#237A57]"
                    >
                      <Volume2 className="h-3 w-3" /> Listen
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#237A57] text-white shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#687A70]">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#123D32] text-white">
                <Bot className="h-3.5 w-3.5 animate-spin" />
              </div>
              <span className="italic">CivicSense AI is analyzing registry data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Buttons */}
        <div className="border-t border-[#DFE8E1] bg-white p-2.5">
          <p className="mb-1.5 text-[11px] font-semibold text-[#687A70] flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Recommended Questions:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {initialPrompts[role].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap rounded-md border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-1 text-xs text-[#263A32] hover:border-[#237A57] hover:bg-[#E7F2EC] hover:text-[#123D32] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 border-t border-[#DFE8E1] bg-white p-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask about complaints, departments, hotspots, or civic procedures..."
            className="flex-1 rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-3 py-2 text-xs text-[#263A32] placeholder-[#687A70] focus:border-[#237A57] focus:bg-white focus:outline-none transition-colors"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#237A57] text-white shadow-xs hover:bg-[#123D32] disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

