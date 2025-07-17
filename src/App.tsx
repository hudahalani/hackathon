import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ImageDiagnostics } from './components/ImageDiagnostics';
import { ARGuidance } from './components/ARGuidance';
import { MedicalChatbot } from './components/MedicalChatbot';
import { SpeechInterface } from './components/SpeechInterface';
import { EmergencyProtocols } from './components/EmergencyProtocols';

type ActiveModule = 'dashboard' | 'diagnostics' | 'ar-guidance' | 'chatbot' | 'speech' | 'emergency';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
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
  );
}

export default App;