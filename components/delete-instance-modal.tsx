"use client";

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
import type { Instance } from "@/types/instance";

interface DeleteInstanceModalProps {
  instance: Instance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteInstanceModal({
  instance,
  open,
  onOpenChange,
  onConfirm,
}: DeleteInstanceModalProps) {
  const handleConfirm = () => {
    if (instance) {
      onConfirm(instance.id);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the monitoring instance{" "}
            <span className="font-semibold">{instance?.name}</span>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
