import React from 'react';
import { X, Crown, AlertTriangle } from 'lucide-react';

const FeatureRestrictionPopup = ({ 
  isOpen, 
  onClose, 
  onUpgrade,
  title = "Feature Restricted",
  message = "This feature is not available in your current plan.",
  featureName = "Premium Feature",
  showUpgradeButton = true 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{title}</h2>
              <p className="text-white/90 text-sm">{featureName}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Main Message */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="text-orange-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-3">
              Access Restricted
            </h3>
            {/* Backend Message Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Close
            </button>
            
            {showUpgradeButton && (
              <button
                onClick={onUpgrade}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-sm flex items-center justify-center gap-2"
              >
                <Crown size={16} />
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureRestrictionPopup;