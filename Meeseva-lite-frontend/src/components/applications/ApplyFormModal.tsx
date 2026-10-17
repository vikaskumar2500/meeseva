import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, ShieldCheck, FileCheck, AlertCircle } from 'lucide-react';
import type { GovService } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface ApplyFormModalProps {
  service: GovService | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (applicationId: string) => void;
}

export const ApplyFormModal: React.FC<ApplyFormModalProps> = ({
  service,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Hyderabad');
  const [pinCode, setPinCode] = useState('');

  // Step 2: Service-specific fields
  const [purpose, setPurpose] = useState('Educational Scholarship / Admission');
  const [annualIncome, setAnnualIncome] = useState('120000');
  const [casteCategory, setCasteCategory] = useState('OBC - Backward Class');
  const [subCaste, setSubCaste] = useState('');
  const [propertySurveyNo, setPropertySurveyNo] = useState('');
  const [rationCardType, setRationCardType] = useState('White Ration Card (BPL)');
  const [familyMembersCount, setFamilyMembersCount] = useState('4');

  // Step 3: Document selection
  const [attachedDocName, setAttachedDocName] = useState('Aadhaar & Residence Proof');
  const [declarationChecked, setDeclarationChecked] = useState(false);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationChecked) {
      setError('Please check the self-declaration box to proceed.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        applicant: {
          fullName,
          fatherName,
          phone,
          email,
          aadhaar,
          address,
          district,
          pinCode,
        },
        serviceDetails: {
          serviceId: service.id,
          serviceName: service.name,
          category: service.category,
          fees: service.fees,
          purpose,
          annualIncome: service.name.includes('Income') ? annualIncome : undefined,
          casteCategory: service.name.includes('Caste') ? casteCategory : undefined,
          subCaste: service.name.includes('Caste') ? subCaste : undefined,
          propertySurveyNo: service.name.includes('Land') ? propertySurveyNo : undefined,
          rationCardType: service.name.includes('Ration') ? rationCardType : undefined,
          familyMembersCount: service.name.includes('Ration') ? familyMembersCount : undefined,
          attachedDocuments: [attachedDocName],
        },
      };

      const res = await api.createApplication({
        applicationType: service.category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        title: `${service.name} - ${fullName}`,
        payload,
      });

      const appId = res.application.id || res.application._id;
      onSuccess(appId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gov-navy text-white">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Official E-Application Form
            </span>
            <h3 className="font-bold text-lg">{service.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-gov-blue font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-gov-blue text-white' : 'bg-slate-200 text-slate-500'}`}>
              {step > 1 ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span>Applicant</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200"></div>

          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-gov-blue font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-gov-blue text-white' : 'bg-slate-200 text-slate-500'}`}>
              {step > 2 ? <Check className="w-3 h-3" /> : '2'}
            </span>
            <span>Details</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200"></div>

          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-gov-blue font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-gov-blue text-white' : 'bg-slate-200 text-slate-500'}`}>
              {step > 3 ? <Check className="w-3 h-3" /> : '3'}
            </span>
            <span>Documents</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200"></div>

          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-gov-blue font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-gov-blue text-white' : 'bg-slate-200 text-slate-500'}`}>
              4
            </span>
            <span>Declaration</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: APPLICANT DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 1: Personal & Demographic Particulars
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Father / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Father / Husband Name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar (UIDAI 12 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Ranga Reddy">Ranga Reddy</option>
                    <option value="Medchal-Malkajgiri">Medchal-Malkajgiri</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Bengaluru Urban">Bengaluru Urban</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Door No, Street Name, Village/Ward, Mandal"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="500001"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-48 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SERVICE SPECIFIC DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 2: Service Application Particulars
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Purpose / Objective *
                </label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                />
              </div>

              {service.name.includes('Income') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Declared Annual Household Income (in ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500">
                    Subject to verification by the Village / Revenue Officer (VRO/RI).
                  </span>
                </div>
              )}

              {service.name.includes('Caste') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={casteCategory}
                      onChange={(e) => setCasteCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                    >
                      <option value="OBC - Backward Class">OBC - Backward Class</option>
                      <option value="SC - Scheduled Caste">SC - Scheduled Caste</option>
                      <option value="ST - Scheduled Tribe">ST - Scheduled Tribe</option>
                      <option value="EWS - Economically Weaker Section">EWS - Economically Weaker Section</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-Caste Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Padmashali, Yadava, Mala, etc."
                      value={subCaste}
                      onChange={(e) => setSubCaste(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                    />
                  </div>
                </div>
              )}

              {service.name.includes('Land') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Khata / Survey Number / Passbook No *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Survey 142/A, Khata 580"
                    value={propertySurveyNo}
                    onChange={(e) => setPropertySurveyNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                  />
                </div>
              )}

              {service.name.includes('Ration') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Card Type *</label>
                    <select
                      value={rationCardType}
                      onChange={(e) => setRationCardType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                    >
                      <option value="White Ration Card (BPL)">White Ration Card (BPL)</option>
                      <option value="Pink Ration Card (APL)">Pink Ration Card (APL)</option>
                      <option value="Antyodaya Anna Yojana (AAY)">Antyodaya Anna Yojana (AAY)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Family Members *</label>
                    <input
                      type="number"
                      value={familyMembersCount}
                      onChange={(e) => setFamilyMembersCount(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DOCUMENT ATTACHMENTS */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 3: Document Attachments
              </h4>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  Mandatory Documents for {service.name}:
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {service.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-gov-blue" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Verified Attachment Source
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="docSource"
                      checked={attachedDocName === 'Aadhaar & Residence Proof'}
                      onChange={() => setAttachedDocName('Aadhaar & Residence Proof')}
                      className="text-gov-blue"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Linked Citizen DigiLocker / MeeSeva Vault Document
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Automatically pulls verified UIDAI Aadhaar & Residence Proof on file
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="docSource"
                      checked={attachedDocName === 'Manual File Upload'}
                      onChange={() => setAttachedDocName('Manual File Upload')}
                      className="text-gov-blue"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Manual Certificate Document Upload
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Attach scanned PDF or JPEG from your device
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SELF-DECLARATION & SUBMISSION */}
          {step === 4 && (
            <div className="space-y-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 4: Review Application & Declaration
              </h4>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-800">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-semibold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone & Email:</span>
                  <span className="text-slate-700">{phone} | {email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">District:</span>
                  <span className="text-slate-700">{district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Government Fee:</span>
                  <span className="font-bold text-emerald-700">{service.fees === 0 ? 'Free' : `₹${service.fees}`}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    I hereby declare that all the information and particulars furnished above are true and correct to the best of my knowledge and belief. I understand that giving false statements is punishable under the Indian Penal Code.
                  </p>
                </div>

                <label className="flex items-center gap-2 pt-2 border-t border-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                    className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue"
                  />
                  <span className="text-xs font-bold text-slate-900">
                    I accept the declaration and submit this official government application.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Stepper Navigation Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!fullName || !phone || !email)) {
                  setError('Please fill in applicant full name, phone number, and email.');
                  return;
                }
                setError(null);
                setStep(step + 1);
              }}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gov-blue hover:bg-gov-navy rounded-lg shadow-sm transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !declarationChecked}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Submitting Application...' : 'Confirm & Submit Application'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
