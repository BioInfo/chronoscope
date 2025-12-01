import { useState, useEffect } from 'react';
import {
  Images,
  X,
  Download,
  Trash2,
  MapPin,
  Calendar,
  HardDrive,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import type { GalleryImage } from '../types';
import {
  getAllGalleryImages,
  deleteGalleryImage,
  clearGallery,
  estimateStorageUsage,
  downloadImage,
  deduplicateGallery,
} from '../services/galleryService';
import { useChronoscope } from '../context/ChronoscopeContext';
import { formatYear } from '../utils/validation';

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImageCardProps {
  image: GalleryImage;
  onView: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

function ImageCard({ image, onView, onDelete, onDownload }: ImageCardProps) {
  const { temporal } = image.coordinates;
  const year = formatYear(temporal.year);

  return (
    <div className="group relative bg-chrono-dark/50 border border-chrono-border rounded-lg overflow-hidden hover:border-chrono-blue/50 transition-colors">
      {/* Thumbnail */}
      <button
        onClick={onView}
        className="w-full aspect-[9/16] overflow-hidden"
      >
        <img
          src={image.imageData}
          alt={image.locationName}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </button>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-chrono-black/90 via-chrono-black/60 to-transparent p-3 pt-8">
        <h3 className="font-mono text-xs font-semibold text-chrono-text truncate">
          {image.locationName}
        </h3>
        <p className="font-mono text-xs text-chrono-text-dim mt-1">{year}</p>
      </div>

      {/* Action buttons - visible on hover */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="p-1.5 rounded bg-chrono-dark/80 hover:bg-chrono-blue/30 text-chrono-text-dim hover:text-chrono-blue transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded bg-chrono-dark/80 hover:bg-chrono-red/30 text-chrono-text-dim hover:text-chrono-red transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ImageViewerProps {
  image: GalleryImage;
  onBack: () => void;
  onDelete: () => void;
  onJumpTo: () => void;
}

function ImageViewer({ image, onBack, onDelete, onJumpTo }: ImageViewerProps) {
  const { temporal } = image.coordinates;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-chrono-border pb-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-chrono-text-dim hover:text-chrono-blue transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-mono text-sm">Back to Gallery</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadImage(image)}
            className="p-2 rounded hover:bg-chrono-blue/20 text-chrono-text-dim hover:text-chrono-blue transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded hover:bg-chrono-red/20 text-chrono-text-dim hover:text-chrono-red transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image and Info */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Image */}
        <div className="flex-1 flex items-center justify-center bg-chrono-black rounded-lg overflow-hidden min-h-0">
          <img
            src={image.imageData}
            alt={image.locationName}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Info panel */}
        <div className="lg:w-72 space-y-4 overflow-y-auto">
          <div>
            <h2 className="font-mono text-lg font-semibold text-chrono-text">
              {image.locationName}
            </h2>
            <p className="font-mono text-sm text-chrono-text-dim mt-2">
              {image.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-chrono-border">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-chrono-blue mt-1 flex-shrink-0" />
              <div>
                <p className="font-mono text-xs text-chrono-text-dim uppercase tracking-wider">
                  Coordinates
                </p>
                <p className="font-mono text-sm text-chrono-text">
                  {image.coordinates.spatial.latitude.toFixed(4)}°,{' '}
                  {image.coordinates.spatial.longitude.toFixed(4)}°
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-chrono-purple mt-1 flex-shrink-0" />
              <div>
                <p className="font-mono text-xs text-chrono-text-dim uppercase tracking-wider">
                  Date & Time
                </p>
                <p className="font-mono text-sm text-chrono-text">
                  {temporal.month}/{temporal.day}/{formatYear(temporal.year)}
                </p>
                <p className="font-mono text-sm text-chrono-text-dim">
                  {temporal.hour.toString().padStart(2, '0')}:
                  {temporal.minute.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onJumpTo}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded border border-chrono-blue bg-chrono-blue/10 text-chrono-blue hover:bg-chrono-blue/20 transition-colors font-mono text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Jump to Location
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageGallery({ isOpen, onClose }: ImageGalleryProps) {
  const { jumpToWaypoint } = useChronoscope();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [storageInfo, setStorageInfo] = useState<string>('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load images when modal opens
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const loadImages = async () => {
    setLoading(true);
    try {
      // Clean up any existing duplicates first
      const removed = await deduplicateGallery();
      if (removed > 0) {
        // Notify header to update count after removing duplicates
        window.dispatchEvent(new Event('galleryUpdated'));
      }

      const galleryImages = await getAllGalleryImages();
      setImages(galleryImages);
      const storage = await estimateStorageUsage();
      setStorageInfo(storage.formatted);
    } catch {
      // Failed to load gallery - will show empty state
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteGalleryImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
    const storage = await estimateStorageUsage();
    setStorageInfo(storage.formatted);
  };

  const handleClearAll = async () => {
    await clearGallery();
    setImages([]);
    setSelectedImage(null);
    setShowConfirmClear(false);
    setStorageInfo('0 B');
  };

  const handleJumpTo = (image: GalleryImage) => {
    jumpToWaypoint(image.coordinates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chrono-black/80 backdrop-blur-sm">
      <div className="panel-chrono max-w-5xl w-full max-h-[90vh] flex flex-col p-6">
        {selectedImage ? (
          <ImageViewer
            image={selectedImage}
            onBack={() => setSelectedImage(null)}
            onDelete={() => handleDelete(selectedImage.id)}
            onJumpTo={() => handleJumpTo(selectedImage)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-chrono-border pb-4 mb-4">
              <div className="flex items-center gap-3">
                <Images className="w-6 h-6 text-chrono-green" />
                <h2 className="font-mono text-lg text-chrono-green uppercase tracking-wider">
                  Image Gallery
                </h2>
                {images.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-chrono-green/20 text-chrono-green">
                    {images.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-chrono-text-dim hover:text-chrono-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Storage info */}
            {images.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-chrono-text-dim">
                <HardDrive className="w-4 h-4" />
                <span className="font-mono text-xs">
                  Storage used: {storageInfo}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-2 border-chrono-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-16">
                  <Images className="w-16 h-16 text-chrono-text-dim mx-auto mb-4 opacity-30" />
                  <p className="font-mono text-sm text-chrono-text-dim">
                    No images saved yet.
                  </p>
                  <p className="font-mono text-xs text-chrono-text-dim mt-2">
                    Generate an image from a rendered scene to add it here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onView={() => setSelectedImage(image)}
                      onDelete={() => handleDelete(image.id)}
                      onDownload={() => downloadImage(image)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {images.length > 0 && (
              <div className="pt-4 border-t border-chrono-border mt-4">
                {showConfirmClear ? (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono rounded border border-chrono-red bg-chrono-red/20 text-chrono-red hover:bg-chrono-red/30 transition-colors"
                    >
                      Confirm Clear All
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono rounded border border-chrono-border text-chrono-text-dim hover:border-chrono-text-dim transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono rounded border border-chrono-border text-chrono-text-dim hover:border-chrono-red/50 hover:text-chrono-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Images
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
