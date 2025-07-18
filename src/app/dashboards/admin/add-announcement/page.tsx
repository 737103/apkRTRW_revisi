'use client';

import { useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, push } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AddAnnouncementPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !content) {
        toast({
            title: 'Error',
            description: 'Judul dan konten tidak boleh kosong.',
            variant: 'destructive',
        });
        setLoading(false);
        return;
    }

    try {
      await push(ref(rtdb, 'announcements'), {
        title,
        content,
        timestamp: Date.now(),
      });
      setTitle('');
      setContent('');
      toast({
        title: 'Sukses',
        description: 'Pengumuman berhasil ditambahkan.',
      });
    } catch (error) {
      console.error('Error adding announcement:', error);
      toast({
        title: 'Error',
        description: 'Gagal menambahkan pengumuman. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Pengumuman Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            placeholder="cth., Rapat Warga Bulanan"
          />
        </div>
        <div>
          <Label htmlFor="content">Konten</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
            placeholder="Tulis detail pengumuman di sini..."
            className="min-h-[150px]"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menambahkan...' : 'Tambah Pengumuman'}
        </Button>
      </form>
    </div>
  );
}
