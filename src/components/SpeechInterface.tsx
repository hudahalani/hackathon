import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  FileText,
  Stethoscope,
  AlertTriangle
} from 'lucide-react';

interface VoiceCommand {
  command: string;
  response: string;
  category: 'procedure' | 'diagnostic' | 'emergency' | 'medication';
}

export const SpeechInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [speechError, setSpeechError] = useState<string>('');

  const medicalCommands: VoiceCommand[] = [
    {
      command: "start chest compression",
      response: "Beginning chest compressions. Place the heel of your hand on the center of the chest between the nipples. Push hard and fast at least 2 inches deep. Compress at 100 to 120 compressions per minute. Count: one, two, three...",
      category: 'emergency'
    },
    {
      command: "blood pressure reading",
      response: "For blood pressure measurement: Place cuff on upper arm, 1-2 inches above elbow. Pump cuff 20-30 mmHg above expected systolic. Release slowly at 2-3 mmHg per second. Note first sound for systolic, last sound for diastolic pressure.",
      category: 'procedure'
    },
    {
      command: "wound assessment",
      response: "Wound assessment protocol: Examine size using ruler, assess depth and edges. Check for signs of infection including redness, warmth, swelling, purulent drainage. Document location, appearance, and surrounding tissue condition.",
      category: 'diagnostic'
    },
    {
      command: "medication dosage",
      response: "For medication administration, always verify the five rights: right patient, right drug, right dose, right route, right time. Calculate pediatric doses based on weight. Double-check high-risk medications with another provider.",
      category: 'medication'
    },
    {
      command: "emergency protocol",
      response: "Emergency response activated. Assess scene safety first. Check patient responsiveness. Call for help if needed. Begin primary assessment: airway, breathing, circulation. Provide appropriate interventions based on findings.",
      category: 'emergency'
    },
    {
      command: "IV insertion",
      response: "IV insertion procedure: Select appropriate vein, usually cephalic or basilic. Clean site with alcohol. Insert at 15-30 degree angle. Watch for flashback in catheter. Advance catheter, remove needle. Secure and connect tubing.",
      category: 'procedure'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Commands', icon: FileText },
    { id: 'procedure', name: 'Procedures', icon: Stethoscope },
    { id: 'diagnostic', name: 'Diagnostics', icon: FileText },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle },
    { id: 'medication', name: 'Medications', icon: FileText }
  ];

  const startListening = () => {
    setSpeechError('');
    setTranscript('');
    setResponse('');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Improved configuration for better recognition
      recognition.continuous = false; // Changed to false for better results
      recognition.interimResults = false; // Changed to false to avoid partial results
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setSpeechError('');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        processCommand(transcript);
      };
      
      recognition.onerror = (event: any) => {
        let errorMessage = '';
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable microphone permissions in your browser settings.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted. Please try again.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection and try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone and try again.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed. Please check your browser settings.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}. Please try again.`;
        }
        setSpeechError(errorMessage);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      try {
        recognition.start();
      } catch (error) {
        setSpeechError('Failed to start speech recognition. Please try again.');
        setIsListening(false);
      }
    } else {
      // Fallback for browsers without speech recognition
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const processCommand = (command: string) => {
    setIsProcessing(true);
    const lowerCommand = command.toLowerCase().trim();
    
    console.log('Processing command:', lowerCommand); // Debug log
    
    // Find matching command with improved matching
    const matchedCommand = medicalCommands.find(cmd => {
      const cmdLower = cmd.command.toLowerCase();
      const keywords = cmdLower.split(' ');
      
      // Check if command contains any of the keywords
      return keywords.some(keyword => lowerCommand.includes(keyword)) ||
             lowerCommand.includes(cmdLower) ||
             cmdLower.includes(lowerCommand);
    });
    
    if (matchedCommand) {
      console.log('Matched command:', matchedCommand.command); // Debug log
      setResponse(matchedCommand.response);
      setCommandHistory(prev => [matchedCommand, ...prev.slice(0, 4)]);
      
      if (voiceEnabled) {
        speakResponse(matchedCommand.response);
      }
    } else {
      console.log('No match found for:', lowerCommand); // Debug log
      const defaultResponse = "I didn't understand that command. Please try saying: 'chest compression', 'blood pressure', 'wound assessment', 'medication dosage', or 'emergency protocol'.";
      setResponse(defaultResponse);
      
      if (voiceEnabled) {
        speakResponse(defaultResponse);
      }
    }
    
    setIsProcessing(false);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const repeatResponse = () => {
    if (response && voiceEnabled) {
      speakResponse(response);
    }
  };

  const filteredCommands = selectedCategory === 'all' 
    ? medicalCommands 
    : medicalCommands.filter(cmd => cmd.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-700';
      case 'procedure': return 'bg-blue-100 text-blue-700';
      case 'diagnostic': return 'bg-green-100 text-green-700';
      case 'medication': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Voice Commands</h2>
        <p className="text-gray-600">Hands-free medical guidance and procedure instructions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Voice Control</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    voiceEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button
                  onClick={repeatResponse}
                  disabled={!response || isSpeaking}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            {/* Main Voice Interface */}
            <div className="text-center mb-6">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                isListening ? 'bg-red-100 animate-pulse shadow-lg' : 'bg-gray-100'
              }`}>
                {isListening ? (
                  <div className="text-center">
                    <MicOff size={48} className="text-red-600 mb-2" />
                    <div className="text-sm text-red-600 font-medium">Listening...</div>
                  </div>
                ) : (
                  <Mic size={48} className="text-gray-600" />
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isListening 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isListening ? 'Stop Listening' : 'Start Voice Command'}
                </button>
                
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Pause size={20} className="inline mr-2" />
                    Stop Speaking
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              {transcript && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">You said:</p>
                  <p className="text-blue-800">{transcript}</p>
                </div>
              )}
              
              {isProcessing && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">Processing command...</p>
                </div>
              )}
              
              {response && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-1">Response:</p>
                  <p className="text-green-800">{response}</p>
                </div>
              )}
              
              {speechError && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-1">Speech Recognition Error:</p>
                  <p className="text-red-800">{speechError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Commands */}
          {commandHistory.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Commands</h3>
              <div className="space-y-3">
                {commandHistory.map((cmd, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{cmd.command}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(cmd.category)}`}>
                      {cmd.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Commands */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <category.icon size={20} />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Available Commands</h3>
            <div className="space-y-3">
              {filteredCommands.map((cmd, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{cmd.command}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(cmd.category)}`}>
                      {cmd.category}
                    </span>
                  </div>
                  <button
                    onClick={() => processCommand(cmd.command)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Try command →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};