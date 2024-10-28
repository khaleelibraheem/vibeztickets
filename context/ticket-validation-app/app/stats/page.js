"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Stats() {
  const [stats, setStats] = useState({ totalUsers: 0, validatedTickets: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col items-center pt-36 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Validated Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.validatedTickets}</p>
          </CardContent>
        </Card>
      </div>
      <Button className="mt-5" onClick={() => router.push("/")}>Back to Home</Button>
    </div>
  );
}

// app/api/register/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let users = [];

export async function POST(request) {
  const { fullName } = await request.json();
  const userId = uuidv4();
  users.push({ fullName, userId, isValid: true });
  return NextResponse.json({ userId });
}
