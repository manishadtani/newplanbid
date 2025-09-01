import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const hiddenRoutes = [
    "/login",
    "/forgot-password",
    "/signup",
    "/register",
    "/company-build",
    "/geographic-coverage",
    "/help-our-ai",
    "/industry-categories",
    "/extra-data",
    "/verification",
    // "/dashboard",
    "/plan",
    "/loader",
    "/super-admin",
    // "/pricing"
  ];

  const isHidden = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {!isHidden && <Header />}
      <main>{children}</main>
      {!isHidden && <Footer />}
    </>
  );
};

export default LayoutWrapper;
