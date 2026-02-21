'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import PageTransition from '@/components/layout/PageTransition';
import DocumentEditor from '@/components/documents/DocumentEditor';
import GlassInput from '@/components/ui/GlassInput';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassButton from '@/components/ui/GlassButton';

export default function MemoPage() {
  const [subject, setSubject] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [body, setBody] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const formatted = `DEPARTMENT OF THE AIR FORCE
MEMORANDUM FOR ${to.toUpperCase()}

FROM: ${from}

SUBJECT: ${subject}

DATE: ${format(new Date(date), 'dd MMMM yyyy')}

1. ${body.split('\n').filter(Boolean).join('\n\n2. ')}


${from}
Signature Block`;

    setOutput(formatted);
  };

  return (
    <PageTransition>
      <DocumentEditor
        title="Army Memo"
        subtitle="AR 25-50 Format"
        icon={<FileText size={20} className="text-blue-400" />}
        output={output}
        form={
          <div className="space-y-4">
            <GlassInput label="Subject" value={subject} onChange={setSubject} placeholder="Subject of the memorandum" required />
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="From" value={from} onChange={setFrom} placeholder="Originator name/office" required />
              <GlassInput label="To" value={to} onChange={setTo} placeholder="Recipient" required />
            </div>
            <GlassInput label="Date" value={date} onChange={setDate} type="date" required />
            <GlassTextarea label="Body Points (one per line)" value={body} onChange={setBody} placeholder="Enter each paragraph point on a new line..." rows={8} required />
            <GlassButton variant="primary" onClick={handleGenerate} className="w-full">
              Generate Memo
            </GlassButton>
          </div>
        }
      />
    </PageTransition>
  );
}
