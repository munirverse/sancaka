"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2 } from "lucide-react";
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
import type { NotificationType, NotificationData } from "@/types/notification";
import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
} from "@/lib/features/notification/notificationHook";
import qs from "querystring";
import { debounced } from "@/lib/utils";

export function NotificationsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermQuery, setSearchTermQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationData | null>(null);

  const { data } = useGetNotificationsQuery(
    qs.stringify({ page: currentPage, limit: 5, q: searchTermQuery })
  );

  const [deleteNotification] = useDeleteNotificationMutation();

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    debounced(() => {
      setSearchTermQuery(value);
      setCurrentPage(1);
    })();
  };

  const getNotificationTypeBadge = (type: NotificationType) => {
    const colors: Record<NotificationType, string> = {
      telegram: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      slack:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };

    return (
      <Badge className={`${colors[type]} border-none`} variant="outline">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const handleDeleteClick = (notification: NotificationData) => {
    setSelectedNotification(notification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (id: number) => {
    if (id) {
      await deleteNotification(id)
        .then(() => {
          setDeleteDialogOpen(false);
          setSelectedNotification(null);
        })
        .catch((error: any) => {
          console.error("Error deleting notification:", error);
          setDeleteDialogOpen(false);
          setSelectedNotification(null);
        });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-semibold">Notification Channels</h2>
          <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              className="pl-8 w-full sm:w-[250px]"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.list && data?.list?.length > 0 ? (
                data.list.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">
                      {notification.name}
                    </TableCell>
                    <TableCell>
                      {getNotificationTypeBadge(notification.type)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(notification)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No notifications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {(data?.pagination?.totalPages || 0) > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: data?.pagination?.totalPages || 0 }).map(
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, data?.pagination?.totalPages || 0)
                    )
                  }
                  className={
                    currentPage === data?.pagination?.totalPages || 0
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the notification channel{" "}
              {selectedNotification?.name}
              <span className="font-semibold"></span>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteConfirm(selectedNotification?.id || 0)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
