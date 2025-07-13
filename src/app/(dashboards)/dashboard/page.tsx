import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Megaphone, ArrowRight } from "lucide-react";

const announcements = [
    { id: 1, title: "Upcoming National Day Celebration", date: "2023-10-15", content: "Join us for the flag hoisting ceremony and various community games..." },
    { id: 2, title: "Waste Management Schedule Update", date: "2023-10-12", content: "Please be advised of the new waste collection schedule starting next week..." },
];

export default function UserDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50">
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome, User!</h1>
            <p className="text-muted-foreground text-lg">Here's your performance and community update.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg"><FileText className="h-6 w-6 text-primary"/></div>
                        <CardTitle className="text-2xl">Your Reports</CardTitle>
                    </div>
                    <CardDescription>Submit your performance reports and track their status.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                   <p className="text-sm text-muted-foreground">You have no pending reports.</p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/dashboard/submit-report">
                            Submit New Report <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                     <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg"><Megaphone className="h-6 w-6 text-primary"/></div>
                        <CardTitle className="text-2xl">Announcements</CardTitle>
                    </div>
                    <CardDescription>Latest updates from the community leadership.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {announcements.map(ann => (
                        <div key={ann.id} className="p-4 rounded-lg border bg-muted/50">
                            <h3 className="font-semibold">{ann.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{ann.date}</p>
                            <p className="text-sm text-foreground/80">{ann.content}</p>
                        </div>
                    ))}
                </CardContent>
                 <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/dashboard/announcements">
                            View All Announcements <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
