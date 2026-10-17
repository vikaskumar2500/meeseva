import React, { useState, useEffect } from 'react';
import { FileText, Calendar, ArrowRight, Eye, RefreshCw, Sparkles } from 'lucide-react';
import type { Application } from '../../types/index.js';
import { api } from '../../services/api.js';
import { StatusBadge } from '../common/StatusBadge.js';

interface MyApplicationsProps {
  onTrackApplication: (appId: string) => void;
  onExploreServices: () => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({
  onTrackApplication,
  onExploreServices,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMyApplications();
      setApplications(res.applications || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve applications.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Citizen Applications</h2>
          <p className="text-xs text-slate-500">
            View submitted government service applications and track processing stages in real time.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading your applications...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            onClick={fetchApplications}
            className="text-xs font-bold text-rose-800 underline"
          >
            Retry
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No applications filed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You haven't submitted any service requests yet. Browse the official catalog to apply for certificates, pensions, or records.
            </p>
          </div>
          <button
            onClick={onExploreServices}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Browse Available Services</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const appId = app.id || app._id;
            return (
              <div
                key={appId}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-gov-blue/50 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      ID: {appId}
                    </span>
                    <StatusBadge status={app.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{app.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Applied: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="uppercase text-[10px] tracking-wider text-slate-400 font-bold">
                      {app.applicationType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 justify-end">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="p-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onTrackApplication(appId)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for viewing application details */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">
                  Application ID: {selectedApp.id || selectedApp._id}
                </span>
                <h3 className="font-bold text-base text-slate-900">{selectedApp.title}</h3>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider">
                Submitted Application Payload
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                <pre className="text-slate-700 whitespace-pre-wrap font-mono text-[11px]">
                  {JSON.stringify(selectedApp.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
