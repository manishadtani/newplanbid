



// // npm install react-circular-progressbar
// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faLink,
//   faDatabase,
//   faCog,
//   faSignOutAlt,
//   faBell,
//   faSearch,
// } from "@fortawesome/free-solid-svg-icons";
// import {
//   CircularProgressbarWithChildren,
//   buildStyles,
// } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import URLBar from "../sections/super-admin/URLBar";
// import { getErrorBids } from "../services/admin.service";

// export default function SuperAdmin() {
//   // Values
//   const activeUrlValue = 10000;
//   const targetUrlValue = 15000;
//   const activePercent = (activeUrlValue / targetUrlValue) * 100;

//   // For animating the progress arc
//   const [activeUrlProgress, setActiveUrlProgress] = useState(0);

//   // Fixed: Initialize errorBids as empty array instead of empty string
//   const [errorBids, setErrorBids] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true); // Fixed: Initialize as boolean

//   useEffect(() => {
//     const fetchErrorBids = async () => {
//       try {
//         setLoading(true);
//         const data = await getErrorBids();
//         console.log("API Response:", data);

//         // Handle different API response structures
//         const bidsArray = Array.isArray(data) ? data : (data.results || data.data || []);
//         setErrorBids(bidsArray);
//         setError('');
//       } catch (err) {
//         setError("Failed to fetch error bids data");
//         console.error("Error fetching error bids:", err);

//         // Set mock data for demonstration if API fails
//         setErrorBids([
//           {
//             id: 184,
//             name: "South Carolina_state",
//             entity_type_name: "State",
//             file_path: "scrapping/helper/states/South Carolina_state.py",
//             state_name: "South Carolina",
//             is_active: true,
//             last_run: null,
//             error: "504 Gateway Timeout",
//             timeStamp: "10:56:45"
//           },
//           {
//             id: 185,
//             name: "New York_state",
//             entity_type_name: "State",
//             file_path: "scrapping/helper/states/New York_state.py",
//             state_name: "New York",
//             is_active: true,
//             last_run: null,
//             error: "Connection Failed",
//             timeStamp: "11:23:12"
//           }
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchErrorBids();
//   }, []);

//   useEffect(() => {
//     let animationFrame;
//     let progress = 0;
//     function animate() {
//       progress += 2; // animation speed
//       if (progress <= activePercent) {
//         setActiveUrlProgress(progress);
//         animationFrame = requestAnimationFrame(animate);
//       } else {
//         setActiveUrlProgress(activePercent);
//         cancelAnimationFrame(animationFrame);
//       }
//     }
//     animate();
//     return () => cancelAnimationFrame(animationFrame);
//   }, [activePercent]);

