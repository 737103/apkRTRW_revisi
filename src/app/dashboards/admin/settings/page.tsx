
'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound, User, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ADMIN_CREDS_STORAGE_KEY = 'rt-rw-admin-credentials';

const settingsSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine(data => {
  // Jika password diisi, maka konfirmasi password juga harus diisi dan harus cocok
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  // Jika password tidak diisi, tidak ada yang perlu divalidasi
  return true;
}, {
  message: "Password tidak cocok. Silakan periksa kembali.",
  path: ["confirmPassword"],
});


type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    try {
      const storedCreds = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
      if (storedCreds) {
        const creds = JSON.parse(storedCreds);
        form.reset({ username: creds.username });
      }
    } catch (error) {
      console.error("Failed to load admin credentials", error);
       toast({
        title: "Gagal Memuat Data",
        description: "Tidak dapat memuat kredensial admin.",
        variant: "destructive",
      });
    }
  }, [form, toast]);

  const onSubmit = (values: SettingsFormValues) => {
    try {
       const storedCreds = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
       const currentCreds = storedCreds ? JSON.parse(storedCreds) : {};
       
       const newCreds = {
           username: values.username,
           // Hanya update password jika diisi
           password: values.password ? values.password : currentCreds.password
       }

       localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(newCreds));

       toast({
           title: "Pengaturan Disimpan",
           description: "Username dan password admin berhasil diperbarui.",
       });

       // Reset form, terutama field password
       form.reset({
           ...form.getValues(),
           password: "",
           confirmPassword: "",
       });

    } catch (error) {
       console.error("Failed to save admin credentials", error);
       toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <div>
        <h1 className="text-4xl font-bold tracking-tight">Pengaturan Akun Admin</h1>
        <p className="text-lg text-muted-foreground">Ubah username dan password untuk login sebagai admin.</p>
      </div>
      <Card className="max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Ubah Kredensial</CardTitle>
          <CardDescription>Kosongkan field password jika tidak ingin mengubahnya.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username Admin</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="admin_baru" {...field} className="pl-10"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} className="pl-10"/>
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password Baru</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} className="pl-10"/>
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4"/>
                    Simpan Perubahan
                </Button>
              </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
