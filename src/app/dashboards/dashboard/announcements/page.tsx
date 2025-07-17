'use client';

import { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
      // Sort by timestamp in descending order (latest first)
      setAnnouncements(loadedAnnouncements.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    }, (error) => {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    });

    // Cleanup function to detach the listener when the component unmounts
    return () => {
      off(announcementsRef, 'value', unsubscribe);
    };
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading announcements...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      {announcements.length === 0 ? (
        <p>No announcements available yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(announcement.timestamp).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <p>{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
