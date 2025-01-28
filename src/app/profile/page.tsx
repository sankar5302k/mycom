"use client"; // Ensure this is a Client Component
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";


export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Store user details in state to avoid hydration errors
  const [userDetails, setUserDetails] = useState({
    username: "Guest",
    country: "",
    state: "",
    district: "",
    area: "",
  });

  // Fetch cookies only on the client side
  useEffect(() => {
    setUserDetails({
      username:
        Cookies.get("username") || searchParams?.get("username") || "Guest",
      country: Cookies.get("country") || searchParams?.get("country") || "",
      state: Cookies.get("state") || searchParams?.get("state") || "",
      district: Cookies.get("district") || searchParams?.get("district") || "",
      area: Cookies.get("area") || searchParams?.get("area") || "",
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <Image
        src="/c.png"
        className="h-20 w-20 rounded-full"
        width={80}
        height={80}
        alt="User Avatar"
      />
      <h1 className="text-2xl font-semibold mt-4">{userDetails.username}</h1>

      <div className="mt-4 text-center">
        {userDetails.country && (
          <p className="text-gray-600">Country: {userDetails.country}</p>
        )}
        {userDetails.state && (
          <p className="text-gray-600">State: {userDetails.state}</p>
        )}
        {userDetails.district && (
          <p className="text-gray-600">District: {userDetails.district}</p>
        )}
        {userDetails.area && (
          <p className="text-gray-600">Area: {userDetails.area}</p>
        )}
      </div>



    </div>
  );
}