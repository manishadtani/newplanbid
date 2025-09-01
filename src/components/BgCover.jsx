import React from "react";
import { Link } from "react-router-dom";

function BgCover({ children, title, description, onClick }) {
  
  return (
    <div className="tooltip-wrapper relative" onClick={onClick}>
      <div className="bg-btn border-1 border-solid border-white p-4 px-5 rounded-[30px] font-inter">
        {children}
      </div>
      <div className="tooltip absolute right-[30%] bottom-[120%] w-[200px] rounded-[20px] p-3 bg-[#7180FF]">
        <div className="text-box">
          <h1 className="text-sm font-inter font-medium text-white">
           {title}
          </h1>
          <p className="text-[12px] font-inter font-light text-white mt-1">
           {description}
          </p>
        </div>
        <div className="text-end relative">
          <Link className=" bg-white text-[12px] font-inter font-light border-0 p-1 px-2 rounded-[8px]">
            Buy plan
          </Link>
          <i className="fas fa-triangle text-[#7180FF] absolute rotate-180 top-[120%] right-[20%]"></i>
        </div>
      </div>
    </div>
  );
}

export default BgCover;
