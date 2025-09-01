import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, Shield, ArrowLeft, Mail, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordRequest, forgotPasswordVerify } from '../services/user.service';

const OTPVerification = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP + Password
  
  // Email step
  const [email, setEmail] = useState("");
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  
  // OTP and Password step
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0 && currentStep === 2) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer, currentStep]);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle send OTP
  const handleSendOTP = async () => {
    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setEmailError("");
    setIsEmailSending(true);
    
    try {
      const response = await forgotPasswordRequest(email);
      
      // Show success alert
      alert(`OTP sent successfully to ${email}! Please check your inbox.`);
      
      // Move to step 2
      setCurrentStep(2);
      setResendTimer(60);
      
      // Focus first OTP input after a short delay
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error) {
      console.error("Send OTP failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsEmailSending(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    
    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    const pasteArray = pasteData.split('').slice(0, 6);
    
    if (pasteArray.every(char => !isNaN(char))) {
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(pasteArray.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      newErrors.otp = "Please enter complete 6-digit OTP";
    }
    
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Prepare payload for backend API
      const payload = {
        email: email,
        otp: otp.join(""),
        new_password: password
      };
      
      console.log("Sending payload:", payload);
      
      // Call the forgotPasswordVerify API
      const response = await forgotPasswordVerify(payload);
      
      console.log("Password reset response:", response.data);
      
      // Show success message
      alert("Password reset successful! Please login with your new password.");
      
      // Navigate to login page
      navigate("/login");
      
    } catch (error) {
      console.error("Password reset failed:", error);
      
      // Handle different error scenarios
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || "Password reset failed. Please try again.";
      
      alert(`Error: ${errorMessage}`);
      
      // If OTP is invalid, clear OTP fields and focus first input
      if (error.response?.status === 400) {
        setOtp(new Array(6).fill(""));
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const response = await forgotPasswordRequest(email);
      
      // Show the new OTP in alert (for development - remove in production)
      alert("New OTP: " + response.data.otp + "\nOTP sent successfully! Please check your inbox.");
      
      setResendTimer(60);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
      
    } catch (error) {
      console.error("Resend failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <Shield className="w-8 h-8 text-blue-300" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {currentStep === 1 ? 'Reset Password' : 'Verify Your Account'}
          </h1>
          
          <p className="text-blue-200 text-sm leading-relaxed">
            {currentStep === 1 
              ? 'Enter your email address to receive verification code'
              : `We've sent a 6-digit verification code to ${email}`
            }
          </p>
        </div>

        {/* Step 1: Email Input */}
        <div className={`${currentStep === 2 ? 'blur-sm opacity-60 pointer-events-none' : ''} transition-all duration-300`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl mb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium block">
                  Email Address
                </label>
                
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:bg-white/20 transition-all duration-200 outline-none"
                    placeholder="Enter your email address"
                    disabled={currentStep === 2}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                </div>
                
                {emailError && (
                  <p className="text-red-300 text-xs mt-1">{emailError}</p>
                )}
              </div>

              <button
                onClick={handleSendOTP}
                disabled={isEmailSending || currentStep === 2}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg"
              >
                {isEmailSending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send OTP
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: OTP + Password */}
        {currentStep === 2 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl animate-fadeIn">
            <div className="space-y-6">
              
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium block">
                  Verification Code
                </label>
                
                <div className="flex gap-3 justify-center">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      ref={(el) => inputRefs.current[index] = el}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOTPChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-xl font-bold bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:bg-white/20 transition-all duration-200 outline-none"
                      placeholder="•"
                    />
                  ))}
                </div>
                
                {errors.otp && (
                  <p className="text-red-300 text-xs mt-1">{errors.otp}</p>
                )}
                
                {/* Resend Timer */}
                <div className="flex items-center justify-center mt-4">
                  {resendTimer > 0 ? (
                    <p className="text-blue-200 text-sm">
                      Resend code in <span className="font-semibold text-white">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={isResending}
                      className="flex items-center gap-2 text-blue-300 hover:text-white text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                      {isResending ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium block">
                  New Password
                </label>
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:bg-white/20 transition-all duration-200 outline-none pr-12"
                    placeholder="Enter your new password"
                  />
                  
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {errors.password && (
                  <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 text-blue-200 hover:text-white text-sm font-medium transition-colors duration-200 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-xs">
            Secure verification powered by BidInsight
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;