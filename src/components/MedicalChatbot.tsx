import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, User, Bot, AlertCircle, CheckCircle } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'info' | 'warning' | 'success';
}

export const MedicalChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your medical assistant. I can help you with clinical protocols, drug interactions, emergency procedures, and humanitarian guidelines. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const medicalResponses: { [key: string]: { response: string; type?: 'info' | 'warning' | 'success' } } = {
    'chest pain': {
      response: "For chest pain assessment:\n\n1. **Immediate actions:**\n   - Check vital signs\n   - Obtain 12-lead ECG within 10 minutes\n   - Administer oxygen if SpO2 <90%\n   - Establish IV access\n\n2. **History questions:**\n   - PQRST assessment\n   - Associated symptoms (nausea, sweating, dyspnea)\n   - Previous cardiac history\n\n3. **Red flags requiring immediate intervention:**\n   - ST elevation on ECG\n   - Hemodynamic instability\n   - Severe, crushing chest pain\n\n**Emergency protocol:** If STEMI suspected, activate cardiac catheterization team immediately.",
      type: 'warning'
    },
    'wound care': {
      response: "Wound care protocol:\n\n1. **Assessment:**\n   - Size, depth, location\n   - Signs of infection (redness, warmth, pus)\n   - Tetanus status\n\n2. **Cleaning:**\n   - Irrigate with normal saline\n   - Remove debris gently\n   - Don't use hydrogen peroxide on wounds\n\n3. **Dressing selection:**\n   - Dry wounds: Hydrocolloid or hydrogel\n   - Infected wounds: Antimicrobial dressing\n   - Deep wounds: Alginate or foam\n\n4. **Follow-up:**\n   - Monitor for signs of infection\n   - Change dressing per protocol\n   - Document wound progress",
      type: 'success'
    },
    'drug interaction': {
      response: "Common critical drug interactions to monitor:\n\n**Warfarin interactions:**\n- Antibiotics (increase INR)\n- NSAIDs (bleeding risk)\n- Aspirin (bleeding risk)\n\n**Digoxin interactions:**\n- Amiodarone (increases digoxin levels)\n- Loop diuretics (hypokalemia increases toxicity)\n\n**Always check:**\n- Patient's complete medication list\n- Renal and hepatic function\n- Use interaction checker tools\n- Monitor for adverse effects\n\n**Emergency contacts:** Pharmacist consultation available 24/7 for complex interactions.",
      type: 'warning'
    },
    'emergency protocol': {
      response: "**Emergency Response Protocol:**\n\n**Code Blue (Cardiac Arrest):**\n1. Call for help immediately\n2. Start CPR (30:2 ratio)\n3. Attach defibrillator\n4. Follow ACLS algorithm\n\n**Code Red (Fire):**\n1. Rescue patients in immediate danger\n2. Activate alarm\n3. Contain fire if safe\n4. Evacuate if necessary\n\n**Mass Casualty:**\n1. Activate incident command\n2. Triage patients (START method)\n3. Establish treatment areas\n4. Coordinate with emergency services\n\n**Communication:** Use designated emergency frequencies and report to incident commander.",
      type: 'warning'
    },
    'humanitarian guidelines': {
      response: "**Humanitarian Medical Guidelines:**\n\n**Core Principles:**\n- Humanity: Alleviate suffering\n- Neutrality: No sides in conflicts\n- Impartiality: Based on need alone\n- Independence: Autonomous action\n\n**Medical Priorities:**\n1. Life-threatening conditions\n2. Preventable diseases\n3. Communicable disease control\n4. Reproductive health\n5. Mental health support\n\n**Resource Management:**\n- Prioritize essential medicines\n- Maintain cold chain for vaccines\n- Ensure safe water and sanitation\n- Document all activities\n\n**Security Protocols:**\n- Daily security briefings\n- Evacuation procedures\n- Communication schedules\n- Personal protective measures",
      type: 'info'
    }
  };

  const quickActions = [
    { label: 'Emergency Protocols', query: 'emergency protocol' },
    { label: 'Drug Interactions', query: 'drug interaction' },
    { label: 'Wound Care', query: 'wound care' },
    { label: 'Chest Pain', query: 'chest pain' },
    { label: 'Humanitarian Guidelines', query: 'humanitarian guidelines' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (input: string): { response: string; type?: 'info' | 'warning' | 'success' } => {
    const lowerInput = input.toLowerCase();
    
    // Check for exact matches first
    for (const [key, value] of Object.entries(medicalResponses)) {
      if (lowerInput.includes(key)) {
        return value;
      }
    }

    // Check for related terms
    if (lowerInput.includes('pain') || lowerInput.includes('hurt')) {
      return {
        response: "For pain assessment, use the PQRST method:\n\n**P** - Provocation/Palliation\n**Q** - Quality\n**R** - Region/Radiation\n**S** - Severity (1-10 scale)\n**T** - Timing\n\nConsider underlying causes and appropriate pain management protocols. Document thoroughly for continuity of care.",
        type: 'info'
      };
    }

    if (lowerInput.includes('medication') || lowerInput.includes('dosage')) {
      return {
        response: "For medication administration:\n\n1. **Five Rights:**\n   - Right patient\n   - Right drug\n   - Right dose\n   - Right route\n   - Right time\n\n2. **Documentation:**\n   - Record all medications given\n   - Note patient response\n   - Report adverse reactions\n\n3. **Special considerations:**\n   - Pediatric dosing calculations\n   - Renal/hepatic adjustments\n   - Allergies and contraindications\n\n**Always verify with pharmacist if unsure.**",
        type: 'warning'
      };
    }

    if (lowerInput.includes('infection') || lowerInput.includes('sepsis')) {
      return {
        response: "**Infection Control & Sepsis Protocol:**\n\n**Early Recognition:**\n- Fever, chills, altered mental status\n- Increased heart rate, respiratory rate\n- Decreased blood pressure\n\n**Sepsis Bundle (1-hour):**\n1. Measure lactate\n2. Obtain blood cultures\n3. Administer broad-spectrum antibiotics\n4. Begin fluid resuscitation\n\n**Infection Prevention:**\n- Hand hygiene\n- Personal protective equipment\n- Isolation procedures\n- Environmental cleaning\n\n**Escalation:** Contact infectious disease specialist for severe cases.",
        type: 'warning'
      };
    }

    // Default response
    return {
      response: "I can help with:\n\n• Clinical protocols and procedures\n• Drug interactions and dosing\n• Emergency response guidelines\n• Humanitarian medical standards\n• Infection control measures\n• Patient assessment techniques\n\nCould you be more specific about what you need help with?",
      type: 'info'
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const { response, type } = generateResponse(inputText);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        type
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    setInputText(query);
    handleSendMessage();
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // In a real implementation, you would use Web Speech API here
      setTimeout(() => {
        setIsListening(false);
        setInputText("Tell me about chest pain assessment");
      }, 2000);
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="text-orange-500" size={16} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'info':
      default:
        return <Bot className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Medical Assistant</h2>
        <p className="text-gray-600">Get instant answers to medical questions and protocol guidance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-100' 
                      : message.type === 'warning' 
                      ? 'bg-orange-100' 
                      : message.type === 'success'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="text-blue-600" size={16} />
                    ) : (
                      getMessageIcon(message.type)
                    )}
                  </div>
                  <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'warning'
                        ? 'bg-orange-50 text-orange-900 border border-orange-200'
                        : message.type === 'success'
                        ? 'bg-green-50 text-green-900 border border-green-200'
                        : 'bg-gray-50 text-gray-900 border border-gray-200'
                    }`}>
                      <pre className="whitespace-pre-wrap text-sm font-sans">{message.text}</pre>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="text-blue-500" size={16} />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about medical protocols, procedures, or guidelines..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.query)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Available Topics</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Clinical protocols</div>
              <div>• Drug interactions</div>
              <div>• Emergency procedures</div>
              <div>• Wound care</div>
              <div>• Infection control</div>
              <div>• Pain management</div>
              <div>• Humanitarian guidelines</div>
              <div>• Medical documentation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};