
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
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
      console.error("Failed to load announcements from localStorage", error);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50">
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Semua Pengumuman</h1>
            <p className="text-lg text-muted-foreground">Informasi penting dan terbaru dari pengurus untuk Anda.</p>
        </div>
        
        {announcements.length > 0 ? (
            <div className="space-y-4">
                {announcements.map((ann) => (
                    <Card key={ann.id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <Megaphone className="h-6 w-6 text-accent mt-1 flex-shrink-0"/>
                                <div>
                                  <span>{ann.title}</span>
                                  <CardDescription className="mt-1">{ann.date}</CardDescription>
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
