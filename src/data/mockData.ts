import type { Locale } from '@/i18n/translations';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  aiSummary: Record<Locale, string>;
  symptoms: Record<Locale, string[]>;
  urgency: 'low' | 'medium' | 'high';
  suggestedSpecialty: Record<Locale, string>;
  waitingMinutes: number;
  riskIndicators: Record<Locale, string[]>;
  medicalHistory: { date: string; description: Record<Locale, string> }[];
  isNew?: boolean;
}

export interface ConsultationHistory {
  id: string;
  patientName: string;
  date: string;
  summary: Record<Locale, string>;
  outcome: 'completed' | 'referred' | 'followup';
}

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    age: 54,
    gender: 'M',
    aiSummary: {
      it: 'Paziente maschio di 54 anni con dolore toracico ricorrente negli ultimi 3 giorni. Pressione arteriosa elevata rilevata dalla farmacia locale. Anamnesi familiare positiva per malattie cardiovascolari.',
      en: '54-year-old male patient with recurring chest pain over the past 3 days. Elevated blood pressure detected at local pharmacy. Positive family history for cardiovascular disease.',
      ru: '54-летний мужчина с рецидивирующей болью в груди в течение последних 3 дней. Повышенное артериальное давление обнаружено в местной аптеке. Положительный семейный анамнез сердечно-сосудистых заболеваний.',
    },
    symptoms: {
      it: ['Dolore toracico', 'Dispnea', 'Affaticamento', 'Pressione elevata'],
      en: ['Chest pain', 'Dyspnea', 'Fatigue', 'Elevated blood pressure'],
      ru: ['Боль в груди', 'Одышка', 'Усталость', 'Повышенное давление'],
    },
    urgency: 'high',
    suggestedSpecialty: { it: 'Cardiologia', en: 'Cardiology', ru: 'Кардиология' },
    waitingMinutes: 3,
    riskIndicators: {
      it: ['Ipertensione', 'Anamnesi familiare CVD', 'Età > 50'],
      en: ['Hypertension', 'Family history CVD', 'Age > 50'],
      ru: ['Гипертония', 'Семейный анамнез ССЗ', 'Возраст > 50'],
    },
    medicalHistory: [
      { date: '2024-01-15', description: { it: 'Visita di routine - PA 145/92', en: 'Routine visit - BP 145/92', ru: 'Плановый визит - АД 145/92' } },
      { date: '2023-06-20', description: { it: 'Esami ematici - Colesterolo LDL elevato', en: 'Blood tests - Elevated LDL cholesterol', ru: 'Анализ крови - Повышенный холестерин ЛПНП' } },
      { date: '2023-01-10', description: { it: 'ECG nella norma', en: 'ECG normal', ru: 'ЭКГ в норме' } },
    ],
    isNew: true,
  },
  {
    id: '2',
    name: 'Elena Bianchi',
    age: 32,
    gender: 'F',
    aiSummary: {
      it: 'Donna di 32 anni con cefalea persistente da una settimana e disturbi visivi intermittenti. Nessuna anamnesi significativa pregressa. Assume contraccettivi orali.',
      en: '32-year-old female with persistent headache for one week and intermittent visual disturbances. No significant past medical history. Currently on oral contraceptives.',
      ru: '32-летняя женщина с постоянной головной болью в течение недели и периодическими нарушениями зрения. Без значимого анамнеза. Принимает оральные контрацептивы.',
    },
    symptoms: {
      it: ['Cefalea', 'Disturbi visivi', 'Nausea lieve'],
      en: ['Headache', 'Visual disturbances', 'Mild nausea'],
      ru: ['Головная боль', 'Нарушения зрения', 'Лёгкая тошнота'],
    },
    urgency: 'medium',
    suggestedSpecialty: { it: 'Neurologia', en: 'Neurology', ru: 'Неврология' },
    waitingMinutes: 12,
    riskIndicators: {
      it: ['Uso contraccettivi orali', 'Disturbi visivi'],
      en: ['Oral contraceptive use', 'Visual disturbances'],
      ru: ['Приём оральных контрацептивов', 'Нарушения зрения'],
    },
    medicalHistory: [
      { date: '2024-02-01', description: { it: 'Prescrizione contraccettivi orali', en: 'Oral contraceptive prescription', ru: 'Назначение оральных контрацептивов' } },
      { date: '2023-09-15', description: { it: 'Controllo annuale - nella norma', en: 'Annual checkup - normal', ru: 'Ежегодный осмотр - норма' } },
    ],
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    age: 67,
    gender: 'M',
    aiSummary: {
      it: 'Uomo di 67 anni con tosse produttiva da 2 settimane e febbricola serale. Ex fumatore (30 pack-years). Ultimo screening polmonare 2 anni fa.',
      en: '67-year-old male with productive cough for 2 weeks and low-grade evening fever. Former smoker (30 pack-years). Last lung screening 2 years ago.',
      ru: '67-летний мужчина с продуктивным кашлем в течение 2 недель и субфебрильной вечерней лихорадкой. Бывший курильщик (30 пачко-лет). Последний скрининг лёгких 2 года назад.',
    },
    symptoms: {
      it: ['Tosse produttiva', 'Febbricola', 'Sudorazioni notturne', 'Perdita di peso lieve'],
      en: ['Productive cough', 'Low-grade fever', 'Night sweats', 'Mild weight loss'],
      ru: ['Продуктивный кашель', 'Субфебрильная температура', 'Ночная потливость', 'Лёгкая потеря веса'],
    },
    urgency: 'medium',
    suggestedSpecialty: { it: 'Pneumologia', en: 'Pulmonology', ru: 'Пульмонология' },
    waitingMinutes: 8,
    riskIndicators: {
      it: ['Ex fumatore', 'Età > 65', 'Sintomi > 2 settimane'],
      en: ['Former smoker', 'Age > 65', 'Symptoms > 2 weeks'],
      ru: ['Бывший курильщик', 'Возраст > 65', 'Симптомы > 2 недель'],
    },
    medicalHistory: [
      { date: '2023-11-20', description: { it: 'Spirometria - BPCO lieve', en: 'Spirometry - Mild COPD', ru: 'Спирометрия - Лёгкая ХОБЛ' } },
      { date: '2023-03-10', description: { it: 'RX Torace - nella norma', en: 'Chest X-ray - normal', ru: 'Рентген грудной клетки - норма' } },
      { date: '2022-07-05', description: { it: 'Cessazione fumo confermata', en: 'Smoking cessation confirmed', ru: 'Прекращение курения подтверждено' } },
    ],
  },
  {
    id: '4',
    name: 'Anna Lombardi',
    age: 28,
    gender: 'F',
    aiSummary: {
      it: 'Donna di 28 anni con rash cutaneo diffuso comparso 3 giorni fa. Prurito intenso. Ha recentemente iniziato nuovo farmaco per allergia stagionale.',
      en: '28-year-old female with diffuse skin rash appearing 3 days ago. Intense itching. Recently started a new medication for seasonal allergy.',
      ru: '28-летняя женщина с диффузной кожной сыпью, появившейся 3 дня назад. Интенсивный зуд. Недавно начала новый препарат от сезонной аллергии.',
    },
    symptoms: {
      it: ['Rash cutaneo', 'Prurito', 'Lieve gonfiore'],
      en: ['Skin rash', 'Itching', 'Mild swelling'],
      ru: ['Кожная сыпь', 'Зуд', 'Лёгкий отёк'],
    },
    urgency: 'low',
    suggestedSpecialty: { it: 'Dermatologia', en: 'Dermatology', ru: 'Дерматология' },
    waitingMinutes: 22,
    riskIndicators: {
      it: ['Possibile reazione farmacologica'],
      en: ['Possible drug reaction'],
      ru: ['Возможная лекарственная реакция'],
    },
    medicalHistory: [
      { date: '2024-03-01', description: { it: 'Prescrizione antistaminico', en: 'Antihistamine prescription', ru: 'Назначение антигистамина' } },
      { date: '2023-05-10', description: { it: 'Allergia stagionale diagnosticata', en: 'Seasonal allergy diagnosed', ru: 'Диагностирована сезонная аллергия' } },
    ],
  },
  {
    id: '5',
    name: 'Roberto Ferrari',
    age: 45,
    gender: 'M',
    aiSummary: {
      it: 'Uomo di 45 anni con dolore lombare acuto dopo sforzo fisico. Limita le attività quotidiane. Nessun deficit neurologico riferito.',
      en: '45-year-old male with acute lower back pain after physical exertion. Limiting daily activities. No neurological deficit reported.',
      ru: '45-летний мужчина с острой болью в пояснице после физической нагрузки. Ограничение повседневной активности. Неврологический дефицит не обнаружен.',
    },
    symptoms: {
      it: ['Lombalgia acuta', 'Rigidità muscolare', 'Difficoltà nei movimenti'],
      en: ['Acute lower back pain', 'Muscle stiffness', 'Difficulty moving'],
      ru: ['Острая поясничная боль', 'Мышечная скованность', 'Затруднённые движения'],
    },
    urgency: 'low',
    suggestedSpecialty: { it: 'Ortopedia', en: 'Orthopedics', ru: 'Ортопедия' },
    waitingMinutes: 35,
    riskIndicators: {
      it: [],
      en: [],
      ru: [],
    },
    medicalHistory: [
      { date: '2023-08-15', description: { it: 'Visita ortopedica - ernia discale L4-L5 lieve', en: 'Orthopedic visit - mild L4-L5 disc herniation', ru: 'Ортопедический осмотр - лёгкая грыжа диска L4-L5' } },
    ],
  },
];

