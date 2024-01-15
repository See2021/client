"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TreeData {
  id: number;
  farm_id: number;
  tree_collected: number;
  tree_ready: number;
  tree_notReady: number;
  created_at: string;
  tree_photo_path: string;
}

interface PredictionData {
  id: number;
  farm_id: number;
  tree_id: number;
  tree_ready_amount: number;
  tree_ready_in: string;
  change: number;
  percent_change: number;
  created_at: string;
}

const Chart = () => {
  const [treeData, setTreeData] = useState<TreeData[] | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData[] | null>(
    null
  );

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    const getFarmId = sessionStorage.getItem("farm_id");
    console.log(getFarmId);

    if (token) {
      fetch(`http://localhost:4000/api/v1/farm/${getFarmId}/trees`)
        .then((response) => response.json())
        .then((data) => {
          setTreeData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching farm data:", error);
        });
      fetch(`http://localhost:4000/api/v1/farm/${getFarmId}/predict`)
        .then((response) => response.json())
        .then((data) => {
          setPredictionData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching prediction data:", error);
        });
    }
  }, []);

  const updatedData = predictionData
    ? predictionData.map((predict, index) => {
        const sum = treeData && treeData[index] && treeData[index].tree_ready;

        return {
          name: `name${index + 1}`,
          predict: predict ? predict.tree_ready_amount : 0,
          ...(treeData && index < treeData.length ? { real: sum || 0 } : {}), // Include pv property for the first 6 items
          amt: 300,
        };
      })
    : [];

  return (
    <div className="my-4">
      <div className="flex justify-between mb-2">
        <div className="grid gap items-center">
          <p className="text-md leading-none font-medium">
            จำนวนทุเรียน (พันลูก)
          </p>
        </div>
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" aspect={16 / 9}>
          <LineChart data={updatedData} margin={{ left: -25, bottom: 10 }}>
            <CartesianGrid stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="real"
              stroke="#ca8a04"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="predict"
              stroke="#020617"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between">
        <div className="">
          <p className=" text-md font-medium">24 มิ.ย.</p>
        </div>
        <div className="">
          <p className=" text-md font-medium">24 ก.ค.</p>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 mt-2">
        <div className="w-full">
          <a
            href="#"
            className="w-full px-2 py-1 text-md inline-flex items-center rounded-full text-center border-2 border-yellow-500 text-yellow-500"
          >
            <svg
              width="30"
              height="2"
              viewBox="0 0 60 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-6"
            >
              <path d="M0 1H60" stroke="#B46A07" strokeWidth="2" />
            </svg>
            ผลผลิตจริง
          </a>
        </div>
        <div className="w-full">
          <a
            href="#"
            className="w-full px-2 py-1 text-md inline-flex items-center rounded-full text-center border-2 border-black"
          >
            <svg
              width="30"
              height="2"
              viewBox="0 0 60 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4"
            >
              <path
                d="M0 1H60"
                stroke="black"
                strokeWidth="2"
                strokeDasharray="10 10"
              />
            </svg>
            ผลผลิตที่ทำนาย
          </a>
        </div>
      </div>
    </div>
  );
};

export default Chart;
