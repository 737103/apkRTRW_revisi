
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Upload, MapPin } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap harus diisi."),
  position: z.string().min(2, "Jabatan harus diisi."),
  rt: z.string().optional(),
  rw: z.string().optional(),
  clockIn: z.string().min(1, "Jam absen harus diisi."),
  clockOut: z.string().min(1, "Jam pulang harus diisi."),
  activityDescription: z.string().min(10, "Deskripsi kegiatan minimal 10 karakter."),
  photo: z.any().optional(),
  location: z.string().min(3, "Lokasi harus diisi."),
  activityAddress: z.string().min(10, "Alamat kegiatan minimal 10 karakter."),
});

export default function ManageUsersPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      position: "",
      rt: "",
      rw: "",
      clockIn: "",
      clockOut: "",
      activityDescription: "",
      location: "",
      activityAddress: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Pengguna Berhasil Ditambahkan!",
      description: "Data pengguna baru telah disimpan.",
    });
    form.reset();
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Users className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Kelola Pengguna</h1>
            <p className="text-muted-foreground text-lg">Tambah dan kelola data pengguna sistem.</p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Formulir Input Pengguna</CardTitle>
          <CardDescription>Isi detail di bawah ini untuk menambahkan pengguna baru.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Ketua RT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="rt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RT</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., 01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="rw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RW</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., 05" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clockIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jam Absen</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clockOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jam Pulang</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="activityDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Kegiatan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Jelaskan kegiatan yang dilakukan..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Upload Foto Kegiatan</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                                <label className="flex-grow cursor-pointer flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground">
                                    <Upload className="h-4 w-4" />
                                    <span>Pilih File</span>
                                    <Input 
                                      type="file" 
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => field.onChange(e.target.files)}
                                    />
                                </label>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4"/>Lokasi</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Balai Warga" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="activityAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Kegiatan</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Jl. Merdeka No. 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Simpan Pengguna</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
