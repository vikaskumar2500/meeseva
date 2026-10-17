import React from 'react';
import { X, Clock, IndianRupee, FileCheck, CheckCircle, Building, Star, ArrowRight } from 'lucide-react';
import type { GovService } from '../../types/index.js';

interface ServiceDetailModalProps {
  service: GovService | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (service: GovService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onApply,
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 bg-gradient-to-r from-gov-navy to-gov-blue text-white">
          <div className="space-y-1 pr-6">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
              {service.category}
            </span>
            <h3 className="font-bold text-xl leading-snug">{service.name}</h3>
            <p className="text-xs text-slate-200 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              <span>{service.department}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Service Description
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">{service.description}</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-center">
              <span className="text-[11px] text-slate-500 block mb-0.5">Government Fee</span>
              <div className="text-base font-extrabold text-gov-navy flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
                <span>{service.fees === 0 ? 'Free' : service.fees}</span>
              </div>
            </div>

            <div className="text-center border-x border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-0.5">SLA Timeline</span>
              <div className="text-base font-extrabold text-gov-navy flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{service.processingTime}</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[11px] text-slate-500 block mb-0.5">Citizen Rating</span>
              <div className="text-base font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{service.rating}</span>
                <span className="text-[10px] text-slate-400 font-normal">({service.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Eligibility Criteria</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 pl-2">
              {service.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-gov-blue" />
              <span>Required Supporting Documents</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {service.requiredDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition"
          >
            Close
          </button>
          <button
            onClick={() => onApply(service)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold shadow-md transition"
          >
            <span>Proceed to Online Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

