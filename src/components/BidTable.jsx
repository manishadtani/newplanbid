import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BlogShareButton from "./BlogShareButton";
import { usePlan } from "../hooks/usePlan";

const BidTable = forwardRef(({
  bids = [],
  totalCount = 0,
  currentSortField = "",
  currentSortOrder = "",
  onSort = () => { },
  onEntityTypeChange = () => { },
  onFollowBid = () => { },
  onFeatureRestriction = () => { },
  followedBids = new Set(),
  followLoading = new Set(),
  sortingDisabled = false
}, ref) => {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("Entity Type");
  const dropdownRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});


  // Plan hook
  const {
    planInfo,
    restrictions,
    shouldBlurBid,
    blurConfig,
    validateAndExecute
  } = usePlan();
  console.log("blurConfig->>>>>>>", blurConfig);


  console.log( "plan info ->>>>>>>>>>>>>>>>>>>>>>>..." , planInfo);

  useEffect(() => {
    setData([...bids]);
  }, [bids]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  


  const handleRowClick = (id, bidIndex) => {
    // Check if bid summary feature is restricted (same pattern as follow button)
    if (restrictions?.bidSummary) {
      onFeatureRestriction(
        "🔒 Bid Summary Feature Locked",
        "Upgrade your plan to view detailed bid summaries and analysis.",
        "Bid Summary Feature",
        true
      );
    } else {
      // For users without restriction - directly navigate
      console.log("✅ Navigating to bid summary:", id);
      navigate(`/summary/${id}`);
    }
  };


  // Enhanced follow click with restriction check



  const handleFollowClick = (e, bidId) => {
    e.stopPropagation();
    onFollowBid(bidId);
  };

  // Enhanced export with restriction check
  const exportToCSV = () => {
    validateAndExecute(
      'export',
      (popupData) => {
        onFeatureRestriction(
          popupData.title,
          popupData.message,
          popupData.feature,
          popupData.needsUpgrade
        );
      },
      () => {
        // Original CSV export logic
        const csv = convertToCSV(data);
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
        link.href = url;
        link.setAttribute("download", `bids_export_${timestamp}.csv`);
        link.click();
        URL.revokeObjectURL(url);
      }
    );
  };

  useImperativeHandle(ref, () => ({ exportToCSV }));

  // Helper function to check if column should be blurred
  const shouldBlurColumn = (columnName, bidIndex) => {

    if (!blurConfig.enabled) return false;
    
    if (shouldBlurBid(bidIndex)) return false;

    return blurConfig.blur_columns?.includes(columnName) || false;
  };

  // 🔥 FIX 3: Entity Type Handler with Restriction Check for FREE users only
  const handleEntityTypeClick = (type) => {
    // 🔥 FIXED: Only restrict for FREE plan (001)
    if (planInfo?.isFree && restrictions?.entityDropdown) {
      onFeatureRestriction(
        "🔒 Filter Feature Locked",
        "Upgrade your plan to filter bids by entity types (Federal, State, Local).",
        "Entity Filter Feature",
        true
      );
      return;
    }

    // For Starter and above, allow normal functionality
    setSelectedEntity(type);
    onEntityTypeChange(type === "Select Entity" ? "" : type);
    setDropdownOpen(false);
  };

  // 🔥 FIX 2: Enhanced Header Click with Sorting Restriction for FREE users only
  const handleHeaderClick = (field, e) => {
    e.stopPropagation();

    // 🔥 FIXED: Only restrict sorting for FREE plan (001)
    if (planInfo?.isFree && restrictions?.sorting) {
      onFeatureRestriction(
        "🔒 Sorting Feature Locked",
        "Upgrade your plan to sort bids by different criteria like date, status, etc.",
        "Sorting Feature",
        true
      );
      return;
    }

    // 🔥 FIXED: For STARTER (002) and above - allow normal sorting
    console.log("✅ Starter+ plan - Sorting allowed for field:", field);
    onSort(field);
  };

  // Updated getSortIcon with restriction check
  const getSortIcon = (field) => {
    // 🔥 FIXED: Only show lock for FREE plan (001)
    if (planInfo?.isFree && restrictions?.sorting) {
      return <span className="ml-2"><i className="fas fa-lock text-xs text-white/40"></i></span>;
    }

    // 🔥 FIXED: For STARTER (002) and above - show normal sort icons
    const isCurrentField = currentSortField === field || currentSortField === `-${field}`;
    const isDescending = currentSortField === `-${field}`;
    if (!isCurrentField) return <span className="ml-2"><i className="fas fa-sort text-white/50 text-xs"></i></span>;
    return <span className="ml-2"><i className={`fas ${isDescending ? 'fa-sort-down' : 'fa-sort-up'} text-white text-xs`}></i></span>;
  };

  // Blur wrapper component
  const BlurWrapper = ({ children, shouldBlur, className = "" }) => {
    if (!shouldBlur) return children;

    return (
      <div className={`relative ${className}`}>
        <div className="filter blur-sm select-none pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded px-2 py-1">
            <i className="fas fa-lock text-xs text-white/60"></i>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bid-table rounded-2xl bg-btn text-white my-[50px] shadow-xl overflow-x-auto border-white border-2 border-solid relative max-h-screen overflow-y-auto">



      <table className="min-w-full table-auto text-sm text-center">
        <thead className="sticky z-10 top-0 bg-white/5 backdrop-blur-sm">
          <tr className="text-white/80 text-xs border-b border-white/20">

            {/* 🔥 FIXED: Entity Type Dropdown with Restriction */}
            <th className="px-4 py-4 font-inter text-lg relative">
              <div ref={dropdownRef} className="inline-block text-left">
                <button
                  onClick={() => {
                    if (restrictions.entityDropdown) {
                      onFeatureRestriction(
                        "🔒 Filter Feature Locked",
                        "Upgrade your plan to filter bids by entity types (Federal, State, Local).",
                        "Entity Filter Feature",
                        true
                      );
                    } else {
                      setDropdownOpen(!dropdownOpen);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full relative ${restrictions.entityDropdown ? 'opacity-60' : ''
                    }`}
                  title={restrictions.entityDropdown ? "Upgrade to filter by entity type" : "Filter by entity type"}
                >
                  {/* 🔥 BLUR Entity Dropdown for FREE users */}
                  {restrictions.entityDropdown ? (
                    <BlurWrapper shouldBlur={true} className="flex items-center gap-2">
                      <span>Entity Type</span>
                      <i className="fas fa-caret-down text-sm"></i>
                    </BlurWrapper>
                  ) : (
                    <>
                      {selectedEntity} <i className="fas fa-caret-down text-sm"></i>
                    </>
                  )}

                  {/* Lock icon for restricted users */}
                  {restrictions.entityDropdown && (
                    <div className="">
                      {/* <i className="fas fa-lock text-xs text-black"></i> */}
                    </div>
                  )}
                </button>

                {/* Only show dropdown if not restricted */}
                {dropdownOpen && !restrictions.entityDropdown && (
                  <div className="absolute mt-2 w-40 rounded-md bg-white text-black font-medium z-10">
                    {["Select Entity", "Federal", "State", "Local"].map((type) => (
                      <div
                        key={type}
                        onClick={() => handleEntityTypeClick(type)}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedEntity === type ? 'bg-gray-100 font-semibold' : ''
                          }`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </th>

            <th className="px-4 py-4 font-inter text-lg">Bid Name</th>

            {/* 🔥 FIXED: Sortable headers with proper restriction checks */}
            <th className={`px-4 py-4 font-inter text-lg ${planInfo?.isFree && restrictions?.sorting ? ' opacity-60' : 'cursor-pointer'
              }`}
              onClick={(e) => handleHeaderClick("open_date", e)}
              title={planInfo?.isFree && restrictions?.sorting ? "Upgrade to sort by open date" : "Click to sort by open date"}>
              Open Date {getSortIcon("open_date")}
            </th>

            <th className={`px-4 py-4 font-inter text-lg ${planInfo?.isFree && restrictions?.sorting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
              onClick={(e) => handleHeaderClick("closing_date", e)}
              title={planInfo?.isFree && restrictions?.sorting ? "Upgrade to sort by closing date" : "Click to sort by closing date"}>
              Closed Date {getSortIcon("closing_date")}
            </th>

            <th className={`px-4 py-4 font-inter text-lg ${planInfo?.isFree && restrictions?.sorting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
              onClick={(e) => handleHeaderClick("closing_date", e)}
              title={planInfo?.isFree && restrictions?.sorting ? "Upgrade to sort by countdown" : "Sort by countdown (closing date)"}>
              Countdown {getSortIcon("closing_date")}
            </th>

            <th className="px-4 py-4 font-inter text-lg">Status</th>
            <th className="px-4 py-4 font-inter text-lg text-center">Share</th>
            <th className="px-4 py-4 font-inter text-lg text-center">Follow</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <i className="fas fa-inbox text-2xl text-white/50"></i>
                  </div>
                  <div>
                    <p className="text-white/60 text-lg font-medium">No bids found</p>
                    <p className="text-white/40 text-sm mt-1">Try adjusting your filters</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((bid, index) => {
              const statusLabel = bid.bid_type || "Unknown";
              const countdownRaw = getCountdown(bid.closing_date);
              const shouldBlurThisBid = shouldBlurBid(index);
              const isFollowed = followedBids.has(bid.id);
              const isLoading = followLoading.has(bid.id);

              // Calculate countdown display (existing logic)
              let countdownDisplay = countdownRaw;
              const closingDateObj = new Date(bid.closing_date);
              const today = new Date();
              const isClosingToday = closingDateObj.toDateString() === today.toDateString();

              if (statusLabel.toLowerCase() === 'inactive' || bid.status === false || statusLabel.toLowerCase() === 'closed') {
                countdownDisplay = "Closed";
              } else if (isClosingToday) {
                countdownDisplay = "Today";
              } else if (!["-", "Closed"].includes(countdownRaw)) {
                const days = parseInt(countdownRaw.match(/\d+/)?.[0] || "0", 10);
                if (days <= 0) countdownDisplay = "Closed";
                else if (days < 30) countdownDisplay = `${days} days`;
                else if (days < 365) {
                  const months = Math.floor(days / 30);
                  const remainingDays = days % 30;
                  countdownDisplay = remainingDays === 0 ? `${months}m` : `${months}mo ${remainingDays}d`;
                } else {
                  const years = Math.floor(days / 365);
                  const months = Math.floor((days % 365) / 30);
                  const remainingDays = (days % 365) % 30;
                  const parts = [];
                  if (years > 0) parts.push(`${years}y`);
                  if (months > 0) parts.push(`${months}m`);
                  if (years === 0 && remainingDays > 0) parts.push(`${remainingDays}d`);
                  countdownDisplay = parts.join(" ");
                }
              }

              return (
                <tr
                  key={bid.id}
                  className={`border-b border-white/10 hover:bg-white/5 transition cursor-pointer ${shouldBlurThisBid ? 'opacity-75' : ''
                    }`}
                  onClick={() => handleRowClick(bid.id, index)}
                >
                  {/* Entity Type - No blur */}
                  <td className="px-4 py-4 font-semibold font-inter">
                    {truncate(bid.entity_type)}
                  </td>

                  {/* Bid Name - Blur if needed */}
                  <td className="px-4 py-4 font-medium font-inter">
                    <BlurWrapper shouldBlur={shouldBlurColumn('bid_name', index)}>
                      {truncate(bid.bid_name)}
                    </BlurWrapper>
                  </td>

                  {/* Open Date - Blur if needed */}
                  <td className="px-4 py-4 font-medium font-inter">
                    <BlurWrapper shouldBlur={shouldBlurColumn('open_date', index)}>
                      {formatDate(bid.open_date)}
                    </BlurWrapper>
                  </td>

                  {/* Closing Date - Blur if needed */}
                  <td className="px-4 py-4 font-medium font-inter">
                    <BlurWrapper shouldBlur={shouldBlurColumn('closing_date', index)}>
                      {formatDate(bid.closing_date)}
                    </BlurWrapper>
                  </td>

                  {/* Countdown - Blur if needed */}
                  <td className="px-4 py-4 font-medium font-inter" title={countdownRaw}>
                    <BlurWrapper shouldBlur={shouldBlurColumn('countdown', index)}>
                      <span className="text-white">{countdownDisplay}</span>
                    </BlurWrapper>
                  </td>

                  {/* Status - No blur */}
                  <td className="px-4 py-4 font-medium font-inter">{statusLabel}</td>

                  {/* Share - With restriction */}
                  <td className="px-4 py-4 btn-box text-center">
                    {restrictions?.share ? (
                      <div
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-50 relative"
                        title="Upgrade to share bids"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFeatureRestriction(
                            "🔒 Share Feature Locked",
                            "Upgrade your plan to share bids with your team and colleagues.",
                            "Share Feature",
                            true
                          );
                        }}
                      >
                        <i className="fas fa-lock text-sm text-white/60"></i>
                      </div>
                    ) : (
                      <BlogShareButton
                        url={`${window.location.origin}/summary/${bid.id}`}
                        onShare={() => console.log(`Shared bid: ${bid.bid_name}`)}
                      />
                    )}
                  </td>

                  {/* Follow - With restriction */}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (restrictions?.follow) {
                          onFeatureRestriction(
                            "🔒 Follow Feature Locked",
                            "Upgrade your plan to follow important bids and get notifications.",
                            "Follow Feature",
                            true
                          );
                        } else {
                          handleFollowClick(e, bid.id);
                        }
                      }}
                      disabled={isLoading}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 relative ${restrictions?.follow
                        ? 'opacity-50 bg-white/10'
                        : isLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-110 cursor-pointer'
                        }`}
                      title={
                        restrictions?.follow
                          ? "Upgrade to follow bids"
                          : isFollowed
                            ? "Unfollow this bid"
                            : "Follow this bid"
                      }
                    >
                      {restrictions?.follow ? (
                        <i className="fas fa-lock text-sm text-white/60"></i>
                      ) : isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <i
                          className={`fas text-lg transition-colors ${isFollowed
                            ? "fa-minus-circle text-white-400 hover:text-white-300"
                            : "fa-plus-circle text-white-400 hover:text-white-300"
                            }`}
                        />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
});

// Helper functions
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
}

function getCountdown(closingDateStr) {
  if (!closingDateStr) return "-";
  const closingDate = new Date(closingDateStr);
  const now = new Date();
  const diffInMs = closingDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (isNaN(diffInDays)) return "-";
  if (diffInDays < 0) return "Closed";
  if (diffInDays === 1) return "1 day";
  return `${diffInDays} days`;
}

const convertToCSV = (rows) => {
  if (!rows?.length) return "";
  const headers = ["Jurisdiction", "Bid Name", "Open Date", "Closed Date", "Countdown", "Status"];
  const csvRows = rows.map((bid) => [
    `"${bid.jurisdiction ?? ""}"`,
    `"${bid.bid_name ?? ""}"`,
    `"${formatDate(bid.open_date)}"`,
    `"${formatDate(bid.closing_date)}"`,
    `"${getCountdown(bid.closing_date)}"`,
    `"${bid.bid_type || "Unknown"}"`,
  ]);
  return [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
};

const truncate = (text) => !text ? "-" : text.length > 30 ? text.slice(0, 30) + "..." : text;

export default BidTable;