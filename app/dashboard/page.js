"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Share2,
  Trash2,
  CheckCircle,
  Search,
  X,
  Ticket,
  Users,
  Calendar,
  Shield,
  Plus,
  LogOut,
  Eye,
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  Copy,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import TicketCard from "@/components/TicketCard";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);

  const [searchedTickets, setSearchedTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    name: "",
    phone: "",
    event: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchId, setSearchId] = useState("");

  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const generateTicketId = () => {
    return "TKT-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  };

  const fetchTickets = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      const ticketList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketList);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // Optionally set an error state or show a user-friendly message
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const ticketId = generateTicketId();
      await addDoc(collection(db, "tickets"), {
        ...newTicket,
        ticketId,
        validated: false,
        createdAt: new Date().toISOString(),
      });
      setNewTicket({ name: "", phone: "", event: "" });
      fetchTickets();
      toast({
        title: "Success!",
        description: `Ticket ${ticketId} has been generated`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const validateTicket = async (id) => {
    try {
      const ticketRef = doc(db, "tickets", id);
      await updateDoc(ticketRef, {
        validated: true,
      });
      fetchTickets();
      setSearchedTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? { ...ticket, validated: true } : ticket
        )
      );
      toast({
        title: "Ticket Validated",
        description: "The ticket has been successfully validated",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error validating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to validate ticket. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const deleteTicket = async (id) => {
    try {
      await deleteDoc(doc(db, "tickets", id));
      fetchTickets();
      setSearchedTickets((prev) => prev.filter((ticket) => ticket.id !== id));
      toast({
        title: "Ticket Deleted",
        description: "The ticket has been successfully deleted",
        duration: 3000,
      });
    } catch (error) {
      setError("Failed to delete ticket. Please try again.");
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const clearAllTickets = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      fetchTickets();
      setSearchedTickets([]);
      setShowDeleteAllDialog(false);

      toast({
        title: "All Tickets Deleted",
        description: "Successfully deleted all tickets",
        duration: 3000,
      });
    } catch (error) {
      setError("Failed to clear tickets. Please try again.");
      toast({
        title: "Error",
        description: "Failed to delete all tickets. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const searchTicket = async (searchValue) => {
    if (!searchValue) return;
    setError(null);
    setIsSearching(true);
    setHasSearched(true);

    try {
      const q = query(
        collection(db, "tickets"),
        where("ticketId", "==", searchValue)
      );
      const querySnapshot = await getDocs(q);
      const searchResults = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchedTickets(searchResults);
    } catch (error) {
      console.error("Error searching ticket:", error);
      setError("Ticket search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatSearchInput = (input) => {
    // Remove TKT- if it exists and clean the input
    const cleanInput = input.replace(/^TKT-/, "").toUpperCase();
    // Only append TKT- if there's actual input
    return cleanInput ? `TKT-${cleanInput}` : cleanInput;
  };

  const handleSearchInputChange = (e) => {
    const inputValue = e.target.value;
    // Remove TKT- prefix for display in input
    const displayValue = inputValue.replace(/^TKT-/, "");
    setCurrentSearchInput(displayValue);
  };
  const handleSearch = () => {
    if (!currentSearchInput.trim()) return;
    const formattedSearch = formatSearchInput(currentSearchInput);
    setSearchId(formattedSearch);
    searchTicket(formattedSearch);
  };

  const clearSearch = () => {
    setCurrentSearchInput(""); // Only clear the input field
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Ticket ID copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const shareTicket = async (ticket) => {
    const shareData = {
      title: `${ticket.event} Ticket`,
      text: `Hey ${ticket.name}, Check out your ticket for ${ticket.event}!`,
      url: `${window.location.origin}/ticket/${ticket.ticketId}`,
    };

    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    if (user) {
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.email}`,
        duration: 3000,
      });
    }
  }, [user, toast]);

  const verifiedCount = tickets.filter((ticket) => ticket.validated).length;
  const unverifiedCount = tickets.filter((ticket) => !ticket.validated).length;
  const todayCount = tickets.filter((ticket) => {
    const today = new Date().toDateString();
    const ticketDate = new Date(ticket.createdAt).toDateString();
    return today === ticketDate;
  }).length;

  const stats = [
    {
      icon: Ticket,
      value: tickets.length.toString(),
      label: "Total Tickets",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckCircle,
      value: verifiedCount.toString(),
      label: "Verified",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Clock,
      value: unverifiedCount.toString(),
      label: "Pending",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Calendar,
      value: todayCount.toString(),
      label: "Today",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%), linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)`,
        }}
      >
        {/* Animated background elements */}
        {/* <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div> */}

        {/* Navigation */}
        <nav className="relative z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Eventra
                </span>
                <span className="block text-sm text-gray-400">Dashboard</span>
              </div>
            </div>
            <Button
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              variant="outline"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4 mt-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your events, track ticket sales, and monitor performance in
              real-time.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div className="relative z-10 space-y-3">
                    <div
                      className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl w-fit`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
            <Tabs defaultValue="create" className="w-full">
              <div className="border-b border-white/10 bg-white/5">
                <TabsList className="w-full bg-transparent h-16 p-1">
                  <TabsTrigger
                    value="create"
                    className="flex-1 h-12 bg-transparent text-gray-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2 hidden sm:block" />
                    Create Ticket
                  </TabsTrigger>
                  <TabsTrigger
                    value="manage"
                    className="flex-1 h-12 bg-transparent text-gray-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-200"
                  >
                    <BarChart3 className="w-4 h-4 mr-2 hidden sm:block" />
                    Manage Tickets
                  </TabsTrigger>
                  <TabsTrigger
                    value="search"
                    className="flex-1 h-12 bg-transparent text-gray-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-200"
                  >
                    <Search className="w-4 h-4 mr-2 hidden sm:block" />
                    Search Tickets
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="pt-6 md:p-8">
                <TabsContent value="create" className="mt-0">
                  <div className="max-w-2xl mx-auto">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                          <Plus className="w-6 h-6" />
                          Create New Ticket
                        </CardTitle>
                        <p className="text-gray-300">
                          Generate a new digital ticket for your event
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <form onSubmit={createTicket} className="space-y-6">
                          <div className="space-y-4">
                            <Input
                              placeholder="Full Name"
                              value={newTicket.name}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  name: e.target.value,
                                })
                              }
                              required
                              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-blue-500 h-12"
                            />
                            <Input
                              type="tel"
                              placeholder="Phone Number"
                              value={newTicket.phone}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  phone: e.target.value,
                                })
                              }
                              required
                              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-blue-500 h-12"
                            />
                            <Input
                              placeholder="Event Name"
                              value={newTicket.event}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  event: e.target.value,
                                })
                              }
                              required
                              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-blue-500 h-12"
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 h-12 transition-all duration-200 transform hover:scale-[1.02]"
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Generating Ticket...
                              </div>
                            ) : (
                              <>
                                <Ticket className="w-4 h-4 mr-2" />
                                Generate Ticket
                              </>
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="manage" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-5">
                      <h2 className="text-2xl font-bold text-white">
                        All Tickets
                      </h2>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            disabled={tickets.length === 0}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete All
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-white/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              This action cannot be undone. This will
                              permanently delete all tickets from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/30 text-white hover:bg-white/10">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={clearAllTickets}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Empty State */}
                    {tickets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center max-w-md">
                          <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                            <Ticket className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            No Tickets Found
                          </h3>
                          <p className="text-gray-400 mb-6">
                            There are no tickets in the system yet. Create your
                            first ticket to get started.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                          {tickets.map((ticket) => (
                            <TicketCard
                              key={ticket.id}
                              ticket={ticket}
                              onValidate={() => validateTicket(ticket.id)}
                              onDelete={() => deleteTicket(ticket.id)}
                              onShare={() => shareTicket(ticket)}
                            />
                          ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block">
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-white/20 hover:bg-white/5">
                                  <TableHead className="text-gray-300 font-semibold">
                                    Ticket ID
                                  </TableHead>
                                  <TableHead className="text-gray-300 font-semibold">
                                    Name
                                  </TableHead>
                                  <TableHead className="text-gray-300 font-semibold">
                                    Phone
                                  </TableHead>
                                  <TableHead className="text-gray-300 font-semibold">
                                    Event
                                  </TableHead>
                                  <TableHead className="text-gray-300 font-semibold">
                                    Status
                                  </TableHead>
                                  <TableHead className="text-gray-300 font-semibold">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tickets.map((ticket) => (
                                  <TableRow
                                    key={ticket.id}
                                    className="border-white/10 hover:bg-white/5 transition-colors"
                                  >
                                    <TableCell
                                      onClick={() =>
                                        copyToClipboard(ticket.ticketId)
                                      }
                                      className="cursor-pointer hover:text-blue-300 transition-colors text-white font-mono"
                                      title="Click to copy"
                                    >
                                      {ticket.ticketId}
                                    </TableCell>
                                    <TableCell className="text-white">
                                      {ticket.name}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      {ticket.phone}
                                    </TableCell>
                                    <TableCell className="text-white">
                                      {ticket.event}
                                    </TableCell>
                                    <TableCell>
                                      {ticket.validated ? (
                                        <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs border border-green-500/30">
                                          Verified
                                        </span>
                                      ) : (
                                        <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs border border-yellow-500/30">
                                          Pending
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                      {!ticket.validated && (
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            validateTicket(ticket.id)
                                          }
                                          className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-white/30 text-white hover:bg-white/10"
                                        onClick={() => shareTicket(ticket)}
                                      >
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            size="sm"
                                            className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-slate-900 border-white/20">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle className="text-white">
                                              Delete Ticket
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-300">
                                              Are you sure you want to delete
                                              ticket {ticket.ticketId}?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel className="border-white/30 text-white hover:bg-white/10">
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                deleteTicket(ticket.id)
                                              }
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="search" className="mt-0">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                          <Search className="w-6 h-6" />
                          Search Ticket
                        </CardTitle>
                        <p className="text-gray-300">
                          Find a specific ticket by its ID
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-3">
                          <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none font-mono">
                              TKT-
                            </div>
                            <Input
                              placeholder="Enter Ticket ID"
                              value={currentSearchInput}
                              onChange={(e) =>
                                setCurrentSearchInput(
                                  e.target.value
                                    .replace(/^TKT-/, "")
                                    .toUpperCase()
                                )
                              }
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSearch()
                              }
                              className="pl-16 pr-4 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-blue-500 font-mono uppercase"
                            />
                            {currentSearchInput && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                                onClick={clearSearch}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <Button
                            onClick={handleSearch}
                            disabled={isSearching || !currentSearchInput.trim()}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 h-12"
                          >
                            {isSearching ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Searching...
                              </div>
                            ) : (
                              <>
                                <Search className="h-4 w-4 mr-2" />
                                Search
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Search Results */}
                    {hasSearched &&
                      !isSearching &&
                      searchedTickets.length === 0 && (
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mb-4">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              No Tickets Found
                            </h3>
                            <p className="text-gray-400 text-center">
                              No ticket found with ID: {searchId}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                    {/* Display Search Results */}
                    {searchedTickets.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Search Results
                        </h3>
                        {searchedTickets.map((ticket) => (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            showValidateButton={true}
                            onValidate={() => validateTicket(ticket.id)}
                            onShare={() => shareTicket(ticket)}
                            onDelete={() => deleteTicket(ticket.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <p className="text-white text-sm">
                          New ticket created for{" "}
                          <span className="font-semibold">{ticket.name}</span>
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(ticket.createdAt).toLocaleDateString()} at{" "}
                          {new Date(ticket.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {ticket.ticketId}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
      <Footer />
    </>
  );
}
