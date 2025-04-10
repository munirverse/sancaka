"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SuccessAddInstanceModalProps {
  instance: { name: string; url: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuccessAddInstanceModal({
  instance,
  open,
  onOpenChange,
}: SuccessAddInstanceModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Success Add Instance</AlertDialogTitle>
          <AlertDialogDescription>
            Successfully added instance{" "}
            <span className="font-semibold">{instance?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ok</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
