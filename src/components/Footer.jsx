// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue text-white px-6 py-12 overflow-hidden h-[100vh]">
      <div className="container-fixed h-full">
       <div className="flex flex-col justify-between h-full">
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Left Section: Logo + CTA */}
          <div>
            <div className="" data-aos="fade-right" >
              <Link to="/" className="">
                <img src="logo.png" className="max-w-xs w-full" />
              </Link>
            </div>
          </div>

          {/* Middle Section: Navigation */}
          <div className="flex flex-wrap   flex-col sm:flex-row gap-8 md:gap-12 xl:gap-16 xl:justify-end md:col-span-2">
            {[
              { 
                title: "Home", 
                links: [
                  { name: "A.I. Toolkit", url: "/ai-toolset" },
                  { name: "Why BidInsight?", url: "/why-bidinsight" },
                  { name: "Register Now!", url: "/register" },
                  { name: "Plans & Pricing", url: "/pricing" }
                ], 
                delay:"100" 
              },
              { 
                title: "Plans & Pricing", 
                links: [
                  { name: "Pricing", url: "/pricing" },
                  { name: "Features", url: "/features" },
                  { name: "FAQs", url: "/faqs" }
                ], 
                delay:"400" 
              },
              { 
                title: "About Us", 
                links: [
                  { name: "Mission", url: "/mission" },
                  { name: "Vision", url: "/vision" },
                  { name: "Our Story", url: "/our-story" },
                  { name: "Core Values", url: "/core-values" }
                ], 
                delay:"400" 
              },
            ].map((section, idx) => (
              <div key={idx} data-aos="fade-left" data-aos-delay={section.delay}>
                <h3 className="font-semibold mb-2 font-t body-t">
                  {section.title}
                </h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.url}
                        className="hover:text-white font-t body-t mt-4 block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="">
          <h1 className="text-g text-6xl lg:text-8xl font-black font-h max-w-4xl" data-aos="fade-up" data-aos-delay="">
            Your next government contract awaits!
          </h1>
          <div className="mt-12 border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between items-center gap-3" >
            <Link
              to="/terms"
              className="hover:text-white mb-2 md:mb-0 font-t text-lg"
            >
              Terms & Conditions
            </Link>
            <span className="text-center font-t text-lg">
              @2025 BidInsight - All Rights Reserved
            </span>
            <Link
              to="/privacy"
              className="hover:text-white mt-2 md:mt-0 font-t text-lg"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
       </div>
      </div>
    </footer>
  );
};

export default Footer;