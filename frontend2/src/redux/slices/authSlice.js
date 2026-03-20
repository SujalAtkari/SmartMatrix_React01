import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const tokenFromStorage = localStorage.getItem("userToken") || null;

const initialGuestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;

localStorage.setItem("guestId", initialGuestId);

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );

      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.token);

      return res.data; // ✅ return full data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data || "Login failed"
      );
    }
  }
);

/* ================= FETCH USER PROFILE ================= */
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const res = await axiosInstance.get("/api/users/profile");

      // Update localStorage with fresh user data
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      return res.data;
    } catch (err) {
      // If token is invalid, clear storage
      if (err.response?.status === 401) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        console.error("VITE_BACKEND_URL is not set!");
        return rejectWithValue(
          "Backend URL not configured. Please check environment variables."
        );
      }

      console.log("Registering user with:", {
        email: userData.email,
        backendUrl,
      });

      const res = await axios.post(
        `${backendUrl}/api/users/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.data || !res.data.user || !res.data.token) {
        return rejectWithValue("Invalid response from server");
      }

      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.token);

      return res.data;
    } catch (err) {
      console.error("Register error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config?.url,
      });

      // Extract error message from different possible formats
      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage =
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data);
      } else if (err.message) {
        if (
          err.message.includes("Network Error") ||
          err.message.includes("ERR_CONNECTION_REFUSED")
        ) {
          errorMessage =
            "Cannot connect to server. Please check if the backend is running.";
        } else {
          errorMessage = err.message;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.guestId = `guest_${Date.now()}`;

      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH PROFILE */
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Clear user if token is invalid
        if (
          action.payload?.includes("token") ||
          action.payload?.includes("authorized")
        ) {
          state.user = null;
          state.token = null;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
