'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Judul harus memiliki setidaknya 5 karakter.",
    }),
    period: z.string().min(2, {
        message: "Periode harus memiliki setidaknya 2 karakter.",
    }),
    description: z.string().min(20, {
        message: "Deskripsi harus memiliki setidaknya 20 karakter.",
    }),
});

export default function ReportSubmissionPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            period: "",
            description: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast({
            title: "Laporan Berhasil Dikirim!",
            description: "Laporan kinerja Anda telah dikirim untuk ditinjau.",
            variant: "default",
        });
        form.reset();
        router.push('/dashboard');
    }

    return (
        <div className="animate-in fade-in-50">
            <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary"/>
                      <CardTitle className="text-2xl">Kirim Laporan Kinerja</CardTitle>
                    </div>
                    <CardDescription>Isi formulir di bawah ini untuk mengirimkan laporan Anda. Harap berikan detail selengkap mungkin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Laporan</FormLabel>
                                        <FormControl>
                                            <Input placeholder="cth., Laporan Keamanan Bulanan" {...field} />
                                        </FormControl>
                                        <FormDescription>Judul yang singkat dan jelas untuk laporan Anda.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="period"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Periode Pelaporan</FormLabel>
                                        <FormControl>
                                            <Input placeholder="cth., Oktober 2023" {...field} />
                                        </FormControl>
                                        <FormDescription>Bulan atau kuartal yang dicakup oleh laporan ini.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi Rinci</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Jelaskan kegiatan, pencapaian, dan tantangan selama periode ini..."
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Berikan deskripsi lengkap tentang kinerja dan kegiatan Anda.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Kirim Laporan</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
