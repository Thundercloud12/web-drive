// useAuthCheck.jsx
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAuth, logout } from "../slices/authSlice.js";

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false); // <- the 4th hook mentioned in the error

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        dispatch(logout());
        setAuthChecked(true);
        return;
      }

      try {
        const res = await axios.get("/users/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setAuth({ user: res.data.user, token, role }));
      } catch (err) {
        dispatch(logout());
      } finally {
        setAuthChecked(true);
      }
    };

    validateToken();
  }, [dispatch]);

  return authChecked;
};

export default useAuthCheck;
