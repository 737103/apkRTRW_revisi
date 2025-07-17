
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building, LogIn, Shield, User } from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";

const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState('user');

  // Admin states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // User states
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    // This function seeds the database with initial data if it's empty
    const seedInitialData = async () => {
        try {
            // Seed Admin Credentials
            const adminCredsDocRef = doc(db, "config", "admin_credentials");
            const adminSnap = await getDoc(adminCredsDocRef);
            if (!adminSnap.exists()) {
                await setDoc(adminCredsDocRef, { username: 'admin', password: '123' });
            }

            // Seed Demo User
            const usersCollection = collection(db, "users");
            const userQuery = query(usersCollection, where("username", "==", "user"));
            const userSnap = await getDocs(userQuery);
            if (userSnap.empty) {
                const demoUser = {
                    username: 'user',
                    password: '123',
                    fullName: 'Budi Santoso',
                    position: 'Ketua RT',
                    rt: '001',
                    rw: '005'
                };
                // Firestore will auto-generate an ID
                await addDoc(usersCollection, demoUser);
            }
        } catch (error) {
            console.error("Failed to seed initial data:", error);
            toast({
                title: "Inisialisasi Gagal",
                description: "Gagal menyiapkan data awal aplikasi. Periksa koneksi dan aturan Firestore.",
                variant: "destructive",
            });
        }
    };
    seedInitialData();
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (role === 'admin') {
            const adminCredsDoc = doc(db, "config", "admin_credentials");
            const adminSnap = await getDoc(adminCredsDoc);
            const creds = adminSnap.data();
            if (creds && adminUsername === creds.username && adminPassword === creds.password) {
                localStorage.removeItem(LOGGED_IN_USER_KEY);
                localStorage.setItem('rt-rw-role', 'admin');
                router.push('/dashboards/admin/dashboard');
            } else {
                toast({
                    title: "Login Gagal",
                    description: "Username atau password admin salah.",
                    variant: "destructive",
                })
            }
        } else {
            const usersCollection = collection(db, "users");
            const q = query(
                usersCollection, 
                where("username", "==", userUsername), 
                where("password", "==", userPassword)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const foundUser = { id: userDoc.id, ...userDoc.data() };
                localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(foundUser));
                localStorage.setItem('rt-rw-role', 'user');
                router.push('/dashboards/dashboard');
            } else {
                toast({
                    title: "Login Gagal",
                    description: "Username atau password pengguna salah.",
                    variant: "destructive",
                });
            }
        }
    } catch (error) {
        console.error("Login failed:", error);
        toast({
            title: "Terjadi Kesalahan",
            description: "Gagal melakukan login. Silakan coba lagi.",
            variant: "destructive",
        });
    }
  };

  const renderForm = (currentRole: string) => {
    const isUser = currentRole === 'user';
    
    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`${currentRole}-username`}>Username</Label>
                <Input 
                    id={`${currentRole}-username`} 
                    type="text" 
                    placeholder="Masukkan username Anda" 
                    required 
                    value={isUser ? userUsername : adminUsername}
                    onChange={(e) => isUser ? setUserUsername(e.target.value) : setAdminUsername(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${currentRole}-password`}>Password</Label>
                <Input 
                    id={`${currentRole}-password`} 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={isUser ? userPassword : adminPassword}
                    onChange={(e) => isUser ? setUserPassword(e.target.value) : setAdminPassword(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Masuk sebagai {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
            </Button>
        </form>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-2">
              <Building className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Aplikasi Kinerja RT RW</CardTitle>
          <CardDescription>Kelurahan Bara Baraya Selatan</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user" onValueChange={setRole} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user"><User className="mr-2 h-4 w-4"/> User</TabsTrigger>
              <TabsTrigger value="admin"><Shield className="mr-2 h-4 w-4"/> Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            {renderForm('user')}
          </TabsContent>
          <TabsContent value="admin">
            {renderForm('admin')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
