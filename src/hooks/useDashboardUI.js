// src/hooks/useDashboardUI.js - Updated with restrictions support

import { useState } from 'react';
import { DASHBOARD_CONSTANTS } from '../utils/constants';

export const useDashboardUI = (restrictions = {}, showFeatureRestriction = null) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [saveSearchToggle, setSaveSearchToggle] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState(DASHBOARD_CONSTANTS.FILTER_TABS.DEFAULT);
  const [searchOption, setSearchOption] = useState("create");
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(null);
  const [saveSearchFilters, setSaveSearchFilters] = useState({});

  const handleOpenFilter = () => {
    // Check if advanced search is restricted
    if (restrictions?.advanceSearch && showFeatureRestriction) {
      showFeatureRestriction(
        "🔒 Advanced Search Locked",
        "Upgrade your plan to access advanced filtering options for better bid management.",
        "Advanced Search Feature",
        true
      );
      return;
    }

    setActiveFilterTab(DASHBOARD_CONSTANTS.FILTER_TABS.DEFAULT);
    setSidebarToggle(true);
  };

  const handleSaveSearchClick = () => {
    // Check if save search is restricted
    if (restrictions?.savedSearch && showFeatureRestriction) {
      showFeatureRestriction(
        "🔒 Save Search Locked",
        "Upgrade your plan to save your search filters and quickly access them later.",
        "Save Search Feature",
        true
      );
      return;
    }

    setSaveSearchToggle(true);
  };

  return {
    sidebarToggle,
    setSidebarToggle,
    saveSearchToggle,
    setSaveSearchToggle,
    activeFilterTab,
    setActiveFilterTab,
    searchOption,
    setSearchOption,
    selectedSavedSearch,
    setSelectedSavedSearch,
    saveSearchFilters,
    setSaveSearchFilters,
    handleOpenFilter,
    handleSaveSearchClick // New function for save search with restrictions
  };
};