"use client";
import React, { useEffect, useState } from "react";
import { ErrorSvg, IconSvg, SuccessSvg } from "./Svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import userAvatar from "../../public/ytt.png";
import { BASE_URL } from "@/config"

const Navbar = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [modalOpen2, setOpenModal3] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [showErrNotification, setShowErrNotification] =
    useState<boolean>(false);
  const [notificationErrMessage, setNotificationErrMessage] =
    useState<string>("");

  useEffect(() => {
    const storedToken = sessionStorage.getItem("Token");
    if (storedToken) {
      setToken(storedToken);
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      setShowNotification(false);
      setShowErrNotification(false);
    }, 3000);
    return () => {
      clearTimeout(notificationTimeout);
    };
  }, [showNotification, showErrNotification]);

  const handleLogin = async () => {
    setLoading(true);
    setInitialLoad(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user, token } = data;

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("Token", token);

        setToken(token);
        setUsername(username);

        router.push("/farm");

        setShowNotification(true);
        setNotificationMessage("เข้าสู่ระบบสำเร็จ");
        setModalOpen(false);
      } else {
        setUsername("");
        setPassword("");
        setShowErrNotification(true);
        setNotificationErrMessage(`username หรือ password ไม่ถูกต้อง`);
        setModalOpen(false);
        // console.error("Login error:", data);
      }
      setInitialLoad(false);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("username");
    setUsername("");
    setPassword("");
    setChecked(false);
    router.push("/");
    window.location.reload();
  };

  return (
    <div>
      <div className="flex justify-between p-2 items-center border-yellow-500 border-b-2">
        <IconSvg />

        {initialLoad || loading ? (
          <div className="btn btn-primary text-white rounded-3xl px-1">
            <label htmlFor="my_modal_2">
              <div className="mx-2">Loading...</div>
            </label>
          </div>
        ) : token ? (
          <div className="btn btn-primary text-white rounded-3xl px-1">
            <label htmlFor="my_modal_2">
              <div className="mx-2">{username}</div>
            </label>
            <div className="dropdown dropdown-end">
              <div>
                <label tabIndex={0}>
                  <Image
                    src={userAvatar}
                    alt="Default Picture of the Actor"
                    priority
                    className="w-[38px] h-[38px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                  />
                </label>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-4 z-[1] p-2 
                shadow bg-base-100 rounded-box w-52 text-black font-light 
                normal-case"
              >
                <li>
                  <a href="/farm">Home</a>
                </li>
                <li>
                  <a>
                    <label
                      htmlFor="my_modal_3"
                      onClick={() => setOpenModal3(true)}
                    >
                      Settings
                    </label>
                  </a>
                </li>
                <li onClick={logout}>
                  <a>Log Out</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="btn btn-primary text-white rounded-3xl px-1 3xs:px-6">
            <label htmlFor="my_modal_2">
              <div className="mx-2">เข้าสู่ระบบ</div>
            </label>
          </div>
        )}

        {/* modal for login */}
        <input
          type="checkbox"
          id="my_modal_2"
          className="modal-toggle"
          checked={modalOpen}
          onChange={() => setModalOpen(!modalOpen)}
        />
        <div className={`modal ${modalOpen ? "open" : ""}`}>
          <div className="modal-box md:h-[50%]">
            <div className="flex flex-col space-y-3">
              <h3 className="text-lg text-center font-bold lg:text-3xl">
                เข้าสู่ระบบ
              </h3>
              <div className="hidden md:block font-bold lg:text-xl">
                ขื่อผู้ใช้
              </div>
              <input
                type="username"
                placeholder="username"
                className="input input-bordered input-primary w-full"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <div className="hidden md:block font-bold lg:text-xl">
                รหัสผ่าน
              </div>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered input-primary w-full"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text lg:text-xl">จดจำรหัสผ่าน</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              <button
                className="btn btn-primary text-white md:text-xl"
                onClick={handleLogin}
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_2">
            Close
          </label>
        </div>

        {/* setting modal */}
        <input type="checkbox" id="my_modal_3" className="modal-toggle" />
        {modalOpen2 && (
          <div className="modal top-[-1rem]">
            <div className="modal-box">
              <div className="flex flex-col space-y-3 text-lg font-bold text-center">
                Update Your Profile
              </div>
            </div>
            <label
              className="modal-backdrop"
              htmlFor="my_modal_3"
              onClick={() => setOpenModal3(false)}
            >
              Close
            </label>
          </div>
        )}
      </div>
      {(showNotification || showErrNotification) && (
        <div
          className={`fixed right-0 top-20 bg-white opacity-90 items-center 
          px-2 py-2 text-sm w-[250px] sm:w-[300px] z-50
            border-t-4 rounded-bl-md shadow-sm flex flex-row drop-shadow-md ${
              showNotification ? "border-green-500" : "border-red-500"
            }`}
        >
          {showNotification ? <SuccessSvg /> : <ErrorSvg />}
          <div className="ml-3">
            <div className="font-bold text-left text-black">
              {showNotification ? notificationMessage : notificationErrMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
