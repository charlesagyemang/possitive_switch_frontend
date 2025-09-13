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
        {name && <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{name}</h2>}
        <span className="text-xs ml-auto text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{from}</span>
          {" - "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{to}</span>
          {" of "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {totalRecords}
          </span>{" "}
          records
        </span>
      </div>
      <div className="rounded-xl border border-purple-100 dark:border-purple-500/30 overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="font-bold text-xs bg-purple-50 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200 uppercase tracking-wide px-4 py-3"
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
          <TableBody className="bg-white dark:bg-gray-800/30">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition border-b border-purple-100 dark:border-purple-700/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300" key={cell.id}>
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
                  className="h-24 text-center p-4 text-gray-400 dark:text-gray-500"
                >
                  <Image
                    width={100}
                    height={100}
                    src="/empty.svg"
                    alt="No data"
                    className="mx-auto mb-2 opacity-50 dark:opacity-30"
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
                      ? "hover:bg-primary/10 dark:hover:bg-purple-500/20"
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
                        ? "bg-white dark:bg-purple-600 text-primary dark:text-white border-primary dark:border-purple-600 hover:bg-primary/90 hover:text-white"
                        : "hover:bg-gray-100 dark:hover:bg-purple-500/20 dark:text-gray-300"
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
                      ? "hover:bg-primary/10 dark:hover:bg-purple-500/20"
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
