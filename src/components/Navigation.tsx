import React from 'react';
import { 
  Home, 
  Camera, 
  Smartphone, 
  MessageCircle, 
  Mic, 
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ActiveModule = 'dashboard' | 'diagnostics' | 'ar-guidance' | 'chatbot' | 'speech' | 'emergency';

interface NavigationProps {
  activeModule: ActiveModule;
  onModuleChange: (module: ActiveModule) => void;
  isOfflineMode: boolean;
  onOfflineModeToggle: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onModuleChange,
  isOfflineMode,
  onOfflineModeToggle
}) => {
  const { t, i18n } = useTranslation();
  const navItems = [
    { id: 'dashboard' as const, label: t('dashboard'), icon: Home },
    { id: 'diagnostics' as const, label: t('diagnostics'), icon: Camera },
    { id: 'ar-guidance' as const, label: t('ar_guide'), icon: Smartphone },
    { id: 'chatbot' as const, label: t('chatbot'), icon: MessageCircle },
    { id: 'speech' as const, label: t('speech'), icon: Mic },
    { id: 'emergency' as const, label: t('emergency'), icon: AlertTriangle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Train to Heal Logo" className="w-12 h-12 object-contain" />
            <h1 className="text-xl font-bold text-gray-900">Medical Training</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onModuleChange(id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeModule === id
                    ? id === 'emergency' 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOfflineModeToggle}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isOfflineMode 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isOfflineMode ? <WifiOff size={16} /> : <Wifi size={16} />}
              <span className="hidden sm:inline">
                {isOfflineMode ? 'Offline' : 'Online'}
              </span>
            </button>
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
            >
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};