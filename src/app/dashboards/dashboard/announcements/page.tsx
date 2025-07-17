
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: any;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
        setIsLoading(true);
        try {
            const announcementsCollection = collection(db, "announcements");
            const q = query(announcementsCollection, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const announcementsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error("Failed to load announcements from Firestore", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50">
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Semua Pengumuman</h1>
            <p className="text-lg text-muted-foreground">Informasi penting dan terbaru dari pengurus untuk Anda.</p>
        </div>
        
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        ) : announcements.length > 0 ? (
            <div className="space-y-4">
                {announcements.map((ann) => (
                    <Card key={ann.id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <Megaphone className="h-6 w-6 text-accent mt-1 flex-shrink-0"/>
                                <div>
                                  <span>{ann.title}</span>
                                  <CardDescription className="mt-1">{ann.date || 'Tanggal tidak tersedia'}</CardDescription>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{ann.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="text-center py-20 text-muted-foreground bg-card rounded-lg shadow-md">
                <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4">Belum ada pengumuman saat ini.</p>
                <p className="text-sm">Silakan periksa kembali nanti.</p>
            </div>
        )}
    </div>
  );
}
