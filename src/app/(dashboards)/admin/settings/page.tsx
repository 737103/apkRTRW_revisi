import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Settings className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Pengaturan Admin</h1>
            <p className="text-muted-foreground text-lg">Halaman ini sedang dalam pengembangan.</p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Konfigurasi Sistem</CardTitle>
          <CardDescription>Kelola pengaturan aplikasi global.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Opsi pengaturan admin akan segera tersedia.</p>
        </CardContent>
      </Card>
    </div>
  );
}
