import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  FileText,
  Target,
  FlaskConical,
  BookOpen,
  Shield,
  Info,
  History,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { User, AssessmentSession, Domain, Criterion, Evidence, ImprovementPlan, ResearchStudyBatch, AuditLog } from './types/index.ts';
import { storage } from './services/storage.ts';
import { Navbar } from './components/common/Navbar.tsx';
import { ResearchConsentModal } from './components/modals/ResearchConsentModal.tsx';
import { AuthModal } from './components/modals/AuthModal.tsx';

// Views
import { IntroductionPage } from './views/IntroductionPage.tsx';
import { StudentDashboard } from './views/StudentDashboard.tsx';
import { AssessmentWizard } from './views/AssessmentWizard.tsx';
import { ResultsView } from './views/ResultsView.tsx';
import { EvidenceView } from './views/EvidenceView.tsx';
import { ImprovementPlanView } from './views/ImprovementPlanView.tsx';
import { HistoryView } from './views/HistoryView.tsx';
import { ResearcherDashboard } from './views/ResearcherDashboard.tsx';
import { CriteriaManager } from './views/CriteriaManager.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';
import { GuideView } from './views/GuideView.tsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => storage.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('intro');
  const [domains, setDomains] = useState<Domain[]>(() => storage.getDomains());
  const [criteria, setCriteria] = useState<Criterion[]>(() => storage.getCriteria());
  const [sessions, setSessions] = useState<AssessmentSession[]>(() => storage.getSessions());
  const [evidenceList, setEvidenceList] = useState<Evidence[]>(() => storage.getEvidence());
  const [plans, setPlans] = useState<ImprovementPlan[]>(() => storage.getPlans());
  const [studyBatches, setStudyBatches] = useState<ResearchStudyBatch[]>(() => storage.getStudyBatches());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => storage.getAuditLogs());

  // Active session for Results View or Draft
  const [selectedResultSession, setSelectedResultSession] = useState<AssessmentSession | null>(null);
  const [activeDraftSession, setActiveDraftSession] = useState<AssessmentSession | null>(null);

  // Modals
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check URL params (?autostart=1 or tab)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setActiveTab('dashboard');
    }
  }, []);

  const refreshAllState = () => {
    setCurrentUser(storage.getCurrentUser());
    setDomains(storage.getDomains());
    setCriteria(storage.getCriteria());
    setSessions(storage.getSessions());
    setEvidenceList(storage.getEvidence());
    setPlans(storage.getPlans());
    setStudyBatches(storage.getStudyBatches());
    setAuditLogs(storage.getAuditLogs());
  };

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    refreshAllState();
  };

  const handleResetData = () => {
    if (window.confirm('Đặt lại toàn bộ cơ sở dữ liệu về trạng thái mẫu ban đầu?')) {
      storage.resetToDefaults();
      refreshAllState();
      setActiveTab('intro');
    }
  };

  // Start Assessment flow with research consent check
  const handleStartAssessment = () => {
    // If user already has consent or accepts
    setActiveDraftSession(null);
    setIsConsentModalOpen(true);
  };

  const handleConsentAccepted = () => {
    setIsConsentModalOpen(false);
    setActiveTab('assessment');
  };

  const handleResumeDraft = (sessionId: string) => {
    const draft = storage.getSessionById(sessionId);
    if (draft) {
      setActiveDraftSession(draft);
      setActiveTab('assessment');
    }
  };

  const handleAssessmentCompleted = (completedSession: AssessmentSession) => {
    refreshAllState();
    setSelectedResultSession(completedSession);
    setActiveTab('results');
  };

  const handleViewSessionResult = (session: AssessmentSession) => {
    setSelectedResultSession(session);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'intro' && (
          <IntroductionPage
            domains={domains}
            onStartAssessment={handleStartAssessment}
            onNavigateTab={(tab) => setActiveTab(tab)}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            currentUser={currentUser}
            sessions={storage.getSessionsForUser(currentUser.id)}
            evidenceList={storage.getEvidenceForUser(currentUser.id)}
            plans={storage.getPlansForUser(currentUser.id)}
            domains={domains}
            onStartAssessment={handleStartAssessment}
            onResumeDraft={handleResumeDraft}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onViewResults={handleViewSessionResult}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentWizard
            currentUser={currentUser}
            domains={domains}
            criteria={criteria}
            existingSession={activeDraftSession}
            onComplete={handleAssessmentCompleted}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            session={
              selectedResultSession ||
              storage.getSessionsForUser(currentUser.id).find((s) => s.status === 'completed') ||
              storage.getSessions()[0]
            }
            previousSession={storage.getSessionsForUser(currentUser.id).filter((s) => s.status === 'completed')[1]}
            domains={domains}
            currentUser={currentUser}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onNewAssessment={handleStartAssessment}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceView
            currentUser={currentUser}
            criteria={criteria}
            domains={domains}
          />
        )}

        {activeTab === 'plans' && (
          <ImprovementPlanView
            currentUser={currentUser}
            domains={domains}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            currentUser={currentUser}
            sessions={sessions}
            domains={domains}
            onViewSessionResult={handleViewSessionResult}
            onNewAssessment={handleStartAssessment}
          />
        )}

        {activeTab === 'researcher' && (
          <ResearcherDashboard
            currentUser={currentUser}
            sessions={sessions}
            domains={domains}
            criteria={criteria}
            evidenceList={evidenceList}
            studyBatches={studyBatches}
          />
        )}

        {activeTab === 'criteria' && (
          <CriteriaManager
            currentUser={currentUser}
            domains={domains}
            criteria={criteria}
            onCriteriaUpdated={refreshAllState}
            onDomainsUpdated={refreshAllState}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            users={storage.getUsers()}
            auditLogs={auditLogs}
            onUsersUpdated={refreshAllState}
            onResetAllData={handleResetData}
          />
        )}

        {activeTab === 'guide' && <GuideView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              S
            </div>
            <span className="font-bold text-slate-800">SelfLearn AI</span>
            <span>•</span>
            <span>Đề tài: Đánh giá Năng lực Tự học của Sinh viên trong Môi trường có AI</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('guide')} className="hover:text-slate-700">
              Chính sách Đạo đức & Bảo mật
            </button>
            <span>•</span>
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-slate-700">
              Đăng ký / Đăng nhập
            </button>
            <span>•</span>
            <span>Phiên bản v1.0-research</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ResearchConsentModal
        isOpen={isConsentModalOpen}
        onAccept={handleConsentAccepted}
        onDecline={() => setIsConsentModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => {
          handleUserChange(u);
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}
