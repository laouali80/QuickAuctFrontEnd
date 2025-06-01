import { StyleSheet, Text, View } from "react-native";
import React, { createRef, ReactNode } from "react";
import Toast, { ToastConfig, ToastRef } from "./index";

const toastRef = createRef<ToastRef>();

export const showToast = (config: ToastConfig) => {
  toastRef.current?.show(config);
};

// ✅ ALSO CORRECT
export const ToastProvider = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <Toast ref={toastRef} />
  </>
);

const styles = StyleSheet.create({});
