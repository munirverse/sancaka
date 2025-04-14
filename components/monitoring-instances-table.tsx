"use client";

import qs from "querystring";
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
import { Edit, Trash2, ArrowUpDown, Search } from "lucide-react";
import { EditInstanceModal } from "@/components/edit-instance-modal";
import { DeleteInstanceModal } from "@/components/delete-instance-modal";
import type { Instance } from "@/types/instance";
import { useGetInstancesQuery } from "@/lib/features/instance/instanceHook";
import { debounced } from "@/lib/utils";

export function MonitoringInstancesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermQuery, setSearchTermQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(
    null
  );

  const handleEdit = (instance: Instance) => {
    setSelectedInstance(instance);
    setEditModalOpen(true);
  };

  const handleDelete = (instance: Instance) => {
    setSelectedInstance(instance);
    setDeleteModalOpen(true);
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    debounced(() => {
      setSearchTermQuery(value);
      setCurrentPage(1);
    })();
  };

  const handleOnFinishEdit = () => {
    setSelectedInstance(null);
    setCurrentPage(1);
    setSearchTermQuery("");
    setSearchTerm("");
  };

  const handleOnFinishDelete = () => {
    setSelectedInstance(null);
    setCurrentPage(1);
    setSearchTermQuery("");
    setSearchTerm("");
  };

  const getStatusColor = (status: Instance["status"]) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "offline":
        return "text-red-500";
      default:
        return "";
    }
  };

  const getStatusDot = (status: Instance["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const getIntervalFormat = (interval: number) => {
    if (interval >= 3600) {
      return `${interval / 3600} hour`;
    } else if (interval > 60) {
      return `${interval / 60} minutes`;
    } else {
      return `${interval} seconds`;
    }
  };

  const { data } = useGetInstancesQuery(
    qs.stringify({ page: currentPage, limit: 5, q: searchTermQuery })
  );

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-lg font-semibold">Monitoring Instances</h2>
            <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search instances..."
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
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Uptime %</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.list && data?.list?.length > 0 ? (
                  data.list.map((instance) => (
                    <TableRow key={instance.id}>
                      <TableCell className="font-medium">
                        {instance.name}
                      </TableCell>
                      <TableCell>{instance.url}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full ${getStatusDot(
                              instance.status
                            )} mr-2`}
                          />
                          <span className={getStatusColor(instance.status)}>
                            {instance.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getIntervalFormat(Number(instance.interval))}
                      </TableCell>
                      <TableCell>{instance.responseTime || "-"}</TableCell>
                      <TableCell>{instance.uptime}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(instance)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(instance)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No instances found
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

                {Array.from({
                  length: data?.pagination?.totalPages || 0,
                }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, data?.pagination?.totalPages || 0)
                      )
                    }
                    className={
                      currentPage === (data?.pagination?.totalPages || 0)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditInstanceModal
        instance={selectedInstance}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onFinish={handleOnFinishEdit}
      />

      {/* Delete Modal */}
      <DeleteInstanceModal
        instance={selectedInstance}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onFinish={handleOnFinishDelete}
      />
    </>
  );
}
