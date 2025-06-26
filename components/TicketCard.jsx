// import { memo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Share2, Trash2, CheckCircle } from "lucide-react";
// import { DeleteDialog } from "./DeleteDialog";

// export const TicketCard = memo(function TicketCard({
//   ticket,
//   onValidate,
//   onShare,
//   onDelete,
//   showValidateButton = true,
//   onCopyId,
// }) {
//   return (
//     <Card className="mb-4">
//       <CardContent className="pt-6">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h3 className="font-semibold text-lg mb-1">{ticket.event}</h3>
//             <p className="text-sm text-gray-500 mb-2">{ticket.name}</p>
//           </div>
//           <div className="flex flex-col items-end">
//             {ticket.validated ? (
//               <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                 Verified
//               </span>
//             ) : (
//               <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
//                 Pending
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="space-y-2 mb-4">
//           <div className="flex justify-between items-center text-sm">
//             <span className="text-gray-500">Ticket ID:</span>
//             <span
//               className="font-mono text-blue-600 cursor-pointer"
//               onClick={() => onCopyId(ticket.ticketId)}
//               role="button"
//               tabIndex={0}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") onCopyId(ticket.ticketId);
//               }}
//             >
//               {ticket.ticketId}
//             </span>
//           </div>
//           <div className="flex justify-between items-center text-sm">
//             <span className="text-gray-500">Phone:</span>
//             <span>{ticket.phone}</span>
//           </div>
//         </div>

//         <div className="flex gap-2 justify-end border-t pt-4">
//           {!ticket.validated && showValidateButton && (
//             <Button
//               size="sm"
//               onClick={() => onValidate(ticket.id)}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               <CheckCircle className="h-4 w-4 mr-2" />
//               Validate
//             </Button>
//           )}
//           <Button size="sm" variant="outline" onClick={() => onShare(ticket)}>
//             <Share2 className="h-4 w-4 mr-2" />
//             Share
//           </Button>
//           <DeleteDialog
//             ticketId={ticket.ticketId}
//             onConfirm={() => onDelete(ticket.id)}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// });

"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Copy, Share2, Trash2 } from "lucide-react";

const TicketCard = ({ ticket, showValidateButton = true, onDelete, onValidate, onShare }) => {
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
  return (
    <div className="group cursor-pointer mb-3 md:mb-4">
      <div className="relative p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-base md:text-lg text-white mb-1 truncate">
                {ticket.event}
              </h3>
              <p className="text-gray-300 text-sm truncate">{ticket.name}</p>
            </div>
            <div className="flex-shrink-0">
              {ticket.validated ? (
                <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
                  Verified
                </span>
              ) : (
                <span className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full border border-yellow-500/30">
                  Pending
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ticket ID:</span>
              <div
                className="flex items-center space-x-2 font-mono text-blue-300 cursor-pointer break-all"
                onClick={() => copyToClipboard(ticket.ticketId)}
              >
                <span>{ticket.ticketId}</span>
                <Copy className="w-3 h-3" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Phone:</span>
              <span className="text-gray-300">{ticket.phone}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end border-t border-white/10 pt-4">
            {!ticket.validated && showValidateButton && (
              <Button
                size="sm"
                onClick={onValidate}
                className="bg-green-600/20 text-green-300 border border-green-500/30"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            {/* Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-600/20 text-red-300 border border-red-500/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900 border-white/20 z-[9999] w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Delete Ticket
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    Are you sure you want to delete ticket {ticket.ticketId}?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-white/30 text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
