import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusTab from "./tabs/StatusTab";
import CategoriesTab from "./tabs/CategoriesTab";
import KeywordTab from "./tabs/KeywordTab";
import LocationTab from "./tabs/LocationTab";
import PublishedDateTab from "./tabs/PublishedDateTab";
import ClosingDateTab from "./tabs/ClosingDateTab";
import SolicitationTypeTab from "./tabs/SolicitationTypeTab";
import UNSPSCCode from "./tabs/UNSPSCCode";
import NAICSCode from "./tabs/NAICSCode";
import SavedSearchForm from "./tabs/SavedSearchForm";
import { buildQueryString } from "../utils/buildQueryString";
import {
  createSavedSearch,
  getSavedSearches,
  updateSavedSearch,
} from "../services/bid.service";
import { addSavedSearch } from "../redux/reducer/savedSearchesSlice";
import { useDispatch, useSelector } from "react-redux";
import { parseFiltersFromURL } from "../utils/parseFiltersFromURL";

const tabs = [
  "Saved Searches",
  "Status",
  "Keyword",
  "Location",
  // "NAICS Code",
  "UNSPSC Code",
  "Published Date",
  "Closing Date",
  "Solicitation Type",
];

const FilterPanelSaveSearch = ({ onClose, selectedSearch, setSelectedSearch, handleSavedSearchSelect }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // ✅ ADD: States for SavedSearchForm to manage in parent
  const [searchOption, setSearchOption] = useState(selectedSearch ? "replace" : "create");
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(selectedSearch?.id || "");
  const [defaultSearch, setDefaultSearch] = useState(false);
  const [searchName, setSearchName] = useState(""); // <-- NEW

  const [filters, setFilters] = useState({
    status: "",
    keyword: {
      include: [],
      exclude: [],
    },
    location: [],
    NAICSCode: [],
    UNSPSCCode: [],
    solicitationType: [],
    publishedDate: {
      type: "",
      within: "",
      date: "",
      from: "",
      to: "",
      after: "",
      before: "",
    },
    closingDate: {
      type: "",
      within: "",
      date: "",
      from: "",
      to: "",
      after: "",
      before: "",
    },
  });

  const [savedSearch, setSavedSearch] = useState({
    name: "",
    query_string: "",
  });
  const [showValidation, setShowValidation] = useState(false);
  const [errors, setErrors] = useState({ name: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedSearches = useSelector(
    (state) => state.savedSearches.savedSearches
  );

  // ✅ ADD: useEffect to sync states when selectedSearch changes
  useEffect(() => {
    console.log("🔍 FilterPanelSaveSearch useEffect - selectedSearch:", selectedSearch);

    if (selectedSearch && selectedSearch.id) {
      console.log("✅ Setting up replace mode for selectedSearch:", selectedSearch.name);

      setSearchOption("replace");
      setSelectedSavedSearch(selectedSearch);
      setSavedSearch(prev => ({
        ...prev,
        name: selectedSearch.name,
        id: selectedSearch.id,
      }));

      // ✅ Clear any existing errors
      setErrors({ name: "" });
    } else {
      console.log("✅ Setting up create mode - no selectedSearch");

      setSearchOption("create");
      setSelectedSavedSearch("");
      setSavedSearch(prev => ({
        ...prev,
        name: "",
        id: null,
      }));
    }
  }, [selectedSearch]);




  // ✅ IMPROVED: Enhanced validation function
  const validateSaveSearch = () => {
    console.log("🔍 validateSaveSearch - searchOption:", searchOption);
    console.log("🔍 validateSaveSearch - selectedSavedSearch:", selectedSavedSearch);
    console.log("🔍 validateSaveSearch - savedSearch:", savedSearch);

    // ✅ FIXED: Only validate name for CREATE mode
    if (searchOption === "create") {
      const trimmedName = savedSearch.name.trim();

      if (!trimmedName) {
        return "Please enter a unique name for this search.";
      }

      // Check for duplicates only in create mode
      const isDuplicate = savedSearches.some(
        (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        return "A saved search with this name already exists.";
      }
    }

    // ✅ FIXED: Only validate selection for REPLACE mode
    if (searchOption === "replace") {
      // ✅ Check both selectedSavedSearch and savedSearch for ID
      const hasValidSelection = (selectedSavedSearch?.id) || (savedSearch?.id);

      if (!hasValidSelection) {
        console.log("❌ No valid selection for replace mode");
        return "Please select a saved search to replace.";
      }

      console.log("✅ Valid selection found for replace mode");
    }

    // ✅ Check if any filters are applied (for both modes)
    const hasFilters = Object.values(filters).some(filter => {
      if (typeof filter === 'string') return filter.trim() !== '';
      if (Array.isArray(filter)) return filter.length > 0;
      if (typeof filter === 'object' && filter !== null) {
        return Object.values(filter).some(val => {
          if (Array.isArray(val)) return val.length > 0;
          if (val && typeof val === 'string') return val.trim() !== '';
          return !!val;
        });
      }
      return false;
    });

    if (!hasFilters) {
      return "Please apply at least one filter before saving the search.";
    }

    return null; // No errors
  };


  const handleSaveSearch = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    // Clear previous errors
    setErrors({ name: "" });

    // ✅ IMPROVED: Use validation function
    const validationError = validateSaveSearch();
    if (validationError) {
      setErrors({ name: validationError });
      return;
    }

    try {
      const filtersWithOrdering = {
        ...filters,
        ordering: filters.ordering || "closing_date"
      };
      const queryString = buildQueryString(filtersWithOrdering);

      let savedSearchData;
      let newSearch;

      if (searchOption === "replace" && selectedSavedSearch?.id) {
        // ✅ REPLACE MODE: Update existing search
        savedSearchData = {
          name: selectedSavedSearch.name, // Use existing name
          query_string: `?${queryString}`,
        };

        await updateSavedSearch(selectedSavedSearch.id, savedSearchData);

        // ✅ Create proper search object for navigation
        newSearch = {
          id: selectedSavedSearch.id,
          name: selectedSavedSearch.name,
          query_string: `?${queryString}`
        };

      } else {
        // ✅ CREATE MODE: Create new search
        savedSearchData = {
          name: savedSearch.name.trim(),
          query_string: `?${queryString}`,
        };

        newSearch = await createSavedSearch(savedSearchData);
      }

      // ✅ Refresh saved searches list
      const updatedSearches = await getSavedSearches();
      dispatch(addSavedSearch(updatedSearches));

      // ✅ CRITICAL: Set the selected search in parent component BEFORE navigation
      if (newSearch) {
        console.log("🚀 Setting selected search before navigation:", newSearch);
        setSelectedSearch(newSearch);
      }

      // ✅ Navigate with proper URL structure
      let queryStringForNav = newSearch.query_string.startsWith('?')
        ? newSearch.query_string.substring(1)
        : newSearch.query_string;

      const urlParamsForNav = new URLSearchParams(queryStringForNav);
      if (!urlParamsForNav.has('ordering')) {
        urlParamsForNav.set('ordering', 'closing_date');
      }
      urlParamsForNav.set('page', '1');
      urlParamsForNav.set('pageSize', '25');

      // ✅ MOST IMPORTANT: Add the ID parameter for dashboard to recognize
      urlParamsForNav.set('id', newSearch.id);

      const finalURL = `/dashboard?${urlParamsForNav.toString()}`;
      console.log("🚀 Navigating to:", finalURL);

      navigate(finalURL, { replace: true });
      onClose(); // Close the panel

      handleSavedSearchSelect(newSearch.id)



    } catch (error) {
      // Error handling...
      if (error.response?.status === 409) {
        setErrors({ name: "A saved search with this name already exists." });
      } else if (error.response?.data?.message) {
        setErrors({ name: error.response.data.message });
      } else {
        setErrors({ name: "An error occurred while saving the search. Please try again." });
      }
      console.error("Save failed:", error);
    }
  };


  // ✅ IMPROVED: Enhanced tab validation
  const handleTabClick = (tab) => {
    console.log("🔍 handleTabClick - tab:", tab);
    console.log("🔍 handleTabClick - searchOption:", searchOption);
    console.log("🔍 handleTabClick - selectedSavedSearch:", selectedSavedSearch);
    console.log("🔍 handleTabClick - savedSearch:", savedSearch);

    if (tab === "Saved Searches") {
      setActiveTab(tab);
      return;
    }

    // ✅ FIXED: Only validate based on current mode
    if (searchOption === "create") {
      const trimmedName = savedSearch.name.trim();
      if (!trimmedName) {
        setErrors({ name: "Please enter a name before applying filters." });
        setShowValidation(true);
        return;
      }
    } else if (searchOption === "replace") {
      // ✅ FIXED: Check both sources for valid selection
      const hasValidSelection = (selectedSavedSearch?.id) || (savedSearch?.id);

      if (!hasValidSelection) {
        console.log("❌ Tab validation failed - no valid selection");
        setErrors({ name: "Please select a saved search to replace before applying filters." });
        setShowValidation(true);
        return;
      }

      console.log("✅ Tab validation passed - valid selection found");
    }

    // Clear errors if validation passes
    setErrors({ name: "" });
    setActiveTab(tab);
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "Saved Searches":
        return (
          <SavedSearchForm
            handleSavedSearchSelect={handleSavedSearchSelect} // ✅ ADD: Pass the handler
            // ✅ PASS: New props for state management
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            selectedSavedSearch={selectedSavedSearch}
            setSelectedSavedSearch={setSelectedSavedSearch}
            defaultSearch={defaultSearch}
            setDefaultSearch={setDefaultSearch}
            searchName={searchName}
            setSearchName={setSearchName}
            // Existing props
            selectedSearch={selectedSearch}
            setSelectedSearch={setSelectedSearch} // ✅ ADD: Pass setSelectedSearch function
            savedSearch={savedSearch}
            setSavedSearch={setSavedSearch}
            setFilters={setFilters}
            filters={filters}
            errors={errors}
            setErrors={setErrors}
            showValidation={showValidation}
          />
        );
      case "Status":
        return <StatusTab filters={filters} setFilters={setFilters} />;
      case "NAICS Code":
        return <NAICSCode filters={filters} setFilters={setFilters} />;
      case "UNSPSC Code":
        return <UNSPSCCode filters={filters} setFilters={setFilters} />;
      case "Keyword":
        return <KeywordTab filters={filters} setFilters={setFilters} />;
      case "Location":
        return <LocationTab filters={filters} setFilters={setFilters} />;
      case "Published Date":
        return <PublishedDateTab filters={filters} setFilters={setFilters} />;
      case "Closing Date":
        return <ClosingDateTab filters={filters} setFilters={setFilters} />;
      case "Solicitation Type":
        return (
          <SolicitationTypeTab filters={filters} setFilters={setFilters} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[500] flex">
      {/* Sidebar */}
      <div className="w-[30%] bg-blue text-white p-10 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-end mb-8">
            <h1 className="font-archivo font-bold text-h3">Filter</h1>
            <button className="text-p font-inter" onClick={onClose}>
              Close ✕
            </button>
          </div>

          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`cursor-pointer pt-2 ${activeTab === tab ? "font-bold" : ""
                  }`}
              >
                <div className="flex justify-between items-center font-inter text-p font-medium">
                  <span>{tab}</span>
                  <span>{activeTab === tab ? "−" : "+"}</span>
                </div>
                <img src="line.png" className="mt-3" alt="divider" />
              </li>
            ))}
          </ul>
        </div>

        <button className="text-p underline font-inter text-right">
          Clear All
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white flex flex-col justify-between w-[70%]">
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}

          {/* Footer buttons */}
          <div className="flex gap-4 p-5 bg-white sticky bottom-0">
            <button
              type="button"
              className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl transition-all hover:bg-blue-700"
              onClick={handleSaveSearch}
            >
              Save Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelSaveSearch;