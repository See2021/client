"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Detail = () => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("Token");

    if (!token) {
      router.replace("/");
    }
  }, [router]);
  return (
    <div className='flex min-h-screen flex-col items-center space-y-6 p-6'>
        detail
    </div>
  );
};

export default Detail;
