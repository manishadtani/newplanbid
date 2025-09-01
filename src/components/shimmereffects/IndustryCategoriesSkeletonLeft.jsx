import React from "react";

const IndustryCategoriesSkeletonLeft = () => {
  return (
    <div className="form-left w-[200rem] bg-blue-900 h-full">
      <div className="pe-3 flex flex-col justify-between h-full animate-pulse">
        
        {/* Header skeleton */}
        <div>
          <div className="mb-6">
            <div className="h-6 w-32 bg-#424DAA rounded mb-2"></div>
            <div className="h-4 w-20 bg-#424DAA rounded"></div>
          </div>

          {/* Hero Heading Skeleton */}
          <div className="space-y-3">
            {/* <div className="h-8 w-3/4 bg-#424DAA rounded"></div>
            <div className="h-4 w-5/6 bg-#424DAA rounded"></div> */}
            {/* <div className="h-4 w-2/3 bg-#424DAA rounded"></div> */}
          </div>
        </div>

        {/* Middle content skeleton */}
        <div className="flex flex-col gap-6">
          {/* Search box skeleton */}
          <div className="h-12 bg-white/20 rounded-xl"></div>

          {/* Title skeleton */}
          <div className="h-5 w-40 bg-white/20 rounded mx-auto"></div>

          {/* Industries grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[600px] overflow-y-auto pe-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-52 bg-white/20 rounded-lg"
              ></div>
            ))}
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between mt-6">
          <div className="h-10 w-24 bg-white/20 rounded-lg"></div>
          <div className="flex gap-3">
            <div className="h-10 w-20 bg-white/20 rounded-lg"></div>
            <div className="h-10 w-20 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryCategoriesSkeletonLeft;
