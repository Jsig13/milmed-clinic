'use client';

import { useState } from 'react';
import { Anchor } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import DocumentEditor from '@/components/documents/DocumentEditor';
import GlassInput from '@/components/ui/GlassInput';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassButton from '@/components/ui/GlassButton';
import GlassSelect from '@/components/ui/GlassSelect';
import { ALL_RANKS } from '@/lib/constants';

export default function LimduPage() {
  const [memberName, setMemberName] = useState('');
  const [memberRank, setMemberRank] = useState('');
  const [memberUnit, setMemberUnit] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [limitations, setLimitations] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const formatted = `LIMITED DUTY (LIMDU) RECOMMENDATION

MEMBER INFORMATION:
Name: ${memberRank} ${memberName}
Unit: ${memberUnit}

DIAGNOSIS:
${diagnosis}

LIMITATIONS:
${limitations}

DURATION: ${duration}
Start Date: ${startDate}
End Date: ${endDate}

RECOMMENDATIONS:
${recommendations}

Recommending Physician: _________________________
Date: ${new Date().toLocaleDateString()}
Signature`;

    setOutput(formatted);
  };

  return (
    <PageTransition>
      <DocumentEditor
        title="LIMDU"
        subtitle="Limited Duty Recommendation"
        icon={<Anchor size={20} className="text-blue-400" />}
        output={output}
        form={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Member Name" value={memberName} onChange={setMemberName} placeholder="Last, First" required />
              <GlassSelect label="Rank" value={memberRank} onChange={setMemberRank} placeholder="Select" options={ALL_RANKS.map((r) => ({ value: r, label: r }))} required />
            </div>
            <GlassInput label="Unit" value={memberUnit} onChange={setMemberUnit} placeholder="Unit name" required />
            <GlassTextarea label="Diagnosis" value={diagnosis} onChange={setDiagnosis} placeholder="Medical diagnosis..." rows={3} required />
            <GlassTextarea label="Limitations" value={limitations} onChange={setLimitations} placeholder="Specific duty limitations..." rows={4} required />
            <div className="grid grid-cols-3 gap-4">
              <GlassInput label="Duration" value={duration} onChange={setDuration} placeholder="e.g., 6 months" required />
              <GlassInput label="Start Date" value={startDate} onChange={setStartDate} type="date" required />
              <GlassInput label="End Date" value={endDate} onChange={setEndDate} type="date" required />
            </div>
            <GlassTextarea label="Recommendations" value={recommendations} onChange={setRecommendations} placeholder="Treatment plan and follow-up..." rows={4} required />
            <GlassButton variant="primary" onClick={handleGenerate} className="w-full">
              Generate LIMDU
            </GlassButton>
          </div>
        }
      />
    </PageTransition>
  );
}
