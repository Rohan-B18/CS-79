import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Globe2, 
  MessageSquarePlus, 
  ScanLine, 
  Send, 
  X, 
  MessagesSquare, 
  ThumbsUp, 
  Quote, 
  MapPin, 
  Camera, 
  Share2,
  QrCode,
  ArrowRight,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import './i18n';

// Types
type Message = {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  language: string;
  isReply?: boolean;
  parentId?: string;
  upvotes: number;
  avatar?: string;
  category?: string;
  isPinned?: boolean;
  isVerified?: boolean;
};

type UserProfile = {
  name: string;
  country: string;
  avatar: string;
  isVerified?: boolean;
  joinDate?: string;
  messageCount?: number;
};

// Mock data
const mockUsers: UserProfile[] = [
  { name: "Sarah", country: "US", avatar: "👩‍🦰", isVerified: true, joinDate: "2024-01-15", messageCount: 42 },
  { name: "Carlos", country: "ES", avatar: "👨‍💼", isVerified: true, joinDate: "2024-02-03", messageCount: 38 },
  { name: "Ming", country: "CN", avatar: "👩‍🎓", isVerified: false, joinDate: "2024-01-28", messageCount: 25 },
  { name: "Priya", country: "IN", avatar: "👩‍⚕️", isVerified: true, joinDate: "2024-02-10", messageCount: 31 },
  { name: "Olena", country: "UA", avatar: "👩‍🏫", isVerified: false, joinDate: "2024-01-20", messageCount: 19 },
  { name: "Niran", country: "TH", avatar: "👨‍🎨", isVerified: true, joinDate: "2024-02-05", messageCount: 47 },
];

const mockQuestions: Message[] = [
  {
    id: "1",
    text: "Where is the best place to take a group photo?",
    author: "Sarah (US)",
    timestamp: "2m ago",
    language: "English",
    upvotes: 12,
    avatar: "👩‍🦰",
    category: "photos",
    isPinned: true,
    isVerified: true
  },
  {
    id: "2",
    text: "Family-friendly restroom near Harvard Yard?",
    author: "Ming (CN)",
    timestamp: "5m ago",
    language: "Chinese",
    upvotes: 15,
    avatar: "👩‍🎓",
    category: "accessibility"
  },
  {
    id: "3",
    text: "Quick lunch nearby that students actually like",
    author: "Olena (UA)",
    timestamp: "7m ago",
    language: "Ukrainian",
    upvotes: 9,
    avatar: "👩‍🏫",
    category: "food"
  },
  {
    id: "4",
    text: "Is there a visitor center with maps and information?",
    author: "Priya (IN)",
    timestamp: "1m ago",
    language: "Hindi",
    upvotes: 6,
    avatar: "👩‍⚕️",
    category: "info",
    isVerified: true
  }
];

const mockAnswers: Message[] = [
  {
    id: "a1",
    text: "The steps of Widener Library at golden hour.",
    author: "Mina (KR)",
    timestamp: "12m ago",
    language: "Korean",
    upvotes: 22,
    avatar: "👩‍💼",
    parentId: "1",
    isVerified: true
  },
  {
    id: "a2",
    text: "Northwest corner of the Yard facing Massachusetts Hall.",
    author: "Leo (AR)",
    timestamp: "25m ago",
    language: "Spanish",
    upvotes: 11,
    avatar: "👨‍💼",
    parentId: "1"
  },
  {
    id: "a3",
    text: "Smith Campus Center, 1st floor — clean and accessible.",
    author: "Aya (JP)",
    timestamp: "8m ago",
    language: "Japanese",
    upvotes: 31,
    avatar: "👩‍🎓",
    parentId: "2",
    isVerified: true
  },
  {
    id: "a4",
    text: "Cava or Felipe's rooftop if weather is nice.",
    author: "Ravi (IN)",
    timestamp: "1h ago",
    language: "Hindi",
    upvotes: 19,
    avatar: "👨‍🎨",
    parentId: "3"
  },
  {
    id: "a5",
    text: "Smith Campus Center has a great visitor info desk on the first floor!",
    author: "Carlos (ES)",
    timestamp: "just now",
    language: "Spanish",
    upvotes: 4,
    avatar: "👨‍💼",
    parentId: "4",
    isVerified: true
  }
];

