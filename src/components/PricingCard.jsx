// components/PricingCard.jsx
import React from "react";

function PricingCard({ title, price, features, delay, icon, planDetails, isComingSoon }) {
  console.log(planDetails, "🔥 Plan details in card");
  
  return (
    <div className={`bg-blue text-white h-[700px] w-full min-w-[320px] mx-auto p-6 rounded-3xl shadow-lg flex flex-col border border-white border-1 relative`} data-aos="fade-up" data-aos-delay={delay}>
      
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-80 rounded-3xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-lg text-gray-200">Stay tuned for updates!</p>
          </div>
        </div>
      )}

      <div className="mb-4 w-20 h-20">
        <img src={icon} className="w-full" alt="" />
      </div>
      <h3 className="text-[30px] font-h font-semibold text-start">{title}</h3>
      <div className="flex items-center gap-3">
        <div className="text-[50px] font-bold font-h">${price}</div>
        <div className="">
          <img src="discount.png" className="w-[100%] max-w-[130px]" alt="" />
        </div>
      </div>
      
      <button className={`bg-btn border border-white text-white p-4 font-inter font-medium rounded-2xl my-3 ${isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isComingSoon}>
        {isComingSoon ? "Coming Soon" : "UpGrade to Plus"}
      </button>
      
      <ul className="text-sm text-start flex-1 overflow-y-auto">
        {features && features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xl mb-2">
            <span className="text-white"><i className="far fa-check"></i></span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PricingCard;