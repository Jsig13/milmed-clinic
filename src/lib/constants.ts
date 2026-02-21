export const AF_RANKS = {
  enlisted: ['AB', 'Amn', 'A1C', 'SrA', 'SSgt', 'TSgt', 'MSgt', 'SMSgt', 'CMSgt'],
  officer: ['2d Lt', '1st Lt', 'Capt', 'Maj', 'Lt Col', 'Col'],
};

export const ALL_RANKS = [...AF_RANKS.enlisted, ...AF_RANKS.officer];

export const COMMON_AFSCS = [
  '1A0X1 - In-Flight Refueling',
  '1A1X1 - Flight Engineer',
  '1A2X1 - Aircraft Loadmaster',
  '1A3X1 - Airborne Mission Systems',
  '1C0X2 - Aviation Resource Management',
  '1T0X1 - Survival, Evasion, Resistance, Escape',
  '1W0X1 - Weather',
  '2A3X3 - Tactical Aircraft Maintenance',
  '2W0X1 - Munitions Systems',
  '3D0X2 - Cyber Systems Operations',
  '3E7X1 - Fire Protection',
  '4N0X1 - Aerospace Medical Technician',
  '4Y0X1 - Dental Assistant',
  '11X - Pilot',
  '12X - Combat Systems Officer',
  '13B - Air Battle Manager',
  '13N - Nuclear and Missile Operations',
  '48XX - Aerospace Medicine Physician',
];

export const PROFILE_TYPES = [
  'Code 37',
  'IRILO',
  'ARILO',
  'Standard Profile',
  'MEB Referral',
];

export const PROFILE_STATUSES = [
  'Active',
  'Pending Resolution',
  'Referred to MEB',
  'Awaiting PEBLO',
  'Resolved',
  'Archived',
];

export const DOCUMENT_TYPES = [
  { id: 'memo', title: 'Army Memo', subtitle: 'AR 25-50 Format', icon: 'FileText' },
  { id: 'narsum', title: 'NARSUM', subtitle: 'Narrative Aeromedical Summary', icon: 'Stethoscope' },
  { id: 'limdu', title: 'LIMDU', subtitle: 'Limited Duty', icon: 'Anchor' },
  { id: 'dd2992', title: 'DD 2992', subtitle: 'Aeromedical Certification', icon: 'Plane' },
  { id: 'discharge', title: 'Discharge Summary', subtitle: 'Diagnosis Extraction', icon: 'ClipboardList' },
  { id: 'script', title: 'Prescription', subtitle: 'Handwritten Script', icon: 'Pill' },
];

export const FLYING_CLASSES = [
  'Class I - Initial Flying',
  'Class II - Continuing Flying',
  'Class III - Non-Rated Aircrew',
  'Class IV - Air Traffic Control',
];

export const SIDEBAR_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Profiles', href: '/dashboard/profiles', icon: 'Users', badge: true },
  { label: 'Documents', href: '/dashboard/documents', icon: 'FileText' },
  { label: 'MSD Reference', href: '/dashboard/msd', icon: 'ClipboardCheck' },
  { label: 'Alerts', href: '/dashboard/alerts', icon: 'Bell', badge: true },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
];
