// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   accessToken: null,
// };

// const loginSlice = createSlice({
//   name: "login",
//   initialState,
//   reducers: {
//     setLoginData: (state, action) => {
//       state.user = action.payload.user;
//       state.accessToken = action.payload.access;
//     },
//     clearLoginData: (state) => {
//       state.user = null;
//       state.accessToken = null;
//     },
//   },
// });

// export const { setLoginData, clearLoginData } = loginSlice.actions;
// export default loginSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import { PLANS_DATA } from "../../data/plansData";

const initialState = {
  user: null,
  accessToken: null,
};

// Helper function - plan extend karne ke liye
const extendUserPlan = (user) => {
  if (!user?.plan?.plan_code) return user;
  
  // plan_code se full plan details find karo
  const fullPlan = PLANS_DATA.find(plan => plan.plan_code === user.plan.plan_code);
  
  // Agar plan nahi mila to default Sneak plan assign karo
  const planToUse = fullPlan || PLANS_DATA.find(plan => plan.plan_code === "001");
  
  return {
    ...user,
    plan: planToUse // Complete plan object assign kar do
  };
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      // User ko plan ke saath extend kar do
      state.user = extendUserPlan(action.payload.user);
      state.accessToken = action.payload.access;
    },
    clearLoginData: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setLoginData, clearLoginData } = loginSlice.actions;
export default loginSlice.reducer;