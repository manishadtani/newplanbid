// src/utils/planHelpers.js - Enhanced Plan Restrictions

/**
 * Plan-specific restriction configurations
 */
export const PLAN_RESTRICTIONS = {
  '001': { // Free Plan (Sneak)
    bid_summary: { restricted: true, message: "Upgrade your plan to see detailed bid summaries with full content and insights." },
    share: { restricted: true, message: "Upgrade your plan to share bids with your team and colleagues." },
    export: { restricted: true, message: "Upgrade your plan to export bid data in CSV format for analysis." },
    follow: { restricted: true, message: "Upgrade your plan to follow important bids and get notifications." },
    bookmark: { restricted: true, message: "Upgrade your plan to bookmark bids for quick access later." },
    advance_search: { restricted: true, message: "Upgrade your plan to use advanced search filters." },
    saved_search: { restricted: true, message: "Upgrade your plan to save your custom searches." },
    sorting: { restricted: true, message: "Upgrade your plan to sort bids by different criteria." },
    blur_bids: { 
      enabled: true, 
      blur_after: 3, // First 3 bids normal, rest blurred
      blur_columns: ['bid_name', 'open_date', 'closing_date', 'countdown'] 
    },
    blur_entity_dropdown: { restricted: true, message: "Upgrade to filter by entity types." }
  },
  '002': { // Starter Plan - Follow & Export Disabled, Filter Enabled
    bid_summary: { restricted: false }, // ✅ Allow bid summary access
    share: { restricted: true, message: "Upgrade your plan to share bids with your team and colleagues." },
    export: { restricted: true, message: "Upgrade to Essentials plan to export bid data in CSV format for analysis and reporting." }, // 🔥 Disabled for Starter
    follow: { restricted: true, message: "Upgrade to Essentials plan to follow important bids and get instant notifications." }, // 🔥 Disabled for Starter
     bookmark: { restricted: false, has_limit: true, limit: 5, message: "You've reached the maximum of 5 bookmarks. Upgrade to Essentials for unlimited bookmarks." }, 
    advance_search: { restricted: false }, // 🔥 ENABLED: Allow advanced search for Starter
    saved_search: { restricted: false, has_limit: true, limit: 1, message: "You've reached the maximum of 1 saved search. Upgrade to Essentials for unlimited saved searches." },
    sorting: { restricted: false }, // ✅ Allow sorting for Starter
    blur_bids: { enabled: false }, // ✅ No blur for Starter
    blur_entity_dropdown: { restricted: false } // ✅ Allow entity dropdown for Starter
  },
  '003': { // Essentials Plan - Full Access
    bid_summary: { restricted: false },
    share: { restricted: false },
    export: { restricted: false, has_limit: true, limit: 100, message: "You've reached the maximum of 100 exports. Upgrade to Essentials for more exports." }, // ✅ Enabled for Essentials
    follow: { restricted: false, has_limit: true, limit: 10, message: "You've reached the maximum of 10 Follows. Upgrade to Essentials for unlimited Follows."  }, // ✅ Enabled for Essentials
     bookmark: { restricted: false, has_limit: true, limit: 20, message: "You've reached the maximum of 20 bookmarks. Upgrade to Essentials for unlimited bookmarks." },
    advance_search: { restricted: false },
    saved_search: { restricted: false, has_limit: true, limit: 5, message: "You've reached the maximum of 5 saved search. Upgrade to Essentials for unlimited saved searches." },
    sorting: { restricted: false },
    blur_bids: { enabled: false },
    blur_entity_dropdown: { restricted: false }
  }
};

/**
 * Check if feature is restricted for current plan
 */
export const isFeatureRestricted = (userPlan, feature) => {
  console.log("🔥 isFeatureRestricted called with:", { 
    userPlan, 
    feature,
    plan_code: userPlan?.plan_code,
    plan_name: userPlan?.name 
  });
  
  if (!userPlan?.plan_code) {
    //console.log("❌ No plan_code found, returning true");
    return true;
  }
  
  const restrictions = PLAN_RESTRICTIONS[userPlan.plan_code];
  //console.log("📋 Plan restrictions for", userPlan.plan_code, ":", restrictions);
  
  if (!restrictions || !restrictions[feature]) {
    //console.log("✅ No restrictions found for feature", feature);
    return false;
  }
  
  const isRestricted = restrictions[feature].restricted === true;
  //console.log("🎯 Feature", feature, "restricted:", isRestricted);
  
  return isRestricted;
};

/**
 * Get feature restriction details
 */
export const getFeatureRestriction = (userPlan, feature) => {
  if (!userPlan?.plan_code) {
    return {
      restricted: true,
      message: "Please login to access this feature",
      needsUpgrade: true
    };
  }
  
  const restrictions = PLAN_RESTRICTIONS[userPlan.plan_code];
  if (!restrictions || !restrictions[feature]) {
    return { restricted: false, message: null, needsUpgrade: false };
  }
  
  const restriction = restrictions[feature];
  return {
    restricted: restriction.restricted || false,
    message: restriction.message || null,
    needsUpgrade: restriction.restricted === true,
    hasLimit: restriction.has_limit || false
  };
};

