
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';

const formSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    namaLengkap: z.string().min(3, "Nama lengkap harus diisi."),
    jabatan: z.string().min(1, "Jabatan harus diisi."),
    jenisKegiatan: z.string({ required_error: "Jenis kegiatan harus dipilih." }),
    deskripsiLainnya: z.string().optional(),
    rt: z.string().min(1, "RT harus diisi."),
    rw: z.string().min(1, "RW harus diisi."),
    jamDatang: z.string().min(1, "Jam datang harus diisi."),
    jamPulang: z.string().optional(),
    deskripsiKegiatan: z.string().min(20, {
        message: "Deskripsi kegiatan harus memiliki setidaknya 20 karakter.",
    }),
    alamatKegiatan: z.string().min(10, "Alamat kegiatan harus diisi."),
    lokasiKegiatan: z.string().min(1, "Lokasi kegiatan harus diaktifkan.").refine(val => val !== 'Gagal mendapatkan lokasi', { message: "Lokasi GPS harus berhasil didapatkan."}),
    fotoKegiatan: z.any().refine(file => file, "Foto kegiatan harus diunggah."),
    submissionDate: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
}).refine(data => {
    if (data.jenisKegiatan === 'lainnya') {
        return !!data.deskripsiLainnya && data.deskripsiLainnya.length > 0;
    }
    return true;
}, {
    message: "Deskripsi kegiatan lainnya harus diisi jika memilih 'Lainnya'.",
    path: ["deskripsiLainnya"],
});


