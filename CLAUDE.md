# MilMed Clinic Manager — Build Spec

## What This Is
An aerospace medicine clinic management tool for military physicians. Handles document generation, medical profile tracking, alerts, and team coordination. Runs on localhost, accessible via Chrome on government computers. HIPAA compliant.

## Tech Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Framer Motion for micro-animations
- Supabase for auth + database
- Lucide React for icons
- date-fns for date calculations
- Dark mode — Apple Liquid Glass aesthetic (same as student-review project)

## NO Supabase connection yet — use local state and mock data for now.
We'll connect Supabase later. Build all UI and logic with local state + localStorage persistence.

## Design: Apple Liquid Glass (Dark Mode) — SAME as student-review
- Background: slate-950 to slate-900 gradient
- Glass panels: rgba(255,255,255,0.04) with backdrop-blur-2xl
- Primary: blue-500, Success: emerald-500, Warning: amber-500, Danger: red-500
- Ambient background orbs (blue, purple, teal at low opacity)
- Framer Motion micro-animations on everything
- Military precision — clean, data-dense, organized

## App Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root: ambient BG, dark theme
│   ├── page.tsx                      # Landing / login redirect
│   ├── login/page.tsx                # Auth page
│   ├── dashboard/
│   │   ├── layout.tsx                # Sidebar nav + header
│   │   ├── page.tsx                  # Main dashboard (overview)
│   │   ├── profiles/
│   │   │   ├── page.tsx              # Profile tracker list
│   │   │   └── [id]/page.tsx         # Individual profile detail
│   │   ├── documents/
│   │   │   ├── page.tsx              # Document generator hub
│   │   │   ├── memo/page.tsx         # Army memo generator
│   │   │   ├── narsum/page.tsx       # NARSUM generator
│   │   │   ├── limdu/page.tsx        # LIMDU generator
│   │   │   ├── dd2992/page.tsx       # DD 2992 generator
│   │   │   ├── discharge/page.tsx    # Discharge summary generator
│   │   │   └── scripts/page.tsx      # Handwritten script generator
│   │   ├── msd/page.tsx              # MSD reference / checker
│   │   ├── alerts/page.tsx           # All alerts and notifications
│   │   └── settings/page.tsx         # Team management, config
├── components/
│   ├── ui/                           # Glass design system (reuse from student-review)
│   │   ├── GlassPanel.tsx
│   │   ├── GlassButton.tsx
│   │   ├── GlassInput.tsx
│   │   ├── GlassSelect.tsx
│   │   ├── GlassTextarea.tsx
│   │   ├── GlassModal.tsx
│   │   ├── GlassBadge.tsx
│   │   ├── GlassTable.tsx            # Data table component
│   │   ├── GlassSkeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── StatCard.tsx              # Number + label stat display
│   │   └── AlertBanner.tsx           # Notification banner
│   ├── layout/
│   │   ├── AmbientBackground.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PageTransition.tsx
│   │   └── StaggerChildren.tsx
│   ├── profiles/
│   │   ├── ProfileCard.tsx           # Card for a tracked person
│   │   ├── ProfileForm.tsx           # Add/edit profile form
│   │   ├── ProfileTimeline.tsx       # Timeline of notes/events
│   │   ├── StatusBadge.tsx           # Color-coded status badge
│   │   └── ProfileFilters.tsx        # Filter by type/status/overdue
│   └── documents/
│       ├── DocumentEditor.tsx        # Main doc generation interface
│       ├── TemplateSelector.tsx       # Pick document type
│       └── OutputViewer.tsx          # Formatted output with copy/print
├── lib/
│   ├── types.ts
│   ├── mock-data.ts                  # Seed data for development
│   ├── profile-utils.ts             # Date calculations, status logic
│   └── constants.ts                  # Ranks, AFSCs, profile types, etc.
```

## Pages to Build

### 1. Dashboard Home (`/dashboard`)
The command center. At-a-glance view of everything that needs attention.

**Layout:**
- Top row: 4 stat cards
  - Total Active Profiles (number, blue)
  - Profiles >90 Days (number, RED with pulse animation if >0)
  - Overdue Actions (number, amber)
  - Documents Generated This Week (number, emerald)
- Second row: Alerts section
  - List of urgent items: "SSgt Smith — Code 37 at 95 days, needs resolution"
  - Each alert: name, rank, profile type, days active, required action
  - Color-coded: red (>90 days), amber (60-90 days), green (<60 days)
  - Click alert → goes to profile detail
- Third row: Two columns
  - Left: Recent Profiles (last 5 added/updated)
  - Right: Recent Documents (last 5 generated)
- Quick action buttons: "Add Profile" + "Generate Document"

### 2. Profile Tracker (`/dashboard/profiles`)
The main tracking board for all medical profiles.

**Layout:**
- Filter bar at top:
  - Profile Type: All | Code 37 | IRILO | ARILO | Standard Profile
  - Status: All | Active | Pending Resolution | Referred to MEB | Resolved
  - Duration: All | >90 Days | >60 Days | >30 Days
  - Search by name/rank
- Table/list of profiles (GlassTable):
  - Columns: Name | Rank | AFSC | Unit | Profile Type | Start Date | Days Active | Status | Actions
  - "Days Active" column: color-coded (green <60, amber 60-90, red >90)
  - Row click → profile detail
  - Sort by any column
- "Add Profile" button (opens modal form)

**Add Profile Form (GlassModal):**
- Name (text)
- Rank (dropdown: all AF enlisted + officer ranks)
- AFSC (text input with common suggestions)
- Unit (text)
- Profile Type (dropdown: Code 37, IRILO, ARILO, Standard Profile, MEB Referral)
- Start Date (date picker)
- Primary Diagnosis / Condition (text)
- Expected Resolution Date (date picker, optional)
- Notes (textarea)
- Assigned Provider (dropdown — team members)
- Status (dropdown: Active, Pending Resolution, Referred to MEB, Resolved)

### 3. Profile Detail (`/dashboard/profiles/[id]`)
Deep dive on one tracked person.

**Layout:**
- Header: Name, Rank, AFSC, Unit, Status Badge
- Info cards row:
  - Profile Type badge
  - Days on Profile (large number, color-coded)
  - Start Date → Expected Resolution
  - Assigned Provider
- MSD Compliance section:
  - Based on their AFSC, show applicable medical standards
  - "Check MSD" button (placeholder for now — will check uploaded MSD)
  - Status: Meets Standards / Does Not Meet / Pending Review
- Timeline / Notes section:
  - Chronological list of all notes, status changes, documents generated
  - Each entry: date, author, type (note/status change/document), content
  - "Add Note" button → text area + save
- Documents section:
  - List of documents generated for this person
  - "Generate Document" button → goes to doc generator pre-filled with this person's info
- Actions:
  - "Send to PEBLO" button (placeholder — will email)
  - "Update Status" button
  - "Resolve Profile" button
  - "Archive" button

### 4. Document Generator Hub (`/dashboard/documents`)
Central hub for all document types.

**Layout:**
- Grid of document type cards (glass panels with icons):
  - 📋 Army Memo (AR 25-50)
  - 🏥 NARSUM (Narrative Aeromedical Summary)
  - ⚓ LIMDU (Limited Duty)
  - ✈️ DD 2992 (Aeromedical Certification)
  - 📄 Discharge Summary
  - 💊 Prescription / Script
- Each card: icon, title, description, "Generate" button
- Below: Recent documents list with date, type, subject, actions (view/copy/print)

### 5. Individual Document Pages (`/dashboard/documents/memo`, etc.)
Each document type has its own page with:

**Left panel: Input**
- Form fields specific to the document type
- Textarea for pasting source material (e.g., prep notes for discharge summary)
- "Upload Source Document" area
- For memo: Subject, From, To, Body points, Date
- For NARSUM: Patient info, diagnosis, history, current status, recommendations
- For DD 2992: Examinee info, medical conditions, flight status recommendation

**Right panel: Output**
- Formatted document preview (styled to look like the actual document)
- "Copy to Clipboard" button
- "Print" button (opens print dialog)
- "Save" button (saves to local storage / future: Supabase)
- "Download as PDF" button (placeholder)

**For now: just build the UI with the input forms and a mock output. AI generation will be added later when Josh provides templates + API key.**

### 6. MSD Reference (`/dashboard/msd`)
- Upload MSD document (placeholder)
- Search by AFSC or condition
- Shows applicable medical standards
- "Check Member" → select a tracked profile → shows if they meet standards

### 7. Alerts (`/dashboard/alerts`)
- Full list of all alerts/notifications
- Filter: All | Overdue | Upcoming | Resolved
- Each alert: severity (red/amber/green), message, related profile, date, action button
- Mark as read / dismiss

### 8. Settings (`/dashboard/settings`)
- Team Members section:
  - List of team members (name, email, role)
  - "Invite Team Member" button
  - Roles: Admin, Provider, Staff
- PEBLO Configuration:
  - PEBLO team email addresses
  - Default email template
- Preferences:
  - Default document format settings
  - Notification preferences

## Mock Data
Create realistic mock data in `lib/mock-data.ts`:
- 8-10 tracked profiles with various types, statuses, and durations
- Mix of: 2 Code 37s (one at 95 days, one at 45 days), 2 IRILOs, 1 ARILO, 3 standard profiles, 1 MEB referral, 1 resolved
- Include realistic AF ranks, AFSCs, units, conditions
- 3-4 sample notes per profile with dates
- 5-6 recent documents

## Constants (`lib/constants.ts`)
```typescript
// AF Ranks
export const AF_RANKS = {
  enlisted: ['AB', 'Amn', 'A1C', 'SrA', 'SSgt', 'TSgt', 'MSgt', 'SMSgt', 'CMSgt'],
  officer: ['2d Lt', 'Capt', 'Maj', 'Lt Col', 'Col'],
};

