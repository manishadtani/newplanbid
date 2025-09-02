// 1. UPDATED SummaryPage.js - Add bookmark limit validation with popup
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BidHeader from "../sections/summary/BidHeader";
import SummaryContent from "../sections/summary/SummaryContent";
import BidTracking from "../sections/summary/BidTracking";
import AiFeature from "../sections/summary/AiFeature";
import SimilarBids from "../sections/summary/SimilarBids";
import { BookMarkedBids, getBids, totalBookmarkedBids } from "../services/bid.service.js";
import { similarBids } from "../services/user.service.js";
import BookmarkNotification from "../components/BookmarkNotification.jsx";
import FeatureRestrictionPopup from "../components/FeatureRestrictionPopup.jsx"; // ✅ Import popup
import { usePlan } from "../hooks/usePlan";

function SummaryPage() {
  const { id } = useParams();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);

  // Similar bids state
  const [similarBidsData, setSimilarBidsData] = useState([]);
  const [similarBidsLoading, setSimilarBidsLoading] = useState(false);
  const [similarBidsError, setSimilarBidsError] = useState(null);
  
  // Bookmark state
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedCount, setBookmarkedCount] = useState(0); // ✅ Track bookmark count
  
  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  // ✅ NEW: Feature restriction popup state
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const [featurePopupData, setFeaturePopupData] = useState({});
  
  const { planInfo, validateFeatureUsage, getFeatureRestriction } = usePlan();
  console.log(id, "ID from URL");

  const fallback = {
    bid_name: "Unknown Bid",
    jurisdiction: "Unknown Organization",
    state: { name: "" },
    open_date: "-",
    closing_date: "-",
    source: "#",
  };

  // ✅ NEW: Fetch bookmarked count
  useEffect(() => {
    const fetchBookmarkedCount = async () => {
      try {
        const bookmarkedBids = await totalBookmarkedBids();
        setBookmarkedCount(bookmarkedBids.length);
        
        // Check if current bid is bookmarked
        const isCurrentBidBookmarked = bookmarkedBids.some(bookmark => bookmark.id === parseInt(id));
        setIsBookmarked(isCurrentBidBookmarked);
      } catch (error) {
        console.error("Error fetching bookmarked count:", error);
      }
    };

    if (id && planInfo) {
      fetchBookmarkedCount();
    }
  }, [id, planInfo]);

  // Existing bid fetch useEffect
  useEffect(() => {
    const fetchBid = async () => {
      try {
        const data = await getBids(id);
        console.log(data, "Bid data fetched");
        setBid(data);
      } catch (err) {
        console.error("❌ Failed to fetch bid", err);
        setBid(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBid();
  }, [id]);

  // Similar bids fetch useEffect
  useEffect(() => {
    const fetchSimilarBids = async () => {
      if (!id) return;

      setSimilarBidsLoading(true);
      setSimilarBidsError(null);

      try {
        const data = await similarBids(id);
        console.log(data, "🔥 Similar bids fetched");
        setSimilarBidsData(data);
        console.log("🔥 Similar bids loaded:", data);
      } catch (err) {
        console.error("❌ Failed to fetch similar bids:", err);
        setSimilarBidsError("Failed to load similar bids");
        setSimilarBidsData([]);
      } finally {
        setSimilarBidsLoading(false);
      }
    };

    // Only fetch similar bids after main bid is loaded
    if (bid && id) {
      fetchSimilarBids();
    }
  }, [id, bid]);

  const bidData = bid || fallback;
  console.log("Bid Data:", bidData);

  // ✅ NEW: Show feature restriction popup
  const showFeatureRestriction = (title, message, featureName, showUpgrade) => {
    setFeaturePopupData({
      title,
      message,
      featureName,
      showUpgrade,
      currentPlan: planInfo?.name || 'Free Plan'
    });
    setShowFeaturePopup(true);
  };

  // ✅ UPDATED: Enhanced bookmark handler with limit validation
  const handleBookmark = async () => {
    if (!id || isBookmarked) return; // Don't bookmark if already bookmarked

    console.log("🔍 Bookmark validation - Plan:", planInfo?.plan_code, "Count:", bookmarkedCount);

    // ✅ Check bookmark limits for Starter plan (002)
    if (planInfo?.plan_code === '002' && bookmarkedCount >= 5) {
      showFeatureRestriction(
        "🔒 Bookmark Limit Reached",
        "You've reached the maximum of 5 bookmarks. Upgrade to Essentials for unlimited bookmarks.",
        "bookmark",
        true
      );
      return;
    }

    // ✅ Check if feature is restricted (for Free plan)
    if (!validateFeatureUsage('bookmark', showFeatureRestriction, bookmarkedCount)) {
      return; // Validation failed, popup already shown
    }

    setIsBookmarking(true);
    try {
      const response = await BookMarkedBids(id);
      console.log("✅ Bid bookmarked successfully:", response);
      
      // Success case
      setIsBookmarked(true);
      setBookmarkedCount(prev => prev + 1); // ✅ Update count
      setNotification({
        show: true,
        message: "Bookmark added!",
        type: 'success'
      });

    } catch (err) {
      console.error("Upgrade your plan to bookmark bid:", err);
      
      // Check if already bookmarked (400/409 status codes)
      if (err.response?.status === 400 || err.response?.status === 409) {
        setIsBookmarked(true);
        setNotification({
          show: true,
          message: "Already bookmarked",
          type: 'already'
        });
      } else {
        // Other errors
        setNotification({
          show: true,
          message: "Upgrade your plan to bookmark",
          type: 'error'
        });
      }
    } finally {
      setIsBookmarking(false);
    }
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // ✅ Close feature popup
  const handleCloseFeaturePopup = () => {
    setShowFeaturePopup(false);
  };

  // 🔥 Determine location based on entity_type
  const getLocation = () => {
    if (bidData.entity_type === "Federal") {
      return "sam.gov";
    }
    return bidData.state?.name || fallback.state.name;
  };

  return (
    <div className="py-[120px] bg-blue">
      <div className="min-h-screen bg-gradient-to-br text-white p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Card */}

          <div className="rounded-2xl bg-white/5 backdrop-blur-md shadow-xl">
            <BidHeader
              title={bidData.bid_name || fallback.bid_name}
              org={bidData.jurisdiction || fallback.jurisdiction}
              location={getLocation()} // 🔥 Use the dynamic location function
              postedDate={
                bidData.open_date
                  ? new Date(bidData.open_date).toLocaleDateString()
                  : fallback.open_date
              }
              deadline={bidData.closing_date || fallback.closing_date}
              sourceLink={bidData.source || fallback.source}
              onBookmark={handleBookmark}
              isBookmarking={isBookmarking}
            />
          </div>

          {/* Summary Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
            <SummaryContent bidData={bidData} />
          </div>

          {/* Bid Tracking + AI Features + Similar Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
                <BidTracking bidData={bidData} />
              </div>

              {/* 🔥 UPDATED: Pass similar bids data as props */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
                <SimilarBids
                  bidData={bidData}
                  similarBids={similarBidsData.slice(0, 2)} // 🔥 Similar bids array
                  loading={similarBidsLoading}   // 🔥 Loading state
                  error={similarBidsError}       // 🔥 Error state
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
              <AiFeature bidData={bidData} />
            </div>
          </div>
        </div>
      </div>

      <BookmarkNotification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        duration={2000}
        position={{ top: '280px', right: '410px' }}
      />


    </div>
  );
}

export default SummaryPage;