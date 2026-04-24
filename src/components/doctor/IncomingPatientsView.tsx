import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { mockPatients, type Patient } from '@/data/mockData';
import PatientCard from './PatientCard';
import PatientDetail from './PatientDetail';

interface IncomingPatientsViewProps {
  onStartConsultation: (patient: Patient) => void;
}

const IncomingPatientsView = ({ onStartConsultation }: IncomingPatientsViewProps) => {
  const { t } = useI18n();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Simulate real-time: increment waiting times
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients((prev) =>
        prev.map((p) => ({ ...p, waitingMinutes: p.waitingMinutes + 1 }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">{t('patients.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {patients.length} {t('dashboard.incoming_patients').toLowerCase()}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {patients.map((patient, index) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              index={index}
              onViewDetails={setSelectedPatient}
              onAccept={onStartConsultation}
            />
          ))}
        </AnimatePresence>
      </div>

      {selectedPatient && (
        <PatientDetail
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onStartConsultation={(p) => {
            setSelectedPatient(null);
            onStartConsultation(p);
          }}
        />
      )}
    </div>
  );
};

export default IncomingPatientsView;
