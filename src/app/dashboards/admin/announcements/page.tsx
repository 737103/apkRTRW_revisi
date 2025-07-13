
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, Megaphone, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Judul harus diisi (minimal 5 karakter)." }),
  content: z.string().min(10, { message: "Konten pengumuman harus diisi (minimal 10 karakter)." }),
  date: z.string().optional(),
});

type Announcement = z.infer<typeof announcementSchema> & { id: string, date: string };

export default function ManageAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      if (storedAnnouncements) {
        setAnnouncements(JSON.parse(storedAnnouncements));
      }
    } catch (error) {
      console.error("Failed to load announcements from localStorage", error);
      toast({
        title: "Gagal Memuat Data",
        description: "Tidak dapat memuat daftar pengumuman.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingAnnouncement(null);
      form.reset();
    }
    setIsDialogOpen(open);
  }

  const handleEditClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    form.reset(announcement);
    setIsDialogOpen(true);
  };
  
  const handleAddNewClick = () => {
    setEditingAnnouncement(null);
    form.reset({ title: "", content: "" });
    setIsDialogOpen(true);
  }

  const onSubmit = (values: z.infer<typeof announcementSchema>) => {
    try {
      let updatedAnnouncements;
      const announcementDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      
      if (editingAnnouncement) {
        // Keep original date when editing, unless it's missing
        updatedAnnouncements = announcements.map(a => 
          a.id === editingAnnouncement.id 
            ? { ...editingAnnouncement, ...values, date: a.date || announcementDate } 
            : a
        );
         toast({
          title: "Pengumuman Diperbarui",
          description: `Pengumuman "${values.title}" berhasil diperbarui.`,
        });
      } else {
        const newAnnouncement: Announcement = { 
            ...values, 
            id: `announcement-${new Date().getTime()}`,
            date: announcementDate
        };
        updatedAnnouncements = [newAnnouncement, ...announcements];
        toast({
            title: "Pengumuman Diterbitkan",
            description: `Pengumuman "${newAnnouncement.title}" berhasil diterbitkan.`,
        });
      }
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updatedAnnouncements));
      handleDialogOpenChange(false);
    } catch (error) {
      console.error("Failed to save announcement", error);
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data pengumuman.",
        variant: "destructive",
      });
    }
  };

  const deleteAnnouncement = (announcementId: string) => {
     try {
        const updatedAnnouncements = announcements.filter(ann => ann.id !== announcementId);
        setAnnouncements(updatedAnnouncements);
        localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updatedAnnouncements));
        toast({
            title: "Pengumuman Dihapus",
            description: "Pengumuman telah berhasil dihapus.",
            variant: "default",
        });
    } catch (error) {
        console.error("Failed to delete announcement", error);
        toast({
            title: "Gagal Menghapus",
            description: "Terjadi kesalahan saat menghapus pengumuman.",
            variant: "destructive",
        });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Kelola Pengumuman</h1>
          <p className="text-lg text-muted-foreground">Buat, edit, dan hapus pengumuman untuk pengguna.</p>
        </div>
         <Button onClick={handleAddNewClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Pengumuman
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</DialogTitle>
              <DialogDescription>
                 {editingAnnouncement ? 'Ubah detail pengumuman di bawah ini.' : 'Isi detail untuk membuat pengumuman baru.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Kerja Bakti Lingkungan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Isi Pengumuman</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tulis isi pengumuman di sini..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>Batal</Button>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Megaphone />
            Daftar Pengumuman
          </CardTitle>
          <CardDescription>Berikut adalah daftar semua pengumuman yang telah diterbitkan.</CardDescription>
        </CardHeader>
        <CardContent>
          {announcements.length > 0 ? (
            <div className="space-y-4">
                {announcements.map((ann) => (
                    <Card key={ann.id} className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span>{ann.title}</span>
                                <div className="flex space-x-2">
                                     <Button variant="ghost" size="icon" onClick={() => handleEditClick(ann)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Hapus</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tindakan ini tidak dapat diurungkan. Ini akan menghapus pengumuman secara permanen.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteAnnouncement(ann.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardTitle>
                            <CardDescription>{ann.date || 'Tanggal tidak tersedia'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{ann.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Belum ada pengumuman yang diterbitkan.</p>
               <Button variant="link" className="mt-2" onClick={handleAddNewClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Buat Pengumuman Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
