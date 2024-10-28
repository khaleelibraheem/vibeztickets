"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import { Download, Share2, Clock } from "lucide-react";

export default function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const q = query(collection(db, "tickets"), where("ticketId", "==", id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setTicket({
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        });
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id, fetchTicket]);

  const downloadTicket = async () => {
    setIsDownloading(true);
    const ticketElement = document.getElementById("ticket-card");

    try {
      // Create a clone of the ticket element
      const clonedTicket = ticketElement.cloneNode(true);

      // Find and remove the action buttons from the clone
      const actionButtons = clonedTicket.querySelector("[data-action-buttons]");
      if (actionButtons) {
        actionButtons.style.display = "none";
      }

      // Temporarily append the clone to the document (hidden)
      clonedTicket.style.position = "absolute";
      clonedTicket.style.left = "-9999px";
      document.body.appendChild(clonedTicket);

      const canvas = await html2canvas(clonedTicket, {
        scale: 2,
        backgroundColor: "#1f2937", // Dark background
        logging: false,
      });

      // Remove the clone from the document
      document.body.removeChild(clonedTicket);

      const link = document.createElement("a");
      link.download = `ticket-${ticket.ticketId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error downloading ticket:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = `Check out my ticket for ${ticket.event}!\nTicket ID: ${ticket.ticketId}\n`;
    const url = window.location.href;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + url)}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    const text = `Check out my ticket for ${ticket.event}!`;
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyToClipboard = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-lg font-medium text-gray-300">
          Ticket not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card
          id="ticket-card"
          className="relative overflow-hidden bg-gray-800 border-0 rounded-lg"
          style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
        >
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500" />

          <div className="p-8 space-y-8">
            {/* Digital Ticket Header */}
            <div className="text-center">
              <h2 className="text-purple-400 text-lg font-medium mb-4">
                Digital Ticket
              </h2>
              <h1 className="text-4xl font-bold bg-clip-text text-purple-600 mb-2">
                {ticket.event}
              </h1>
            </div>

            {/* Ticket ID */}
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-gray-700/50 rounded-lg">
                <p className="font-mono text-gray-300">#{ticket.ticketId}</p>
              </div>
            </div>

            {/* Attendee Info */}
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-400 mb-2">Attendee</p>
                <p className="text-white text-2xl font-medium">{ticket.name}</p>
              </div>
            </div>

            {/* Validation Status */}
            <div className="flex justify-center">
              {ticket.validated ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 rounded-full">
                  <span className="text-green-400 font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 rounded-full">
                  <Clock size={20} className="text-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    Pending Verification
                  </span>
                </div>
              )}
            </div>

            {/* Generation Date */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Generated on{" "}
                {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4" data-action-buttons>
              <Button
                onClick={downloadTicket}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-6"
              >
                <Download size={18} />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 px-6"
                  >
                    <Share2 size={18} />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={shareToWhatsApp}>
                    Share on WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareToFacebook}>
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareToTwitter}>
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyToClipboard}>
                    {copied ? "Link Copied!" : "Copy Link"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
