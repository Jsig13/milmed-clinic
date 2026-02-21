'use client';

import { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import DocumentEditor from '@/components/documents/DocumentEditor';
import GlassInput from '@/components/ui/GlassInput';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassButton from '@/components/ui/GlassButton';
import GlassSelect from '@/components/ui/GlassSelect';
import { ALL_RANKS } from '@/lib/constants';

export default function NarsumPage() {
  const [patientName, setPatientName] = useState('');
  const [patientRank, setPatientRank] = useState('');
  const [patientAfsc, setPatientAfsc] = useState('');
  const [patientUnit, setPatientUnit] = useState('');
  const [dob, setDob] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [history, setHistory] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const formatted = `NARRATIVE SUMMARY (NARSUM)

PATIENT INFORMATION:
Name: ${patientRank} ${patientName}
AFSC: ${patientAfsc}
Unit: ${patientUnit}
Date of Birth: ${dob}

DIAGNOSIS:
${diagnosis}

HISTORY OF PRESENT ILLNESS:
${history}

CURRENT STATUS:
${currentStatus}

RECOMMENDATIONS:
${recommendations}

Prepared by: _________________________
Date: ${new Date().toLocaleDateString()}
Flight Surgeon Signature`;

    setOutput(formatted);
  };

  return (
    <PageTransition>
      <DocumentEditor
        title="NARSUM"
        subtitle="Narrative Aeromedical Summary"
        icon={<Stethoscope size={20} className="text-blue-400" />}
        output={output}
        form={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Patient Name" value={patientName} onChange={setPatientName} placeholder="Last, First" required />
              <GlassSelect label="Rank" value={patientRank} onChange={setPatientRank} placeholder="Select" options={ALL_RANKS.map((r) => ({ value: r, label: r }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="AFSC" value={patientAfsc} onChange={setPatientAfsc} placeholder="e.g., 11X" required />
              <GlassInput label="Unit" value={patientUnit} onChange={setPatientUnit} placeholder="Unit name" required />
            </div>
            <GlassInput label="Date of Birth" value={dob} onChange={setDob} type="date" required />
            <GlassTextarea label="Diagnosis" value={diagnosis} onChange={setDiagnosis} placeholder="Primary and secondary diagnoses..." rows={3} required />
            <GlassTextarea label="History of Present Illness" value={history} onChange={setHistory} placeholder="Detailed medical history..." rows={5} required />
            <GlassTextarea label="Current Status" value={currentStatus} onChange={setCurrentStatus} placeholder="Current medical status and limitations..." rows={4} required />
            <GlassTextarea label="Recommendations" value={recommendations} onChange={setRecommendations} placeholder="Treatment recommendations and prognosis..." rows={4} required />
            <GlassButton variant="primary" onClick={handleGenerate} className="w-full">
              Generate NARSUM
            </GlassButton>
          </div>
        }
      />
    </PageTransition>
  );
}
