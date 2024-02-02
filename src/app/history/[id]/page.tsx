"use client";
import React, { useEffect, useState } from "react";
import Chart from "@/components/Chart";
import { ExcelSvg } from "@/components/Svg";
import { useRouter } from "next/navigation";

type Props = {
  params: { id: number };
};

interface TreeData {
  status: string;
  message: string;
  result: {
    sumCollected: number;
    farms: {
      farm_id: number;
      totalCollectedTrees: number;
    }[];
  };
}

const History = ({ params }: Props) => {
  const [treeData, setTreeData] = useState<TreeData[] | null>(null);
  const [filteredTotalTrees, setFilteredTotalTrees] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    const storedUsername = sessionStorage.getItem("username");
    const storedFarmId = sessionStorage.getItem("farm_id");

    if (token) {
      fetch(`http://54.234.44.46:3000/api/v1/user/${storedUsername}/farms`)
        .then((response) => response.json())
        .then((data) => {
          const userId = data.result[0].user_id;
          console.log("user id", userId);
          fetch(`http://54.234.44.46:3000/api/v1/farm/user/${userId}/total`)
            .then((response) => response.json())
            .then((data) => {
              setTreeData(data.result);
              console.log(data.result);
              const filteredFarm = data.result.farms.find((farm: { farm_id: number; }) =>
                farm.farm_id === Number(storedFarmId)
              );
              setFilteredTotalTrees(filteredFarm?.totalCollectedTrees || 0);
            })
            .catch((error) => {
              console.error("Error fetching total collected trees:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching farm data:", error);
        });
    } else {
      router.replace("/");
    }

    sessionStorage.setItem("farm_id", String(params.id));
  }, [params.id, router]);

  return (
    <div className="p-4">
      <div className="text-4xl font-bold">ผลผลิตย้อนหลัง</div>
      <div className="border-2 border-primary rounded-md p-2 space-y-2 text-primary font-semibold">
        <div>ผลผลิตในปีนี้</div>
        <div className="text-2xl">{filteredTotalTrees} ลูก</div>
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
