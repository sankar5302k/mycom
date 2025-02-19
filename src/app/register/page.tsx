"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Your component goes here
const Register: React.FC = () => {
  const router = useRouter();
  //const [step, setStep] = useState<"register" | "otp" | "location">("register");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"register" | "login">("register");
  const [step, setStep] = useState<
    | "register"
    | "otp"
    | "location"
    | "forgotPassword"
    | "verifyForgotPasswordOtp"
    | "resetPassword"
    | "login"
  >("register");

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    state: "",
    district: "",
    area: "",
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleForgotPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForgotPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending OTP request...");
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordData.email }),
      });

      const responseText = await response.text(); // ✅ Debug raw response
      console.log("Raw API Response:", responseText);

      let errorData;
      try {
        errorData = JSON.parse(responseText); // ✅ Handle non-JSON responses
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error("Server error: Invalid response format");
      }

      if (!response.ok) {
        console.error("Error sending OTP:", errorData);
        alert(errorData.error || "Failed to send OTP");
        throw new Error(errorData.error || "Failed to send OTP");
      }

      console.log("OTP request successful");
      setStep("verifyForgotPasswordOtp");
    } catch (error) {
      console.error("OTP request failed:", error);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyForgotPasswordOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Invalid or expired OTP");
        throw new Error(errorData.error || "Invalid or expired OTP");
      }

      setStep("resetPassword");
    } catch (error) {
      alert("OTP Verification Error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          newPassword: forgotPasswordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to reset password");
        throw new Error(errorData.error || "Failed to reset password");
      }

      alert("Password reset successfully");
      setStep("login");
    } catch (error) {
      alert("Password Reset Error");
    } finally {
      setLoading(false);
    }
  };
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to send OTP");
        throw new Error(errorData.error || "Failed to send OTP");
      }

      setOtpSent(true);
      setStep("otp");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Invalid or expired OTP");
        throw new Error(errorData.error || "Invalid or expired OTP");
      }
      setStep("location");
    } catch (error) {
      alert("OTP Verification Error:");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Registration failed");
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();
      console.log("User Registered:", data);

      const queryParams = new URLSearchParams({
        username: userData.username,
        country: userData.country,
        state: userData.state,
        district: userData.district,
        area: userData.area,
      }).toString();

      router.push(`/appcom?${queryParams}`);
    } catch (error) {
      alert("Registration Error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Invalid credentials");
        return;
      }

      const data = await response.json();
      console.log("User Logged In:", data);

      localStorage.setItem("user", JSON.stringify(data.user));

      const queryParams = new URLSearchParams({
        username: data.user.username,
        country: data.user.country,
        state: data.user.state,
        district: data.user.district,
        area: data.user.area,
      }).toString();

      router.push(`/appcom?${queryParams}`);
    } catch (error) {
      alert("Login Error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Logo Section */}
        <div className="hidden md:block w-1/3 flex justify-center">
          <Image src="/c.png" alt="Logo" width={250} height={250} />
        </div>
        <div className="w-[400px]">
          <Tabs
            defaultValue={tab}
            onValueChange={(val) => setTab(val as "register" | "login")}
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-md p-1">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            {/* Registration Form */}
            <TabsContent value="register">
              <Suspense fallback={<div>Loading registration steps...</div>}>
                {step === "register" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center text-xl font-semibold">
                        Register
                      </CardTitle>
                      <CardDescription className="text-center text-gray-600">
                        Create an account to get started.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleRegisterSubmit} className="w-full">
                        Next
                      </Button>
                    </CardFooter>
                  </Card>
                ) : step === "otp" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center text-xl font-semibold">
                        OTP Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          name="otp"
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handleVerifyOtp}
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center text-xl font-semibold">
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={userData.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={userData.country}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={userData.state}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          name="district"
                          value={userData.district}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Area</Label>
                        <Input
                          id="area"
                          name="area"
                          value={userData.area}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={userData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleLocationSubmit} className="w-full">
                        Register
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </Suspense>
            </TabsContent>
            <TabsContent value="login">
              <Suspense fallback={<div>Loading login...</div>}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold">
                      Login
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="text-right">
                      <Button
                        variant="link"
                        onClick={() => setStep("forgotPassword")}
                        className="text-sm text-blue-600"
                      >
                        Forgot Password?
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleLoginSubmit}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                  {step === "forgotPassword" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center text-xl font-semibold">
                          Forgot Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={forgotPasswordData.email}
                            onChange={handleForgotPasswordChange}
                            required
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={handleForgotPasswordSubmit}
                          className="w-full"
                        >
                          Send OTP
                        </Button>
                      </CardFooter>
                    </Card>
                  )}

                  {step === "verifyForgotPasswordOtp" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center text-xl font-semibold">
                          Verify OTP
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter OTP</Label>
                          <Input
                            id="otp"
                            name="otp"
                            type="text"
                            maxLength={6}
                            value={forgotPasswordData.otp}
                            onChange={handleForgotPasswordChange}
                            required
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={handleVerifyForgotPasswordOtp}
                          className="w-full"
                        >
                          Verify OTP
                        </Button>
                      </CardFooter>
                    </Card>
                  )}

                  {step === "resetPassword" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center text-xl font-semibold">
                          Reset Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={forgotPasswordData.newPassword}
                            onChange={handleForgotPasswordChange}
                            required
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={handleResetPasswordSubmit}
                          className="w-full"
                        >
                          Reset Password
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </Card>
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Register;
