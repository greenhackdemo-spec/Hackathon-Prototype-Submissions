import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string | null;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. 'aspect-4/3' or 'aspect-square'
  minHeight?: string; // e.g. 'min-h-[140px]'
  showBorder?: boolean;
  padding?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-4/3',
  minHeight = 'min-h-[140px]',
  showBorder = true,
  padding = 'p-2',
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || null);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error'
  );

  useEffect(() => {
    setCurrentSrc(src || null);
    setHasTriedFallback(false);
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  const handleError = () => {
    if (!hasTriedFallback && fallbackSrc && fallbackSrc !== currentSrc) {
      setHasTriedFallback(true);
      setCurrentSrc(fallbackSrc);
      setStatus('loading');
    } else {
      setStatus('error');
    }
  };

  const handleLoad = () => {
    setStatus('loaded');
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} ${minHeight} bg-slate-50 flex items-center justify-center overflow-hidden rounded-xl ${
        showBorder ? 'border border-slate-200/80' : ''
      } ${containerClassName}`}
    >
      {/* Subtle Loading Skeleton */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-8 h-8 rounded-lg bg-slate-200" />
          <div className="w-20 h-2 rounded bg-slate-200" />
        </div>
      )}

      {/* Actual Image */}
      {status !== 'error' && currentSrc ? (
        <img
          src={currentSrc}
          alt={alt || 'Product packaging'}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-contain ${padding} transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        /* Polished Unavailable Placeholder */
        <div className="flex flex-col items-center justify-center text-center p-4 gap-2 text-slate-400 select-none w-full h-full bg-slate-50">
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400">
            <Package className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-[11px] sm:text-xs font-medium text-slate-500 max-w-[140px] leading-tight">
            Product image unavailable
          </span>
        </div>
      )}
    </div>
  );
};
