import React, { useState, useEffect } from 'react';
import { Search, FileCheck2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PublicTrackingResult } from '../../types/index.js';
import { api } from '../../services/api.js';
import { StatusBadge } from '../common/StatusBadge.js';

interface ApplicationTrackerProps {
  initialAppId?: string;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ initialAppId = '' }) => {
  const [appIdInput, setAppIdInput] = useState(initialAppId);
  const [trackingResult, setTrackingResult] = useState<PublicTrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialAppId) {
      setAppIdInput(initialAppId);
      handleTrack(initialAppId);
    }
  }, [initialAppId]);

  const handleTrack = async (targetId: string) => {
    if (!targetId || targetId.trim().length < 5) {
      setError('Please enter a valid Application ID');
      return;
    }

    setLoading(true);
    setError(null);
    setTrackingResult(null);

    try {
      const res = await api.getPublicTracking(targetId.trim());
      setTrackingResult(res);
    } catch (err: any) {
      setError(err.message || 'No application found with this tracking ID. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 1;
      case 'in_review':
      case 'under_review':
        return 2;
      case 'approved':
        return 4;
      case 'rejected':
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header & Search */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-gov-blue text-xs font-bold border border-blue-200">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Real-Time E-Governance Tracking Desk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Application Status
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Enter your unique Application Reference Number (ARN / Acknowledgement ID) to view the live status, verification updates, and officer remarks.
        </p>

        {/* Search Box */}
        <div className="pt-2 max-w-xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(appIdInput);
            }}
            className="flex items-center bg-white rounded-2xl shadow-md border border-slate-300 p-1.5 focus-within:ring-2 focus-within:ring-gov-blue focus-within:border-transparent transition"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              required
              placeholder="e.g. 67b123... or copy ID from My Applications"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition shadow-sm shrink-0 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track Application'}
            </button>
          </form>
        </div>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium flex items-center justify-center gap-2 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Checking MeeSeva central audit log...</p>
        </div>
      )}

      {/* Tracking Result View */}
      {trackingResult && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-slide-up">
          {/* Card Top Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-gov-navy to-gov-blue text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                Application Tracking Card
              </span>
              <h3 className="text-xl font-bold">{trackingResult.application.title}</h3>
              <p className="text-xs text-slate-300 font-mono">
                ARN ID: {trackingResult.application.id}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={trackingResult.application.status} className="text-sm px-3 py-1.5" />
              <span className="text-[10px] text-slate-300">
                Submitted on: {new Date(trackingResult.application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Visual Process Stepper */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Verification Progress Stages
              </h4>

              {(() => {
                const currentStep = getStepProgress(trackingResult.application.status);
                const steps = [
                  { title: 'Application Submitted', desc: 'Received in portal' },
                  { title: 'Officer Verification', desc: 'VRO / Tahsildar desk' },
                  { title: 'Field Inspection', desc: 'Record & physical check' },
                  { title: 'Approved & Issued', desc: 'Digital certificate generated' },
                ];

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                    {steps.map((st, idx) => {
                      const stepNum = idx + 1;
                      const isComplete = currentStep >= stepNum;
                      const isCurrent = currentStep === stepNum;

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border text-center relative transition ${
                            isComplete
                              ? 'bg-blue-50/60 border-gov-blue text-gov-navy shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-2 ${
                              isComplete
                                ? 'bg-gov-blue text-white shadow-md'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isComplete ? <CheckCircle2 className="w-5 h-5 text-amber-300" /> : stepNum}
                          </div>

                          <h5 className={`text-xs font-bold ${isComplete ? 'text-slate-900' : 'text-slate-500'}`}>
                            {st.title}
                          </h5>
                          <p className="text-[10px] text-slate-500 mt-0.5">{st.desc}</p>

                          {isCurrent && (
                            <span className="inline-block mt-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-300 animate-pulse">
                              Current Stage
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Audit History Timeline */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Audit Trail & Action History
              </h4>

              {trackingResult.timeline.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No timeline entries recorded yet.</p>
              ) : (
                <div className="space-y-4 pl-3 border-l-2 border-slate-200 ml-3">
                  {trackingResult.timeline.map((item, idx) => (
                    <div key={item._id || idx} className="relative group">
                      <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-gov-blue border-2 border-white ring-2 ring-blue-100"></div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={item.status} />
                            <span className="text-[11px] font-semibold text-slate-500">
                              By: {item.updatedBy === trackingResult.application.id ? 'Citizen' : 'MeeSeva Officer Desk'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(item.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                        {item.note && (
                          <p className="text-xs text-slate-700 font-medium pt-1">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
