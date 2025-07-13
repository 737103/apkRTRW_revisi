'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ShieldCheck } from "lucide-react";

const ADMIN_CREDS_STORAGE_KEY = 'rt-rw-admin-credentials';

const formSchema = z.object({
  currentUsername: z.string().min(1, "Username saat ini harus diisi."),
  newUsername: z.string().min(3, "Username baru harus memiliki setidaknya 3 karakter."),
  currentPassword: z.string().min(1, "Password saat ini harus diisi."),
  newPassword: z.string().min(6, "Password baru harus memiliki setidaknya 6 karakter."),
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Password baru tidak cocok.",
  path: ["confirmNewPassword"],
});

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [adminCreds, setAdminCreds] = useState({ username: 'admin', password: '123456' });

  useEffect(() => {
    try {
      const storedCreds = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
      if (storedCreds) {
        setAdminCreds(JSON.parse(storedCreds));
      }
    } catch (error) {
      console.error("Failed to parse admin credentials from localStorage", error);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentUsername: "",
      newUsername: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.currentUsername !== adminCreds.username || values.currentPassword !== adminCreds.password) {
      toast({
        title: "Gagal Memperbarui",
        description: "Username atau password saat ini salah.",
        variant: "destructive",
      });
      return;
    }

    const newCreds = {
      username: values.newUsername,
      password: values.newPassword,
    };

    try {
      localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(newCreds));
      setAdminCreds(newCreds);
      toast({
        title: "Berhasil Diperbarui!",
        description: "Kredensial admin Anda telah berhasil diperbarui.",
      });
      form.reset();
    } catch (error) {
       console.error("Failed to save admin credentials to localStorage", error);
       toast({
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan saat menyimpan kredensial baru Anda.",
          variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Settings className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Pengaturan Admin</h1>
            <p className="text-muted-foreground text-lg">Kelola kredensial login untuk akun admin.</p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ubah Username & Password Admin</CardTitle>
          <CardDescription>Gunakan formulir ini untuk mengubah detail login admin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                <FormField
                  control={form.control}
                  name="currentUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username Saat Ini</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan username saat ini" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="newUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username Baru</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan username baru" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Saat Ini</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password Baru</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit">
                <ShieldCheck className="mr-2 h-4 w-4"/>
                Perbarui Kredensial
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
