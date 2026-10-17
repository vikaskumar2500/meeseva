import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, CheckCircle, XCircle, Clock, Eye, RefreshCw, FileText, Check } from 'lucide-react';
import type { Application } from '../../types/index.js';
import { api } from '../../services/api.js';
import { StatusBadge } from '../common/StatusBadge.js';

export const OfficerDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected application for officer review
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [officerNote, setOfficerNote] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAllApplications({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setApplications(res.applications || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications for review');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'in_review' | 'approved' | 'rejected') => {
    if (!selectedApp) return;
    const appId = selectedApp.id || selectedApp._id;

    setActionLoading(true);
    setActionSuccess(null);

    try {
      await api.updateApplicationStatus(
        appId,
        newStatus,
        officerNote || `Status updated to ${newStatus} by Officer Review Desk`
      );

      setActionSuccess(`Application successfully updated to ${newStatus.toUpperCase()}`);
      setOfficerNote('');
      fetchApplications();
      setTimeout(() => {
        setSelectedApp(null);
        setActionSuccess(null);
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to update application status');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const titleMatch = app.title.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = (app.id || app._id).toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || idMatch;
  });

  const totalSubmitted = applications.filter((a) => a.status === 'submitted').length;
  const totalInReview = applications.filter((a) => a.status === 'in_review').length;
  const totalApproved = applications.filter((a) => a.status === 'approved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Officer Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-gov-navy text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Government Verification Officer Desk</span>
          </div>
          <h2 className="text-2xl font-bold">Citizen Applications Backoffice</h2>
          <p className="text-xs text-slate-300">
            Official scrutiny, verification audit, and status approval console for public administration.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Key Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Queue
          </span>
          <span className="text-2xl font-extrabold text-slate-900">{applications.length}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
            New Submitted
          </span>
          <span className="text-2xl font-extrabold text-blue-700">{totalSubmitted}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
            In Officer Review
          </span>
          <span className="text-2xl font-extrabold text-amber-700">{totalInReview}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Approved & Issued
          </span>
          <span className="text-2xl font-extrabold text-emerald-700">{totalApproved}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by applicant name, title, or application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Application Statuses</option>
            <option value="submitted">Submitted Only</option>
            <option value="in_review">In Review Only</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading officer queue...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center text-xs text-rose-700 font-semibold">
          {error}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No applications match your filter criteria</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Application ID & Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Submission Date</th>
                  <th className="px-6 py-3.5">Current Status</th>
                  <th className="px-6 py-3.5 text-right">Scrutiny Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const appId = app.id || app._id;
                  return (
                    <tr key={appId} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{app.title}</div>
                        <div className="font-mono text-[11px] text-slate-400 mt-0.5">{appId}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold uppercase text-[10px]">
                          {app.applicationType}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setOfficerNote('');
                            setActionSuccess(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Scrutinize & Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Officer Scrutiny Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  Officer Scrutiny & Order Console
                </span>
                <h3 className="font-bold text-base">{selectedApp.title}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Status and Summary */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">
                    ARN: {selectedApp.id || selectedApp._id}
                  </span>
                  <span className="text-slate-700 font-semibold">
                    Filed on {new Date(selectedApp.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <StatusBadge status={selectedApp.status} />
              </div>

              {/* Payload Details */}
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-slate-400">
                  Citizen Submission Particulars
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-56 overflow-y-auto">
                  <pre className="text-slate-800 whitespace-pre-wrap font-mono text-[11px]">
                    {JSON.stringify(selectedApp.payload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Official Notes / Remarks */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  Officer Inspection Note / Endorsement Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Scrutinized records with Tahsil database. Land survey title verified. Recommended for immediate certificate issuance."
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              {/* Decision Action Buttons */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-slate-800 block text-xs">
                  Issue Official Decision / Order
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('in_review')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition shadow-sm disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Set In Review</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('approved')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Issue</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('rejected')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold"
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
