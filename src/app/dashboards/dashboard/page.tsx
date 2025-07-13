'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Megaphone } from "lucide-react";

const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';
const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';

export default function UserDashboardPage() {
    const [userName, setUserName] = useState('');
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        try {
            const loggedInUserStr = localStorage.getItem(LOGGED_IN_USER_KEY);
            if (loggedInUserStr) {
                const loggedInUser = JSON.parse(loggedInUserStr);
                setUserName(loggedInUser.fullName || 'Pengguna');
            }

            const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
            if (storedAnnouncements) {
                setAnnouncements(JSON.parse(storedAnnouncements).reverse());
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
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Megaphone className="h-5 w-5 text-accent" />
                            Pengumuman Terbaru
                        </CardTitle>
                        <CardDescription>Informasi penting dari pengurus.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {announcements.length > 0 ? (
                            <ul className="space-y-4">
                                {announcements.slice(0, 3).map((ann: any) => (
                                    <li key={ann.id} className="p-4 rounded-md bg-muted/50">
                                        <h3 className="font-semibold">{ann.title}</h3>
                                        <p className="text-sm text-muted-foreground">{ann.content}</p>
                                        <p className="text-xs text-muted-foreground mt-2">{ann.date}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">Belum ada pengumuman.</p>
                        )}
                         <Button asChild variant="link" className="px-0 mt-2">
                            <Link href="/dashboards/dashboard/announcements">Lihat Semua Pengumuman</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
