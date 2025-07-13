'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trash2, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const formSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap harus diisi."),
  position: z.string({ required_error: "Jabatan harus dipilih." }),
  rt: z.string().optional(),
  rw: z.string().optional(),
  username: z.string().min(3, "Username harus memiliki setidaknya 3 karakter."),
  password: z.string().min(6, "Password harus memiliki setidaknya 6 karakter."),
});

type User = z.infer<typeof formSchema> & { id: number };

const USERS_STORAGE_KEY = 'rt-rw-users';

export default function ManageUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      position: undefined,
      rt: "",
      rw: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (editingUser) {
      form.reset(editingUser);
    } else {
      form.reset({
        fullName: "",
        position: undefined,
        rt: "",
        rw: "",
        username: "",
        password: "",
      });
    }
  }, [editingUser, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    let newUsers;
    if (editingUser) {
      newUsers = users.map(user => user.id === editingUser.id ? { ...user, ...values } : user);
      toast({
        title: "Pengguna Berhasil Diperbarui!",
        description: `Data untuk ${values.fullName} telah diperbarui.`,
      });
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      newUsers = [...users, { ...values, id: newId }];
      toast({
        title: "Pengguna Berhasil Ditambahkan!",
        description: `Data untuk ${values.fullName} telah disimpan.`,
      });
    }
    setUsers(newUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    setEditingUser(null);
    form.reset();
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingUser(null);
    form.reset();
  }

  function handleDelete(userId: number) {
    const newUsers = users.filter(user => user.id !== userId);
    setUsers(newUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    toast({
        title: "Pengguna Dihapus",
        description: "Data pengguna telah berhasil dihapus.",
        variant: "destructive"
    })
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
          <CardTitle>{editingUser ? 'Edit Pengguna' : 'Formulir Input Pengguna'}</CardTitle>
          <CardDescription>{editingUser ? 'Perbarui detail di bawah ini.' : 'Isi detail di bawah ini untuk menambahkan pengguna baru.'}</CardDescription>
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
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., johndoe" {...field} />
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
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingUser ? 'Perbarui Pengguna' : 'Simpan Pengguna'}</Button>
                {editingUser && (
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
          <CardTitle>Daftar Pengguna Terdaftar</CardTitle>
          <CardDescription>Berikut adalah daftar semua pengguna yang ada dalam sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>RT/RW</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>{user.position === 'Ketua RT' ? `RT ${user.rt}` : `RW ${user.rw}`}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Pengguna</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hapus Pengguna</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
