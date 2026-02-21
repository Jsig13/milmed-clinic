'use client';

import { useState } from 'react';
import { Plane } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import DocumentEditor from '@/components/documents/DocumentEditor';
import GlassInput from '@/components/ui/GlassInput';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassButton from '@/components/ui/GlassButton';
import GlassSelect from '@/components/ui/GlassSelect';
import { ALL_RANKS, FLYING_CLASSES } from '@/lib/constants';

export default function DD2992Page() {
  const [examineeName, setExamineeName] = useState('');
  const [examineeRank, setExamineeRank] = useState('');
  const [examineeAfsc, setExamineeAfsc] = useState('');
  const [examineeDob, setExamineeDob] = useState('');
  const [flyingClass, setFlyingClass] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examinerName, setExaminerName] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const formatted = `DD FORM 2992 — MEDICAL RECOMMENDATION FOR FLYING OR SPECIAL OPERATIONAL DUTY

SECTION I — EXAMINEE INFORMATION
Name: ${examineeRank} ${examineeName}
AFSC: ${examineeAfsc}
Date of Birth: ${examineeDob}
Flying Class: ${flyingClass}

SECTION II — MEDICAL CONDITIONS
${medicalConditions}

SECTION III — RECOMMENDATION
Flight Status: ${recommendation}

RESTRICTIONS/LIMITATIONS:
${restrictions || 'None'}

SECTION IV — EXAMINER
Examining Flight Surgeon: ${examinerName}
Date of Examination: ${examDate}

Signature: _________________________`;

    setOutput(formatted);
  };

  return (
    <PageTransition>
      <DocumentEditor
        title="DD 2992"
        subtitle="Medical Recommendation for Flying or Special Operational Duty"
        icon={<Plane size={20} className="text-blue-400" />}
        output={output}
        form={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Examinee Name" value={examineeName} onChange={setExamineeName} placeholder="Last, First" required />
              <GlassSelect label="Rank" value={examineeRank} onChange={setExamineeRank} placeholder="Select" options={ALL_RANKS.map((r) => ({ value: r, label: r }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="AFSC" value={examineeAfsc} onChange={setExamineeAfsc} placeholder="e.g., 11X" required />
              <GlassInput label="Date of Birth" value={examineeDob} onChange={setExamineeDob} type="date" required />
            </div>
            <GlassSelect
              label="Flying Class"
              value={flyingClass}
              onChange={setFlyingClass}
              placeholder="Select flying class"
              options={FLYING_CLASSES.map((f) => ({ value: f, label: f }))}
              required
            />
            <GlassTextarea label="Medical Conditions" value={medicalConditions} onChange={setMedicalConditions} placeholder="List all pertinent medical conditions..." rows={4} required />
            <GlassSelect
              label="Flight Status Recommendation"
              value={recommendation}
              onChange={setRecommendation}
              placeholder="Select recommendation"
              options={[
                { value: 'Qualified — Unrestricted', label: 'Qualified — Unrestricted' },
                { value: 'Qualified — With Restrictions', label: 'Qualified — With Restrictions' },
                { value: 'DNIF — Duties Not Including Flying', label: 'DNIF — Duties Not Including Flying' },
                { value: 'Disqualified', label: 'Disqualified' },
              ]}
              required
            />
            <GlassTextarea label="Restrictions (if applicable)" value={restrictions} onChange={setRestrictions} placeholder="Specific flight restrictions..." rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Exam Date" value={examDate} onChange={setExamDate} type="date" required />
              <GlassInput label="Examiner Name" value={examinerName} onChange={setExaminerName} placeholder="Flight Surgeon name" required />
            </div>
            <GlassButton variant="primary" onClick={handleGenerate} className="w-full">
              Generate DD 2992
            </GlassButton>
          </div>
        }
      />
    </PageTransition>
  );
}
