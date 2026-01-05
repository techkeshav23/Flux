'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'flux_scan_history';
const MAX_HISTORY_ITEMS = 50;

export function useScanHistory() {
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load scan history:', error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Add a new scan to history
  const addScan = useCallback((scanData) => {
    const newScan = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      displayTime: getRelativeTime(new Date()),
      ...scanData,
    };

    setHistory((prev) => {
      const updated = [newScan, ...prev].slice(0, MAX_HISTORY_ITEMS);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    return newScan;
  }, []);

  // Remove a scan from history
  const removeScan = useCallback((scanId) => {
    setHistory((prev) => {
      const updated = prev.filter((scan) => scan.id !== scanId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHistory([]);
  }, []);

  // Get a specific scan by ID
  const getScanById = useCallback((scanId) => {
    return history.find((scan) => scan.id === scanId);
  }, [history]);

  // Get history stats
  const getStats = useCallback(() => {
    const total = history.length;
    const safe = history.filter((s) => s.verdict === 'Safe').length;
    const caution = history.filter((s) => s.verdict === 'Caution').length;
    const avoid = history.filter((s) => s.verdict === 'Avoid').length;
    
    return { total, safe, caution, avoid };
  }, [history]);

  // Update display times (call periodically if needed)
  const refreshDisplayTimes = useCallback(() => {
    setHistory((prev) => 
      prev.map((scan) => ({
        ...scan,
        displayTime: getRelativeTime(new Date(scan.timestamp)),
      }))
    );
  }, []);

  return {
    history,
    isLoaded,
    addScan,
    removeScan,
    clearHistory,
    getScanById,
    getStats,
    refreshDisplayTimes,
  };
}

// Helper to format relative time
function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export default useScanHistory;
