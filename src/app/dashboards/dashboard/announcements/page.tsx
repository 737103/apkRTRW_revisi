
'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';

interface Announcement {
    id: string;
    title: string;
    date: string;
    content: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    try {
        const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
        if (storedAnnouncements) {
            setAnnouncements(JSON.parse(storedAnnouncements));
        }
    } catch (error) {
        console.error("Failed to parse announcements from localStorage", error);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Megaphone className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Pengumuman</h1>
            <p className="text-muted-foreground text-lg">Tetap terinformasi dengan berita dan acara terbaru.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {announcements.length === 0 ? (
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">Belum ada pengumuman saat ini.</p>
                </CardContent>
            </Card>
        ) : (
            announcements.map(ann => (
                <Card key={ann.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl">{ann.title}</CardTitle>
                        <CardDescription>{ann.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/80">{ann.content}</p>
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  );
}
