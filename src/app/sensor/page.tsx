"use client";
import Image from "next/image";
import profilePic from "../../../public/plant.png";
import plant2 from "../../../public/plant2.png";
import temper from "../../../public/thermometer.png";
import turbin from "../../../public/turbin.png";
import tank from "../../../public/tank.png";
import high from "../../../public/high.png";
import low from "../../../public/low.png";
import battery from "../../../public/battery.png";
import { useEffect, useState } from "react";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [lowTemperature, setLowTemperature] = useState<number | null>(null);
  const [highTemperature, setHighTemperature] = useState<number | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchTemperature = async () => {
    try {
      const response = await fetch("http://localhost:4000/temp");
      if (response.ok) {
        const data = await response.json();
        setTemperature(data);
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  const fetchLowHighTemperature = async () => {
    try {
      const response = await fetch("http://localhost:4000/temp/status");
      if (response.ok) {
        const data = await response.json();
        setLowTemperature(data.low);
        setHighTemperature(data.high);
      } else {
        console.error("Failed to fetch low-high temperature data");
      }
    } catch (error) {
      console.error("Error fetching low-high temperature data:", error);
    }
  };

  const updateDateTime = () => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    setCurrentDateTime(formattedDateTime);
  };

  useEffect(() => {
    fetchTemperature();
    fetchLowHighTemperature();
    updateDateTime();

    const interval = setInterval(() => {
      fetchTemperature();
    }, 4000);

    const lowHighTemperatureInterval = setInterval(() => {
      fetchLowHighTemperature();
    }, 4000);

    const dateTimeInterval = setInterval(() => {
      updateDateTime(); // Update current date and time at regular intervals
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(lowHighTemperatureInterval);
      clearInterval(dateTimeInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* first box */}
      <div className="pl-4 w-full">
        <div className="text-3xl font-bold">Farm Sensor</div>
        <div className="opacity-50">Optimize Growth and Yield</div>
      </div>

      {/* second box */}
      <div className="grid grid-cols-4 gap-4 w-full justify-items-center">
        <div className="flex items-center flex-col">
          <Image
            src={temper}
            width={500}
            height={500}
            className="w-8 h-8"
            alt="Pic of temperary"
            priority
          />
          <div className="font-bold">
            {temperature !== null ? `${temperature}°C` : "Loading..."}
          </div>
        </div>

        <div className="flex items-center flex-col">
          <div className="grid w-8 h-8 bg-base-300 place-items-center">ico</div>
          <div className="font-bold">test</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="grid w-8 h-8 bg-base-300 place-items-center">ico</div>
          <div className="font-bold">test</div>
        </div>
        <div className="flex items-center flex-col">
          <div className="grid w-8 h-8 bg-base-300 place-items-center">ico</div>
          <div className="font-bold">test</div>
        </div>
      </div>

      {/* picture box */}
      <div className="flex items-center justify-center pt-12 flex-col">
        <div className="btn btn-circle bg-white w-[240px] h-[240px] border-8 border-gray-100">
          <Image
            src={profilePic}
            width={500}
            height={500}
            alt="Picture of the author"
            className="rounded-full w-28 h-28"
            priority
          />
        </div>
        <div className="pt-2">Week 3</div>
        <div className="text-teal-300 font-bold text-lg">Seedling</div>
      </div>

      {/* details box */}
      <div className="grid grid-cols-6 w-full justify-items-center">
        <div className="col-span-1">
          <div className="indicator">
            <span className="indicator-item badge bg-teal-300 badge-xs mt-1.5 mr-1.5"></span>
            <div className="grid w-8 h-8 place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="col-span-4 uppercase inline-flex items-center">
          <div>details</div>
          <label className="swap">
            <input type="checkbox" onClick={toggleCollapse} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="swap-off w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="swap-on w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </label>
        </div>
        <div className="grid col-span-1 items-center rotate-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </div>
      </div>

      <div
        className={`collapse bg-base-200 
      ${isCollapsed ? "" : "collapse-active"}`}
      >
        <input type="checkbox" checked={!isCollapsed} readOnly />
        <div className="collapse-title bg-gray-100 h-[120px] text-black">
          <div className="grid grid-cols-6">
            <div>
              <Image
                src={battery}
                width={40}
                height={40}
                className="h-auto"
                alt="this is low"
                priority
              />
            </div>
            <div className="col-span-4 justify-start text-md pl-4 font-semibold">
              <p>Estimated energy</p>
              <p>expenses this month</p>
            </div>
            <div className="grid justify-end w-[75px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </div>
            <div className="relative w-[325px] h-10 bg-white rounded-full mt-2">
              <div className="absolute top-0 left-0 h-full bg-black rounded-full w-[50%]">
                <div className="absolute top-1 right-1 flex items-center justify-center w-8 h-8 rounded-full bg-white"></div>
              </div>
              <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                56$
              </div>
            </div>
          </div>
        </div>
        <div className="collapse-content bg-white grid grid-cols-2 gap-3 -mx-4">
          <div className="col-span-2 h-36 rounded-b-xl p-3 shadow-md">
            <div className="grid grid-cols-3">
              <div className="col-span-2 text-xl font-bold">
                {temperature !== null ? `${temperature}°C` : "Loading..."}
              </div>
              <div className="text-sm font-semibold text-right">Province</div>
            </div>
            <div className="text-gray-500 text-xs font-semibold">
              {currentDateTime}
            </div>
            <div className="grid grid-cols-2 rounded-xl bg-emerald-500 mt-4 h-16 justify-items-center">
              <div className="grid grid-cols-3">
                <div className="pt-4">
                  <Image
                    src={low}
                    width={30}
                    height={30}
                    className="h-auto"
                    alt="this is low"
                    priority
                  />
                </div>
                <div className="col-span-2 font-semibold pt-3">
                  <div className="text-xs">low temp</div>
                  <div className="text-lg">
                    {lowTemperature !== null
                      ? `${lowTemperature}°C`
                      : "Loading..."}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3">
                <div className="pt-4">
                  <Image
                    src={high}
                    width={30}
                    height={30}
                    className="h-auto"
                    alt="this is high"
                    priority
                  />
                </div>
                <div className="col-span-2 font-semibold pt-3">
                  <div className="text-xs">High temp</div>
                  <div className="text-lg">
                    {highTemperature !== null
                      ? `${highTemperature}°C`
                      : "Loading..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-40 rounded-xl grid grid-cols-2 p-4 shadow-md">
            <div className="col-span-2 h-12 text-xl font-bold flex items-center">
              Pump
            </div>
            <div className="h-24 flex items-center pb-6">
              <Image
                src={turbin}
                width={80}
                height={80}
                alt="this turbin"
                priority
              />
            </div>
            <div className="text-end pt-6">
              <div className="text-xl font-bold">24°C</div>
              <div className="font-light">Running</div>
            </div>
          </div>

          <div className="row-span-2 rounded-xl shadow-md">
            <div className="rounded-t-xl h-12 p-4 text-xl font-bold">
              Water Tank
            </div>
            <div className="grid grid-cols-4">
              <div className="row-span-4 h-[290px] rounded-bl-xl p-4 grid grid-rows-6 gap-2">
                <div className="bg-gradient-to-t from-gray-400 to-gray-100 rounded-lg w-2" />
                <div className="bg-gradient-to-t from-gray-600 to-gray-400 rounded-lg w-2" />
                <div className="bg-cyan-500 rounded-lg w-2" />
                <div className="bg-cyan-500 rounded-lg w-2" />
                <div className="bg-cyan-500 rounded-lg w-2" />
                <div className="bg-cyan-500 rounded-lg w-2" />
              </div>
              <div className="row-span-2 col-span-3 bg-white py-4 h-[200px] flex items-end">
                <Image
                  src={tank}
                  width={110}
                  className="h-36 w-auto"
                  alt="this tank"
                  priority
                />
              </div>
              <div className="row-span-2 col-span-3 grid grid-rows-2 rounded-br-xl h-[90px]">
                <div className="text-xl font-bold inline-flex items-end">
                  258<p className="text-gray-400 pl-2">Liters</p>
                </div>
                <div className="font-light pt-2">Remaining</div>
              </div>
            </div>
          </div>

          <div className="h-40 rounded-xl grid grid-cols-2 p-4 shadow-md">
            <div className="col-span-2 h-12 text-xl font-bold flex items-center">
              Fertilizer
            </div>
            <div className="h-24">
              <Image
                src={plant2}
                width={80}
                height={80}
                alt="this plant 2"
                priority
              />
            </div>
            <div className="text-end pt-6">
              <div className="text-xl font-bold">86%</div>
              <div className="font-light">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
