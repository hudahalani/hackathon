import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ImageDiagnostics } from './components/ImageDiagnostics';
import { ARGuidance } from './components/ARGuidance';
import { MedicalChatbot } from './components/MedicalChatbot';
import { SpeechInterface } from './components/SpeechInterface';
import { EmergencyProtocols } from './components/EmergencyProtocols';
import { useTranslation } from 'react-i18next';

type ActiveModule = 'dashboard' | 'diagnostics' | 'ar-guidance' | 'chatbot' | 'speech' | 'emergency';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { i18n, t } = useTranslation();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onModuleSelect={setActiveModule} />;
      case 'diagnostics':
        return <ImageDiagnostics />;
      case 'ar-guidance':
        return <ARGuidance />;
      case 'chatbot':
        return <MedicalChatbot />;
      case 'speech':
        return <SpeechInterface />;
      case 'emergency':
        return <EmergencyProtocols />;
      default:
        return <Dashboard onModuleSelect={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="pt-12">
        <Navigation 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          isOfflineMode={isOfflineMode}
          onOfflineModeToggle={() => setIsOfflineMode(!isOfflineMode)}
        />
        <main className="pt-16">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;