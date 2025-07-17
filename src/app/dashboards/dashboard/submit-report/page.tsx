import { Suspense } from 'react';
import ReportFormContent from '@/components/report-form-content';

export default function ReportSubmissionPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <ReportFormContent />
        </Suspense>
    );
}
