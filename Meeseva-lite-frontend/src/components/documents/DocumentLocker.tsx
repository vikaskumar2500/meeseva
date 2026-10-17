import React, { useState, useEffect } from 'react';
import { FolderClosed, Upload, Trash2, CheckCircle2, Clock, AlertCircle, Plus, Download } from 'lucide-react';
import type { UserDocument, DocumentType } from '../../types/index.js';
import { api } from '../../services/api.js';

export const DocumentLocker: React.FC = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('aadhaar');
  const [docIssuer, setDocIssuer] = useState('UIDAI');
  const [docNumber, setDocNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDocuments();
      setDocuments(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', docName);
      formData.append('type', docType);
      formData.append('issuer', docIssuer);
      formData.append('documentNumber', docNumber || `DOC-${Date.now()}`);

      await api.uploadDocument(formData);
      setIsUploadModalOpen(false);
      resetForm();
      fetchDocuments();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setDocName('');
    setDocType('aadhaar');
    setDocIssuer('UIDAI');
    setDocNumber('');
    setSelectedFile(null);
    setUploadError(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document from your vault?')) {
      return;
    }
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => (d.id || d._id) !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Encrypted Citizen Document Locker</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Digital Document Vault</h2>
          <p className="text-xs text-slate-500">
            Store, verify, and reuse your official identity cards and certificates for instant application filing.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold shadow-md transition w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Vault Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Accessing your secure vault...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button onClick={fetchDocuments} className="text-xs font-bold text-rose-800 underline">
            Retry
          </button>
        </div>
      ) : documents.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FolderClosed className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Your Document Vault is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Upload documents such as your Aadhaar Card, PAN Card, Income Certificate, or Driving License to simplify future service applications.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gov-blue text-white text-xs font-bold rounded-xl shadow-md hover:bg-gov-navy transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Your First Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => {
            const docId = doc.id || doc._id;
            return (
              <div
                key={docId}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {doc.type}
                    </span>
                    {doc.verificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : doc.verificationStatus === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Pending Verification
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{doc.name}</h3>

                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div className="font-mono text-[11px]">Doc No: {doc.documentNumber}</div>
                    <div>Issuer: {doc.issuer}</div>
                    <div className="text-[10px] text-slate-400">
                      Size: {Math.round(doc.fileSize / 1024)} KB • {doc.fileMimetype}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-bold text-gov-blue hover:text-gov-navy"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View / Download</span>
                  </a>

                  <button
                    onClick={() => handleDelete(docId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Upload to Document Vault</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-lg">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Aadhaar Card"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Type *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="passport">Passport</option>
                    <option value="license">Driving License</option>
                    <option value="certificate">Government Certificate</option>
                    <option value="other">Other Document</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issuing Authority *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UIDAI, Income Tax Dept"
                    value={docIssuer}
                    onChange={(e) => setDocIssuer(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Identifier / Number</label>
                <input
                  type="text"
                  placeholder="e.g. XXXX-XXXX-1234 or ABCDE1234F"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select File (PDF, PNG, JPEG, up to 5MB) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-gov-blue hover:file:bg-blue-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 text-xs font-bold text-white bg-gov-blue hover:bg-gov-navy rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {uploading ? 'Encrypting & Uploading...' : 'Upload to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
