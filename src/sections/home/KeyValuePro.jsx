import React from "react";
import HeroHeading from "../../components/HeroHeading";

function KeyValuePro() {
  const data = {
    title: "Infinite Bids. One Dashboard.",
    para: "We aggregate all local, state & federal RFPs in one place - so you never miss an opportunity!",
    containter: "max-w-5xl mx-auto text-center",
  };
  return (
    <div className="key-value-pro bg-blue">
      <div className="container-section">
        <HeroHeading data={data}/>
        <img src="Mapchart.png" className="w-full mt-10" alt="" data-aos="fade-up" data-aos-delay="300"/>
      </div>
    </div>
  );
}

export default KeyValuePro;
