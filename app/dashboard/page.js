"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { Share2, Trash2, CheckCircle, Search, X } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [searchedTickets, setSearchedTickets] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [newTicket, setNewTicket] = useState({
    name: "",
    phone: "",
    event: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearchInput, setCurrentSearchInput] = useState(""); // Add this state

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

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

  const generateTicketId = () => {
    return "TKT-" + Math.random().toString(36).slice(2, 7).toUpperCase();
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

 const handleSearch = () => {
   if (!currentSearchInput.trim()) return;
   const formattedSearch = formatSearchInput(currentSearchInput);
   setSearchId(formattedSearch);
   searchTicket(formattedSearch);
 };

  const clearSearch = () => {
    setCurrentSearchInput(""); // Only clear the input field
  };

  const verifiedCount = tickets.filter((ticket) => ticket.validated).length;
  const unverifiedCount = tickets.filter((ticket) => !ticket.validated).length;

const DeleteAllDialog = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive">
        Delete All
        <Trash2 className="h-4 w-4 ml-2" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-lg font-semibold">
          Are you absolutely sure?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone. This will permanently delete all tickets
          from the database.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex gap-2">
        <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={clearAllTickets}
          className="bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete All
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

  const DeleteSingleDialog = ({ ticket }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete ticket {ticket.ticketId}? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteTicket(ticket.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

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

  // Add toast for login
  useEffect(() => {
    if (user) {
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.email}`,
        duration: 3000,
      });
    }
  }, [user, toast]);

  const TicketCard = ({ ticket, showValidateButton = true }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{ticket.event}</h3>
            <p className="text-sm text-gray-500 mb-2">{ticket.name}</p>
          </div>
          <div className="flex flex-col items-end">
            {ticket.validated ? (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Pending
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Ticket ID:</span>
            <span
              className="font-mono text-blue-600 cursor-pointer"
              onClick={() => copyToClipboard(ticket.ticketId)}
            >
              {ticket.ticketId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Phone:</span>
            <span>{ticket.phone}</span>
          </div>
        </div>

        <div className="flex gap-2 justify-end border-t pt-4">
          {!ticket.validated && showValidateButton && (
            <Button
              size="sm"
              onClick={() => validateTicket(ticket.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => shareTicket(ticket)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <DeleteSingleDialog ticket={ticket} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8">
        <div className="flex flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Ticket Management</h1>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="create">
          <TabsList className="w-full flex">
            <TabsTrigger value="create" className="flex-1">
              Create
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex-1">
              Manage
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-1">
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="sm:max-w-[500px]">
              <CardHeader>
                <CardTitle>Create New Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createTicket} className="space-y-4">
                  <Input
                    placeholder="Name"
                    value={newTicket.name}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={newTicket.phone}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, phone: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Event Name"
                    value={newTicket.event}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, event: e.target.value })
                    }
                    required
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="flex flex-col sm:hidden mb-4">
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-semibold dark:text-black">
                        {tickets.length}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-sm text-gray-500">Verified</p>
                      <p className="text-xl font-semibold text-green-600">
                        {verifiedCount}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-xl font-semibold text-yellow-600">
                        {unverifiedCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <DeleteAllDialog />
            </div>

            {/* Mobile view with cards */}
            <div className="sm:hidden space-y-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
            <div className="hidden sm:block">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Tickets({tickets.length})</CardTitle>
                  <CardTitle>Verified Tickets({verifiedCount})</CardTitle>
                  <CardTitle>Unverified Tickets({unverifiedCount})</CardTitle>
                  <DeleteAllDialog />
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell
                            onClick={() => copyToClipboard(ticket.ticketId)}
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            title="Click to copy"
                          >
                            {ticket.ticketId}
                          </TableCell>
                          <TableCell>{ticket.name}</TableCell>
                          <TableCell>{ticket.phone}</TableCell>
                          <TableCell>{ticket.event}</TableCell>
                          <TableCell>
                            {ticket.validated ? (
                              <span className="text-green-600">Verified</span>
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </TableCell>
                          <TableCell className="space-x-2">
                            {!ticket.validated && (
                              <Button
                                size="sm"
                                onClick={() => validateTicket(ticket.id)}
                                className="mr-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => shareTicket(ticket)}
                              className="mr-2"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <DeleteSingleDialog ticket={ticket} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="search">
            <Card className="sm:max-w-[500px]">
              <CardHeader>
                <CardTitle>Search Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        TKT-
                      </div>
                      <Input
                        placeholder="Enter Ticket ID"
                        value={currentSearchInput}
                        onChange={handleSearchInputChange}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        className="pl-12 pr-8 uppercase"
                      />
                      {currentSearchInput && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setCurrentSearchInput("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !currentSearchInput.trim()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isSearching && (
              <div className="flex justify-center items-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {hasSearched && !isSearching && searchedTickets.length === 0 && (
              <Card className="mt-4">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      No Results Found
                    </h3>
                    <p className="text-sm text-gray-500">
                      No ticket found with ID: {searchId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="hidden sm:block">
              {searchedTickets.length > 0 && (
                <Card className="mt-8">
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchedTickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell
                              onClick={() => copyToClipboard(ticket.ticketId)}
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              title="Click to copy"
                            >
                              {ticket.ticketId}
                            </TableCell>
                            <TableCell>{ticket.name}</TableCell>
                            <TableCell>{ticket.phone}</TableCell>
                            <TableCell>{ticket.event}</TableCell>
                            <TableCell>
                              {ticket.validated ? (
                                <span className="text-green-600">Verified</span>
                              ) : (
                                <span className="text-yellow-600">Pending</span>
                              )}
                            </TableCell>
                            <TableCell className="space-x-2">
                              {!ticket.validated && (
                                <Button
                                  size="sm"
                                  onClick={() => validateTicket(ticket.id)}
                                  className="mr-2"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => shareTicket(ticket)}
                                className="mr-2"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <DeleteSingleDialog ticket={ticket} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Mobile view for search results */}
            <div className="sm:hidden mt-4">
              {searchedTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
  );
}
