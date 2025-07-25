
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Megaphone, ArrowRight } from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, off, query, orderByChild, limitToLast } from "firebase/database";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';

interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export default function UserDashboardPage() {
    const [userName, setUserName] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        setIsLoading(true);
        // Set user name from localStorage
        try {
            const loggedInUserStr = localStorage.getItem(LOGGED_IN_USER_KEY);
            if (loggedInUserStr) {
                const loggedInUser = JSON.parse(loggedInUserStr);
                setUserName(loggedInUser.fullName || 'Pengguna');
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
        }

        // Fetch announcements from Realtime Database
        const announcementsRef = ref(rtdb, "announcements");
        const announcementsQuery = query(announcementsRef, orderByChild("timestamp"), limitToLast(3));
        
        const listener = onValue(announcementsQuery, (snapshot) => {
            const data = snapshot.val();
            const announcementsData: Announcement[] = [];
            if(data) {
                for (const key in data) {
                    announcementsData.push({ id: key, ...data[key] });
                }
            }
            setAnnouncements(announcementsData.sort((a, b) => b.timestamp - a.timestamp));
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to load announcements from RTDB", error);
            setIsLoading(false);
        });

        return () => {
            off(announcementsRef, 'value', listener);
        };
    }, []);

    const handleAnnouncementClick = (announcement: Announcement) => {
      setSelectedAnnouncement(announcement);
    };

    const handleDialogClose = () => {
      setSelectedAnnouncement(null);
    }
    
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <h1 className="text-4xl font-bold tracking-tight">Selamat Datang, {userName}!</h1>
            <p className="text-lg text-muted-foreground">Berikut adalah ringkasan dan pengumuman terbaru untuk Anda.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <FileText className="h-5 w-5 text-primary" />
                            Laporan Kinerja
                        </CardTitle>
                        <CardDescription>Kirim laporan kinerja Anda dengan mudah melalui formulir yang tersedia.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/dashboards/dashboard/submit-report">Buat Laporan Baru</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <div className="shadow-lg md:col-span-2 rounded-lg">
                    <Card className="h-full">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl">
                              <Megaphone className="h-5 w-5 text-accent" />
                              Pengumuman Terbaru
                          </CardTitle>
                           <div className="flex justify-between items-center">
                              <CardDescription>Informasi penting dari pengurus. Klik untuk melihat detail.</CardDescription>
                               <Link href="/dashboards/dashboard/announcements" className="text-xs text-primary font-semibold flex items-center hover:underline">
                                  Lihat Semua
                                  <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                          </div>
                      </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : announcements.length > 0 ? (
                            <div className="space-y-4">
                                {announcements.map((ann) => (
                                    <div 
                                      key={ann.id} 
                                      className="p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                                      onClick={() => handleAnnouncementClick(ann)}
                                    >
                                        <h3 className="font-semibold">{ann.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 truncate">{ann.content}</p>
                                        <p className="text-xs text-muted-foreground/80 mt-2">{ann.timestamp ? formatDate(ann.timestamp) : 'Tanggal tidak tersedia'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Megaphone className="mx-auto h-8 w-8" />
                                <p className="mt-2">Belum ada pengumuman.</p>
                            </div>
                        )}
                    </CardContent>
                    </Card>
                </div>
            </div>

            {selectedAnnouncement && (
              <Dialog open={!!selectedAnnouncement} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
                <DialogContent className="sm:max-w-xl">
                   <DialogHeader>
                      <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
                      <DialogDescription>
                        Diterbitkan pada: {selectedAnnouncement.timestamp ? formatDate(selectedAnnouncement.timestamp) : 'Tanggal tidak tersedia'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleDialogClose}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
        </div>
    );
}
