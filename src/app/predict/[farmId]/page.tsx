"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ExcelSvg, TimeSvg } from "@/components/Svg";
import Chart from "@/components/Chart";
import Link from "next/link";
import { BASE_URL } from "@/config";
import PaginationButtons from "./paginationbtn";

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

  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const itemsPerPage = 8;
  // const totalItems = 25;

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // const visibleItems = Array.from(Array(totalItems).keys())
  //   .slice(startIndex, endIndex)
  //   .map((index) => index + 1);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    const storedUsername = sessionStorage.getItem("username");

    if (token) {
      fetch(`${BASE_URL}/api/v1/user/${storedUsername}/farms`)
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
      fetch(`${BASE_URL}/api/v1/farm/${selectedFarm}/trees`)
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

      fetch(`${BASE_URL}/api/v1/farm/${selectedFarm}/predict`)
        .then((response) => response.json())
        .then((data) => {
          setPredictionData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching prediction data:", error);
        });
    }
  }, [selectedFarm]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    predictionData?.length || 0
  );
  const visibleItems = predictionData?.slice(startIndex, endIndex);

  const farmImageBaseUrl = `${BASE_URL}`;

  return (
    <div className="p-4">
      <div className="text-4xl font-bold md:text-center md:text-7xl">
        <div>ทำนายผลผลิต</div>
      </div>
      <div className="pt-4 flex justify-between md:justify-center">
        <select
          className="select select-sm md:select-md select-primary max-w-xs 
          text-md font-semibold border-none md:text-2xl md:font-medium"
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
        <div className="col-span-1 text-center text-lg text-primary 3xs:hidden">
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
                <div>
                  <div className="md:flex md:flex-col place-items-center hidden">
                    <div className="h-80 w-[90%] rounded-3xl border-2 border-black relative">
                      <div className="p-2 px-4 rounded-3xl border-b-2 h-14 grid items-center border-black grid-cols-4 text-lg">
                        <div>วันที่</div>
                        <div>ผลผลิต (ลูก)</div>
                        <div className="text-center">เปลี่ยนแปลง</div>
                        <div className="text-end">% เปลี่ยนแปลง</div>
                      </div>
                      <div className="p-4 text-lg font-semibold">
                        {visibleItems?.map((prediction) => (
                          <div key={prediction.id} className="grid grid-cols-4">
                            <div>
                              {" "}
                              {new Date(
                                prediction.tree_ready_in
                              ).toLocaleDateString("th-TH", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="pl-6 text-gray-400">
                              {prediction.tree_ready_amount}
                            </div>
                            <div
                              className={`text-center ${
                                prediction.change >= 0
                                  ? "text-success"
                                  : "text-error"
                              }`}
                            >
                              {prediction.change}
                            </div>
                            <div
                              className={`text-end ${
                                prediction.percent_change >= 0
                                  ? "text-success"
                                  : "text-error"
                              }`}
                            >
                              {prediction.percent_change}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="inline-flex pt-4">
                      <PaginationButtons
                        currentPage={currentPage}
                        totalPages={Math.ceil(
                          (predictionData?.length || 0) / itemsPerPage
                        )}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                      <div className="pl-4">
                        <button className="btn btn-sm btn-outline btn-primary rounded-3xl text-lg font-medium">
                          <ExcelSvg />
                          ส่งออกเป็น Excel
                        </button>
                      </div>
                      <div className="pl-4">
                        <button className="btn btn-sm btn-active btn-primary rounded-3xl text-white text-lg font-medium">
                          <TimeSvg />
                          <Link href={`/history/${selectedFarm}`}>
                            ดูผลผลิตย้อนหลัง
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                  {predictionData.map((prediction) => {
                    return (
                      <div
                        key={prediction.id}
                        className="grid grid-row mb-2 md:hidden"
                      >
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
                    );
                  })}
                </div>
              ) : (
                <p className="pb-2 text-center text-lg font-medium">
                  ยังไม่มีข้อมูกการทำนายของฟาร์มที่เลือก
                </p>
              )}
              <div className="flex-col justify-center items-center space-y-2 md:hidden">
                <button className="btn btn-sm w-full btn-active btn-primary rounded-3xl text-white text-lg font-medium">
                  <Link href={`/history/${selectedFarm}`}>
                    ดูผลผลิตย้อนหลัง
                  </Link>
                </button>
                <button className="btn btn-sm btn-outline btn-primary rounded-3xl text-lg font-medium w-full">
                  <ExcelSvg />
                  ส่งออกเป็น Excel
                </button>
              </div>
            </div>
          )
        )}
        {/* <div className="md:flex md:flex-col place-items-center hidden">
          <div className="h-80 w-[90%] rounded-3xl border-2 border-black relative">
            <div
              className="p-2 px-4 rounded-3xl border-b-2 h-14 grid items-center 
                  border-black grid-cols-4 text-lg"
            >
              <div>วันที่</div>
              <div>ผลผลิต (ลูก)</div>
              <div className="text-center">เปลี่ยนแปลง</div>
              <div className="text-end">% เปลี่ยนแปลง</div>
            </div>
            <div className="p-4 text-lg font-semibold">
              {visibleItems?.map((prediction) => (
                <div key={prediction.id} className="grid grid-cols-4">
                  <div>
                    {" "}
                    {new Date(prediction.tree_ready_in).toLocaleDateString(
                      "th-TH",
                      {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      }
                    )}
                  </div>
                  <div className="pl-6 text-gray-400">
                    {prediction.tree_ready_amount}
                  </div>
                  <div
                    className={`text-center ${
                      prediction.change >= 0 ? "text-success" : "text-error"
                    }`}
                  >
                    {prediction.change}
                  </div>
                  <div
                    className={`text-end ${
                      prediction.percent_change >= 0
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {prediction.percent_change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="inline-flex pt-4">
            <PaginationButtons
              currentPage={currentPage}
              totalPages={Math.ceil(
                (predictionData?.length || 0) / itemsPerPage
              )}
              onPageChange={(page) => setCurrentPage(page)}
            />
            <div className="pl-4">
              <button className="btn btn-sm btn-outline btn-primary rounded-3xl text-lg font-medium">
                <ExcelSvg />
                ส่งออกเป็น Excel
              </button>
            </div>
            <div className="pl-4">
              <button
                className="btn btn-sm btn-active btn-primary rounded-3xl 
                      text-white text-lg font-medium"
              >
                <TimeSvg />
                <Link href={`/history/${selectedFarm}`}>ดูผลผลิตย้อนหลัง</Link>
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PredictPage;
