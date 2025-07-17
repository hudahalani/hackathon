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

type ActiveModule = 'dashboard' | 'diagnostics' | 'ar-guidance' | 'chatbot' | 'speech' | 'emergency';

interface DashboardProps {
  onModuleSelect: (module: ActiveModule) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onModuleSelect }) => {
  const modules = [
    {
      id: 'diagnostics' as const,
      title: 'AI Diagnostics',
      description: 'Upload medical images for AI-assisted preliminary diagnosis',
      icon: Camera,
      color: 'bg-blue-600',
      stats: '95% accuracy',
      urgent: false
    },
    {
      id: 'ar-guidance' as const,
      title: 'AR Procedures',
      description: 'Step-by-step AR guidance for medical procedures',
      icon: Smartphone,
      color: 'bg-teal-600',
      stats: '50+ procedures',
      urgent: false
    },
    {
      id: 'chatbot' as const,
      title: 'Medical Assistant',
      description: 'Ask questions about protocols and guidelines',
      icon: MessageCircle,
      color: 'bg-indigo-600',
      stats: '24/7 support',
      urgent: false
    },
    {
      id: 'speech' as const,
      title: 'Voice Commands',
      description: 'Hands-free medical guidance and documentation',
      icon: Mic,
      color: 'bg-purple-600',
      stats: 'Multi-language',
      urgent: false
    },
    {
      id: 'emergency' as const,
      title: 'Emergency Protocols',
      description: 'Rapid response guides for critical situations',
      icon: AlertTriangle,
      color: 'bg-red-600',
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Medical Training Platform</h2>
        <p className="text-gray-600">Comprehensive AI-powered training for humanitarian medical staff</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Procedures Learned</p>
              <p className="text-2xl font-bold text-gray-900">1,432</p>
            </div>
            <BookOpen className="text-teal-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Diagnoses Made</p>
              <p className="text-2xl font-bold text-gray-900">856</p>
            </div>
            <Activity className="text-indigo-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">3.2s</p>
            </div>
            <Clock className="text-purple-600" size={24} />
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
              <span className="text-sm font-medium text-blue-600">Launch →</span>
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
                  activity.type === 'emergency' ? 'bg-red-500' :
                  activity.type === 'diagnostic' ? 'bg-blue-500' :
                  activity.type === 'procedure' ? 'bg-teal-500' : 'bg-purple-500'
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