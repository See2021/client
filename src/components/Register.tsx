"use client";
import React, { useEffect, useState } from "react";
import { EyeCloseSvg, EyeSvg, SignupSvg } from "./Svg";
import { useRouter } from "next/navigation";

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
        "http://localhost:3000/api/v1/user",
        requestOptions
      );

      // console.log("Response:", response);
      const result = await response.json();
      // console.log("Result:", result);

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
    <div className="flex flex-col space-y-4 w-full">
      <label
        htmlFor="my_modal_1"
        className="btn btn-primary text-white rounded-3xl"
        onClick={() => setOpen(true)}
      >
        Sign Up
        <SignupSvg />
      </label>
      <label
        htmlFor=""
        className="btn btn-outline btn-primary text-white rounded-3xl"
      >
        Aboute
      </label>

      <input type="checkbox" id="my_modal_1" className="modal-toggle" />
      {modalOpen && (
        <div className="modal top-[-1rem]">
          <div className="modal-box">
            <div className="flex flex-col space-y-3">
              <h3 className="text-lg text-center font-bold">Register</h3>
              <input
                type="text"
                placeholder="username"
                className="input input-bordered input-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="example@mail.com"
                className="input input-bordered input-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
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
                className="btn btn-primary text-white"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                Sign Up
              </button>
            </div>
          </div>
          <label
            className="modal-backdrop"
            htmlFor="my_modal_1"
            onClick={() => setOpen(false)}
          >
            Close
          </label>
        </div>
      )}

      <div>
        {(showNotification || showErrNotification) && (
          <div
            role="alert"
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 alert text-white w-4/5 z-10 ${
              showNotification ? "alert-success" : "alert-error"
            }`}
          >
            <p>
              {showNotification ? notificationMessage : notificationErrMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
