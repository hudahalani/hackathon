import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Heart, 
  Thermometer, 
  Droplet, 
  Zap, 
  Clock,
  Phone,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface EmergencyProtocol {
  id: string;
  title: string;
  severity: 'critical' | 'urgent' | 'semi-urgent';
  category: string;
  timeframe: string;
  steps: {
    id: number;
    action: string;
    timeframe?: string;
    critical?: boolean;
    details?: string;
  }[];
  supplies?: string[];
  considerations?: string[];
}

export const EmergencyProtocols: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<EmergencyProtocol | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const protocols: EmergencyProtocol[] = [
    {
      id: 'cardiac-arrest',
      title: 'Cardiac Arrest (Adult)',
      severity: 'critical',
      category: 'Cardiac',
      timeframe: 'Immediate',
      steps: [
        {
          id: 1,
          action: 'Check responsiveness and breathing',
          timeframe: '10 seconds',
          critical: true,
          details: 'Tap shoulders, shout "Are you okay?", check for normal breathing'
        },
        {
          id: 2,
          action: 'Activate emergency response',
          timeframe: 'Immediate',
          critical: true,
          details: 'Call code blue, request defibrillator and resuscitation team'
        },
        {
          id: 3,
          action: 'Begin chest compressions',
          timeframe: 'Within 1 minute',
          critical: true,
          details: 'Center of chest, 100-120/min, compress 2+ inches deep'
        },
        {
          id: 4,
          action: 'Attach defibrillator',
          timeframe: 'Within 3 minutes',
          critical: true,
          details: 'Apply pads, analyze rhythm, charge if shockable'
        },
        {
          id: 5,
          action: 'Establish airway',
          timeframe: 'Within 5 minutes',
          critical: false,
          details: 'Bag-mask ventilation, consider advanced airway'
        },
        {
          id: 6,
          action: 'IV access and medications',
          timeframe: 'Within 10 minutes',
          critical: false,
          details: 'Epinephrine 1mg IV every 3-5 minutes'
        }
      ],
      supplies: ['Defibrillator', 'Bag-mask', 'IV supplies', 'Epinephrine', 'Amiodarone'],
      considerations: ['Continue CPR until ROSC or 20+ minutes', 'Consider reversible causes (4 H\'s and 4 T\'s)', 'Family notification and support']
    },
    {
      id: 'severe-bleeding',
      title: 'Severe Hemorrhage Control',
      severity: 'critical',
      category: 'Trauma',
      timeframe: 'Immediate',
      steps: [
        {
          id: 1,
          action: 'Ensure scene safety',
          timeframe: 'Immediate',
          critical: true,
          details: 'Use universal precautions, assess for ongoing danger'
        },
        {
          id: 2,
          action: 'Apply direct pressure',
          timeframe: 'Immediate',
          critical: true,
          details: 'Firm, continuous pressure with gauze or cloth'
        },
        {
          id: 3,
          action: 'Elevate injured area',
          timeframe: 'Immediate',
          critical: false,
          details: 'Raise above heart level if possible, maintain pressure'
        },
        {
          id: 4,
          action: 'Apply tourniquet if needed',
          timeframe: 'Within 2 minutes',
          critical: true,
          details: 'For extremity bleeding uncontrolled by pressure'
        },
        {
          id: 5,
          action: 'Establish IV access',
          timeframe: 'Within 5 minutes',
          critical: false,
          details: 'Large bore IV, blood type and crossmatch'
        },
        {
          id: 6,
          action: 'Monitor vital signs',
          timeframe: 'Every 5 minutes',
          critical: false,
          details: 'Watch for signs of shock, prepare for transfusion'
        }
      ],
      supplies: ['Gauze', 'Pressure dressing', 'Tourniquet', 'IV supplies', 'Blood products'],
      considerations: ['Note tourniquet time', 'Prepare for surgical intervention', 'Monitor for shock']
    },
    {
      id: 'anaphylaxis',
      title: 'Anaphylaxis',
      severity: 'critical',
      category: 'Allergy',
      timeframe: 'Immediate',
      steps: [
        {
          id: 1,
          action: 'Remove/avoid trigger',
          timeframe: 'Immediate',
          critical: true,
          details: 'Stop suspected allergen, discontinue medications'
        },
        {
          id: 2,
          action: 'Administer epinephrine',
          timeframe: 'Immediate',
          critical: true,
          details: 'EpiPen or 0.3-0.5mg IM in anterolateral thigh'
        },
        {
          id: 3,
          action: 'Call for help',
          timeframe: 'Immediate',
          critical: true,
          details: 'Activate emergency response, prepare for resuscitation'
        },
        {
          id: 4,
          action: 'Monitor airway',
          timeframe: 'Continuous',
          critical: true,
          details: 'Prepare for intubation if stridor or swelling'
        },
        {
          id: 5,
          action: 'IV access and fluids',
          timeframe: 'Within 5 minutes',
          critical: false,
          details: 'Large bore IV, normal saline bolus'
        },
        {
          id: 6,
          action: 'Secondary medications',
          timeframe: 'Within 10 minutes',
          critical: false,
          details: 'H1/H2 antihistamines, corticosteroids'
        }
      ],
      supplies: ['Epinephrine', 'Antihistamines', 'Corticosteroids', 'IV supplies', 'Airway equipment'],
      considerations: ['May need repeat epinephrine', 'Observe for biphasic reaction', 'Patient education on avoidance']
    },
    {
      id: 'stroke',
      title: 'Acute Stroke',
      severity: 'urgent',
      category: 'Neurological',
      timeframe: '4.5 hours',
      steps: [
        {
          id: 1,
          action: 'FAST assessment',
          timeframe: '5 minutes',
          critical: true,
          details: 'Face drooping, Arm weakness, Speech difficulty, Time to call'
        },
        {
          id: 2,
          action: 'Check blood glucose',
          timeframe: 'Immediate',
          critical: true,
          details: 'Rule out hypoglycemia as cause of symptoms'
        },
        {
          id: 3,
          action: 'Obtain CT scan',
          timeframe: 'Within 25 minutes',
          critical: true,
          details: 'Rule out hemorrhage before thrombolytic therapy'
        },
        {
          id: 4,
          action: 'IV access',
          timeframe: 'Within 10 minutes',
          critical: false,
          details: 'Normal saline, avoid dextrose solutions'
        },
        {
          id: 5,
          action: 'Assess for thrombolytics',
          timeframe: 'Within 60 minutes',
          critical: false,
          details: 'Time of onset, contraindications, NIHSS score'
        },
        {
          id: 6,
          action: 'Continuous monitoring',
          timeframe: 'Ongoing',
          critical: false,
          details: 'Neurological checks, blood pressure, oxygen'
        }
      ],
      supplies: ['Blood glucose meter', 'IV supplies', 'Oxygen', 'Thrombolytics', 'Monitoring equipment'],
      considerations: ['Time is brain', 'Blood pressure management', 'Avoid oral intake']
    },
    {
      id: 'seizure',
      title: 'Status Epilepticus',
      severity: 'urgent',
      category: 'Neurological',
      timeframe: '30 minutes',
      steps: [
        {
          id: 1,
          action: 'Protect airway',
          timeframe: 'Immediate',
          critical: true,
          details: 'Position on side, suction if needed, do not restrain'
        },
        {
          id: 2,
          action: 'Monitor vital signs',
          timeframe: 'Continuous',
          critical: true,
          details: 'Oxygen saturation, blood pressure, temperature'
        },
        {
          id: 3,
          action: 'IV access',
          timeframe: 'Within 5 minutes',
          critical: true,
          details: 'Large bore IV, blood glucose, electrolytes'
        },
        {
          id: 4,
          action: 'Administer benzos',
          timeframe: 'Within 10 minutes',
          critical: true,
          details: 'Lorazepam 2-4mg IV or diazepam 5-10mg IV'
        },
        {
          id: 5,
          action: 'Second line agents',
          timeframe: 'Within 20 minutes',
          critical: false,
          details: 'Phenytoin or fosphenytoin if seizure continues'
        },
        {
          id: 6,
          action: 'Third line therapy',
          timeframe: 'Within 30 minutes',
          critical: false,
          details: 'Anesthetics, intubation, ICU management'
        }
      ],
      supplies: ['Benzodiazepines', 'Phenytoin', 'Airway equipment', 'IV supplies', 'Monitoring equipment'],
      considerations: ['Identify underlying cause', 'Prevent injury', 'Continuous EEG monitoring']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Protocols' },
    { id: 'Cardiac', name: 'Cardiac' },
    { id: 'Trauma', name: 'Trauma' },
    { id: 'Allergy', name: 'Allergy' },
    { id: 'Neurological', name: 'Neurological' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'semi-urgent': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="text-red-500" size={20} />;
      case 'urgent': return <Clock className="text-orange-500" size={20} />;
      case 'semi-urgent': return <Thermometer className="text-yellow-500" size={20} />;
      default: return <AlertTriangle className="text-gray-500" size={20} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cardiac': return <Heart className="text-red-500" size={20} />;
      case 'Trauma': return <Droplet className="text-red-500" size={20} />;
      case 'Allergy': return <Zap className="text-orange-500" size={20} />;
      case 'Neurological': return <Thermometer className="text-blue-500" size={20} />;
      default: return <AlertTriangle className="text-gray-500" size={20} />;
    }
  };

  const toggleStepCompletion = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const filteredProtocols = activeCategory === 'all' 
    ? protocols 
    : protocols.filter(p => p.category === activeCategory);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency Protocols</h2>
        <p className="text-gray-600">Critical response procedures for life-threatening situations</p>
      </div>

      {!selectedProtocol ? (
        <>
          {/* Categories */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Protocol Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProtocols.map((protocol) => (
              <div
                key={protocol.id}
                onClick={() => setSelectedProtocol(protocol)}
                className={`bg-white p-6 rounded-xl shadow-sm border-2 cursor-pointer hover:shadow-md transition-all ${
                  protocol.severity === 'critical' ? 'border-red-200 hover:border-red-300' :
                  protocol.severity === 'urgent' ? 'border-orange-200 hover:border-orange-300' :
                  'border-yellow-200 hover:border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(protocol.category)}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{protocol.title}</h3>
                      <p className="text-sm text-gray-600">{protocol.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(protocol.severity)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(protocol.severity)}`}>
                      {protocol.severity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{protocol.timeframe}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{protocol.steps.length} steps</span>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Protocol Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProtocol.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedProtocol.severity)}`}>
                      {selectedProtocol.severity}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedProtocol.timeframe}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProtocol(null);
                    setCompletedSteps([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to Protocols
                </button>
              </div>

              <div className="space-y-4">
                {selectedProtocol.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      completedSteps.includes(step.id)
                        ? 'border-green-300 bg-green-50'
                        : step.critical
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className={`mt-1 p-1 rounded-full ${
                          completedSteps.includes(step.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                      >
                        <CheckCircle size={16} />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            Step {index + 1}: {step.action}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {step.critical && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                Critical
                              </span>
                            )}
                            {step.timeframe && (
                              <span className="text-sm text-gray-600">{step.timeframe}</span>
                            )}
                          </div>
                        </div>
                        {step.details && (
                          <p className="text-sm text-gray-600">{step.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protocol Details */}
          <div className="space-y-6">
            {selectedProtocol.supplies && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Required Supplies</h3>
                <ul className="space-y-2">
                  {selectedProtocol.supplies.map((supply, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{supply}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedProtocol.considerations && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Important Considerations</h3>
                <ul className="space-y-2">
                  {selectedProtocol.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="text-yellow-500 mt-1" size={16} />
                      <span className="text-gray-700 text-sm">{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <Phone className="text-red-500" size={20} />
                  <div>
                    <p className="font-medium text-red-900">Emergency Services</p>
                    <p className="text-sm text-red-700">911</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Phone className="text-blue-500" size={20} />
                  <div>
                    <p className="font-medium text-blue-900">Medical Control</p>
                    <p className="text-sm text-blue-700">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <MapPin className="text-green-500" size={20} />
                  <div>
                    <p className="font-medium text-green-900">Nearest Hospital</p>
                    <p className="text-sm text-green-700">Regional Medical Center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};