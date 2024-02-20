"use client";
import React from "react";
import Image from "next/image";
import plant2 from "../../../../public/plant2.png";
import temper from "../../../../public/thermometer.png";
import turbin from "../../../../public/turbin.png";
import tank from "../../../../public/tank.png";
import high from "../../../../public/high.png";
import low from "../../../../public/low.png";
import battery from "../../../../public/battery.png";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL, SUB_URL } from "@/config";
import { useRouter } from "next/navigation";

type Props = {
  params: { id: number };
};

type FarmData = {
  user_farm_id: number;
  user_id: number;
  farm_id: number;
  farm_photo: string;
  farm_province: string;
};

const Page = ({ params }: Props) => {
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [lowTemperature, setLowTemperature] = useState<number | null>(null);
  const [highTemperature, setHighTemperature] = useState<number | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [rainvolume, setRainvolume] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [windspeed, setWspeed] = useState<number | null>(null);
  const [p, setP] = useState<number | null>(null);
  const [f, setF] = useState<number | null>(null);
  const [t, setT] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    if (token) {
      fetch(`${BASE_URL}/api/v1/farm/1`)
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
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchTemperature = async () => {
    try {
      const response = await fetch(`${SUB_URL}/temp`);
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
      const response = await fetch(`${SUB_URL}/temp/status`);
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

  const fetchRainvolume = async () => {
    try {
      const response = await fetch(`${SUB_URL}/rain`);
      if (response.ok) {
        const data = await response.json();
        setRainvolume(data);
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

  const fetchP = async () => {
    try {
      const response = await fetch(`${SUB_URL}/pump`);
      if (response.ok) {
        const data = await response.json();
        setP(Math.round(data));
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  const fetchF = async () => {
    try {
      const response = await fetch(`${SUB_URL}/fertilizer`);
      if (response.ok) {
        const data = await response.json();
        setF(Math.round(data));
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  const fetchT = async () => {
    try {
      const response = await fetch(`${SUB_URL}/watertank`);
      if (response.ok) {
        const data = await response.json();
        setT(Math.round(data));
      } else {
        console.error("Failed to fetch temperature data");
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  useEffect(() => {
    fetchTemperature();
    fetchLowHighTemperature();
    updateDateTime();
    fetchRainvolume();
    fetchHumidity();
    fetchWspeed();
    fetchP();
    fetchF();
    fetchT();

    const interval = setInterval(() => {
      fetchTemperature();
    }, 11000);

    const lowHighTemperatureInterval = setInterval(() => {
      fetchLowHighTemperature();
    }, 11000);

    const dateTimeInterval = setInterval(() => {
      updateDateTime(); // Update current date and time at regular intervals
    }, 1000);

    const volume = setInterval(() => {
      fetchRainvolume();
    }, 11000);

    const humid = setInterval(() => {
      fetchHumidity();
    }, 11000);

    const wspeed = setInterval(() => {
      fetchWspeed();
    }, 11000);

    const p = setInterval(() => {
      fetchWspeed();
    }, 11000);

    const f = setInterval(() => {
      fetchWspeed();
    }, 11000);

    const t = setInterval(() => {
      fetchWspeed();
    }, 11000);

    return () => {
      clearInterval(interval);
      clearInterval(lowHighTemperatureInterval);
      clearInterval(dateTimeInterval);
      clearInterval(volume);
      clearInterval(humid);
      clearInterval(wspeed);
      clearInterval(p);
      clearInterval(f);
      clearInterval(t);
    };
  }, []);

  const farmImageBaseUrl = `${BASE_URL}`;

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* first box */}
      <div className="pl-4 w-full">
        <div className="text-3xl font-bold md:text-center md:text-7xl">
          Farm Sensor
        </div>
        <div className="opacity-50 md:text-center md:text-3xl md:pb-4">
          Optimize Growth and Yield
        </div>
      </div>

      {/* second box */}
      <div className="grid grid-cols-5 gap-4 w-full justify-items-center text-sm md:text-xl">
        <div
          className="flex items-center flex-col lg:border-2 lg:border-black 
        lg:p-2 w-full"
        >
          <div className="hidden md:block md:pb-2 font-semibold">
            Temperature
          </div>
          <div>
            <Image
              src={temper}
              width={500}
              height={500}
              className="w-8 h-8 md:w-12 md:h-12"
              alt="Pic of temperary"
              priority
            />
          </div>

          <div className="font-bold md:pt-2">
            {temperature !== null ? `${temperature}°C` : "Loading..."}
          </div>
        </div>

        <div
          className="flex items-center flex-col lg:border-2 lg:border-black 
        lg:p-2 w-full"
        >
          <div className="hidden md:block md:pb-2 font-semibold text-xl">
            Rain gauge
          </div>
          <div className="grid place-items-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8 md:w-12 md:h-12">
              <path
                className="feather_een"
                d="M24,10c0-4.418-3.582-8-8-8c-3.741,0-6.873,2.572-7.748,6.041C4.738,8.415,2,11.387,2,15  c0,3.684,2.848,6.697,6.461,6.973C8.184,22.577,8,23.258,8,24c0,1.657,1.343,3,3,3s3-1.343,3-3c0-0.74-0.172-1.408-0.429-2  l10.533-0.005C27.369,21.939,30,19.279,30,16C30,12.686,27.314,10,24,10z M11,26c-1.103,0-2-0.897-2-2  c0-1.706,1.263-3.073,2.013-3.735C11.758,20.901,13,22.229,13,24C13,25.103,12.103,26,11,26z M23.777,21H13.019  c-0.448-0.657-0.966-1.165-1.366-1.505c-0.373-0.317-0.924-0.312-1.291,0.012C9.972,19.85,9.465,20.358,9.02,21H9  c-2.484,0-4.797-1.491-5.621-3.834c-1.391-3.954,1.227-7.731,4.979-8.13l0.693-0.074l0.118-0.467  c0.708-2.806,2.986-5.038,5.853-5.428C19.315,2.482,23,5.819,23,10v1h1c2.922,0,5.266,2.519,4.976,5.499  C28.722,19.097,26.387,21,23.777,21z M19.365,22.502c-0.786,0.69-2.054,2.052-2.317,3.838c-0.257,1.746,0.921,3.493,2.678,3.648  C21.507,30.145,23,28.747,23,27c0-2.177-1.456-3.748-2.339-4.5C20.286,22.181,19.735,22.177,19.365,22.502z M20,29  c-1.103,0-2-0.897-2-2c0-1.706,1.263-3.073,2.013-3.735C20.758,23.901,22,25.229,22,27C22,28.103,21.103,29,20,29z"
              />
            </svg>
          </div>
          <div className="font-bold md:pt-2">
            {rainvolume !== null ? `${rainvolume.toFixed(2)}%` : "Loading..."}
          </div>
        </div>

        <div
          className="flex items-center flex-col lg:border-2 lg:border-black 
        lg:p-2 w-full"
        >
          <div className="hidden md:block md:pb-2 font-semibold text-xl">
            Humidity
          </div>
          <div className="grid place-items-center">
            <svg viewBox="0 0 64 64" className="w-8 h-8 md:w-12 md:h-12">
              <path d="M49.7,35.9C47.3,21.2,29.5,4,28.7,3.3c-0.4-0.4-1-0.4-1.4,0C26.4,4.1,6,23.7,6,39c0,12.1,9.9,22,22,22    c3.4,0,6.7-0.8,9.7-2.3c2.1,1.4,4.6,2.3,7.3,2.3c7.2,0,13-5.8,13-13C58,42.5,54.6,37.8,49.7,35.9z M28,59C17,59,8,50,8,39    C8,26.1,24.4,9,28,5.4C31.3,8.7,45,23,47.6,35.3C46.7,35.1,45.9,35,45,35c-7.2,0-13,5.8-13,13c0,3.7,1.5,7,4,9.3    C33.5,58.4,30.8,59,28,59z M45,59c-6.1,0-11-4.9-11-11s4.9-11,11-11s11,4.9,11,11S51.1,59,45,59z" />

              <path d="M28,54c-8.3,0-15-6.7-15-15c0-0.6-0.4-1-1-1s-1,0.4-1,1c0,9.4,7.6,17,17,17c0.6,0,1-0.4,1-1S28.6,54,28,54z" />

              <path d="M48.4,40.1c-0.5-0.2-1.1,0-1.3,0.5l-6,14c-0.2,0.5,0,1.1,0.5,1.3C41.7,56,41.9,56,42,56c0.4,0,0.8-0.2,0.9-0.6l6-14    C49.1,40.9,48.9,40.3,48.4,40.1z" />

              <path d="M44,44c0-1.7-1.3-3-3-3s-3,1.3-3,3s1.3,3,3,3S44,45.7,44,44z M40,44c0-0.6,0.4-1,1-1s1,0.4,1,1s-0.4,1-1,1S40,44.6,40,44z    " />

              <path d="M49,49c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S50.7,49,49,49z M49,53c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S49.6,53,49,53z    " />
            </svg>
          </div>
          <div className="font-bold md:pt-2">
            {humidity !== null ? `${humidity}%` : "Loading..."}
          </div>
        </div>

        <div
          className="flex items-center flex-col lg:border-2 lg:border-black 
        lg:p-2 w-full"
        >
          <div className="hidden md:block md:pb-2 font-semibold text-xl">
            Wind speed
          </div>
          <div className="grid place-items-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-12 md:h-12">
              <path d="M16.7439414,7 L17.5,7 C19.9852814,7 22,9.01471863 22,11.5 C22,13.9852814 19.9852814,16 17.5,16 L11.5,16 C11.2238576,16 11,15.7761424 11,15.5 C11,15.2238576 11.2238576,15 11.5,15 L17.5,15 C19.4329966,15 21,13.4329966 21,11.5 C21,9.56700338 19.4329966,8 17.5,8 L16.9725356,8 C16.9906833,8.16416693 17,8.33099545 17,8.5 C17,8.77614237 16.7761424,9 16.5,9 C16.2238576,9 16,8.77614237 16,8.5 C16,6.56700338 14.4329966,5 12.5,5 L12,5 C9.790861,5 8,6.790861 8,9 L8,9.5 C8,9.77614237 7.77614237,10 7.5,10 C6.43258736,10 5.4933817,10.6751517 5.14273446,11.6649026 C5.0505193,11.9251928 4.76475726,12.0614445 4.50446709,11.9692293 C4.24417691,11.8770142 4.10792519,11.5912521 4.20014035,11.330962 C4.63552757,10.1020207 5.71845994,9.21978032 7,9.03565397 L7,9 C7,6.23857625 9.23857625,4 12,4 L12.5,4 C14.4593282,4 16.1261868,5.25221144 16.7439414,7 L16.7439414,7 Z M11.5,11 C11.2238576,11 11,10.7761424 11,10.5 C11,10.2238576 11.2238576,10 11.5,10 L12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 L2.5,14 C2.22385763,14 2,13.7761424 2,13.5 C2,13.2238576 2.22385763,13 2.5,13 L12,13 C12.5522847,13 13,12.5522847 13,12 C13,11.4477153 12.5522847,11 12,11 L11.5,11 Z M4.5,17 C4.22385763,17 4,16.7761424 4,16.5 C4,16.2238576 4.22385763,16 4.5,16 L9,16 C10.1045695,16 11,16.8954305 11,18 C11,19.1045695 10.1045695,20 9,20 L7.5,20 C7.22385763,20 7,19.7761424 7,19.5 C7,19.2238576 7.22385763,19 7.5,19 L9,19 C9.55228475,19 10,18.5522847 10,18 C10,17.4477153 9.55228475,17 9,17 L4.5,17 Z" />
            </svg>
          </div>
          <div className="font-bold md:pt-2">
            {windspeed !== null ? `${windspeed} km/h` : "Loading..."}
          </div>
        </div>

        <Link
          className="flex items-center flex-col justify-center lg:border-2 lg:border-black 
          lg:p-2 w-full"
          href={
            "http://35.240.232.74:3000/d/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?shareView=public_dashboard&orgId=1&refresh=10s&from=1708057798111&to=1708059598111&theme=light"
          }
        >
          <div className="hidden md:block md:pb-2 font-semibold text-xl">
            Grafana
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 md:w-10 md:h-10"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.918 10.0005H7.082C6.66587 9.99708 6.26541 10.1591 5.96873 10.4509C5.67204 10.7427 5.50343 11.1404 5.5 11.5565V17.4455C5.5077 18.3117 6.21584 19.0078 7.082 19.0005H9.918C10.3341 19.004 10.7346 18.842 11.0313 18.5502C11.328 18.2584 11.4966 17.8607 11.5 17.4445V11.5565C11.4966 11.1404 11.328 10.7427 11.0313 10.4509C10.7346 10.1591 10.3341 9.99708 9.918 10.0005Z"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.918 4.0006H7.082C6.23326 3.97706 5.52559 4.64492 5.5 5.4936V6.5076C5.52559 7.35629 6.23326 8.02415 7.082 8.0006H9.918C10.7667 8.02415 11.4744 7.35629 11.5 6.5076V5.4936C11.4744 4.64492 10.7667 3.97706 9.918 4.0006Z"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.082 13.0007H17.917C18.3333 13.0044 18.734 12.8425 19.0309 12.5507C19.3278 12.2588 19.4966 11.861 19.5 11.4447V5.55666C19.4966 5.14054 19.328 4.74282 19.0313 4.45101C18.7346 4.1592 18.3341 3.9972 17.918 4.00066H15.082C14.6659 3.9972 14.2654 4.1592 13.9687 4.45101C13.672 4.74282 13.5034 5.14054 13.5 5.55666V11.4447C13.5034 11.8608 13.672 12.2585 13.9687 12.5503C14.2654 12.8421 14.6659 13.0041 15.082 13.0007Z"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.082 19.0006H17.917C18.7661 19.0247 19.4744 18.3567 19.5 17.5076V16.4936C19.4744 15.6449 18.7667 14.9771 17.918 15.0006H15.082C14.2333 14.9771 13.5256 15.6449 13.5 16.4936V17.5066C13.525 18.3557 14.2329 19.0241 15.082 19.0006Z"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="text-center font-bold md:py-2 md:text-lg">
            Dashboard
          </div>
        </Link>
      </div>

      {/* picture box */}
      <div className="grid justify-items-center md:grid-cols-8 md:grid-rows-6 w-full">
        <div className="col-span-2 row-span-4 hidden md:block w-full h-full">
          <iframe
            src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708378839379&to=1708389639379&theme=light&panelId=42"
            className="w-full"
            height="380"
            frameBorder="0"
          ></iframe>
        </div>

        <div
          className="col-span-4 row-span-5 btn btn-circle w-[240px] h-[240px] border-8 
        border-gray-100 md:btn-ghost md:w-[80%] md:h-[460px]"
        >
          {farmData?.farm_photo && (
            <Image
              src={`${farmImageBaseUrl}${farmData?.farm_photo}`}
              width={500}
              height={500}
              alt="Picture of the farm"
              className="rounded-full w-34 h-34 md:rounded-md"
              priority
            />
          )}
        </div>
        <div className="col-span-2 row-span-4 hidden md:block w-full h-full">
          <iframe
            src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&from=1708368809688&to=1708390409688&refresh=10s&theme=light&panelId=37"
            className="w-full"
            height="380"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="col-span-2 row-span-2 hidden md:block h-full w-full">
          <iframe
            src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708377505228&to=1708388305228&theme=light&panelId=31"
            className="w-full"
            height="190"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="col-span-2 row-span-2 hidden md:block w-full h-full">
          <iframe
            src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708377824263&to=1708388624263&theme=light&panelId=23"
            className="w-full"
            height="190"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="col-span-4 hidden md:block w-full h-full">
          <div className="grid grid-cols-2">
            <div>
              <iframe
                src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708387556877&to=1708387856877&theme=light&panelId=13"
                className="w-full"
                height="95"
                frameBorder="0"
              ></iframe>
            </div>
            <div>
              <iframe
                src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708387740961&to=1708388040961&theme=light&panelId=33"
                className="w-full"
                height="95"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* details box */}
      <div className="grid grid-cols-6 w-full justify-items-center md:hidden">
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
      <div className="hidden md:block h-48 w-full">
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <iframe
              src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708387093931&to=1708387393931&theme=light&panelId=14"
              className="w-full"
              height="150"
              frameBorder="0"
            ></iframe>
            <div className="grid grid-cols-2 w-full">
              <div>
                <iframe
                  src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708387324425&to=1708387624425&theme=light&panelId=21"
                  className="w-full h-[50px] lg:h-[80px] xl:h-[100px]"
                  frameBorder="0"
                ></iframe>
              </div>
              <div>
                <iframe
                  src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708387426696&to=1708387726696&theme=light&panelId=22"
                  className="w-full h-[50px] lg:h-[80px] xl:h-[100px]"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <iframe
              src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708386534140&to=1708386834140&theme=light&panelId=35"
              className="w-full h-[200px] lg:h-[230px]"
              frameBorder="0"
            ></iframe>
          </div>
          <div className="col-span-2">
            <iframe
              src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&from=1708386744949&to=1708387044949&theme=light&panelId=26"
              className="w-full h-[200px] lg:h-[230px]"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </div>

      <div
        className={`collapse bg-base-200 
      ${isCollapsed ? "" : "collapse-active"} md:hidden`}
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
            <div className="col-span-4 justify-start text-xs 2xs:text-sm 3xs:text-md pl-4 font-semibold">
              <div className="flex flex-col">
                <p className="sm:hidden block">Estimated energy</p>
                <p className="sm:hidden block">expenses this month</p>
                <p className="hidden sm:block text-lg md:text-xl">
                  Estimated energy expenses this month
                </p>
              </div>
            </div>
            <div className="grid justify-end w-[75px] md:w-[140px]">
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
            <div
              className="relative w-[260px] 2xs:w-[330px] h-10 bg-white 
              rounded-full mt-2 3xs:w-[410px] sm:w-[580px] md:w-[700px] lg:w-[960px]
              xl:w-[1210px] 2xl:w-[1470px]"
            >
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
              <div className="text-sm font-semibold text-right">
                {farmData?.farm_photo && <div>{farmData?.farm_province}</div>}
              </div>
            </div>
            <div className="text-gray-500 text-xs font-semibold">
              {currentDateTime}
            </div>
            <div
              className="grid grid-cols-2 rounded-xl bg-emerald-500 mt-4 
            h-16 justify-items-center"
            >
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
              <div className="text-xl font-bold">
                {p !== null ? `${p}°C` : "Loading..."}
              </div>
              <div className="font-light">Running</div>
            </div>
          </div>

          <div className="row-span-2 rounded-xl shadow-md">
            <div className="rounded-t-xl h-12 p-4 text-lg 2xs:text-xl font-bold">
              Water Tank
            </div>
            <div className="grid grid-cols-4">
              <div className="row-span-4 h-[290px] rounded-bl-xl p-4 grid grid-rows-6 gap-2">
                <iframe
                  src="http://35.240.232.74:3000/d-solo/ace6a72d-9b7d-4704-a329-30759cb69e63/farm-1-dashboard?orgId=1&refresh=10s&theme=light&panelId=40"
                  className="w-[40px] sm:w-[60px] sm:h-[260px]"
                  frameBorder="0"
                ></iframe>
              </div>
              <div
                className="ml-6 row-span-2 col-span-3 w-24 bg-white py-4 
              h-[200px] flex justify-center items-center 3xs:w-[90%]"
              >
                <Image
                  src={tank}
                  width={110}
                  className="h-16 2xs:h-20 3xs:h-32 w-auto"
                  alt="this tank"
                  priority
                />
              </div>
              <div className="ml-6 first-letter:row-span-2 col-span-3 grid grid-rows-2 rounded-br-xl h-[90px]">
                <div className="text-md font-bold inline-flex items-end 2xs:text-lg">
                  {t !== null ? `${t}` : "Loading..."}
                  <p className="text-gray-400 pl-2">Liters</p>
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
              <div className="text-xl font-bold">
                {f !== null ? `${f}%` : "Loading..."}
              </div>
              <div className="font-light">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
