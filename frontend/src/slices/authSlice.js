import { createSlice } from "@reduxjs/toolkit";

// Helper to get token and role
const getInitialToken = () => {
  const adminToken = localStorage.getItem("admin_token");
  const userToken = localStorage.getItem("token");

  if (adminToken) return { token: adminToken, role: "admin" };
  if (userToken) return { token: userToken, role: "user" };
  return { token: null, role: null };
};

const initialTokenData = getInitialToken();

const initialState = {
  isAuthenticated: !!initialTokenData.token,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: initialTokenData.token,
  role: initialTokenData.role,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔐 Login success or manual auth set
    setAuth: (state, action) => {
      const { user, token, role } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.role = role;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      if (role === "admin") {
        localStorage.setItem("admin_token", token);
      } else {
        localStorage.setItem("token", token);
      }
    },

    // ✅ For login endpoints that return user object
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // ❌ Clear everything on logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("role");
    },
  },
});

export const { setAuth, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
