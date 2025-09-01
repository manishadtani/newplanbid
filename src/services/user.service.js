import API from "../utils/axios.js";



export const signupUser = async (formData) => {
  try {
    const response = await API.post("/auth/signup/", formData);
    return response;
  } catch (error) {
    throw error; // Let caller handle it in try/catch
  }
};

export const validateEmailAPI = async (email) => {
  try {
    const response = await API.post("/auth/validate-email/", { email });
    return response.data; // ✅ Return the data directly
  } catch (error) {
    console.error("Error validating email:", error);
  }
}



export const verifyOtp = async (payload) => {
  const endpoints = ["/auth/verify-otp/"];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);

      const response = await API.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`✅ Success with endpoint: ${endpoint}`);
      return response; // ✅ Return success response

    } catch (error) {
      console.log(`❌ Failed with endpoint ${endpoint}:`, error.response?.data);
      lastError = error;

      if (error.response?.status === 404) continue;

      if (
        error.response?.status === 400 &&
        error.response?.data?.detail?.toLowerCase().includes("user")
      ) {
        continue;
      }

      break; // Other errors → stop trying
    }
  }

  throw lastError; // ❌ If all endpoints fail, throw last error
};



export const resendOtp = async (payload) => {
  try {
    const response = await API.post("/auth/resend-otp/", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};


export const getAllStates = async () => {
  try {
    const response = await API.get("/auth/states/");
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};


export const getUNSPSCCodes = async ({
  page = 1,
  pageSize = 20,
  search = "",
  code = "", // 🆕 New code parameter
} = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      page_size: pageSize, // 🆕 Changed to match your API format
    });

    // 🆕 Add code or search parameter based on what's provided
    if (code) {
      params.append('code', code);
    } else if (search) {
      params.append('search', search);
    }

    const res = await API.get(`/bids/unspsc-codes/?${params.toString()}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching UNSPSC codes:", err);
    throw err;
  }
};


export const getSolicitationTypes = async () => {
  try {
    const res = await API.get("/bids/solicitation/");
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching solicitation types:", error);
    throw error;
  }
};

export const getNAICSCodes = async () => {
  try {
    const response = await API.get("/bids/naics-codes/");
    return response.data.results || [];
  } catch (error) {
    console.error(
      "Error fetching NAICS codes:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to fetch NAICS codes");
  }
};


export const fetchIndustryCategories = async () => {
  try {
    const { data } = await API.get("/auth/industries/");
    console.log("Industry categories fetched:", data?.results || []);
    return data?.results || [];
  } catch (error) {
    console.error(
      "Error fetching industry categories:",
      error?.response?.data || error.message
    );
    return []; // Return empty array instead of throwing, to prevent UI crash
  }
};


export const similarBids = async (id) => {
  try {
    const response = await API.get(`/bids/similar/${id}`);
    console.log(response.data, "🔥 Similar bids fetched");
    return response.data;
  } catch (error) {
    console.error("Error fetching similar bids:", error);
    throw error;
  }
}


export const forgotPasswordRequest = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password/request/", { email });
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordVerify = async (payload) => {
  try {
    const response = await API.post("/auth/forgot-password/reset/", payload);
    return response;
  } catch (error) {
    throw error;
  } 
};