'use client';

import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash, Pen, Type, Upload, MousePointer } from 'lucide-react';

interface SignaturePadProps {
  onSign: (data: { signature_svg: string; signature_image: string }) => void;
  disabled?: boolean;
  loading?: boolean;
  candidateName: string;
}

export default function SignaturePad({ onSign, disabled, loading, candidateName }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Signature options state
  const [activeTab, setActiveTab] = useState('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [typedInitials, setTypedInitials] = useState('');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Available fonts for typed signatures
  const signatureFonts = [
    { name: 'Cursive', value: 'cursive', style: 'font-family: cursive' },
    { name: 'Script', value: 'Dancing Script', style: 'font-family: "Dancing Script", cursive' },
    { name: 'Elegant', value: 'Great Vibes', style: 'font-family: "Great Vibes", cursive' },
    { name: 'Classic', value: 'Pinyon Script', style: 'font-family: "Pinyon Script", cursive' },
    { name: 'Modern', value: 'Kaushan Script', style: 'font-family: "Kaushan Script", cursive' }
  ];

  const getCanvasPosition = (canvas: HTMLCanvasElement, e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    
    setIsDrawing(true);
    setHasStarted(true);
    setIsEmpty(false);
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getCanvasPosition(canvas, e);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [disabled]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    
    e.preventDefault(); // Prevent scrolling on touch devices
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getCanvasPosition(canvas, e);
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, disabled]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    setHasStarted(false);
  }, []);

  const generateTypedSignature = useCallback((text: string, isInitials: boolean = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set font style
    const fontSize = isInitials ? 80 : 48;
    ctx.font = `${fontSize}px ${selectedFont}`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    return canvas.toDataURL('image/png');
  }, [selectedFont]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const processUploadedSignature = useCallback((imageDataUrl: string) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 200;
        const ctx = canvas.getContext('2d')!;
        
        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit image
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        // Draw image
        ctx.drawImage(img, x, y, width, height);
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imageDataUrl;
    });
  }, []);

  const handleSign = useCallback(async () => {
    let signatureImage = '';
    
    try {
      if (activeTab === 'draw') {
        if (!canvasRef.current || isEmpty) return;
        signatureImage = canvasRef.current.toDataURL('image/png', 1.0);
      } else if (activeTab === 'type') {
        if (!typedSignature.trim()) {
          alert('Please enter your name for the signature');
          return;
        }
        signatureImage = generateTypedSignature(typedSignature);
      } else if (activeTab === 'initials') {
        if (!typedInitials.trim()) {
          alert('Please enter your initials');
          return;
        }
        signatureImage = generateTypedSignature(typedInitials, true);
      } else if (activeTab === 'upload') {
        if (!uploadedImage) {
          alert('Please upload a signature image');
          return;
        }
        signatureImage = await processUploadedSignature(uploadedImage);
      }

      if (!signatureImage) return;

      // Create SVG version for scalability
      const svgData = `
        <svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              <img src="${signatureImage}" width="600" height="200" />
            </div>
          </foreignObject>
        </svg>
      `;

      onSign({
        signature_svg: svgData,
        signature_image: signatureImage
      });
    } catch (error) {
      console.error('Error creating signature:', error);
      alert('Error creating signature. Please try again.');
    }
  }, [activeTab, isEmpty, typedSignature, typedInitials, uploadedImage, generateTypedSignature, processUploadedSignature, onSign]);

  // Touch event handlers to prevent default browser behavior
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    draw(e);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const isSignatureReady = () => {
    switch (activeTab) {
      case 'draw': return hasStarted && !isEmpty;
      case 'type': return typedSignature.trim().length > 0;
      case 'initials': return typedInitials.trim().length > 0;
      case 'upload': return uploadedImage !== null;
      default: return false;
    }
  };

  return (
    <div className="signature-pad space-y-6">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Please sign below as: <strong>{candidateName}</strong>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Choose your preferred signing method
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="draw" className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            Draw
          </TabsTrigger>
          <TabsTrigger value="type" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Type
          </TabsTrigger>
          <TabsTrigger value="initials" className="flex items-center gap-2">
            <Pen className="h-4 w-4" />
            Initials
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="draw" className="space-y-4">
          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
            {!hasStarted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="flex items-center text-gray-400 dark:text-gray-500">
                  <MousePointer className="h-5 w-5 mr-2" />
                  <span className="text-sm">Click and drag to sign</span>
                </div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="signature-canvas w-full h-48 cursor-crosshair touch-none rounded"
              style={{ touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={disabled || isEmpty}
              className="flex items-center"
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="type" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="typed-signature" className="text-gray-700 dark:text-gray-300">
                Enter your full name
              </Label>
              <Input
                id="typed-signature"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="John Doe"
                disabled={disabled}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                Choose signature style
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {signatureFonts.map((font) => (
                  <button
                    key={font.value}
                    type="button"
                    onClick={() => setSelectedFont(font.value)}
                    disabled={disabled}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedFont === font.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-400">{font.name}</div>
                    <div 
                      className="text-xl text-gray-900 dark:text-white"
                      style={{ fontFamily: font.value }}
                    >
                      {typedSignature || candidateName}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {typedSignature && (
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</div>
                <div 
                  className="text-3xl text-center text-gray-900 dark:text-white"
                  style={{ fontFamily: selectedFont }}
                >
                  {typedSignature}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="initials" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="typed-initials" className="text-gray-700 dark:text-gray-300">
                Enter your initials
              </Label>
              <Input
                id="typed-initials"
                value={typedInitials}
                onChange={(e) => setTypedInitials(e.target.value)}
                placeholder="JD"
                disabled={disabled}
                className="mt-1"
                maxLength={4}
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                Choose initials style
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {signatureFonts.map((font) => (
                  <button
                    key={font.value}
                    type="button"
                    onClick={() => setSelectedFont(font.value)}
                    disabled={disabled}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedFont === font.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-400">{font.name}</div>
                    <div 
                      className="text-xl text-gray-900 dark:text-white"
                      style={{ fontFamily: font.value }}
                    >
                      {typedInitials || 'JD'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {typedInitials && (
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</div>
                <div 
                  className="text-5xl text-center text-gray-900 dark:text-white"
                  style={{ fontFamily: selectedFont }}
                >
                  {typedInitials}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                Upload signature image
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Upload a clear image of your signature (PNG, JPG, or GIF, max 2MB)
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={disabled}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
            </div>

            {uploadedImage && (
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</div>
                <div className="flex justify-center">
                  <img
                    src={uploadedImage}
                    alt="Uploaded signature"
                    className="max-w-full max-h-32 border rounded"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadedImage(null)}
                  disabled={disabled}
                  className="mt-2 w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button
          onClick={handleSign}
          disabled={disabled || !isSignatureReady()}
          className="px-8 py-3"
          size="lg"
        >
          {loading ? 'Signing Contract...' : 'Sign Contract'}
        </Button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        By signing, you agree to the terms and conditions outlined in this contract.
      </div>
    </div>
  );
}
