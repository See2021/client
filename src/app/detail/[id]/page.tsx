"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import imageupload from "../../../../public/imageupload.jpg";
import {
  AddCircleSvg,
  AlertDeleteSvg,
  CartSvg,
  TreeIconSvg,
} from "@/components/Svg";
import BtnPredict from "@/components/BtnPredict";

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

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    if (token) {
      fetch(`http://localhost:4000/api/v1/farm/${params.id}`)
        .then((response) => response.json())
        .then((data) => {
          setFarmData(data.result);
        })
        .catch((error) => {
          console.error("Error fetching farm data:", error);
        });
      fetch(`http://localhost:4000/api/v1/farm/${params.id}/trees`)
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

  const farmImageBaseUrl = "http://localhost:4000";

  useEffect(() => {
    // Reset input fields when a new tree is selected
    setTreeCollected(null);
    setTreeReady(null);
    setTreeNotReady(null);

    if (selectedTree) {
      // Set input fields with the values from the selected tree
      setTreeCollected(selectedTree.tree_collected ?? null);
      setTreeReady(selectedTree.tree_ready ?? null);
      setTreeNotReady(selectedTree.tree_notReady ?? null);
    }
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
        `http://localhost:4000/api/v1/farm/${params.id}/tree`,
        {
          method: "POST",
          body: formData,
          redirect: "follow",
        }
      );

      if (response.ok) {
        console.log("Tree added successfully");

        const treeResponse = await fetch(
          `http://localhost:4000/api/v1/farm/${params.id}/trees`
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
        `http://localhost:4000/api/v1/farm/update/tree/${selectedTree.id}`,
        {
          method: "PUT",
          body: formData,
          redirect: "follow",
        }
      );

      if (response.ok) {
        const treeResponse = await fetch(
          `http://localhost:4000/api/v1/farm/${params.id}/trees`
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
        `http://localhost:4000/api/v1/farm/delete/tree/${selectedTree.id}`,
        {
          method: "DELETE",
          redirect: "follow",
        }
      );

      if (response.ok) {
        console.log("Tree deleted successfully");

        // Refresh tree data after a successful delete
        const treeResponse = await fetch(
          `http://localhost:4000/api/v1/farm/${params.id}/trees`
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
            <div className="text-4xl font-bold">
              <div>ฟาร์มทุเรียน</div>
              <div>{farmData.farm_name}</div>
            </div>
            {farmData.farm_status ? (
              <p className="text-base font-semibold text-success">
                พร้อมที่จะทำการเก็บเกี่ยวแล้ว
              </p>
            ) : (
              <p className="text-base font-semibold">
                ยังไม่พร้อมที่จะทำการเก็บเกี่ยว
              </p>
            )}
            <div>
              {farmData?.farm_photo && (
                <Image
                  src={`${farmImageBaseUrl}${farmData?.farm_photo}`}
                  alt={`Farm ${farmData?.farm_name} Photo`}
                  width={450}
                  height={100}
                  priority
                />
              )}
            </div>
            <div>
              <p className="text-lg">เก็บแล้ว {totalTreesCollected} ลูก</p>
              <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                <progress
                  className="progress progress-black h-full bg-white"
                  value={percentageCollected}
                  max="100"
                ></progress>
              </div>
            </div>
            <div>
              <p className="text-lg text-success">
                พร้อมที่จะเก็บ {totalTreeReady} ลูก
              </p>
              <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                <progress
                  className="progress progress-success h-full bg-white"
                  value={percentageReady}
                  max="100"
                ></progress>
              </div>
            </div>
            <div>
              <p className="text-lg text-secondary">
                ยังไม่พร้อมที่จะเก็บ {totalTreeNotReady} ลูก
              </p>
              <div className="w-full h-6 border-black border-2 p-0.5 rounded-full flex items-center">
                <progress
                  className="progress progress-secondary h-full bg-white"
                  value={percentageNotReady}
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="font-semibold">ผสมเกสรเมื่อ {formattedDate}</div>

            <div className="grid grid-col">
              <div className="bg-white w-6/7 space-y-2 inline-flex items-center sm:mr-4">
                <TreeIconSvg />
                <p className="text-gray-600 text-lg pl-2 pb-2">
                  จำนวนต้นทุเรียน {numberOfIds} ต้น
                </p>
              </div>
              <div className="bg-white w-6/7 space-y-2 inline-flex items-center">
                <CartSvg />
                <p className="text-gray-600 text-lg pl-2 pb-2">
                  จำนวนผล {farmData.duian_amount} ลูก
                </p>
              </div>
            </div>

            <div className="pb-2">
              {treeData?.length > 0 && (
                <div>
                  <div className="grid grid-cols-7 gap-[10px] pt-4">
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
                          width="42"
                          height="42"
                          fill={calculateFillClass(tree)}
                          viewBox="0 0 512 512"
                          className="opacity-50 hover:opacity-100"
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
                className="btn btn-success text-white rounded-3xl btn-sm text-lg font-medium"
                onClick={() => setModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="white"
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

            <div>
              {showNotification && (
                <div
                  role="alert"
                  className="fixed bottom-4 left-1/2 -translate-x-1/2 alert alert-success text-white w-4/5 z-10"
                >
                  <p>{notificationMessage}</p>
                </div>
              )}
            </div>

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
