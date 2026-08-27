import { useState, useEffect, useRef } from 'react';
import { apiClient, getBaseUrl } from '@/lib/axios';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, User, GraduationCap, MapPin, Phone, Mail, ExternalLink, CalendarClock, AlertCircle, Users, Activity, FileCheck } from 'lucide-react';
import { useActiveTime } from '@/hooks/useActiveTime';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationReviewActions } from '../components/ApplicationReviewActions';


import { CheckCircle2, Circle } from 'lucide-react';

// Reusable Document Link Component with Verification
const DocLink = ({ doc, isVerified, onToggleVerify }: { doc?: { name: string, url: string }, isVerified?: boolean, onToggleVerify?: (url: string) => void }) => {
  if (!doc) return null;
  return (
    <div className={`flex items-center gap-1 p-1 rounded-md border transition-colors ${isVerified ? 'bg-primary/5 border-primary/20' : 'bg-background border-border'} shadow-sm`}>
      <a 
        href={doc.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={() => {
          // Log document view
          apiClient.post('/audit/event', {
            action: 'DOC_VIEW',
            targetAppId: window.location.pathname.split('/').pop(), // hacky way to get ID here, better to pass down
            targetDoc: doc.url
          }).catch(console.error);
          
          if (!isVerified && onToggleVerify) onToggleVerify(doc.url);
        }}
        className="flex-1 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap"
      >
        <FileText className="w-3.5 h-3.5" />
        View {doc.name}
        <ExternalLink className="w-3 h-3 opacity-50 ml-1" />
      </a>
      {onToggleVerify && (
        <button 
          onClick={() => onToggleVerify(doc.url)}
          className={`flex items-center justify-center p-1.5 rounded transition-colors ${isVerified ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
          title={isVerified ? "Mark as unverified" : "Mark as verified"}
        >
          {isVerified ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
        </button>
      )}
    </div>
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
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [status, setStatus] = useState("Loading...");
  const [history, setHistory] = useState<any[]>([]);
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedDocs, setVerifiedDocs] = useState<string[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);

  const activeSeconds = useActiveTime(id || '');
  const activeSecondsRef = useRef(0);
  const viewStartTime = useRef(new Date().toISOString());

  useEffect(() => {
    activeSecondsRef.current = activeSeconds;
  }, [activeSeconds]);

  useEffect(() => {
    if (id) {
      apiClient.post('/audit/event', {
        action: 'APP_VIEW_START',
        targetAppId: id
      }).catch(console.error);
    }

    const logDuration = () => {
      if (id && activeSecondsRef.current > 0) {
        const endTime = new Date().toISOString();
        const baseURL = apiClient.defaults.baseURL || 'http://localhost:5000/api';
        
        // Use keepalive for reliable delivery when the tab is closing
        fetch(`${baseURL}/audit/duration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            targetAppId: id,
            duration: activeSecondsRef.current,
            notes: `Session: ${new Date(viewStartTime.current).toLocaleTimeString()} to ${new Date(endTime).toLocaleTimeString()}`
          }),
          keepalive: true
        }).catch(console.error);
      }
    };

    window.addEventListener('beforeunload', logDuration);

    return () => {
      window.removeEventListener('beforeunload', logDuration);
      logDuration();
    };
  }, [id]);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res: any = await apiClient.get(`/applications/${id}`);
        if (res.success && res.application) {
          const data = res.application;
          
          const parseJSON = (field: any) => typeof field === 'string' ? JSON.parse(field) : field;
          
          const pInfo = parseJSON(data.personalInfo) || {};
          const addrInfo = parseJSON(data.addressInfo) || { current: {}, permanent: {} };
          const hInfo = parseJSON(data.householdInfo) || {};
          const pgInfo = parseJSON(data.parentGuardianInfo) || { father: {}, mother: {} };
          const acInfo = parseJSON(data.academicInfo) || {};
          const scInfo = parseJSON(data.specialCircumstances) || {};
          
          const baseUrl = getBaseUrl();
          
          const mappedApp = {
            id: data.referenceNumber,
            status: data.status,
            submittedAt: new Date(data.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
            personalInfo: {
              firstName: data.givenName,
              middleName: data.middleName || "",
              lastName: data.lastName,
              ext: pInfo.extension || "",
              dob: pInfo.birthdate ? new Date(pInfo.birthdate).toLocaleDateString() : "",
              age: pInfo.age || "",
              gender: pInfo.sex || "",
              civilStatus: pInfo.civilStatus || "",
              placeOfBirth: pInfo.placeOfBirth || "",
              religion: pInfo.religion === 'Others' ? pInfo.religionOthers : pInfo.religion || "",
              email: pInfo.emailAddress || "",
              phone: pInfo.mobileNumber || "",
              currentAddress: `${addrInfo.current?.houseBlock || ""} ${addrInfo.current?.street || ""}, ${addrInfo.current?.barangay || ""}, ${addrInfo.current?.municipality || ""}, ${addrInfo.current?.province || ""} ${addrInfo.current?.zipCode || ""}`.trim().replace(/,\s*$/, ""),
              permanentAddress: addrInfo.permanent?.sameAsCurrent ? "Same as Current Address" : `${addrInfo.permanent?.houseBlock || ""} ${addrInfo.permanent?.street || ""}, ${addrInfo.permanent?.barangay || ""}, ${addrInfo.permanent?.municipality || ""}, ${addrInfo.permanent?.province || ""} ${addrInfo.permanent?.zipCode || ""}`.trim().replace(/,\s*$/, ""),
              studentClassification: pInfo.studentClassification || "Regular"
            },
            academicInfo: {
              studentId: data.studentId,
              college: data.college,
              course: data.course,
              major: pInfo.major || "N/A",
              yearLevel: pInfo.yearLevel || "",
              gpa: acInfo.previousGwa || "",
              honors: acInfo.academicHonors || "None",
              documents: [
                acInfo.uploadGrades ? { name: 'Certified Copy of Grades', url: `${baseUrl}/${acInfo.uploadGrades.replace(/\\/g, '/')}` } : null,
                acInfo.uploadRecommendation ? { name: 'Recommendation Letter', url: `${baseUrl}/${acInfo.uploadRecommendation.replace(/\\/g, '/')}` } : null,
                acInfo.uploadGwaProof ? { name: 'GWA Proof', url: `${baseUrl}/${acInfo.uploadGwaProof.replace(/\\/g, '/')}` } : null
              ].filter(Boolean)
            },
            householdInfo: {
              headName: hInfo.headFullName || "N/A",
              headRelationship: hInfo.headRelationship === 'Others' ? hInfo.headRelationshipOthers : hInfo.headRelationship || "N/A",
              totalMembers: hInfo.totalMembers || 0,
              totalIncome: hInfo.monthlyIncome || "N/A",
              mainIncomeSource: hInfo.mainSourceOfIncome === 'Others' ? hInfo.mainSourceOfIncomeOthers : hInfo.mainSourceOfIncome || "N/A",
              govtAssistance: hInfo.govAssistance === 'Others' ? hInfo.govAssistanceOthers : hInfo.govAssistance || "None"
            },
            parents: {
              father: {
                name: `${pgInfo.father?.givenName || ""} ${pgInfo.father?.familyName || ""}`.trim() || "N/A",
                status: pgInfo.father?.livingStatus || "N/A",
                education: pgInfo.father?.education || "N/A",
                employment: pgInfo.father?.employmentStatus || "N/A",
                occupation: pgInfo.father?.occupationCategory === 'Others' ? pgInfo.father?.occupationOthers : pgInfo.father?.specificOccupation || "N/A",
                income: pgInfo.father?.monthlyIncome || "N/A"
              },
              mother: {
                name: `${pgInfo.mother?.givenName || ""} ${pgInfo.mother?.familyName || ""}`.trim() || "N/A",
                status: pgInfo.mother?.livingStatus || "N/A",
                education: pgInfo.mother?.education || "N/A",
                employment: pgInfo.mother?.employmentStatus || "N/A",
                occupation: pgInfo.mother?.occupationCategory === 'Others' ? pgInfo.mother?.occupationOthers : "N/A",
                income: pgInfo.mother?.monthlyIncome || "N/A"
              }
            },
            digitalSignature: pInfo.uploadDigitalSignature ? `${baseUrl}/${pInfo.uploadDigitalSignature.replace(/\\/g, '/')}` : null,
            specialCircumstances: {
              pwd: { 
                isPwd: scInfo.isPwd === 'Yes' || scInfo.isPwd === 'true' || scInfo.isPwd === true, 
                type: scInfo.pwdType === 'Others' ? scInfo.pwdTypeOthers : scInfo.pwdType || "", 
                idNo: scInfo.pwdIdNumber || "", 
                lgu: scInfo.pwdLgu || "",
                dateIssued: scInfo.pwdDateIssued ? new Date(scInfo.pwdDateIssued).toLocaleDateString() : "",
                expiration: scInfo.pwdExpiration ? new Date(scInfo.pwdExpiration).toLocaleDateString() : "",
                doc: scInfo.uploadPwdId ? { name: 'PWD ID', url: `${baseUrl}/${scInfo.uploadPwdId.replace(/\\/g, '/')}` } : null, 
                medDoc: scInfo.uploadMedicalCert ? { name: 'Medical Certificate', url: `${baseUrl}/${scInfo.uploadMedicalCert.replace(/\\/g, '/')}` } : null 
              },
              soloParent: { 
                isSoloParent: scInfo.isSoloParent === 'Yes' || scInfo.isSoloParent === 'true' || scInfo.isSoloParent === true, 
                idNo: scInfo.soloParentIdNumber || "",
                lgu: scInfo.soloParentLgu || "",
                dateIssued: scInfo.soloParentDateIssued ? new Date(scInfo.soloParentDateIssued).toLocaleDateString() : "",
                expiration: scInfo.soloParentExpiration ? new Date(scInfo.soloParentExpiration).toLocaleDateString() : "",
                doc: scInfo.uploadSoloParentId ? { name: 'Solo Parent ID', url: `${baseUrl}/${scInfo.uploadSoloParentId.replace(/\\/g, '/')}` } : null 
              },
              ip: { 
                isIp: scInfo.isIp === 'Yes' || scInfo.isIp === 'true' || scInfo.isIp === true, 
                tribe: scInfo.ipTribe === 'Others' ? scInfo.ipTribeOthers : scInfo.ipTribe || "",
                ncipNo: scInfo.ipNcipNumber || "",
                domain: scInfo.ipDomain || "",
                cctDoc: scInfo.uploadNcipCct ? { name: 'NCIP CCT', url: `${baseUrl}/${scInfo.uploadNcipCct.replace(/\\/g, '/')}` } : null, 
                confDoc: scInfo.uploadNcipConfirmation ? { name: 'NCIP Confirmation', url: `${baseUrl}/${scInfo.uploadNcipConfirmation.replace(/\\/g, '/')}` } : null, 
                chiefDoc: scInfo.uploadTribalChieftainCert ? { name: 'Tribal Chieftain Cert', url: `${baseUrl}/${scInfo.uploadTribalChieftainCert.replace(/\\/g, '/')}` } : null 
              },
              sports: { 
                isAthlete: scInfo.isAthleteArtist === 'Yes' || scInfo.isAthleteArtist === 'true' || scInfo.isAthleteArtist === true, 
                type: scInfo.athleteType || "",
                event: scInfo.athleteEvent || "",
                years: scInfo.athleteYears || "",
                highest: scInfo.athleteHighestCompetition || "",
                awards: scInfo.athleteAwards || "",
                certDoc: scInfo.uploadAthleteCert ? { name: 'Athlete/Artist Cert', url: `${baseUrl}/${scInfo.uploadAthleteCert.replace(/\\/g, '/')}` } : null, 
                awardsDoc: scInfo.uploadAthleteAwards ? { name: 'Awards Proof', url: `${baseUrl}/${scInfo.uploadAthleteAwards.replace(/\\/g, '/')}` } : null 
              },
              indigent: { 
                isIndigent: scInfo.isIndigent === 'Yes' || scInfo.isIndigent === 'true' || scInfo.isIndigent === true, 
                type: scInfo.indigentVerificationType || "", 
                doc: scInfo.uploadCertOfIndigency ? { name: 'Certificate of Indigency', url: `${baseUrl}/${scInfo.uploadCertOfIndigency.replace(/\\/g, '/')}` } : null, 
                indigentCertDoc: scInfo.uploadIndigentCert ? { name: 'Indigent Cert', url: `${baseUrl}/${scInfo.uploadIndigentCert.replace(/\\/g, '/')}` } : null, 
                caseStudyDoc: scInfo.uploadSocialCaseStudy ? { name: 'Social Case Study', url: `${baseUrl}/${scInfo.uploadSocialCaseStudy.replace(/\\/g, '/')}` } : null 
              }
            }
          };
          
          const parsedVerifiedDocs = typeof data.verifiedDocuments === 'string' ? JSON.parse(data.verifiedDocuments) : (data.verifiedDocuments || []);
          setVerifiedDocs(parsedVerifiedDocs);

          const docsCount = [
            ...mappedApp.academicInfo.documents,
            mappedApp.specialCircumstances.pwd.doc,
            mappedApp.specialCircumstances.pwd.medDoc,
            mappedApp.specialCircumstances.soloParent.doc,
            mappedApp.specialCircumstances.ip.cctDoc,
            mappedApp.specialCircumstances.ip.confDoc,
            mappedApp.specialCircumstances.ip.chiefDoc,
            mappedApp.specialCircumstances.sports.certDoc,
            mappedApp.specialCircumstances.sports.awardsDoc,
            mappedApp.specialCircumstances.indigent.doc,
            mappedApp.specialCircumstances.indigent.indigentCertDoc,
            mappedApp.specialCircumstances.indigent.caseStudyDoc
          ].filter(Boolean).length;
          setTotalDocs(docsCount);
          
          setApp(mappedApp);
          setStatus(data.status || "Pending");
          
          let initialHistory = [];
          if (res.historyLogs && res.historyLogs.length > 0) {
            initialHistory = res.historyLogs.map((log: any) => ({
              id: log.id,
              action: `Status changed to ${
                log.action === 'APP_APPROVE' ? 'Approved' : 
                log.action === 'APP_REJECT' ? 'Rejected' : 
                log.action === 'APP_FLAG' ? 'Flagged' : 
                log.action === 'APP_PENDING' ? 'Pending Review' : 'Updated'
              }${log.notes ? ` - Reason: ${log.notes}` : ''}`,
              date: new Date(log.createdAt).toLocaleString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true 
              }),
              actor: log.user?.name || 'Staff User'
            }));
          }
          
          initialHistory.push({
            id: 'h1', action: 'Application Submitted', 
            date: new Date(mappedApp.submittedAt).toLocaleString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric',
              hour: 'numeric', minute: '2-digit', hour12: true 
            }), 
            actor: 'Applicant'
          });
          
          setHistory(initialHistory);
        }
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchApp();
  }, [id]);

  const toggleVerify = async (docUrl: string) => {
    const isCurrentlyVerified = verifiedDocs.includes(docUrl);
    
    if (isCurrentlyVerified) {
      setVerifiedDocs(prev => prev.filter(url => url !== docUrl));
    } else {
      setVerifiedDocs(prev => [...prev, docUrl]);
    }

    try {
      await apiClient.patch(`/applications/${id}/verify-document`, {
        documentUrl: docUrl,
        isVerified: !isCurrentlyVerified
      });
    } catch (error) {
      console.error("Failed to verify document:", error);
      if (isCurrentlyVerified) {
        setVerifiedDocs(prev => [...prev, docUrl]);
      } else {
        setVerifiedDocs(prev => prev.filter(url => url !== docUrl));
      }
    }
  };

  if (isLoading) return <div className="min-h-screen bg-muted/20 pb-16 flex items-center justify-center text-muted-foreground">Loading application details...</div>;
  if (!app) return <div className="min-h-screen bg-muted/20 pb-16 flex items-center justify-center text-destructive">Application not found</div>;

  const handleStatusChange = async (newStatus: string, remarks?: string) => {
    try {
      const res: any = await apiClient.patch(`/applications/${id}/status`, {
        status: newStatus,
        remarks: remarks || ''
      });

      if (res.success) {
        setStatus(newStatus);
        setHistory(prev => [{
          id: `h${Date.now()}`,
          action: `Status changed to ${newStatus}${remarks ? ` - Reason: ${remarks}` : ''}`,
          date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
          actor: 'Staff User'
        }, ...prev]);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusBadge = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending':
      case 'Pending Review': return <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Pending Review</Badge>;
      case 'Flagged': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Flagged</Badge>;
      case 'Approved': return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Approved</Badge>;
      case 'Rejected': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default: return <Badge variant="outline">{currentStatus}</Badge>;
    }
  };

  const returnPath = location.pathname.startsWith('/admin') ? '/admin/applications' : '/staff/applications';
  const queryParams = new URLSearchParams(location.search);
  const hideBack = queryParams.get('hideBack') === 'true' || location.state?.hideBack;

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in-up">
        
        {/* Back Button - Separated */}
        {!hideBack && (
          <div className="mb-4">
            <Link to={returnPath} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-md transition-colors -ml-3">
              <ArrowLeft className="w-4 h-4" /> Back to Applications
            </Link>
          </div>
        )}

        {/* Sticky Header Card */}
        <div className="sticky top-6 z-20 bg-background border border-border rounded-xl shadow-sm px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                {app.personalInfo.lastName}, {app.personalInfo.firstName} {app.personalInfo.middleName?.charAt(0)}.
              </h1>
              {getStatusBadge(status)}
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm flex-wrap">
              <div className="flex items-center gap-1.5 bg-primary/5 text-primary px-2.5 py-1 rounded-md font-mono border border-primary/10 text-xs font-semibold shadow-sm">
                ID: {id}
              </div>
              <span className="text-muted-foreground text-xs font-medium">Submitted: {app.submittedAt}</span>
              
              <div className="hidden md:block w-px h-4 bg-border mx-2"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Verification:</span>
                <Badge variant={verifiedDocs.length === totalDocs ? "default" : "secondary"} className={`text-xs ${verifiedDocs.length === totalDocs ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {verifiedDocs.length} / {totalDocs} Documents
                </Badge>
              </div>
            </div>
            {verifiedDocs.length < totalDocs && status === 'Pending Review' && (
              <p className="text-xs text-destructive font-medium mt-2">
                * All documents must be verified before approval.
              </p>
            )}
          </div>
          
          <ApplicationReviewActions currentStatus={status} onStatusChange={handleStatusChange} isActionDisabled={verifiedDocs.length < totalDocs} />
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
              
              <div className="col-span-2 bg-primary/5 p-4 rounded-lg border border-primary/10 flex justify-between items-center gap-4">
                <div>
                  <DataField label="General Weighted Average (GWA)" value={app.academicInfo.gpa} highlight={true} />
                  <p className="text-xs font-medium text-primary mt-1">{app.academicInfo.honors}</p>
                </div>
                <div className="flex flex-col items-stretch gap-1.5 min-w-max">
                  {app.academicInfo.documents.map((doc: any, idx: number) => <DocLink key={idx} doc={doc} isVerified={verifiedDocs.includes(doc.url)} onToggleVerify={toggleVerify} />)}
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
            {(!app.specialCircumstances.pwd.isPwd && !app.specialCircumstances.indigent.isIndigent && !app.specialCircumstances.soloParent.isSoloParent && !app.specialCircumstances.ip.isIp && !app.specialCircumstances.sports.isAthlete) ? (
              <div className="text-center p-6 bg-background rounded-lg border border-dashed border-border">
                <p className="text-muted-foreground font-medium">Not Applicable</p>
                <p className="text-xs text-muted-foreground mt-1">Applicant has not declared any special circumstances or indigency.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {app.specialCircumstances.pwd.isPwd && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    <div className="p-4 border-b border-border bg-muted/10">
                      <h4 className="font-semibold text-sm text-primary flex justify-between items-center">
                        Person with Disability (PWD)
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 scale-90 origin-right">Verification Required</Badge>
                      </h4>
                    </div>
                    <div className="bg-primary/5 p-4 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <DataField label="Disability Type" value={app.specialCircumstances.pwd.type} />
                        <DataField label="PWD ID No." value={app.specialCircumstances.pwd.idNo} />
                        <DataField label="LGU / Issuing Authority" value={app.specialCircumstances.pwd.lgu} />
                        <DataField label="Date Issued" value={app.specialCircumstances.pwd.dateIssued} />
                        <DataField label="Expiration Date" value={app.specialCircumstances.pwd.expiration} />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
                        <DocLink doc={app.specialCircumstances.pwd.doc} isVerified={app.specialCircumstances.pwd.doc && verifiedDocs.includes(app.specialCircumstances.pwd.doc.url)} onToggleVerify={toggleVerify} />
                        <DocLink doc={app.specialCircumstances.pwd.medDoc} isVerified={app.specialCircumstances.pwd.medDoc && verifiedDocs.includes(app.specialCircumstances.pwd.medDoc.url)} onToggleVerify={toggleVerify} />
                      </div>
                    </div>
                  </div>
                )}

                {app.specialCircumstances.indigent.isIndigent && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    <div className="p-4 border-b border-border bg-muted/10">
                      <h4 className="font-semibold text-sm text-primary flex justify-between items-center">
                        Indigent Status
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 scale-90 origin-right">Verification Required</Badge>
                      </h4>
                    </div>
                    <div className="bg-primary/5 p-4 flex flex-col gap-4">
                      <div>
                        <DataField label="Verification Type" value={app.specialCircumstances.indigent.type} />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
                        <DocLink doc={app.specialCircumstances.indigent.doc} isVerified={app.specialCircumstances.indigent.doc && verifiedDocs.includes(app.specialCircumstances.indigent.doc.url)} onToggleVerify={toggleVerify} />
                        <DocLink doc={app.specialCircumstances.indigent.indigentCertDoc} isVerified={app.specialCircumstances.indigent.indigentCertDoc && verifiedDocs.includes(app.specialCircumstances.indigent.indigentCertDoc.url)} onToggleVerify={toggleVerify} />
                        <DocLink doc={app.specialCircumstances.indigent.caseStudyDoc} isVerified={app.specialCircumstances.indigent.caseStudyDoc && verifiedDocs.includes(app.specialCircumstances.indigent.caseStudyDoc.url)} onToggleVerify={toggleVerify} />
                      </div>
                    </div>
                  </div>
                )}
                
                {app.specialCircumstances.soloParent.isSoloParent && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    <div className="p-4 border-b border-border bg-muted/10">
                      <h4 className="font-semibold text-sm text-primary flex justify-between items-center">
                        Solo Parent
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 scale-90 origin-right">Verification Required</Badge>
                      </h4>
                    </div>
                    <div className="bg-primary/5 p-4 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <DataField label="Solo Parent ID No." value={app.specialCircumstances.soloParent.idNo} />
                        <DataField label="LGU / Issuing Authority" value={app.specialCircumstances.soloParent.lgu} />
                        <DataField label="Date Issued" value={app.specialCircumstances.soloParent.dateIssued} />
                        <DataField label="Expiration Date" value={app.specialCircumstances.soloParent.expiration} />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
                        <DocLink doc={app.specialCircumstances.soloParent.doc} isVerified={app.specialCircumstances.soloParent.doc && verifiedDocs.includes(app.specialCircumstances.soloParent.doc.url)} onToggleVerify={toggleVerify} />
                      </div>
                    </div>
                  </div>
                )}

                {app.specialCircumstances.ip.isIp && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    <div className="p-4 border-b border-border bg-muted/10">
                      <h4 className="font-semibold text-sm text-primary flex justify-between items-center">
                        Indigenous Person
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 scale-90 origin-right">Verification Required</Badge>
                      </h4>
                    </div>
                    <div className="bg-primary/5 p-4 flex flex-col gap-4">
                      <div className="space-y-4">
                        <DataField label="Name of Tribe / Community" value={app.specialCircumstances.ip.tribe} />
                        <DataField label="NCIP Confirmation Number" value={app.specialCircumstances.ip.ncipNo} />
                        <DataField label="Ancestral Domain / Location" value={app.specialCircumstances.ip.domain} />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
                        <DocLink doc={app.specialCircumstances.ip.cctDoc} isVerified={app.specialCircumstances.ip.cctDoc && verifiedDocs.includes(app.specialCircumstances.ip.cctDoc.url)} onToggleVerify={toggleVerify} />
                        <DocLink doc={app.specialCircumstances.ip.confDoc} isVerified={app.specialCircumstances.ip.confDoc && verifiedDocs.includes(app.specialCircumstances.ip.confDoc.url)} onToggleVerify={toggleVerify} />
                        <DocLink doc={app.specialCircumstances.ip.chiefDoc} isVerified={app.specialCircumstances.ip.chiefDoc && verifiedDocs.includes(app.specialCircumstances.ip.chiefDoc.url)} onToggleVerify={toggleVerify} />
                      </div>
                    </div>
                  </div>
                )}

                {app.specialCircumstances.sports.isAthlete && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    <div className="p-4 border-b border-border bg-muted/10">
                      <h4 className="font-semibold text-sm text-primary flex justify-between items-center">
                        Athlete / Artist
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 scale-90 origin-right">Verification Required</Badge>
                      </h4>
                    </div>
                    <div className="bg-primary/5 p-4 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <DataField label="Type" value={app.specialCircumstances.sports.type} />
                        <DataField label="Event / Sport / Arts" value={app.specialCircumstances.sports.event} />
                        <DataField label="Years of Participation" value={app.specialCircumstances.sports.years} />
                        <DataField label="Highest Level" value={app.specialCircumstances.sports.highest} />
                        <div className="col-span-2">
                          <DataField label="Major Awards" value={app.specialCircumstances.sports.awards} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
                        <DocLink doc={app.specialCircumstances.sports.certDoc} isVerified={app.specialCircumstances.sports.certDoc && verifiedDocs.includes(app.specialCircumstances.sports.certDoc.url)} onToggleVerify={toggleVerify} />
                        <DocLink doc={app.specialCircumstances.sports.awardsDoc} isVerified={app.specialCircumstances.sports.awardsDoc && verifiedDocs.includes(app.specialCircumstances.sports.awardsDoc.url)} onToggleVerify={toggleVerify} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Digital Signature */}
        {app.digitalSignature && (
          <Card className="shadow-sm border-border lg:col-span-2">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" /> Applicant Certification & Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="border-b border-border pb-2 mb-2 w-64 flex justify-center">
                <img src={app.digitalSignature} alt="Digital Signature" className="max-h-24 object-contain" />
              </div>
              <p className="text-sm font-medium uppercase tracking-wide">{app.personalInfo.firstName} {app.personalInfo.lastName}</p>
              <p className="text-xs text-muted-foreground mt-1">Signed on {app.submittedAt}</p>
            </CardContent>
          </Card>
        )}

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
