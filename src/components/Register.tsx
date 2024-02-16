"use client";
import React, { useEffect, useState } from "react";
import { ErrorSvg, EyeCloseSvg, EyeSvg, SignupSvg, SuccessSvg } from "./Svg";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../config"

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const [showErrNotification, setShowErrNotification] =
    useState<boolean>(false);
  const [notificationErrMessage, setNotificationErrMessage] =
    useState<string>("");

  const [modalOpen, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      setShowNotification(false);
      setShowErrNotification(false);
    }, 3000);
    return () => {
      clearTimeout(notificationTimeout);
    };
  }, [showNotification, showErrNotification]);

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        username,
        email,
        password_hash: password,
        user_role: 2,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/user`,
        requestOptions
      );

      const result = await response.json();

      if (response.ok) {
        const { user, token } = result;

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("Token", token);

        setToken(token);
        setUsername(username);

        setLoading(false);

        router.push("/farm");
        setShowNotification(true);
        setNotificationMessage(`คุณ ${username} ได้สร้างบัญชีเสร็จเรียบร้อย`);

        window.location.reload();
        console.log("Register successful:", result);
      } else {
        setLoading(false);

        setUsername("");
        setEmail("");
        setPassword("");

        setOpen(false);
        setShowErrNotification(true);
        setNotificationErrMessage(`username หรือ email นี้ ถูกใช้งานแล้ว`);
        console.error("Error:", result.message);
      }

      console.log("Response:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log("modal open", modalOpen);

  const PasswordToggle: React.FC<PasswordToggleProps> = ({
    showPassword,
    onToggle,
  }) => {
    return (
      <button
        className="absolute inset-y-0 right-0 flex items-center px-3 text-primary"
        onClick={onToggle}
      >
        {showPassword ? <EyeSvg /> : <EyeCloseSvg />}
      </button>
    );
  };

  return (
    <div className="flex flex-col space-y-4 w-full md:flex-row md:gap-4 md:space-y-0">
      <label
        htmlFor="my_modal_1"
        className="btn btn-primary text-white rounded-3xl md:w-1/3"
        onClick={() => setOpen(true)}
      >
        Sign Up
        <span className="hidden lg:block">
          <SignupSvg />
        </span>
        <span className="md:hidden block">
          <SignupSvg />
        </span>
      </label>
      <label
        htmlFor=""
        className="btn btn-outline btn-primary text-white rounded-3xl md:w-1/3"
      >
        Aboute
      </label>

      <input type="checkbox" id="my_modal_1" className="modal-toggle" />
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="modal-box relative z-50">
            <div className="flex flex-col space-y-3">
              <h3 className="text-lg text-center font-bold lg:text-3xl">
                Register
              </h3>
              <div className="hidden md:block font-bold lg:text-xl">
                ขื่อผู้ใช้
              </div>
              <input
                type="text"
                placeholder="username"
                className="input input-bordered input-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="hidden md:block font-bold lg:text-xl">อีเมล</div>
              <input
                type="email"
                placeholder="example@mail.com"
                className="input input-bordered input-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="hidden md:block font-bold lg:text-xl">
                รหัสผ่าน
              </div>
              <div className="relative ">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="input input-bordered input-primary w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
              <button
                onClick={handleSignUp}
                className="btn btn-primary text-white md:text-xl"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                Sign Up
              </button>
            </div>
          </div>
          <label
            className="modal-backdrop fixed inset-0 z-40 bg-black opacity-50 cursor-pointer"
            htmlFor="my_modal_1"
            onClick={() => setOpen(false)}
          >
            Close
          </label>
        </div>
      )}

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

export default Register;
