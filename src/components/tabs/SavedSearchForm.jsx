import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfessionalSavedSearchDropdown from "../ProfessionalSavedSearchDropdown"; // Import the dropdown component

const SavedSearchForm = ({
  searchOption,
  setSearchOption,
  selectedSavedSearch,
  setSelectedSavedSearch,
  defaultSearch,
  setDefaultSearch,
  searchName,
  setSearchName,
  savedSearch,
  setSavedSearch,
  selectedSearch,
  setSelectedSearch, // ✅ ADD: Function to clear selectedSearch in parent
  filters,
  setFilters,
  showValidation,
  errors,
  setErrors,
  handleSavedSearchSelect
}) => {
  const { savedSearches } = useSelector((state) => state.savedSearches);

  // Custom styling for SavedSearchForm dropdown
  const customDropdownStyling = {
    trigger: "w-86 bg-white p-4 px-6 rounded-lg border border-black font-inter font-medium cursor-pointer select-none flex items-center justify-between min-w-[200px]",
    triggerText: "text-black",
    triggerIcon: "text-black"
  };




  // const decodeQueryStringToFilters = (queryString) => {
  //   const clean = queryString.startsWith("?") ? queryString.substring(1) : queryString;
  //   const params = new URLSearchParams(clean);

  //   const filters = {
  //     status: "",
  //     keyword: { include: [], exclude: [] },
  //     location: [],
  //     UNSPSCCode: [],
  //     solicitationType: [],
  //     NAICSCode: [],
  //     publishedDate: {},
  //     closingDate: {},
  //   };

  //   if (params.get("bid_type")) filters.status = params.get("bid_type");
  //   if (params.get("state")) filters.location = params.get("state").split(",");
  //   if (params.get("solicitation")) filters.solicitationType = params.get("solicitation").split(",");
  //   if (params.get("include")) filters.keyword.include = params.get("include").split(",");
  //   if (params.get("exclude")) filters.keyword.exclude = params.get("exclude").split(",");
  //   if (params.get("unspsc_codes")) filters.UNSPSCCode = params.get("unspsc_codes").split(",").map((code) => ({ code }));
  //   if (params.get("naics_codes")) filters.NAICSCode = params.get("naics_codes").split(",").map((code) => ({ code }));
  //   if (params.get("open_date_after")) filters.publishedDate.after = params.get("open_date_after");
  //   if (params.get("open_date_before")) filters.publishedDate.before = params.get("open_date_before");
  //   if (params.get("closing_date_after")) filters.closingDate.after = params.get("closing_date_after");
  //   if (params.get("closing_date_before")) filters.closingDate.before = params.get("closing_date_before");

  //   return filters;
  // };


  // SavedSearchForm.js में इस function को replace करें:

  const decodeQueryStringToFilters = (queryString) => {
    const clean = queryString.startsWith("?") ? queryString.substring(1) : queryString;
    const params = new URLSearchParams(clean);

    const splitOrEmptyArray = (value = "") =>
      value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

    // 🔥 FIXED: Properly parse location structure
    const parseLocationFromQuery = () => {
      const entityTypes = splitOrEmptyArray(params.get("entity_type"));
      const statesList = splitOrEmptyArray(params.get("state"));
      const localList = splitOrEmptyArray(params.get("local"));

      console.log("Parsing saved search location:");
      console.log("- entity_type:", params.get("entity_type"), "->", entityTypes);
      console.log("- state:", params.get("state"), "->", statesList);
      console.log("- local:", params.get("local"), "->", localList);

      // Return new location structure
      const locationResult = {
        federal: entityTypes.includes('Federal'),
        states: statesList,
        local: localList
      };

      console.log("- Final location result:", locationResult);
      return locationResult;
    };

    const filters = {
      status: params.get("bid_type") || "",
      keyword: {
        include: splitOrEmptyArray(params.get("include")),
        exclude: splitOrEmptyArray(params.get("exclude"))
      },

      // 🔥 FIXED: Use proper location structure
      location: parseLocationFromQuery(),

      UNSPSCCode: splitOrEmptyArray(params.get("unspsc_codes")).map((code) => ({ code })),
      solicitationType: splitOrEmptyArray(params.get("solicitation")),
      NAICSCode: splitOrEmptyArray(params.get("naics_codes")).map((code) => ({ code })),

      publishedDate: {
        type: "",
        within: "",
        date: "",
        from: params.get("open_date_after") || "",
        to: params.get("open_date_before") || "",
        after: params.get("open_date_after") || "",
        before: params.get("open_date_before") || "",
      },

      closingDate: {
        type: "",
        within: "",
        date: "",
        from: params.get("closing_date_after") || "",
        to: params.get("closing_date_before") || "",
        after: params.get("closing_date_after") || "",
        before: params.get("closing_date_before") || "",
      },
    };

    console.log("Decoded filters:", filters);
    return filters;
  };




  useEffect(() => {
    console.log("🔍 SavedSearchForm useEffect - selectedSearch:", selectedSearch);
    console.log("🔍 SavedSearchForm useEffect - searchOption:", searchOption);

    // ✅ CRITICAL FIX: Dashboard से आने पर replace mode set करना चाहिए
    if (selectedSearch && selectedSearch.id) {
      console.log("✅ Setting replace mode because selectedSearch exists:", selectedSearch.name);

      // ✅ Set replace mode automatically when coming from dashboard
      setSearchOption("replace");

      // ✅ Set the selected saved search properly
      setSelectedSavedSearch(selectedSearch);
      setSearchName(selectedSearch.name);
      setSavedSearch((prev) => ({
        ...prev,
        name: selectedSearch.name,
        id: selectedSearch.id,
      }));

      // ✅ Load filters from the selected search
      const savedSearchObj = savedSearches.find((s) => s.id === selectedSearch.id);
      if (savedSearchObj?.query_string) {
        setFilters(decodeQueryStringToFilters(savedSearchObj.query_string));
      }

      // ✅ Clear any validation errors
      setErrors({ name: "" });
    }
  }, [selectedSearch, savedSearches, setFilters, setSavedSearch, setSearchOption, setSelectedSavedSearch, setSearchName, setErrors]);




  const handleCreateOption = () => {
    setSearchOption("create");
    setSelectedSavedSearch("");
    setSearchName("");
    setSavedSearch((prev) => ({
      ...prev,
      name: "",
      id: null,
    }));
    setErrors({ name: "" });

    // ✅ Reset filters when switching from Replace to Create
    setFilters({
      status: "",
      keyword: { include: [], exclude: [] },
      location: [],
      UNSPSCCode: [],
      solicitationType: [],
      NAICSCode: [],
      publishedDate: {},
      closingDate: {},
    });

    // ✅ Clear the selectedSearch in parent component
    if (setSelectedSearch) {
      setSelectedSearch(null);
      console.log("🧹 Cleared selectedSearch in parent component");
    }
  };




  const handleReplaceOption = () => {
    setSearchOption("replace");
    setSearchName("");
    setSelectedSavedSearch("");
    setSavedSearch((prev) => ({
      ...prev,
      name: "",
      id: null,
    }));
    setErrors({ name: "" });

    // ✅ Do not reset filters here; filters will load only when a saved search is selected
  };




  const handleOnChangeInput = (e) => {
    const { value } = e.target;
    const trimmed = value.trim();
    setSearchName(value);
    setSelectedSavedSearch(value);
    setSavedSearch((prev) => ({
      ...prev,
      name: value,
    }));

    if (!trimmed) {
      setErrors({ name: "This field is required" });
    } else if (
      searchOption === "create" &&
      savedSearches.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setErrors({ name: "Search name already exists" });
    } else {
      setErrors({ name: "" });
    }

    setSavedSearch((prev) => ({
      ...prev,
      name: value,
      id: searchOption === "replace" ? selectedSavedSearch : null,
    }));
  };




  // Handle dropdown selection from ProfessionalSavedSearchDropdown
  //  const handleSavedSearchSelect = (searchId) => {
  //   console.log("🔍 SavedSearchForm handleSavedSearchSelect - searchId:", searchId);

  //   // If user selects "back to dashboard" or default
  //   if (searchId === "_default_" || !searchId) {
  //     setSelectedSavedSearch("");
  //     // ✅ FIXED: Only show error if in replace mode and user is trying to proceed
  //     if (searchOption === "replace") {
  //       setErrors({ name: "Please select a saved search to replace" });
  //     }
  //     setSearchName("");
  //     setSavedSearch((prev) => ({
  //       ...prev,
  //       name: "",
  //       id: null,
  //     }));

  //     // ✅ Also clear parent selection
  //     if (setSelectedSearch) {
  //       setSelectedSearch(null);
  //     }
  //     return;
  //   }

  //   // Find the selected search
  //   const selected = savedSearches.find((s) => s.id === searchId);
  //   if (selected) {
  //     console.log("✅ Found selected search in dropdown:", selected.name);

  //     // ✅ Create proper object and set in all relevant states
  //     const searchObject = {
  //       id: selected.id,
  //       name: selected.name,
  //       query_string: selected.query_string
  //     };

  //     setSelectedSavedSearch(searchObject);
  //     setSearchName(selected.name);
  //     setSavedSearch((prev) => ({
  //       ...prev,
  //       name: selected.name,
  //       id: searchId,
  //     }));

  //     // ✅ Also inform parent component if setSelectedSearch is available
  //     if (setSelectedSearch) {
  //       setSelectedSearch(searchObject);
  //       console.log("✅ Informed parent component of selection");
  //     }

  //     // Load filters if available
  //     if (selected.query_string) {
  //       setFilters(decodeQueryStringToFilters(selected.query_string));
  //     }

  //     // ✅ Clear errors when valid selection is made
  //     setErrors({ name: "" });
  //   }
  // };

  return (
    <form className="min-h-screen flex flex-col justify-between p-10 bg-white">
      <div>
        <h2 className="font-medium mb-4 font-inter text-p">Search</h2>

        {/* Radio Buttons */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="searchOption"
              value="create"
              className="accent-blue-600"
              checked={searchOption === "create"}
              onChange={handleCreateOption}
            />
            <span className="font-inter text-[22px]">Create a new saved search</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="searchOption"
              value="replace"
              className="accent-blue-600"
              checked={searchOption === "replace"}
              onChange={handleReplaceOption}
            />
            <span className="font-inter text-[22px]">Replace an existing saved search</span>
          </label>
        </div>

        {/* Input Field for Create Option */}
        {searchOption === "create" ? (
          <div className="mt-8">
            <label className="block font-medium mb-2 font-inter text-p">Search Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter search name"
              className={`border rounded-lg px-4 py-2 font-inter text-xl w-[300px]
                ${showValidation && errors.name ? "border-red-500" : "border-[#273BE280]"}`}
              value={searchName}
              onChange={handleOnChangeInput}
              onBlur={handleOnChangeInput}
            />

            {showValidation && errors.name && (
              <p className="text-red-600 font-semibold text-sm mt-1">{errors.name}</p>
            )}
          </div>
        ) : (
          /* Replace Option with Professional Dropdown - Custom Styling */
          <div className="form-group mt-8">
            <label className="font-medium mb-2 font-inter text-p block">
              Replace an existing saved search
            </label>

            <div className="w-[300px]">
              <ProfessionalSavedSearchDropdown
                savedSearches={savedSearches}
                selectedSavedSearch={selectedSavedSearch}
                handleSavedSearchSelect={handleSavedSearchSelect}
                customStyling={customDropdownStyling}
              />
            </div>

            {showValidation && errors.name && (
              <p className="text-red-600 font-semibold text-sm mt-1">{errors.name}</p>
            )}
          </div>
        )}

        {/* Checkbox */}
        {/* <div className="mt-6 flex items-center space-x-2">
          <input
            type="checkbox"
            id="defaultSearch"
            className="accent-primary"
            checked={defaultSearch}
            onChange={() => setDefaultSearch(!defaultSearch)}
          />
          <label htmlFor="defaultSearch" className="font-inter text-[22px] cursor-pointer">
            Set as Default Search
          </label>
        </div> */}
      </div>
    </form>
  );
};

export default SavedSearchForm;