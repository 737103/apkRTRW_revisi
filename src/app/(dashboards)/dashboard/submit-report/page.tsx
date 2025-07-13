'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Camera, MapPin, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REPORTS_STORAGE_KEY = 'rt-rw-reports';
const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';

const formSchema = z.object({
    namaLengkap: z.string().min(3, "Nama lengkap harus diisi."),
    jabatan: z.string({ required_error: "Jabatan harus dipilih." }),
    jenisKegiatan: z.string({ required_error: "Jenis kegiatan harus dipilih." }),
    rt: z.string().min(1, "RT harus diisi."),
    rw: z.string().min(1, "RW harus diisi."),
    jamDatang: z.string().min(1, "Jam datang harus diisi."),
    jamPulang: z.string().min(1, "Jam pulang harus diisi."),
    deskripsiKegiatan: z.string().min(20, {
        message: "Deskripsi kegiatan harus memiliki setidaknya 20 karakter.",
    }),
    alamatKegiatan: z.string().min(10, "Alamat kegiatan harus diisi."),
    lokasiKegiatan: z.string().min(1, "Lokasi kegiatan harus diaktifkan."),
    fotoKegiatan: z.any(),
});


export default function ReportSubmissionPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaLengkap: "",
            jabatan: undefined,
            jenisKegiatan: undefined,
            rt: "",
            rw: "",
            jamDatang: "",
            jamPulang: "",
            deskripsiKegiatan: "",
            alamatKegiatan: "",
            lokasiKegiatan: "Sedang mengambil lokasi...",
        },
    });

    useEffect(() => {
        // Get GPS Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationString = `${latitude}, ${longitude}`;
                    form.setValue('lokasiKegiatan', locationString);
                    setLocationError(null);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    let message = "Gagal mendapatkan lokasi. Pastikan GPS dan izin lokasi aktif.";
                    if (error.code === error.PERMISSION_DENIED) {
                        message = "Izin lokasi ditolak. Aktifkan di pengaturan browser Anda.";
                    }
                    setLocationError(message);
                    form.setValue('lokasiKegiatan', 'Gagal mendapatkan lokasi');
                    toast({
                        title: 'Gagal Mendapatkan Lokasi',
                        description: message,
                        variant: 'destructive',
                    });
                }
            );
        } else {
             const message = "Geolocation tidak didukung oleh browser ini.";
             setLocationError(message);
             form.setValue('lokasiKegiatan', 'Browser tidak mendukung GPS');
             toast({
                title: 'GPS Tidak Didukung',
                description: message,
                variant: 'destructive',
            });
        }

        try {
            const loggedInUserStr = localStorage.getItem(LOGGED_IN_USER_KEY);
            if (loggedInUserStr) {
                const loggedInUser = JSON.parse(loggedInUserStr);
                if (loggedInUser.fullName) {
                    form.setValue('namaLengkap', loggedInUser.fullName);
                }
                if (loggedInUser.position) {
                    form.setValue('jabatan', loggedInUser.position);
                }
                if (loggedInUser.rt) {
                    form.setValue('rt', loggedInUser.rt);
                }
                 if (loggedInUser.rw) {
                    form.setValue('rw', loggedInUser.rw);
                }
            }
             // Set current time for jamDatang
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;
            form.setValue('jamDatang', currentTime);
            form.setValue('jamPulang', currentTime);

        } catch (error) {
            console.error("Failed to get user from localStorage or set time", error);
        }
    }, [form, toast]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                form.setValue("fotoKegiatan", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
            const reports = storedReports ? JSON.parse(storedReports) : [];
            const newReport = {
                ...values,
                id: new Date().toISOString(), // Unique ID
                submissionDate: new Date().toLocaleDateString('id-ID'),
            };
            reports.push(newReport);
            localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));

            toast({
                title: "Laporan Berhasil Dikirim!",
                description: "Laporan kinerja Anda telah dikirim untuk ditinjau.",
                variant: "default",
            });
            form.reset();
            router.push('/dashboard');
        } catch(error) {
             console.error("Failed to save report to localStorage", error);
             toast({
                title: "Gagal Menyimpan Laporan",
                description: "Terjadi kesalahan saat menyimpan laporan Anda.",
                variant: "destructive",
            });
        }
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
                             <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="namaLengkap"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama RT/RW</FormLabel>
                                            <FormControl>
                                                <Input placeholder="cth., Budi Santoso" {...field} readOnly className="bg-muted/50"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jabatan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jabatan</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled>
                                                <FormControl>
                                                    <SelectTrigger className="bg-muted/50">
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
                                                <Input placeholder="cth., 01" {...field} readOnly className="bg-muted/50"/>
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
                                                <Input placeholder="cth., 05" {...field} readOnly className="bg-muted/50" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jamDatang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jam Datang</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} readOnly className="bg-muted/50"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jamPulang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jam Pulang</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} readOnly className="bg-muted/50"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                             <FormField
                                control={form.control}
                                name="jenisKegiatan"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenis Kegiatan</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <div className="relative">
                                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectTrigger className="pl-10">
                                                <SelectValue placeholder="Pilih jenis kegiatan" />
                                            </SelectTrigger>
                                        </div>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Rapat Koordinasi">Rapat Koordinasi</SelectItem>
                                        <SelectItem value="Gotong Royong">Gotong Royong</SelectItem>
                                        <SelectItem value="Kegiatan Sosial">Kegiatan Sosial</SelectItem>
                                        <SelectItem value="Keamanan Lingkungan">Keamanan Lingkungan</SelectItem>
                                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="deskripsiKegiatan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi Kegiatan</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Jelaskan kegiatan yang dilakukan..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="alamatKegiatan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat Kegiatan</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Masukkan alamat lengkap lokasi kegiatan..."
                                                className="min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="lokasiKegiatan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lokasi Kegiatan (GPS)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input {...field} readOnly className="bg-muted/50 pl-10" />
                                            </div>
                                        </FormControl>
                                        {locationError && <FormDescription className="text-destructive">{locationError}</FormDescription>}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fotoKegiatan"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Foto Kegiatan</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-4">
                                            <Input 
                                                id="foto-kegiatan" 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label 
                                                htmlFor="foto-kegiatan"
                                                className="cursor-pointer inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                                            >
                                                <Camera className="h-4 w-4"/>
                                                Pilih Foto
                                            </label>
                                        </div>
                                    </FormControl>
                                    {preview && (
                                        <div className="mt-4">
                                            <Image src={preview} alt="Pratinjau Foto Kegiatan" width={200} height={200} className="rounded-md object-cover" />
                                        </div>
                                    )}
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
