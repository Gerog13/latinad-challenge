import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { loginUser, logout, clearError } from "../slices/authSlice";
import { AuthBody } from "types/user";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, loading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (body: AuthBody, callback?: () => void) => {
      try {
        await dispatch(loginUser(body)).unwrap();
        callback?.();
      } catch (error) {
        // El error ya se maneja en el slice
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(
    (callback?: () => void) => {
      dispatch(logout());
      callback?.();
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    token,
    user,
    loading,
    error,
    login,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};
