'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, LogIn, Shield, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState('user');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const renderForm = (role: string) => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input id={`${role}-email`} type="email" placeholder="email@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input id={`${role}-password`} type="password" placeholder="••••••••" required />
      </div>
      <Button type="submit" className="w-full">
        <LogIn className="mr-2 h-4 w-4" />
        Login as {role.charAt(0).toUpperCase() + role.slice(1)}
      </Button>
    </form>
  )

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-2">
              <Building className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">RT RW Performance Tracker</CardTitle>
          <CardDescription>Login to access your dashboard</CardDescription>
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
