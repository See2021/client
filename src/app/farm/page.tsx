"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FarmDetails from "@/components/FarmDetails";
import Image from "next/image";
import subPic from "../../../public/subpic.png";

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
      <div className="w-full space-y-2 font-bold inline-flex gap-2 lg:gap-0 lg:w-4/5">
        <div className="w-1/2 hidden sm:block">
          <div className="flex justify-center">
            <Image
              src={subPic}
              alt={"Main Picture of Home"}
              className="object-cover lg:w-[30rem] lg:h-[30rem] md:h-[20rem] -rotate-90"
              priority
            />
          </div>
        </div>
        <div className="hidden sm:block self-center lg:space-y-2">
          <div className="text-end md:text-8xl text-5xl lg:max-xl:text-7xl md:max-xl:text-5xl">
            <div>ผลผลิตจาก</div>
            <div className="py-1 bg-primary text-white">ฟาร์มทุเรียน</div>
          </div>
          <div className="text-lg lg:text-2xl md:text-xl text-end">{currentDate}</div>
        </div>
        <div className="text-start sm:hidden block">
          <div className="text-4xl">
            <div>ผลผลิต</div>
            <div>จากฟาร์มทุเรียน</div>
          </div>
          <div>{currentDate}</div>
        </div>
      </div>
      {/* farm details */}
      <FarmDetails />
    </div>
  );
};

export default Farm;