//   // Helper function to format time stamp
//   const formatTimeStamp = (timeStamp) => {
//     if (!timeStamp) return "N/A";
//     // If it's already in HH:MM:SS format, return as is
//     if (typeof timeStamp === 'string' && timeStamp.includes(':')) {
//       return timeStamp;
//     }
//     // If it's a date object or ISO string, format it
//     try {
//       const date = new Date(timeStamp);
//       return date.toLocaleTimeString('en-US', {
//         hour12: false,
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//       });
//     } catch {
//       return timeStamp || "N/A";
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="sticky top-0 text-white w-64 p-6 flex flex-col justify-between h-screen bg-blue">
//         <div>
//           <h1 className="text-2xl font-bold mb-10">
//             <img src="logo.png" alt="" />
//           </h1>
//           <nav className="flex flex-col gap-6">
//             <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter">
//               <FontAwesomeIcon icon={faLink} />
//               <span>URL Scrapping</span>
//             </div>
//             <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter">
//               <FontAwesomeIcon icon={faDatabase} />
//               <span>CMS</span>
//             </div>
//             <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter">
//               <FontAwesomeIcon icon={faCog} />
//               <span>Settings</span>
//             </div>
//           </nav>
//         </div>
//         <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter ">
//           <FontAwesomeIcon icon={faSignOutAlt} />
//           <span>Logout</span>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 space-y-8 overflow-x-hidden bg-gray-50">
//         {/* Top Nav */}
//         <div className=" flex flex-wrap justify-between py-4 px-8 border-b-4 border-primary items-center gap-4 bg-white shadow-sm sticky top-0 z-10">
//           <h2 className="text-2xl font-semibold font-archivo text-gray-800">
//             URL Scrapping
//           </h2>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <FontAwesomeIcon
//                 icon={faSearch}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search titles or organization or location"
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               />
//             </div>
//             <div className="relative w-12 h-12 rounded-full border border-blue-600 flex items-center justify-center">
//               <FontAwesomeIcon icon={faBell} className="text-primary text-lg" />
//               <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
//             </div>
//             <button className="bg-primary text-white px-4 font-archivo py-2 rounded-full  hover:bg-blue-700 transition">
//               Hi, Angela
//             </button>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4 px-8 sticky top-0">
//           {[
//             {
//               label: "Total Bids",
//               value: "15,000",
//               change: "+10%",
//               color: "text-green-600",
//               bg: "bg-[#4BF03C33]",
//               note: "Growth since last month",
//             },
//             {
//               label: "Scrapped Bids",
//               value: "13,000",
//               change: "+10%",
//               color: "text-green-600",
//               bg: "bg-[#4BF03C33]",
//               note: "Growth since last month",
//             },
//             {
//               label: "Accepted Bids",
//               value: "12,000",
//               change: "-10%",
//               color: "text-red-600",
//               bg: "bg-[#F03C3F33]",
//               note: "Down from last month",
//             },
//             {
//               label: "Error Bids",
//               value: errorBids.length.toString(), // Dynamic count from API
//               change: "+10%",
//               color: "text-green-600",
//               bg: "bg-[#4BF03C33]",
//               note: "Growth since last month",
//             },
//           ].map((card, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-2xl p-6 border border-1 border-primary shadow-md"
//             >
//               <h4 className="text-gray-700 font-medium mb-1 font-inter text-[22px]">{card.label}</h4>
//               <div className="flex gap-2 items-center">
//                 <div className="text-lg font-inter">{card.value}</div>
//                 <div
//                   className={`${card.color} ${card.bg} py-1 px-3 rounded-[50px] inline-block mt-1 font-inter text-sm`}
//                 >
//                   {card.change}
//                 </div>
//               </div>
//               <p className="text-[#999999] mt-1 text-sm font-inter">{card.note}</p>
//             </div>
//           ))}
//         </div>

