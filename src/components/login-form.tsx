'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building, LogIn, Shield, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";

const USERS_STORAGE_KEY = 'rt-rw-users';
const ADMIN_CREDS_STORAGE_KEY = 'rt-rw-admin-credentials';
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
  
  const [adminCreds, setAdminCreds] = useState({ username: 'admin', password: '123456' });

  useEffect(() => {
    try {
      // Pre-populate admin credentials for demo purposes
      if (!localStorage.getItem(ADMIN_CREDS_STORAGE_KEY)) {
        localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify({ username: 'admin', password: '123456' }));
      }
      
      const storedCreds = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
      if (storedCreds) {
          setAdminCreds(JSON.parse(storedCreds));
      }

      // Pre-populate a demo user if none exist
      if (!localStorage.getItem(USERS_STORAGE_KEY)) {
        const demoUser = {
          id: 'user-01',
          username: 'user',
          password: '123',
          fullName: 'Budi Santoso',
          position: 'Ketua RT',
          rt: '001',
          rw: '005'
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([demoUser]));
      }

    } catch (error) {
      console.error("Failed to initialize credentials from localStorage", error);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (role === 'admin') {
            if (adminUsername === adminCreds.username && adminPassword === adminCreds.password) {
                // Clear any logged in user session
                localStorage.removeItem(LOGGED_IN_USER_KEY);
                router.push('/dashboards/admin/dashboard');
            } else {
                toast({
                    title: "Login Gagal",
                    description: "Username atau password admin salah.",
                    variant: "destructive",
                })
            }
        } else {
            const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
            if (storedUsers) {
                const users = JSON.parse(storedUsers);
                const foundUser = users.find((user: any) => user.username === userUsername && user.password === userPassword);
                if (foundUser) {
                    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(foundUser));
                    router.push('/dashboards/dashboard');
                } else {
                    toast({
                        title: "Login Gagal",
                        description: "Username atau password pengguna salah.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Login Gagal",
                    description: "Tidak ada pengguna terdaftar. Silakan hubungi admin.",
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
          <CardDescription>Silahkan login</CardDescription>
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
