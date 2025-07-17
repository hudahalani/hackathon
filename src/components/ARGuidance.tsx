import { useState, useRef, useEffect } from 'react';
import { Camera, Video, Square, Play, Pause, RotateCcw } from 'lucide-react';

interface ARGuidanceProps {}

export const ARGuidance = ({ }: ARGuidanceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
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
              </div>

              {/* Camera Controls */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProcedure(procedure.id)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{procedure.title}</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {procedure.steps.slice(0, 2).map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {step}
                        </li>
                      ))}
                      {procedure.steps.length > 2 && (
                        <li className="text-blue-600 text-xs">
                          +{procedure.steps.length - 2} more steps
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {selectedProcedure && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {procedures.find(p => p.id === selectedProcedure)?.title} - Steps
                  </h3>
                  <ol className="space-y-2">
                    {procedures.find(p => p.id === selectedProcedure)?.steps.map((step, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">
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