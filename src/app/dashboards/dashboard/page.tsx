
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Megaphone, ArrowRight } from "lucide-react";

const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';

interface Announcement {
    id: string;
    title: string;
    date: string;
    content: string;
}

export default function UserDashboardPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        try {
            const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
            if (storedAnnouncements) {
                // Get only the 2 latest announcements
                setAnnouncements(JSON.parse(storedAnnouncements).slice(0, 2));
            }
        } catch (error) {
            console.error("Failed to parse announcements from localStorage", error);
        }
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Selamat Datang, Pengguna!</h1>
                <p className="text-muted-foreground text-lg">Berikut adalah kinerja dan pembaruan komunitas Anda.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-lg"><FileText className="h-6 w-6 text-primary"/></div>
                            <CardTitle className="text-2xl">Laporan Anda</CardTitle>
                        </div>
                        <CardDescription>Kirim laporan kinerja Anda dan lacak statusnya.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Anda tidak memiliki laporan yang tertunda.</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/submit-report">
                                Kirim Laporan Baru <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-lg"><Megaphone className="h-6 w-6 text-primary"/></div>
                            <CardTitle className="text-2xl">Pengumuman</CardTitle>
                        </div>
                        <CardDescription>Pembaruan terkini dari pimpinan komunitas.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        {announcements.length > 0 ? (
                            announcements.map(ann => (
                                <div key={ann.id} className="p-4 rounded-lg border bg-muted/50">
                                    <h3 className="font-semibold truncate">{ann.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-2">{ann.date}</p>
                                    <p className="text-sm text-foreground/80 line-clamp-2">{ann.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">Tidak ada pengumuman baru.</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/announcements">
                                Lihat Semua Pengumuman <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
