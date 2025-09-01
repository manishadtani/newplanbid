import React, { useRef, useEffect } from "react";
import Heading from "../../components/Heading";
import Button2 from "../../components/Button2";
import Arrow from "../../components/Arrow";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

function LockedFeature() {
  const containerRef = useRef(null);

  const data = [
    {
      title: "Bid Dashboard",
      para: "Stay informed and seize opportunities with our comprehensive dashboard. Access real-time data on active bids and find the information you need to participate in government projects. Our user-friendly interface empowers businesses and individuals to engage in the bidding process transparently and efficiently.",
      link: "/",
      img: "locked-img.png",
    },
    {
      title: "Bid Compatibility Summary",
      para: "Utilize our AI-powered coaching tips to help improve your chances of winning bids. A summary is generated to assist in determining if the RFP is a match for your company based on factors like the past performance, the RFP’s requirements, and industry benchmarks.",
      link: "/",
      img: "locked-img.png",
    },
    {
      title: "Proposal Compliancy Checklist",
      para: "Many RFPs are rejected due to non-compliance with submission requirements. Our Compliance Checker scans RFP responses and flags potential compliance issues before submission.",
      link: "/",
      img: "locked-img.png",
    },
  ];

  useGSAP(() => {
    const container = containerRef.current;
    const sections = container.querySelectorAll(".panel");

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 2),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: "+=1000",
      },
    });

    ScrollTrigger.refresh(); // Ensures proper sizing
  }, []);

  return (
    <div className="locked-feature">
      <div className="container-section">
        <div className="locked-head flex justify-between flex-col md:flex-row items-center gap-5 md:py-16">
          <div data-aos="fade-right" data-aos-delay="100">
            <Heading textD="A Glance At" textL="The A.I. Magic!" />
          </div>
          <div data-aos="fade-left" data-aos-delay="100">
            <Button2 text="See All" link="/" />
          </div>
        </div>
      </div>

      <div className="locked-content w-full overflow-hidden">
        <div
          className="locked-content-inner bg-blue h-[100vh]  ps-14 flex w-[400%] lg:w-[200%] justify-stretch gap-5"
          ref={containerRef}
        >
          {data.map((item, index) => (
            <div key={index} className="panel my-14 rounded-[30px] bg-white max-h-[670px] h-full flex-[50%]">
              <div className="locked-item bg-white rounded-[30px]">
                <div className="locked-img">
                  <img src={item.img} alt="" />
                </div>
                <div className="locked-text h-full p-5 hidden">
                  <div className="locked-title font-h font-semibold text-black mb-3 h3">
                    {item.title}
                  </div>
                  <div className="locked-para font-t body-t text-black mb-3">
                    {item.para}
                  </div>
                  <div className="locked-btn flex justify-end">
                    <Arrow
                      link={item.link}
                      customclass="w-10 h-10 leading-10 -rotate-45"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Final CTA Panel */}
          <div className="panel h-full flex-[50%]">
            <div className="h-full bg-white">
              <div className="flex justify-center items-center flex-col px-10 md:px-40 gap-6 h-full text-center">
                <Heading
                  textD="Discover all the"
                  textL="functionality"
                  textAlign="text-center"
                />
                <Arrow
                  link="/"
                  customclass="w-10 h-10 md:w-16 md:h-16 body-t"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LockedFeature;