export const mockHistory: ConsultationHistory[] = [
  { id: 'h1', patientName: 'Lucia Romano', date: '2025-04-09 14:30', summary: { it: 'Controllo follow-up diabete tipo 2. HbA1c migliorata. Terapia confermata.', en: 'Type 2 diabetes follow-up. HbA1c improved. Therapy confirmed.', ru: 'Контроль диабета 2 типа. HbA1c улучшился. Терапия подтверждена.' }, outcome: 'completed' },
  { id: 'h2', patientName: 'Paolo Colombo', date: '2025-04-09 11:15', summary: { it: 'Dolore addominale persistente. Richiesta ecografia addominale. Riferito a gastroenterologia.', en: 'Persistent abdominal pain. Abdominal ultrasound requested. Referred to gastroenterology.', ru: 'Постоянная боль в животе. Назначено УЗИ брюшной полости. Направлен к гастроэнтерологу.' }, outcome: 'referred' },
  { id: 'h3', patientName: 'Maria Greco', date: '2025-04-08 16:45', summary: { it: 'Ansia e insonnia. Discussione approcci non farmacologici. Follow-up tra 2 settimane.', en: 'Anxiety and insomnia. Non-pharmacological approaches discussed. Follow-up in 2 weeks.', ru: 'Тревожность и бессонница. Обсуждены нефармакологические подходы. Повторный визит через 2 недели.' }, outcome: 'followup' },
  { id: 'h4', patientName: 'Francesco Marino', date: '2025-04-08 10:00', summary: { it: 'Dermatite da contatto. Prescrizione cortisone topico. Risoluzione attesa.', en: 'Contact dermatitis. Topical corticosteroid prescribed. Resolution expected.', ru: 'Контактный дерматит. Назначен местный кортикостероид. Ожидается разрешение.' }, outcome: 'completed' },
  { id: 'h5', patientName: 'Chiara Costa', date: '2025-04-07 15:20', summary: { it: 'Sospetta infezione urinaria. Prescrizione antibiotico e urinocoltura.', en: 'Suspected urinary tract infection. Antibiotic and urine culture prescribed.', ru: 'Подозрение на инфекцию мочевыводящих путей. Назначен антибиотик и посев мочи.' }, outcome: 'followup' },
  { id: 'h6', patientName: 'Andrea Ricci', date: '2025-04-07 09:30', summary: { it: 'Cefalea tensiva cronica. Valutazione neurologica raccomandata.', en: 'Chronic tension headache. Neurological evaluation recommended.', ru: 'Хроническая головная боль напряжения. Рекомендована неврологическая оценка.' }, outcome: 'referred' },
];
