'use client';

import { useState } from 'react';
import { Pill } from 'lucide-react';
import { format } from 'date-fns';
import PageTransition from '@/components/layout/PageTransition';
import DocumentEditor from '@/components/documents/DocumentEditor';
import GlassInput from '@/components/ui/GlassInput';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassButton from '@/components/ui/GlassButton';
import GlassSelect from '@/components/ui/GlassSelect';
import { ALL_RANKS } from '@/lib/constants';

export default function ScriptPage() {
  const [patientName, setPatientName] = useState('');
  const [patientRank, setPatientRank] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [quantity, setQuantity] = useState('');
  const [refills, setRefills] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prescriberName, setPrescriberName] = useState('');
  const [rxDate, setRxDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const formatted = `╔══════════════════════════════════════════╗
║           PRESCRIPTION / Rx              ║
╠══════════════════════════════════════════╣
║                                          ║
║  Patient: ${patientRank} ${patientName.padEnd(25)}║
║  DOB: ${patientDob.padEnd(33)}║
║  Date: ${rxDate.padEnd(32)}║
║                                          ║
║  ℞                                       ║
║  ${medication.padEnd(39)}║
║  Dosage: ${dosage.padEnd(30)}║
║  Sig: ${frequency.padEnd(33)}║
║  Qty: ${quantity.padEnd(33)}║
║  Refills: ${refills.padEnd(29)}║
║                                          ║
║  Instructions:                           ║
║  ${instructions.substring(0, 39).padEnd(39)}║
║                                          ║
║  Prescriber: ${prescriberName.padEnd(26)}║
║                                          ║
║  Signature: ________________________     ║
║  DEA#: _____________                     ║
╚══════════════════════════════════════════╝`;

    setOutput(formatted);
  };

  return (
    <PageTransition>
      <DocumentEditor
        title="Prescription"
        subtitle="Handwritten Script Generator"
        icon={<Pill size={20} className="text-blue-400" />}
        output={output}
        form={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Patient Name" value={patientName} onChange={setPatientName} placeholder="Last, First" required />
              <GlassSelect label="Rank" value={patientRank} onChange={setPatientRank} placeholder="Select" options={ALL_RANKS.map((r) => ({ value: r, label: r }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Patient DOB" value={patientDob} onChange={setPatientDob} type="date" required />
              <GlassInput label="Rx Date" value={rxDate} onChange={setRxDate} type="date" required />
            </div>
            <GlassInput label="Medication" value={medication} onChange={setMedication} placeholder="e.g., Sertraline" required />
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Dosage" value={dosage} onChange={setDosage} placeholder="e.g., 100mg" required />
              <GlassInput label="Frequency" value={frequency} onChange={setFrequency} placeholder="e.g., Once daily" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Quantity" value={quantity} onChange={setQuantity} placeholder="e.g., 30" required />
              <GlassInput label="Refills" value={refills} onChange={setRefills} placeholder="e.g., 3" required />
            </div>
            <GlassTextarea label="Special Instructions" value={instructions} onChange={setInstructions} placeholder="Take with food, avoid alcohol..." rows={3} />
            <GlassInput label="Prescriber Name" value={prescriberName} onChange={setPrescriberName} placeholder="Prescribing physician" required />
            <GlassButton variant="primary" onClick={handleGenerate} className="w-full">
              Generate Prescription
            </GlassButton>
          </div>
        }
      />
    </PageTransition>
  );
}
