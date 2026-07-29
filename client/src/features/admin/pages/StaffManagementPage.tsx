import React, { useState } from 'react';
import {
  Plus, Search, MoreHorizontal, UserPlus, Shield, UserCog, Mail, Eye, EyeOff, Wand2, Phone
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEMO_STAFF = [
  { id: '1', name: 'Maria Santos', email: 'maria.santos@zppsu.edu.ph', gender: 'Female', phone: '0912 345 6789', status: 'Active', lastActive: '2 mins ago' },
  { id: '2', name: 'Juan Dela Cruz', email: 'juan.delacruz@zppsu.edu.ph', gender: 'Male', phone: '0987 654 3210', status: 'Active', lastActive: '1 hour ago' },
  { id: '3', name: 'Ana Garcia', email: 'ana.garcia@zppsu.edu.ph', gender: 'Female', phone: '0945 123 4567', status: 'Offline', lastActive: '2 days ago' },
];

export default function StaffManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const specials = '!@#$%^&*()_+';
    const allChars = chars + caps + nums + specials;

    // Generate between 8 and 12 characters total
    const length = Math.floor(Math.random() * 5) + 8;

    let generated = '';
    // Ensure at least one uppercase, one number, and one special character
    generated += caps[Math.floor(Math.random() * caps.length)];
    generated += nums[Math.floor(Math.random() * nums.length)];
    generated += specials[Math.floor(Math.random() * specials.length)];

    // Fill the rest randomly
    for (let i = 3; i < length; i++) {
      generated += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the characters
    generated = generated.split('').sort(() => 0.5 - Math.random()).join('');

    setPassword(generated);
    setShowPassword(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Staff Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage scholarship office staff and their system access levels.</p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="shadow-sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Staff
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto px-6 sm:px-8">
            <SheetHeader className="pt-2">
              <SheetTitle className="text-2xl font-heading">Create Staff Account</SheetTitle>
              <SheetDescription className="text-base">
                Add a new staff member to the system. All fields except extension are required.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-8">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground/90">First Name</Label>
                  <Input id="firstName" placeholder="e.g. Maria" className="bg-muted/30 border-border h-10 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground/90">Last Name</Label>
                  <Input id="lastName" placeholder="e.g. Santos" className="bg-muted/30 border-border h-10 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="extension" className="text-sm font-medium text-foreground/90">Extension</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/30 border-border h-10 rounded-lg focus:ring-1 focus:ring-primary transition-all">
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
                <div className="space-y-1.5">
                  <Label htmlFor="gender" className="text-sm font-medium text-foreground/90">Gender</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/30 border-border h-10 rounded-lg focus:ring-1 focus:ring-primary transition-all">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground/90">Phone Number</Label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <span className="absolute left-9 text-sm text-foreground/80 font-medium">+63</span>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="9123456789" 
                    maxLength={10}
                    className="pl-16 bg-muted/30 border-border h-10 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/90">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="email@zppsu.edu.ph" className="pl-9 bg-muted/30 border-border h-10 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground/90">Password</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGeneratePassword}
                    className="h-6 px-2 text-xs text-primary hover:bg-primary/10"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-muted/30 border-border h-10 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8 pt-4 border-t border-border w-full">
              <SheetClose asChild>
                <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-lg">Cancel</Button>
              </SheetClose>
              <Button className="w-full h-12 text-base font-semibold rounded-lg">Create Account</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border-border shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name or email..."
              className="pl-9 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {DEMO_STAFF.length} Total Staff
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Staff Member</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_STAFF.map((staff) => (
              <TableRow key={staff.id} className="group hover:bg-muted/20">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-foreground">{staff.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{staff.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{staff.gender}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{staff.phone}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={staff.status === 'Active' ? 'default' : 'secondary'} className="font-medium shadow-none">
                    {staff.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2 hidden sm:inline-block">
                    {staff.lastActive}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
