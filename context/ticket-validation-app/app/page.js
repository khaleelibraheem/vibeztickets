import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-36 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">VibezFusion Tickets</h1>
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/scan">Scan Ticket</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/stats">View Stats</Link>
        </Button>
      </div>
    </div>
  );
}
