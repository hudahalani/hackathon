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
    },
    'diabetes': {
      response: "**Diabetes Management:**\n\n1. Monitor blood glucose regularly.\n2. Administer insulin or oral hypoglycemics as prescribed.\n3. Recognize hypoglycemia (shakiness, sweating, confusion) and treat with fast-acting carbs.\n4. Recognize hyperglycemia (thirst, frequent urination, fatigue) and adjust medication.\n5. Encourage healthy diet, exercise, and regular follow-up.",
      type: 'info'
    },
    'asthma': {
      response: "**Asthma Attack Protocol:**\n\n1. Assess severity (speech, wheeze, accessory muscle use).\n2. Administer short-acting beta-agonist (inhaler/nebulizer).\n3. Give oxygen if SpO2 <94%.\n4. Consider oral corticosteroids.\n5. Monitor response and repeat inhaler every 20 minutes as needed.\n6. Seek emergency care if no improvement.",
      type: 'warning'
    },
    'stroke': {
      response: "**Stroke Recognition (FAST):**\n\n- **F**ace: Drooping?\n- **A**rms: Weakness?\n- **S**peech: Slurred?\n- **T**ime: Act fast!\n\n1. Call emergency services immediately.\n2. Note time of symptom onset.\n3. Keep patient NPO (nothing by mouth).\n4. Monitor airway, breathing, circulation.\n5. Prepare for rapid transport to stroke center.",
      type: 'warning'
    },
    'burn': {
      response: "**Burn Treatment Protocol:**\n\n1. Remove source of burn.\n2. Cool area with running water for 20 minutes.\n3. Cover with clean, non-stick dressing.\n4. Do not apply creams or ice.\n5. Assess depth and size.\n6. Give pain relief.\n7. Refer to hospital if large, deep, or involving face/hands/genitals.",
      type: 'info'
    },
    'allergic reaction': {
      response: "**Allergic Reaction/Anaphylaxis:**\n\n1. Remove allergen if possible.\n2. Administer epinephrine IM immediately if anaphylaxis.\n3. Call emergency services.\n4. Give oxygen and IV fluids if available.\n5. Monitor airway and breathing.\n6. Give antihistamines and steroids as adjuncts.",
      type: 'warning'
    },
    'dehydration': {
      response: "**Dehydration Management:**\n\n1. Assess severity (skin turgor, mucous membranes, urine output).\n2. Give oral rehydration solution for mild/moderate cases.\n3. Use IV fluids for severe dehydration or if unable to tolerate oral.\n4. Monitor electrolytes and urine output.\n5. Treat underlying cause (vomiting, diarrhea, fever).",
      type: 'info'
    },
    'fracture': {
      response: "**Fracture/Splinting Protocol:**\n\n1. Immobilize the limb in the position found.\n2. Apply a splint and padding.\n3. Check circulation, sensation, movement before and after splinting.\n4. Elevate and apply ice.\n5. Refer for X-ray and orthopedic care.\n6. Do not attempt to realign open fractures.",
      type: 'info'
    },
    'pediatric fever': {
      response: "**Pediatric Fever Management:**\n\n1. Measure temperature accurately.\n2. Look for red flags: lethargy, poor feeding, rash, difficulty breathing.\n3. Give antipyretics (acetaminophen/ibuprofen) as needed.\n4. Encourage fluids.\n5. Seek medical attention if <3 months old or if red flags present.",
      type: 'info'
    },
    'snake bite': {
      response: "**Snake Bite First Aid:**\n\n1. Keep patient calm and still.\n2. Immobilize bitten limb at heart level.\n3. Remove tight clothing/jewelry.\n4. Do not suck or cut the wound.\n5. Transport to hospital immediately.\n6. Monitor for breathing difficulty and shock.",
      type: 'warning'
    },
    'mental health': {
      response: "**Mental Health Crisis:**\n\n1. Ensure safety of patient and others.\n2. Listen non-judgmentally.\n3. Do not leave patient alone if suicidal.\n4. Remove dangerous objects.\n5. Contact mental health professionals or emergency services.\n6. Offer support and reassurance.",
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

    // Check for specific medical terms and procedures
    if (lowerInput.includes('chest pain') || lowerInput.includes('heart attack') || lowerInput.includes('angina')) {
      return {
        response: "**Chest Pain Assessment Protocol:**\n\n**Immediate Actions:**\n1. Assess ABCs (Airway, Breathing, Circulation)\n2. Administer oxygen if needed\n3. Obtain 12-lead ECG within 10 minutes\n4. Establish IV access\n\n**Assessment (PQRST):**\n- **P**rovocation: What makes it worse/better?\n- **Q**uality: Crushing, pressure, sharp?\n- **R**adiation: To arm, jaw, back?\n- **S**everity: 1-10 scale\n- **T**iming: When did it start?\n\n**Red Flags:**\n- ST elevation on ECG\n- Hemodynamic instability\n- Severe, crushing pain\n\n**Treatment:**\n- Aspirin 325mg chewed\n- Nitroglycerin if prescribed\n- Morphine for severe pain\n- Activate cardiac catheterization team if STEMI",
        type: 'warning'
      };
    }

    if (lowerInput.includes('wound') || lowerInput.includes('cut') || lowerInput.includes('laceration')) {
      return {
        response: "**Wound Care Protocol:**\n\n**Assessment:**\n- Size, depth, location\n- Signs of infection (redness, warmth, pus)\n- Tetanus status\n- Neurovascular status\n\n**Cleaning:**\n- Irrigate with normal saline\n- Remove debris gently\n- Don't use hydrogen peroxide on wounds\n- Consider antiseptic for dirty wounds\n\n**Closure:**\n- Primary closure for clean wounds <6 hours\n- Delayed closure for dirty wounds\n- Consider antibiotics for high-risk wounds\n\n**Dressing:**\n- Keep clean and dry\n- Change as needed\n- Monitor for infection signs\n\n**Follow-up:**\n- Tetanus booster if needed\n- Return if signs of infection",
        type: 'info'
      };
    }

    if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
      return {
        response: "**Fever Management Protocol:**\n\n**Assessment:**\n- Temperature measurement method\n- Associated symptoms\n- Duration of fever\n- Recent travel/exposure\n\n**Temperature Ranges:**\n- Normal: 36.5-37.5°C (97.7-99.5°F)\n- Low-grade: 37.5-38.3°C (99.5-100.9°F)\n- Moderate: 38.3-39.4°C (100.9-102.9°F)\n- High: >39.4°C (>102.9°F)\n\n**Treatment:**\n- Acetaminophen 500-1000mg q4-6h\n- Ibuprofen 400-800mg q6-8h\n- Cool compresses\n- Hydration\n\n**Red Flags:**\n- Fever >40°C (104°F)\n- Altered mental status\n- Neck stiffness\n- Petechial rash\n- Immunocompromised patient\n\n**Investigation:**\n- Blood cultures if >38.5°C\n- CBC, CRP\n- Consider imaging if focal symptoms",
        type: 'info'
      };
    }

    if (lowerInput.includes('pain') || lowerInput.includes('hurt')) {
      return {
        response: "**Pain Assessment Protocol:**\n\n**PQRST Method:**\n- **P**rovocation/Palliation: What makes it worse/better?\n- **Q**uality: Sharp, dull, throbbing, burning?\n- **R**egion/Radiation: Where is it? Does it spread?\n- **S**everity: Rate 1-10\n- **T**iming: When did it start? Constant/intermittent?\n\n**Pain Scales:**\n- Numeric: 0-10\n- Visual Analog Scale\n- Wong-Baker FACES (pediatric)\n\n**Treatment Options:**\n- Non-pharmacologic: Positioning, ice/heat, distraction\n- Pharmacologic: Acetaminophen, NSAIDs, opioids\n- Consider underlying cause\n\n**Documentation:**\n- Location, intensity, quality\n- Response to treatment\n- Functional impact\n- Reassessment frequency",
        type: 'info'
      };
    }

    if (lowerInput.includes('medication') || lowerInput.includes('dosage') || lowerInput.includes('drug')) {
      return {
        response: "**Medication Administration Protocol:**\n\n**Five Rights:**\n1. Right patient\n2. Right drug\n3. Right dose\n4. Right route\n5. Right time\n\n**Safety Checks:**\n- Verify allergies\n- Check drug interactions\n- Confirm renal/hepatic function\n- Pediatric dosing calculations\n\n**Documentation:**\n- Time given\n- Dose administered\n- Patient response\n- Any adverse reactions\n\n**Special Considerations:**\n- Crushing/opening medications\n- IV compatibility\n- Storage requirements\n- Expiration dates\n\n**Emergency:**\n- Know reversal agents\n- Have emergency equipment ready\n- Monitor for reactions",
        type: 'warning'
      };
    }

    if (lowerInput.includes('infection') || lowerInput.includes('sepsis') || lowerInput.includes('bacteria')) {
      return {
        response: "**Infection Control & Sepsis Protocol:**\n\n**Early Recognition (Sepsis):**\n- Fever >38°C or <36°C\n- Heart rate >90/min\n- Respiratory rate >20/min\n- Altered mental status\n- Systolic BP <90mmHg\n\n**Sepsis Bundle (1-hour):**\n1. Measure lactate\n2. Obtain blood cultures\n3. Administer broad-spectrum antibiotics\n4. Begin fluid resuscitation (30ml/kg)\n5. Vasopressors if needed\n\n**Infection Prevention:**\n- Hand hygiene (alcohol-based or soap/water)\n- Personal protective equipment\n- Isolation procedures\n- Environmental cleaning\n- Sterile technique\n\n**Antibiotic Stewardship:**\n- Culture before antibiotics\n- Narrow spectrum when possible\n- Review duration of therapy\n- Monitor for resistance",
        type: 'warning'
      };
    }

    if (lowerInput.includes('cpr') || lowerInput.includes('cardiac arrest') || lowerInput.includes('resuscitation')) {
      return {
        response: "**CPR Protocol (Adult):**\n\n**Immediate Actions:**\n1. Check responsiveness\n2. Call for help/activate emergency response\n3. Check breathing and pulse simultaneously\n4. Begin compressions if no pulse\n\n**Compression Technique:**\n- Rate: 100-120 compressions/minute\n- Depth: 2-2.4 inches (5-6 cm)\n- Allow full chest recoil\n- Minimize interruptions\n\n**Ventilation:**\n- 30:2 compression-to-ventilation ratio\n- Use barrier device if available\n- Each breath over 1 second\n- Visible chest rise\n\n**AED Use:**\n- Apply as soon as available\n- Follow voice prompts\n- Resume compressions immediately after shock\n\n**Team Coordination:**\n- Rotate compressors every 2 minutes\n- Monitor quality of compressions\n- Prepare for advanced life support",
        type: 'warning'
      };
    }

    if (lowerInput.includes('blood pressure') || lowerInput.includes('hypertension') || lowerInput.includes('bp')) {
      return {
        response: "**Blood Pressure Measurement Protocol:**\n\n**Equipment:**\n- Properly sized cuff\n- Calibrated sphygmomanometer\n- Stethoscope\n\n**Technique:**\n1. Patient seated, arm supported\n2. Cuff 1-2 inches above elbow\n3. Inflate 20-30 mmHg above expected systolic\n4. Deflate slowly (2-3 mmHg/second)\n5. Note first sound (systolic) and last sound (diastolic)\n\n**Normal Ranges:**\n- Normal: <120/<80 mmHg\n- Elevated: 120-129/<80 mmHg\n- Stage 1: 130-139/80-89 mmHg\n- Stage 2: ≥140/≥90 mmHg\n\n**Hypertensive Crisis:**\n- Systolic >180 or diastolic >120\n- Check for end-organ damage\n- Consider immediate treatment\n\n**Documentation:**\n- Position, arm used\n- Multiple readings if needed\n- Associated symptoms",
        type: 'info'
      };
    }

    // Add flexible keyword matches for new topics
    if (lowerInput.includes('diabetes') || lowerInput.includes('sugar')) {
      return medicalResponses['diabetes'];
    }
    if (lowerInput.includes('asthma')) {
      return medicalResponses['asthma'];
    }
    if (lowerInput.includes('stroke') || lowerInput.includes('fast')) {
      return medicalResponses['stroke'];
    }
    if (lowerInput.includes('burn')) {
      return medicalResponses['burn'];
    }
    if (lowerInput.includes('allergy') || lowerInput.includes('anaphylaxis')) {
      return medicalResponses['allergic reaction'];
    }
    if (lowerInput.includes('dehydration') || lowerInput.includes('rehydration')) {
      return medicalResponses['dehydration'];
    }
    if (lowerInput.includes('fracture') || lowerInput.includes('splint')) {
      return medicalResponses['fracture'];
    }
    if (lowerInput.includes('pediatric') || lowerInput.includes('child') && lowerInput.includes('fever')) {
      return medicalResponses['pediatric fever'];
    }
    if (lowerInput.includes('snake')) {
      return medicalResponses['snake bite'];
    }
    if (lowerInput.includes('mental') || lowerInput.includes('suicide') || lowerInput.includes('depression')) {
      return medicalResponses['mental health'];
    }

    // Default response with more helpful suggestions
    return {
      response: "I can help with specific medical topics. Try asking about:\n\n**Common Procedures:**\n• Chest pain assessment\n• Wound care\n• CPR protocol\n• Blood pressure measurement\n\n**Patient Care:**\n• Pain management\n• Fever treatment\n• Medication administration\n• Infection control\n\n**Emergency Situations:**\n• Cardiac arrest\n• Sepsis recognition\n• Trauma assessment\n• Allergic reactions\n\nPlease ask a specific question about any of these topics!",
      type: 'info'
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const currentInput = inputText.trim();
    const userMessage: Message = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const { response, type } = generateResponse(currentInput);
      const botMessage: Message = {
        id: Date.now() + 1,
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
    const userMessage: Message = {
      id: Date.now(),
      text: query,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const { response, type } = generateResponse(query);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        type
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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
                      ? 'bg-green-100' 
                      : message.type === 'warning' 
                      ? 'bg-orange-100' 
                      : message.type === 'success'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="text-green-600" size={16} />
                    ) : (
                      getMessageIcon(message.type)
                    )}
                  </div>
                  <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
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
                    <Bot className="text-green-500" size={16} />
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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