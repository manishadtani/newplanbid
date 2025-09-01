import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";


const PublishedDateTab = ({ filters = {}, setFilters }) => {
  const { publishedDate = {} } = filters;
  const { type = "", within = "7", from = "", to = "" } = publishedDate;

  const loginLastLogin = useSelector((state) => state.login?.user?.last_login);
  const registerLastLogin = useSelector((state) => state.auth?.user?.last_login);

  // Prefer login last_login, fallback to registration
  const lastLogin = loginLastLogin || registerLastLogin;

  const formattedLastLogin = lastLogin
    ? new Date(lastLogin).toLocaleDateString("en-US", {
      dateStyle: "medium",
    })
    : "Not Available";


  const [selectedType, setSelectedType] = useState(type || "");
  const [withinDays, setWithinDays] = useState(within || "7");
  const [fromDate, setFromDate] = useState(from || "");
  const [toDate, setToDate] = useState(to || "");

// PublishedDateTab.js - FIXED VERSION

useEffect(() => {
  const { type = "", within = "7", from = "", to = "", after, before } = publishedDate;

  // DEBUG: Console log to check what's coming from filters
  console.log("PublishedDateTab - Received filters:", { publishedDate, type, within, from, to, after, before });

  // 🔥 CRITICAL FIX: Always respect explicit type from saved search
  if (type) {
    console.log("Setting type directly from saved search:", type);
    setSelectedType(type);

    if (type === "lastLogin") {
      setWithinDays(""); 
      setFromDate("");
      setToDate("");
    } else if (type === "within") {
      setWithinDays(within || "7");
      setFromDate("");
      setToDate("");
    } else if (type === "timeline") {
      setWithinDays("7");
      setFromDate(from || "");
      setToDate(to || "");
    }
    return; // 🚨 IMPORTANT: Return early - NO inference logic should run
  }

  // 🔥 ADDITIONAL FIX: If no explicit type but we have after/before dates,
  // check if it could be lastLogin based on the date pattern
  if (!type && after && before) {
    const afterDate = after;
    const beforeDate = before;
    
    // Check if 'after' matches user's last login date
    const loginDate = lastLogin ? lastLogin.split("T")[0] : "";
    
    // 🔥 KEY FIX: If after date matches login date, assume it's lastLogin
    if (loginDate && afterDate === loginDate) {
      console.log("🔥 Detected lastLogin pattern, setting type to lastLogin");
      setSelectedType("lastLogin");
      setWithinDays("7");
      setFromDate("");
      setToDate("");
      return;
    }
  }

  // Original inference logic - only for cases without explicit type
  let inferredType = "";
  let inferredWithin = within;
  let inferredFrom = from;
  let inferredTo = to;

  if (after && before && !type) {
    const diffInMs = new Date(before) - new Date(after);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if ([7, 30, 90].includes(diffInDays)) {
      inferredType = "within";
      inferredWithin = diffInDays.toString();
    } else {
      inferredType = "timeline";
      inferredFrom = after;
      inferredTo = before;
    }
  }

  setSelectedType(inferredType);
  setWithinDays(inferredWithin);
  setFromDate(inferredFrom);
  setToDate(inferredTo);
}, [publishedDate, lastLogin]);

  // Use this approach in your calculateDateRange
  const calculateDateRange = (days) => {
    // For user-facing filters, use local time
    const today = new Date();
    const todayString = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - parseInt(days));
    const pastDateString = pastDate.getFullYear() + '-' +
      String(pastDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(pastDate.getDate()).padStart(2, '0');

    return {
      after: pastDateString,
      before: todayString
    };
  };

  const updateFilters = (
    type,
    days = withinDays,
    fromDateVal = fromDate,
    toDateVal = toDate
  ) => {
    const updated = { ...filters };

    if (type === "within") {
      const { after, before } = calculateDateRange(days);
      updated.publishedDate = {
        type,
        within: days,
        from: "",
        to: "",
        after,
        before,
      };
    } else if (type === "timeline") {
      updated.publishedDate = {
        type,
        within: "",
        from: fromDateVal,
        to: toDateVal,
        after: fromDateVal,
        before: toDateVal,
      };
    } else if (type === "lastLogin") {
      const loginDate = lastLogin ? lastLogin.split("T")[0] : "";

      // 🔥 FIX: Proper today date calculation (consistent with FilterPanel)
      const today = new Date();
      const todayString = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      console.log("🔥 PublishedDateTab lastLogin date calculation:", {
        lastLogin,
        loginDate,
        todayString,
        isoToday: new Date().toISOString().split("T")[0]
      });

      updated.publishedDate = {
        type,
        within: "",
        from: "",
        to: "",
        after: loginDate,
        before: todayString, // 🔥 FIXED: Use proper today date
      };
    } else {
      updated.publishedDate = {
        type: "",
        within: "7",
        from: "",
        to: "",
        after: "",
        before: "",
      };
    }

    setFilters(updated);
  };

  // 🔥 NEW: Clear all selections function
  const handleClearAll = () => {
    setSelectedType("");
    setWithinDays("7");
    setFromDate("");
    setToDate("");
    updateFilters("", "7", "", "");
  };

  // 🔥 NEW: Clear specific selection function
  const handleClearSelection = (selectionType) => {
    if (selectionType === selectedType) {
      if (selectionType === "lastLogin") {
        // No additional clearing needed for lastLogin
      } else if (selectionType === "within") {
        setWithinDays("7");
      } else if (selectionType === "timeline") {
        setFromDate("");
        setToDate("");
      }

      setSelectedType("");
      updateFilters("", "7", "", "");
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (type === "within") {
      updateFilters(type, withinDays);
    } else if (type === "timeline") {
      updateFilters(type, withinDays, fromDate, toDate);
    } else {
      updateFilters(type);
    }
  };

  const handleWithinChange = (days) => {
    setWithinDays(days);
    
    // If empty value is selected (default option), clear the filter
    if (!days || days === "") {
      // Clear the radio button selection and update filters
      setSelectedType("");
      updateFilters("", "7", "", "");
    } else if (selectedType === "within") {
      // Update filters with the selected days
      updateFilters("within", days);
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", withinDays, date, toDate);
    }
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", withinDays, fromDate, date);
    }
  };

  // 🔥 NEW: Check if any filter is active
  const hasActiveFilter = selectedType !== "" || fromDate !== "" || toDate !== "";

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">

        {/* 🔥 NEW: Clear All Button - Only show when filters are active (COMMENTED OUT) */}
        {/* {hasActiveFilter && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-inter text-sm border border-red-200 hover:border-red-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Dates
            </button>
          </div>
        )} */}

        {/* Last Login */}
        <div className="relative">
          <label className="font-semibold block font-inter text-p mb-2">
            Last Login
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="publishedDateFilter"
              value="lastLogin"
              checked={selectedType === "lastLogin"}
              onChange={() => handleTypeChange("lastLogin")}
              className="accent-purple-600"
            />
            <span className="font-inter text-xl">{formattedLastLogin}</span>

            {/* 🔥 NEW: Individual Clear Button for Last Login (COMMENTED OUT) */}
            {/* {selectedType === "lastLogin" && (
              <button
                onClick={() => handleClearSelection("lastLogin")}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Clear last login selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )} */}
          </div>
        </div>

        {/* Within */}
        <div className="relative">
          <label className="font-semibold block font-inter text-p mb-2">
            Within
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="publishedDateFilter"
              value="within"
              checked={selectedType === "within"}
              onChange={() => handleTypeChange("within")}
              className="accent-purple-600"
            />
            <select
              disabled={selectedType !== "within"}
              className="border border-gray-300 rounded-md font-inter text-xl px-2 py-1 w-[200px] disabled:bg-gray-100"
              value={withinDays}
              onChange={(e) => handleWithinChange(e.target.value)}
            >
              <option value="">-Select-</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>

            {/* 🔥 NEW: Individual Clear Button for Within (COMMENTED OUT) */}
            {/* {selectedType === "within" && withinDays && (
              <button
                onClick={() => handleClearSelection("within")}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Clear within selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )} */}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <label className="font-semibold block font-inter text-p mb-2">
            Timeline
          </label>
          <div className="flex items-start space-x-2 mb-1">
            <input
              type="radio"
              name="publishedDateFilter"
              value="timeline"
              checked={selectedType === "timeline"}
              onChange={() => handleTypeChange("timeline")}
              className="accent-purple-600"
            />
            <div>
              <div className="font-inter text-xl text-gray-800 mb-2">
                Starting
              </div>
              <input
                type="date"
                disabled={selectedType !== "timeline"}
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1 w-[200px] disabled:bg-gray-100"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
              />
            </div>

            {/* 🔥 NEW: Individual Clear Button for Timeline (COMMENTED OUT) */}
            {/* {selectedType === "timeline" && (fromDate || toDate) && (
              <button
                onClick={() => handleClearSelection("timeline")}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200 mt-6"
                title="Clear timeline selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )} */}
          </div>

          <div className="ml-6">
            <div className="font-inter text-xl text-gray-800 mb-2">Ending</div>
            <input
              type="date"
              disabled={selectedType !== "timeline"}
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px] disabled:bg-gray-100"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
            />
          </div>
        </div>

        {/* 🔥 NEW: Selected Filter Display - Bottom approach */}
        {hasActiveFilter && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-inter text-sm font-medium">Active Filter:</span>
                <div className="font-inter mt-1">
                  {selectedType === "lastLogin" && `Last Login: ${formattedLastLogin}`}
                  {selectedType === "within" && withinDays && `Within: Last ${withinDays} Days`}
                  {selectedType === "timeline" && (fromDate || toDate) &&
                    `Timeline: ${fromDate || 'Not set'} to ${toDate || 'Not set'}`}
                </div>
              </div>
              <button
                onClick={handleClearAll}
                className="text-blue-600 w-12 hover:text-blue-800 text-lg underline"
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedDateTab;