import { lazy } from 'react';

// Lazy load components for code splitting
export const LazyDashboardPage = lazy(() => import('../pages/DashboardPage'));
export const LazyPaymentsPage = lazy(() => import('../pages/PaymentsPage'));
export const LazySubscriptionsPage = lazy(() => import('../pages/SubscriptionsPage'));
export const LazySettlementPage = lazy(() => import('../pages/SettlementPage'));
export const LazyBridgePage = lazy(() => import('../pages/BridgePage'));

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      this.metrics.delete(label);
      return duration;
    }
    return 0;
  }

  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return fn().finally(() => {
      this.endTiming(label);
    });
  }
}

// Image optimization utilities
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  // In a real app, you might use a service like Cloudinary or ImageKit
  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    return `${src}?${params.toString()}`;
  }
  return src;
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};

// Virtual scrolling utilities
export const calculateVisibleItems = (
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  buffer: number = 5
) => {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
  
  return {
    start: Math.max(0, visibleStart - buffer),
    end: visibleEnd + buffer,
  };
};

// Memory management
export const cleanupResources = () => {
  // Clear any cached data that's no longer needed
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old-')) {
          caches.delete(name);
        }
      });
    });
  }
};

// Bundle analysis helper
export const logBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available at build time');
  }
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    try {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
        onCLS(console.log);
        onFCP(console.log);
        onLCP(console.log);
        onTTFB(console.log);
      }).catch(() => {
        // web-vitals not available, ignore
        console.warn('web-vitals package not available');
      });
    } catch (error) {
      console.warn('Failed to load web-vitals:', error);
    }
  }
};
