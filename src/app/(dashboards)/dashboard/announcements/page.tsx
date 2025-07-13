import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

const announcements = [
    { id: 1, title: "Perayaan Hari Kemerdekaan", date: "2023-10-15", content: "Ayo ikuti upacara bendera dan berbagai perlombaan masyarakat. Acara akan dimulai pukul 8 pagi di balai warga." },
    { id: 2, title: "Pembaruan Jadwal Pengelolaan Sampah", date: "2023-10-12", content: "Harap diperhatikan jadwal pengambilan sampah baru mulai minggu depan. Pengambilan akan dilakukan pada hari Selasa dan Jumat." },
    { id: 3, title: "Rapat Bulanan Warga", date: "2023-10-10", content: "Rapat bulanan akan diadakan pada tanggal 25 Oktober pukul 7 malam. Agenda meliputi tinjauan anggaran dan perencanaan acara mendatang." },
    { id: 4, title: "Dibutuhkan Relawan Siskamling", date: "2023-10-08", content: "Kami mencari relawan untuk bergabung dalam patroli keamanan lingkungan. Silakan hubungi Bapak Smith untuk informasi lebih lanjut." },
];

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Megaphone className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Pengumuman</h1>
            <p className="text-muted-foreground text-lg">Tetap terinformasi dengan berita dan acara terbaru.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {announcements.map(ann => (
            <Card key={ann.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl">{ann.title}</CardTitle>
                    <CardDescription>{ann.date}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80">{ann.content}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
