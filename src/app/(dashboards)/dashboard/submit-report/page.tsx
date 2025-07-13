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
        message: "Title must be at least 5 characters.",
    }),
    period: z.string().min(2, {
        message: "Period must be at least 2 characters.",
    }),
    description: z.string().min(20, {
        message: "Description must be at least 20 characters.",
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
            title: "Report Submitted Successfully!",
            description: "Your performance report has been sent for review.",
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
                      <CardTitle className="text-2xl">Submit Performance Report</CardTitle>
                    </div>
                    <CardDescription>Fill out the form below to submit your report. Please be as detailed as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Report Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Monthly Security Report" {...field} />
                                        </FormControl>
                                        <FormDescription>A concise title for your report.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="period"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reporting Period</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., October 2023" {...field} />
                                        </FormControl>
                                        <FormDescription>The month or quarter this report covers.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Detailed Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the activities, achievements, and challenges during this period..."
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Provide a full description of your performance and activities.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit Report</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
