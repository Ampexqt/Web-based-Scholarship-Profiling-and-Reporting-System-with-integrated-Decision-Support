import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, User, GraduationCap, MapPin, Phone, Mail, ExternalLink, CalendarClock, AlertCircle, Users, Activity, FileCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationReviewActions } from '../components/ApplicationReviewActions';

// Expanded Mock Data reflecting application-form.md
const MOCK_APP_DETAILS = {
  id: "APP-2026-0842",
  status: "Pending Review",
  submittedAt: "Jul 28, 2026, 10:30 AM",
  personalInfo: {
    firstName: "Juan", middleName: "Macaraeg", lastName: "Dela Cruz", ext: "",
    dob: "May 15, 2004", age: 22, gender: "Male", civilStatus: "Single",
    placeOfBirth: "Zamboanga City", religion: "Roman Catholic",
    email: "juan.delacruz@example.com", phone: "+63 912 345 6789",
    currentAddress: "123 Mabini St., Tetuan, Zamboanga City, 7000",
    permanentAddress: "Same as Current Address",
    studentClassification: "Regular",
  },
  academicInfo: {
    studentId: "2023-01452", college: "College of Information and Computing Sciences",
    course: "BS Information Technology", major: "Software Engineering", yearLevel: "3rd Year",
    gpa: "1.25", honors: "Dean's Lister",
    documents: [
      { name: 'Certified Copy of Grades', url: '#' },
      { name: 'Recommendation Letter', url: '#' }
    ]
  },
  householdInfo: {
    headName: "Jose Dela Cruz", headRelationship: "Father",
    totalMembers: 5, totalIncome: "₱15,000",
    mainIncomeSource: "Daily Wage",
    govtAssistance: "None",
  },
  parents: {
    father: {
      name: "Jose Dela Cruz", status: "Living",
      education: "High School Graduate", employment: "Employed",
      occupation: "Driver", income: "Less than P11,000"
    },
    mother: {
      name: "Maria Dela Cruz", status: "Living",
      education: "High School Graduate", employment: "Housekeeper",
      occupation: "Housekeeper", income: "No Income"
    }
  },
  householdMembers: [
    { name: "Pedro Dela Cruz", relation: "Brother", age: 18, studying: "Yes" },
    { name: "Ana Dela Cruz", relation: "Sister", age: 15, studying: "Yes" }
  ],
  specialCircumstances: {
    pwd: { isPwd: true, type: "Orthopedic Disability", idNo: "PWD-12345", doc: { name: 'PWD ID', url: '#' } },
    soloParent: { isSoloParent: false },
    ip: { isIp: false },
    sports: { isAthlete: false },
    indigent: { isIndigent: true, type: "Barangay Certificate", doc: { name: 'Certificate of Indigency', url: '#' } }
  },
  history: [
    { id: 'h1', action: 'Application Submitted', date: 'Jul 28, 2026, 10:30 AM', actor: 'Applicant' },
    { id: 'h2', action: 'System pre-check completed', date: 'Jul 28, 2026, 10:32 AM', actor: 'System' },
  ]
};

// Reusable Document Link Component
const DocLink = ({ doc }: { doc?: { name: string, url: string } }) => {
  if (!doc) return null;
  return (
    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-md mt-2">
      <FileText className="w-4 h-4" />
      View {doc.name}
      <ExternalLink className="w-3 h-3 ml-1" />
    </a>
  );
};

// Reusable Label/Value Component
const DataField = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
    <p className={`font-medium ${highlight ? 'text-primary' : 'text-foreground'}`}>{value || 'N/A'}</p>
  </div>
);

