'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, 
  Camera, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Image,
  Zap,
  RefreshCw,
  AlertCircle,
  Upload,
  Mic,
  MicOff
} from 'lucide-react';

export default function ScanOverlay({ isOpen, onClose, onAnalyze }) {
  const [mode, setMode] = useState('select'); // select, camera, text
  const [ingredientText, setIngredientText] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractionError, setExtractionError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setVoiceSupported(!!SpeechRecognition);
    }
  }, []);

  // Initialize speech recognition
  const startVoiceInput = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Support both English and Hindi

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setIngredientText(prev => {
          const newText = prev + (prev ? ' ' : '') + finalTranscript.trim();
          return newText;
        });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  // Cleanup on unmount or mode change
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [mode]);

  // Start camera when entering camera mode
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Failed to access camera. Try uploading an image instead.');
      }
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Handle mode changes
  useEffect(() => {
    if (mode === 'camera' && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [mode, isOpen, startCamera, stopCamera]);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  }, [stopCamera]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setExtractionError('Please select an image file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target.result);
      setMode('camera'); // Show preview mode
    };
    reader.readAsDataURL(file);
  };

  // Process captured image with Gemini Vision
  const processImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setExtractionError(null);
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
      
      const result = await response.json();
      
      if (result.success && result.ingredients) {
        setIngredientText(result.ingredients);
        setCapturedImage(null);
        setMode('text');
      } else {
        setExtractionError(result.notes || 'Could not extract ingredients. Please try again or paste manually.');
      }
    } catch (error) {
      console.error('Image processing error:', error);
      setExtractionError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setExtractionError(null);
    startCamera();
  };

  const handleAnalyze = () => {
    if (ingredientText.trim()) {
      onAnalyze(ingredientText);
      setIngredientText('');
      setCapturedImage(null);
      setExtractionError(null);
      setMode('select');
    }
  };

  const handleClose = () => {
    stopCamera();
    setMode('select');
    setIngredientText('');
    setCapturedImage(null);
    setCameraError(null);
    setExtractionError(null);
    onClose();
  };

  // Hidden file input for upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Scan ingredients"
    >
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      
      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload image file"
      />
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel - Bottom sheet on mobile, centered modal on desktop */}
      <div className="relative w-full max-w-lg lg:max-w-2xl bg-white rounded-t-2xl lg:rounded-2xl animate-slide-up lg:animate-fade-in min-h-[70vh] lg:min-h-0 lg:max-h-[85vh] max-h-[85vh] overflow-hidden flex flex-col lg:shadow-2xl lg:m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 lg:p-6 border-b border-slate-100">
          <h2 className="text-lg lg:text-xl font-semibold text-slate-900">
            {mode === 'select' ? 'Scan Ingredients' : mode === 'camera' ? 'Capture Photo' : 'Paste Ingredients'}
          </h2>
          <button 
            onClick={handleClose}
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          {mode === 'select' && (
            <div className="space-y-4 lg:space-y-5">
              <p className="text-slate-600 text-center mb-6 lg:text-lg">
                Choose how you'd like to input ingredients
              </p>

              {/* Options Grid on Desktop */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                {/* Camera Option */}
                <button
                  onClick={() => setMode('camera')}
                  className="w-full bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-4 lg:p-6 text-left group hover:from-emerald-500 hover:to-teal-600 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">Snap a Photo</h3>
                    <p className="text-emerald-100 text-sm mt-0.5">
                      Point at the ingredients label
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/70" />
                </div>
              </button>

              {/* Text Option */}
              <button
                onClick={() => setMode('text')}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 lg:p-6 text-left group hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 font-semibold">Paste Ingredients</h3>
                    <p className="text-slate-500 text-sm mt-0.5">
                      Copy & paste the ingredients list
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </button>
              </div>

              {/* AI Tip */}
              <div className="bg-slate-50 rounded-xl p-4 mt-6 lg:mt-5">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600 text-sm lg:text-base">
                    AI-powered analysis that reasons about health impact based on research.
                  </p>
                </div>
              </div>

              {/* Quick Demo Button */}
              <button
                onClick={() => {
                  setIngredientText('Water, High Fructose Corn Syrup, Citric Acid, Natural Flavors, Sodium Benzoate (Preservative), Potassium Sorbate, Yellow 5, Yellow 6');
                  setMode('text');
                }}
                className="w-full bg-purple-50 border border-purple-200 rounded-xl p-3 text-center hover:bg-purple-100 transition-colors"
              >
                <span className="text-purple-700 font-medium text-sm">✨ Try Demo Ingredients</span>
              </button>
            </div>
          )}

          {mode === 'camera' && (
            <div className="space-y-4 lg:max-w-md lg:mx-auto">
              {/* Camera Error State */}
              {cameraError && !capturedImage && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 text-sm">{cameraError}</p>
                      <button
                        onClick={triggerFileUpload}
                        className="mt-2 flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Upload an image instead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Camera or Captured Image */}
              <div className="relative aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden">
                {capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Focus Box */}
                    <div className="absolute inset-6 border-2 border-white/30 rounded-lg pointer-events-none">
                      <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                      <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br" />
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                      <p className="text-white/80 text-sm bg-black/40 inline-block px-3 py-1.5 rounded-full">
                        Position ingredients in frame
                      </p>
                    </div>
                  </>
                )}
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-white font-medium">Reading ingredients...</p>
                    </div>
                  </div>
                )}
              </div>

              {extractionError && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-sm">{extractionError}</p>
                  </div>
                </div>
              )}

              {capturedImage ? (
                <div className="space-y-3">
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="w-full bg-emerald-600 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Extract Ingredients'}
                  </button>
                  <button
                    onClick={retakePhoto}
                    disabled={isProcessing}
                    className="w-full bg-slate-100 text-slate-700 rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={capturePhoto}
                    disabled={!!cameraError}
                    className="w-full bg-emerald-600 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5" />
                    Capture
                  </button>
                  <button
                    onClick={triggerFileUpload}
                    className="w-full bg-slate-100 text-slate-700 rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload from Gallery
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  stopCamera();
                  setCapturedImage(null);
                  setCameraError(null);
                  setExtractionError(null);
                  setMode('select');
                }}
                className="w-full text-slate-500 py-2 text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-4 lg:max-w-lg lg:mx-auto">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm lg:text-base font-medium text-slate-700">
                    Ingredients List
                  </label>
                  {voiceSupported && (
                    <button
                      onClick={toggleVoiceInput}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isListening 
                          ? 'bg-red-100 text-red-600 animate-pulse' 
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          Voice
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    value={ingredientText}
                    onChange={(e) => setIngredientText(e.target.value)}
                    placeholder={isListening ? "Listening... Speak the ingredients" : "Paste or speak the ingredients here...\n\nExample: Water, sugar, citric acid, natural flavors..."}
                    className={`w-full h-36 lg:h-48 border rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none lg:text-base ${
                      isListening ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {isListening && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 text-red-500">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-medium">Listening...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Mic className="w-4 h-4" />
                <span>Tip: Use voice input to speak ingredients or paste from clipboard</span>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!ingredientText.trim()}
                aria-label="Analyze ingredients"
                className="w-full bg-emerald-600 text-white rounded-xl py-3.5 lg:py-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed lg:text-lg"
              >
                Analyze Ingredients
              </button>

              <button
                onClick={() => {
                  stopVoiceInput();
                  setMode('select');
                }}
                className="w-full text-slate-500 py-2 text-sm"
                aria-label="Go back to selection"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
