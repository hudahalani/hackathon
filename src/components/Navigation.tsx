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
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'diagnostics' as const, label: 'Diagnostics', icon: Camera },
    { id: 'ar-guidance' as const, label: 'AR Guide', icon: Smartphone },
    { id: 'chatbot' as const, label: 'Assistant', icon: MessageCircle },
    { id: 'speech' as const, label: 'Voice', icon: Mic },
    { id: 'emergency' as const, label: 'Emergency', icon: AlertTriangle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HMT</span>
            </div>
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
                      : 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

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
        </div>
      </div>
    </nav>
  );
};