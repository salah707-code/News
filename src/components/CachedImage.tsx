import React, { useState, useEffect } from 'react';
import { getCachedImageUrl } from '../utils/imageCache';
import { ImageIcon } from 'lucide-react';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  showSkeleton?: boolean;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  showSkeleton = true,
  ...props
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    if (!src) {
      setIsLoading(false);
      return;
    }

    getCachedImageUrl(src)
      .then((cachedUrl) => {
        if (isMounted) {
          setResolvedSrc(cachedUrl);
        }
      })
      .catch(() => {
        if (isMounted) {
          setResolvedSrc(src);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && resolvedSrc !== fallbackSrc) {
      setResolvedSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 p-4 ${className}`}>
        <ImageIcon className="w-8 h-8 mb-1.5 opacity-50" />
        <span className="text-[11px] font-medium text-center line-clamp-1">{alt || 'صورة الخبر'}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer loading skeleton */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-slate-200/80 dark:bg-slate-800 animate-pulse z-10 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-400/40 animate-bounce" />
        </div>
      )}
      <img
        {...props}
        src={resolvedSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
