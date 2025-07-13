import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const reports = [
  { id: '1', name: 'John Doe (RT 01)', title: 'Monthly Security Report', date: '2023-10-01', status: 'Reviewed' },
  { id: '2', name: 'Jane Smith (RW 02)', title: 'Community Clean-up Initiative', date: '2023-10-02', status: 'Pending' },
  { id: '3', name: 'Peter Jones (RT 03)', title: 'Financial Statement Q3', date: '2023-10-03', status: 'Reviewed' },
  { id: '4', name: 'Mary Johnson (RT 01)', title: 'Social Activity Report', date: '2023-10-04', status: 'Pending' },
  { id: '5', name: 'David Chan (RW 01)', title: 'Infrastructure Maintenance', date: '2023-10-05', status: 'Reviewed' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Performance Reports</CardTitle>
          <CardDescription>Review and manage submitted reports from RT/RW members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Submitter</TableHead>
                <TableHead>Report Title</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Pending' ? 'outline' : 'default'} className={cn(
                        report.status === 'Pending' ? 'border-yellow-500/50 text-yellow-600' : 'bg-accent text-accent-foreground'
                    )}>
                        {report.status === 'Pending' ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                        {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
