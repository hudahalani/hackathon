import React from 'react';
import { 
  Camera, 
  Smartphone, 
  MessageCircle, 
  Mic, 
  AlertTriangle,
  Users,
  BookOpen,
  Activity,
  Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ActiveModule = 'dashboard' | 'diagnostics' | 'ar-guidance' | 'chatbot' | 'speech' | 'emergency';

interface DashboardProps {
  onModuleSelect: (module: ActiveModule) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onModuleSelect }) => {
  const { t } = useTranslation();
  const modules = [
    {
      id: 'diagnostics' as const,
      title: 'AI Diagnostics',
      description: 'Upload medical images for AI-assisted preliminary diagnosis',
      icon: Camera,
      color: 'bg-black', // Black for diagnostics
      stats: '95% accuracy',
      urgent: false
    },
    {
      id: 'ar-guidance' as const,
      title: 'AR Procedures',
      description: 'Step-by-step AR guidance for medical procedures',
      icon: Smartphone,
      color: 'bg-green-700', // Green for AR
      stats: '50+ procedures',
      urgent: false
    },
    {
      id: 'chatbot' as const,
      title: 'Medical Assistant',
      description: 'Ask questions about protocols and guidelines',
      icon: MessageCircle,
      color: 'bg-black', // Black for chatbot
      stats: '24/7 support',
      urgent: false
    },
    {
      id: 'speech' as const,
      title: 'Voice Commands',
      description: 'Hands-free medical guidance and documentation',
      icon: Mic,
      color: 'bg-green-700', // Green for speech
      stats: 'Multi-language',
      urgent: false
    },
    {
      id: 'emergency' as const,
      title: 'Emergency Protocols',
      description: 'Rapid response guides for critical situations',
      icon: AlertTriangle,
      color: 'bg-red-600', // Red for emergency
      stats: 'Life-saving',
      urgent: true
    }
  ];

  const recentActivity = [
    { action: 'Chest X-ray analyzed', time: '2 minutes ago', type: 'diagnostic' },
    { action: 'IV insertion completed', time: '15 minutes ago', type: 'procedure' },
    { action: 'Emergency protocol accessed', time: '1 hour ago', type: 'emergency' },
    { action: 'Wound care guidance', time: '2 hours ago', type: 'ar' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Landing Page Intro Section */}
      <section className="mb-10 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-md border border-green-100 p-8 flex flex-col md:flex-row items-center md:space-x-10">
        <div className="flex-shrink-0 mb-6 md:mb-0 flex flex-col items-center md:items-start">
          <img src="/logo.png" alt="Train2Heal Logo" className="w-28 h-28 object-contain mb-2" />
          <span className="text-lg font-bold text-green-700 tracking-wide">Train2Heal</span>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">🏥 Train2Heal</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-green-700 mb-4">A bilingual, AI-first mobile platform for emergency training and support, even with no internet.</h2>
          <div className="mb-4">
            <span className="font-bold text-red-600">🧨 The Problem</span>
            <p className="text-gray-700 mt-1 mb-2">In Gaza, ongoing conflict and staff turnover leave civilians without adequate emergency medical care. Traditional training is too slow and resource-heavy for field conditions. First aid and trauma response are often delayed or done incorrectly, costing lives.</p>
            <span className="font-bold text-green-700">💡 Our Solution</span>
            <div className="text-gray-700 mt-1 space-y-1">
              <p><span className="font-bold">Train2Heal</span> bridges the gap with fast, offline, and accessible clinical support:</p>
              <ul className="list-none pl-0 mt-2 space-y-1">
                <li>🧠 <span className="font-semibold">AI-Assisted Diagnosis</span> – Upload an image for rapid wound assessment</li>
                <li>🧤 <span className="font-semibold">AR-Guided Procedures</span> – Step-by-step visual aid for critical tasks</li>
                <li>🗣️ <span className="font-semibold">Voice Commands</span> – Hands-free for chaotic environments</li>
                <li>🤖 <span className="font-semibold">Offline Chatbot</span> – Access medical info and training without Wi-Fi</li>
                <li>📲 <span className="font-semibold">Built for Android</span> – Lightweight, fast, and field-ready</li>
                <li>🚀 <span className="font-semibold">Proven to reduce training time by 70% and cut costs by 90%</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <a href="https://drive.google.com/file/d/1QiD0_Z8YNmtLQpQCic9O0j8XVX0Bdme1/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg shadow hover:bg-red-200 transition">🎥 Demo Video</a>
            <a href="https://gamma.app/docs/HACKS-FOR-GAZA-3mkomug9fh6sv7k" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg shadow hover:bg-green-200 transition">🧾 Project Slides</a>
            <a href="https://github.com/hudahalani/hackathon" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-200 transition">🔗 GitHub Repo</a>
          </div>
          <div className="text-gray-600 mt-2">
            <span className="font-bold text-black text-lg">👩‍💻 Team</span> <br/>
            Built by <span className="font-bold">Tala Abdelmaguid and Huda Halani</span> using Codewords + React Native
            <div className="mt-1 flex flex-col sm:flex-row sm:space-x-4 text-sm">
              <a href="https://www.linkedin.com/in/tala-abdelmaguid-1250ba204/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Tala Abdelmaguid (LinkedIn)</a>
              <a href="https://www.linkedin.com/in/hudahalani/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Huda Halani (LinkedIn)</a>
            </div>
          </div>
        </div>
      </section>
      {/* End Landing Page Intro Section */}

      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <img src="/logo.png" alt="Train2Heal Logo" className="w-24 h-24 object-contain" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('welcome')}</h2>
            <p className="text-gray-600">{t('dashboard_desc')}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
            <Users className="text-green-700" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Procedures Learned</p>
              <p className="text-2xl font-bold text-gray-900">1,432</p>
            </div>
            <BookOpen className="text-black" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Diagnoses Made</p>
              <p className="text-2xl font-bold text-gray-900">856</p>
            </div>
            <Activity className="text-green-700" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">3.2s</p>
            </div>
            <Clock className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => onModuleSelect(module.id)}
            className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
              module.urgent ? 'ring-2 ring-red-200' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${module.color}`}>
                <module.icon className="text-white" size={24} />
              </div>
              {module.urgent && (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                  Critical
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{module.stats}</span>
              <span className="text-sm font-medium text-green-600">Launch →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'emergency' ? 'bg-red-600' :
                  activity.type === 'diagnostic' ? 'bg-black' :
                  activity.type === 'procedure' ? 'bg-green-700' : 'bg-black'
                }`}></div>
                <span className="text-gray-900">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};