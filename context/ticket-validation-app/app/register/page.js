"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setUserId(data.userId);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-36 min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">User Registration</h1>
      {!userId ? (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      ) : (
        <div className="text-center">
          <p className="mb-4">Ticket ID: {userId}</p>
          <p className="mb-4">Full Name: {fullName}</p>
          <div className="mb-4 flex justify-center">
            <QRCode value={userId} />
          </div>
          <Button className="mt-5" onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      )}
    </div>
  );
}
