

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
import BlogShareButton from "./BlogShareButton"; 

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

const BidTable = forwardRef(({ bids = [], totalCount = 0, currentSortField = "", currentSortOrder = "", onSort = () => { }, onEntityTypeChange = () => { }}, ref) => {
  // onFeatureRestriction = () => { } 
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("Entity Type");
  const dropdownRef = useRef(null);

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
    
//   const handleRowClick = async (id) => {
//   try {
//     console.log("🔥 Fetching bid details for ID:", id);
    
//     // API call karke bid details fetch karo
//     const bidDetails = await getBids(id); // Single bid fetch
    
//     console.log("✅ Bid details fetched successfully");
//     // Agar success hai to navigate karo
//     navigate(`/summary/${id}`);
    
//   } catch (error) {
//     console.error("❌ Error fetching bid details:", error);
    
//     // Check if it's a restriction error (403 status)
//     if (error.response?.status === 403) {
//       const errorMessage = error.response?.data?.detail || "Upgrade your plan to view this bid summary.";
      
//       // Popup show karo using parent function
//       if (onFeatureRestriction) {
//         onFeatureRestriction(
//           "Bid Summary Restricted",
//           errorMessage,
//           "Bid Summary Access",
//           true
//         );
//       }
//     } else {
//       // Other errors ke liye generic message
//       if (onFeatureRestriction) {
//         onFeatureRestriction(
//           "Error Loading Bid",
//           "Unable to load bid details. Please try again.",
//           "Bid Access",
//           false
//         );
//       }
//     }
//   }
// };



  const handleRowClick = (id) => {
    console.log(id);
    navigate(`/summary/${id}`);
  };

  const exportToCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    link.href = url;
    link.setAttribute("download", `bids_export_${timestamp}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  useImperativeHandle(ref, () => ({ exportToCSV }));

  const truncate = (text) => !text ? "-" : text.length > 30 ? text.slice(0, 30) + "..." : text;

  const getSortIcon = (field) => {
    const isCurrentField = currentSortField === field || currentSortField === `-${field}`;
    const isDescending = currentSortField === `-${field}`;
    if (!isCurrentField) return <span className="ml-2"><i className="fas fa-sort text-white/50 text-xs"></i></span>;
    return <span className="ml-2"><i className={`fas ${isDescending ? 'fa-sort-down' : 'fa-sort-up'} text-white text-xs`}></i></span>;
  };

  const handleHeaderClick = (field, e) => {
    e.stopPropagation();
    onSort(field);
  };

  const handleEntityTypeClick = (type) => {
    setSelectedEntity(type);
    onEntityTypeChange(type === "Select Entity" ? "" : type);
    setDropdownOpen(false);
  };

  return (
    <div className="bid-table rounded-2xl bg-btn text-white my-[50px] shadow-xl overflow-x-auto border-white border-2 border-solid relative max-h-screen overflow-y-auto">
      <table className="min-w-full table-auto text-sm text-center">
        <thead className="sticky z-10 top-0 bg-white/5 backdrop-blur-sm">
          <tr className="text-white/80 text-xs border-b border-white/20">

            <th className="px-4 py-4 font-inter text-lg relative">
              <div ref={dropdownRef} className="inline-block text-left">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2  px-3 py-1 rounded-full"
                >
                  {selectedEntity} <i className="fas fa-caret-down text-sm"></i>
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-2 w-40 rounded-md bg-white text-black font-medium z-10">
                    {["Select Entity", "Federal", "State", "Local"].map((type) => (
                      <div
                        key={type}
                        onClick={() => handleEntityTypeClick(type)}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedEntity === type ? 'bg-gray-100 font-semibold' : ''}`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </th>

            <th className="px-4 py-4 font-inter text-lg cursor-pointer">Bid Name</th>
            <th className="px-4 py-4 font-inter text-lg cursor-pointer" onClick={(e) => handleHeaderClick("open_date", e)}>Open Date {getSortIcon("open_date")}</th>
            <th className="px-4 py-4 font-inter text-lg cursor-pointer" onClick={(e) => handleHeaderClick("closing_date", e)}>Closed Date {getSortIcon("closing_date")}</th>
            <th className="px-4 py-4 font-inter text-lg cursor-pointer" onClick={(e) => handleHeaderClick("closing_date", e)} title="Sorted by closing date">Countdown {getSortIcon("closing_date")}</th>
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
                    <p className="text-white/40 text-sm mt-1">
                      {selectedEntity && selectedEntity !== "Select Entity"
                        ? `No bids available for ${selectedEntity} entity type`
                        : 'Try adjusting your filters'}
                    </p>

                  </div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((bid) => {
              const statusLabel = bid.bid_type || "Unknown";
              const countdownRaw = getCountdown(bid.closing_date);
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
                <tr key={bid.id} className="border-b border-white/10 hover:bg-white/5 transition cursor-pointer" onClick={() => handleRowClick(bid.id)}>
                  <td className="px-4 py-4 font-semibold font-inter">{truncate(bid.entity_type)}</td>
                  <td className="px-4 py-4 font-medium font-inter">{truncate(bid.bid_name)}</td>
                  <td className="px-4 py-4 font-medium font-inter">{formatDate(bid.open_date)}</td>
                  <td className="px-4 py-4 font-medium font-inter">{formatDate(bid.closing_date)}</td>
                  <td className="px-4 py-4 font-medium font-inter" title={countdownRaw}><span className="text-white">{countdownDisplay}</span></td>
                  <td className="px-4 py-4 font-medium font-inter">{statusLabel}</td>
                  <td className="px-4 py-4 btn-box  text-center">
                    <BlogShareButton
                      url={`${window.location.origin}/summary/${bid.id}`}
                      onShare={() => console.log(`Shared bid: ${bid.bid_name}`)}
                    />

                  </td>
                  <td className="px-4 py-4 text-center">
                    <button>
                      <i className={`fas ${bid.followed ? "fa-minus-circle" : "fa-plus-circle"}`}></i>
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

export default BidTable;