// Common AFSCs
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
  // Add more as needed
];

// Profile Types
export const PROFILE_TYPES = [
  'Code 37',
  'IRILO',
  'ARILO',
  'Standard Profile',
  'MEB Referral',
];

// Profile Statuses
export const PROFILE_STATUSES = [
  'Active',
  'Pending Resolution',
  'Referred to MEB',
  'Awaiting PEBLO',
  'Resolved',
  'Archived',
];

// Document Types
export const DOCUMENT_TYPES = [
  { id: 'memo', title: 'Army Memo', subtitle: 'AR 25-50 Format', icon: 'FileText' },
  { id: 'narsum', title: 'NARSUM', subtitle: 'Narrative Aeromedical Summary', icon: 'Stethoscope' },
  { id: 'limdu', title: 'LIMDU', subtitle: 'Limited Duty', icon: 'Anchor' },
  { id: 'dd2992', title: 'DD 2992', subtitle: 'Aeromedical Certification', icon: 'Plane' },
  { id: 'discharge', title: 'Discharge Summary', subtitle: 'Diagnosis Extraction', icon: 'ClipboardList' },
  { id: 'script', title: 'Prescription', subtitle: 'Handwritten Script', icon: 'Pill' },
];
```

## Sidebar Navigation
- 🏠 Dashboard
- 👤 Profiles (with badge showing active count)
- 📄 Documents
- 📋 MSD Reference
- 🔔 Alerts (with badge showing unread count)
- ⚙️ Settings

## Key Requirements
1. ALL pages use "use client" for Framer Motion
2. Use localStorage to persist mock data (profiles, notes, documents)
3. Profile duration calculations use date-fns
4. Color coding: green (<60 days), amber (60-90 days), red (>90 days)
5. Dashboard alerts auto-generate from profile data (overdue, approaching limits)
6. Mobile responsive but optimized for desktop (Chrome on govt workstation)
7. Every interaction has glass styling + micro-animations
8. Compile clean with `npm run build`
9. The "Days Active" for each profile must calculate dynamically from start date to today
