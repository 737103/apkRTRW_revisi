import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

const announcements = [
    { id: 1, title: "Upcoming National Day Celebration", date: "2023-10-15", content: "Join us for the flag hoisting ceremony and various community games. The event will start at 8 AM at the community hall." },
    { id: 2, title: "Waste Management Schedule Update", date: "2023-10-12", content: "Please be advised of the new waste collection schedule starting next week. Collection will be on Tuesdays and Fridays." },
    { id: 3, title: "Monthly Community Meeting", date: "2023-10-10", content: "The monthly meeting will be held on October 25th at 7 PM. Agenda includes budget review and upcoming event planning." },
    { id: 4, title: "Security Patrol Volunteers Needed", date: "2023-10-08", content: "We are looking for volunteers to join the neighborhood security patrol. Please contact Mr. Smith for more information." },
];

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg"><Megaphone className="h-8 w-8 text-primary"/></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground text-lg">Stay updated with the latest news and events.</p>
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
