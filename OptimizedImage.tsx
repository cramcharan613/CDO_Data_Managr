import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
  quality?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  sizes?: string;
  srcSet?: string;
}

interface ImageState {
  loaded: boolean;
  error: boolean;
  inView: boolean;
  src: string;
}

const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjEwMCIgeT0iMTAwIiBzdHlsZT0iZmlsbDojY2NjO2ZvbnQtc2l6ZToxNHB4O2ZvbnQtZmFtaWx5OkFyaWFsLCBoZWx2ZXRpY2EsIHNhbnMtc2VyaWYiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjEwMCIgeT0iMTAwIiBzdHlsZT0iZmlsbDojY2NjO2ZvbnQtc2l6ZToxNHB4O2ZvbnQtZmFtaWx5OkFyaWFsLCBoZWx2ZXRpY2EsIHNhbnMtc2VyaWYiPkVycm9yPC90ZXh0Pjwvc3ZnPg==',
  quality = 75,
  priority = false,
  onLoad,
  onError,
  sizes,
  srcSet
}) => {
  const [imageState, setImageState] = useState<ImageState>({
    loaded: false,
    error: false,
    inView: false,
    src: placeholder
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { markStart, markEnd } = usePerformanceMonitor('OptimizedImage');

  const handleLoad = useCallback(() => {
    markStart('image-load');
    setImageState(prev => ({ ...prev, loaded: true }));
    markEnd('image-load', 1000);
    onLoad?.();
  }, [markStart, markEnd, onLoad]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    markStart('image-error');
    const error = new Error('Failed to load image');
    setImageState(prev => ({ ...prev, error: true, src: fallback }));
    markEnd('image-error', 100);
    onError?.(error);
  }, [fallback, markStart, markEnd, onError]);

  const loadImage = useCallback(() => {
    if (imageState.loaded || imageState.error) return;

    markStart('image-fetch');
    const optimizedSrc = generateOptimizedImageUrl(src, { width, height, quality });
    setImageState(prev => ({ ...prev, src: optimizedSrc }));
    markEnd('image-fetch', 500);
  }, [src, width, height, quality, imageState.loaded, imageState.error, markStart, markEnd]);

  useEffect(() => {
    if (!lazy || priority) {
      loadImage();
      return;
    }

    if (imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setImageState(prev => ({ ...prev, inView: true }));
            loadImage();
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '50px'
        }
      );

      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, priority, loadImage]);

  const generateOptimizedImageUrl = (originalSrc: string, options: {
    width?: number;
    height?: number;
    quality?: number;
  }): string => {
    // Simple optimization URL generator
    // In a real app, this would integrate with image CDN services like Cloudinary, Imgix, etc.
    const url = new URL(originalSrc, window.location.origin);
    
    if (options.width) {
      url.searchParams.set('w', options.width.toString());
    }
    if (options.height) {
      url.searchParams.set('h', options.height.toString());
    }
    if (options.quality) {
      url.searchParams.set('q', options.quality.toString());
    }
    
    return url.toString();
  };

  const getImageClasses = () => {
    const baseClasses = 'transition-opacity duration-300 ease-in-out';
    const loadingClasses = imageState.loaded ? 'opacity-100' : 'opacity-0';
    const errorClasses = imageState.error ? 'bg-gray-200' : '';
    
    return `${baseClasses} ${loadingClasses} ${errorClasses} ${className}`;
  };

  return (
    <div className="relative overflow-hidden">
      <img
        ref={imgRef}
        src={imageState.src}
        alt={alt}
        width={width}
        height={height}
        className={getImageClasses()}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        decoding="async"
        sizes={sizes}
        srcSet={srcSet}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : 'auto'
        }}
      />
      
      {/* Loading indicator */}
      {!imageState.loaded && !imageState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state */}
      {imageState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Progressive image loading component
export const ProgressiveImage = memo<OptimizedImageProps & { 
  lowQualitySrc?: string; 
}>(({ lowQualitySrc, ...props }) => {
  const [highQualityLoaded, setHighQualityLoaded] = useState(false);
  const { markStart, markEnd } = usePerformanceMonitor('ProgressiveImage');

  const handleHighQualityLoad = useCallback(() => {
    markStart('progressive-load');
    setHighQualityLoaded(true);
    markEnd('progressive-load', 2000);
    props.onLoad?.();
  }, [markStart, markEnd, props.onLoad]);

  return (
    <div className="relative">
      {/* Low quality placeholder */}
      {lowQualitySrc && !highQualityLoaded && (
        <OptimizedImage
          {...props}
          src={lowQualitySrc}
          className={`${props.className} absolute inset-0 filter blur-sm scale-105`}
          quality={20}
          lazy={false}
        />
      )}
      
      {/* High quality image */}
      <OptimizedImage
        {...props}
        onLoad={handleHighQualityLoad}
        className={`${props.className} ${highQualityLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      />
    </div>
  );
});

ProgressiveImage.displayName = 'ProgressiveImage';

// Image gallery component with lazy loading
export const ImageGallery = memo<{
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  }>;
  columns?: number;
  className?: string;
}>(({ images, columns = 3, className = '' }) => {
  const { markStart, markEnd } = usePerformanceMonitor('ImageGallery');

  useEffect(() => {
    markStart('gallery-render');
    return () => {
      markEnd('gallery-render', 1000);
    };
  }, [markStart, markEnd]);

  return (
    <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="w-full h-auto rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
            lazy={index > 6} // Load first 6 images immediately
            quality={85}
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';

// Hero image component with optimizations
export const HeroImage = memo<OptimizedImageProps & {
  overlay?: boolean;
  overlayColor?: string;
  children?: React.ReactNode;
}>(({ overlay = false, overlayColor = 'rgba(0, 0, 0, 0.4)', children, ...props }) => {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      <OptimizedImage
        {...props}
        className={`w-full h-full object-cover ${props.className}`}
        priority={true}
        quality={90}
      />
      
      {overlay && (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      )}
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            {children}
          </div>
        </div>
      )}
    </div>
  );
});

HeroImage.displayName = 'HeroImage';

export default OptimizedImage;