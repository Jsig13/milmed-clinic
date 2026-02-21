export interface Profile {
  id: string;
  name: string;
  rank: string;
  afsc: string;
  unit: string;
  profileType: string;
  startDate: string;
  expectedResolutionDate?: string;
  primaryCondition: string;
  assignedProvider: string;
  status: string;
  notes: ProfileNote[];
  documents: DocumentRecord[];
  msdStatus?: 'Meets Standards' | 'Does Not Meet' | 'Pending Review';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileNote {
  id: string;
  profileId: string;
  date: string;
  author: string;
  type: 'note' | 'status_change' | 'document';
  content: string;
}

export interface DocumentRecord {
  id: string;
  type: string;
  title: string;
  subject: string;
  profileId?: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Provider' | 'Staff';
}

export interface Alert {
  id: string;
  severity: 'red' | 'amber' | 'green';
  message: string;
  profileId: string;
  profileName: string;
  profileRank: string;
  profileType: string;
  daysActive: number;
  action: string;
  date: string;
  read: boolean;
}

export interface MemoFormData {
  subject: string;
  from: string;
  to: string;
  date: string;
  bodyPoints: string[];
}

export interface NarsumFormData {
  patientName: string;
  patientRank: string;
  patientAfsc: string;
  patientUnit: string;
  dob: string;
  diagnosis: string;
  historyOfPresentIllness: string;
  currentStatus: string;
  recommendations: string;
}

export interface LimduFormData {
  memberName: string;
  memberRank: string;
  memberUnit: string;
  diagnosis: string;
  limitations: string;
  duration: string;
  startDate: string;
  endDate: string;
  recommendations: string;
}

export interface DD2992FormData {
  examineeName: string;
  examineeRank: string;
  examineeAfsc: string;
  examineeDob: string;
  flyingClass: string;
  medicalConditions: string;
  flightStatusRecommendation: string;
  restrictions: string;
  examDate: string;
  examinerName: string;
}

export interface DischargeFormData {
  patientName: string;
  patientRank: string;
  admissionDate: string;
  dischargeDate: string;
  admittingDiagnosis: string;
  dischargeDiagnosis: string;
  hospitalCourse: string;
  dischargeInstructions: string;
  followUp: string;
  medications: string;
}

export interface ScriptFormData {
  patientName: string;
  patientRank: string;
  patientDob: string;
  medication: string;
  dosage: string;
  frequency: string;
  quantity: string;
  refills: string;
  instructions: string;
  prescriberName: string;
  date: string;
}
