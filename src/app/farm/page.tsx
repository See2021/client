"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FarmDetails from "@/components/FarmDetails";

const Farm: React.FC = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const token = sessionStorage.getItem("Token");

    if (!token) {
      router.replace("/");
    }

    const today = new Date();
    const options = { day: "numeric", month: "long", year: "numeric" } as const;
    setCurrentDate(today.toLocaleDateString("th-TH", options));
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center space-y-2 p-4">
      <div className="text-start w-full space-y-2 font-bold">
        <div className="text-4xl">
          <div>ผลผลิต</div>
          <div>จากฟาร์มทุเรียน</div>
        </div>
        <div>{currentDate}</div>
      </div>
      {/* farm details */}
      <FarmDetails />
    </div>
  );
};

export default Farm;
