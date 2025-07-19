import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  FileImage,
  Loader2
} from 'lucide-react';

interface DiagnosticResult {
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  referral: boolean;
}

export const ImageDiagnostics: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [specialization, setSpecialization] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const specializations = [
    { id: 'general', name: 'General Medicine', icon: '🩺' },
    { id: 'dermatology', name: 'Dermatology', icon: '🔬' },
    { id: 'radiology', name: 'Radiology', icon: '📷' },
    { id: 'wounds', name: 'Wound Care', icon: '🩹' },
    { id: 'eyes', name: 'Ophthalmology', icon: '👁️' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock diagnostic results based on specialization
    const mockResults: { [key: string]: DiagnosticResult } = {
      dermatology: {
        condition: 'Probable Contact Dermatitis',
        confidence: 87,
        severity: 'medium',
        recommendations: [
          'Apply topical corticosteroid (mild potency)',
          'Avoid known allergens and irritants',
          'Keep area clean and dry',
          'Monitor for signs of infection'
        ],
        referral: false
      },
      radiology: {
        condition: 'Normal Chest X-ray',
        confidence: 92,
        severity: 'low',
        recommendations: [
          'No acute pathology detected',
          'Continue routine monitoring',
          'Maintain healthy lifestyle',
          'Follow up if symptoms persist'
        ],
        referral: false
      },
      wounds: {
        condition: 'Stage 2 Pressure Ulcer',
        confidence: 89,
        severity: 'high',
        recommendations: [
          'Immediate pressure relief',
          'Wound cleaning with saline',
          'Apply appropriate dressing',
          'Nutritional support required'
        ],
        referral: true
      },
      general: {
        condition: 'Possible Cellulitis',
        confidence: 78,
        severity: 'high',
        recommendations: [
          'Start empirical antibiotic therapy',
          'Monitor for systemic symptoms',
          'Elevate affected limb',
          'Consider hospitalization if severe'
        ],
        referral: true
      }
    };
    
    setResult(mockResults[specialization] || mockResults.general);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI-Assisted Diagnostics</h2>
        <p className="text-gray-600">Upload medical images for instant AI-powered preliminary diagnosis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Upload Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Medical Specialization
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specializations.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSpecialization(spec.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      specialization === spec.id
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-lg mb-1">{spec.icon}</div>
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Medical image"
                    className="max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Upload size={16} />
                      <span>Change Image</span>
                    </button>
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Search size={16} />
                          <span>Analyze Image</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileImage size={48} className="mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload Medical Image
                    </p>
                    <p className="text-gray-600 mb-4">
                      Support for X-rays, photos, scans, and other medical images
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
                    >
                      <Camera size={20} />
                      <span>Choose Image</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Diagnostic Result</h3>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm text-green-600">Analysis Complete</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Condition</p>
                  <p className="text-lg font-semibold text-gray-900">{result.condition}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Confidence</p>
                    <p className="text-lg font-semibold text-gray-900">{result.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Severity</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                      {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                    </span>
                  </div>
                </div>

                {result.referral && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="text-red-500" size={20} />
                    <span className="text-sm font-medium text-red-700">
                      Specialist referral recommended
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Camera size={20} className="text-gray-600" />
                <span className="text-gray-700">Take New Photo</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Search size={20} className="text-gray-600" />
                <span className="text-gray-700">View Similar Cases</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <AlertCircle size={20} className="text-gray-600" />
                <span className="text-gray-700">Contact Specialist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};