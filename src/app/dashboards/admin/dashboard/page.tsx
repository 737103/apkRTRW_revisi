
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, off, update, remove, set, query, orderByChild, limitToLast } from "firebase/database";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Eye, CheckCircle, Clock, Users, Megaphone, ArrowRight, XCircle, Check, FileText, MessageSquarePlus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const { toast } = useToast();
  
  const reportsRef = ref(rtdb, "reports");
  const usersRef = ref(rtdb, "users");
  const announcementsRef = ref(rtdb, "announcements");

  useEffect(() => {
    const listeners: (() => void)[] = [];

    // Use a simpler ref to fetch all reports, then sort on client.
    // This is more robust if server-side indexes are not deployed.
    const reportsListener = onValue(reportsRef, (snapshot) => {
        const data = snapshot.val();
        const reportsData: Report[] = [];
        if(data) {
            Object.keys(data).forEach(key => reportsData.push({ id: key, ...data[key] }));
        }
        // Sort on the client-side
        setReports(reportsData.sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
    }, (error) => {
      console.error("Failed to load reports:", error);
      toast({
        title: "Gagal Memuat Laporan",
        description: error.message,
        variant: "destructive",
      });
    });
    listeners.push(() => off(reportsRef, 'value', reportsListener));

    const usersListener = onValue(usersRef, (snapshot) => {
        setUserCount(snapshot.size);
    }, (error) => console.error("Failed to load users:", error));
    listeners.push(() => off(usersRef, 'value', usersListener));

    const announcementsListener = onValue(announcementsRef, (snapshot) => {
        setAnnouncementCount(snapshot.size);
    }, (error) => console.error("Failed to load announcements:", error));
    listeners.push(() => off(announcementsRef, 'value', announcementsListener));

    return () => {
        listeners.forEach(unsub => unsub());
    }
  }, [toast]);
  
  const handleNoteDialogClose = () => {
    setIsNoteDialogOpen(false);
    setNoteContent("");
  };
  
  const handleDetailDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
        setSelectedReport(null);
    }
    setIsDetailDialogOpen(isOpen);
  };

  const updateReportStatus = async (reportId: string, status: ReportStatus) => {
    try {
        const reportRef = ref(rtdb, `reports/${reportId}`);
        await update(reportRef, { status });
        setSelectedReport(prev => prev ? {...prev, status: status} : null);
        toast({
            title: "Status Laporan Diperbarui",
            description: `Laporan telah ditandai sebagai ${status}.`,
        });
    } catch(error) {
        console.error("Failed to update report status", error);
        toast({
            title: "Gagal Memperbarui Status",
            variant: "destructive",
        });
    }
  }
  
  const handleSaveNote = async () => {
    if (!selectedReport) return;
    try {
        const reportRef = ref(rtdb, `reports/${selectedReport.id}`);
        await update(reportRef, { notes: noteContent });
        setSelectedReport(prev => prev ? {...prev, notes: noteContent} : null);
        toast({
            title: "Catatan Disimpan",
        });
        handleNoteDialogClose();
    } catch(error) {
        console.error("Failed to save note", error);
        toast({
            title: "Gagal Menyimpan Catatan",
            variant: "destructive",
        });
    }
  };

  const openNoteDialog = (report: Report) => {
    setSelectedReport(report);
    setNoteContent(report.notes || "");
    setIsNoteDialogOpen(true);
  };
  
  const deleteReport = async (reportId: string) => {
     try {
        const reportRef = ref(rtdb, `reports/${reportId}`);
        await remove(reportRef);
        toast({
            title: "Laporan Dihapus",
        });
    } catch (error) {
        console.error("Failed to delete report", error);
        toast({
            title: "Gagal Menghapus Laporan",
            variant: "destructive",
        });
    }
  }
  
  const handleViewReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDetailDialogOpen(true);
  };

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
              <FileText className="h-4 w-4 text-muted-foreground" />
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
                  <TableCell>{new Date(report.submissionDate).toLocaleDateString('id-ID')}</TableCell>
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
                  <TableCell className="text-right space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleViewReportClick(report)}>
                             <Eye className="h-4 w-4" />
                             <span className="sr-only">Lihat Detail</span>
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lihat Detail Laporan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <AlertDialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Hapus</span>
                                  </Button>
                              </AlertDialogTrigger>
                          </TooltipTrigger>
                           <TooltipContent>
                              <p>Hapus Laporan</p>
                           </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                              Tindakan ini tidak dapat diurungkan. Ini akan menghapus laporan secara permanen.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteReport(report.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
      
      {selectedReport && (
          <Dialog open={isDetailDialogOpen} onOpenChange={handleDetailDialogChange}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Detail Laporan - {selectedReport.namaLengkap}</DialogTitle>
                  <DialogDescription>
                    Dikirim pada {new Date(selectedReport.submissionDate).toLocaleString('id-ID')} - RT {selectedReport.rt}/RW {selectedReport.rw}
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
                <DialogFooter className="justify-between sm:justify-between items-center gap-2 flex-wrap pt-4 border-t">
                  <div className="flex gap-2 flex-wrap">
                      <Button variant="destructive" onClick={() => updateReportStatus(selectedReport.id, 'Ditolak')}>
                          <XCircle className="mr-2 h-4 w-4" /> Tolak
                      </Button>
                      <Button variant="default" className="bg-accent hover:bg-accent/90" onClick={() => updateReportStatus(selectedReport.id, 'Disetujui')}>
                          <Check className="mr-2 h-4 w-4" /> Setujui
                      </Button>
                      <Button variant="secondary" onClick={() => openNoteDialog(selectedReport)}>
                          <MessageSquarePlus className="mr-2 h-4 w-4" /> Catatan
                      </Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50">
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Tindakan ini tidak dapat diurungkan. Ini akan menghapus laporan secara permanen.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => {
                                  deleteReport(selectedReport.id);
                                  handleDetailDialogChange(false);
                              }} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                  </div>
                  <DialogClose asChild>
                      <Button variant="outline">Tutup</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
          </Dialog>
      )}

      <Dialog open={isNoteDialogOpen} onOpenChange={(isOpen) => !isOpen && handleNoteDialogClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah/Edit Catatan</DialogTitle>
            <DialogDescription>
              Berikan catatan untuk laporan dari {selectedReport?.namaLengkap}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Catatan
              </Label>
              <Textarea
                id="note"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="col-span-3 min-h-[100px]"
                placeholder="Tulis catatan di sini..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleNoteDialogClose()}>Batal</Button>
            <Button type="submit" onClick={handleSaveNote}>Simpan Catatan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    