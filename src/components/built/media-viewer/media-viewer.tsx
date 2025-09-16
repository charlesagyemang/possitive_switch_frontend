"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  Video,
  Music
} from "lucide-react";

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Array<{
    id: string;
    name: string;
    file_url: string;
    file_type: string;
    file_name: string;
  }>;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function MediaViewer({ 
  isOpen, 
  onClose, 
  documents, 
  currentIndex, 
  onIndexChange 
}: MediaViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const currentDocument = documents[currentIndex];

  // Reset states when document changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onIndexChange(currentIndex - 1);
          break;
        case 'ArrowRight':
          if (currentIndex < documents.length - 1) onIndexChange(currentIndex + 1);
          break;
        case ' ':
          e.preventDefault();
          if (isVideoOrAudio()) togglePlayPause();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          setZoom(prev => Math.max(prev - 0.25, 0.25));
          break;
        case 'r':
          setRotation(prev => (prev + 90) % 360);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, isPlaying, onClose, onIndexChange]);

  const isImage = () => currentDocument?.file_type.startsWith('image/');
  const isVideo = () => currentDocument?.file_type.startsWith('video/');
  const isAudio = () => currentDocument?.file_type.startsWith('audio/');
  const isPDF = () => currentDocument?.file_type === 'application/pdf';
  const isVideoOrAudio = () => isVideo() || isAudio();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentDocument.file_url;
    link.download = currentDocument.file_name;
    link.click();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < documents.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef) {
      videoRef.currentTime = newTime;
    }
  };

  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !currentDocument) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-xl font-bold truncate max-w-md">
              {currentDocument.name}
            </h2>
            <span className="text-gray-300 text-sm">
              {currentIndex + 1} of {documents.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === documents.length - 1}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Controls */}
            {isImage() && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.25))}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                
                <span className="text-white text-sm px-2">
                  {Math.round(zoom * 100)}%
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className={`flex-1 flex items-center justify-center ${isPDF() ? 'p-2 pt-20 pb-20' : 'p-4 pt-20 pb-20'}`}>
        <div className={`max-w-full max-h-full ${isPDF() ? 'w-full h-full' : ''}`}>
          {isImage() && (
            <img
              src={currentDocument.file_url}
              alt={currentDocument.name}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                cursor: zoom > 1 ? 'grab' : 'default'
              }}
              draggable={false}
            />
          )}

          {isVideo() && (
            <div className="relative">
              <video
                ref={setVideoRef}
                src={currentDocument.file_url}
                controls={false}
                muted={isMuted}
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onClick={togglePlayPause}
                className="max-w-full max-h-full cursor-pointer"
                style={{ maxHeight: '80vh' }}
              />
              
              {/* Custom Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-white text-sm">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%, #4b5563 100%)`
                      }}
                    />
                    <span className="text-white text-sm">{formatTime(duration)}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAudio() && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white text-lg font-bold">{currentDocument.name}</h3>
                <p className="text-gray-300 text-sm">Audio File</p>
              </div>

              <audio
                src={currentDocument.file_url}
                controls
                autoPlay={isPlaying}
                className="w-full"
              />
            </div>
          )}

          {isPDF() && (
            <div className="w-full h-full">
              <iframe
                src={`${currentDocument.file_url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                className="w-full h-full border-0 rounded-lg"
                title={currentDocument.name}
                style={{ 
                  width: '100%', 
                  height: '85vh',
                  minHeight: '85vh',
                  maxHeight: '85vh'
                }}
              />
            </div>
          )}

          {!isImage() && !isVideo() && !isAudio() && !isPDF() && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">{currentDocument.name}</h3>
              <p className="text-gray-300 text-sm mb-4">Preview not available for this file type</p>
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer with file info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              {isImage() && <Image className="w-4 h-4" />}
              {isVideo() && <Video className="w-4 h-4" />}
              {isAudio() && <Music className="w-4 h-4" />}
              {isPDF() && <FileText className="w-4 h-4" />}
              {currentDocument.file_type}
            </span>
            <span>{currentDocument.file_name}</span>
          </div>
          
          <div className="text-gray-300">
            Use arrow keys to navigate • Space to play/pause • F for fullscreen • ESC to close
          </div>
        </div>
      </div>
    </div>
  );
}
