"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Share2,
  Download,
  CheckCircle,
  Ticket,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from "@/components/Footer";
import { toPng } from "html-to-image";

export default function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  const ticketRef = useRef(null); // Ref added here

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;

      try {
        const q = query(collection(db, "tickets"), where("ticketId", "==", id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setTicket({ id: doc.id, ...doc.data() });
        } else {
          setTicket(null);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
        toast({
          title: "Error",
          description: "Could not fetch ticket. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, toast]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Ticket for the RNTU ${ticket?.event}`,
        text: `Check out my ticket for the RNTU ${ticket?.event}!`,
        url: window.location.href,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        toast({
          title: "Error sharing ticket",
          description:
            "Could not share the ticket. Try copying the link instead.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadImage = async () => {
    if (!ticketRef.current) return;

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `ticket-${ticket.ticketId}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Download Started",
        description: "Your ticket has been downloaded as an image.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the image.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden print:hidden"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1), transparent 40%)`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
          </div>
          <p className="text-white/80 text-lg font-medium tracking-wide animate-pulse">
            Loading your ticket...
          </p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden print:hidden"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1), transparent 40%)`,
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Ticket Not Found
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            This ticket does not exist or has been removed from our system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main
        className="flex-grow flex flex-col justify-start md:justify-center items-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden print:bg-white lg:pb-16"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none print:hidden">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>
        {/* <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Eventra</span>
        </div> */}
        <div className="w-full max-w-md relative z-10 print:w-full mt-5 lg:mt-0">
          <div className="text-center mb-4 print:hidden">
            <span className="inline-block px-4 py-1 text-xs text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/30 backdrop-blur-md">
              ✨ Digital Ticket
            </span>
          </div>

          <Card
            ref={ticketRef}
            className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl overflow-hidden relative group rounded-2xl print:bg-white print:text-black print:border print:shadow-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition duration-300 print:hidden" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full -translate-x-1/2 border-4 border-white/20 print:hidden" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full translate-x-1/2 border-4 border-white/20 print:hidden" />

            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent print:text-black print:bg-none">
                  RNTU {ticket.event}
                </h1>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent print:hidden" />
              </div>

              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm print:bg-white print:border print:text-black">
                  <p className="text-[11px] text-gray-400 print:text-black">
                    TICKET ID
                  </p>
                  <code className="text-base font-mono text-blue-400 font-semibold print:text-black whitespace-nowrap overflow-hidden text-ellipsis">
                    {ticket.ticketId}
                  </code>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm print:bg-white print:border print:text-black">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center print:hidden">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 print:text-black">
                      Attendee
                    </p>
                    <p className="text-base font-semibold text-white print:text-black">
                      {ticket.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm print:bg-white print:border print:text-black">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center print:hidden">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 print:text-black">
                      Date
                    </p>
                    <p className="text-base font-semibold text-white print:text-black">
                      28/06/2025
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm print:bg-white print:border print:text-black">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center print:hidden">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 print:text-black">
                      Venue
                    </p>
                    <p className="text-base font-semibold text-white print:text-black">
                      Courtyard By Marriott Bhopal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                {ticket.validated ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm text-sm text-green-400 font-medium print:text-black print:bg-white print:border">
                    <CheckCircle className="h-4 w-4 print:hidden" />
                    Verified & Valid
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm text-sm text-yellow-400 font-medium print:text-black print:bg-white print:border">
                    <Clock className="h-4 w-4 print:hidden" />
                    Awaiting Verification
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-white/70 print:text-black">
                Generated on:{" "}
                <span className="text-white font-medium print:text-black">
                  {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-center gap-3 print:hidden">
                <Button
                  onClick={handleShare}
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all print:hidden"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                {/* <Button
                  onClick={handleDownloadImage}
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all print:hidden"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button> */}
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer className="print:hidden" />
    </div>
  );
}
