import React from "react";
import Chart from "@/components/Chart";
import { ExcelSvg } from "@/components/Svg";

const History = () => {
  return (
    <div className="p-4">
      <div className="text-4xl font-bold">ผลผลิตย้อนหลัง</div>
      <div className="border-2 border-primary rounded-md p-2 space-y-2 text-primary font-semibold">
        <div>ผลผลิตในปีนี้</div>
        <div className="text-2xl">123456 ลูก</div>
      </div>
      <button className="btn btn-sm btn-primary rounded-3xl text-white text-lg font-medium w-full mt-2">
        <ExcelSvg />
        ส่งออกเป็น Excel
      </button>
      <div className="text-end text-lg text-primary -mb-4 mt-2">รายวัน</div>
      <Chart />
    </div>
  );
};

export default History;
