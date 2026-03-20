import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

/* ================= CREATE CHECKOUT SESSION ================= */
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/checkout", checkoutData);

      return response.data; // session / order / payment info
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ================= MARK CHECKOUT AS PAID ================= */
export const markCheckoutAsPaid = createAsyncThunk(
  "checkout/markAsPaid",
  async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/checkout/${checkoutId}/pay`,
        paymentDetails
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ================= FINALIZE CHECKOUT (CREATE ORDER) ================= */
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/checkout/${checkoutId}/finalize`,
        {}
      );

      return response.data; // final order
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ================= CHECKOUT SLICE ================= */
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    loading: false,
    success: false,
    checkoutData: null,
    error: null,
  },
  reducers: {
    resetCheckout: (state) => {
      state.loading = false;
      state.success = false;
      state.checkoutData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE CHECKOUT */
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.checkoutData = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* MARK AS PAID */
      .addCase(markCheckoutAsPaid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markCheckoutAsPaid.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(markCheckoutAsPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FINALIZE CHECKOUT */
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.checkoutData = null; // Clear checkout after finalization
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ================= EXPORT ================= */
export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
