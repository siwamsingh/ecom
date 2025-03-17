"use client";

import React, { useEffect } from "react";
import toast from "react-hot-toast";

type ToastProps = {
  toastMessage: string;
  toastType?: "success" | "error" | "loading" ;
};

const ServerToast: React.FC<ToastProps> = ({ toastMessage, toastType = "" }) => {
  useEffect(() => {
    if (toastMessage) {
        if(toastType=="success"){
            toast.success(toastMessage)
        }else if(toastType == "error"){
            toast.error(toastMessage)

        }else if(toastType == "loading"){
            toast.loading(toastMessage)

        }else{
            toast(toastMessage)
        }
    }
  }, [toastMessage, toastType]); // Runs only when `toastMessage` or `toastType` changes

  return null; // No need to return an empty fragment
};

export default ServerToast;
