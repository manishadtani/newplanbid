// import React, { useState } from 'react';

// const BlogShareButton = ({ url, onShare }) => {
//   const [showMessage, setShowMessage] = useState(false);

//   const handleShare = async (e) => {
//     e.stopPropagation();
    
//     try {
//       await navigator.clipboard.writeText(url);
//       setShowMessage(true);
//       setTimeout(() => {
//         setShowMessage(false);
//       }, 2000);
      
//       if (onShare) onShare();
//     } catch (err) {
//       console.error('Failed to copy: ', err);
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = url;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
      
//       setShowMessage(true);
//       setTimeout(() => {
//         setShowMessage(false);
//       }, 2000);
      
//       if (onShare) onShare();
//     }
//   };

//   return (
//     <div className="relative">
//       <button onClick={handleShare}>
//         <i className="fas fa-share-alt"></i>
//       </button>

//       {/* Success message positioned relative to share button */}
//       {showMessage && (
//         <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap">
//           <div className="bg-[#4354CB] text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
//             <div className="flex items-center gap-2">
//               <i className="fas fa-check-circle text-green-300"></i>
//               Link copied!
//             </div>
//             {/* Small arrow pointing up */}
//             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#4354CB]"></div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BlogShareButton;











import React, { useState } from 'react';

const BlogShareButton = ({ url, onShare }) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(url);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      
      if (onShare) onShare();
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      
      if (onShare) onShare();
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleShare}
        className="text-white hover:text-white/80 transition-colors duration-200 p-1 rounded"
        title="Copy link to clipboard"
      >
       <i className="fas fa-share-alt"></i>
      </button>

      {/* Success message positioned relative to share button */}
      {showMessage && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-[9999] whitespace-nowrap pointer-events-none">
          <div className="bg-[#4354CB] text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in relative">
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-green-300"></i>
              Link copied!
            </div>
            {/* Small arrow pointing down to button */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#4354CB]"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlogShareButton;