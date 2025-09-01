import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faCopy,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { scrapperBids } from "../../services/admin.service";

library.add(faEllipsisV, faCopy, faTrash, faEdit);

// const data = [
//   {
//     id: "ID-37",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/123",
//     bidName: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Automated",
//   },
//   {
//     id: "ID-38",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/456",
//     bidName: "DOCUMENT COPYING & DISTRIBUTION SERVICES",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Manual",
//   },
//   {
//     id: "ID-39",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/789",
//     bidName: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Automated",
//   },
//   {
//     id: "ID-40",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/101",
//     bidName: "DOCUMENT COPYING & DISTRIBUTION SERVICES",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Manual",
//   },
//   {
//     id: "ID-41",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/102",
//     bidName: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Automated",
//   },
//   {
//     id: "ID-42",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/103",
//     bidName: "DOCUMENT COPYING & DISTRIBUTION SERVICES",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Manual",
//   },
//   {
//     id: "ID-43",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/104",
//     bidName: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Automated",
//   },
//   {
//     id: "ID-44",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/105",
//     bidName: "DOCUMENT COPYING & DISTRIBUTION SERVICES",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Manual",
//   },
//   {
//     id: "ID-45",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/106",
//     bidName: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Automated",
//   },
//   {
//     id: "ID-46",
//     url: "https://www.bidnetdirect.com/private/sup...",
//     fullUrl: "https://www.bidnetdirect.com/private/support/bid/107",
//     bidName: "DOCUMENT COPYING & DISTRIBUTION SERVICES",
//     type: "Federal",
//     time: "10:56:45",
//     override: "Manual",
//   },
// ];


const URLBar = () => {
  const [actionOpenRow, setActionOpenRow] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
   const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


   useEffect(() => {
    const fetchScrapperBids = async () => {
      try {
        setLoading(true);
        const apiData = await scrapperBids();
        console.log("Scrapper Bids API Response:", apiData);
        
        // Handle different API response structures
        const bidsArray = Array.isArray(apiData) ? apiData : (apiData.results || apiData.data || []);
        setData(bidsArray);
        setError('');
      } catch (err) {
        setError("Failed to fetch scrapper bids data");
        console.error("Error fetching scrapper bids:", err);
        
        // Set mock data for demonstration if API fails
        setData([
          {
            id: "ID-37",
            url: "https://www.bidnetdirect.com/private/sup...",
            fullUrl: "https://www.bidnetdirect.com/private/support/bid/123",
            bidName: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
            name: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
            type: "Federal",
            entity_type_name: "Federal",
            time: "10:56:45",
            last_run: "10:56:45",
            override: "Automated",
            is_active: true,
          },
          {
            id: "ID-38",
            url: "https://www.bidnetdirect.com/private/sup...",
            fullUrl: "https://www.bidnetdirect.com/private/support/bid/456",
            bidName: "DOCUMENT COPYING & DISTRIBUTION SERVICES",
            name: "DOCUMENT COPYING & DISTRIBUTION SERVICES",
            type: "Federal",
            entity_type_name: "Federal",
            time: "10:56:45",
            last_run: "10:56:45",
            override: "Manual",
            is_active: false,
          },
          {
            id: "ID-39",
            url: "https://www.bidnetdirect.com/private/sup...",
            fullUrl: "https://www.bidnetdirect.com/private/support/bid/789",
            bidName: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
            name: "ADDRESSING, COPYING, MIMEOGRAPH, AND SPIRIT...",
            type: "Federal",
            entity_type_name: "Federal",
            time: "10:56:45",
            last_run: "10:56:45",
            override: "Automated",
            is_active: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapperBids();
  }, []);

  const toggleAction = (index) => {
    setActionOpenRow((prev) => (prev === index ? null : index));
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getOverrideStyles = (status) => {
    return status === "Automated"
      ? "bg-green-100 text-green-700 border border-green-500"
      : "bg-red-100 text-red-700 border border-red-500";
  };

  return (
    <div className="flex gap-6 px-8 pb-8">
    <div className="overflow-x-auto bg-primary rounded-xl shadow border border-primary w-full">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-bl text-white text-center">
            {["ID", "URL", "Bid Name", "Type", "Last 24H", "Override", "Action"].map((head) => (
              <th key={head} className="px-4 py-3 font-inter">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            console.log(row),
            <tr key={i} className="odd:bg-white text-center even:bg-gray-50 relative">
              <td className="px-4 py-3">{row.id || "-"}</td>

              <td className="px-4 py-3 flex items-center gap-2">
                <span className="truncate max-w-[200px]">{row.url || "-"}</span>
                <button
                  onClick={() => copyToClipboard(row.fullUrl, i)}
                  className="text-gray-500 hover:text-black"
                >
                  <FontAwesomeIcon icon="copy" />
                </button>
                {copiedIndex === i && (
                  <span className="text-xs text-green-500 ml-1 animate-pulse">Copied!</span>
                )}
              </td>

              <td className="px-4 py-3 font-inter ">{row.name || "-"}</td>
              <td className="px-4 py-3 font-inter ">{row.entity_type_name || "-"}</td>
              <td className="px-4 py-3 font-inter ">{row.last_run  || "-"}</td>
              <td className="px-4 py-3 font-inter">
                <select
                  defaultValue={row.override}
                  className={`px-2 py-1 rounded-full text-xs outline-none font-inter ${getOverrideStyles(row.override)}`}
                >
                  <option value="Automated">Automated</option>
                  <option value="Manual">Manual</option>
                </select>
              </td>

              <td className="px-4 py-3 relative font-inter">
                <button onClick={() => toggleAction(i)} className="text-gray-600 hover:text-black">
                  <FontAwesomeIcon icon="ellipsis-v" />
                </button>

                {/* {actionOpenRow === i && (
                  <div className="absolute right-0 top-8 bg-white shadow-md border rounded w-28 z-10 animate-fade-in">
                    <ul className="text-sm">
                      <li className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                        <FontAwesomeIcon icon="edit" />
                        Edit
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-red-600">
                        <FontAwesomeIcon icon="trash" />
                        Delete
                      </li>
                    </ul>
                  </div>
                )} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default URLBar;
