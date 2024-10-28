// app/api/register/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// This should be exported so it can be imported in other routes
export let users = [];

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received registration request:", body);

    if (!body.fullName || body.fullName.trim() === "") {
      console.log("Invalid full name provided");
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    const userId = uuidv4();
    const newUser = { fullName: body.fullName, userId, isValid: true };
    users.push(newUser);

    console.log("User registered successfully:", newUser);
    console.log("Current users:", users);

    return NextResponse.json({ userId });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
