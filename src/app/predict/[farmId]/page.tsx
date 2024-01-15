"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ExcelSvg } from "@/components/Svg";
import Chart from "@/components/Chart";

interface FarmData {
  farm: {
    id: number;
    farm_name: string;
  };
}

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

type Props = {
  params: { farmId: number };
};

const PredictPage = ({ params }: Props) => {
  const router = useRouter();
  const [farmData, setFarmData] = useState<FarmData[] | null>(null);
  const [treeData, setTreeData] = useState<TreeData[] | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData[] | null>(
    null
  );
  const [selectedFarm, setSelectedFarm] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    } else {
      router.replace("/");
    }
    return () => {
      sessionStorage.removeItem("farm_id");
    };
  }, [params.farmId, router]);

  useEffect(() => {
    if (selectedFarm) {
      setLoading(true);
      fetch(`http://localhost:4000/api/v1/farm/${selectedFarm}/trees`)
        .then((response) => response.json())
        .then((data) => {
          setTreeData(data.result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tree data:", error);
        });
      const setFarmId = sessionStorage.setItem(
        "farm_id",
        selectedFarm.toString()
      );

      fetch(`http://localhost:4000/api/v1/farm/${selectedFarm}/predict`)
        .then((response) => response.json())
        .then((data) => {
          setPredictionData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching prediction data:", error);
        });
    }
  }, [selectedFarm]);

  const farmImageBaseUrl = "http://localhost:4000";

  return (
    <div className="p-4">
      <div className="text-4xl font-bold">
        <div>ทำนายผลผลิต</div>
      </div>
      <div className="pt-4 grid grid-cols-4 items-center">
        <select
          className="select select-sm select-primary max-w-xs col-span-3 text-lg font-semibold border-none"
          value={selectedFarm || ""}
          onChange={(e) => setSelectedFarm(Number(e.target.value))}
        >
          <option disabled value="">
            เลือกฟาร์ม
          </option>
          {farmData &&
            farmData.map((farm) => (
              <option key={farm.farm.id} value={farm.farm.id}>
                {farm.farm.farm_name}
              </option>
            ))}
        </select>
        <div className="col-span-1 text-center text-lg text-primary">
          รายวัน
        </div>
      </div>

      <div>
        {loading ? (
          <div className="text-center mt-6">
            <span className="loading bg-primary loading-spinner loading-lg"></span>
          </div>
        ) : (
          selectedFarm !== null && (
            <div>
              <Chart />
              {predictionData && predictionData.length > 0 ? (
                predictionData.map((prediction) => (
                  <div key={prediction.id} className="grid grid-row mb-2">
                    <div className="grid grid-flow-col border-2 border-black rounded-lg px-2 py-[4px]">
                      <div>
                        <div className="text-sm text-gray-600 font-semibold">
                          {" "}
                          {new Date(
                            prediction.tree_ready_in
                          ).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-2xl font-bold">
                          {prediction.tree_ready_amount} ลูก
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-semibold text-center pb-1">
                          แปลงเปลี่ยน
                        </div>
                        <div
                          className={`flex items-center justify-center font-semibold ${
                            prediction.change >= 0
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
                          {prediction.change}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-semibold text-center pb-1">
                          % แปลงเปลี่ยน
                        </div>
                        <div
                          className={`flex items-center justify-center font-semibold ${
                            prediction.percent_change >= 0
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
                          {prediction.percent_change}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="pb-2 text-center text-lg font-medium">
                  ยังไม่มีข้อมูกการทำนายของฟาร์มที่เลือก
                </p>
              )}
              <div className="flex-col justify-center items-center space-y-2">
                <button className="btn btn-sm w-full btn-active btn-primary rounded-3xl text-white text-lg font-medium">
                  ดูผลผลิตย้อนหลัง
                </button>
                <button className="btn btn-sm btn-outline btn-primary rounded-3xl text-lg font-medium w-full">
                  <ExcelSvg />
                  ส่งออกเป็น Excel
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PredictPage;
