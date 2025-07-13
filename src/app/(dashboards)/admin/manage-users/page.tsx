import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ManageUsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Users className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Kelola Pengguna</h1>
            <p className="text-muted-foreground text-lg">Halaman ini sedang dalam pengembangan.</p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>Menampilkan daftar pengguna RT/RW.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fungsionalitas pengelolaan pengguna akan segera tersedia.</p>
        </CardContent>
      </Card>
    </div>
  );
}
