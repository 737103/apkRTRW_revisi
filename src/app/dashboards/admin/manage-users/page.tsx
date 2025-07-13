'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, UserPlus, Users, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";


const USERS_STORAGE_KEY = 'rt-rw-users';

const userSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(3, { message: "Nama lengkap harus diisi." }),
  username: z.string().min(3, { message: "Username harus diisi." }),
  password: z.string().min(3, { message: "Password minimal 3 karakter." }),
  position: z.string({ required_error: "Jabatan harus dipilih." }),
  rt: z.string().min(1, { message: "RT harus diisi." }),
  rw: z.string().min(1, { message: "RW harus diisi." }),
});

type User = z.infer<typeof userSchema> & { id: string };

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
      toast({
        title: "Gagal Memuat Data",
        description: "Tidak dapat memuat daftar pengguna.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      position: undefined,
      rt: "",
      rw: "",
    },
  });
  
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingUser(null);
      form.reset();
    }
    setIsDialogOpen(open);
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    form.reset(user);
    setIsDialogOpen(true);
  };
  
  const handleAddNewClick = () => {
    setEditingUser(null);
    form.reset({
      fullName: "",
      username: "",
      password: "",
      position: undefined,
      rt: "",
      rw: "",
    });
    setIsDialogOpen(true);
  }

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    try {
      let updatedUsers;
      if (editingUser) {
        updatedUsers = users.map(u => u.id === editingUser.id ? { ...u, ...values } : u);
         toast({
          title: "Pengguna Diperbarui",
          description: `Data untuk "${values.fullName}" berhasil diperbarui.`,
        });
      } else {
        const newUser: User = { ...values, id: `user-${new Date().getTime()}` };
        updatedUsers = [...users, newUser];
        toast({
            title: "Pengguna Ditambahkan",
            description: `Pengguna "${newUser.fullName}" berhasil dibuat.`,
        });
      }
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      handleDialogOpenChange(false);
    } catch (error) {
      console.error("Failed to save user", error);
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data pengguna.",
        variant: "destructive",
      });
    }
  };

  const deleteUser = (userId: string) => {
     try {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        toast({
            title: "Pengguna Dihapus",
            description: "Pengguna telah berhasil dihapus.",
            variant: "default",
        });
    } catch (error) {
        console.error("Failed to delete user", error);
        toast({
            title: "Gagal Menghapus",
            description: "Terjadi kesalahan saat menghapus pengguna.",
            variant: "destructive",
        });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Kelola Pengguna</h1>
          <p className="text-lg text-muted-foreground">Tambah, lihat, edit, dan hapus data pengguna sistem.</p>
        </div>
         <Button onClick={handleAddNewClick}>
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Pengguna
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
              <DialogDescription>
                 {editingUser ? 'Ubah detail pengguna di bawah ini.' : 'Isi detail pengguna untuk membuat akun baru.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Agus Setiawan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., agus.s" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={editingUser ? "(Kosongkan jika tidak diubah)" : "••••••••"} {...field} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jabatan" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Ketua RT">Ketua RT</SelectItem>
                                    <SelectItem value="Ketua RW">Ketua RW</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="rt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>RT</FormLabel>
                                <FormControl>
                                    <Input placeholder="001" {...field} />
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
                                    <Input placeholder="005" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
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
            <Users />
            Daftar Pengguna
          </CardTitle>
          <CardDescription>Berikut adalah daftar semua pengguna yang terdaftar di sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>RT/RW</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>{`RT ${user.rt} / RW ${user.rw}`}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                               <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Pengguna</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

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
                                    Tindakan ini tidak dapat diurungkan. Ini akan menghapus pengguna secara permanen.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Belum ada pengguna terdaftar.</p>
              <Button variant="link" className="mt-2" onClick={handleAddNewClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pengguna Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
