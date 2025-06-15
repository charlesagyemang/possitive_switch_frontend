"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useState } from "react";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  name?: string;
  showPagination?: boolean;
  pageSize?: number; // Allow pageSize to be passed as a prop
  noRecordsText?: string; // Optional prop for no records text
}

export function GenericTable<TData, TValue>({
  columns,
  data,
  name,
  showPagination = true,
  pageSize = 10, // Allow pageSize to be passed as a prop
  noRecordsText = "No records found", // Optional prop for no records text
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(0);
  //   const pageSize = 10; // Set a default page size

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const totalRecords = data.length;
  const from = totalRecords === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRecords);

  return (
    <div className="w-full max-w-8xl mx-auto  rounded-xl ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        {name && <h2 className="text-2xl font-bold text-gray-800">{name}</h2>}
        <span className="text-xs ml-auto text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          Showing <span className="font-semibold text-gray-700">{from}</span>
          {" - "}
          <span className="font-semibold text-gray-700">{to}</span>
          {" of "}
          <span className="font-semibold text-gray-700">
            {totalRecords}
          </span>{" "}
          records
        </span>
      </div>
      <div className="rounded-xl border border-purple-100 overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="font-bold text-xs bg-purple-50 text-gray-800 uppercase tracking-wide px-4 py-3"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-red-50/50 transition border-b-purple-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-3" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center p-4 text-gray-400"
                >
                  <Image
                    width={100}
                    height={100}
                    src="/empty.svg"
                    alt="No data"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm">{noRecordsText}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ------------------- PAGINATION AREA ---------------- */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                  className={
                    table.getCanPreviousPage()
                      ? "hover:bg-primary/10"
                      : "opacity-50 pointer-events-none"
                  }
                />
              </PaginationItem>

              {[...Array(pageCount)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      table.setPageIndex(i);
                    }}
                    className={
                      i === currentPage
                        ? "bg-white text-primary border-primary hover:bg-primary/90 hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pageCount > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                  className={
                    table.getCanNextPage()
                      ? "hover:bg-primary/10"
                      : "opacity-50 pointer-events-none"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          {/* <div>
            <span className="text-xs text-gray-400">
              Page {currentPage + 1} of {pageCount}
            </span>
          </div> */}
        </div>
      )}
    </div>
  );
}
