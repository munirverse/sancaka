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
import { useDeleteInstanceMutation } from "@/lib/features/instance/instanceHook";

interface DeleteInstanceModalProps {
  instance: Instance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
}

export function DeleteInstanceModal({
  instance,
  open,
  onOpenChange,
  onFinish,
}: DeleteInstanceModalProps) {
  const [deleteInstance] = useDeleteInstanceMutation();

  const handleConfirm = async () => {
    if (instance) {
      try {
        await deleteInstance(instance);
        onOpenChange(false);
        onFinish();
      } catch (error) {
        console.error("Error deleting instance:", error);
      }
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
