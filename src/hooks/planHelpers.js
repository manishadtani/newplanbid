// src/utils/planHelpers.js

/**
 * Check if user can access a specific feature based on their plan
 * @param {Object} userPlan - Complete user plan object from Redux
 * @param {string} feature - Feature name to check
 * @returns {boolean} - True if user can access the feature
 */
export const canAccessFeature = (userPlan, feature) => {
  if (!userPlan) return false;
  
  const featureMap = {
    'export': () => userPlan.max_export > 0,
    'follow': () => userPlan.max_follow > 0,
    'bookmark': () => userPlan.max_bookmark > 0,
    'bid_summary': () => userPlan.access_bid_summary === true,
    'advance_search': () => userPlan.advance_search_filter === true,
    'saved_search': () => userPlan.max_saved_search > 0,
  };
  
  const checker = featureMap[feature];
  return checker ? checker() : false;
};

/**
 * Get remaining limit for a specific feature
 * @param {Object} userPlan - Complete user plan object from Redux
 * @param {string} limitType - Type of limit to check
 * @param {number} currentUsage - Current usage count (optional)
 * @returns {Object} - {remaining, total, canUse}
 */
export const getFeatureLimit = (userPlan, limitType, currentUsage = 0) => {
  if (!userPlan) {
    return { remaining: 0, total: 0, canUse: false };
  }
  
  const limitMap = {
    'export': userPlan.max_export,
    'follow': userPlan.max_follow,
    'bookmark': userPlan.max_bookmark,
    'saved_search': userPlan.max_saved_search,
    'visible_bids': userPlan.max_visible_bids
  };
  
  const total = limitMap[limitType] || 0;
  const remaining = Math.max(0, total - currentUsage);
  
  return {
    remaining,
    total,
    canUse: remaining > 0 && total > 0
  };
};

/**
 * Get feature restriction message for popup
 * @param {string} feature - Feature name
 * @param {Object} userPlan - User's current plan
 * @returns {Object} - {title, message, needsUpgrade}
 */
export const getFeatureRestrictionMessage = (feature, userPlan) => {
  const planName = userPlan?.name || 'Current Plan';
  
  const messages = {
    export: {
      title: 'Export Limit Reached',
      message: `Your ${planName} allows ${userPlan?.max_export || 0} exports. Upgrade to get more export access.`,
      needsUpgrade: true
    },
    follow: {
      title: 'Follow Limit Reached', 
      message: `Your ${planName} allows ${userPlan?.max_follow || 0} followed bids. Upgrade to follow more bids.`,
      needsUpgrade: true
    },
    bookmark: {
      title: 'Bookmark Limit Reached',
      message: `Your ${planName} allows ${userPlan?.max_bookmark || 0} bookmarks. Upgrade to bookmark more bids.`, 
      needsUpgrade: true
    },
    bid_summary: {
      title: 'Premium Feature',
      message: `Bid summary access is not available in your ${planName}. Upgrade to access detailed bid summaries.`,
      needsUpgrade: true
    },
    advance_search: {
      title: 'Advanced Search Required',
      message: `Advanced search filters are not available in your ${planName}. Upgrade to access powerful search filters.`,
      needsUpgrade: true  
    },
    saved_search: {
      title: 'Saved Search Limit',
      message: `Your ${planName} allows ${userPlan?.max_saved_search || 0} saved searches. Upgrade to save more searches.`,
      needsUpgrade: true
    }
  };
  
  return messages[feature] || {
    title: 'Feature Restricted',
    message: `This feature is not available in your ${planName}. Please upgrade your plan.`,
    needsUpgrade: true
  };
};

/**
 * Check if user's plan is free/basic
 * @param {Object} userPlan - User plan object
 * @returns {boolean}
 */
export const isFreeOrBasicPlan = (userPlan) => {
  if (!userPlan) return true;
  return userPlan.plan_code === '001' || userPlan.monthly_price === '0.00';
};

/**
 * Get plan upgrade suggestions
 * @param {Object} userPlan - Current user plan
 * @returns {Array} - Array of suggested plans
 */
export const getPlanUpgradeSuggestions = (userPlan) => {
  if (!userPlan) return [];
  
  const currentPlanCode = userPlan.plan_code;
  
  // Suggest higher tier plans based on current plan
  if (currentPlanCode === '001') { // Sneak
    return ['002', '003']; // Suggest Starter & Essentials
  } else if (currentPlanCode === '002') { // Starter  
    return ['003']; // Suggest Essentials
  }
  
  return []; // Already on highest plan
};