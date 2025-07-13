'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Eye, CheckCircle, Clock, Users, Megaphone, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

const REPORTS_STORAGE_KEY = 'rt-rw-reports';
const USERS_STORAGE_KEY = 'rt-rw-users';
const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';


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
  status: 'Ditinjau' | 'Tertunda';
}

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);

  useEffect(() => {
    try {
      const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (storedReports) {
        const parsedReports = JSON.parse(storedReports).map((report: any) => ({
            ...report,
            status: Math.random() > 0.5 ? 'Ditinjau' : 'Tertunda'
        }));
        setReports(parsedReports.reverse()); 
      }

      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if(storedUsers) {
        setUserCount(JSON.parse(storedUsers).length);
      }

      const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      if(storedAnnouncements) {
        setAnnouncementCount(JSON.parse(storedAnnouncements).length);
      }

    } catch (error) {
        console.error("Failed to parse reports from localStorage", error);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dasbor Admin</h1>
        <p className="text-lg text-muted-foreground">Kelola laporan, pengguna, dan pengumuman.</p>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">Laporan yang telah dikirim</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
                <Link href="/dashboards/admin/manage-users" className="text-xs text-muted-foreground hover:underline flex items-center">
                  Kelola Pengguna <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengumuman</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcementCount}</div>
               <Link href="/dashboards/admin/announcements" className="text-xs text-muted-foreground hover:underline flex items-center">
                  Kelola Pengumuman <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
            </CardContent>
          </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Laporan Kinerja Terbaru</CardTitle>
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
              {reports.slice(0, 5).map((report) => (
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
                            <DialogTitle>Detail Laporan - {selectedReport.namaLengkap}</DialogTitle>
                            <DialogDescription>
                              Dikirim pada {selectedReport.submissionDate} - RT {selectedReport.rt}/RW {selectedReport.rw}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Jam Datang</p>
                                    <p className="font-semibold">{selectedReport.jamDatang}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Jam Pulang</p>
                                    <p className="font-semibold">{selectedReport.jamPulang}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Jenis Kegiatan</p>
                                    <p className="font-semibold capitalize">{selectedReport.jenisKegiatan}{selectedReport.jenisKegiatan === 'lainnya' && selectedReport.deskripsiLainnya ? `: ${selectedReport.deskripsiLainnya}` : ''}</p>
                                </div>
                             </div>
                             <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Deskripsi Kegiatan</p>
                                <p>{selectedReport.deskripsiKegiatan}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Alamat Kegiatan</p>
                                <p>{selectedReport.alamatKegiatan}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Lokasi GPS</p>
                                <p className="text-sm text-blue-500 hover:underline">
                                  <a href={`https://www.google.com/maps/search/?api=1&query=${selectedReport.lokasiKegiatan}`} target="_blank" rel="noopener noreferrer">
                                    {selectedReport.lokasiKegiatan}
                                  </a>
                                </p>
                            </div>
                             <div className="space-y-1">
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
