// src/hooks/useFilterHandling.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decodeUrlToFilters, buildQueryString } from '../utils/urlHelpers';
import { DASHBOARD_CONSTANTS } from '../utils/constants';

export const useFilterHandling = (perPage) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState({ ...DASHBOARD_CONSTANTS.DEFAULT_FILTERS });
  const [appliedFilters, setAppliedFilters] = useState(DASHBOARD_CONSTANTS.DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // URL decode effect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const hasFilterParams =
      searchParams.get("bid_type") ||
      searchParams.get("state") ||
      searchParams.get("local") ||           // 🔥 ADD: local param check
      searchParams.get("entity_type") ||
      searchParams.getAll("entity_type").length > 0 || // 🔥 ADD: entity_type param check
      searchParams.get("solicitation") ||
      searchParams.get("include") ||
      searchParams.get("exclude") ||
      searchParams.get("unspsc_codes") ||
      searchParams.get("naics_codes") ||
      searchParams.get("open_date_after") ||
      searchParams.get("open_date_before") ||
      searchParams.get("closing_date_after") ||
      searchParams.get("closing_date_before") ||
      searchParams.get("ordering");

    if (isInitialLoad) {
      if (hasFilterParams) {
        // URL has filters - restore them
        const decodedFilters = decodeUrlToFilters(searchParams);
        console.log("🔥 Restoring filters from URL:", decodedFilters);
        setFilters(decodedFilters);
        setAppliedFilters(decodedFilters);
      } else {
        setFilters(DASHBOARD_CONSTANTS.DEFAULT_FILTERS);
        setAppliedFilters(DASHBOARD_CONSTANTS.DEFAULT_FILTERS);
        navigate("/dashboard?page=1&pageSize=25&bid_type=Active&ordering=closing_date", {
          replace: true,
        });
      }
      setIsInitialLoad(false);
    } else if (hasFilterParams) {
      // Subsequent navigation with filters - restore them
      const decodedFilters = decodeUrlToFilters(searchParams);
      setFilters(decodedFilters);
      setAppliedFilters(decodedFilters);
    }
  }, [location.search, navigate, isInitialLoad]);

  // Filter apply handler
  // Filter apply handler - FIXED VERSION
  const handleFiltersApply = useCallback((newFilters) => {
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setCurrentPage(1);

    // 🔥 PRESERVE search term from current URL
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search");
    const savedSearchId = searchParams.get("id");

    const queryString = buildQueryString(newFilters, 1, perPage);

    // 🔥 Build final URL with preserved parameters
    let finalURL = `/dashboard?${queryString}`;

    const additionalParams = new URLSearchParams();

    if (savedSearchId) {
      additionalParams.set("id", savedSearchId);
    }

    if (searchTerm) {
      additionalParams.set("search", searchTerm);
    }

    if (additionalParams.toString()) {
      finalURL += `&${additionalParams.toString()}`;
    }

    navigate(finalURL);
  }, [navigate, perPage, location.search]);

  // Sort handler - 🔥 FIXED: Preserve existing URL parameters including search term
  const handleSort = useCallback((field) => {
    const searchParams = new URLSearchParams(location.search);

    // Get current ordering from URL or appliedFilters
    const currentOrdering = searchParams.get("ordering") || appliedFilters.ordering;

    // Determine new ordering
    let newOrder;
    if (currentOrdering === field) {
      newOrder = `-${field}`;
    } else if (currentOrdering === `-${field}`) {
      newOrder = field;
    } else {
      newOrder = field;
    }

    // Create updated filters by preserving current appliedFilters and only changing ordering
    const updatedFilters = {
      ...appliedFilters,  // This preserves entityType and all other filters
      ordering: newOrder
    };

    // Update state
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);

    // Build query string with all preserved filters
    const queryString = buildQueryString(updatedFilters, currentPage, perPage);

    // 🔥 Preserve saved search ID and search term if they exist
    const savedSearchId = searchParams.get("id");
    const searchTerm = searchParams.get("search");

    let finalURL = `/dashboard?${queryString}`;

    // Add preserved parameters
    const additionalParams = new URLSearchParams();
    if (savedSearchId) {
      additionalParams.set("id", savedSearchId);
    }
    if (searchTerm) {
      additionalParams.set("search", searchTerm);
    }

    if (additionalParams.toString()) {
      finalURL += `&${additionalParams.toString()}`;
    }

    navigate(finalURL);
  }, [location.search, appliedFilters, currentPage, perPage, navigate]);

  return {
    filters,
    setFilters,
    appliedFilters,
    setAppliedFilters,
    currentPage,
    setCurrentPage,
    isInitialLoad,
    handleFiltersApply,
    handleSort
  };
};