"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
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

  console.log("params", params.farmId);

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
      console.log("farm_id", setFarmId);

      fetch(`http://localhost:4000/api/v1/farm/${selectedFarm}/predict`)
        .then((response) => response.json())
        .then((data) => {
          const formattedPredictionData = data.result.map(
            (prediction: PredictionData) => {
              return {
                ...prediction,
                tree_ready_in: new Date(
                  prediction.tree_ready_in
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                }),
              };
            }
          );
          setPredictionData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching prediction data:", error);
        });
    }
  }, [selectedFarm]);

  const farmImageBaseUrl = "http://localhost:4000";

  return (
    <div>
      <select
        className="select w-full max-w-xs"
        value={selectedFarm || ""}
        onChange={(e) => setSelectedFarm(Number(e.target.value))}
      >
        <option disabled value="">
          Pick your farm
        </option>
        {farmData &&
          farmData.map((farm) => (
            <option key={farm.farm.id} value={farm.farm.id}>
              {farm.farm.farm_name}
            </option>
          ))}
      </select>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          selectedFarm !== null && (
            <div>
              {(treeData && treeData.length > 0) ||
              (predictionData && predictionData.length > 0) ? (
                <>
                  {treeData &&
                    treeData.map((tree) => (
                      <div key={tree.id}>
                        <p>Tree ID: {tree.id}</p>
                        <p>Collected: {tree.tree_collected}</p>
                        <p>Ready: {tree.tree_ready}</p>
                        <p>Not Ready: {tree.tree_notReady}</p>
                        <p>Created At: {tree.created_at}</p>
                        <Image
                          src={`${farmImageBaseUrl}${tree.tree_photo_path}`}
                          alt={`Tree ${tree.id} Photo`}
                          className="w-full h-auto"
                          width={450}
                          height={200}
                          priority
                        />
                      </div>
                    ))}
                  {predictionData &&
                    predictionData.map((prediction) => (
                      <div key={prediction.id}>
                        <p>Prediction ID: {prediction.id}</p>
                        <p>Prediction Farm ID: {prediction.farm_id}</p>
                        <p>Tree ID: {prediction.tree_id}</p>
                        <p>Ready Amount: {prediction.tree_ready_amount}</p>
                        <p>
                          Tree Ready In:{" "}
                          {new Date(
                            prediction.tree_ready_in
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p>Change: {prediction.change}</p>
                        <p>Percent Change: {prediction.percent_change}</p>
                        <p>Created At: {prediction.created_at}</p>
                      </div>
                    ))}
                </>
              ) : (
                <p>No data found for the selected farm.</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PredictPage;
