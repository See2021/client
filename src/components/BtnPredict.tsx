"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type FarmData = {
  user_id: number;
};

const BtnPredict = () => {
  const [farmData, setFarmData] = useState<FarmData[] | null>(null);
  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    const storedUsername = sessionStorage.getItem("username");

    if (token) {
      fetch(`http://localhost:4000/api/v1/user/${storedUsername}/farms`)
        .then((response) => response.json())
        .then((data) => {
          setFarmData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching farm data:", error);
        });
    }
  }, []);

  return (
    <div className="w-full text-center pt-4">
      <div className="pb-2">
        อีก
        <input
          type="number"
          className="border-2 border-yellow-500 text-lg text-yellow-500 text-center w-12 mx-2"
          placeholder="0"
          required
        />
        วัน จะมีทุเรียนพร้อมที่จะเก็บทั้งหมด 500 ลูก
      </div>
      <Link href={`/predict/${farmData?.[0]?.user_id ?? null}`}>
        <button className="btn btn-sm btn-outline btn-primary rounded-3xl text-lg font-medium">
          ดูการทำนายผลพลิต
        </button>
      </Link>
    </div>
  );
};

export default BtnPredict;
