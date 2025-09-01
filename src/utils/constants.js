// src/utils/constants.js

// 🔥 YE CONSTANTS FILE HAI - Yahan sabhi fixed values rakhte hain
// WHY: Agar kabhi change karna ho to ek hi jagah change karo, har jagah nhi

export const DASHBOARD_CONSTANTS = {
  PER_PAGE: 25, // Ye aapke dashboard mein "const perPage = 25" tha
  
  // Ye aapके dashboard mein default filters ka object tha jo 2 baar repeat ho raha tha
  DEFAULT_FILTERS: {
    status: "Active",
    keyword: { include: [], exclude: [] },
    location: {           // CHANGE FROM: location: []
      federal: false,
      states: [],
      local: []
    },  
    UNSPSCCode: [],
    NAICSCode: [],
    publishedDate: { after: "", before: "" },
    closingDate: { after: "", before: "" },
    solicitationType: [],
    ordering: "closing_date",
    entityType: "",
  },
  
  FILTER_TABS: {
    DEFAULT: "Status" // Ye "Status" tab default tha aapke code mein
  }
};

// 🔥 YE MIDDLE SECTION KA DATA HAI 
// Aapके dashboard mein "middle" array tha - usko yahan shift kar diya
export const STAT_ITEMS = [
  { id: 1, title: "Total Bids", key: "totalBids" },
  { id: 2, title: "Active Bids", key: "activeBids" },
  { id: 3, title: "New Bids", key: "newBids" },
  { id: 4, title: "Saved", key: "saved" },
  { id: 5, title: "Followed", key: "followed" },
];