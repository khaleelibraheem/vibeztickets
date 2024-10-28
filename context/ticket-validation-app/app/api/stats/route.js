// app/api/stats/route.js
import { NextResponse } from "next/server";

// This stats object should be shared across all API routes
// In a real application, you'd use a database instead of this in-memory storage
// let stats = { totalUsers: 0, validatedTickets: 0 };
import { getStats } from "../register/route";

let stats = getStats();
export async function GET() {
  try {
    console.log("Fetching stats:", stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

