'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'flux_health_preferences';

const DEFAULT_PREFERENCES = {
  // Dietary restrictions
  dietary: {
    vegetarian: false,
    vegan: false,
    halal: false,
    kosher: false,
    glutenFree: false,
  },
  // Health conditions
  conditions: {
    diabetic: false,
    hypertension: false,
    heartDisease: false,
    pregnant: false,
    lactoseIntolerant: false,
    celiacDisease: false,
    kidneyDisease: false,
  },
  // Common allergies
  allergies: {
    nuts: false,
    peanuts: false,
    dairy: false,
    eggs: false,
    soy: false,
    wheat: false,
    fish: false,
    shellfish: false,
  },
  // Goals
  goals: {
    weightLoss: false,
    muscleGain: false,
    heartHealth: false,
    lowSodium: false,
    lowSugar: false,
    highProtein: false,
  },
  // Custom notes
  customNotes: '',
  // Profile info
  profile: {
    name: '',
    age: '',
  },
  // Onboarding completed
  hasCompletedOnboarding: false,
};

export function useHealthPreferences() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Merge with defaults to handle new fields
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...parsed,
            dietary: { ...DEFAULT_PREFERENCES.dietary, ...parsed.dietary },
            conditions: { ...DEFAULT_PREFERENCES.conditions, ...parsed.conditions },
            allergies: { ...DEFAULT_PREFERENCES.allergies, ...parsed.allergies },
            goals: { ...DEFAULT_PREFERENCES.goals, ...parsed.goals },
            profile: { ...DEFAULT_PREFERENCES.profile, ...parsed.profile },
          });
        }
      } catch (error) {
        console.error('Failed to load health preferences:', error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
        setPreferences(newPreferences);
      } catch (error) {
        console.error('Failed to save health preferences:', error);
      }
    }
  }, []);

  // Update a specific category
  const updateCategory = useCallback((category, key, value) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value,
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Update custom notes
  const updateCustomNotes = useCallback((notes) => {
    setPreferences((prev) => {
      const updated = { ...prev, customNotes: notes };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Update profile
  const updateProfile = useCallback((field, value) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        profile: { ...prev.profile, [field]: value },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Mark onboarding as complete
  const completeOnboarding = useCallback(() => {
    setPreferences((prev) => {
      const updated = { ...prev, hasCompletedOnboarding: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Reset all preferences
  const resetPreferences = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  // Get summary of active preferences for display
  const getActiveSummary = useCallback(() => {
    const active = [];
    
    Object.entries(preferences.dietary).forEach(([key, value]) => {
      if (value) active.push(formatLabel(key));
    });
    Object.entries(preferences.conditions).forEach(([key, value]) => {
      if (value) active.push(formatLabel(key));
    });
    Object.entries(preferences.allergies).forEach(([key, value]) => {
      if (value) active.push(`${formatLabel(key)} allergy`);
    });
    Object.entries(preferences.goals).forEach(([key, value]) => {
      if (value) active.push(formatLabel(key));
    });
    
    return active;
  }, [preferences]);

  // Convert preferences to a prompt-friendly string for AI
  const getPreferencesForPrompt = useCallback(() => {
    const parts = [];
    
    // Dietary
    const dietary = Object.entries(preferences.dietary)
      .filter(([_, v]) => v)
      .map(([k]) => formatLabel(k));
    if (dietary.length > 0) {
      parts.push(`Dietary: ${dietary.join(', ')}`);
    }
    
    // Health conditions
    const conditions = Object.entries(preferences.conditions)
      .filter(([_, v]) => v)
      .map(([k]) => formatLabel(k));
    if (conditions.length > 0) {
      parts.push(`Health conditions: ${conditions.join(', ')}`);
    }
    
    // Allergies
    const allergies = Object.entries(preferences.allergies)
      .filter(([_, v]) => v)
      .map(([k]) => formatLabel(k));
    if (allergies.length > 0) {
      parts.push(`Allergies: ${allergies.join(', ')}`);
    }
    
    // Goals
    const goals = Object.entries(preferences.goals)
      .filter(([_, v]) => v)
      .map(([k]) => formatLabel(k));
    if (goals.length > 0) {
      parts.push(`Health goals: ${goals.join(', ')}`);
    }
    
    // Custom notes
    if (preferences.customNotes.trim()) {
      parts.push(`Additional notes: ${preferences.customNotes}`);
    }
    
    // Age context
    if (preferences.profile.age) {
      parts.push(`Age: ${preferences.profile.age}`);
    }
    
    return parts.length > 0 ? parts.join('. ') : null;
  }, [preferences]);

  // Check if any preferences are set
  const hasAnyPreferences = useCallback(() => {
    return (
      Object.values(preferences.dietary).some(Boolean) ||
      Object.values(preferences.conditions).some(Boolean) ||
      Object.values(preferences.allergies).some(Boolean) ||
      Object.values(preferences.goals).some(Boolean) ||
      preferences.customNotes.trim().length > 0
    );
  }, [preferences]);

  return {
    preferences,
    isLoaded,
    savePreferences,
    updateCategory,
    updateCustomNotes,
    updateProfile,
    completeOnboarding,
    resetPreferences,
    getActiveSummary,
    getPreferencesForPrompt,
    hasAnyPreferences,
  };
}

// Helper to format camelCase to readable label
function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default useHealthPreferences;
