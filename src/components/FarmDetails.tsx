"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  AddCircleSvg,
  AddSvg,
  AlertDeleteSvg,
  DeleteSvg,
  EditSvg,
  InfoSvg,
  SearchSvg,
  SuccessSvg,
  UpdateSvg,
} from "./Svg";
import Link from "next/link";
import BtnPredict from "./BtnPredict";

type FarmData = {
  user_farm_id: number;
  user_id: number;
  farm_id: number;
  farm: {
    id: number;
    farm_name: string;
    farm_location: string;
    farm_province: string;
    farm_durian_species: string;
    farm_photo: string;
    farm_status: boolean;
    farm_pollination_date: string;
    farm_tree: number | null;
    farm_space: number | null;
    latitude: number | null;
    longtitude: number | null;
    duian_amount: number | null;
  };
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

const FarmDetail: React.FC = () => {
  const [userFarms, setUserFarms] = useState<FarmData[]>([]);
  const [userTrees, setUserTrees] = useState<TreeData | null>(null);

  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const [totalDuianAmount, setTotalDuianAmount] = useState<number>(0);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalDelteOpen, setDeleteOpen] = useState<boolean>(false);
  const [modalUpdateOpen, setUpdateOpen] = useState<boolean>(false);
  const [modalMapOpen, setMapOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const [farm_name, setFarm_name] = useState<string>("");
  const [farm_location, setFarm_location] = useState<string>("");
  const [farm_province, setFarm_province] = useState<string>("");
  const [farm_durian_species, setFarm_durian_species] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const [farm_status, setFarm_status] = useState<boolean>(true);
  const [farm_tree, setFarm_tree] = useState<number | null>(null);
  const [farm_space, setFarm_space] = useState<number | null>(null);
  const [duian_amount, setDurian_amount] = useState<number | null>(null);
  const [latitude, setLat] = useState<number | null>(null);
  const [longtitude, setLng] = useState<number | null>(null);
  const [farm_pollination_date, setFarm_pollination_date] =
    useState<string>("");

  const [selectedFarmId, setSelectedFarmId] = useState<FarmData | null>(null);
  const [updatedFarmName, setUpdatedFarmName] = useState<string>("");
  const [updatedFarmLocation, setUpdatedFarmLocation] = useState<string>("");
  const [updatedFarmProvince, setUpdatedFarmProvince] = useState<string>("");
  const [updatedFarmDurianSpecies, setUpdatedFarmDurianSpecies] =
    useState<string>("");
  const [updatedFarmTree, setUpdatedFarmTree] = useState<number | null>(null);
  const [updatedFarmSpace, setUpdatedFarmSpace] = useState<number | null>(null);
  const [updatedDuianAmount, setUpdatedDuianAmount] = useState<number | null>(
    null
  );
  const [updatedLatitude, setUpdatedLatitude] = useState<number | null>(null);
  const [updatedLongtitude, setUpdatedLongtitude] = useState<number | null>(
    null
  );
  const [updatedFarmPollinationDate, setUpdatedFarmPollinationDate] =
    useState<string>("");
  const [updatedFarmStatus, setUpdatedFarmStatus] = useState<boolean>(true);
  const [updatedFarmPhoto, setUpdatedFarmPhoto] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = sessionStorage.getItem("Token");
        if (storedToken) {
          setToken(storedToken);
          const storedUsername = sessionStorage.getItem("username");

          if (storedUsername) {
            setUsername(storedUsername);

            // Fetch user farms
            const farmsResponse = await fetch(
              `http://localhost:3000/api/v1/user/${storedUsername}/farms`
            );
            const farmsData = await farmsResponse.json();
            setUserFarms(farmsData.result);

            // Calculate totalDuianAmount
            const calculatedTotalDuianAmount = farmsData.result.reduce(
              (total: number, farm: FarmData) => {
                return total + (farm.farm.duian_amount || 0);
              },
              0
            );
            setTotalDuianAmount(calculatedTotalDuianAmount);

            const firstFarm = farmsData.result[0];
            if (firstFarm) {
              const totalCollectedResponse = await fetch(
                `http://localhost:3000/api/v1/farm/user/${firstFarm.user_id}/total`
              );
              const totalCollectedData = await totalCollectedResponse.json();
              setUserTrees(totalCollectedData);
              setSelectedFarmId(firstFarm.farm_id);
            }

            setLoadingData(false);
          }
        }
      } catch (error) {
        setLoadingData(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const farmImageBaseUrl = "http://localhost:3000";

  const handleAddFarm = async () => {
    if (fileInput.current?.files?.length) {
      const formdata = new FormData();
      formdata.append("farm_name", farm_name);
      formdata.append("farm_location", farm_location);
      formdata.append("farm_province", farm_province);
      formdata.append("farm_durian_species", farm_durian_species);
      formdata.append("farm_photo", fileInput.current.files[0]);
      formdata.append("farm_status", farm_status ? "1" : "0");
      formdata.append(
        "farm_pollination_date",
        `${farm_pollination_date}T00:00:00Z`
      );
      formdata.append("farm_tree", farm_tree?.toString() || "");
      formdata.append("farm_space", farm_space?.toString() || "");
      formdata.append("latitude", latitude?.toString() || "");
      formdata.append("longtitude", longtitude?.toString() || "");
      formdata.append("duian_amount", duian_amount?.toString() || "");

      const requestOptions = {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/v1/farm/${username}`,
          requestOptions
        );
        const result = await response.json();

        setModalOpen(false);
        setLoading(false);
        setShowNotification(true);
        setNotificationMessage(
          `ฟาร์ม ${farm_name} ได้ถูกสร้างเป็นที่เรียบร้อย!`
        );

        const refetchResponse = await fetch(
          `http://localhost:3000/api/v1/user/${username}/farms`
        );
        const refetchData = await refetchResponse.json();
        setUserFarms(refetchData.result);

        setFarm_name("");
        setFarm_location("");
        setFarm_province("");
        setFarm_durian_species("");
        setFarm_status(false);
        setFarm_pollination_date("");
        setFarm_tree(null);
        setFarm_space(null);
        setLat(null);
        setLng(null);
        setDurian_amount(null);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("No file selected for farm photo");
    }
  };

  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    return () => {
      clearTimeout(notificationTimeout);
    };
  }, [showNotification]);

  const updateModal = (farm: FarmData) => {
    setSelectedFarmId(farm);
    setUpdatedFarmName(farm.farm.farm_name);
    setUpdatedFarmLocation(farm.farm.farm_location);
    setUpdatedFarmProvince(farm.farm.farm_province);
    setUpdatedFarmDurianSpecies(farm.farm.farm_durian_species);
    setUpdatedFarmTree(farm.farm.farm_tree);
    setUpdatedFarmSpace(farm.farm.farm_space);
    setUpdatedDuianAmount(farm.farm.duian_amount);
    setUpdatedFarmPollinationDate(
      farm.farm.farm_pollination_date.split("T")[0]
    );
    setUpdatedLatitude(farm.farm.latitude);
    setUpdatedLongtitude(farm.farm.longtitude);
    setUpdatedFarmStatus(farm.farm.farm_status);
    setUpdateOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedFarmId) {
      // console.log("Selected Farm ID:", selectedFarmId);

      const formdata = new FormData();
      formdata.append("farm_name", updatedFarmName);
      formdata.append("farm_location", updatedFarmLocation);
      formdata.append("farm_province", updatedFarmProvince);
      formdata.append("farm_durian_species", updatedFarmDurianSpecies);
      formdata.append("farm_tree", updatedFarmTree?.toString() || "");
      formdata.append("farm_space", updatedFarmSpace?.toString() || "");
      formdata.append("duian_amount", updatedDuianAmount?.toString() || "");
      formdata.append(
        "farm_pollination_date",
        `${updatedFarmPollinationDate}T00:00:00Z`
      );
      formdata.append("latitude", updatedLatitude?.toString() || "");
      formdata.append("longtitude", updatedLongtitude?.toString() || "");
      formdata.append("farm_status", updatedFarmStatus ? "1" : "0");
      if (updatedFarmPhoto) {
        formdata.append("farm_photo", updatedFarmPhoto);
      }

      // console.log(updatedFarmStatus);

      const requestOptions = {
        method: "PUT",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/v1/farm/${selectedFarmId.farm_id}`,
          requestOptions
        );

        if (response.ok) {
          // Fetch updated user farms
          const refetchResponse = await fetch(
            `http://localhost:3000/api/v1/user/${username}/farms`
          );
          const refetchData = await refetchResponse.json();
          setUserFarms(refetchData.result);
          const calculatedTotalDuianAmount = refetchData.result.reduce(
            (total: number, farm: FarmData) => {
              return total + (farm.farm.duian_amount || 0);
            },
            0
          );
          setTotalDuianAmount(calculatedTotalDuianAmount);
          setUpdateOpen(false);
        } else {
          console.error("Failed to update farm:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating farm:", error);
      } finally {
        setShowNotification(true);
        setNotificationMessage(`ฟาร์ม ${updatedFarmName} อัพเดทเสร็จสิ้น!`);
        setLoading(false);
      }
    }
  };

  const deleteModal = (farm: FarmData) => {
    setSelectedFarmId(farm);
    setDeleteOpen(true);
  };

  const handleDeleteFarm = async (farmId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/farm/${farmId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowNotification(true);
      setNotificationMessage(`ลบฟาร์ม ${farm_name} เรียบร้อย!`);

      if (response.ok) {
        setUserFarms((prevFarms) =>
          prevFarms.filter((farm) => farm.farm.id !== farmId)
        );
      } else {
        console.error("Failed to delete farm:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUpdatedFarmPhoto(e.target.files[0]);
    }
  };

  const filteredFarms = userFarms
    ? userFarms
        .filter((farm) => {
          if (filter === "พร้อมที่จะเก็บ") {
            return farm.farm.farm_status;
          } else if (filter === "ยังไม่พร้อมที่จะเก็บ") {
            return !farm.farm.farm_status;
          }
          return true;
        })
        .filter((farm) => {
          const searchString = searchInput.toLowerCase();
          const farmName = farm.farm.farm_name.toLowerCase();
          const farmLocation = farm.farm.farm_location.toLowerCase();
          const farmProvince = farm.farm.farm_province.toLowerCase();
          const farmDurianSpecies = farm.farm.farm_durian_species.toLowerCase();

          return (
            farmName.includes(searchString) ||
            farmLocation.includes(searchString) ||
            farmProvince.includes(searchString) ||
            farmDurianSpecies.includes(searchString)
          );
        })
        .sort((a, b) => {
          if (filter === "จากผลผลิตที่มาก") {
            return (b.farm?.duian_amount || 0) - (a.farm?.duian_amount || 0);
          } else if (filter === "จากผลผลิตที่น้อย") {
            return (a.farm?.duian_amount || 0) - (b.farm?.duian_amount || 0);
          }
          return 0;
        })
    : [];

  const mapStyles = {
    height: "50vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 13.7563,
    lng: 100.5018,
  };

  const percentageCollected =
    (totalDuianAmount
      ? userTrees?.result?.sumCollected !== undefined
        ? (userTrees.result.sumCollected / totalDuianAmount) * 100
        : 0
      : 0) || 0;

  console.log("map dialog", modalMapOpen);
  return (
    <div className="space-y-2">
      {loadingData ? (
        <div className="text-center">
          <span className="loading bg-primary loading-spinner loading-lg"></span>
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="text-center text-gray-500 pt-2">
          ยังไม่มีข้อมูลฟาร์มของท่านในขณะนี้
        </div>
      ) : (
        <div>
          <div className="w-full text-center space-y-2 py-4">
            <h1 className="text-3xl font-semibold">
              เก็บแล้วรวม{" "}
              {userTrees?.result?.sumCollected !== undefined
                ? userTrees.result.sumCollected
                : 0}{" "}
              ลูก
            </h1>
            <div className="w-full h-7 border-black border-2 p-0.5 rounded-full flex items-center relative">
              <progress
                className="progress progress-primary h-full bg-white"
                value={percentageCollected}
                max="100"
              ></progress>
              <p className="absolute left-0 right-0">
                จากทั้งหมด {totalDuianAmount} ลูก
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center xl:justify-end">
              <div className="join">
                <div>
                  <div>
                    <input
                      className="input input-bordered join-item w-[20rem] input-sm"
                      placeholder="Search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                </div>
                <div className="indicator">
                  <button className="btn join-item btn-sm">
                    <SearchSvg />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div>
                <select
                  className="select select-bordered join-item select-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>จัดเรียงตาม</option>
                  <option>พร้อมที่จะเก็บ</option>
                  <option>ยังไม่พร้อมที่จะเก็บ</option>
                  <option>จากผลผลิตที่มาก</option>
                  <option>จากผลผลิตที่น้อย</option>
                </select>
              </div>
            </div>

            <div className="flex flex-row justify-center gap-2">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-6">
                {filteredFarms.map((farm) => (
                  <div key={farm.user_farm_id} className="flex flex-col h-full">
                    <div className="card bg-base-100 shadow-xl flex-1">
                      <figure>
                        <Link href={`/detail/${farm.user_farm_id}`}>
                          {farm.farm?.farm_photo && (
                            <Image
                              src={`${farmImageBaseUrl}${farm.farm?.farm_photo}`}
                              alt={`Farm ${farm.farm?.farm_name} Photo`}
                              width={450}
                              height={100}
                              priority
                            />
                          )}
                        </Link>
                      </figure>

                      <div className="card-body -mb-6 -mx-6 -mt-6">
                        <div className="text-start h-full">
                          <div className="text-md font-semibold">
                            ฟาร์มทุเรียน{farm.farm?.farm_name}
                          </div>
                          <p>
                            {farm.farm?.farm_location}, จังหวัด
                            {farm.farm?.farm_province}, ทุเรียนพันธุ์
                            {
                              farm.farm?.farm_durian_species
                            } จำนวนทุเรียนวันนี้ {farm.farm?.duian_amount} ลูก
                          </p>
                        </div>
                        <div className="card-actions justify-end border-t-2 border-gray-100 pt-2">
                          <button onClick={() => deleteModal(farm)}>
                            <DeleteSvg />
                          </button>
                          <label
                            htmlFor="my_modal_5"
                            onClick={() => updateModal(farm)}
                          >
                            <UpdateSvg />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* add modal */}
      <div className="flex justify-center pt-4">
        <label
          htmlFor="my_modal_4"
          className="btn btn-primary btn-sm text-white rounded-3xl text-lg font-medium"
          onClick={() => setModalOpen(true)}
        >
          <AddSvg />
          เพิ่มฟาร์ม
        </label>

        <input
          type="checkbox"
          id="my_modal_4"
          className="modal-toggle hidden"
        />
        {modalOpen && (
          // <div className="modal max-[390px]:pr-[16px]">
          <div className="modal">
            <div className="modal-box space-y-4">
              <div className="inline-flex items-center">
                <div className="pr-2 text-primary">
                  <AddCircleSvg />
                </div>
                <h3 className="text-lg font-bold">เพิ่มฟาร์ม</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="ชื่อฟาร์ม"
                  className="input input-bordered input-primary max-w-lg col-span-2"
                  value={farm_name}
                  onChange={(e) => setFarm_name(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="ที่ตั้งฟาร์ม"
                  className="input input-bordered input-primary max-w-lg col-span-2"
                  value={farm_location}
                  onChange={(e) => setFarm_location(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="จังหวัด"
                  className="input input-bordered input-primary max-w-lg col-span-2"
                  value={farm_province}
                  onChange={(e) => setFarm_province(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="สายพันธ์ุทุเรียน"
                  className="input input-bordered input-primary max-w-lg col-span-2"
                  value={farm_durian_species}
                  onChange={(e) => setFarm_durian_species(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="จำนวนต้น"
                  className="input input-bordered input-primary max-w-xs"
                  value={farm_tree?.toString() || ""}
                  onChange={(e) =>
                    setFarm_tree(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="พื้นที่ (ไร่)"
                  className="input input-bordered input-primary max-w-xs"
                  value={farm_space?.toString() || ""}
                  onChange={(e) =>
                    setFarm_space(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="จำนวนทุเรียน"
                  className="input input-bordered input-primary max-w-xs"
                  value={duian_amount?.toString() || ""}
                  onChange={(e) =>
                    setDurian_amount(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="date"
                  placeholder="วันที่ผสมเกสร"
                  className="input input-bordered input-primary max-w-xs"
                  value={farm_pollination_date}
                  onChange={(e) => setFarm_pollination_date(e.target.value)}
                />
                <label className="text-sm font-medium col-end-3 -mt-1 inline-flex text-gray-500">
                  <InfoSvg />
                  วันที่ผสมเกสร
                </label>
                <input
                  type="number"
                  placeholder="ละติจูด"
                  className="input input-bordered input-primary max-w-xs"
                  disabled
                  value={latitude?.toString() || ""}
                  onChange={(e) =>
                    setLat(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="ลองจิจูด"
                  className="input input-bordered input-primary max-w-xs"
                  disabled
                  value={longtitude?.toString() || ""}
                  onChange={(e) =>
                    setLng(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <div className="col-end-3 flex justify-end">
                  <label
                    htmlFor="my_modal_6"
                    className="btn btn-primary btn-sm text-white rounded-md "
                    onClick={() => setMapOpen(true)}
                  >
                    Open map
                  </label>
                </div>
                <div className="col-span-2">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text text-lg">สถานะฟาร์ม</span>
                      <input
                        type="checkbox"
                        checked={farm_status}
                        className="checkbox checkbox-primary"
                        onChange={() => setFarm_status(!farm_status)}
                      />
                    </label>
                  </div>
                </div>
                <input
                  type="file"
                  id="farm_photo"
                  className="file-input file-input-bordered file-input-primary max-w-xs col-span-2"
                  ref={fileInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setSelectedFile(file);
                  }}
                />
              </div>
              <div className="text-center">
                <button
                  className="btn btn-accent text-white"
                  onClick={handleAddFarm}
                  disabled={
                    !farm_name ||
                    !farm_location ||
                    !farm_province ||
                    !farm_durian_species ||
                    !farm_tree ||
                    !farm_space ||
                    !duian_amount ||
                    !farm_pollination_date ||
                    !latitude ||
                    !longtitude ||
                    !selectedFile
                  }
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  เพิ่มฟาร์ม
                </button>
              </div>
            </div>
            <label
              className="modal-backdrop"
              htmlFor="my_modal_4"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Close
            </label>
          </div>
        )}
      </div>

      <BtnPredict />

      {/* update modal */}
      <div>
        <input type="checkbox" id="my_modal_5" className="modal-toggle" />
        {modalUpdateOpen && (
          // <div className="modal max-[390px]:pr-[16px]">
          <div className="modal">
            <div className="modal-box space-y-4">
              <div className="inline-flex items-center">
                <div className="pr-2 text-success">
                  <EditSvg />
                </div>
                <h3 className="text-lg font-bold">แก้ไขข้อมูลฟาร์ม</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="ชื่อฟาร์ม"
                  className="input input-bordered input-success w-full max-w-lg col-span-2"
                  value={updatedFarmName}
                  onChange={(e) => setUpdatedFarmName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="ที่ตั้งฟาร์ม"
                  className="input input-bordered input-success w-full max-w-lg col-span-2"
                  value={updatedFarmLocation}
                  onChange={(e) => setUpdatedFarmLocation(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="จังหวัด"
                  className="input input-bordered input-success w-full max-w-lg col-span-2"
                  value={updatedFarmProvince}
                  onChange={(e) => setUpdatedFarmProvince(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="สายพันธ์ุทุเรียน"
                  className="input input-bordered input-success w-full max-w-lg col-span-2"
                  value={updatedFarmDurianSpecies}
                  onChange={(e) => setUpdatedFarmDurianSpecies(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="จำนวนต้น"
                  className="input input-bordered input-success w-full max-w-xs"
                  value={updatedFarmTree?.toString() || ""}
                  onChange={(e) =>
                    setUpdatedFarmTree(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="พื้นที่ (ไร่)"
                  className="input input-bordered input-success w-full max-w-xs"
                  value={updatedFarmSpace?.toString() || ""}
                  onChange={(e) =>
                    setUpdatedFarmSpace(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="จำนวนทุเรียน"
                  className="input input-bordered input-success w-full max-w-xs"
                  value={updatedDuianAmount?.toString() || ""}
                  onChange={(e) =>
                    setUpdatedDuianAmount(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="date"
                  placeholder="วันที่ผสมเกสร"
                  className="input input-bordered input-success w-full max-w-xs"
                  value={updatedFarmPollinationDate}
                  onChange={(e) =>
                    setUpdatedFarmPollinationDate(e.target.value)
                  }
                />
                <label className="text-sm font-medium col-end-3 -mt-1 inline-flex text-gray-500">
                  <InfoSvg />
                  วันที่ผสมเกสร
                </label>
                <input
                  type="number"
                  placeholder="Lat"
                  className="input input-bordered input-success w-full max-w-xs"
                  value={updatedLatitude?.toString() || ""}
                  onChange={(e) =>
                    setUpdatedLatitude(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Lng"
                  className="input input-bordered input-success w-full max-w-xs"
                  value={updatedLongtitude?.toString() || ""}
                  onChange={(e) =>
                    setUpdatedLongtitude(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                <div className="col-end-3 flex justify-end">
                  <label
                    htmlFor="my_modal_6"
                    className="btn btn-success btn-sm text-white rounded-md "
                  >
                    Open map
                  </label>
                </div>
                <div className="col-span-2">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text text-lg">สถานะฟาร์ม</span>
                      <input
                        type="checkbox"
                        checked={updatedFarmStatus}
                        className="checkbox checkbox-success"
                        onChange={(e) =>
                          setUpdatedFarmStatus(!updatedFarmStatus)
                        }
                      />
                    </label>
                  </div>
                </div>
                <input
                  type="file"
                  id="farm_photo"
                  className="file-input file-input-bordered file-input-success w-full max-w-xs col-span-2"
                  ref={fileInput}
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
              <div className="text-center">
                <button
                  className="btn btn-success text-white"
                  onClick={handleUpdate}
                  disabled={
                    updatedFarmName === selectedFarmId?.farm.farm_name &&
                    updatedFarmLocation ===
                      selectedFarmId?.farm.farm_location &&
                    updatedFarmProvince ===
                      selectedFarmId?.farm.farm_province &&
                    updatedFarmDurianSpecies ===
                      selectedFarmId?.farm.farm_durian_species &&
                    updatedFarmTree === selectedFarmId?.farm.farm_tree &&
                    updatedFarmSpace === selectedFarmId?.farm.farm_space &&
                    updatedDuianAmount === selectedFarmId?.farm.duian_amount &&
                    updatedFarmPollinationDate ===
                      selectedFarmId?.farm.farm_pollination_date.split(
                        "T"
                      )[0] &&
                    updatedLatitude === selectedFarmId?.farm.latitude &&
                    updatedLongtitude === selectedFarmId?.farm.longtitude &&
                    updatedFarmStatus === selectedFarmId?.farm.farm_status
                  }
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  บันทึก
                </button>
              </div>
            </div>
            <label
              className="modal-backdrop"
              htmlFor="my_modal_5"
              onClick={() => setUpdateOpen(false)}
            >
              Close
            </label>
          </div>
        )}
      </div>

      {/* map modal */}
      <div>
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        {modalMapOpen && (
          <div className="modal max-[390px]:pr-[24px] max-[390px]:pl-2">
            <div className="modal-box p-4">
              {window.google === undefined ? (
                <LoadScript googleMapsApiKey="AIzaSyDsYL6YaNoNwl1F7Gna6rZ_qRc1tuJJ7xA">
                  <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={5}
                    center={defaultCenter}
                    onClick={(e) => {
                      if (e.latLng) {
                        const newLatitude = e.latLng.lat();
                        const newLongitude = e.latLng.lng();
                        setLat(newLatitude);
                        setUpdatedLatitude(newLatitude);

                        setLng(newLongitude);
                        setUpdatedLongtitude(newLongitude);
                      }
                    }}
                  >
                    {latitude !== null && longtitude !== null && (
                      <Marker
                        position={{
                          lat: latitude,
                          lng: longtitude,
                        }}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={5}
                  center={defaultCenter}
                  onClick={(e) => {
                    if (e.latLng) {
                      const newLatitude = e.latLng.lat();
                      const newLongitude = e.latLng.lng();
                      setLat(newLatitude);
                      setUpdatedLatitude(newLatitude);

                      setLng(newLongitude);
                      setUpdatedLongtitude(newLongitude);
                    }
                  }}
                >
                  {latitude !== null && longtitude !== null && (
                    <Marker
                      position={{
                        lat: latitude,
                        lng: longtitude,
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>
            <label
              className="modal-backdrop"
              htmlFor="my_modal_6"
              onClick={() => setMapOpen(false)}
            >
              Close
            </label>
          </div>
        )}
      </div>

      {/* alert add notify */}
      {showNotification && (
        <div
          className="fixed right-0 top-20 w-[80%] bg-white opacity-90 items-center px-2 py-2 text-sm 
          border-t-4 rounded-b-md shadow-sm flex flex-row drop-shadow-md border-success"
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-20">
            <div className="bg-white p-4 rounded-md shadow-md flex flex-col items-center">
              <AlertDeleteSvg />
              <p className="mb-4">
                ยืนยันว่าคุณต้องการลบฟาร์ม {selectedFarmId?.farm.farm_name}?
              </p>
              <div className="flex justify-end">
                <button
                  className="btn btn-secondary mr-2"
                  onClick={() => {
                    if (selectedFarmId) {
                      handleDeleteFarm(selectedFarmId.farm_id);
                      setDeleteOpen(false);
                    }
                  }}
                >
                  ลบฟาร์ม
                </button>
                <button className="btn" onClick={() => setDeleteOpen(false)}>
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetail;
