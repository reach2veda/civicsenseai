export type AppLanguage = 'en' | 'hi' | 'te';

export interface Translations {
  appName: string;
  tagline: string;
  portalCitizen: string;
  portalAuthority: string;
  portalAdmin: string;
  fileComplaint: string;
  trackComplaint: string;
  myComplaints: string;
  dashboard: string;
  officialQueue: string;
  investigation: string;
  cityMap: string;
  analytics: string;
  aiAssistant: string;
  notifications: string;
  demoNotice: string;
  criticalGrievance: string;
  highPriority: string;
  mediumPriority: string;
  lowPriority: string;
  statusSubmitted: string;
  statusAiAnalyzed: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusVerified: string;
  speakText: string;
  voiceInput: string;
  submitButton: string;
  searchPlaceholder: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    appName: 'CivicSense AI',
    tagline: 'Public Grievance Intelligence & Civic Operations Platform',
    portalCitizen: 'Citizen Portal',
    portalAuthority: 'Authority Portal',
    portalAdmin: 'Administrator',
    fileComplaint: 'File a Complaint',
    trackComplaint: 'Track Grievance',
    myComplaints: 'My Complaints',
    dashboard: 'Dashboard',
    officialQueue: 'Official Queue',
    investigation: 'AI Investigation',
    cityMap: 'Civic Map',
    analytics: 'City Intelligence',
    aiAssistant: 'AI Civic Assistant',
    notifications: 'Notifications',
    demoNotice: 'DEMO ENVIRONMENT — AI Inferences and Data are Simulated for Demonstration',
    criticalGrievance: 'Critical Severity',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    statusSubmitted: 'Submitted',
    statusAiAnalyzed: 'AI Analyzed',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusVerified: 'Citizen Verified',
    speakText: 'Listen (TTS)',
    voiceInput: 'Voice Input',
    submitButton: 'Submit Grievance',
    searchPlaceholder: 'Search complaints by ID, title, area or category...'
  },
  hi: {
    appName: 'सिविकसेंस एआई',
    tagline: 'नागरिक शिकायत समाधान एवं जनसेवा विश्लेषण मंच',
    portalCitizen: 'नागरिक पोर्टल',
    portalAuthority: 'अधिकारी पोर्टल',
    portalAdmin: 'प्रशासक पोर्टल',
    fileComplaint: 'शिकायत दर्ज करें',
    trackComplaint: 'शिकायत ट्रैक करें',
    myComplaints: 'मेरी शिकायतें',
    dashboard: 'डैशबोर्ड',
    officialQueue: 'आधिकारिक कार्यसूची',
    investigation: 'एआई जांच विश्लेषण',
    cityMap: 'नागरिक मानचित्र',
    analytics: 'नगर विश्लेषण',
    aiAssistant: 'एआई सहायक',
    notifications: 'सूचनाएं',
    demoNotice: 'डेमो वातावरण — एआई परिणाम और डेटा प्रदर्शन हेतु सिम्युलेटेड हैं',
    criticalGrievance: 'अत्यंत गंभीर',
    highPriority: 'उच्च प्राथमिकता',
    mediumPriority: 'मध्यम प्राथमिकता',
    lowPriority: 'सामान्य',
    statusSubmitted: 'दर्ज किया गया',
    statusAiAnalyzed: 'एआई विश्लेषित',
    statusAssigned: 'आवंटित',
    statusInProgress: 'प्रगति पर',
    statusResolved: 'समाधान हुआ',
    statusVerified: 'नागरिक द्वारा सत्यापित',
    speakText: 'सुनें (आवाज)',
    voiceInput: 'आवाज से बोलें',
    submitButton: 'शिकायत जमा करें',
    searchPlaceholder: 'शिकायत आईडी, शीर्षक या क्षेत्र द्वारा खोजें...'
  },
  te: {
    appName: 'సివిక్‌సెన్స్ AI',
    tagline: 'ప్రజా ఫిర్యాదుల పరిష్కారం & నగర పాలక వేదిక',
    portalCitizen: 'పౌర పోర్టల్',
    portalAuthority: 'అధికారుల పోర్టల్',
    portalAdmin: 'నిర్వాహకుడు',
    fileComplaint: 'ఫిర్యాదు నమోదు చేయండి',
    trackComplaint: 'ఫిర్యాదు ట్రాక్ చేయండి',
    myComplaints: 'నా ఫిర్యాదులు',
    dashboard: 'డ్యాష్‌బోర్డ్',
    officialQueue: 'అధికారిక జాబితా',
    investigation: 'AI దర్యాప్తు & విశ్లేషణ',
    cityMap: 'నగర మ్యాప్',
    analytics: 'సిటీ ఇంటెలిజెన్స్',
    aiAssistant: 'AI సహాయకుడు',
    notifications: 'నోటిఫికేషన్లు',
    demoNotice: 'డెమో ప్లాట్‌ఫారమ్ — AI విశ్లేషణ మరియు డేటా ప్రదర్శన కోసం రూపొందించబడింది',
    criticalGrievance: 'అత్యంత అత్యవసరం',
    highPriority: 'అధిక ప్రాధాన్యత',
    mediumPriority: 'మధ్యస్థం',
    lowPriority: 'సాధారణం',
    statusSubmitted: 'నమోదైంది',
    statusAiAnalyzed: 'AI విశ్లేషించింది',
    statusAssigned: 'అప్పగించబడింది',
    statusInProgress: 'పురోగతిలో ఉంది',
    statusResolved: 'పరిష్కరించబడింది',
    statusVerified: 'పౌరులు ధృవీకరించారు',
    speakText: 'వినండి (స్వరూపం)',
    voiceInput: 'వాయిస్ రికార్డింగ్',
    submitButton: 'ఫిర్యాదు పంపండి',
    searchPlaceholder: 'ఐడి, శీర్షిక లేదా ప్రాంతం ద్వారా శోధించండి...'
  }
};

export class I18nService {
  private static currentLang: AppLanguage = 'en';

  public static getLanguage(): AppLanguage {
    const saved = localStorage.getItem('civicsense_lang_v1') as AppLanguage;
    if (saved && ['en', 'hi', 'te'].includes(saved)) {
      this.currentLang = saved;
    }
    return this.currentLang;
  }

  public static setLanguage(lang: AppLanguage): void {
    this.currentLang = lang;
    localStorage.setItem('civicsense_lang_v1', lang);
  }

  public static t(key: keyof Translations): string {
    const lang = this.getLanguage();
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
  }

  /**
   * Browser Speech Synthesis / Simulated Text-To-Speech
   */
  public static speak(text: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const lang = this.getLanguage();
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }
}

