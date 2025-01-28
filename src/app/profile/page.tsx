import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

export default function ProfileComponent() {
  const searchParams = useSearchParams();

  const [userDetails, setUserDetails] = useState({
    username: "Guest",
    country: "",
    state: "",
    district: "",
    area: "",
  });

  useEffect(() => {
    setUserDetails({
      username:
        searchParams?.get("username") || "Guest",
      country: searchParams?.get("country") || "",
      state: searchParams?.get("state") || "",
      district: searchParams?.get("district") || "",
      area: searchParams?.get("area") || "",
    });
  }, [searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-semibold mt-4">{userDetails.username}</h1>
        <div className="mt-4 text-center">
          {userDetails.country && <p>Country: {userDetails.country}</p>}
          {userDetails.state && <p>State: {userDetails.state}</p>}
          {userDetails.district && <p>District: {userDetails.district}</p>}
          {userDetails.area && <p>Area: {userDetails.area}</p>}
        </div>
      </div>
    </Suspense>
  );
}
