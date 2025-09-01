import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";


const ClosingDateTab = ({
  filters = {},
  setFilters = () => { },
  onApply = () => { },
  searchOption = "create",
  setShowValidation = () => { },
  setActiveTab = () => { },
  setTriggerSave = () => { },
}) => {
  const { closingDate = {} } = filters;
  const { type = "", within = "", date = "", from = "", to = "" } = closingDate; 

  // Local state for component
  const [selectedType, setSelectedType] = useState(type || "");
  const [withinDays, setWithinDays] = useState(within || "7");
  const [singleDate, setSingleDate] = useState(date || "");
  const [fromDate, setFromDate] = useState(from || "");
  const [toDate, setToDate] = useState(to || "");

  const today = new Date().toISOString().slice(0, 10);

  // Function to calculate date ranges for "within" option
  const calculateDateRange = (days) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    return {
      after: today.toISOString().split('T')[0],
      before: futureDate.toISOString().split('T')[0]
    };
  };

  // Update filters when selections change
  const updateFilters = (type, days = "", singleDateValue = "", fromDateValue = "", toDateValue = "") => {
    let updatedFilters = { ...filters };

    if (type === "date") {
      updatedFilters.closingDate = {
        type: "date",
        date: singleDateValue,
        within: "",
        from: "",
        to: "",
        after: singleDateValue,
        before: singleDateValue
      };
    } else if (type === "within") {
      const dateRange = calculateDateRange(days);
      updatedFilters.closingDate = {
        type: "within",
        within: days,
        date: "",
        from: "",
        to: "",
        after: dateRange.after,
        before: dateRange.before
      };
    } else if (type === "timeline") {
      updatedFilters.closingDate = {
        type: "timeline",
        within: "",
        date: "",
        from: fromDateValue,
        to: toDateValue,
        after: fromDateValue,
        before: toDateValue
      };
    } else {
      // Clear filters
      updatedFilters.closingDate = {
        type: "",
        within: "",
        date: "",
        from: "",
        to: "",
        after: "",
        before: ""
      };
    }

    if (setFilters) {
      setFilters(updatedFilters);
    }
  };

  // 🔥 NEW: Clear all selections function
  const handleClearAll = () => {
    setSelectedType("");
    setWithinDays("");
    setSingleDate("");
    setFromDate("");
    setToDate("");
    updateFilters("", "", "", "", "");
  };

  // 🔥 NEW: Clear specific selection function
  const handleClearSelection = (selectionType) => {
    if (selectionType === selectedType) {
      if (selectionType === "date") {
        setSingleDate("");
      } else if (selectionType === "within") {
        setWithinDays("");
      } else if (selectionType === "timeline") {
        setFromDate("");
        setToDate("");
      }
      
      setSelectedType("");
      updateFilters("", "", "", "", "");
    }
  };

  // Handle radio button change
  const handleTypeChange = (type) => {
    setSelectedType(type);

    if (type === "date") {
      setWithinDays("");
      setFromDate("");
      setToDate("");
      updateFilters(type, "", singleDate, "", "");
    } else if (type === "within") {
      setSingleDate("");
      setFromDate("");
      setToDate("");
    } else if (type === "timeline") {
      setSingleDate("");
      setWithinDays("");
      updateFilters(type, "", "", fromDate, toDate);
    } else {
      setWithinDays("");
      setSingleDate("");
      setFromDate("");
      setToDate("");
      updateFilters(type, "", "", "", "");
    }
  };

  // Handle single date change
  const handleSingleDateChange = (date) => {
    setSingleDate(date);
    if (selectedType === "date") {
      updateFilters("date", "", date, "", "");
    }
  };

  // Handle within days change
 const handleWithinChange = (days) => {
    setWithinDays(days);
    
    // If empty value is selected (default option), clear the filter
    if (!days || days === "") {
      // Clear the radio button selection and update filters
      setSelectedType("");
      updateFilters("", "", "", "", "");
    } else if (selectedType === "within") {
      // Update filters with the selected days
      updateFilters("within", days, "", "", "");
    }
  };

  // Handle timeline dates change
  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", "", "", date, toDate);
    }
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", "", "", fromDate, date);
    }
  };

  // Initialize component state from filters
  useEffect(() => {
    let inferredType = closingDate.type || "";
    let inferredWithin = closingDate.within || "";
    let inferredDate = closingDate.date || "";
    let inferredFrom = closingDate.from || "";
    let inferredTo = closingDate.to || "";

    if (!inferredType && closingDate.after && closingDate.before) {
      const after = closingDate.after;
      const before = closingDate.before;

      if (after === before) {
        inferredType = "date";
        inferredDate = after;
      } else {
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
    }

    setSelectedType(inferredType);
    setWithinDays(inferredWithin);
    setSingleDate(inferredDate);
    setFromDate(inferredFrom);
    setToDate(inferredTo);
  }, [closingDate]);

  // 🔥 NEW: Check if any filter is active
  const hasActiveFilter = selectedType !== "" || singleDate !== "" || withinDays !== "" || fromDate !== "" || toDate !== "";

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">
        
        {/* 🔥 NEW: Clear All Button - Only show when filters are active */}
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

        {/* Single Date */}
        <div className="relative">
          <label className="font-semibold block font-inter text-p mb-2">Date</label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="closingDateFilter"
              value="date"
              checked={selectedType === "date"}
              onChange={() => handleTypeChange("date")}
              className="accent-purple-600"
            />
            <input
              type="date"
              disabled={selectedType !== "date"}
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px] disabled:bg-gray-100"
              value={singleDate}
              onChange={(e) => handleSingleDateChange(e.target.value)}
              min={today}
            />
            
            {/* 🔥 NEW: Individual Clear Button for Date */}
            {/* {selectedType === "date" && singleDate && (
              <button
                onClick={() => handleClearSelection("date")}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Clear date selection"
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
          <label className="font-semibold block font-inter text-p mb-2">Within</label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="closingDateFilter"
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
              <option value="7">Next 7 Days</option>
              <option value="30">Next 30 Days</option>
              <option value="90">Next 90 Days</option>
            </select>

            {/* 🔥 NEW: Individual Clear Button for Within */}
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
          <label className="font-semibold block font-inter text-p mb-2">Timeline</label>
          <div className="flex items-start space-x-2 mb-1">
            <input
              type="radio"
              name="closingDateFilter"
              value="timeline"
              checked={selectedType === "timeline"}
              onChange={() => handleTypeChange("timeline")}
              className="accent-purple-600"
            />
            <div>
              <div className="font-inter text-xl text-gray-800 mb-2">Starting</div>
              <input
                type="date"
                disabled={selectedType !== "timeline"}
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1 w-[200px] disabled:bg-gray-100"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
                min={today}
              />
            </div>

            {/* 🔥 NEW: Individual Clear Button for Timeline */}
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
              min={fromDate || today}
            />
          </div>
        </div>

        {/* 🔥 NEW: Selected Filter Display */}
        {hasActiveFilter && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-inter text-sm font-medium">Active Filter:</span>
                <div className="font-inter mt-1">
                  {selectedType === "date" && singleDate && `Date: ${singleDate}`}
                  {selectedType === "within" && withinDays && `Within: Next ${withinDays} Days`}
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

export default ClosingDateTab;