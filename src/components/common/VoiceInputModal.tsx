import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, Check, Globe } from 'lucide-react';
import { AppLanguage, I18nService } from '../../services/i18nService';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
  targetFieldLabel?: string;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete,
  targetFieldLabel = 'Complaint Description'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState<AppLanguage>('en');
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);

  const sampleVoicePrompts: Record<AppLanguage, string[]> = {
    en: [
      'There is a huge pothole near Cyber Towers flyover in Madhapur causing two-wheelers to fall.',
      'Drinking water main pipe is leaking near Miyapur metro station for the past two days.',
      'Streetlights are not working on the Gachibowli main road and it is completely dark.'
    ],
    hi: [
      'माधापुर में साइबर टावर्स फ्लाईओवर के पास एक गहरा गड्ढा है, जिससे गाड़ियां गिर रही हैं।',
      'मियापुर मेट्रो स्टेशन के पास पानी की मुख्य पाइपलाइन टूट गई है और पानी बह रहा है।',
      'गाचीबोवली मुख्य सड़क पर स्ट्रीटलाइट्स बंद हैं और रात में पूरा अंधेरा रहता है।'
    ],
    te: [
      'మాదాపూర్ సైబర్ టవర్స్ ఫ్లైఓవర్ వద్ద పెద్ద గుంత ఉంది, ద్విచక్ర వాహనాలు జారిపడుతున్నాయి.',
      'మియాపూర్ మెట్రో స్టేషన్ వద్ద గత రెండు రోజులుగా తాగునీటి పైపులైన్ లీక్ అవుతోంది.',
      'గచ్చిబౌలి ప్రధాన రహదారిపై వీధి దీపాలు వెలగడం లేదు, రాత్రి సమయంలో చీకటిగా ఉంది.'
    ]
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleStartSimulatedRecording = () => {
    setIsRecording(true);
    setTranscript('');
    const prompts = sampleVoicePrompts[selectedLang];
    const picked = prompts[Math.floor(Math.random() * prompts.length)];

    // Simulate real-time word-by-word streaming
    const words = picked.split(' ');
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        setTranscript(words.slice(0, currentIdx + 1).join(' '));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRecording(false);
      }
    }, 280);
  };

  const handleSelectSample = (sample: string) => {
    setTranscript(sample);
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123D32]/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#DFE8E1]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#687A70] hover:bg-[#F4F7F5] hover:text-[#263A32] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E7F2EC] text-[#237A57]">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#263A32]">
              Multilingual Voice Input (Speech-to-Text)
            </h3>
            <p className="text-xs text-[#687A70]">
              Speaking for: <span className="font-semibold text-[#263A32]">{targetFieldLabel}</span>
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F4F7F5] p-2 border border-[#DFE8E1]">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#687A70]">
            <Globe className="h-4 w-4 text-[#237A57]" />
            Input Language:
          </span>
          <div className="flex gap-1.5">
            {[
              { code: 'en' as AppLanguage, label: 'English' },
              { code: 'hi' as AppLanguage, label: 'हिन्दी (Hindi)' },
              { code: 'te' as AppLanguage, label: 'తెలుగు (Telugu)' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedLang === lang.code
                    ? 'bg-[#237A57] text-white shadow-xs'
                    : 'bg-white text-[#263A32] hover:bg-[#E7F2EC] border border-[#DFE8E1]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-[#123D32] p-6 text-white text-center shadow-inner">
          <div className="relative mb-4 flex items-center justify-center">
            {isRecording && (
              <>
                <span className="absolute h-24 w-24 animate-ping rounded-full bg-[#A3E0C8] opacity-20" />
                <span className="absolute h-20 w-20 animate-pulse rounded-full bg-[#237A57] opacity-40" />
              </>
            )}
            <button
              type="button"
              onClick={isRecording ? () => setIsRecording(false) : handleStartSimulatedRecording}
              className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-[#237A57] text-white hover:bg-[#1b6245]'
              }`}
            >
              {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>
          </div>

          <p className="text-sm font-medium">
            {isRecording
              ? `Listening in ${selectedLang.toUpperCase()} (${seconds}s)... Speak now`
              : 'Click microphone to start voice recording'}
          </p>
          <p className="mt-1 text-xs text-[#A3E0C8]/80">
            [Demo Mode: Simulates voice recognition with speech waveform & translation]
          </p>

          {/* Sound wave bars */}
          {isRecording && (
            <div className="mt-3 flex items-center justify-center gap-1">
              {[4, 12, 24, 16, 28, 8, 20, 32, 14, 8].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 rounded-full bg-[#A3E0C8] animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Transcribed Text Output */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-[#263A32]">Recognized Transcript:</label>
          <div className="mt-1 min-h-[70px] rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-sm text-[#263A32]">
            {transcript ? (
              <span className="leading-relaxed">{transcript}</span>
            ) : (
              <span className="italic text-[#687A70]">Your spoken text will appear here...</span>
            )}
          </div>
          {transcript && (
            <button
              type="button"
              onClick={() => I18nService.speak(transcript)}
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#237A57] hover:text-[#123D32]"
            >
              <Volume2 className="h-3.5 w-3.5" /> Read Aloud (TTS)
            </button>
          )}
        </div>

        {/* Quick Sample Suggestions */}
        <div className="mt-3">
          <p className="flex items-center gap-1 text-xs font-semibold text-[#687A70]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Or click a realistic sample voice query:
          </p>
          <div className="mt-1.5 space-y-1">
            {sampleVoicePrompts[selectedLang].map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="w-full text-left rounded-md border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-1.5 text-xs text-[#263A32] hover:bg-[#E7F2EC] hover:border-[#237A57] hover:text-[#123D32] transition-colors"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex justify-end gap-2 border-t border-[#DFE8E1] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#DFE8E1] px-4 py-2 text-xs font-semibold text-[#687A70] hover:bg-[#F4F7F5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!transcript.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#123D32] disabled:opacity-50 transition-colors"
          >
            <Check className="h-4 w-4" /> Apply to Form
          </button>
        </div>
      </div>
    </div>
  );
};

