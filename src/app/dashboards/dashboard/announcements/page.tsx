'use client';

import { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const announcementsRef = ref(rtdb, 'announcements');

    const unsubscribe = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAnnouncements: Announcement[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          loadedAnnouncements.push({
            id: key,
            ...data[key],
          });
        });
      }
      setAnnouncements(loadedAnnouncements.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    }, (error) => {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    });

    return () => {
      off(announcementsRef, 'value', unsubscribe);
    };
  }, []);

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
      <div>
          <h1 className="text-4xl font-bold tracking-tight">Semua Pengumuman</h1>
          <p className="text-lg text-muted-foreground">Arsip lengkap semua pengumuman yang pernah diterbitkan.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
            <Megaphone className="mx-auto h-12 w-12" />
            <p className="mt-4 text-lg">Belum ada pengumuman yang tersedia.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>
                  Diterbitkan pada: {formatDate(announcement.timestamp)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
