import { useState } from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Flag } from "lucide-react";

interface ApplicationReviewActionsProps {
  currentStatus: string;
  onStatusChange: (status: string, remarks?: string) => void;
  isActionDisabled?: boolean;
}

export function ApplicationReviewActions({ currentStatus, onStatusChange, isActionDisabled }: ApplicationReviewActionsProps) {
  const [remarks, setRemarks] = useState('');
  
  return (
    <div className="flex flex-wrap gap-3">
      {/* Approve Action */}
      <AlertDialog>
        <AlertDialogTrigger 
          disabled={isActionDisabled}
          className={buttonVariants({ variant: "default", size: "sm", className: `gap-1.5 ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : ''}` })}
        >
          <CheckCircle className="w-4 h-4" />
          Approve
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
        <AlertDialogTrigger 
          className={buttonVariants({ variant: "destructive", className: "gap-2" })}
        >
          <XCircle className="w-4 h-4" />
          Reject
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
            <div className="relative">
              <Textarea 
                id="reject-reason" 
                placeholder="e.g. Incomplete grades document" 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={250}
                className="mt-2 min-h-[100px] max-h-[200px] pb-6"
              />
              <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {remarks.length}/250
              </span>
            </div>
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
        <AlertDialogTrigger 
          className={buttonVariants({ variant: "outline", className: "gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200" })}
        >
          <Flag className="w-4 h-4" />
          Flag for Review
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
            <div className="relative">
              <Textarea 
                id="flag-reason" 
                placeholder="e.g. Discrepancy in declared income" 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={250}
                className="mt-2 min-h-[100px] max-h-[200px] pb-6"
              />
              <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {remarks.length}/250
              </span>
            </div>
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
