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
import { cn } from "@/lib/utils";

const reports = [
  { id: '1', name: 'John Doe (RT 01)', title: 'Laporan Keamanan Bulanan', date: '2023-10-01', status: 'Ditinjau' },
  { id: '2', name: 'Jane Smith (RW 02)', title: 'Inisiatif Kebersihan Komunitas', date: '2023-10-02', status: 'Tertunda' },
  { id: '3', name: 'Peter Jones (RT 03)', title: 'Laporan Keuangan Q3', date: '2023-10-03', status: 'Ditinjau' },
  { id: '4', name: 'Mary Johnson (RT 01)', title: 'Laporan Kegiatan Sosial', date: '2023-10-04', status: 'Tertunda' },
  { id: '5', name: 'David Chan (RW 01)', title: 'Pemeliharaan Infrastruktur', date: '2023-10-05', status: 'Ditinjau' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <h1 className="text-4xl font-bold tracking-tight">Dasbor Admin</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Laporan Kinerja</CardTitle>
          <CardDescription>Tinjau dan kelola laporan yang dikirim oleh anggota RT/RW.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Pengirim</TableHead>
                <TableHead>Judul Laporan</TableHead>
                <TableHead>Tanggal Pengiriman</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Tertunda' ? 'outline' : 'default'} className={cn(
                        report.status === 'Tertunda' ? 'border-yellow-500/50 text-yellow-600' : 'bg-accent text-accent-foreground'
                    )}>
                        {report.status === 'Tertunda' ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                        {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Lihat Detail</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lihat Detail</p>
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
