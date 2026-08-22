import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';
import {
  Search, MoreHorizontal, UserPlus, Phone, Mail, Eye, EyeOff, Wand2, KeyRound, Ban, CheckCircle2, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_URL = 'http://localhost:5000/api';

interface Staff {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  isActive: boolean;
  updatedAt?: string;
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Staff Form State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    extension: 'None',
    gender: '',
    phone: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Password Reset State
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedStaffForReset, setSelectedStaffForReset] = useState<Staff | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const fetchStaff = async () => {
    try {
      const data: any = await apiClient.get(`/staff`);
      setStaffList(data || []);
    } catch (error) {
      toast.error('Failed to load staff accounts');
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Form Handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const specials = '!@#$%^&*()_+';
    const allChars = chars + caps + nums + specials;
    const length = 12;
    let generated = '';
    generated += caps[Math.floor(Math.random() * caps.length)];
    generated += nums[Math.floor(Math.random() * nums.length)];
    generated += specials[Math.floor(Math.random() * specials.length)];
    for (let i = 3; i < length; i++) {
      generated += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    return generated.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const handleGeneratePasswordForForm = () => {
    const generated = generateRandomPassword();
    handleInputChange('password', generated);
    setShowPassword(true);
  };

  const handleCreateStaff = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.gender || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      const fullName = formData.extension !== 'None' 
        ? `${formData.firstName} ${formData.lastName} ${formData.extension}`
        : `${formData.firstName} ${formData.lastName}`;

      await apiClient.post(`/staff`, {
        name: fullName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        phone: formData.phone
      });

      toast.success('Staff account created successfully');
      setIsSheetOpen(false);
      setFormData({ firstName: '', lastName: '', extension: 'None', gender: '', phone: '', email: '', password: '' });
      fetchStaff();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create staff account');
    }
  };

  // Staff Actions
  const handleToggleStatus = async (staffId: number, currentStatus: boolean) => {
    try {
      await apiClient.put(`/staff/${staffId}/status`, {
        isActive: !currentStatus
      });
      toast.success(`Account ${!currentStatus ? 'activated' : 'suspended'}`);
      fetchStaff();
    } catch (error) {
      toast.error('Failed to update account status');
    }
  };

  const openResetPasswordDialog = (staff: Staff) => {
    setSelectedStaffForReset(staff);
    setGeneratedPassword(generateRandomPassword());
    setResetDialogOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!selectedStaffForReset) return;
    try {
      await apiClient.put(`/staff/${selectedStaffForReset.id}/reset-password`, {
        newPassword: generatedPassword
      });
      toast.success('Password reset successfully. Make sure to copy it!');
      setResetDialogOpen(false);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success('Password copied to clipboard');
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Staff Accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage scholarship office staff and their system access levels.</p>
      </div>

      <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name or email..."
              className="pl-9 bg-background border-border h-10 shadow-sm transition-all focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground font-medium hidden sm:inline-block">
              {filteredStaff.length} Total Staff
            </span>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger render={<Button className="w-full sm:w-auto shadow-sm transition-all hover:-translate-y-0.5" />}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Staff
              </SheetTrigger>
              <SheetContent className="sm:max-w-md overflow-y-auto px-6 sm:px-8 bg-card border-l border-border shadow-2xl">
                <SheetHeader className="pt-4 pb-2 border-b border-border">
                  <SheetTitle className="text-2xl font-serif font-bold text-foreground">Create Staff Account</SheetTitle>
                  <SheetDescription className="text-base text-muted-foreground">
                    Add a new staff member to the system. All fields except extension are required.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">First Name</Label>
                      <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="e.g. Maria" className="bg-background border-border h-11 rounded-xl focus-visible:ring-primary shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Last Name</Label>
                      <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="e.g. Santos" className="bg-background border-border h-11 rounded-xl focus-visible:ring-primary shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="extension" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Extension</Label>
                      <Select value={formData.extension} onValueChange={(val) => handleInputChange('extension', val)}>
                        <SelectTrigger className="bg-background border-border h-11 rounded-xl focus:ring-1 focus:ring-primary shadow-sm">
                          <SelectValue placeholder="e.g. Jr., Sr." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Jr.">Jr.</SelectItem>
                          <SelectItem value="Sr.">Sr.</SelectItem>
                          <SelectItem value="II">II</SelectItem>
                          <SelectItem value="III">III</SelectItem>
                          <SelectItem value="IV">IV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Gender</Label>
                      <Select value={formData.gender} onValueChange={(val) => handleInputChange('gender', val)}>
                        <SelectTrigger className="bg-background border-border h-11 rounded-xl focus:ring-1 focus:ring-primary shadow-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</Label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                      <span className="absolute left-9 text-sm text-muted-foreground font-medium">+63</span>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="9123456789" 
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-[4.5rem] bg-background border-border h-11 rounded-xl focus-visible:ring-primary shadow-sm" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="email@zppsu.edu.ph" className="pl-10 bg-background border-border h-11 rounded-xl focus-visible:ring-primary shadow-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGeneratePasswordForForm}
                        className="h-6 px-2 text-xs text-primary hover:bg-primary/10 font-semibold"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pr-10 bg-background border-border h-11 rounded-xl focus-visible:ring-primary shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-6 border-t border-border w-full pb-8">
                  <SheetClose render={<Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl hover:bg-muted/50" />}>
                    Cancel
                  </SheetClose>
                  <Button onClick={handleCreateStaff} className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:-translate-y-0.5 transition-all">Create Account</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-b-border">
              <TableHead className="w-[300px] h-12 font-semibold text-muted-foreground">Staff Member</TableHead>
              <TableHead className="h-12 font-semibold text-muted-foreground">Gender</TableHead>
              <TableHead className="h-12 font-semibold text-muted-foreground">Phone Number</TableHead>
              <TableHead className="h-12 font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="text-right h-12 font-semibold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No staff found.</TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id} className="group hover:bg-muted/10 transition-colors">
                  <TableCell className="font-medium py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground font-semibold">{staff.name}</span>
                      <span className="text-xs text-muted-foreground">{staff.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium text-foreground/80">{staff.gender}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-mono text-muted-foreground">{staff.phone ? `+63 ${staff.phone}` : '-'}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={staff.isActive ? 'default' : 'destructive'} className="font-medium shadow-none rounded-md px-2 py-0.5">
                        {staff.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openResetPasswordDialog(staff)}
                            className="flex items-center gap-2 cursor-pointer font-medium"
                          >
                            <KeyRound className="w-4 h-4 text-accent" />
                            <span>Reset Password</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(staff.id, staff.isActive)}
                            className={`flex items-center gap-2 cursor-pointer font-medium ${staff.isActive ? 'text-destructive' : 'text-primary'}`}
                          >
                            {staff.isActive ? (
                              <><Ban className="w-4 h-4" /><span>Suspend Account</span></>
                            ) : (
                              <><CheckCircle2 className="w-4 h-4" /><span>Activate Account</span></>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Reset Password Modal */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="sm:max-w-md p-8 border-border shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-serif font-bold">Reset Password</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              A secure password has been generated for <strong className="text-foreground">{selectedStaffForReset?.name}</strong>. Please copy it now, as it will not be shown again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="bg-muted/40 p-4 rounded-xl border border-border mt-4 mb-2 flex items-center justify-between">
            <code className="text-lg font-mono font-bold tracking-wider text-foreground select-all">
              {generatedPassword}
            </code>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-primary hover:bg-primary/10 transition-colors">
              <Copy className="w-5 h-5" />
            </Button>
          </div>

          <AlertDialogFooter className="mt-8 flex gap-3 sm:space-x-0 w-full">
            <AlertDialogCancel className="flex-1 h-12 text-base font-semibold rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmResetPassword} className="flex-1 h-12 text-base font-semibold rounded-xl shadow-md">
              Confirm Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
