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
import { Edit, Trash2, ArrowUpDown, Search } from "lucide-react";
import { EditInstanceModal } from "@/components/edit-instance-modal";
import { DeleteInstanceModal } from "@/components/delete-instance-modal";
import type { Instance } from "@/types/instance";

const initialInstances: Instance[] = [
  {
    id: "1",
    name: "Authentication Service",
    url: "https://auth.example.com",
    status: "Offline",
    interval: "5m",
    responseTime: "450ms",
    uptime: "98.2%",
  },
  {
    id: "2",
    name: "Database Cluster",
    url: "https://db.example.com",
    status: "Offline",
    interval: "1m",
    responseTime: null,
    uptime: "95.7%",
  },
  {
    id: "3",
    name: "Production API",
    url: "https://api.example.com",
    status: "Online",
    interval: "5m",
    responseTime: "235ms",
    uptime: "99.98%",
  },
  {
    id: "4",
    name: "Staging Environment",
    url: "https://staging.example.com",
    status: "Online",
    interval: "10m",
    responseTime: "312ms",
    uptime: "99.5%",
  },
  {
    id: "5",
    name: "Payment Processing",
    url: "https://payments.example.com",
    status: "Offline",
    interval: "1m",
    responseTime: null,
    uptime: "92.3%",
  },
  {
    id: "6",
    name: "User Dashboard",
    url: "https://dashboard.example.com",
    status: "Online",
    interval: "5m",
    responseTime: "189ms",
    uptime: "99.9%",
  },
  {
    id: "7",
    name: "Content Delivery Network",
    url: "https://cdn.example.com",
    status: "Online",
    interval: "15m",
    responseTime: "45ms",
    uptime: "100%",
  },
  {
    id: "8",
    name: "Email Service",
    url: "https://email.example.com",
    status: "Offline",
    interval: "5m",
    responseTime: "520ms",
    uptime: "97.8%",
  },
];

type SortField =
  | "name"
  | "url"
  | "status"
  | "interval"
  | "responseTime"
  | "uptime";
type SortDirection = "asc" | "desc";

export function MonitoringInstancesTable() {
  const [instances, setInstances] = useState<Instance[]>(initialInstances);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(
    null
  );

  const itemsPerPage = 5;

  // Handle search
  const filteredInstances = instances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sorting
  const sortedInstances = [...filteredInstances].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle null values for responseTime
    if (sortField === "responseTime") {
      aValue = a.responseTime || "0ms";
      bValue = b.responseTime || "0ms";
    }

    // Remove non-numeric characters for numeric comparisons
    if (sortField === "responseTime" || sortField === "uptime") {
      aValue = String(aValue || "").replace(/[^0-9.]/g, "");
      bValue = String(bValue || "").replace(/[^0-9.]/g, "");
    }

    if (sortDirection === "asc") {
      return String(aValue || "") > String(bValue || "") ? 1 : -1;
    } else {
      return String(aValue || "") < String(bValue || "") ? 1 : -1;
    }
  });

  // Handle pagination
  const totalPages = Math.ceil(sortedInstances.length / itemsPerPage);
  const paginatedInstances = sortedInstances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (instance: Instance) => {
    setSelectedInstance(instance);
    setEditModalOpen(true);
  };

  const handleDelete = (instance: Instance) => {
    setSelectedInstance(instance);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = (updatedInstance: Instance) => {
    setInstances(
      instances.map((instance) =>
        instance.id === updatedInstance.id ? updatedInstance : instance
      )
    );
  };

  const handleConfirmDelete = (id: string) => {
    setInstances(instances.filter((instance) => instance.id !== id));
  };

  const getStatusColor = (status: Instance["status"]) => {
    switch (status) {
      case "Online":
        return "text-green-500";
      case "Offline":
        return "text-red-500";
      default:
        return "";
    }
  };

  const getStatusDot = (status: Instance["status"]) => {
    switch (status) {
      case "Online":
        return "bg-green-500";
      case "Offline":
        return "bg-red-500";
      default:
        return "";
    }
  };

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[250px]"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("url")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      URL <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Status <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("interval")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Interval <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("responseTime")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Response Time <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("uptime")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Uptime % <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInstances.length > 0 ? (
                  paginatedInstances.map((instance) => (
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
                      <TableCell>{instance.interval}</TableCell>
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

          {totalPages > 1 && (
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

                {Array.from({ length: totalPages }).map((_, i) => (
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
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
        onSave={handleSaveEdit}
      />

      {/* Delete Modal */}
      <DeleteInstanceModal
        instance={selectedInstance}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
