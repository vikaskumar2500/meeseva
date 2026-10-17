import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { ServiceCatalog } from './components/services/ServiceCatalog.js';
import { ServiceDetailModal } from './components/services/ServiceDetailModal.js';
import { ApplyFormModal } from './components/applications/ApplyFormModal.js';
import { MyApplications } from './components/applications/MyApplications.js';
import { ApplicationTracker } from './components/tracking/ApplicationTracker.js';
import { DocumentLocker } from './components/documents/DocumentLocker.js';
import { OfficerDashboard } from './components/officer/OfficerDashboard.js';
import { SpeechAssistantModal } from './components/common/SpeechAssistantModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { useAuth } from './context/AuthContext.js';
import type { GovService } from './types/index.js';

export const App: React.FC = () => {
  const { isAuthenticated, isOfficer } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('services');

  // Modals state
  const [selectedService, setSelectedService] = useState<GovService | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Search and tracking transfer state
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTrackingId, setTargetTrackingId] = useState('');

  const handleSelectService = (service: GovService) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleApplyFromDetail = (service: GovService) => {
    setIsDetailModalOpen(false);
    if (!isAuthenticated) {
      toast.info('Please sign in or register with mobile OTP to file your official application.');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedService(service);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSuccess = (applicationId: string) => {
    toast.success('Application filed successfully! Reference ID: ' + applicationId);
    setTargetTrackingId(applicationId);
    setActiveTab('track');
  };

  const handleTrackApplication = (appId: string) => {
    setTargetTrackingId(appId);
    setActiveTab('track');
  };

  const handleTranscriptReady = (query: string) => {
    setSearchQuery(query);
    setActiveTab('services');
    toast.success(`Voice query recognized: "${query}"`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-gov-blue selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'services' && (
          <ServiceCatalog
            onSelectService={handleSelectService}
            onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'track' && (
          <ApplicationTracker initialAppId={targetTrackingId} />
        )}

        {activeTab === 'applications' && (
          <MyApplications
            onTrackApplication={handleTrackApplication}
            onExploreServices={() => setActiveTab('services')}
          />
        )}

        {activeTab === 'documents' && <DocumentLocker />}

        {activeTab === 'officer' && isOfficer && <OfficerDashboard />}
      </main>

      {/* Modals */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleApplyFromDetail}
      />

      <ApplyFormModal
        service={selectedService}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplicationSuccess}
      />

      <SpeechAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptReady={handleTranscriptReady}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
