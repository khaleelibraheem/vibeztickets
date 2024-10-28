import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Trash2, CheckCircle } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";

export const TicketCard = memo(function TicketCard({
  ticket,
  onValidate,
  onShare,
  onDelete,
  showValidateButton = true,
  onCopyId,
}) {
  return (
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
              onClick={() => onCopyId(ticket.ticketId)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") onCopyId(ticket.ticketId);
              }}
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
              onClick={() => onValidate(ticket.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onShare(ticket)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <DeleteDialog
            ticketId={ticket.ticketId}
            onConfirm={() => onDelete(ticket.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
});
