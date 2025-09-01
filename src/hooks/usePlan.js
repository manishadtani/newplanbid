// src/hooks/usePlan.js
import { useSelector } from 'react-redux';
import { canAccessFeature, getFeatureLimit, getFeatureRestrictionMessage, isFreeOrBasicPlan } from '../hooks/planHelpers';

/**
 * Custom hook for plan-based feature access
 * @returns {Object} - Plan utilities and user plan data
 */
export const usePlan = () => {
  // Get user plan from Redux store
  const userPlan = useSelector((state) => state.login?.user?.plan);
  const isLoggedIn = useSelector((state) => !!state.login?.user);

  /**
   * Check if user can access a feature
   * @param {string} feature - Feature name to check
   * @returns {boolean}
   */
  const hasFeatureAccess = (feature) => {
    if (!isLoggedIn || !userPlan) return false;
    return canAccessFeature(userPlan, feature);
  };

  /**
   * Get feature limit information
   * @param {string} limitType - Type of limit to check
   * @param {number} currentUsage - Current usage (optional)
   * @returns {Object} - {remaining, total, canUse}
   */
  const getLimit = (limitType, currentUsage = 0) => {
    return getFeatureLimit(userPlan, limitType, currentUsage);
  };

  /**
   * Get restriction message for a feature
   * @param {string} feature - Feature name
   * @returns {Object} - {title, message, needsUpgrade}
   */
  const getRestrictionMessage = (feature) => {
    return getFeatureRestrictionMessage(feature, userPlan);
  };

  /**
   * Check if user should see upgrade prompts
   * @returns {boolean}
   */
  const shouldShowUpgrade = () => {
    return isFreeOrBasicPlan(userPlan);
  };

  /**
   * Validate feature usage before action
   * @param {string} feature - Feature to validate
   * @param {Function} onRestricted - Callback when restricted
   * @param {number} currentUsage - Current usage count (optional)
   * @returns {boolean} - True if can proceed, false if restricted
   */
  const validateFeatureUsage = (feature, onRestricted, currentUsage = 0) => {
    if (!hasFeatureAccess(feature)) {
      const restriction = getRestrictionMessage(feature);
      onRestricted(restriction.title, restriction.message, feature, restriction.needsUpgrade);
      return false;
    }

    // For features with limits, check remaining usage
    if (['export', 'follow', 'bookmark', 'saved_search'].includes(feature)) {
      const limit = getLimit(feature, currentUsage);
      if (!limit.canUse) {
        const restriction = getRestrictionMessage(feature);
        onRestricted(restriction.title, restriction.message, feature, restriction.needsUpgrade);
        return false;
      }
    }

    return true;
  };

  /**
   * Get plan display information
   * @returns {Object} - Plan display data
   */
  const getPlanInfo = () => {
    if (!userPlan) return null;
    
    return {
      name: userPlan.name,
      code: userPlan.plan_code,
      isFree: userPlan.plan_code === '001',
      limits: {
        export: userPlan.max_export,
        follow: userPlan.max_follow,
        bookmark: userPlan.max_bookmark,
        savedSearch: userPlan.max_saved_search,
        visibleBids: userPlan.max_visible_bids
      },
      features: {
        bidSummary: userPlan.access_bid_summary,
        advanceSearch: userPlan.advance_search_filter
      },
      pricing: {
        monthly: userPlan.monthly_price,
        annual: userPlan.annual_price
      }
    };
  };

  return {
    // Plan data
    userPlan,
    isLoggedIn,
    planInfo: getPlanInfo(),
    
    // Feature checking
    hasFeatureAccess,
    getLimit,
    getRestrictionMessage,
    shouldShowUpgrade,
    validateFeatureUsage,
    
    // Quick access helpers
    canExport: hasFeatureAccess('export'),
    canFollow: hasFeatureAccess('follow'),
    canBookmark: hasFeatureAccess('bookmark'),
    canAccessBidSummary: hasFeatureAccess('bid_summary'),
    canUseAdvanceSearch: hasFeatureAccess('advance_search'),
    canSaveSearch: hasFeatureAccess('saved_search')
  };
};