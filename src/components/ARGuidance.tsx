import { useState, useRef, useEffect } from 'react';
import { Camera, Video, Square, Play, Pause, RotateCcw, Search } from 'lucide-react';

interface ARGuidanceProps {}

export const ARGuidance = ({ }: ARGuidanceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedCondition, setDetectedCondition] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        },
        audio: false
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setIsRecording(true);
      setIsPaused(false);
      startAnalysis(); // Start automatic analysis when recording begins
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsRecording(false);
    setIsPaused(false);
    stopAnalysis(); // Stop analysis when recording stops
  };

  const togglePause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const resetCamera = () => {
    stopRecording();
    setTimeout(() => {
      startRecording();
    }, 100);
  };

  // Image analysis function
  const analyzeImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple color analysis for medical conditions
    const analysis = performMedicalAnalysis(data, canvas.width, canvas.height);
    
    if (analysis.condition) {
      setDetectedCondition(analysis.condition);
      setAnalysisResult(analysis.treatment);
      speakAnalysis(analysis.condition, analysis.treatment);
    }
  };

  // Perform advanced medical condition analysis
  const performMedicalAnalysis = (imageData: Uint8ClampedArray, width: number, height: number) => {
    let redPixels = 0;
    let darkPixels = 0;
    let yellowPixels = 0;
    let whitePixels = 0;
    let brownPixels = 0;
    let greenPixels = 0;
    let bluePixels = 0;
    let totalPixels = width * height;

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];

      // Red: Inflammation/infection
      if (r > 150 && r > g * 1.3 && r > b * 1.3) redPixels++;
      // Dark: Bruising/necrosis
      if (r < 80 && g < 80 && b < 80) darkPixels++;
      // Yellow: Pus/discharge
      if (r > 180 && g > 180 && b < 100 && Math.abs(r - g) < 40) yellowPixels++;
      // White: Fungal/necrosis
      if (r > 200 && g > 200 && b > 200) whitePixels++;
      // Brown: Scab/old wound
      if (r > 90 && g > 60 && b < 50 && r > g && g > b) brownPixels++;
      // Green: Gangrene/infection
      if (g > 120 && r < 100 && b < 100) greenPixels++;
      // Blue/Purple: Cyanosis/bruising
      if (b > 120 && r < 100 && g < 100) bluePixels++;
    }

    const percent = (n: number) => (n / totalPixels) * 100;

    if (percent(redPixels) > 12) {
      return {
        condition: 'Inflammation or Infection',
        treatment: 'Redness detected. Clean with sterile saline, apply dressing, monitor for fever or spreading. Consider antibiotics if infection suspected.'
      };
    } else if (percent(yellowPixels) > 7) {
      return {
        condition: 'Pus or Discharge',
        treatment: 'Yellowish area detected. Indicates pus or discharge. Clean thoroughly, consider wound culture, start antibiotics, and seek medical attention.'
      };
    } else if (percent(whitePixels) > 8) {
      return {
        condition: 'Fungal Infection or Necrosis',
        treatment: 'White area detected. May indicate fungal infection or tissue necrosis. Keep area dry, use antifungal if indicated, and consult a specialist.'
      };
    } else if (percent(brownPixels) > 8) {
      return {
        condition: 'Scab or Old Wound',
        treatment: 'Brown area detected. Indicates scabbing or healing wound. Keep clean and dry, avoid picking, and monitor for infection.'
      };
    } else if (percent(greenPixels) > 5) {
      return {
        condition: 'Possible Gangrene or Severe Infection',
        treatment: 'Greenish area detected. This may indicate gangrene or severe infection. Seek urgent medical attention.'
      };
    } else if (percent(bluePixels) > 7) {
      return {
        condition: 'Cyanosis or Bruising',
        treatment: 'Blue or purple area detected. May indicate bruising or poor oxygenation (cyanosis). Apply cold compress for bruising, and seek medical attention if cyanosis is suspected.'
      };
    } else if (percent(darkPixels) > 15) {
      return {
        condition: 'Bruising or Tissue Damage',
        treatment: 'Dark area detected. Indicates bruising or tissue damage. Apply ice, elevate, and monitor for pain or numbness.'
      };
    } else {
      return {
        condition: null,
        treatment: null
      };
    }
  };

  // Voice feedback function
  const speakAnalysis = (condition: string, treatment: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Detected ${condition}. ${treatment}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // Start continuous analysis
  const startAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    
    analysisIntervalRef.current = window.setInterval(() => {
      if (isRecording && !isPaused) {
        setIsAnalyzing(true);
        analyzeImage();
        setTimeout(() => setIsAnalyzing(false), 1000);
      }
    }, 3000); // Analyze every 3 seconds
  };

  // Stop analysis
  const stopAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  // Clear detected condition
  const clearDetection = () => {
    setDetectedCondition(null);
    setAnalysisResult(null);
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      stopAnalysis();
    };
  }, [stream]);

  const procedures = [
    {
      id: 'cpr',
      title: 'CPR Procedure',
      steps: [
        'Place patient on flat surface',
        'Position hands on center of chest',
        'Compress 2 inches deep at 100-120 BPM',
        'Give 2 rescue breaths after 30 compressions'
      ]
    },
    {
      id: 'wound',
      title: 'Wound Care',
      steps: [
        'Clean hands and wear gloves',
        'Irrigate wound with sterile saline',
        'Apply appropriate dressing',
        'Monitor for signs of infection'
      ]
    },
    {
      id: 'iv',
      title: 'IV Insertion',
      steps: [
        'Select appropriate vein',
        'Clean site with antiseptic',
        'Insert needle at 15-30 degree angle',
        'Secure catheter and apply dressing'
      ]
    }
  ];

  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AR Medical Guidance</h1>
          <p className="text-gray-600">Use augmented reality to guide medical procedures</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Camera Feed</h2>
              </div>
              
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  style={{ display: 'none' }}
                />
                
                {!isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-center text-white">
                      <Camera size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Camera not active</p>
                      <p className="text-sm opacity-75">Click "Start Recording" to begin</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75">
                    <div className="text-center text-white p-4">
                      <p className="text-lg font-semibold">Camera Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* AR Overlay */}
                {isRecording && selectedProcedure && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                    <h3 className="font-semibold mb-2">Active Procedure</h3>
                    <p className="text-sm">{procedures.find(p => p.id === selectedProcedure)?.title}</p>
                  </div>
                )}

                {/* Analysis Status */}
                {isAnalyzing && (
                  <div className="absolute top-4 right-4 bg-blue-600 bg-opacity-90 text-white p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Analyzing...</span>
                    </div>
                  </div>
                )}

                {/* Detected Condition */}
                {detectedCondition && (
                  <div className="absolute bottom-4 left-4 right-4 bg-red-600 bg-opacity-90 text-white p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">⚠️ Detected: {detectedCondition}</h3>
                        <p className="text-sm">{analysisResult}</p>
                        {isSpeaking && (
                          <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                            <span className="text-xs">Speaking treatment guidance...</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={clearDetection}
                        className="ml-4 p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                      >
                        <Square size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Video size={20} />
                      <span>Start Recording</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={togglePause}
                        className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>
                      
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <Search size={16} />
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Now'}</span>
                      </button>
                      
                      <button
                        onClick={resetCamera}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <RotateCcw size={16} />
                        <span>Reset</span>
                      </button>
                      
                      <button
                        onClick={stopRecording}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Square size={16} />
                        <span>Stop</span>
                      </button>
                    </>
                  )}
                </div>
                
                {/* Analysis Info */}
                {isRecording && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 text-center">
                      🔍 Camera will automatically analyze for medical conditions every 3 seconds
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Procedure Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Procedures</h2>
              
              <div className="space-y-3">
                {procedures.map((procedure) => (
                  <div
                    key={procedure.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedProcedure === procedure.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProcedure(procedure.id)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{procedure.title}</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {procedure.steps.slice(0, 2).map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {step}
                        </li>
                      ))}
                      {procedure.steps.length > 2 && (
                        <li className="text-green-600 text-xs">
                          +{procedure.steps.length - 2} more steps
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {selectedProcedure && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {procedures.find(p => p.id === selectedProcedure)?.title} - Steps
                  </h3>
                  <ol className="space-y-2">
                    {procedures.find(p => p.id === selectedProcedure)?.steps.map((step, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};