import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Flag } from "lucide-react";

interface ApplicationReviewActionsProps {
  currentStatus: string;
  onStatusChange: (status: string, remarks?: string) => void;
}

export function ApplicationReviewActions({ currentStatus, onStatusChange }: ApplicationReviewActionsProps) {
  const [remarks, setRemarks] = useState('');
  
  return (
    <div className="flex flex-wrap gap-3">
      {/* Approve Action */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the application as Approved and notify the applicant. Ensure all documents and information have been verified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onStatusChange('Approved')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Action */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="gap-2">
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this application. This feedback will be visible to the applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-reason">Rejection Reason</Label>
            <Input 
              id="reject-reason" 
              placeholder="e.g. Incomplete grades document" 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemarks('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onStatusChange('Rejected', remarks);
                setRemarks('');
              }}
              disabled={!remarks.trim()}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag Action */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200">
            <Flag className="w-4 h-4" />
            Flag for Review
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag Application</AlertDialogTitle>
            <AlertDialogDescription>
              Flagging an application means it needs further review or has discrepancies. Please note the issue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="flag-reason">Issue Description</Label>
            <Input 
              id="flag-reason" 
              placeholder="e.g. Discrepancy in declared income" 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemarks('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onStatusChange('Flagged', remarks);
                setRemarks('');
              }}
              disabled={!remarks.trim()}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Flag Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