//         {/* Donut Charts and Error Table */}
//         <div className="flex gap-6 px-8">
//           <div className="w-[50%] bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
//               {[...Array(2)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="flex flex-col items-center justify-center"
//                 >
//                   <h3 className="font-semibold font-inter text-lg mb-2 text-black">
//                     Target
//                   </h3>
//                   <CircularProgressbarWithChildren
//                     value={activeUrlProgress}
//                     maxValue={100}
//                     strokeWidth={10}
//                     styles={buildStyles({
//                       rotation: 0.75,
//                       strokeLinecap: "round",
//                       trailColor: "#8794FF",
//                       pathColor: "#273BE2",
//                     })}
//                     className="w-60 h-60"
//                   >
//                     <div className="text-2xl font-semibold">
//                       <span className="text-primary">
//                         {activeUrlValue / 1000}K
//                       </span>
//                       <span className="text-[#578af9]">
//                         /{targetUrlValue / 1000}K
//                       </span>
//                     </div>
//                   </CircularProgressbarWithChildren>
//                   <ul className="text-sm mt-4 text-center space-y-1">
//                     <li>
//                       <span className="inline-block font-inter w-3 h-3 bg-primary rounded-full mr-2 align-middle"></span>
//                       Target URL 15K
//                     </li>
//                     <li>
//                       <span className="inline-block font-inter w-3 h-3 bg-[#8794FF] rounded-full mr-2 align-middle"></span>
//                       Active URL 10K
//                     </li>
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Error Table - Fixed Structure */}
//           <div className="w-[50%] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
//             <div className="bg-primary text-white font-semibold text-sm p-3 flex justify-between text-center select-none">
//               <span className="w-[10%] font-inter">ID</span>
//               <span className="w-[30%] font-inter">Scraper Name</span>
//               <span className="w-[30%] font-inter">Error</span>
//               <span className="w-[30%] font-inter">Entity Type</span>
//               <span className="w-[15%] font-inter">Status</span>
//               <span className="w-[10%] font-inter">Action</span>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="text-gray-500 font-inter">Loading scrapers...</div>
//               </div>
//             ) : error ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="text-red-500 font-inter">{error}</div>
//               </div>
//             ) : errorBids.length === 0 ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="text-gray-500 font-inter">No scrapers found</div>
//               </div>
//             ) : (
//               errorBids.slice(0, 6).map((bid, i) => (
//                 console.log(bid),
//                 <div
//                   key={bid.id || i}
//                   className={`flex justify-between items-center text-sm px-3 py-2 ${i % 2 === 0 ? "bg-gray-100" : "bg-white"
//                     }`}
//                 >
//                   <span className="w-[10%] text-center font-inter">
//                     {bid.scraper_id || `ID-${i + 1}`}
//                   </span>
//                   <span
//                     className="truncate w-[30%] text-center font-inter"
//                     title={bid.scraper_name || "N/A"}
//                   >
//                     {bid.scraper_name || "-"}
//                   </span>
//                   <span className="w-[30%] text-center text-red-600 whitespace-nowrap font-inter"
//                     title={bid.errors.error || "N/A"}
//                   >
//                     {bid.errors.error || "-"}
//                   </span>
//                   <span className="w-[30%] text-center font-inter">
//                     {bid.entity_type || "-"}
//                   </span>
//                   <span className={`w-[15%] text-center font-inter ${bid.is_active ? "text-green-600" : "text-red-600"
//                     }`}>
//                     {bid.success ? "Success" : "Failed"} 
//                   </span>
//                   <span className="w-[10%] text-xl text-center cursor-pointer select-none font-inter">
//                     ⋮
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* URLBar Component */}
//         <URLBar />
//       </main>
//     </div>
//   );
// }















// npm install react-circular-progressbar
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faDatabase,
  faCog,
  faSignOutAlt,
  faBell,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import URLBar from "../sections/super-admin/URLBar";
import { getErrorBids } from "../services/admin.service";

