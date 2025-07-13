'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Megaphone, Trash2, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const formSchema = z.object({
  title: z.string().min(5, "Judul harus diisi."),
  content: z.string().min(10, "Konten harus memiliki setidaknya 10 karakter."),
});

type Announcement = z.infer<typeof formSchema> & { id: string, date: string };

const ANNOUNCEMENTS_STORAGE_KEY = 'rt-rw-announcements';

export default function ManageAnnouncementsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (editingAnnouncement) {
      form.reset(editingAnnouncement);
    } else {
      form.reset({
        title: "",
        content: "",
      });
    }
  }, [editingAnnouncement, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    let newAnnouncements;
    if (editingAnnouncement) {
      newAnnouncements = announcements.map(ann => ann.id === editingAnnouncement.id ? { ...ann, ...values } : ann);
      toast({
        title: "Pengumuman Berhasil Diperbarui!",
        description: `Pengumuman "${values.title}" telah diperbarui.`,
      });
    } else {
      const newAnnouncement = { 
        ...values, 
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      newAnnouncements = [newAnnouncement, ...announcements];
      toast({
        title: "Pengumuman Berhasil Dibuat!",
        description: `Pengumuman "${values.title}" telah dipublikasikan.`,
      });
    }
    setAnnouncements(newAnnouncements);
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(newAnnouncements));
    setEditingAnnouncement(null);
    form.reset();
  }

  function handleEdit(announcement: Announcement) {
    setEditingAnnouncement(announcement);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingAnnouncement(null);
    form.reset();
  }

  function handleDelete(announcementId: string) {
    const newAnnouncements = announcements.filter(ann => ann.id !== announcementId);
    setAnnouncements(newAnnouncements);
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(newAnnouncements));
    toast({
        title: "Pengumuman Dihapus",
        description: "Pengumuman telah berhasil dihapus.",
        variant: "destructive"
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Megaphone className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Kelola Pengumuman</h1>
            <p className="text-muted-foreground text-lg">Buat, edit, dan hapus pengumuman untuk pengguna.</p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</CardTitle>
          <CardDescription>{editingAnnouncement ? 'Perbarui detail di bawah ini.' : 'Isi detail di bawah ini untuk mempublikasikan pengumuman.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Perayaan Hari Kemerdekaan" {...field} />
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
                        <Textarea placeholder="Tulis isi pengumuman di sini..." {...field} className="min-h-[120px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="flex gap-2">
                <Button type="submit">{editingAnnouncement ? 'Perbarui' : 'Publikasikan'}</Button>
                {editingAnnouncement && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pengumuman</CardTitle>
          <CardDescription>Berikut adalah daftar pengumuman yang telah dipublikasikan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Belum ada pengumuman.</p>
          ) : (
            announcements.map((ann) => (
                <Card key={ann.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl">{ann.title}</CardTitle>
                        <CardDescription>{ann.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-foreground/80">{ann.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-muted/50 py-3 px-6 border-t">
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(ann)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Edit Pengumuman</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(ann.id)} className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Hapus</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Hapus Pengumuman</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardFooter>
                </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
