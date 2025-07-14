
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

const REPORTS_STORAGE_KEY = 'rt-rw-reports';
const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';

type ReportStatus = 'Tertunda' | 'Disetujui' | 'Ditolak';

interface Report {
  id: string;
  namaLengkap: string;
  rt: string;
  rw: string;
  jabatan: string;
  jamDatang: string;
  jamPulang: string;
  jenisKegiatan: string;
  deskripsiLainnya?: string;
  deskripsiKegiatan: string;
  alamatKegiatan: string;
  lokasiKegiatan: string;
  fotoKegiatan: string;
  submissionDate: string;
  status: ReportStatus;
  notes?: string;
}

export default function PerformanceDataPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    try {
      const loggedInUserStr = localStorage.getItem(LOGGED_IN_USER_KEY);
      if(!loggedInUserStr) return;
      const loggedInUser = JSON.parse(loggedInUserStr);

      const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (storedReports) {
        const allReports = JSON.parse(storedReports);
        const userReports = allReports.filter((report: any) => report.namaLengkap === loggedInUser.fullName)
          .map((report: any) => ({
              ...report,
              status: report.status || 'Tertunda'
          }));
        setReports(userReports.reverse()); 
      }
    } catch (error) {
        console.error("Failed to parse reports from localStorage", error);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Data Kinerja Anda</h1>
        <p className="text-lg text-muted-foreground">Lihat riwayat laporan kinerja yang telah Anda kirim.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Riwayat Laporan</CardTitle>
          <CardDescription>Berikut adalah semua laporan yang telah Anda kirimkan.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
             <p className="text-muted-foreground text-center py-8">Anda belum mengirimkan laporan apapun.</p>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Kegiatan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium capitalize">{report.jenisKegiatan}{report.jenisKegiatan === 'lainnya' && report.deskripsiLainnya ? `: ${report.deskripsiLainnya}` : ''}</TableCell>
                  <TableCell>{report.submissionDate}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Tertunda' ? 'outline' : report.status === 'Disetujui' ? 'default' : 'destructive'} className={cn(
                        report.status === 'Tertunda' ? 'border-yellow-500/50 text-yellow-600' : 
                        report.status === 'Disetujui' ? 'bg-accent text-accent-foreground' :
                        'bg-destructive/80 text-destructive-foreground'
                    )}>
                        {report.status === 'Tertunda' && <Clock className="mr-1 h-3 w-3" />}
                        {report.status === 'Disetujui' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {report.status === 'Ditolak' && <XCircle className="mr-1 h-3 w-3" />}
                        {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedReport(null)}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Lihat Detail</span>
                                </Button>
                              </DialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Lihat Detail Laporan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {selectedReport && selectedReport.id === report.id && (
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detail Laporan</DialogTitle>
                            <DialogDescription>
                              Dikirim pada {selectedReport.submissionDate}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                             <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Jabatan</p>
                                    <p className="font-semibold">{selectedReport.jabatan}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Jenis Kegiatan</p>
                                    <p className="font-semibold capitalize">{selectedReport.jenisKegiatan}{selectedReport.jenisKegiatan === 'lainnya' && selectedReport.deskripsiLainnya ? `: ${selectedReport.deskripsiLainnya}` : ''}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Jam Datang</p>
                                    <p className="font-semibold">{selectedReport.jamDatang}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Jam Pulang</p>
                                    <p className="font-semibold">{selectedReport.jamPulang}</p>
                                </div>
                             </div>
                             <div className="space-y-1 mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Deskripsi Kegiatan</p>
                                <p>{selectedReport.deskripsiKegiatan}</p>
                            </div>
                            <div className="space-y-1 mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Alamat Kegiatan</p>
                                <p>{selectedReport.alamatKegiatan}</p>
                            </div>
                            <div className="space-y-1 mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Lokasi GPS</p>
                                <p className="text-sm text-blue-500 hover:underline">
                                  <a href={`https://www.google.com/maps/search/?api=1&query=${selectedReport.lokasiKegiatan}`} target="_blank" rel="noopener noreferrer">
                                    {selectedReport.lokasiKegiatan}
                                  </a>
                                </p>
                            </div>
                             <div className="space-y-1 mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Foto Kegiatan</p>
                                {selectedReport.fotoKegiatan ? (
                                    <div className="mt-2">
                                      <Image
                                          src={selectedReport.fotoKegiatan}
                                          alt="Foto Kegiatan"
                                          width={500}
                                          height={300}
                                          className="rounded-md object-cover"
                                      />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada foto dilampirkan.</p>
                                )}
                            </div>
                            {selectedReport.notes && (
                                <div className="space-y-1 mt-4 pt-4 border-t">
                                    <p className="text-sm font-medium text-muted-foreground">Catatan dari Admin</p>
                                    <p className="text-sm p-3 bg-muted/50 rounded-md whitespace-pre-wrap">{selectedReport.notes}</p>
                                </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedReport(null)}>Tutup</Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
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

    