"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

// Import nProgress CSS
import "nprogress/nprogress.css";

// Configure nProgress
NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: true,
});

export default function NProgressComponent() {
  const router = useRouter();

  useEffect(() => {
    // Start progress when navigation begins
    const handleStart = () => {
      NProgress.start();
    };

    // Stop progress when navigation completes
    const handleStop = () => {
      NProgress.done();
    };

    // Listen to router events
    router.prefetch("*");

    // Handle route changes via custom events (since useRouter doesn't directly expose events)
    const handleRouteChange = () => {
      NProgress.done();
    };

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleStop);

    // Also monitor for route changes through the page itself
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function (...args) {
      handleStart();
      const result = originalPush.apply(this, args);
      // Use setTimeout to ensure next tick execution
      setTimeout(handleRouteChange, 100);
      return result;
    };

    window.history.replaceState = function (...args) {
      handleStart();
      const result = originalReplace.apply(this, args);
      setTimeout(handleRouteChange, 100);
      return result;
    };

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleStop);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, [router]);

  return null;
}
