"use client";
import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Scan() {
  const [scanResult, setScanResult] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    setScanResult(decodedText);
    try {
      console.log("Scanned QR code:", decodedText);
      const response = await fetch(`/api/validate?userId=${decodedText}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `${data.error || "Unknown error"} (Status: ${response.status})`
        );
      }

      if (data.error) {
        setError(data.error);
      } else {
        setUserData(data);
        setError(null);
      }
    } catch (err) {
      console.error("Validation error:", err);
      setError(err.message);
    }
  };

  const onScanFailure = (error) => {
    console.warn(`QR code scan error: ${error}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Scan Ticket</h1>
      <div id="reader" className="mb-8"></div>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {userData && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ticket Information</h2>
          <p>Full Name: {userData.fullName}</p>
          <p>User ID: {userData.userId}</p>
          <p>Status: {!userData.isValid ? "Not Validated" : "Validated"}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Scan Another
          </Button>
        </div>
      )}

      <Button className="mt-4" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </div>
  );
}
