'use client';

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import DocumentEditor from '@/components/documents/DocumentEditor';
import GlassInput from '@/components/ui/GlassInput';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassButton from '@/components/ui/GlassButton';
import GlassSelect from '@/components/ui/GlassSelect';
import { ALL_RANKS } from '@/lib/constants';

export default function DischargePage() {
  const [patientName, setPatientName] = useState('');
  const [patientRank, setPatientRank] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [admittingDiagnosis, setAdmittingDiagnosis] = useState('');
  const [dischargeDiagnosis, setDischargeDiagnosis] = useState('');
  const [hospitalCourse, setHospitalCourse] = useState('');
  const [dischargeInstructions, setDischargeInstructions] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [medications, setMedications] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const formatted = `DISCHARGE SUMMARY

PATIENT: ${patientRank} ${patientName}
ADMISSION DATE: ${admissionDate}
DISCHARGE DATE: ${dischargeDate}

ADMITTING DIAGNOSIS:
${admittingDiagnosis}

DISCHARGE DIAGNOSIS:
${dischargeDiagnosis}

HOSPITAL COURSE:
${hospitalCourse}

DISCHARGE MEDICATIONS:
${medications}

DISCHARGE INSTRUCTIONS:
${dischargeInstructions}

FOLLOW-UP:
${followUp}

Attending Physician: _________________________
Date: ${new Date().toLocaleDateString()}`;

    setOutput(formatted);
  };

  return (
    <PageTransition>
      <DocumentEditor
        title="Discharge Summary"
        subtitle="Diagnosis Extraction & Summary"
        icon={<ClipboardList size={20} className="text-blue-400" />}
        output={output}
        form={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Patient Name" value={patientName} onChange={setPatientName} placeholder="Last, First" required />
              <GlassSelect label="Rank" value={patientRank} onChange={setPatientRank} placeholder="Select" options={ALL_RANKS.map((r) => ({ value: r, label: r }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Admission Date" value={admissionDate} onChange={setAdmissionDate} type="date" required />
              <GlassInput label="Discharge Date" value={dischargeDate} onChange={setDischargeDate} type="date" required />
            </div>
            <GlassTextarea label="Admitting Diagnosis" value={admittingDiagnosis} onChange={setAdmittingDiagnosis} placeholder="Initial diagnosis on admission..." rows={3} required />
            <GlassTextarea label="Discharge Diagnosis" value={dischargeDiagnosis} onChange={setDischargeDiagnosis} placeholder="Final diagnosis at discharge..." rows={3} required />
            <GlassTextarea label="Hospital Course" value={hospitalCourse} onChange={setHospitalCourse} placeholder="Summary of treatment and hospital course..." rows={5} required />
            <GlassTextarea label="Discharge Medications" value={medications} onChange={setMedications} placeholder="List all discharge medications..." rows={3} required />
            <GlassTextarea label="Discharge Instructions" value={dischargeInstructions} onChange={setDischargeInstructions} placeholder="Patient instructions for post-discharge care..." rows={3} required />
            <GlassTextarea label="Follow-up" value={followUp} onChange={setFollowUp} placeholder="Follow-up appointments and timeline..." rows={2} required />
            <GlassButton variant="primary" onClick={handleGenerate} className="w-full">
              Generate Discharge Summary
            </GlassButton>
          </div>
        }
      />
    </PageTransition>
  );
}
