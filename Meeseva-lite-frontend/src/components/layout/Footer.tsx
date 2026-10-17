import React from 'react';
import { PhoneCall, Shield, Landmark, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-auto">
      {/* Upper Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Landmark className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-base tracking-tight">MeeSeva Lite 2.0</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official transparent citizen services delivery platform engineered under S.O.L.I.D. architectural principles.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted E-Governance Protocol</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Key Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Revenue & Disaster Management</li>
              <li>Social Welfare & Empowerment</li>
              <li>Civil Supplies & Consumer Affairs</li>
              <li>Municipal Administration & Urban Dev</li>
              <li>Transport & Motor Vehicles</li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Citizen Helpline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <PhoneCall className="w-4 h-4" />
                <span>1100 / 1800-425-4440 (Toll Free)</span>
              </div>
              <p className="text-slate-400">Working Hours: 8:00 AM – 8:00 PM (All Days)</p>
              <p className="text-slate-400">Email: helpdesk@meeseva.gov.in</p>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Important Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1 hover:text-white cursor-pointer">
                <span>Digital India Portal</span>
                <ExternalLink className="w-3 h-3" />
              </li>
              <li className="flex items-center gap-1 hover:text-white cursor-pointer">
                <span>National Portal of India</span>
                <ExternalLink className="w-3 h-3" />
              </li>
              <li className="flex items-center gap-1 hover:text-white cursor-pointer">
                <span>DigiLocker Services</span>
                <ExternalLink className="w-3 h-3" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-950 py-4 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Government of India / MeeSeva Portal. Built with S.O.L.I.D Principles.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Audit Certificate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

