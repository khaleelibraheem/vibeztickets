// app/api/validate/route.js
import { NextResponse } from "next/server";
import { users } from "../register/route";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("Validating userId:", userId);
  console.log("Current users:", users);

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const user = users.find((u) => u.userId === userId);

  if (user) {
    console.log("User found:", user);
    if (user.isValid) {
      user.isValid = false;
      console.log("Ticket validated for user:", userId);
    } else {
      console.log("Ticket already used for user:", userId);
    }
    return NextResponse.json({
      fullName: user.fullName,
      userId: user.userId,
      isValid: user.isValid,
    });
  } else {
    console.log("User not found for userId:", userId);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