// Components
function Pill({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <span 
      className={`text-xs rounded-full bg-crimson-100 px-3 py-1 border border-crimson-200 cursor-pointer hover:bg-crimson-200 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}

function LanguageSelector({ 
  selectedLang, 
  onLangChange 
}: { 
  selectedLang: string; 
  onLangChange: (lang: string) => void; 
}) {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" }
  ];
  
  const handleLanguageChange = (langCode: string) => {
    console.log('Changing language to:', langCode);
    i18n.changeLanguage(langCode);
    onLangChange(langCode);
  };
  
  return (
    <div className="flex items-center gap-2">
      <Globe2 className="size-4 text-crimson-600" />
      <select
        value={selectedLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="rounded-md border border-crimson-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Header({ 
  selectedLang, 
  onLangChange, 
  onBackToLanding,
  onViewMap,
  onToggleDarkMode,
  isDarkMode
}: { 
  selectedLang: string; 
  onLangChange: (lang: string) => void;
  onBackToLanding: () => void;
  onViewMap?: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/90 dark:bg-gray-900/90 border-b border-crimson-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-crimson-600 hover:text-crimson-800 dark:text-crimson-400 dark:hover:text-crimson-300 transition-colors"
        >
          <ArrowRight className="size-4 rotate-180" />
          <span className="text-sm">{t('backToLanding')}</span>
        </button>
        <div className="flex items-center gap-2">
          <MessagesSquare className="size-6 text-crimson-600 dark:text-crimson-400" />
          <div className="font-semibold text-gray-900 dark:text-white">{t('harvardTouristChat')}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            ({selectedLang.toUpperCase()})
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {onViewMap && (
            <button
              onClick={onViewMap}
              className="flex items-center gap-2 text-crimson-600 hover:text-crimson-800 dark:text-crimson-400 dark:hover:text-crimson-300 transition-colors"
            >
              <MapPin className="size-4" />
              <span className="text-sm">Map</span>
            </button>
          )}
          <LanguageSelector selectedLang={selectedLang} onLangChange={onLangChange} />
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Interactive Map Component
function InteractiveMap({ 
  selectedLang, 
  onLangChange, 
  onBackToLanding, 
  onViewForum, 
  onToggleDarkMode, 
  isDarkMode 
}: { 
  selectedLang: string; 
  onLangChange: (lang: string) => void;
  onBackToLanding: () => void;
  onViewForum: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const campusLocations = [
    { id: 'smith-center', name: 'Smith Campus Center', type: 'services', x: 15, y: 35, description: 'Modern hub with dining, services, and visitor information' },
    { id: 'science-center', name: 'Science Center', type: 'academic', x: 75, y: 35, description: 'Modern academic building with classrooms and labs' },
    { id: 'john-harvard', name: 'John Harvard Statue', type: 'landmark', x: 50, y: 40, description: 'Famous bronze statue of John Harvard, a popular photo spot' },
    { id: 'memorial', name: 'Memorial Hall', type: 'landmark', x: 80, y: 60, description: 'Historic building with Sanders Theatre and Annenberg Hall' },
    { id: 'widener', name: 'Widener Library', type: 'library', x: 42, y: 45, description: 'Harvard\'s main library with over 3.5 million volumes' },
    { id: 'art-museum', name: 'Harvard Art Museum', type: 'cultural', x: 50, y: 80, description: 'World-class art collections and special exhibits' }
  ];
  
  const locationDetails: { [key: string]: any } = {
    'smith-center': {
      name: 'Smith Campus Center',
      description: 'Modern hub with dining, services, and visitor information',
      hours: 'Mon-Fri: 7am-11pm, Sat-Sun: 9am-10pm',
      features: ['Visitor info', 'Dining options', 'WiFi', 'Restrooms', 'Study spaces']
    },
    'science-center': {
      name: 'Science Center',
      description: 'Modern academic building with classrooms and labs',
      hours: 'Mon-Fri: 7am-10pm, Sat-Sun: 9am-8pm',
      features: ['Classrooms', 'Labs', 'Study spaces', 'WiFi', 'Computer labs']
    },
    'john-harvard': {
      name: 'John Harvard Statue',
      description: 'Famous bronze statue of John Harvard, a popular photo spot',
      hours: 'Open 24/7',
      features: ['Photo opportunities', 'Historic landmark', 'Harvard Yard', 'Tourist attraction']
    },
    'memorial': {
      name: 'Memorial Hall',
      description: 'Historic building with Sanders Theatre and Annenberg Hall',
      hours: 'Open for tours and events',
      features: ['Historic architecture', 'Sanders Theatre', 'Dining hall', 'Events']
    },
    'widener': {
      name: 'Widener Library',
      description: 'Harvard\'s main library with over 3.5 million volumes',
      hours: 'Mon-Fri: 8am-10pm, Sat-Sun: 9am-8pm',
      features: ['No public access', 'WiFi', 'Restrooms', 'Study areas', 'Research']
    },
    'art-museum': {
      name: 'Harvard Art Museum',
      description: 'World-class art collections and special exhibits',
      hours: 'Daily: 9am-5pm',
      features: ['Art collections', 'Special exhibits', 'Gift shop', 'Tours', 'Education programs']
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button 
            onClick={onBackToLanding} 
            className="flex items-center gap-2 text-crimson-600 hover:text-crimson-800 dark:text-crimson-400 dark:hover:text-crimson-300 transition-colors"
          >
            <ArrowRight className="size-4 rotate-180" />
            <span className="text-sm">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <MapPin className="size-6 text-crimson-600 dark:text-crimson-400" />
            <div className="font-semibold text-gray-900 dark:text-white">Interactive Campus Map</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <LanguageSelector selectedLang={selectedLang} onLangChange={onLangChange} />
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <Sun className="size-5 text-yellow-500" /> : <Moon className="size-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Map Area */}
        <div className="flex-1 relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-800 dark:to-gray-700">
          <div className="absolute inset-0 p-8">
            <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Cambridge Map Background */}
              <div className="absolute inset-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl overflow-hidden">
                {/* Streets and Roads */}
                <div className="absolute inset-0">
                  {/* Main Streets */}
                  <div className="absolute w-full h-1 bg-gray-300 dark:bg-gray-500 top-1/4"></div>
                  <div className="absolute w-full h-1 bg-gray-300 dark:bg-gray-500 top-1/2"></div>
                  <div className="absolute w-full h-1 bg-gray-300 dark:bg-gray-500 top-3/4"></div>
                  <div className="absolute h-full w-1 bg-gray-300 dark:bg-gray-500 left-1/4"></div>
                  <div className="absolute h-full w-1 bg-gray-300 dark:bg-gray-500 left-1/2"></div>
                  <div className="absolute h-full w-1 bg-gray-300 dark:bg-gray-500 left-3/4"></div>
                </div>
                
                {/* Harvard Yard Area */}
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-green-100 dark:bg-green-800 border-2 border-green-300 dark:border-green-600 rounded-lg">
                  <div className="absolute inset-2 bg-green-50 dark:bg-green-700 rounded border border-green-200 dark:border-green-600">
                    <div className="text-xs text-green-700 dark:text-green-300 font-semibold p-1">Harvard Yard</div>
                  </div>
                </div>
                
                {/* Location Markers */}
                {campusLocations.map((location) => (
                  <motion.button
                    key={location.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + Math.random() * 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-200 border-2 border-white ${
                      selectedLocation === location.id 
                        ? 'bg-crimson-600 scale-125 shadow-xl' 
                        : 'bg-crimson-500 hover:bg-crimson-600'
                    }`}
                    style={{ left: `${location.x}%`, top: `${location.y}%` }}
                    title={location.name}
                  >
                    {location.type === 'library' && '📚'}
                    {location.type === 'landmark' && (location.id === 'john-harvard' ? '🗿' : '🏛️')}
                    {location.type === 'services' && 'ℹ️'}
                    {location.type === 'academic' && '🔬'}
                    {location.type === 'cultural' && '🎨'}
                  </motion.button>
                ))}
                
                {/* Current Location Indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    You are here
                  </div>
                </div>
                
                {/* Map Legend */}
                <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Cambridge, MA</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Harvard University Campus</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Details Panel */}
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          {selectedLocation ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locationDetails[selectedLocation]?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {locationDetails[selectedLocation]?.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Hours</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {locationDetails[selectedLocation]?.hours}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h4>
                  <ul className="space-y-1">
                    {locationDetails[selectedLocation]?.features.map((feature: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-crimson-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={onViewForum}
                    className="w-full bg-crimson-600 hover:bg-crimson-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Ask about this location
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 text-center">
              <MapPin className="size-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select a Location
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click on any marker to see details about that location on campus.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Landing Page
function LandingPage({ 
  onJoinChat, 
  onViewMap, 
  selectedLang, 
  onLangChange, 
  onToggleDarkMode, 
  isDarkMode 
}: { 
  onJoinChat: () => void;
  onViewMap: () => void;
  selectedLang: string;
  onLangChange: (lang: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crimson-50 via-white to-crimson-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-crimson-600 flex items-center justify-center">
              <MessageSquarePlus className="size-5 text-white" />
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">Harvard Tourist Guide</div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector selectedLang={selectedLang} onLangChange={onLangChange} />
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <Sun className="size-5 text-yellow-500" /> : <Moon className="size-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to Harvard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your complete guide to navigating campus, connecting with fellow visitors, and discovering everything Harvard has to offer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onJoinChat}
                className="inline-flex items-center gap-3 bg-crimson-600 hover:bg-crimson-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageSquarePlus className="size-6" />
                Join Community Forum
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewMap}
                className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-crimson-600 border-2 border-crimson-600 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MapPin className="size-6" />
                Interactive Map
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Campus Information Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Essential Campus Information
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about visiting Harvard
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Facilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl bg-crimson-100 text-crimson-600 dark:bg-crimson-900 dark:text-crimson-400 flex items-center justify-center">
                <Camera className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Facilities & Services
              </h3>
            </div>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Visitor Information Center</li>
              <li>• Restrooms & Accessibility</li>
              <li>• Dining Options</li>
              <li>• WiFi Access</li>
              <li>• Lost & Found</li>
            </ul>
          </motion.div>

          {/* Tours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl bg-crimson-100 text-crimson-600 dark:bg-crimson-900 dark:text-crimson-400 flex items-center justify-center">
                <MapPin className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Campus Tours
              </h3>
            </div>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Self-Guided Walking Tours</li>
              <li>• Historical Landmarks</li>
              <li>• Photo Opportunities</li>
              <li>• Student Life Areas</li>
              <li>• Library Access</li>
            </ul>
          </motion.div>

          {/* About Harvard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl bg-crimson-100 text-crimson-600 dark:bg-crimson-900 dark:text-crimson-400 flex items-center justify-center">
                <MessageSquarePlus className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Learn about Harvard
              </h3>
            </div>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Academics</li>
              <li>• Campus</li>
              <li>• News</li>
              <li>• Athletics</li>
              <li>• Leadership</li>
            </ul>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-r from-crimson-600 to-crimson-700 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Community Forum</h3>
            <p className="mb-4">Ask questions, share tips, and connect with fellow visitors and students.</p>
            <button
              onClick={onJoinChat}
              className="bg-white text-crimson-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Discussion
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Interactive Map</h3>
            <p className="mb-4">Find your location and discover what's nearby on campus.</p>
            <button
              onClick={onViewMap}
              className="bg-white text-gray-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Map
            </button>          </div>
        </motion.div>
      </div>

      {/* QR Code Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <QrCode className="size-16 text-crimson-600 dark:text-crimson-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Scan QR Code for Instant Access
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Look for QR codes around campus to instantly access this guide in your language.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>About</span>
              <span>•</span>
              <span>Moderation</span>
              <span>•</span>
              <span>Privacy</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ 
  question, 
  answers, 
  onUpvote,
  onAnswer
}: { 
  question: Message; 
  answers: Message[];
  onUpvote: (id: string) => void;
  onAnswer: (question: Message) => void;
}) {
  const { t } = useTranslation();
  
  // Get translated text based on question ID
  const getTranslatedQuestion = (questionId: string) => {
    const questionMap: { [key: string]: string } = {
      "1": t('question1'),
      "2": t('question2'),
      "3": t('question3'),
      "4": t('question4')
    };
    return questionMap[questionId] || question.text;
  };
  
  // Get translated text based on answer ID
  const getTranslatedAnswer = (answerId: string, fallbackText: string) => {
    const answerMap: { [key: string]: string } = {
      "a1": t('answer1'),
      "a2": t('answer2'),
      "a3": t('answer3'),
      "a4": t('answer4'),
      "a5": t('answer5')
    };
    return answerMap[answerId] || fallbackText;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border bg-white dark:bg-gray-900 p-4 shadow-sm border-gray-200 dark:border-gray-700 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {getTranslatedQuestion(question.id)}
          </div>
          {question.category && (
            <div className="mt-2 flex gap-2 flex-wrap">
              <Pill>{question.category}</Pill>
            </div>
          )}
          <div className="mt-3 space-y-2">
            {answers.map((answer) => (
              <div key={answer.id} className="rounded-xl border bg-gray-50 dark:bg-gray-800 p-3 border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-800 dark:text-gray-200 mb-2">
                  {getTranslatedAnswer(answer.id, answer.text)}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Quote className="size-3" />
                    {answer.author}
                  </span>
                  <span>• {answer.timestamp}</span>
                  <button
                    onClick={() => onUpvote(answer.id)}
                    className="inline-flex items-center gap-1 hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors"
                  >
                    <ThumbsUp className="size-3" />
                    {answer.upvotes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => onAnswer(question)}
          >
            <Send className="size-4" />
            {t('reply')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ChatInterface({ 
  selectedLang, 
  onLangChange, 
  onBackToLanding,
  onViewMap,
  onToggleDarkMode,
  isDarkMode
}: { 
  selectedLang: string; 
  onLangChange: (lang: string) => void;
  onBackToLanding: () => void;
  onViewMap: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Message[]>(mockQuestions);
  const [answers, setAnswers] = useState<Message[]>(mockAnswers);
  const [newQuestion, setNewQuestion] = useState('');
  const [answeringTo, setAnsweringTo] = useState<Message | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const handleUpvote = (id: string) => {
    setAnswers(prev => 
      prev.map(answer => 
        answer.id === id 
          ? { ...answer, upvotes: answer.upvotes + 1 }
          : answer
      )
    );
  };
  
  const handleAnswer = (question: Message) => {
    setAnsweringTo(question);
  };
  
  const handleSubmitAnswer = () => {
    if (!newAnswer.trim() || !answeringTo) return;
    
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const newAnswerMsg: Message = {
      id: Date.now().toString(),
      text: newAnswer,
      author: `You (${randomUser.country})`,
      timestamp: 'just now',
      language: selectedLang,
      upvotes: 0,
      avatar: randomUser.avatar,
      parentId: answeringTo.id,
      isVerified: randomUser.isVerified
    };
    
    setAnswers(prev => [...prev, newAnswerMsg]);
    setNewAnswer('');
    setAnsweringTo(null);
  };
  
  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const newQuestionMsg: Message = {
      id: Date.now().toString(),
      text: newQuestion,
      author: `You (${randomUser.country})`,
      timestamp: 'just now',
      language: selectedLang,
      upvotes: 0,
      avatar: randomUser.avatar,
      category: 'general',
      isVerified: randomUser.isVerified
    };
    
    setQuestions(prev => [newQuestionMsg, ...prev]);
    setNewQuestion('');
  };
  
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchQuery === '' || question.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || question.language.toLowerCase() === filterLanguage.toLowerCase();
    return matchesSearch && matchesLanguage;
  });
  
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'mostPopular':
        return b.upvotes - a.upvotes;
      case 'mostHelpful':
        return b.upvotes - a.upvotes;
      default:
        return 0;
    }
  });
  
  const getAnswersForQuestion = (questionId: string) => {
    return answers.filter(answer => answer.parentId === questionId);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        selectedLang={selectedLang} 
        onLangChange={onLangChange}
        onBackToLanding={onBackToLanding}
        onViewMap={onViewMap}
        onToggleDarkMode={onToggleDarkMode}
        isDarkMode={isDarkMode}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-crimson-50 to-transparent dark:from-gray-800 dark:to-transparent border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-4">
              <MessagesSquare className="size-6 text-crimson-600 dark:text-crimson-400" />
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {t('welcome')}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Pill><MapPin className="inline size-3 mr-1"/>Widener Steps</Pill>
              <Pill><Camera className="inline size-3 mr-1"/>Best Photo Spots</Pill>
              <Pill>Accessibility</Pill>
              <Pill>Food</Pill>
            </div>
          </div>
        </div>
        
        {/* QR Banner */}
        <div className="my-6 rounded-2xl border bg-gray-50 dark:bg-gray-800 p-4 flex flex-col md:flex-row items-center gap-3 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
            <ScanLine className="size-5 text-crimson-600 dark:text-crimson-400"/>
            {t('tryOnCampus')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('qrDescription')}
          </div>
          <div className="md:ml-auto flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Share2 className="size-4"/> Share: <span className="font-mono">{t('shareUrl')}</span>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{t('allLanguages')}</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="chinese">Chinese</option>
                <option value="thai">Thai</option>
                <option value="ukrainian">Ukrainian</option>
                <option value="hindi">Hindi</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">{t('newest')}</option>
                <option value="mostPopular">{t('mostPopular')}</option>
                <option value="mostHelpful">{t('mostHelpful')}</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Questions Feed */}
        <div className="space-y-4 mb-6">
          <AnimatePresence>
            {sortedQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                answers={getAnswersForQuestion(question.id)}
                onUpvote={handleUpvote}
                onAnswer={handleAnswer}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Answer Modal */}
        {answeringTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border bg-white dark:bg-gray-900 p-4 shadow-xl border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Answering</div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">{answeringTo.text}</div>
                </div>
                <button 
                  onClick={() => setAnsweringTo(null)} 
                  className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="size-5"/>
                </button>
              </div>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Share your tip (e.g., best time for photos, secret angles, accessibility notes)"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-crimson-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">Auto-translated to everyone's language.</div>
                <button
                  onClick={handleSubmitAnswer}
                  className="inline-flex items-center gap-2 rounded-xl bg-crimson-600 text-white px-3 py-2 text-sm hover:bg-crimson-700"
                >
                  <Send className="size-4"/> Post answer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* New Question Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question or share a tip..."
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-crimson-500 dark:bg-gray-700 dark:text-white"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitQuestion();
                  }
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmitQuestion}
              disabled={!newQuestion.trim()}
              className="bg-crimson-600 text-white p-3 rounded-xl hover:bg-crimson-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="size-5" />
            </motion.button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
        
        {/* Community Stats */}
        <div className="my-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('communityAnswers', { count: answers.length })}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<'landing' | 'chat' | 'map'>('landing');
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Sync selectedLang with i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setSelectedLang(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  const handleJoinChat = () => {
    setCurrentView('chat');
  };
  
  const handleBackToLanding = () => {
    setCurrentView('landing');
  };
  
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage 
              onJoinChat={handleJoinChat}
              onViewMap={() => setCurrentView('map')}
              selectedLang={selectedLang}
              onLangChange={handleLangChange}
              onToggleDarkMode={handleToggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        ) : currentView === 'chat' ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface 
              selectedLang={selectedLang}
              onLangChange={handleLangChange}
              onBackToLanding={handleBackToLanding}
              onViewMap={() => setCurrentView('map')}
              onToggleDarkMode={handleToggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveMap 
              selectedLang={selectedLang}
              onLangChange={handleLangChange}
              onBackToLanding={handleBackToLanding}
              onViewForum={() => setCurrentView('chat')}
              onToggleDarkMode={handleToggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;