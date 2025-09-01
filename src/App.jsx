import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./components/ScrollToTop";
import BidTableSkeleton from "./components/shimmereffects/BidTableSkeleton";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import ShimmerSummaryCard from "./components/shimmereffects/ShimmerSummaryCard.jsx";
import AiToolSet from "./pages/AiToolSet.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import OTPVerification from "./components/OTPVerification.jsx";





// Lazy-loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Error404 = lazy(() => import("./pages/Error404"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CompanyBuild = lazy(() => import("./pages/CompanyBuild"));
const GeographicCoverage = lazy(() => import("./pages/GeographicCoverage"));
const HelpOurAi = lazy(() => import("./pages/HelpOurAi"));
const IndustryCategories = lazy(() => import("./pages/IndustryCategories"));
const ExtraData = lazy(() => import("./pages/ExtraData"));
const EmailVerification = lazy(() => import("./components/EmailVerification"));
const Verification = lazy(() => import("./pages/Verification"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Plan = lazy(() => import("./pages/Plan"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const SuperAdmin = lazy(() => import("./pages/SuperAdmin"));


const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);


  return (
    <LayoutWrapper>
      <ScrollToTop />
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="forgot-password" element={<OTPVerification />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company-build" element={<CompanyBuild />} />
          <Route path="/help" element={<ProtectedRoute><HelpCenter /> </ProtectedRoute>} />
          {/* <Route path="/i" element={<IndustryCategoriesSkeletonLeft />} /> */}
          <Route path="/ai-toolset" element={<ProtectedRoute> <AiToolSet /> </ProtectedRoute>} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/geographic-coverage" element={<ProtectedRoute> <GeographicCoverage /> </ProtectedRoute>} />
          <Route path="/industry-categories" element={<ProtectedRoute> <IndustryCategories /> </ProtectedRoute>} />
          <Route path="/help-our-ai" element={<ProtectedRoute> <HelpOurAi /> </ProtectedRoute>} />
          <Route path="/extra-data" element={<ProtectedRoute><ExtraData /></ProtectedRoute>} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
           <Route path="/dashboard/bookmarkBids" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/summary/:id" element={<Suspense fallback={<ShimmerSummaryCard />}> <ProtectedRoute><SummaryPage /></ProtectedRoute> </Suspense>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          {/* <Route path="/bidskeleton" element={<BidTableSkeleton />} /> */}
          <Route path="/*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </LayoutWrapper>
  );
};


export default App;
