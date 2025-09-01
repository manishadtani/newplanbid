import React, { useEffect, useState } from "react";

const BidHeader = ({
  title = "No Title",
  org,
  location,
  postedDate = "-",
  deadline = "2025-07-31T23:59:59Z",
  sourceLink,
  onBookmark,
  isBookmarking,
}) => {

  // console.log(title, "Title from props");
  // console.log(org, "Organization from props");
  // console.log(location, "Location from props");
  // console.log(postedDate, "Posted Date from props");
  // console.log(deadline, "Deadline from props");
  // console.log(sourceLink, "Source Link from props");
  console.log(onBookmark, "onBookmark from props");
  console.log(isBookmarking, "isBookmarking from props");

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    let interval;

    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(deadline);
      const diff = target - now;

      if (isNaN(target.getTime()) || diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  const progressPercent = Math.max(
    0,
    Math.min(100, ((30 - countdown.days) / 30) * 100)
  );

  return (
    <div className="">
      <div className="container-fixed">
        <div className="summary flex flex-col md:flex-row justify-between items-center shadow-lg gap-6 md:gap-0">
          {/* Left Section */}
          <div className="w-[70%]">
            <h2 className="text-h3 font-bold font-archivo">{title}</h2>
            <img src="/summary-line.png" className="w-full my-4" alt="divider" />

            <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 text-sm md:text-base">
              {[
                { icon: "fa-map-marker-alt", label: "Location", value: location },
                { icon: "fa-calendar-alt", label: "Posted", value: formatDate(postedDate) },
                { icon: "fa-history", label: "Deadline", value: formatDate(deadline) },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center flex-col text-center gap-2">
                  <i className={`fas text-xl ${item.icon}`}></i>
                  <div>
                    <p className="font-inter text-xl text-[#DBDBDB]">{item.label}</p>
                    <p className="font-inter text-p text-white">{item.value}</p>
                  </div>
                </div>
              ))}

              {/* External Link or Disabled */}
              {sourceLink && sourceLink !== "nd-bidder" ? (
                <a
                  href={sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center flex-col text-center gap-2"
                >
                  <i className="fas text-xl fa-external-link"></i>
                  <div>
                    <p className="font-inter text-xl text-[#DBDBDB]">Open Source</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center flex-col text-center gap-2 opacity-50 cursor-not-allowed">
                  <i className="fas text-xl fa-external-link"></i>
                  <div>
                    <p className="font-inter text-xl text-[#DBDBDB]">Open Source</p>
                  </div>
                </div>
              )}


              {/* Save Button */}
              {onBookmark ? (
                <button
                  onClick={onBookmark}
                  disabled={isBookmarking}
                  className={`flex items-center flex-col text-center gap-2 transition-opacity ${isBookmarking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                    }`}
                >
                  <i className={`fas text-xl fa-bookmark ${isBookmarking ? 'fa-spin' : ''}`}></i>
                  <div>
                    <p className="font-inter text-xl text-[#DBDBDB]">
                      {isBookmarking ? 'Booking...' : 'Bookmark'}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center flex-col text-center gap-2 opacity-50 cursor-not-allowed">
                  <i className="fa-solid text-xl fa-bookmark"></i>
                  <div>
                    <p className="font-inter text-xl text-[#DBDBDB]">Bookmark</p>
                  </div>
                </div>
              )}



            </div>
          </div>

          {/* Countdown Section */}
          <div className="flex flex-col items-center text-center">
            <p className="font-archivo text-white text-p font-bold mb-2">Countdown</p>
            <div className="relative w-40 h-40 mb-3">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle
                  className="text-gray-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  r="16"
                  cx="18"
                  cy="18"
                />
                <circle
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="transparent"
                  r="16"
                  cx="18"
                  cy="18"
                  strokeDasharray="100"
                  strokeDashoffset={(100 - progressPercent).toFixed(2)}
                  transform="rotate(-90 18 18)"
                />
                <text
                  x="50%"
                  y="46%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="text-[0.35rem] fill-white font-bold"
                >
                  {countdown.days}
                </text>
                <text
                  x="50%"
                  y="58%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="text-[0.15rem] fill-white font-inter"
                >
                  Days Left
                </text>
              </svg>
            </div>

            {/* <div className="flex gap-6 text-sm mt-2">
              {[
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-archivo font-bold text-p xl:text-[28px]">
                    {String(item.value).padStart(2, "0")}
                  </p>
                  <p className="text-gray-300 font-inter text-xl">{item.label}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidHeader;
