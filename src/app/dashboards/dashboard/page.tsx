
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Megaphone, ArrowRight } from "lucide-react";

const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';
const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function UserDashboardPage() {
    const [userName, setUserName] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        try {
            const loggedInUserStr = localStorage.getItem(LOGGED_IN_USER_KEY);
            if (loggedInUserStr) {
                const loggedInUser = JSON.parse(loggedInUserStr);
                setUserName(loggedInUser.fullName || 'Pengguna');
            }

            const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
            if (storedAnnouncements) {
                setAnnouncements(JSON.parse(storedAnnouncements));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

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
                 <Card className="shadow-lg md:col-span-2">
                    <Link href="/dashboards/dashboard/announcements" className="hover:bg-muted/50 block rounded-t-lg">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl">
                              <Megaphone className="h-5 w-5 text-accent" />
                              Pengumuman Terbaru
                          </CardTitle>
                           <div className="flex justify-between items-center">
                              <CardDescription>Informasi penting dari pengurus.</CardDescription>
                               <div className="text-xs text-primary font-semibold flex items-center">
                                  Lihat Semua
                                  <ArrowRight className="ml-1 h-3 w-3" />
                              </div>
                          </div>
                      </CardHeader>
                    </Link>
                    <CardContent>
                        {announcements.length > 0 ? (
                            <div className="space-y-4">
                                {announcements.slice(0, 3).map((ann) => (
                                    <div key={ann.id} className="p-4 rounded-lg border bg-muted/30">
                                        <h3 className="font-semibold">{ann.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 truncate">{ann.content}</p>
                                        <p className="text-xs text-muted-foreground/80 mt-2">{ann.date || 'Tanggal tidak tersedia'}</p>
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
    );
}
