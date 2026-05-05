import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'it' | 'en' | 'ru';

const translations: Record<Language, Record<string, string>> = {
  it: {
    'nav.home': 'Home',
    'nav.howItWorks': 'Come funziona',
    'nav.benefits': 'Vantaggi',
    'nav.login': 'Accedi',
    'nav.signup': 'Registrati',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Esci',

    'hero.badge': 'Sanità potenziata dall’AI',
    'hero.title': 'La tua clinica virtuale AI',
    'hero.subtitle': 'Assistenza istantanea, sempre disponibile',
    'hero.description': 'Accedi a consulenze mediche intelligenti in pochi secondi. Nessuna attesa, nessuno spostamento.',
    'hero.cta': 'Inizia consulenza',
    'hero.ctaSecondary': 'Scopri di più',

    'how.title': 'Come funziona',
    'how.subtitle': 'Tre semplici passaggi per ricevere assistenza medica immediata',
    'how.step1.title': 'Descrivi i sintomi',
    'how.step1.desc': 'Parla con il nostro assistente AI in modo naturale, come faresti con un medico.',
    'how.step2.title': 'Analisi intelligente',
    'how.step2.desc': 'L’AI analizza i tuoi sintomi e determina il livello di urgenza.',
    'how.step3.title': 'Consulta un medico',
    'how.step3.desc': 'Collegati con lo specialista giusto tramite videoconsulto.',

    'benefits.title': 'Perché sceglierci',
    'benefits.subtitle': 'Un’esperienza sanitaria completamente nuova',
    'benefits.noWait': 'Zero attese',
    'benefits.noWaitDesc': 'Nessuna coda. Accesso immediato alla consulenza medica.',
    'benefits.instant': 'Accesso istantaneo',
    'benefits.instantDesc': 'Disponibile 24/7, ovunque tu sia.',
    'benefits.ai': 'Intelligenza artificiale',
    'benefits.aiDesc': 'Triage preciso basato su algoritmi avanzati.',
    'benefits.secure': 'Sicuro e privato',
    'benefits.secureDesc': 'I tuoi dati sono protetti e crittografati.',

    'auth.login': 'Accedi',
    'auth.signup': 'Registrati',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Nome completo',
    'auth.forgotPassword': 'Password dimenticata?',
    'auth.noAccount': 'Non hai un account?',
    'auth.hasAccount': 'Hai già un account?',
    'auth.welcome': 'Bentornato',
    'auth.createAccount': 'Crea il tuo account',
    'auth.patientRole': 'Paziente',
    'auth.doctorRole': 'Medico',
    'auth.defaultPatientName': 'Paziente',
    'auth.defaultDoctorName': 'Medico',

    'dashboard.title': 'Dashboard paziente',
    'dashboard.welcome': 'Benvenuto',
    'dashboard.newConsultation': 'Nuova consulenza',
    'dashboard.previousConsultations': 'Consulenze precedenti',
    'dashboard.noConsultations': 'Nessuna consulenza precedente',
    'dashboard.startFirst': 'Inizia la tua prima consulenza con il nostro AI.',

    'chat.title': 'Controllo sintomi AI',
    'chat.placeholder': 'Descrivi i tuoi sintomi...',
    'chat.analyzing': 'Analisi dei sintomi in corso…',
    'chat.greeting': 'Ciao! Sono il tuo assistente medico AI. Come posso aiutarti oggi? Descrivi i tuoi sintomi.',
    'chat.response1': 'Capisco. Da quanto tempo manifesti questi sintomi?',
    'chat.response2': 'Hai notato altri sintomi associati? Febbre, stanchezza?',
    'chat.response3': 'Grazie per le informazioni. Ho raccolto abbastanza dati per il triage. Ti mostro i risultati.',

    'triage.title': 'Risultato triage',
    'triage.urgency': 'Livello di urgenza',
    'triage.specialist': 'Specialista consigliato',
    'triage.summary': 'Riepilogo',
    'triage.joinWaiting': 'Entra in sala d’attesa',
    'triage.low': 'Basso',
    'triage.medium': 'Medio',
    'triage.high': 'Alto',
    'triage.summaryText': 'Il paziente presenta sintomi influenzali persistenti da 5 giorni con febbre moderata. Si consiglia una consultazione con un medico generico per una valutazione approfondita.',

    'waiting.title': 'Sala d’attesa virtuale',
    'waiting.connecting': 'Connessione al medico…',
    'waiting.estimated': 'Tempo stimato',
    'waiting.minutes': 'minuti',
    'waiting.position': 'Posizione in coda',

    'doctor.title': 'Dashboard medico',
    'doctor.patients': 'Pazienti in attesa',
    'doctor.startConsultation': 'Inizia consulenza',
    'doctor.summary': 'Riepilogo',

    'video.endCall': 'Termina chiamata',
    'video.patientInfo': 'Info paziente',
    'video.mute': 'Microfono',
    'video.camera': 'Camera',
    'video.startingCamera': 'Avvio fotocamera…',
    'video.cameraUnavailable': 'Fotocamera non disponibile',
    'video.cameraPermissionDenied': 'Consenti l’accesso alla fotocamera per iniziare la videoconsulenza.',

    'consultation.generalPractitioner': 'Medico generico',
    'consultation.cardiologist': 'Cardiologo',
    'consultation.dermatologist': 'Dermatologo',
    'consultation.summaryBloodPressure': 'Controllo pressione arteriosa',
    'consultation.summaryFlu': 'Sintomi influenzali persistenti',
    'consultation.summarySkinIrritation': 'Irritazione cutanea',
    'consultation.summaryChestPain': 'Dolore toracico acuto con dispnea',
    'consultation.summaryFluPersistent': 'Sintomi influenzali persistenti da 5 giorni',
    'consultation.summaryPostOp': 'Controllo di routine post-operatorio',

    'common.patient': 'Paziente',
    'common.yearsOld': 'anni',
    'common.minutesShort': 'min',
    'footer.rights': 'Tutti i diritti riservati.',
  },
  en: {
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.benefits': 'Benefits',
    'nav.login': 'Log In',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Log Out',

    'hero.badge': 'AI-powered healthcare',
    'hero.title': 'Your AI Virtual Clinic',
    'hero.subtitle': 'Instant care, anytime',
    'hero.description': 'Access intelligent medical consultations in seconds. No waiting, no travel.',
    'hero.cta': 'Start consultation',
    'hero.ctaSecondary': 'Learn more',

    'how.title': 'How It Works',
    'how.subtitle': 'Three simple steps to get immediate medical care',
    'how.step1.title': 'Describe symptoms',
    'how.step1.desc': 'Talk to our AI assistant naturally, just like you would with a doctor.',
    'how.step2.title': 'Smart analysis',
    'how.step2.desc': 'AI analyzes your symptoms and determines the urgency level.',
    'how.step3.title': 'Consult a doctor',
    'how.step3.desc': 'Connect with the right specialist via video consultation.',

    'benefits.title': 'Why choose us',
    'benefits.subtitle': 'A completely new healthcare experience',
    'benefits.noWait': 'Zero wait',
    'benefits.noWaitDesc': 'No queues. Immediate access to medical consultation.',
    'benefits.instant': 'Instant access',
    'benefits.instantDesc': 'Available 24/7, wherever you are.',
    'benefits.ai': 'Artificial intelligence',
    'benefits.aiDesc': 'Precise triage based on advanced algorithms.',
    'benefits.secure': 'Secure & private',
    'benefits.secureDesc': 'Your data is protected and encrypted.',

    'auth.login': 'Log In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full name',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.welcome': 'Welcome back',
    'auth.createAccount': 'Create your account',
    'auth.patientRole': 'Patient',
    'auth.doctorRole': 'Doctor',
    'auth.defaultPatientName': 'Patient',
    'auth.defaultDoctorName': 'Doctor',

    'dashboard.title': 'Patient dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.newConsultation': 'New consultation',
    'dashboard.previousConsultations': 'Previous consultations',
    'dashboard.noConsultations': 'No previous consultations',
    'dashboard.startFirst': 'Start your first consultation with our AI.',

    'chat.title': 'AI symptom checker',
    'chat.placeholder': 'Describe your symptoms...',
    'chat.analyzing': 'Analyzing your symptoms…',
    'chat.greeting': "Hello! I'm your AI medical assistant. How can I help you today? Please describe your symptoms.",
    'chat.response1': 'I see. How long have you been experiencing these symptoms?',
    'chat.response2': 'Have you noticed any other associated symptoms? Fever, fatigue?',
    'chat.response3': 'Thank you for the information. I have enough data for triage. Let me show you the results.',

    'triage.title': 'Triage result',
    'triage.urgency': 'Urgency level',
    'triage.specialist': 'Recommended specialist',
    'triage.summary': 'Summary',
    'triage.joinWaiting': 'Join waiting room',
    'triage.low': 'Low',
    'triage.medium': 'Medium',
    'triage.high': 'High',
    'triage.summaryText': 'The patient reports flu-like symptoms for 5 days with a moderate fever. A general practitioner consultation is recommended for a more complete evaluation.',

    'waiting.title': 'Virtual waiting room',
    'waiting.connecting': 'Connecting to doctor…',
    'waiting.estimated': 'Estimated time',
    'waiting.minutes': 'minutes',
    'waiting.position': 'Queue position',

    'doctor.title': 'Doctor dashboard',
    'doctor.patients': 'Waiting patients',
    'doctor.startConsultation': 'Start consultation',
    'doctor.summary': 'Summary',

    'video.endCall': 'End call',
    'video.patientInfo': 'Patient info',
    'video.mute': 'Microphone',
    'video.camera': 'Camera',
    'video.startingCamera': 'Starting camera…',
    'video.cameraUnavailable': 'Camera unavailable',
    'video.cameraPermissionDenied': 'Allow camera access to begin the video consultation.',

    'consultation.generalPractitioner': 'General practitioner',
    'consultation.cardiologist': 'Cardiologist',
    'consultation.dermatologist': 'Dermatologist',
    'consultation.summaryBloodPressure': 'Blood pressure check',
    'consultation.summaryFlu': 'Persistent flu symptoms',
    'consultation.summarySkinIrritation': 'Skin irritation',
    'consultation.summaryChestPain': 'Acute chest pain with shortness of breath',
    'consultation.summaryFluPersistent': 'Flu-like symptoms persisting for 5 days',
    'consultation.summaryPostOp': 'Routine post-operative follow-up',

    'common.patient': 'Patient',
    'common.yearsOld': 'y/o',
    'common.minutesShort': 'min',
    'footer.rights': 'All rights reserved.',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.howItWorks': 'Как это работает',
    'nav.benefits': 'Преимущества',
    'nav.login': 'Войти',
    'nav.signup': 'Регистрация',
    'nav.dashboard': 'Панель',
    'nav.logout': 'Выйти',

    'hero.badge': 'Медицина с поддержкой AI',
    'hero.title': 'Ваша виртуальная AI-клиника',
    'hero.subtitle': 'Мгновенная помощь в любое время',
    'hero.description': 'Получите интеллектуальную медицинскую консультацию за секунды. Без ожидания и без поездок.',
    'hero.cta': 'Начать консультацию',
    'hero.ctaSecondary': 'Узнать больше',

    'how.title': 'Как это работает',
    'how.subtitle': 'Три простых шага для получения немедленной медицинской помощи',
    'how.step1.title': 'Опишите симптомы',
    'how.step1.desc': 'Общайтесь с нашим AI-ассистентом естественно, как с врачом.',
    'how.step2.title': 'Умный анализ',
    'how.step2.desc': 'AI анализирует ваши симптомы и определяет уровень срочности.',
    'how.step3.title': 'Консультация врача',
    'how.step3.desc': 'Свяжитесь с нужным специалистом по видеосвязи.',

    'benefits.title': 'Почему мы',
    'benefits.subtitle': 'Совершенно новый опыт здравоохранения',
    'benefits.noWait': 'Без ожидания',
    'benefits.noWaitDesc': 'Никаких очередей. Мгновенный доступ к консультации.',
    'benefits.instant': 'Мгновенный доступ',
    'benefits.instantDesc': 'Доступно 24/7, где бы вы ни были.',
    'benefits.ai': 'Искусственный интеллект',
    'benefits.aiDesc': 'Точная сортировка на основе передовых алгоритмов.',
    'benefits.secure': 'Безопасно и приватно',
    'benefits.secureDesc': 'Ваши данные защищены и зашифрованы.',

    'auth.login': 'Войти',
    'auth.signup': 'Регистрация',
    'auth.email': 'Электронная почта',
    'auth.password': 'Пароль',
    'auth.name': 'Полное имя',
    'auth.forgotPassword': 'Забыли пароль?',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.hasAccount': 'Уже есть аккаунт?',
    'auth.welcome': 'С возвращением',
    'auth.createAccount': 'Создайте аккаунт',
    'auth.patientRole': 'Пациент',
    'auth.doctorRole': 'Врач',
    'auth.defaultPatientName': 'Пациент',
    'auth.defaultDoctorName': 'Врач',

    'dashboard.title': 'Панель пациента',
    'dashboard.welcome': 'Добро пожаловать',
    'dashboard.newConsultation': 'Новая консультация',
    'dashboard.previousConsultations': 'Предыдущие консультации',
    'dashboard.noConsultations': 'Нет предыдущих консультаций',
    'dashboard.startFirst': 'Начните первую консультацию с нашим AI.',

    'chat.title': 'AI-проверка симптомов',
    'chat.placeholder': 'Опишите ваши симптомы...',
    'chat.analyzing': 'Анализ симптомов…',
    'chat.greeting': 'Здравствуйте! Я ваш медицинский AI-ассистент. Как я могу помочь? Опишите ваши симптомы.',
    'chat.response1': 'Понятно. Как давно у вас эти симптомы?',
    'chat.response2': 'Заметили ли вы другие сопутствующие симптомы? Температура, усталость?',
    'chat.response3': 'Спасибо за информацию. У меня достаточно данных для сортировки. Показываю результаты.',

    'triage.title': 'Результат сортировки',
    'triage.urgency': 'Уровень срочности',
    'triage.specialist': 'Рекомендуемый специалист',
    'triage.summary': 'Резюме',
    'triage.joinWaiting': 'Перейти в зал ожидания',
    'triage.low': 'Низкий',
    'triage.medium': 'Средний',
    'triage.high': 'Высокий',
    'triage.summaryText': 'Пациент сообщает о симптомах гриппа в течение 5 дней и умеренной температуре. Рекомендуется консультация врача общей практики для более полной оценки.',

    'waiting.title': 'Виртуальный зал ожидания',
    'waiting.connecting': 'Подключение к врачу…',
    'waiting.estimated': 'Ожидаемое время',
    'waiting.minutes': 'минут',
    'waiting.position': 'Позиция в очереди',

    'doctor.title': 'Панель врача',
    'doctor.patients': 'Ожидающие пациенты',
    'doctor.startConsultation': 'Начать консультацию',
    'doctor.summary': 'Резюме',

    'video.endCall': 'Завершить звонок',
    'video.patientInfo': 'Информация о пациенте',
    'video.mute': 'Микрофон',
    'video.camera': 'Камера',
    'video.startingCamera': 'Запуск камеры…',
    'video.cameraUnavailable': 'Камера недоступна',
    'video.cameraPermissionDenied': 'Разрешите доступ к камере, чтобы начать видеоконсультацию.',

    'consultation.generalPractitioner': 'Врач общей практики',
    'consultation.cardiologist': 'Кардиолог',
    'consultation.dermatologist': 'Дерматолог',
    'consultation.summaryBloodPressure': 'Проверка артериального давления',
    'consultation.summaryFlu': 'Затяжные симптомы гриппа',
    'consultation.summarySkinIrritation': 'Раздражение кожи',
    'consultation.summaryChestPain': 'Острая боль в груди с одышкой',
    'consultation.summaryFluPersistent': 'Симптомы гриппа сохраняются 5 дней',
    'consultation.summaryPostOp': 'Плановый послеоперационный осмотр',

    'common.patient': 'Пациент',
    'common.yearsOld': 'лет',
    'common.minutesShort': 'мин',
    'footer.rights': 'Все права защищены.',
  },
};

const languageNames: Record<Language, string> = {
  it: 'IT',
  en: 'EN',
  ru: 'RU',
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageNames: Record<Language, string>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'it';

  try {
    const stored = localStorage.getItem('vc_language');
    if (stored === 'it' || stored === 'en' || stored === 'ru') {
      return stored;
    }
  } catch {
    return 'it';
  }

  return 'it';
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);

    if (typeof window !== 'undefined') {
      localStorage.setItem('vc_language', lang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: string) => translations[language]?.[key] || key,
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languageNames }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
