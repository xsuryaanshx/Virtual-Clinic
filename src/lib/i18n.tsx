import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'it' | 'en' | 'ru';

const translations: Record<Language, Record<string, string>> = {
  it: {
    // Nav
    'nav.home': 'Home',
    'nav.howItWorks': 'Come Funziona',
    'nav.benefits': 'Vantaggi',
    'nav.login': 'Accedi',
    'nav.signup': 'Registrati',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Esci',

    // Hero
    'hero.title': 'La Tua Clinica Virtuale AI',
    'hero.subtitleLine1': 'Assistenza Istantanea',
    'hero.subtitleLine2': 'Sempre Disponibile',
    // keep old key for fallback compatibility
    'hero.subtitle': 'Assistenza Istantanea, Sempre Disponibile',
    'hero.description': 'Accedi a consulenze mediche intelligenti in pochi secondi. Nessuna attesa, nessuno spostamento.',
    'hero.cta': 'Inizia Consulenza',
    'hero.ctaSecondary': 'Scopri di più',

    // How it works
    'how.title': 'Come Funziona',
    'how.subtitle': 'Tre semplici passaggi per ricevere assistenza medica immediata',
    'how.step1.title': 'Descrivi i Sintomi',
    'how.step1.desc': 'Parla con il nostro assistente AI in modo naturale, come faresti con un medico.',
    'how.step2.title': 'Analisi Intelligente',
    'how.step2.desc': "L'AI analizza i tuoi sintomi e determina il livello di urgenza.",
    'how.step3.title': 'Consulta un Medico',
    'how.step3.desc': 'Collegati con lo specialista giusto tramite videoconsulto.',

    // Benefits
    'benefits.title': 'Perché Sceglierci',
    'benefits.subtitle': "Un'esperienza sanitaria completamente nuova",
    'benefits.noWait': 'Zero Attese',
    'benefits.noWaitDesc': 'Nessuna coda. Accesso immediato alla consulenza medica.',
    'benefits.instant': 'Accesso Istantaneo',
    'benefits.instantDesc': 'Disponibile 24/7, ovunque tu sia.',
    'benefits.ai': 'Intelligenza Artificiale',
    'benefits.aiDesc': 'Triage preciso basato su algoritmi avanzati.',
    'benefits.secure': 'Sicuro e Privato',
    'benefits.secureDesc': 'I tuoi dati sono protetti e crittografati.',

    // Auth
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

    // Dashboard
    'dashboard.title': 'Dashboard Paziente',
    'dashboard.welcome': 'Benvenuto',
    'dashboard.newConsultation': 'Nuova Consulenza',
    'dashboard.previousConsultations': 'Consulenze Precedenti',
    'dashboard.noConsultations': 'Nessuna consulenza precedente',
    'dashboard.startFirst': 'Inizia la tua prima consulenza con il nostro AI.',

    // Chat
    'chat.title': 'Controllo Sintomi AI',
    'chat.placeholder': 'Descrivi i tuoi sintomi...',
    'chat.analyzing': 'Analisi dei sintomi in corso…',
    'chat.greeting': 'Ciao! Sono il tuo assistente medico AI. Come posso aiutarti oggi? Descrivi i tuoi sintomi.',
    'chat.response1': 'Capisco. Da quanto tempo manifesti questi sintomi?',
    'chat.response2': 'Hai notato altri sintomi associati? Febbre, stanchezza?',
    'chat.response3': 'Grazie per le informazioni. Ho raccolto abbastanza dati per il triage. Ti mostro i risultati.',
    'chat.error': "Errore durante la connessione all'assistente AI. Riprova.",

    // Triage
    'triage.title': 'Risultato Triage',
    'triage.urgency': 'Livello di Urgenza',
    'triage.specialist': 'Specialista Consigliato',
    'triage.summary': 'Riepilogo',
    'triage.joinWaiting': "Entra in Sala d'Attesa",
    'triage.viewResult': 'Vedi Risultato Triage',
    'triage.retake': 'Rifai il controllo sintomi',
    'triage.low': 'Basso',
    'triage.medium': 'Medio',
    'triage.high': 'Alto',
    'triage.defaultSpecialist': 'Medico Generico',
    'triage.defaultSummary': 'Il paziente presenta sintomi che richiedono valutazione medica. Si consiglia una consultazione con un medico generico.',

    // Waiting Room
    'waiting.title': "Sala d'Attesa Virtuale",
    'waiting.connecting': 'Connessione al medico…',
    'waiting.estimated': 'Tempo stimato',
    'waiting.minutes': 'minuti',
    'waiting.position': 'Posizione in coda',

    // Doctor
    'doctor.title': 'Dashboard Medico',
    'doctor.patients': 'Pazienti in Attesa',
    'doctor.startConsultation': 'Inizia Consulenza',
    'doctor.summary': 'Riepilogo',

    // Video
    'video.endCall': 'Termina Chiamata',
    'video.patientInfo': 'Info Paziente',
    'video.mute': 'Microfono',
    'video.camera': 'Camera',
  },
  en: {
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.benefits': 'Benefits',
    'nav.login': 'Log In',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Log Out',

    'hero.title': 'Your Virtual AI Clinic',
    'hero.subtitleLine1': 'Instant Assistance',
    'hero.subtitleLine2': 'Always Available',
    'hero.subtitle': 'Instant Assistance, Always Available',
    'hero.description': 'Access intelligent medical consultations in seconds. No waiting, no travel.',
    'hero.cta': 'Start Consulting',
    'hero.ctaSecondary': 'Find out more',

    'how.title': 'How It Works',
    'how.subtitle': 'Three simple steps to get immediate medical care',
    'how.step1.title': 'Describe Symptoms',
    'how.step1.desc': 'Talk to our AI assistant naturally, just like you would with a doctor.',
    'how.step2.title': 'Smart Analysis',
    'how.step2.desc': 'AI analyzes your symptoms and determines urgency level.',
    'how.step3.title': 'Consult a Doctor',
    'how.step3.desc': 'Connect with the right specialist via video consultation.',

    'benefits.title': 'Why Choose Us',
    'benefits.subtitle': 'A completely new healthcare experience',
    'benefits.noWait': 'Zero Wait',
    'benefits.noWaitDesc': 'No queues. Immediate access to medical consultation.',
    'benefits.instant': 'Instant Access',
    'benefits.instantDesc': 'Available 24/7, wherever you are.',
    'benefits.ai': 'Artificial Intelligence',
    'benefits.aiDesc': 'Precise triage based on advanced algorithms.',
    'benefits.secure': 'Secure & Private',
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

    'dashboard.title': 'Patient Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.newConsultation': 'New Consultation',
    'dashboard.previousConsultations': 'Previous Consultations',
    'dashboard.noConsultations': 'No previous consultations',
    'dashboard.startFirst': 'Start your first consultation with our AI.',

    'chat.title': 'AI Symptom Checker',
    'chat.placeholder': 'Describe your symptoms...',
    'chat.analyzing': 'Analyzing your symptoms…',
    'chat.greeting': "Hello! I'm your AI medical assistant. How can I help you today? Please describe your symptoms.",
    'chat.response1': 'I see. How long have you been experiencing these symptoms?',
    'chat.response2': 'Have you noticed any other associated symptoms? Fever, fatigue?',
    'chat.response3': 'Thank you for the information. I have enough data for triage. Let me show you the results.',
    'chat.error': 'Error connecting to the AI assistant. Please try again.',

    'triage.title': 'Triage Result',
    'triage.urgency': 'Urgency Level',
    'triage.specialist': 'Recommended Specialist',
    'triage.summary': 'Summary',
    'triage.joinWaiting': 'Join Waiting Room',
    'triage.viewResult': 'View Triage Result',
    'triage.retake': 'Redo symptom check',
    'triage.low': 'Low',
    'triage.medium': 'Medium',
    'triage.high': 'High',
    'triage.defaultSpecialist': 'General Practitioner',
    'triage.defaultSummary': 'The patient presents symptoms that require medical evaluation. A consultation with a general practitioner is recommended.',

    'waiting.title': 'Virtual Waiting Room',
    'waiting.connecting': 'Connecting to doctor…',
    'waiting.estimated': 'Estimated time',
    'waiting.minutes': 'minutes',
    'waiting.position': 'Queue position',

    'doctor.title': 'Doctor Dashboard',
    'doctor.patients': 'Waiting Patients',
    'doctor.startConsultation': 'Start Consultation',
    'doctor.summary': 'Summary',

    'video.endCall': 'End Call',
    'video.patientInfo': 'Patient Info',
    'video.mute': 'Microphone',
    'video.camera': 'Camera',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.howItWorks': 'Как это работает',
    'nav.benefits': 'Преимущества',
    'nav.login': 'Войти',
    'nav.signup': 'Регистрация',
    'nav.dashboard': 'Панель',
    'nav.logout': 'Выйти',

    'hero.title': 'Ваша Виртуальная AI Клиника',
    'hero.subtitleLine1': 'Мгновенная Помощь',
    'hero.subtitleLine2': 'Всегда Доступна',
    'hero.subtitle': 'Мгновенная помощь в любое время',
    'hero.description': 'Получите интеллектуальную медицинскую консультацию за секунды. Без ожидания, без поездок.',
    'hero.cta': 'Начать Консультацию',
    'hero.ctaSecondary': 'Узнать больше',

    'how.title': 'Как Это Работает',
    'how.subtitle': 'Три простых шага для получения немедленной медицинской помощи',
    'how.step1.title': 'Опишите Симптомы',
    'how.step1.desc': 'Общайтесь с нашим AI-ассистентом естественно, как с врачом.',
    'how.step2.title': 'Умный Анализ',
    'how.step2.desc': 'AI анализирует ваши симптомы и определяет уровень срочности.',
    'how.step3.title': 'Консультация Врача',
    'how.step3.desc': 'Свяжитесь с нужным специалистом по видеосвязи.',

    'benefits.title': 'Почему Мы',
    'benefits.subtitle': 'Совершенно новый опыт здравоохранения',
    'benefits.noWait': 'Без Ожидания',
    'benefits.noWaitDesc': 'Никаких очередей. Мгновенный доступ к консультации.',
    'benefits.instant': 'Мгновенный Доступ',
    'benefits.instantDesc': 'Доступно 24/7, где бы вы ни были.',
    'benefits.ai': 'Искусственный Интеллект',
    'benefits.aiDesc': 'Точная сортировка на основе передовых алгоритмов.',
    'benefits.secure': 'Безопасно и Приватно',
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

    'dashboard.title': 'Панель Пациента',
    'dashboard.welcome': 'Добро пожаловать',
    'dashboard.newConsultation': 'Новая Консультация',
    'dashboard.previousConsultations': 'Предыдущие Консультации',
    'dashboard.noConsultations': 'Нет предыдущих консультаций',
    'dashboard.startFirst': 'Начните первую консультацию с нашим AI.',

    'chat.title': 'AI Проверка Симптомов',
    'chat.placeholder': 'Опишите ваши симптомы...',
    'chat.analyzing': 'Анализ симптомов…',
    'chat.greeting': 'Здравствуйте! Я ваш медицинский AI-ассистент. Как я могу помочь? Опишите ваши симптомы.',
    'chat.response1': 'Понятно. Как давно у вас эти симптомы?',
    'chat.response2': 'Заметили ли вы другие сопутствующие симптомы? Температура, усталость?',
    'chat.response3': 'Спасибо за информацию. У меня достаточно данных для сортировки. Показываю результаты.',
    'chat.error': 'Ошибка подключения к AI-ассистенту. Попробуйте снова.',

    'triage.title': 'Результат Сортировки',
    'triage.urgency': 'Уровень Срочности',
    'triage.specialist': 'Рекомендуемый Специалист',
    'triage.summary': 'Резюме',
    'triage.joinWaiting': 'Войти в Зал Ожидания',
    'triage.viewResult': 'Посмотреть результат триажа',
    'triage.retake': 'Повторить проверку симптомов',
    'triage.low': 'Низкий',
    'triage.medium': 'Средний',
    'triage.high': 'Высокий',
    'triage.defaultSpecialist': 'Врач общей практики',
    'triage.defaultSummary': 'Пациент предъявляет симптомы, требующие медицинской оценки. Рекомендуется консультация с врачом общей практики.',

    'waiting.title': 'Виртуальный Зал Ожидания',
    'waiting.connecting': 'Подключение к врачу…',
    'waiting.estimated': 'Ожидаемое время',
    'waiting.minutes': 'минут',
    'waiting.position': 'Позиция в очереди',

    'doctor.title': 'Панель Врача',
    'doctor.patients': 'Ожидающие Пациенты',
    'doctor.startConsultation': 'Начать Консультацию',
    'doctor.summary': 'Резюме',

    'video.endCall': 'Завершить Звонок',
    'video.patientInfo': 'Инфо о Пациенте',
    'video.mute': 'Микрофон',
    'video.camera': 'Камера',
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

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback(
    (key: string) => translations[language][key] || key,
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
