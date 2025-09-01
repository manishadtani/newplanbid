import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faCalendarAlt,
  faUsers,
  faHandshake,
  faMapMarkerAlt,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function FormMultiSelect({
  label,
  name,
  options = [],
  placeholder = "Select options",
  required = true,
  value = [],
  onChange,
  maxSelections = 10,
}) {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if options match the "contract range" set
  const isContractRange = options.every((opt) =>
    ["upto-75000", "75000-500000", "above-500000"].includes(opt.value)
  );

  // Apply sorting only when NOT contract range
  const sortedOptions = isContractRange
    ? options // keep order as given
    : [...options].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      );

  // Filter options based on search term
  const filteredOptions = sortedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("year")) return faCalendarAlt;
    if (lower.includes("employee")) return faUsers;
    if (lower.includes("contract")) return faHandshake;
    if (lower.includes("state")) return faMapMarkerAlt;
    if (lower.includes("industry") || lower.includes("industries")) return faUsers;
    return faUsers; // default for multi-select
  };

  const iconColor = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("state")) return "text-[#9CA3AF]";
    return "text-gray-400";
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (optValue) => {
    if (!optValue) return; // Don't select empty/placeholder values

    let newValues;
    const isAlreadySelected = value.some(val => val.value === optValue);

    if (isAlreadySelected) {
      // Remove if already selected
      newValues = value.filter(val => val.value !== optValue);
    } else {
      // Add if not selected and under max limit
      if (value.length < maxSelections) {
        const selectedOption = sortedOptions.find(opt => opt.value === optValue);
        newValues = [...value, selectedOption];
      } else {
        return; // Don't add if max reached
      }
    }

    // Call onChange with new values (keeping original functionality)
    onChange(newValues);
  };

  const handleRemoveTag = (valueToRemove, event) => {
    event.stopPropagation();
    const newValues = value.filter(val => val.value !== valueToRemove);
    onChange(newValues);
  };

  // Generate display text for the dropdown trigger
  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder;
    } else if (value.length === 1) {
      return value[0].label;
    } else {
      return `${value.length} options selected`;
    }
  };

  return (
    <div
      className="form-field flex flex-col gap-3 mb-3 w-[100%] md:w-[90%]"
      ref={dropdownRef}
    >
      {/* Label */}
      <label className="form-label font-t mb-2" htmlFor={name}>
        {label}
      </label>


      {/* Custom Dropdown */}
      <div
        className="relative font-t p-3 py-5 rounded-[20px] border border-gray-300 text-white cursor-pointer"
        onClick={handleDropdownToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={getIcon(label)}
              className={`${iconColor(label)}`}
            />
            <span className={value.length === 0 ? "text-white" : ""}>
              {getDisplayText()}
            </span>
          </div>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-gray-400 transform transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 bottom-full mb-2 w-full bg-white text-black rounded-lg shadow-lg z-50 overflow-hidden">
            {/* Search Input - For dropdowns with many options */}
            {options.length > 10 && (
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Selected Tags Display (when open) */}
            {value.length > 0 && (
              <div className="p-3 border-b border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Selected ({value.length}/{maxSelections}):</div>
                <div className="flex flex-wrap gap-1">
                  {value.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {item.label}
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer hover:text-blue-600"
                        onClick={(e) => handleRemoveTag(item.value, e)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Options List with scrolling */}
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.map((opt, i) => {
                const isSelected = value.some(val => val.value === opt.value);
                const isDisabled = !isSelected && value.length >= maxSelections;
                
                return (
                  <li
                    key={i}
                    className={`flex items-center gap-2 p-3 cursor-pointer ${
                      isDisabled 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "hover:bg-gray-100"
                    } ${
                      isSelected ? "bg-blue-50 text-blue-600" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        handleSelect(opt.value);
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={getIcon(label)}
                      className={`${iconColor(label)} text-xs`}
                    />
                    <span className="flex-1">{opt.label}</span>
                    {isSelected && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-blue-600 text-xs"
                      />
                    )}
                  </li>
                );
              })}
              {filteredOptions.length === 0 && (
                <li className="p-3 text-gray-500 text-center">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Max selections warning */}
      {value.length >= maxSelections && (
        <p className="text-red-400 text-sm mt-2 font-semibold">
          You can select up to {maxSelections} options only.
        </p>
      )}
    </div>
  );
}

export default FormMultiSelect;