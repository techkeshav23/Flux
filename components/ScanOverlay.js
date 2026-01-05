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
  Upload
} from 'lucide-react';

export default function ScanOverlay({ isOpen, onClose, onAnalyze }) {
  const [mode, setMode] = useState('select'); // select, camera, text
  const [ingredientText, setIngredientText] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractionError, setExtractionError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

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
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Panel - Bottom sheet on mobile, centered modal on desktop */}
      <div className="relative w-full max-w-md lg:max-w-lg bg-white rounded-t-3xl lg:rounded-3xl animate-slide-up lg:animate-fade-in min-h-[70vh] lg:min-h-0 lg:max-h-[85vh] max-h-[85vh] overflow-hidden flex flex-col lg:shadow-2xl lg:m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              {mode === 'select' ? 'Scan Ingredients' : mode === 'camera' ? 'Capture Photo' : 'Paste Ingredients'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {mode === 'select' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-center mb-6">
                Choose how you'd like to input ingredients
              </p>

              {/* Camera Option */}
              <button
                onClick={() => setMode('camera')}
                className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-left group hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">Snap a Photo</h3>
                    <p className="text-emerald-100 text-sm mt-1">
                      Point at the ingredients label
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Text Option */}
              <button
                onClick={() => setMode('text')}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl p-5 text-left group hover:border-emerald-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <FileText className="w-7 h-7 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-800 font-semibold text-lg">Paste Ingredients</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Copy & paste the ingredients list
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              {/* AI Tip */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-purple-900 font-medium text-sm">AI-Powered Analysis</p>
                    <p className="text-purple-700 text-xs mt-1">
                      Our AI doesn't just list ingredients—it reasons about their health impact based on scientific research.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'camera' && (
            <div className="space-y-4">
              {/* Camera Error State */}
              {cameraError && !capturedImage && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium text-sm">{cameraError}</p>
                      <button
                        onClick={triggerFileUpload}
                        className="mt-3 flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Upload an image instead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Camera or Captured Image */}
              <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden">
                {capturedImage ? (
                  // Show captured image
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Live camera feed
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Camera Grid Overlay */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/10" />
                      ))}
                    </div>
                    {/* Focus Box */}
                    <div className="absolute inset-8 border-2 border-emerald-400 rounded-lg pointer-events-none">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                    </div>
                    {/* Instruction */}
                    <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                      <p className="text-white/80 text-sm bg-black/30 inline-block px-4 py-2 rounded-full">
                        Position ingredients label in frame
                      </p>
                    </div>
                  </>
                )}
                
                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-white font-medium">Reading ingredients...</p>
                      <p className="text-white/70 text-sm mt-1">AI is extracting text from image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Extraction Error */}
              {extractionError && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-sm">{extractionError}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {capturedImage ? (
                <div className="space-y-3">
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="w-full bg-emerald-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Extract Ingredients
                      </>
                    )}
                  </button>
                  <button
                    onClick={retakePhoto}
                    disabled={isProcessing}
                    className="w-full bg-slate-100 text-slate-700 rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={capturePhoto}
                    disabled={!!cameraError}
                    className="w-full bg-emerald-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
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
                className="w-full text-slate-600 py-2 font-medium"
              >
                ← Back to options
              </button>
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ingredients List
                </label>
                <textarea
                  value={ingredientText}
                  onChange={(e) => setIngredientText(e.target.value)}
                  placeholder="Paste the ingredients here...

Example: Water, sugar, citric acid, natural flavors, sodium citrate, potassium sorbate..."
                  className="w-full h-40 border-2 border-slate-200 rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none"
                />
              </div>

              {/* Quick Paste Hint */}
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Image className="w-4 h-4" />
                <span>Tip: You can also copy text from a photo using your phone's camera app</span>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!ingredientText.trim()}
                className="w-full bg-emerald-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                Analyze Ingredients
              </button>

              <button
                onClick={() => setMode('select')}
                className="w-full text-slate-600 py-2 font-medium"
              >
                ← Back to options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
