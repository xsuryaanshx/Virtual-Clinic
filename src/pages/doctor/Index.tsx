import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { I18nProvider } from '@/i18n/I18nContext';
import TopNavbar from '@/components/doctor/TopNavbar';
import AppSidebar from '@/components/doctor/AppSidebar';
import DashboardView from '@/components/doctor/DashboardView';
import IncomingPatientsView from '@/components/doctor/IncomingPatientsView';
import ConsultationView from '@/components/doctor/ConsultationView';
import HistoryView from '@/components/doctor/HistoryView';
import SettingsView from '@/components/doctor/SettingsView';
import { mockPatients, type Patient } from '@/data/mockData';

type View = 'dashboard' | 'incoming' | 'active' | 'history' | 'settings';

const DashboardApp = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStartConsultation = (patient: Patient) => {
    setActivePatient(patient);
    setCurrentView('active');
  };

  const handleEndConsultation = () => {
    setActivePatient(null);
    setCurrentView('incoming');
  };

  const renderView = () => {
    if (currentView === 'active' && activePatient) {
      return <ConsultationView patient={activePatient} onEnd={handleEndConsultation} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'incoming':
        return <IncomingPatientsView onStartConsultation={handleStartConsultation} />;
      case 'active':
        return (
          <div className="p-6 md:p-8">
            <p className="text-muted-foreground">No active consultation. Accept a patient from the queue.</p>
          </div>
        );
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <TopNavbar
        isOnline={isOnline}
        onToggleStatus={() => setIsOnline(!isOnline)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          incomingCount={mockPatients.length}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (activePatient?.id || '')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const Index = () => (
  <I18nProvider>
    <DashboardApp />
  </I18nProvider>
);

export default Index;
