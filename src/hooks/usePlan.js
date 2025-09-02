// src/hooks/usePlan.js - Enhanced Plan Hook with New Restrictions
import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { 
  isFeatureRestricted,
  getFeatureRestriction, 
  getRestrictionPopupData,
  shouldBlurBids,
  getBidBlurConfig,
  validateFeatureUsage
} from '../hooks/planHelpers'; // 🔥 Fixed import path

export const usePlan = () => {
  const userPlan = useSelector((state) => state.login?.user?.plan);
  const isLoggedIn = useSelector((state) => !!state.login?.user);

  // Plan info with restriction details
  const planInfo = useMemo(() => {
    if (!userPlan) return null;
    
    return {
      name: userPlan.name,
      code: userPlan.plan_code,
      isFree: userPlan.plan_code === '001',
      isStarter: userPlan.plan_code === '002', 
      isEssentials: userPlan.plan_code === '003',
      displayName: userPlan.name || 'Free Plan'
    };
  }, [userPlan]);

  // Feature restriction checkers
  const checkRestriction = useCallback((feature) => {
    return getFeatureRestriction(userPlan, feature);
  }, [userPlan]);

  const isRestricted = useCallback((feature) => {
    return isFeatureRestricted(userPlan, feature);
  }, [userPlan]);

  // Popup data generator
  const getPopupData = useCallback((feature) => {
    return getRestrictionPopupData(feature, userPlan);
  }, [userPlan]);

  // Bid blur configuration
  const blurConfig = useMemo(() => {
    return getBidBlurConfig(userPlan);
  }, [userPlan]);

  const shouldBlurBid = useCallback((bidIndex) => {
    return shouldBlurBids(userPlan, bidIndex);
  }, [userPlan]);

  // 🔥 FIXED: Feature validation with popup trigger
  const validateAndExecute = useCallback((feature, onRestricted, executeFunction) => {
    const restriction = checkRestriction(feature);
    
    if (restriction.restricted) {
      const popupData = getPopupData(feature);
      onRestricted(popupData);
      return false;
    }
    
    // Execute the function if not restricted
    if (executeFunction) {
      executeFunction();
    }
    return true;
  }, [checkRestriction, getPopupData]);

  // 🔥 NEW: Enhanced validateFeatureUsage wrapper for this hook
  const validateFeatureUsageWrapper = useCallback((feature, showRestrictionCallback, currentUsage = 0) => {
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
  }, [userPlan, getFeatureRestriction, getRestrictionPopupData]);

  return {
    // Plan data
    userPlan,
    isLoggedIn, 
    planInfo,
    
    // Restriction checking
    isRestricted,
    checkRestriction,
    getPopupData,
    validateAndExecute,
    validateFeatureUsage: validateFeatureUsageWrapper, // 🔥 Export the wrapper function
    
    // Bid blur functionality
    blurConfig,
    shouldBlurBid,
    
    // Quick access checkers for components
    restrictions: {
      bidSummary: isRestricted('bid_summary'),
      share: isRestricted('share'),
      export: isRestricted('export'),
      follow: isRestricted('follow'),
      bookmark: isRestricted('bookmark'),
      advanceSearch: isRestricted('advance_search'),
      savedSearch: isRestricted('saved_search'),
      sorting: isRestricted('sorting'), // ✅ NEW: Sorting restriction
      entityDropdown: isRestricted('blur_entity_dropdown') // ✅ NEW: Entity dropdown restriction
    }
  };
};