import { NextResponse } from "next/server"; // Only import Firebase Admin

export async function GET(request) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // If we reach this point, the token is valid
    return NextResponse.json({ 
      success: true, 
      uid: decodedToken.uid 
    });
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.code === "auth/id-token-expired") {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 403 }
    );
  }
}