export default function SuperAdmin() {
  // Values
  const activeUrlValue = 10000;
  const targetUrlValue = 15000;
  const activePercent = (activeUrlValue / targetUrlValue) * 100;

  // For animating the progress arc
  const [activeUrlProgress, setActiveUrlProgress] = useState(0);

  // Fixed: Initialize errorBids as empty array instead of empty string
  const [errorBids, setErrorBids] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Infinite scroll states
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();

  // Last element ref for infinite scroll
  const lastElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreData();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const fetchErrorBids = async (pageNumber = 1, append = false) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await getErrorBids(pageNumber, 50); // Pass page and pageSize
      console.log("API Response:", data);

      // Handle different API response structures
      const bidsArray = Array.isArray(data) ? data : (data.results || data.data || []);
      
      if (append) {
        setErrorBids(prev => [...prev, ...bidsArray]);
      } else {
        setErrorBids(bidsArray);
      }
     
      // Check if there's more data (API returns less than pageSize means no more data)
      if (bidsArray.length === 0 || bidsArray.length < 50) {
        setHasMore(false);
      }
      
      setError('');
    } catch (err) {
      setError("Failed to fetch error bids data");
      console.error("Error fetching error bids:", err);

      // Set mock data for demonstration if API fails (only if no existing data)
      if (!append) {
        const mockData = [];
        for (let i = 0; i < 20; i++) {
          mockData.push({
            id: 184 + i,
            scraper_id: `SCR-${184 + i}`,
            scraper_name: i % 2 === 0 ? "South Carolina_state" : "New York_state",
            entity_type: "State",
            file_path: `scrapping/helper/states/${i % 2 === 0 ? 'South Carolina' : 'New York'}_state.py`,
            state_name: i % 2 === 0 ? "South Carolina" : "New York",
            is_active: true,
            last_run: null,
            errors: {
              error: i % 3 === 0 ? "504 Gateway Timeout" : i % 3 === 1 ? "Connection Failed" : "Invalid Response"
            },
            success: Math.random() > 0.5,
            timeStamp: "10:56:45"
          });
        }
        setErrorBids(mockData);
      }
    } finally {
      if (pageNumber === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };
   console.log(errorBids);
  const loadMoreData = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchErrorBids(nextPage, true);
    }
  };

  useEffect(() => {
    fetchErrorBids(1, false);
  }, []);

  useEffect(() => {
    let animationFrame;
    let progress = 0;
    function animate() {
      progress += 2; // animation speed
      if (progress <= activePercent) {
        setActiveUrlProgress(progress);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setActiveUrlProgress(activePercent);
        cancelAnimationFrame(animationFrame);
      }
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [activePercent]);

  // Helper function to format time stamp
  const formatTimeStamp = (timeStamp) => {
    if (!timeStamp) return "N/A";
    // If it's already in HH:MM:SS format, return as is
    if (typeof timeStamp === 'string' && timeStamp.includes(':')) {
      return timeStamp;
    }
    // If it's a date object or ISO string, format it
    try {
      const date = new Date(timeStamp);
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timeStamp || "N/A";
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 text-white w-64 p-6 flex flex-col justify-between h-screen bg-blue">
        <div>
          <h1 className="text-2xl font-bold mb-10">
            <img src="logo.png" alt="" />
          </h1>
          <nav className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter">
              <FontAwesomeIcon icon={faLink} />
              <span>URL Scrapping</span>
            </div>
            <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter">
              <FontAwesomeIcon icon={faDatabase} />
              <span>CMS</span>
            </div>
            <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter">
              <FontAwesomeIcon icon={faCog} />
              <span>Settings</span>
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter ">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8 overflow-x-hidden bg-gray-50">
        {/* Top Nav */}
        <div className=" flex flex-wrap justify-between py-4 px-8 border-b-4 border-primary items-center gap-4 bg-white shadow-sm sticky top-0 z-10">
          <h2 className="text-2xl font-semibold font-archivo text-gray-800">
            URL Scrapping
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search titles or organization or location"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="relative w-12 h-12 rounded-full border border-blue-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faBell} className="text-primary text-lg" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
            </div>
            <button className="bg-primary text-white px-4 font-archivo py-2 rounded-full  hover:bg-blue-700 transition">
              Hi, Angela
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4 px-8 sticky top-0">
          {[
            {
              label: "Total Bids",
              value: "15,000",
              change: "+10%",
              color: "text-green-600",
              bg: "bg-[#4BF03C33]",
              note: "Growth since last month",
            },
            {
              label: "Scrapped Bids",
              value: "13,000",
              change: "+10%",
              color: "text-green-600",
              bg: "bg-[#4BF03C33]",
              note: "Growth since last month",
            },
            {
              label: "Accepted Bids",
              value: "12,000",
              change: "-10%",
              color: "text-red-600",
              bg: "bg-[#F03C3F33]",
              note: "Down from last month",
            },
            {
              label: "Error Bids",
              value: errorBids.length.toString(), // Dynamic count from API
              change: "+10%",
              color: "text-green-600",
              bg: "bg-[#4BF03C33]",
              note: "Growth since last month",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-1 border-primary shadow-md"
            >
              <h4 className="text-gray-700 font-medium mb-1 font-inter text-[22px]">{card.label}</h4>
              <div className="flex gap-2 items-center">
                <div className="text-lg font-inter">{card.value}</div>
                <div
                  className={`${card.color} ${card.bg} py-1 px-3 rounded-[50px] inline-block mt-1 font-inter text-sm`}
                >
                  {card.change}
                </div>
              </div>
              <p className="text-[#999999] mt-1 text-sm font-inter">{card.note}</p>
            </div>
          ))}
        </div>

        {/* Donut Charts and Error Table */}
        <div className="flex gap-6 px-8">
          <div className="w-[50%] bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center"
                >
                  <h3 className="font-semibold font-inter text-lg mb-2 text-black">
                    Target
                  </h3>
                  <CircularProgressbarWithChildren
                    value={activeUrlProgress}
                    maxValue={100}
                    strokeWidth={10}
                    styles={buildStyles({
                      rotation: 0.75,
                      strokeLinecap: "round",
                      trailColor: "#8794FF",
                      pathColor: "#273BE2",
                    })}
                    className="w-60 h-60"
                  >
                    <div className="text-2xl font-semibold">
                      <span className="text-primary">
                        {activeUrlValue / 1000}K
                      </span>
                      <span className="text-[#578af9]">
                        /{targetUrlValue / 1000}K
                      </span>
                    </div>
                  </CircularProgressbarWithChildren>
                  <ul className="text-sm mt-4 text-center space-y-1">
                    <li>
                      <span className="inline-block font-inter w-3 h-3 bg-primary rounded-full mr-2 align-middle"></span>
                      Target URL 15K
                    </li>
                    <li>
                      <span className="inline-block font-inter w-3 h-3 bg-[#8794FF] rounded-full mr-2 align-middle"></span>
                      Active URL 10K
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Error Table with Infinite Scroll */}
          <div className="w-[50%] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-primary text-white font-semibold text-sm p-3 flex justify-between text-center select-none">
              <span className="w-[10%] font-inter">ID</span>
              <span className="w-[30%] font-inter">Scraper Name</span>
              <span className="w-[30%] font-inter">Error</span>
              <span className="w-[30%] font-inter">Entity Type</span>
              <span className="w-[15%] font-inter">Status</span>
              <span className="w-[10%] font-inter">Action</span>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500 font-inter">Loading scrapers...</div>
                </div>
              ) : error && errorBids.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-red-500 font-inter">{error}</div>
                </div>
              ) : errorBids.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500 font-inter">No scrapers found</div>
                </div>
              ) : (
                <>
                  {errorBids.map((bid, i) => (
                    <div
                      key={bid.id || i}
                      ref={i === errorBids.length - 1 ? lastElementRef : null}
                      className={`flex justify-between items-center text-sm px-3 py-2 ${i % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                    >
                      <span className="w-[10%] text-center font-inter">
                        {bid.scraper_id || `ID-${i + 1}`}
                      </span>
                      <span
                        className="truncate w-[30%] text-center font-inter"
                        title={bid.scraper_name || "N/A"}
                      >
                        {bid.scraper_name || "-"}
                      </span>
                      <span className="w-[30%] text-center text-red-600 whitespace-nowrap font-inter"
                        title={bid.errors?.error || "N/A"}
                      >
                        {bid.errors?.error || "-"}
                      </span>
                      <span className="w-[30%] text-center font-inter">
                        {bid.entity_type || "-"}
                      </span>
                      <span className={`w-[15%] text-center font-inter ${bid.success ? "text-green-600" : "text-red-600"
                        }`}>
                        {bid.success ? "Success" : "Failed"} 
                      </span>
                      <span className="w-[10%] text-xl text-center cursor-pointer select-none font-inter">
                        ⋮
                      </span>
                    </div>
                  ))}
                  
                  {loadingMore && (
                    <div className="flex justify-center items-center py-4">
                      <div className="text-gray-500 font-inter text-sm">Loading more...</div>
                    </div>
                  )}
                  
                  {!hasMore && errorBids.length > 0 && (
                    <div className="flex justify-center items-center py-4">
                      <div className="text-gray-500 font-inter text-sm">No more data to load</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* URLBar Component */}
        <URLBar />
      </main>
    </div>
  );
}