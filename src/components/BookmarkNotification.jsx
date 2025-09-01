import React, { useEffect } from 'react';

const BookmarkNotification = ({ 
  show, 
  message, 
  type = 'success',
  onClose,
  duration = 2000,
  position = { top: '20px', right: '20px' }
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'already':
        return '★';
      case 'error':
        return '✕';
      default:
        return '✓';
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-blue-600 shadow-blue-600/30';
      case 'already':
        return 'bg-blue-600 shadow-blue-600/30';
      case 'error':
        return 'bg-red-500 shadow-red-500/25';
      default:
        return 'bg-blue-600 shadow-blue-600/30';
    }
  };

  return (
    <>
      <div 
        className={`
          fixed z-[9999] 
          ${getStyles()}
          text-white text-xs font-medium
          px-3 py-1.5 rounded-md shadow-lg
          flex items-center gap-2
          min-w-[120px] max-w-[180px]
          transform transition-all duration-400 ease-out
          animate-slide-in-bounce
          backdrop-blur-sm
        `}
        style={{ 
          top: position.top, 
          right: position.right,
          animation: 'slideInBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div className="w-3 h-3 flex items-center justify-center">
          <span className="text-xs font-bold">
            {getIcon()}
          </span>
        </div>
        
        <span className="leading-tight truncate">
          {message}
        </span>
      </div>

      <style jsx>{`
        @keyframes slideInBounce {
          0% {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
          }
          60% {
            transform: translateX(-8%) scale(1.02);
            opacity: 1;
          }
          80% {
            transform: translateX(2%) scale(0.98);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateX(20px);
          }
        }
      `}</style>
    </>
  );
};

// Demo Component
const NotificationDemo = () => {
  const [notifications, setNotifications] = React.useState([]);

  const showNotification = (message, type) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      show: true
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Notification Demo
        </h2>
        
        <div className="space-y-3">
          <button 
            onClick={() => showNotification('Bookmark added!', 'success')}
            className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
          >
            Add Bookmark
          </button>
          
          <button 
            onClick={() => showNotification('Already bookmarked', 'already')}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Already Exists
          </button>
          
          <button 
            onClick={() => showNotification('Failed to bookmark', 'error')}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
          >
            Show Error
          </button>
          
          <button 
            onClick={() => showNotification('Link copied to clipboard!', 'success')}
            className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
          >
            Copy Link Style
          </button>
        </div>
      </div>

      {/* Render notifications */}
      {notifications.map((notification, index) => (
        <BookmarkNotification
          key={notification.id}
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
          position={{ 
            top: `${20 + (index * 50)}px`, 
            right: '20px' 
          }}
        />
      ))}
    </div>
  );
};

export default BookmarkNotification;