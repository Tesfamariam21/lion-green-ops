import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DispatchRecord {
  id: string;
  serialNumber: string;
  model: string;
  variant: string;
  productionDate: string;
  inspector: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface DispatchTableProps {
  records: DispatchRecord[];
  onView: (record: DispatchRecord) => void;
  onApprove?: (record: DispatchRecord) => void;
  onReject?: (record: DispatchRecord) => void;
  showActions?: boolean;
}

const DispatchTable = ({
  records,
  onView,
  onApprove,
  onReject,
  showActions = false,
}: DispatchTableProps) => {
  const getStatusBadge = (status: DispatchRecord["status"]) => {
    const classes = {
      pending: "status-badge status-pending",
      approved: "status-badge status-approved",
      rejected: "status-badge status-rejected",
    };
    return <span className={classes[status]}>{status}</span>;
  };

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Serial #</TableHead>
            <TableHead className="text-muted-foreground">Model</TableHead>
            <TableHead className="text-muted-foreground">Variant</TableHead>
            <TableHead className="text-muted-foreground">Production Date</TableHead>
            <TableHead className="text-muted-foreground">Inspector</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.id}
              className="border-border hover:bg-secondary/30 transition-colors"
            >
              <TableCell className="font-mono text-foreground">
                {record.serialNumber}
              </TableCell>
              <TableCell className="text-foreground">{record.model}</TableCell>
              <TableCell className="text-foreground">{record.variant}</TableCell>
              <TableCell className="text-muted-foreground">
                {record.productionDate}
              </TableCell>
              <TableCell className="text-muted-foreground">{record.inspector}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(record)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {showActions && record.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-accent hover:text-accent hover:bg-accent/10"
                        onClick={() => onApprove?.(record)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onReject?.(record)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DispatchTable;
