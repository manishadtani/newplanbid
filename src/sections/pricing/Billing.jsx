import React from "react";
import Heading from "../../components/Heading";

function Billing() {
  // data/plans.js
  const plans = ["Free", "Starter", "Essentials", "AI Powerhouse"];

  const sections = [
    {
      title: "Features",
      features: [

        {
          name: "Bid Summary",
          values: ["-", "✔️", "✔️", "✔️"],
        },
        {
          name: "Advanced Search",
          values: ["-", "✔️", "✔️", "✔️"],
        },
        
        {
          name: "Federal Bids",
          values: ["-", "✔️", "✔️", "✔️"],
        },
        {
          name: "State Bids",
          values: ["-", "Up to 1", "✔️", "✔️"],
        },
         {
          name: "Cities & Counties",
          values: ["-", "-", "Coming Soon", "Coming Soon"],
        },
         {
          name: "Saved Searches",
          values: ["-", "Up to 1", "Up to 5", "Up to 10"],
        },
         {
          name: "Follows",
          values: ["-", "-", "Up to 10", "Up to 25"],
        },
         {
          name: "Bookmarks",
          values: ["-", "Up to 5", "Up to 20", "Up to 50"],
        },
         {
          name: "Export bids/month",
          values: ["-", "-", "Up to 100", "Up to 500"],
        },
        // {
        //   name: "Full AI Arsenal (RFP Compatibility Summary, Proposal Compliance Checker, Competitive Pricing Generator, Task Checklist Generator, Questionnaire Generator, Capability Statement Generator)",
        //   values: ["-", "-", "Coming Soon", "Coming Soon"],
        // },
      ],
    },
    {
      title: "Full Stack A.I. Arsenal",
      features: [
        {
          name: "RFP Compatibility Summary",
          values: ["-", "-", "Coming Soon", "Coming Soon"],
        },
        {
          name: "Proposal Compliance Checker",
          values: ["-", "-", "-", "Coming Soon"],
        },
        {
          name: "Competitive Pricing Generator",
          values: ["-", "-", "-", "Coming Soon"],
        },
        {
          name: "Task Checklist Generator",
          values: ["-", "-", "-", "Coming Soon"],
        },
        {
          name: "Questionnaire Generator",
          values: ["-", "-", "-", "Coming Soon"],
        },
        {
          name: "Capability Statement Generator",
          values: ["-", "-", "-", "Coming Soon"],
        },
      ],
    },
  ];

  return (
    <div className="billing-page">
      <div className="container-fixed container-section">
        <Heading
          textD="Choose the perfect "
          textL="plan for your needs"
          textAlign={"text-center"}
        />
      </div>
      <div className="px-4 sm:px-6 lg:px-20 py-10 relative">
        <div className="overflow-auto relative">
          <table className="min-w-full  border-spacing-y-6 text-sm sm:text-base relative border-collapse  ">
            <thead className="sticky top-0 ">
              <tr className="">
                <th className="text-left w-48"></th>
                {plans.map((plan, idx) => (
                  <th key={idx} className="text-center">
                    <div className="mb-2 font-medium font-inter text-p">{plan}</div>
                    <button className="font-normal px-4 py-1 border border-primary text-primary rounded-full hover:bg-blue-50  transition font-inter text-p">
                      Get {plan} <span>
                        <i class="fal fa-long-arrow-right rotate-[-45deg]"></i>
                        </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section, sIdx) => (
                <React.Fragment key={sIdx} className="">
                  <tr className="pt-4">
                    <td
                      colSpan={plans.length + 1}
                      className="text-left pt-16 pb-2 font-medium text-xl font-inter xl:text-[30px]"
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.features.map((feature, fIdx) => (
                    <tr
                      key={fIdx}
                      className="border-b  border-primary"
                    >
                      <td className="py-4 pr-4 font-medium text-left text-xl font-inter">
                        {feature.name}
                      </td>
                      {feature.values.map((val, vIdx) => (
                        <td key={vIdx} className="text-center py-4">
                          {val === "✔️" ? (
                            <span className="text-black text-lg"><i class="far fa-check"></i></span>
                          ) : (
                            <span className="font-inter text-xl">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Billing;
