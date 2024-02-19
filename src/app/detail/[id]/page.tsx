"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import imageupload from "../../../../public/imageupload.jpg";
import {
  AddCircleSvg,
  AlertDeleteSvg,
  CartSvg,
  ClimateSvg,
  SuccessSvg,
  TreeIconSvg,
} from "@/components/Svg";
import BtnPredict from "@/components/BtnPredict";
import Link from "next/link";
import { BASE_URL, SUB_URL } from "@/config";

interface FarmData {
  id: number;
  farm_name: string;
  farm_location: string;
  farm_province: string;
  farm_durian_species: string;
  farm_photo: string;
  farm_status: boolean;
  farm_pollination_date: string;
  farm_tree: number;
  farm_space: number;
  latitude: number;
  longtitude: number;
  duian_amount: number;
}

interface TreeData {
  id: number;
  farm_id: number;
  tree_collected: number | null;
  tree_ready: number | null;
  tree_notReady: number | null;
  created_at: string;
  tree_photo_path: string;
}

type Props = {
  params: { id: number };
};

const PageDetail = ({ params }: Props) => {
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [treeCollected, setTreeCollected] = useState<number | null>(null);
  const [treeReady, setTreeReady] = useState<number | null>(null);
  const [treeNotReady, setTreeNotReady] = useState<number | null>(null);
  const [numberOfIds, setNumberOfIds] = useState<number>(0);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalUpdateOpen, setModaUpdatelOpen] = useState<boolean>(false);
  const [modalDelteOpen, setDeleteOpen] = useState<boolean>(false);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const [temperature, setTemperature] = useState<number | null>(null);
  const [rainvolume, setRainvolume] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [windspeed, setWspeed] = useState<number | null>(null);

  const router = useRouter();

  const fetchTemperature = async () => {
    try {
      const response = await fetch(`${SUB_URL}/temp`);
      if (response.ok) {
        const data = await response.json();
        setTemperature(Math.round(data));
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  const fetchRainvolume = async () => {
    try {
      const response = await fetch(`${SUB_URL}0/rain`);
      if (response.ok) {
        const data = await response.json();
        setRainvolume(Math.round(data));
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  const fetchHumidity = async () => {
    try {
      const response = await fetch(`${SUB_URL}/humidity`);
      if (response.ok) {
        const data = await response.json();
        setHumidity(Math.round(data));
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  const fetchWspeed = async () => {
    try {
      const response = await fetch(`${SUB_URL}/wind/speed`);
      if (response.ok) {
        const data = await response.json();
        setWspeed(Math.round(data));
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    if (token) {
      fetch(`${BASE_URL}/api/v1/farm/${params.id}`)
        .then((response) => response.json())
        .then((data) => {
          setFarmData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching farm data:", error);
        });
      fetch(`${BASE_URL}/api/v1/farm/${params.id}/trees`)
        .then((response) => response.json())
        .then((data) => {
          setTreeData(data.result);
          setNumberOfIds(data.result.length);
        })
        .catch((error) => {
          console.error("Error fetching tree data:", error);
        });
    } else {
      router.replace("/");
    }
  }, [params.id, router]);

  const farmImageBaseUrl = `${BASE_URL}`;

  useEffect(() => {
    // Reset input fields when a new tree is selected
    setTreeCollected(null);
    setTreeReady(null);
    setTreeNotReady(null);
    fetchTemperature();
    fetchRainvolume();
    fetchHumidity();
    fetchWspeed();

    if (selectedTree) {
      // Set input fields with the values from the selected tree
      setTreeCollected(selectedTree.tree_collected ?? null);
      setTreeReady(selectedTree.tree_ready ?? null);
      setTreeNotReady(selectedTree.tree_notReady ?? null);
    }

    const temp = setInterval(() => {
      fetchTemperature();
    }, 11000);

    const volume = setInterval(() => {
      fetchRainvolume();
    }, 11000);

    const humid = setInterval(() => {
      fetchHumidity();
    }, 11000);

    const wspeed = setInterval(() => {
      fetchWspeed();
    }, 11000);

    return () => {
      clearInterval(temp);
      clearInterval(volume);
      clearInterval(humid);
      clearInterval(wspeed);
    };
  }, [selectedTree]);

  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    return () => {
      clearTimeout(notificationTimeout);
    };
  }, [showNotification]);

  const handleAddTree = async () => {
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    if (treeCollected === null || treeReady === null || treeNotReady === null) {
      alert(
        "Please enter values for tree_collected, tree_ready, and tree_notReady"
      );
      return;
    }

    const formData = new FormData();
    formData.append("tree_collected", treeCollected.toString());
    formData.append("tree_ready", treeReady.toString());
    formData.append("tree_notReady", treeNotReady.toString());
    formData.append("tree_photo_path", selectedImage);

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/v1/farm/${params.id}/tree`,
        {
          method: "POST",
          body: formData,
          redirect: "follow",
        }
      );

      if (response.ok) {
        console.log("Tree added successfully");

        const treeResponse = await fetch(
          `${BASE_URL}/api/v1/farm/${params.id}/trees`
        );
        const treeDataResult = await treeResponse.json();
        setTreeData(treeDataResult.result);
        setLoading(false);
        setTreeCollected(null);
        setTreeReady(null);
        setTreeNotReady(null);
        setSelectedImage(null);
        setModalOpen(false);
        setNumberOfIds((prevNumberOfIds) => prevNumberOfIds + 1);

        setShowNotification(true);
        setNotificationMessage("เพิ่มต้นทุเรียนสำเร็จ");
      } else {
        console.error("Error adding tree:", await response.text());
      }
    } catch (error) {
      console.error("Error adding tree:", error);
    }
  };

  const handletreeUpdate = async () => {
    if (!selectedTree) {
      console.error("No selected tree");
      return;
    }

    const formData = new FormData();
    formData.append("tree_collected", treeCollected?.toString() ?? "");
    formData.append("tree_ready", treeReady?.toString() ?? "");
    formData.append("tree_notReady", treeNotReady?.toString() ?? "");
    if (selectedImage) {
      formData.append("tree_photo_path", selectedImage);
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/api/v1/farm/update/tree/${selectedTree.id}`,
        {
          method: "PUT",
          body: formData,
          redirect: "follow",
        }
      );

      if (response.ok) {
        const treeResponse = await fetch(
          `${BASE_URL}/api/v1/farm/${params.id}/trees`
        );
        const treeDataResult = await treeResponse.json();
        setTreeData(treeDataResult.result);
        setLoading(false);
        setSelectedTree(null);
        setModaUpdatelOpen(false);

        const updatedFields = [];
        if (treeCollected !== selectedTree.tree_collected) {
          updatedFields.push(
            `แก้ไขจำนวนผลที่เก็บแล้วเป็น ${treeCollected} ลูก`
          );
        }
        if (treeReady !== selectedTree.tree_ready) {
          updatedFields.push(`แก้ไขจำนวนผลที่พร้อมจะเก็บเป็น ${treeReady} ลูก`);
        }
        if (treeNotReady !== selectedTree.tree_notReady) {
          updatedFields.push(
            `แก้ไขจำนวนผลที่ยังไม่พร้อมจะเก็บเป็น ${treeNotReady} ลูก`
          );
        }
        if (selectedImage) {
          updatedFields.push("อัพเดทรูปภาพสำเร็จ");
        }

        setShowNotification(true);
        setNotificationMessage(updatedFields.join(", "));
      } else {
        console.error("Error updating tree:", await response.text());
      }
    } catch (error) {
      console.error("Error updating tree:", error);
    }
  };

  const handleDeleteTree = async () => {
    if (!selectedTree) {
      console.error("No selected tree");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/v1/farm/delete/tree/${selectedTree.id}`,
        {
          method: "DELETE",
          redirect: "follow",
        }
      );

      if (response.ok) {
        console.log("Tree deleted successfully");

        // Refresh tree data after a successful delete
        const treeResponse = await fetch(
          `${BASE_URL}/api/v1/farm/${params.id}/trees`
        );
        const updatedTreeData = treeData.filter(
          (tree) => tree.id !== selectedTree.id
        );
        setTreeData(updatedTreeData);
        setLoading(false);
        setSelectedTree(null);
        setDeleteOpen(false);
        setNumberOfIds((prevNumberOfIds) => prevNumberOfIds - 1);
        setShowNotification(true);
        setNotificationMessage(`ลบต้นทุเรียนออกสำเร็จ!`);
      } else {
        console.error("Error deleting tree:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting tree:", error);
    }
  };

  const totalTreesCollected = (treeData ?? []).reduce(
    (total, tree) => total + (tree.tree_collected ?? 0),
    0
  );
  const totalTreeReady = (treeData ?? []).reduce(
    (total, tree) => total + (tree.tree_ready ?? 0),
    0
  );
  const totalTreeNotReady = (treeData ?? []).reduce(
    (total, tree) => total + (tree.tree_notReady ?? 0),
    0
  );

  const percentageCollected =
    (farmData?.duian_amount
      ? (totalTreesCollected / farmData.duian_amount) * 100
      : 0) || 0;
  const percentageReady =
    (farmData?.duian_amount
      ? (totalTreeReady / farmData.duian_amount) * 100
      : 0) || 0;
  const percentageNotReady =
    (farmData?.duian_amount
      ? (totalTreeNotReady / farmData.duian_amount) * 100
      : 0) || 0;

  const pollinationDate = farmData?.farm_pollination_date;
  const formattedDate = pollinationDate
    ? new Date(pollinationDate).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const calculateFillClass = (tree: TreeData): string => {
    const { tree_collected, tree_ready, tree_notReady } = tree;

    // Ensure values are not null
    const collected = tree_collected || 0;
    const ready = tree_ready || 0;
    const notReady = tree_notReady || 0;

    const max = Math.max(collected, ready, notReady);
    const count = [collected, ready, notReady].filter(
      (value) => value === max
    ).length;

    if (count === 1) {
      if (collected === max) {
        return "black";
      } else if (ready === max) {
        return "#22c55e";
      } else {
        return "#b91c1c";
      }
    } else {
      return "#eab308";
    }
  };

  // const selectedTree = treeData.find((tree) => tree.id === selectedTreeId);
  // console.log(params.id);

  return (
    <div className="flex min-h-screen flex-col items-center space-y-2 p-4">
      {farmData ? (
        <div className="space-y-2">
          <div className="text-start w-full space-y-2">
            <div
              className="grid grid-cols-4 p-2 rounded-md bg-green-200 
            bg-opacity-20 shadow-md md:hidden"
            >
              <div className="col-span-3 text-xl font-bold xs:text-3xl 2xs:text-4xl sm:text-6xl">
                <div>ฟาร์มทุเรียน</div>
                <div className="pt-0 2xs:pt-2">{farmData.farm_name}</div>
                {farmData.farm_status ? (
                  <p
                    className="font-semibold text-success 2xs:pt-2 pt-0 sm:hidden block text-sm
                  2xs:text-lg"
                  >
                    พร้อมที่จะทำการเก็บเกี่ยวแล้ว
                  </p>
                ) : (
                  <p className="text-base font-semibold pt-2">
                    ยังไม่พร้อมที่จะทำการเก็บเกี่ยว
                  </p>
                )}
              </div>
              <div
                className="items-start text-xl font-medium flex-col 
              rounded-md shadow-lg bg-green-400 p-2 bg-opacity-60 mb-6
              2xs:block hidden 3xs:w-[113px]"
              >
                <div className="inline-flex mb-2 3xs:font-semibold 3xs:text-2xl">
                  {temperature !== null ? `${temperature}°C` : "Loading..."}{" "}
                  <ClimateSvg />
                </div>
                <Link href={"/sensor"}>
                  <div className="text-xs font-medium btn btn-sm">
                    sensors data
                  </div>
                </Link>
              </div>
              <div
                className="col-span-4 self-center text-xl font-medium 
              rounded-md shadow-lg bg-green-400 p-2 bg-opacity-60
              flex justify-between items-center 2xs:hidden"
              >
                <div className="inline-flex">
                  {temperature !== null ? `${temperature}°C` : "Loading..."}{" "}
                  <ClimateSvg />
                </div>
                <Link href={"/sensor"}>
                  <div className="text-xs font-medium btn btn-sm">
                    sensors data
                  </div>
                </Link>
              </div>
            </div>
            <div className="text-center text-7xl font-bold hidden md:block h-28">
              <div className="inline-block">ฟาร์มทุเรียน</div>
              <p className="bg-primary text-white inline-block">
                {farmData.farm_name}
              </p>
            </div>

            <div
              className="pt-2 md:pt-0 relative 3xs:h-80 h-64 md:h-96 md:w-[40rem] lg:w-[55rem]
            lg:h-[35rem] xl:w-[70rem] xl:h-[45rem] 2xl:w-[85rem]"
            >
              {farmData?.farm_photo && (
                <Image
                  src={`${farmImageBaseUrl}${farmData?.farm_photo}`}
                  alt={`Farm ${farmData?.farm_name} Photo`}
                  layout="fill"
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  objectFit="cover"
                  className="hidden md:block"
                  priority
                />
              )}
              {farmData?.farm_photo && (
                <Image
                  src={`${farmImageBaseUrl}${farmData?.farm_photo}`}
                  alt={`Farm ${farmData?.farm_name} Photo`}
                  layout="fill"
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  objectFit="cover"
                  className="block md:hidden"
                  priority
                />
              )}
              <div
                className="absolute grid grid-cols-4 grid-rows-2 w-full h-full 
              -mt-2 md:mt-0 place-items-center gap-2"
              >
                <div
                  className="col-span-2 bg-green-200 bg-opacity-90 h-[70%] 
                hidden md:block w-[85%] rounded-lg p-3 "
                >
                  <div className="flex flex-col text-sm space-y-2 lg:text-lg">
                    <div className="inline-flex justify-between">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                        {farmData.farm_province}
                      </div>
                      <div>Mostly sunny</div>
                    </div>
                    <div
                      className="inline-flex justify-between text-xl 
                    font-semibold items-center lg:text-3xl"
                    >
                      <div>
                        {temperature !== null
                          ? `${temperature}°C`
                          : "Loading..."}{" "}
                      </div>
                      <ClimateSvg />
                    </div>
                    <Link href={'/sensor'} className="inline-flex justify-between gap-2">
                      <div className="rounded-xl bg-green-400 w-2/4 h-6 flex 
                      items-center justify-between p-2 lg:w-full lg:flex-col lg:h-[85px] xl:h-[100px]">
                        <div>
                          <svg 
                            viewBox="0 0 32 32" 
                            className="w-5 h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10">
                            <path
                              className="feather_een"
                              d="M24,10c0-4.418-3.582-8-8-8c-3.741,0-6.873,2.572-7.748,6.041C4.738,8.415,2,11.387,2,15  c0,3.684,2.848,6.697,6.461,6.973C8.184,22.577,8,23.258,8,24c0,1.657,1.343,3,3,3s3-1.343,3-3c0-0.74-0.172-1.408-0.429-2  l10.533-0.005C27.369,21.939,30,19.279,30,16C30,12.686,27.314,10,24,10z M11,26c-1.103,0-2-0.897-2-2  c0-1.706,1.263-3.073,2.013-3.735C11.758,20.901,13,22.229,13,24C13,25.103,12.103,26,11,26z M23.777,21H13.019  c-0.448-0.657-0.966-1.165-1.366-1.505c-0.373-0.317-0.924-0.312-1.291,0.012C9.972,19.85,9.465,20.358,9.02,21H9  c-2.484,0-4.797-1.491-5.621-3.834c-1.391-3.954,1.227-7.731,4.979-8.13l0.693-0.074l0.118-0.467  c0.708-2.806,2.986-5.038,5.853-5.428C19.315,2.482,23,5.819,23,10v1h1c2.922,0,5.266,2.519,4.976,5.499  C28.722,19.097,26.387,21,23.777,21z M19.365,22.502c-0.786,0.69-2.054,2.052-2.317,3.838c-0.257,1.746,0.921,3.493,2.678,3.648  C21.507,30.145,23,28.747,23,27c0-2.177-1.456-3.748-2.339-4.5C20.286,22.181,19.735,22.177,19.365,22.502z M20,29  c-1.103,0-2-0.897-2-2c0-1.706,1.263-3.073,2.013-3.735C20.758,23.901,22,25.229,22,27C22,28.103,21.103,29,20,29z"
                            />
                          </svg>
                        </div>
                        <div className="lg:font-semibold">{rainvolume}%</div>
                        <div className="text-sm hidden lg:block font-semibold">Rain gauge</div>
                      </div>
                      <div className="rounded-xl bg-green-400 w-2/4 h-6 flex 
                      items-center justify-between p-2 lg:w-full lg:flex-col lg:h-[85px] xl:h-[100px]">
                        <div>
                          <svg 
                            viewBox="0 0 64 64" 
                            className="w-5 h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10">
                            <path d="M49.7,35.9C47.3,21.2,29.5,4,28.7,3.3c-0.4-0.4-1-0.4-1.4,0C26.4,4.1,6,23.7,6,39c0,12.1,9.9,22,22,22    c3.4,0,6.7-0.8,9.7-2.3c2.1,1.4,4.6,2.3,7.3,2.3c7.2,0,13-5.8,13-13C58,42.5,54.6,37.8,49.7,35.9z M28,59C17,59,8,50,8,39    C8,26.1,24.4,9,28,5.4C31.3,8.7,45,23,47.6,35.3C46.7,35.1,45.9,35,45,35c-7.2,0-13,5.8-13,13c0,3.7,1.5,7,4,9.3    C33.5,58.4,30.8,59,28,59z M45,59c-6.1,0-11-4.9-11-11s4.9-11,11-11s11,4.9,11,11S51.1,59,45,59z" />

                            <path d="M28,54c-8.3,0-15-6.7-15-15c0-0.6-0.4-1-1-1s-1,0.4-1,1c0,9.4,7.6,17,17,17c0.6,0,1-0.4,1-1S28.6,54,28,54z" />

                            <path d="M48.4,40.1c-0.5-0.2-1.1,0-1.3,0.5l-6,14c-0.2,0.5,0,1.1,0.5,1.3C41.7,56,41.9,56,42,56c0.4,0,0.8-0.2,0.9-0.6l6-14    C49.1,40.9,48.9,40.3,48.4,40.1z" />

                            <path d="M44,44c0-1.7-1.3-3-3-3s-3,1.3-3,3s1.3,3,3,3S44,45.7,44,44z M40,44c0-0.6,0.4-1,1-1s1,0.4,1,1s-0.4,1-1,1S40,44.6,40,44z    " />

                            <path d="M49,49c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S50.7,49,49,49z M49,53c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S49.6,53,49,53z    " />
                          </svg>
                        </div>
                        <div className="lg:font-semibold">{humidity}%</div>
                        <div className="text-sm hidden lg:block font-semibold">Humidity</div>
                      </div>
                      <div className="rounded-xl bg-green-400 w-full h-6 flex 
                      items-center justify-between p-2 lg:w-full lg:flex-col lg:h-[85px] xl:h-[100px]">
                        <div>
                          <svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6 lg:w-7 lg:h-7 xl:w-10 xl:h-10"
                          >
                            <path d="M16.7439414,7 L17.5,7 C19.9852814,7 22,9.01471863 22,11.5 C22,13.9852814 19.9852814,16 17.5,16 L11.5,16 C11.2238576,16 11,15.7761424 11,15.5 C11,15.2238576 11.2238576,15 11.5,15 L17.5,15 C19.4329966,15 21,13.4329966 21,11.5 C21,9.56700338 19.4329966,8 17.5,8 L16.9725356,8 C16.9906833,8.16416693 17,8.33099545 17,8.5 C17,8.77614237 16.7761424,9 16.5,9 C16.2238576,9 16,8.77614237 16,8.5 C16,6.56700338 14.4329966,5 12.5,5 L12,5 C9.790861,5 8,6.790861 8,9 L8,9.5 C8,9.77614237 7.77614237,10 7.5,10 C6.43258736,10 5.4933817,10.6751517 5.14273446,11.6649026 C5.0505193,11.9251928 4.76475726,12.0614445 4.50446709,11.9692293 C4.24417691,11.8770142 4.10792519,11.5912521 4.20014035,11.330962 C4.63552757,10.1020207 5.71845994,9.21978032 7,9.03565397 L7,9 C7,6.23857625 9.23857625,4 12,4 L12.5,4 C14.4593282,4 16.1261868,5.25221144 16.7439414,7 L16.7439414,7 Z M11.5,11 C11.2238576,11 11,10.7761424 11,10.5 C11,10.2238576 11.2238576,10 11.5,10 L12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 L2.5,14 C2.22385763,14 2,13.7761424 2,13.5 C2,13.2238576 2.22385763,13 2.5,13 L12,13 C12.5522847,13 13,12.5522847 13,12 C13,11.4477153 12.5522847,11 12,11 L11.5,11 Z M4.5,17 C4.22385763,17 4,16.7761424 4,16.5 C4,16.2238576 4.22385763,16 4.5,16 L9,16 C10.1045695,16 11,16.8954305 11,18 C11,19.1045695 10.1045695,20 9,20 L7.5,20 C7.22385763,20 7,19.7761424 7,19.5 C7,19.2238576 7.22385763,19 7.5,19 L9,19 C9.55228475,19 10,18.5522847 10,18 C10,17.4477153 9.55228475,17 9,17 L4.5,17 Z" />
                          </svg>
                        </div>
                        <div className="lg:font-semibold">{windspeed} km/h</div>
                        <div className="text-sm hidden lg:block font-semibold">Wind speed</div>
                      </div>
                    </Link>
                  </div>
                </div>

                <div
                  className="col-span-2 row-span-4 bg-white h-[80%] xl:h-[70%]
                w-[90%] hidden md:block p-2 self-start rounded-b-lg"
                >
                  <div>
                    {farmData.farm_status ? (
                      <div
                        className="font-semibold text-success text-md 
                      inline-block lg:text-2xl xl:text-4xl"
                      >
                        <div className="text-black inline-block pr-2">
                          สถานะ:
                        </div>
                        พร้อมที่จะทำการเก็บเกี่ยวแล้ว
                      </div>
                    ) : (
                      <div
                        className="text-base font-semibold pt-2 text-md 
                      inline-block lg:text-2xl xl:text-4xl"
                      >
                        <div className="text-black inline-block pr-2">
                          สถานะ:
                        </div>
                        ยังไม่พร้อมที่จะทำการเก็บเกี่ยว
                      </div>
                    )}
                  </div>
                  <div className="pt-8 lg:pt-16 lg:space-y-2">
                    <div className="text-md lg:text-2xl font-semibold">
                      เก็บแล้ว {totalTreesCollected} ลูก
                    </div>
                    <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                      <progress
                        className="progress progress-black h-full bg-white"
                        value={percentageCollected}
                        max="100"
                      ></progress>
                    </div>
                  </div>
                  <div className="pt-4 lg:pt-6 lg:space-y-2">
                    <div className="text-md lg:text-2xl font-semibold text-success">
                      พร้อมที่จะเก็บ {totalTreeReady} ลูก
                    </div>
                    <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                      <progress
                        className="progress progress-success h-full bg-white"
                        value={percentageReady}
                        max="100"
                      ></progress>
                    </div>
                  </div>
                  <div className="pt-4 lg:pt-6 lg:space-y-2">
                    <div className="text-md lg:text-2xl font-semibold text-secondary">
                      ยังไม่พร้อมที่จะเก็บ {totalTreeNotReady} ลูก
                    </div>
                    <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                      <progress
                        className="progress progress-secondary h-full bg-white"
                        value={percentageNotReady}
                        max="100"
                      ></progress>
                    </div>
                  </div>
                  <div className="font-semibold pt-2 lg:pt-4 lg:text-xl">
                    ผสมเกสรเมื่อ {formattedDate}
                  </div>
                </div>
                <div
                  className="bg-white h-[60%] w-[70%] hidden md:block p-2 
                lg:pt-6 self-start rounded-lg"
                >
                  <div>
                    <TreeIconSvg />
                  </div>
                  <div className="text-xl font-semibold lg:pt-2 lg:text-2xl xl:text-3xl xl:pt-4">
                    {numberOfIds} ต้น
                  </div>
                  <div className="text-sm lg:text-xl xl:text-2xl">
                    จำนวนต้นทุเรียน
                  </div>
                </div>
                <div
                  className="bg-white h-[60%] w-[70%] hidden md:block p-2 
                lg:pt-6 self-start rounded-lg"
                >
                  <div>
                    <CartSvg />
                  </div>
                  <div className="text-xl font-semibold lg:pt-2 lg:text-2xl xl:text-3xl xl:pt-4">
                    {farmData.duian_amount} ผล
                  </div>
                  <div className="text-sm lg:text-xl xl:text-2xl">จำนวนผล</div>
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <div className="text-lg">เก็บแล้ว {totalTreesCollected} ลูก</div>
              <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                <progress
                  className="progress progress-black h-full bg-white"
                  value={percentageCollected}
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="md:hidden">
              <div className="text-lg text-success">
                พร้อมที่จะเก็บ {totalTreeReady} ลูก
              </div>
              <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                <progress
                  className="progress progress-success h-full bg-white"
                  value={percentageReady}
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="md:hidden">
              <div className="text-lg text-secondary">
                ยังไม่พร้อมที่จะเก็บ {totalTreeNotReady} ลูก
              </div>
              <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                <progress
                  className="progress progress-secondary h-full bg-white"
                  value={percentageNotReady}
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="font-semibold md:hidden">
              ผสมเกสรเมื่อ {formattedDate}
            </div>

            <div className="grid grid-col md:hidden">
              <div className="bg-white w-6/7 space-y-2 inline-flex items-center sm:mr-4">
                <TreeIconSvg />
                <div className="text-gray-600 text-lg pl-2 pb-2">
                  จำนวนต้นทุเรียน {numberOfIds} ต้น
                </div>
              </div>
              <div className="bg-white w-6/7 space-y-2 inline-flex items-center">
                <CartSvg />
                <div className="text-gray-600 text-lg pl-2 pb-2">
                  จำนวนผล {farmData.duian_amount} ลูก
                </div>
              </div>
            </div>

            <div className="pb-2">
              {treeData?.length > 0 && (
                <div>
                  <div
                    className="grid grid-cols-5 2xs:grid-cols-7 3xs:grid-cols-10 
                  md:grid-cols-12 gap-[10px] py-4 md:py-8"
                  >
                    {treeData.map((tree) => (
                      <label
                        key={tree.id}
                        htmlFor="my_modal_7"
                        onClick={() => {
                          setSelectedTree(tree);
                          setModaUpdatelOpen(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={calculateFillClass(tree)}
                          viewBox="0 0 512 512"
                          className="opacity-50 hover:opacity-100 w-[42px] h-[42px]
                          lg:w-[65px] lg:h-[65px] xl:w-[85px] xl:h-[85px]"
                        >
                          <g>
                            <path d="M440.781,203.438c1.188-6.375,1.781-12.781,1.781-19.125c0-45.875-29.094-85.984-71.813-100.625   C354.859,33.969,308.953,0,256,0s-98.875,33.969-114.75,83.688c-42.734,14.625-71.813,54.75-71.813,100.625   c0,6.344,0.594,12.75,1.766,19.125c-24.813,22.813-38.844,54.547-38.844,88.531c0,66.516,54.109,120.625,120.625,120.625   c13.219,0,26.125-2.125,38.531-6.313c14.422,10.219,31.078,16.828,48.484,19.359V512h8h16h8v-86.359   c17.406-2.531,34.063-9.141,48.484-19.359c12.391,4.188,25.313,6.313,38.531,6.313c66.516,0,120.625-54.109,120.625-120.625   C479.641,257.984,465.594,226.25,440.781,203.438z M359.016,380.594c-12.094,0-23.828-2.406-34.922-7.156L315,369.531l-7.563,6.406   c-12.313,10.438-27.516,16.844-43.438,18.469v-41.875l62.547-71.469L314.5,270.531L264,328.25v-58.938l50.438-57.656   l-12.047-10.531L264,245v-90.344h-16v90.359l-38.406-43.891l-12.047,10.531L248,269.313v58.938l-50.5-57.719l-12.047,10.531   L248,352.531v41.875c-15.938-1.625-31.125-8.031-43.453-18.469L197,369.531l-9.109,3.906c-11.078,4.75-22.828,7.156-34.906,7.156   c-48.875,0-88.625-39.75-88.625-88.625c0-27.516,12.563-53.031,34.453-70l8.563-6.656l-2.984-10.406   c-1.969-6.844-2.953-13.781-2.953-20.594c0-34.344,23.297-64.063,56.656-72.266l9.5-2.344l2.25-9.516   C179.344,60.031,214.766,32,256,32s76.656,28.031,86.141,68.188l2.25,9.516l9.5,2.344c33.359,8.203,56.672,37.922,56.672,72.266   c0,6.813-1,13.75-2.969,20.594l-2.984,10.406l8.563,6.656c21.906,16.969,34.469,42.484,34.469,70   C447.641,340.844,407.875,380.594,359.016,380.594z" />
                          </g>
                        </svg>
                      </label>
                    ))}
                  </div>
                  <input
                    type="checkbox"
                    id="my_modal_7"
                    className="modal-toggle"
                  />
                  {modalUpdateOpen && (
                    <div className="modal">
                      <div className="modal-box p-4 w-4/6 md:w-1/3">
                        {selectedImage ? (
                          <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt="Updated Tree Image"
                            className="w-full h-auto"
                            width={450}
                            height={200}
                            priority
                          />
                        ) : (
                          selectedTree?.tree_photo_path && (
                            <Image
                              src={`${farmImageBaseUrl}${selectedTree?.tree_photo_path}`}
                              alt={`Tree ${selectedTree?.id} Photo`}
                              className="w-full h-auto"
                              width={450}
                              height={200}
                              priority
                            />
                          )
                        )}
                        {/* <div>This tree id: {selectedTree?.id}</div> */}
                        <div className="grid grid-cols-4 space-y-2 py-2 items-center">
                          <div className="col-span-2 pt-2">
                            จำนวนที่เก็บแล้ว
                          </div>
                          <input
                            type="number"
                            value={treeCollected?.toString() || ""}
                            onChange={(e) =>
                              setTreeCollected(Number(e.target.value))
                            }
                            className={`col-span-1 input input-bordered border-2 ${
                              treeCollected !== selectedTree?.tree_collected
                                ? "input-success"
                                : ""
                            } input-sm`}
                          />
                          <div className="col-span-1 text-center">ลูก</div>

                          <div className="col-span-2 text-success">
                            จำนวนที่พร้อมเก็บ
                          </div>
                          <input
                            type="number"
                            value={treeReady?.toString() || ""}
                            onChange={(e) =>
                              setTreeReady(Number(e.target.value))
                            }
                            className={`col-span-1 input input-bordered border-2 ${
                              treeReady !== selectedTree?.tree_ready
                                ? "input-success"
                                : ""
                            } input-sm`}
                          />
                          <div className="col-span-1 text-center text-success">
                            ลูก
                          </div>

                          <div className="col-span-2 text-secondary">
                            จำนวนที่ยังไม่พร้อม
                          </div>
                          <input
                            type="number"
                            value={treeNotReady?.toString() || ""}
                            onChange={(e) =>
                              setTreeNotReady(Number(e.target.value))
                            }
                            className={`col-span-1 input input-bordered border-2 ${
                              treeNotReady !== selectedTree?.tree_notReady
                                ? "input-success"
                                : ""
                            } input-sm`}
                          />
                          <div className="col-span-1 text-center text-secondary">
                            ลูก
                          </div>

                          <input
                            type="file"
                            // className="file-input file-input-bordered border-2 file-input-success w-full file-input-sm col-span-4"
                            className={`file-input file-input-bordered border-2 ${
                              fileInputRef.current?.files?.[0]
                                ? "file-input-success"
                                : ""
                            } w-full file-input-sm col-span-4`}
                            ref={fileInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedImage(file);
                              }
                            }}
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            className="btn btn-error btn-sm"
                            onClick={() => {
                              setDeleteOpen(true);
                              setModaUpdatelOpen(false);
                            }}
                          >
                            ลบ
                          </button>
                          <button
                            className="btn btn-success btn-sm text-white"
                            onClick={handletreeUpdate}
                            disabled={
                              treeCollected === selectedTree?.tree_collected &&
                              treeReady === selectedTree?.tree_ready &&
                              treeNotReady === selectedTree?.tree_notReady &&
                              !selectedImage
                            }
                          >
                            {loading && (
                              <span className="loading loading-spinner"></span>
                            )}
                            แก้ไข
                          </button>
                        </div>
                      </div>
                      <label
                        className="modal-backdrop"
                        htmlFor="my_modal_7"
                        onClick={() => {
                          setSelectedTree(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                          setSelectedImage(null);
                        }}
                      >
                        Close
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <label
                htmlFor="my_modal_8"
                className="btn btn-success text-white rounded-3xl btn-sm 
                btn-wide text-lg font-medium lg:btn-md lg:text-xl"
                onClick={() => setModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  className="w-[24px] lg:w-[35px] h-[24px] lg:h-[35px]"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="M440.781,203.438c1.188-6.375,1.781-12.781,1.781-19.125c0-45.875-29.094-85.984-71.813-100.625   C354.859,33.969,308.953,0,256,0s-98.875,33.969-114.75,83.688c-42.734,14.625-71.813,54.75-71.813,100.625   c0,6.344,0.594,12.75,1.766,19.125c-24.813,22.813-38.844,54.547-38.844,88.531c0,66.516,54.109,120.625,120.625,120.625   c13.219,0,26.125-2.125,38.531-6.313c14.422,10.219,31.078,16.828,48.484,19.359V512h8h16h8v-86.359   c17.406-2.531,34.063-9.141,48.484-19.359c12.391,4.188,25.313,6.313,38.531,6.313c66.516,0,120.625-54.109,120.625-120.625   C479.641,257.984,465.594,226.25,440.781,203.438z M359.016,380.594c-12.094,0-23.828-2.406-34.922-7.156L315,369.531l-7.563,6.406   c-12.313,10.438-27.516,16.844-43.438,18.469v-41.875l62.547-71.469L314.5,270.531L264,328.25v-58.938l50.438-57.656   l-12.047-10.531L264,245v-90.344h-16v90.359l-38.406-43.891l-12.047,10.531L248,269.313v58.938l-50.5-57.719l-12.047,10.531   L248,352.531v41.875c-15.938-1.625-31.125-8.031-43.453-18.469L197,369.531l-9.109,3.906c-11.078,4.75-22.828,7.156-34.906,7.156   c-48.875,0-88.625-39.75-88.625-88.625c0-27.516,12.563-53.031,34.453-70l8.563-6.656l-2.984-10.406   c-1.969-6.844-2.953-13.781-2.953-20.594c0-34.344,23.297-64.063,56.656-72.266l9.5-2.344l2.25-9.516   C179.344,60.031,214.766,32,256,32s76.656,28.031,86.141,68.188l2.25,9.516l9.5,2.344c33.359,8.203,56.672,37.922,56.672,72.266   c0,6.813-1,13.75-2.969,20.594l-2.984,10.406l8.563,6.656c21.906,16.969,34.469,42.484,34.469,70   C447.641,340.844,407.875,380.594,359.016,380.594z" />
                  </g>
                </svg>
                เพิ่มต้นทุเรียน
              </label>
              <input type="checkbox" id="my_modal_8" className="modal-toggle" />
              {modalOpen && (
                <div className="modal">
                  <div className="modal-box space-y-4 p-4 w-4/6">
                    <div className="inline-flex items-center">
                      <div className="pr-2 text-success">
                        <AddCircleSvg />
                      </div>
                      <h3 className="text-lg font-bold">เพิ่มต้นทุเรียน</h3>
                    </div>
                    {selectedImage ? (
                      <div className="flex items-center justify-center border-2 border-success rounded-xl">
                        <Image
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected Tree Image"
                          className="w-full h-auto rounded-xl"
                          width={1280}
                          height={720}
                          priority
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center border-2 rounded-xl">
                        <Image
                          src={imageupload}
                          alt="Default Image"
                          className="w-4/5 h-auto"
                          width={50}
                          height={50}
                          priority
                        />
                      </div>
                    )}
                    <input
                      type="number"
                      placeholder="Collected amount"
                      className={`col-span-1 input input-bordered border-2 w-full ${
                        treeCollected ? "input-success" : ""
                      } input-sm`}
                      value={treeCollected !== null ? treeCollected : ""}
                      onChange={(e) =>
                        setTreeCollected(
                          e.target.value !== "" ? Number(e.target.value) : null
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="Ready amount"
                      className={`col-span-1 input input-bordered border-2 w-full ${
                        treeReady ? "input-success" : ""
                      } input-sm`}
                      value={treeReady !== null ? treeReady : ""}
                      onChange={(e) =>
                        setTreeReady(
                          e.target.value !== "" ? Number(e.target.value) : null
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="Not ready amount"
                      className={`col-span-1 input input-bordered border-2 w-full ${
                        treeNotReady ? "input-success" : ""
                      } input-sm`}
                      value={treeNotReady !== null ? treeNotReady : ""}
                      onChange={(e) =>
                        setTreeNotReady(
                          e.target.value !== "" ? Number(e.target.value) : null
                        )
                      }
                    />
                    <input
                      type="file"
                      className={`file-input file-input-bordered border-2 ${
                        fileInputRef.current?.files?.[0]
                          ? "file-input-success"
                          : ""
                      } w-full file-input-sm`}
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                        }
                      }}
                    />
                    <div className="text-center">
                      <button
                        className="btn btn-success text-white"
                        onClick={handleAddTree}
                        disabled={
                          !treeCollected ||
                          !treeReady ||
                          !treeNotReady ||
                          !selectedImage
                        }
                      >
                        {loading && (
                          <span className="loading loading-spinner"></span>
                        )}
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  <label
                    className="modal-backdrop"
                    htmlFor="my_modal_8"
                    onClick={() => {
                      setTreeCollected(null);
                      setTreeReady(null);
                      setTreeNotReady(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      setSelectedImage(null);
                    }}
                  >
                    Close
                  </label>
                </div>
              )}
            </div>

            <BtnPredict />

            {showNotification && (
              <div
                className="fixed right-0 top-20 bg-white opacity-90 items-center 
                px-2 py-2 text-sm w-[250px] sm:w-[300px] z-50
                  border-t-4 rounded-bl-md shadow-sm flex flex-row drop-shadow-md border-success"
              >
                <SuccessSvg />
                <div className="ml-3">
                  <div className="font-bold text-left text-black">
                    {notificationMessage}
                  </div>
                </div>
              </div>
            )}

            {/* delete dialog */}
            <div>
              {modalDelteOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-md shadow-md flex flex-col items-center">
                    <AlertDeleteSvg />
                    <p className="mb-4">
                      ยืนยันว่าคุณต้องการลบทุเรียนต้นนี้ {selectedTree?.id}
                    </p>
                    <div className="flex justify-end">
                      <button
                        className="btn btn-secondary mr-2"
                        onClick={() => {
                          if (selectedTree) {
                            handleDeleteTree();
                          }
                        }}
                      >
                        {loading && (
                          <span className="loading loading-spinner"></span>
                        )}
                        ลบฟาร์ม
                      </button>
                      <button
                        className="btn"
                        onClick={() => setDeleteOpen(false)}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span className="loading bg-primary loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
};

export default PageDetail;
