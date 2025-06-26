import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="text-center">
        <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
          </div>
          <p className="text-sm text-gray-400">
            &copy; 2024 Built with ❤️ and ☕ by{" "}
            {/* <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mx-1 font-semibold">
                    VibezFusion
                  </span> */}
            <Link
              href={"https://khaleelalhaji.info"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer ml-1 font-medium">
                Khaleel Alhaji
              </span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
