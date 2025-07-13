'use client';

import { useState, useEffect } from "react";
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

const REPORTS_STORAGE_KEY = 'rt-rw-reports';

interface Report {
  id: string;
  namaLengkap: string;
  rt: string;
  rw: string;
  jabatan: string;
  jamDatang: string;
  jamPulang: string;
  deskripsiKegiatan: string;
  alamatKegiatan: string;
  fotoKegiatan: string; // Assuming base64 string
  submissionDate: string;
  status: 'Ditinjau' | 'Tertunda';
}

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    try {
      const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (storedReports) {
        const parsedReports = JSON.parse(storedReports).map((report: any) => ({
            ...report,
            status: Math.random() > 0.5 ? 'Ditinjau' : 'Tertunda' // Mock status for now
        }));
        setReports(parsedReports);
      }
    } catch (error) {
        console.error("Failed to parse reports from localStorage", error);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <h1 className="text-4xl font-bold tracking-tight">Dasbor Admin</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Laporan Kinerja</CardTitle>
          <CardDescription>Tinjau dan kelola laporan yang dikirim oleh anggota RT/RW.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
             <p className="text-muted-foreground text-center py-8">Belum ada laporan yang dikirim.</p>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pengirim</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>RT/RW</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{report.namaLengkap}</TableCell>
                  <TableCell>{report.jabatan}</TableCell>
                  <TableCell>{`RT ${report.rt} / RW ${report.rw}`}</TableCell>
                  <TableCell>{report.submissionDate}</TableCell>
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
                          <p>Lihat Detail Laporan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
