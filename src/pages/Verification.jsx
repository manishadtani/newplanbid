
import React, { useState, useEffect, useRef } from "react";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";
import { useNavigate, useLocation } from "react-router-dom";
import { checkTTLAndClear } from "../utils/ttlCheck";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducer/authSlice"; // path check kar lena
import { resendOtp, verifyOtp } from "../services/user.service";


function Verification() {
  const data = {
    title: "Verify your Email to begin your Biding",
    para: "All government bids. One dashboard. Zero hassles.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h1",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Log In",
    link: "/login",
    steps: "",
    activeStep: 0,
  };

  const formFooter = {
    back: {
      text: "Back",
      link: "/login",
    },
    next: {
      text: "Verify",
      link: "",
    },
    skip: {
      text: "",
      link: "",
    },
  };
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageType, setOtpMessageType] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const otpFromSignup = location.state?.otp || null;

  // useEffect(() => {
  //   checkTTLAndClear(navigate);
  // }, []);

  useEffect(() => {
    console.log("=== COMPONENT MOUNTED ===");
    console.log("Location state:", location.state);
    console.log("Email from signup:", location.state?.email);
    console.log("OTP from signup:", location.state?.otp);
    console.log("=== END MOUNT DEBUG ===");

    if (otpFromSignup) {
      // Auto-fill the OTP inputs with the signup OTP
      const otpDigits = otpFromSignup.toString().split('');
      setOtp(otpDigits);
      alert(`Your OTP is: ${otpFromSignup}`);
    }
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, [otpFromSignup]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpMessage("");
      setOtpMessageType("");

      if (value && index < 5) inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6 || otp.some((d) => d === "")) {
      setOtpMessage("Please fill all the 6 digits");
      setOtpMessageType("error");
      return;
    }

    if (!email) {
      setOtpMessage("Email not found. Please go back and try again.");
      setOtpMessageType("error");
      return;
    }

    setIsLoading(true);
    setOtpMessage("");
    setOtpMessageType("");

    const otpToVerify = otpFromSignup || enteredOtp;
    const cleanEmail = email.toLowerCase().trim().replace(/\s+/g, '');

    const payload = {
      email: cleanEmail,
      otp: otpToVerify.toString()
    };

    try {
      const response = await verifyOtp(payload); // ✅ calling user.service function

      setApiResponse(response.data);
      console.log("✅ API Response:", response.data);

      const status = response.status;
      const data = response.data;

      if (status === 200 || status === 201) {
        const accessToken =
          data.access ||
          data.access_token ||
          data.token ||
          data.data?.access ||
          data.data?.access_token;

        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
          setOtpMessage("Verification successful!");
          setOtpMessageType("success");

          dispatch(setUser({
            user: data.user || data.data?.user || null,
            token: accessToken,
          }));

          setTimeout(() => {
            navigate("/pricing");
          }, 1000);
        } else if (data.success || data.message?.includes("success")) {
          setOtpMessage("Verification successful!");
          setOtpMessageType("success");
          setTimeout(() => {
            navigate("/pricing");
          }, 1000);
        } else {
          setOtpMessage("Verification successful but no access token received.");
          setOtpMessageType("error");
        }

      } else {
        setOtpMessage("OTP is invalid or expired.");
        setOtpMessageType("error");
      }

    } catch (error) {
      console.log("❌ API Error:", error);

      let errorMessage = "OTP verification failed. Please try again.";

      if (error.response) {
        const res = error.response;

        console.log("❌ Full Error Response:", {
          status: res.status,
          data: res.data,
          headers: res.headers
        });

        errorMessage =
          res.data?.detail ||
          res.data?.message ||
          res.data?.error ||
          res.data?.msg ||
          res.data?.non_field_errors?.[0] ||
          (typeof res.data === "string" ? res.data : errorMessage);

        if (res.status === 400) {
          if (errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("expired")) {
            errorMessage = "Invalid or expired OTP. Please try again.";
          } else if (errorMessage.toLowerCase().includes("email")) {
            errorMessage = "Email not found. Please check your email address.";
          }
        } else if (res.status === 429) {
          errorMessage = "Too many attempts. Please try again later.";
        } else if (res.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setOtpMessage(errorMessage);
      setOtpMessageType("error");
      setApiResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(120);
      setOtp(["", "", "", "", "", ""]);
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }

      try {
        const payload = { email: email.toLowerCase().trim() };
        console.log("Resending OTP for:", payload);

        const response = await resendOtp(payload); // ✅ Using user service
        setApiResponse(response.data);
        console.log("Resend OTP API Response:", response.data);

        setOtpMessage("OTP sent successfully!");
        setOtpMessageType("success");

        // Clear success message after 3 seconds
        setTimeout(() => {
          if (otpMessageType === "success") {
            setOtpMessage("");
            setOtpMessageType("");
          }
        }, 3000);

      } catch (error) {
        console.log("Resend OTP API Error:", error);
        setApiResponse({ error: error.message });

        let errorMessage = "Failed to resend OTP. Please try again.";
        if (error.response?.data) {
          errorMessage =
            error.response.data.detail ||
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        }

        setOtpMessage(errorMessage);
        setOtpMessageType("error");
        setTimer(0); // Reset timer on error
      }
    }
  };


  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          <div className="h-full">
            <div className="mt-10">
              <p className="mb-2 text-white">Enter the 6 digit verification code</p>
              <div className="flex gap-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    disabled={isLoading}
                    className={`w-10 md:w-14 h-10 md:h-14 rounded-md bg-transparent border border-white text-3xl text-center focus:outline-none focus:ring-2 focus:ring-white text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  />
                ))}
              </div>

              {otpMessage && (
                <p
                  className={`text-sm flex items-center gap-1 mt-2 mb-1 ${otpMessageType === "success"
                    ? "text-green-400"
                    : "text-red-400"
                    }`}
                >
                  {otpMessageType === "success" ? (
                    <span className="flex items-center">
                      <i className="fal fa-check text-green-400"></i>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <i className="far fa-times text-red-400"></i>
                    </span>
                  )}
                  <span>{otpMessage}</span>
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 text-white">
                {timer > 0 ? (
                  <p>
                    Resend Code in <span className="font-bold">{timer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className={`underline hover:text-blue-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Debug info - remove in production */}
              {/* {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-300">
                  <p>Debug Info:</p>
                  <p>Email: "{email}" (Length: {email.length})</p>
                  <p>Email trimmed: "{email.trim()}"</p>
                  <p>OTP from signup: {otpFromSignup}</p>
                  <p>Has spaces: {email.includes(' ') ? 'Yes' : 'No'}</p>
                  <p>Has special chars: {/[^\w@.-]/.test(email) ? 'Yes' : 'No'}</p>
                  <p>API Response: {JSON.stringify(apiResponse, null, 2)}</p>
                </div>
              )} */}
            </div>
          </div>

          <FormFooter
            data={formFooter}
            onNextClick={handleVerify}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"login-img.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default Verification;