export default function ApplicationReviewPage() {
  const { id } = useParams();
  const [status, setStatus] = useState(MOCK_APP_DETAILS.status);
  const [history, setHistory] = useState(MOCK_APP_DETAILS.history);

  const app = MOCK_APP_DETAILS;

  const handleStatusChange = (newStatus: string, remarks?: string) => {
    setStatus(newStatus);
    setHistory(prev => [{
      id: `h${Date.now()}`,
      action: `Status changed to ${newStatus}${remarks ? ` - Reason: ${remarks}` : ''}`,
      date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      actor: 'Staff User'
    }, ...prev]);
  };

  const getStatusBadge = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending Review': return <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Pending Review</Badge>;
      case 'Flagged': return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 border">Flagged</Badge>;
      case 'Approved': return <Badge variant="default" className="bg-primary text-primary-foreground">Approved</Badge>;
      case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{currentStatus}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in-up">
        
        {/* Back Button - Separated */}
        <div className="mb-4">
          <Link to="/staff/applications" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-md transition-colors -ml-3">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>
        </div>

        {/* Sticky Header Card */}
        <div className="sticky top-6 z-20 bg-background border border-border rounded-xl shadow-sm px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                {app.personalInfo.lastName}, {app.personalInfo.firstName} {app.personalInfo.middleName?.charAt(0)}.
              </h1>
              {getStatusBadge(status)}
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 bg-primary/5 text-primary px-2.5 py-1 rounded-md font-mono border border-primary/10 text-xs font-semibold shadow-sm">
                ID: {id}
              </div>
              <span className="text-muted-foreground text-xs font-medium">Submitted: {app.submittedAt}</span>
            </div>
          </div>
          
          <ApplicationReviewActions currentStatus={status} onStatusChange={handleStatusChange} />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PART I: Personal & Academic */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Part I. Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <DataField label="Full Name" value={`${app.personalInfo.lastName}, ${app.personalInfo.firstName} ${app.personalInfo.middleName}`} />
              <DataField label="Date of Birth (Age)" value={`${app.personalInfo.dob} (${app.personalInfo.age} years old)`} />
              <DataField label="Gender & Civil Status" value={`${app.personalInfo.gender} / ${app.personalInfo.civilStatus}`} />
              <DataField label="Religion" value={app.personalInfo.religion} />
              
              <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
                <div className="flex gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <DataField label="Email Address" value={app.personalInfo.email} />
                </div>
                <div className="flex gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <DataField label="Mobile Number" value={app.personalInfo.phone} />
                </div>
                <div className="col-span-2 flex gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <DataField label="Current Address" value={app.personalInfo.currentAddress} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" /> Part V. Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <DataField label="Student ID" value={app.academicInfo.studentId} />
              <DataField label="Classification" value={app.personalInfo.studentClassification} />
              <div className="col-span-2"><DataField label="College" value={app.academicInfo.college} /></div>
              <DataField label="Course & Major" value={`${app.academicInfo.course} (${app.academicInfo.major})`} />
              <DataField label="Year Level" value={app.academicInfo.yearLevel} />
              
              <div className="col-span-2 bg-primary/5 p-4 rounded-lg border border-primary/10 flex justify-between items-center">
                <div>
                  <DataField label="General Weighted Average (GWA)" value={app.academicInfo.gpa} highlight={true} />
                  <p className="text-xs font-medium text-primary mt-1">{app.academicInfo.honors}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {app.academicInfo.documents.map((doc, idx) => <DocLink key={idx} doc={doc} />)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PART II, III, IV: Family & Financials */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Part II. Household Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <DataField label="Household Head" value={`${app.householdInfo.headName} (${app.householdInfo.headRelationship})`} />
              <DataField label="Total Members" value={app.householdInfo.totalMembers} />
              <DataField label="Main Income Source" value={app.householdInfo.mainIncomeSource} />
              <DataField label="Govt Assistance" value={app.householdInfo.govtAssistance} />
              
              <div className="col-span-2 bg-primary/5 p-4 rounded-lg border border-primary/10 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <DataField label="Est. Monthly Household Income" value={app.householdInfo.totalIncome} highlight={true} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Part III. Parent/Guardian Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-5 space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-2">Father ({app.parents.father.status})</h4>
                  <DataField label="Name" value={app.parents.father.name} />
                  <DataField label="Education" value={app.parents.father.education} />
                  <DataField label="Occupation" value={app.parents.father.occupation} />
                  <DataField label="Income" value={app.parents.father.income} />
                </div>
                <div className="p-5 space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-2">Mother ({app.parents.mother.status})</h4>
                  <DataField label="Name" value={app.parents.mother.name} />
                  <DataField label="Education" value={app.parents.mother.education} />
                  <DataField label="Occupation" value={app.parents.mother.occupation} />
                  <DataField label="Income" value={app.parents.mother.income} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PART VI - X: Special Circumstances */}
        <Card className="shadow-sm border-border lg:col-span-2">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Part VI-X. Special Circumstances & Indigency
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {app.specialCircumstances.pwd.isPwd && (
                <div className="border border-border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold text-sm mb-3 text-primary flex justify-between">
                    Person with Disability (PWD)
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Pending Verification</Badge>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <DataField label="Disability Type" value={app.specialCircumstances.pwd.type} />
                    <DataField label="PWD ID No." value={app.specialCircumstances.pwd.idNo} />
                  </div>
                  <DocLink doc={app.specialCircumstances.pwd.doc} />
                </div>
              )}

              {app.specialCircumstances.indigent.isIndigent && (
                <div className="border border-border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold text-sm mb-3 text-primary flex justify-between">
                    Indigent Status
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Pending Verification</Badge>
                  </h4>
                  <DataField label="Verification Type" value={app.specialCircumstances.indigent.type} />
                  <DocLink doc={app.specialCircumstances.indigent.doc} />
                </div>
              )}
              
            </div>
          </CardContent>
        </Card>

        {/* HISTORY / AUDIT TRAIL */}
        <Card className="shadow-sm border-border lg:col-span-2 bg-muted/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-muted-foreground" /> Application Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l-2 border-border space-y-6 pb-2">
              {history.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[31px] bg-background p-1 rounded-full border-2 border-muted">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>By {item.actor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
