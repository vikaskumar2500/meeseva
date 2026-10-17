import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../../services/api.js';

interface SpeechAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
}

export const SpeechAssistantModal: React.FC<SpeechAssistantModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('te-IN'); // Telugu default or Hindi / English
  const [statusMessage, setStatusMessage] = useState('Click microphone and speak your query...');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      setTranscript('');
      setStatusMessage('Listening to your voice...');
      audioChunksRef.current = [];

      // Check if browser Web Speech API is natively supported first
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          setTranscript(spokenText);
          setStatusMessage(`Recognized: "${spokenText}"`);
          setIsRecording(false);
          setTimeout(() => {
            onTranscriptReady(spokenText);
            onClose();
          }, 800);
        };

        recognition.onerror = () => {
          fallbackToMediaRecorder();
        };

        recognition.start();
        setIsRecording(true);
        return;
      }

      await fallbackToMediaRecorder();
    } catch (err: any) {
      console.warn('Microphone error:', err);
      setStatusMessage('Microphone access denied or unsupported.');
      setIsRecording(false);
    }
  };

  const fallbackToMediaRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      setStatusMessage('Transcribing audio via MeeSeva AI...');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      try {
        const res = await api.transcribeSpeech(audioBlob, language);
        if (res.transcript) {
          setTranscript(res.transcript);
          setStatusMessage(`Recognized: "${res.transcript}"`);
          setTimeout(() => {
            onTranscriptReady(res.transcript);
            onClose();
          }, 800);
        } else {
          setStatusMessage('Could not detect clear words. Please try again.');
        }
      } catch {
        setStatusMessage('Speech recognition error. Please type query.');
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gov-navy to-gov-blue text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">MeeSeva Vernacular Voice Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          {/* Language Selector */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-medium text-slate-500">Speaking In:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-blue"
            >
              <option value="te-IN">తెలుగు (Telugu - AP/TS)</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
              <option value="en-IN">English (India)</option>
              <option value="ta-IN">தமிழ் (Tamil)</option>
              <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          {/* Microphone Pulse Circle */}
          <div className="py-4 flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
                isRecording
                  ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/40 animate-pulse scale-110'
                  : 'bg-gov-blue hover:bg-gov-navy text-white shadow-lg shadow-gov-blue/30 hover:scale-105'
              }`}
            >
              {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              {isRecording && (
                <span className="absolute -inset-2 rounded-full border-2 border-rose-400 animate-ping opacity-75"></span>
              )}
            </button>
          </div>

          {/* Dynamic Status message */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">{statusMessage}</p>
            {transcript && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Transcribed Text
                </span>
                <p className="text-base font-medium text-gov-navy">{transcript}</p>
              </div>
            )}
          </div>

          {/* Sample Prompts */}
          <div className="bg-amber-50 rounded-xl p-3 text-left border border-amber-200/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-2">
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Voice Search Examples:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-amber-900">
              <button
                onClick={() => {
                  onTranscriptReady('Income Certificate');
                  onClose();
                }}
                className="text-left bg-white/70 hover:bg-white p-1.5 rounded-lg border border-amber-200"
              >
                "Income Certificate"
              </button>
              <button
                onClick={() => {
                  onTranscriptReady('Caste Certificate');
                  onClose();
                }}
                className="text-left bg-white/70 hover:bg-white p-1.5 rounded-lg border border-amber-200"
              >
                "Caste Certificate"
              </button>
              <button
                onClick={() => {
                  onTranscriptReady('Ration Card');
                  onClose();
                }}
                className="text-left bg-white/70 hover:bg-white p-1.5 rounded-lg border border-amber-200"
              >
                "Ration Card"
              </button>
              <button
                onClick={() => {
                  onTranscriptReady('Pahani Land Records');
                  onClose();
                }}
                className="text-left bg-white/70 hover:bg-white p-1.5 rounded-lg border border-amber-200"
              >
                "Pahani Land Records"
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            AI speech recognition with multilingual vernacular support
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

