// src/hooks/useSearchHandling.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { buildQueryString } from '../utils/urlHelpers';
import { DASHBOARD_CONSTANTS } from '../utils/constants';

export const useSearchHandling = (appliedFilters, perPage, additionalCallbacks = {}) => {
  const [topSearchTerm, setTopSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure optional callbacks
  const {
    onSearchReset = () => {}, // Called when search resets filters
  } = additionalCallbacks;

  // Search term from URL effect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl && searchFromUrl.trim() !== "") {
      setTopSearchTerm(searchFromUrl);
    } else {
      setTopSearchTerm("");
    }
  }, [location.search]);

  // 🔥 ENHANCED: Real-time search function with default filter reset
  const handleTopSearch = useCallback((searchTerm) => {
    const cleanedTerm = searchTerm.trim();

    if (!cleanedTerm) {
      // 🔥 When search is cleared, use current applied filters
      const queryString = buildQueryString(appliedFilters, 1, perPage);
      navigate(`/dashboard?${queryString}`);
      return;
    }

    // 🔥 CRITICAL CHANGE: When searching, use DEFAULT filters instead of applied filters
    const defaultFilters = { 
      ...DASHBOARD_CONSTANTS.DEFAULT_FILTERS, 
      ordering: "closing_date" 
    };

    console.log("🔥 Search initiated with default filters:", defaultFilters);
    
    // Call the reset callback to update parent component state
    onSearchReset(defaultFilters);

    const queryString = buildQueryString(defaultFilters, 1, perPage);
    const params = new URLSearchParams(queryString);
    params.append("search", cleanedTerm);
    
    const finalQueryString = params.toString();
    navigate(`/dashboard?${finalQueryString}`);
  }, [appliedFilters, perPage, navigate, onSearchReset]);

  // Debounced search handler
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setTopSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      handleTopSearch(value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // 🔥 ENHANCED: Direct search handler for immediate execution (without debounce)
  const handleImmediateSearch = useCallback((searchValue) => {
    const cleanedTerm = searchValue.trim();

    if (!cleanedTerm) {
      // Reset to default state
      const defaultFilters = { 
        ...DASHBOARD_CONSTANTS.DEFAULT_FILTERS, 
        ordering: "closing_date" 
      };
      
      onSearchReset(defaultFilters);
      navigate("/dashboard?page=1&pageSize=25&bid_type=Active&ordering=closing_date");
      return;
    }

    // Search with default filters
    const defaultFilters = { 
      ...DASHBOARD_CONSTANTS.DEFAULT_FILTERS, 
      ordering: "closing_date" 
    };

    console.log("🔥 Immediate search with default filters:", defaultFilters);
    
    onSearchReset(defaultFilters);

    const queryString = buildQueryString(defaultFilters, 1, perPage);
    const params = new URLSearchParams(queryString);
    params.append("search", cleanedTerm);
    
    const finalQueryString = params.toString();
    navigate(`/dashboard?${finalQueryString}`);
  }, [perPage, navigate, onSearchReset]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    topSearchTerm,
    setTopSearchTerm,
    handleSearchInputChange,
    handleImmediateSearch // 🔥 New function for immediate search
  };
};