export default function ReportFormContent() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [preview, setPreview] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaLengkap: "",
            jabatan: "",
            jenisKegiatan: undefined,
            deskripsiLainnya: "",
            rt: "",
            rw: "",
            jamDatang: "",
            jamPulang: "",
            deskripsiKegiatan: "",
            alamatKegiatan: "",
            lokasiKegiatan: "Sedang mengambil lokasi...",
            fotoKegiatan: null,
        },
    });

    const jenisKegiatan = form.watch("jenisKegiatan");

    useEffect(() => {
        // Handle Edit Mode
        const setupEditMode = async () => {
            if(editId) {
                setIsEditMode(true);
                try {
                    const reportDocRef = doc(db, "reports", editId);
                    const reportSnap = await getDoc(reportDocRef);

                    if (reportSnap.exists()) {
                        const reportToEdit = reportSnap.data();
                        form.reset(reportToEdit);
                        if (reportToEdit.fotoKegiatan) {
                            setPreview(reportToEdit.fotoKegiatan);
                        }
                    } else {
                        toast({ title: "Laporan tidak ditemukan", variant: "destructive"});
                        router.push('/dashboards/dashboard/performance-data');
                    }
                } catch (error) {
                    console.error("Failed to load report for editing", error);
                    toast({ title: "Gagal memuat laporan untuk diedit", variant: "destructive"});
                }
            }
        };
        setupEditMode();
    }, [editId, form, router, toast]);

    useEffect(() => {
        // Get GPS Location only on new reports
        if (isEditMode) return;

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
                    form.trigger('lokasiKegiatan'); // Trigger validation
                    toast({
                        title: 'Gagal Mendapatkan Lokasi',
                        description: message,
                        variant: 'destructive',
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
             const message = "Geolocation tidak didukung oleh browser ini.";
             setLocationError(message);
             form.setValue('lokasiKegiatan', 'Browser tidak mendukung GPS');
             form.trigger('lokasiKegiatan'); // Trigger validation
             toast({
                title: 'GPS Tidak Didukung',
                description: message,
                variant: 'destructive',
            });
        }
    }, [form, toast, isEditMode]);


    useEffect(() => {
        // Populate user data only on new reports
        if(isEditMode) return;

        try {
            const loggedInUserStr = localStorage.getItem(LOGGED_IN_USER_KEY);
            if (loggedInUserStr) {
                const loggedInUser = JSON.parse(loggedInUserStr);
                form.setValue('userId', loggedInUser.id || "");
                form.setValue('namaLengkap', loggedInUser.fullName || "");
                form.setValue('jabatan', loggedInUser.position || "");
                form.setValue('rt', loggedInUser.rt || "");
                form.setValue('rw', loggedInUser.rw || "");
            }
        } catch (error) {
            console.error("Failed to get user from localStorage", error);
        }
    }, [form, isEditMode]);


    useEffect(() => {
        // Set arrival time only on new reports
        if(isEditMode) return;

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        form.setValue('jamDatang', currentTime);
    }, [form, isEditMode]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement("img");
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // Compress to 70% quality JPEG
                    setPreview(dataUrl);
                    form.setValue("fotoKegiatan", dataUrl);
                    form.trigger("fotoKegiatan"); // Trigger validation
                };
            };
            reader.readAsDataURL(file);
        }
    };


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditMode && values.id) {
                 const reportDocRef = doc(db, "reports", values.id);
                 const { id, jamDatang, jamPulang, submissionDate, ...updateData } = values;
                 await updateDoc(reportDocRef, { ...updateData, status: 'Tertunda' });
                 
                 toast({
                    title: "Laporan Berhasil Diperbarui!",
                    description: "Perubahan pada laporan kinerja Anda telah disimpan dan dikirim ulang untuk peninjauan.",
                 });
            } else {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const departureTime = `${hours}:${minutes}`;

                const newReport = {
                    ...values,
                    jamPulang: departureTime,
                    submissionDate: new Date().toISOString(),
                    status: 'Tertunda' as const,
                };
                await addDoc(collection(db, "reports"), newReport);
                toast({
                    title: "Laporan Berhasil Dikirim!",
                    description: "Laporan kinerja Anda telah dikirim untuk ditinjau.",
                });
            }
            
            form.reset();
            setPreview(null);
            router.push('/dashboards/dashboard/performance-data');
        } catch(error) {
             console.error("Failed to save report to Firestore", error);
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
                      <CardTitle className="text-2xl">{isEditMode ? 'Edit Laporan Kinerja' : 'Kirim Laporan Kinerja'}</CardTitle>
                    </div>
                    <CardDescription>{isEditMode ? 'Perbarui detail laporan Anda di bawah ini. Laporan yang diperbarui akan ditinjau kembali oleh admin.' : 'Isi formulir di bawah ini untuk mengirimkan laporan Anda. Harap berikan detail selengkap mungkin.'}</CardDescription>
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
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted/50"/>
                                            </FormControl>
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
                                                <Input type="time" {...field} readOnly placeholder="Akan tercatat otomatis saat kirim" className="bg-muted/50 italic"/>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <div className="relative">
                                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectTrigger className="pl-10">
                                                <SelectValue placeholder="Pilih jenis kegiatan" />
                                            </SelectTrigger>
                                        </div>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="kerja bakti">Kerja Bakti</SelectItem>
                                        <SelectItem value="posko kontainer">Posko Kontainer</SelectItem>
                                        <SelectItem value="majelis taklim">Majelis Taklim</SelectItem>
                                        <SelectItem value="bank sampah">Bank Sampah</SelectItem>
                                        <SelectItem value="pantau keamanan">Pantau Keamanan</SelectItem>
                                        <SelectItem value="sigap bencana">Sigap Bencana</SelectItem>
                                        <SelectItem value="retribusi sampah">Retribusi Sampah</SelectItem>
                                        <SelectItem value="PBB">PBB</SelectItem>
                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {jenisKegiatan === 'lainnya' && (
                                <FormField
                                    control={form.control}
                                    name="deskripsiLainnya"
                                    render={({ field }) => (
                                        <FormItem className="animate-in fade-in-50">
                                            <FormLabel>Jelaskan kegiatan lainnya</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Jelaskan kegiatan lainnya yang dilakukan..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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
                                                {preview ? 'Ganti Foto' : 'Pilih Foto'}
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
                            <div className="flex gap-2">
                                <Button type="submit" disabled={form.formState.isSubmitting}>{isEditMode ? 'Simpan Perubahan' : 'Kirim Laporan'}</Button>
                                <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
