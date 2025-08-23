import React, { useEffect, useRef } from 'react';
import './AdsterraNativeBanner.css';

/**
 * Adsterra Native Banner
 * Issues previously:
 *  - Script appended to <head>, while original snippet expects the script tag to sit
 *    immediately before the container div. Some ad networks traverse siblings instead
 *    of querying by ID only, so placement mismatch can cause no fill.
 *  - Single hard‑coded container ID used multiple times; networks often only fill once.
 *  - Effect cleanup removed script during React 18 Strict Mode double-mount causing race.
 *  - Multiple placements on home page remained empty.
 * Fixes:
 *  - Inject script directly before the container inside the component wrapper.
 *  - Generate a unique container id per instance (still starts with official base id to keep compatibility).
 *  - Skip cleanup removal (harmless to keep script) to avoid dev double-unmount problems.
 *  - Basic load/error instrumentation for debugging.
 */
const AdsterraNativeBanner = ({ className = '', style = {}, placement = 'home-mid' }) => {
  const containerRef = useRef(null);
  const scriptInsertedRef = useRef(false);
  const uniqueIdRef = useRef(`container-1972ed0e1033ca27ce9a64591bb2e00c-${placement}-${Math.random().toString(36).slice(2,8)}`);

  useEffect(() => {
    if (!containerRef.current || scriptInsertedRef.current) return;

    // Create script exactly like original snippet (no atOptions needed for this code variant)
    const script = document.createElement('script');
    script.src = '//pl27486686.profitableratecpm.com/1972ed0e1033ca27ce9a64591bb2e00c/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.dataset.placement = placement;

    script.onload = () => {
      // Simple marker for debugging
      console.debug('[AdsterraNativeBanner] Loaded script for', uniqueIdRef.current);
    };
    script.onerror = () => {
      console.warn('[AdsterraNativeBanner] Failed to load script for', uniqueIdRef.current);
    };

    // Insert script right before the container so DOM order mimics original code
    const parent = containerRef.current.parentNode;
    if (parent) {
      parent.insertBefore(script, containerRef.current);
      scriptInsertedRef.current = true;
    }
  }, [placement]);

  return (
    <div className={`adsterra-native-banner ${className}`} style={style}>
      <div className="ad-label">Advertisement</div>
      <div
        id={uniqueIdRef.current}
        ref={containerRef}
        className="ad-container"
        aria-label="Sponsored content"
        role="complementary"
      />
    </div>
  );
};

export default AdsterraNativeBanner;