/**
 * Check if bids should be blurred
 */
export const shouldBlurBids = (userPlan, bidIndex) => {
  if (!userPlan?.plan_code) return true;
  
  const restrictions = PLAN_RESTRICTIONS[userPlan.plan_code];
  if (!restrictions?.blur_bids?.enabled) return false;
  
  return bidIndex >= restrictions.blur_bids.blur_after;
};

/**
 * Get blur configuration for bids
 */
export const getBidBlurConfig = (userPlan) => {
  if (!userPlan?.plan_code) {
    return { 
      enabled: true, 
      blur_after: 0, 
      blur_columns: ['bid_name', 'open_date', 'closing_date', 'countdown'] 
    };
  }
  
  const restrictions = PLAN_RESTRICTIONS[userPlan.plan_code];
  return restrictions?.blur_bids || { enabled: false };
};

/**
 * Enhanced restriction message generator
 */
export const getRestrictionPopupData = (feature, userPlan) => {
  const planName = userPlan?.name || 'Free Plan';
  const restriction = getFeatureRestriction(userPlan, feature);
  
  const popupData = {
    bid_summary: {
      title: "🔒 Bid Summary Locked",
      message: restriction.message || "Upgrade your plan to access detailed bid summaries with full content and insights.",
      icon: "fa-file-alt",
      ctaText: "Upgrade to View Summary"
    },
    share: {
      title: "🔒 Share Feature Locked", 
      message: restriction.message || "Upgrade your plan to share bids with your team and colleagues.",
      icon: "fa-share-alt",
      ctaText: "Upgrade to Share Bids"
    },
    export: {
      title: "🔒 Export Feature Locked",
      message: restriction.message || "Upgrade your plan to export bid data in CSV format for analysis.",
      icon: "fa-download",
      ctaText: "Upgrade to Export Data"
    },
    follow: {
      title: "🔒 Follow Feature Locked",
      message: restriction.message || "Upgrade your plan to follow important bids and get notifications.",
      icon: "fa-heart",
      ctaText: "Upgrade to Follow Bids"
    },
    bookmark: {
      title: "🔒 Bookmark Feature Locked",
      message: restriction.message || "Upgrade your plan to bookmark bids for quick access later.",
      icon: "fa-bookmark",
      ctaText: "Upgrade to Bookmark"
    },
    sorting: {
      title: "🔒 Sorting Feature Locked",
      message: restriction.message || "Upgrade your plan to sort bids by different criteria.",
      icon: "fa-sort",
      ctaText: "Upgrade to Sort Bids"
    },
    blur_entity_dropdown: {
      title: "🔒 Filter Feature Locked",
      message: restriction.message || "Upgrade your plan to filter bids by entity types.",
      icon: "fa-filter",
      ctaText: "Upgrade to Filter"
    }
  };
  
  return {
    ...popupData[feature],
    restricted: restriction.restricted,
    needsUpgrade: restriction.needsUpgrade,
    currentPlan: planName,
    feature: feature
  };
};

/**
 * 🚀 NEW: Feature Usage Validation Function
 * This function validates feature usage based on plan restrictions and limits
 */
export const validateFeatureUsage = (feature, showRestrictionCallback, currentUsage = 0) => {
  // Get user plan from Redux store or localStorage
  const userPlan = getUserPlan(); // You'll need to implement this function
  
  if (!userPlan) {
    showRestrictionCallback(
      "Login Required",
      "Please login to access this feature.",
      "Authentication Required",
      false
    );
    return false;
  }

  const restriction = getFeatureRestriction(userPlan, feature);
  
  if (restriction.restricted) {
    const popupData = getRestrictionPopupData(feature, userPlan);
    showRestrictionCallback(
      popupData.title,
      popupData.message,
      popupData.feature,
      popupData.needsUpgrade
    );
    return false;
  }

  // Check usage limits for features that have limits
  if (restriction.hasLimit && feature === 'follow') {
    const FOLLOW_LIMIT = 25; // Standard follow limit
    
    if (currentUsage >= FOLLOW_LIMIT) {
      showRestrictionCallback(
        "Follow Limit Reached",
        `You've reached the maximum of ${FOLLOW_LIMIT} followed bids. Upgrade for unlimited follows.`,
        "Follow Limit",
        true
      );
      return false;
    }
  }

  return true; // Feature is allowed
};

/**
 * Helper function to get user plan (implement based on your Redux structure)
 */
const getUserPlan = () => {
  // This should be implemented based on how you access the Redux store
  // For now, returning null - you'll need to implement this
  try {
    // Option 1: If you can access Redux store directly
    // const store = getStore(); // You'll need to implement getStore()
    // return store.getState().login?.user?.plan;
    
    // Option 2: Get from localStorage as fallback
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      return user?.plan;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user plan:', error);
    return null;
  }
};