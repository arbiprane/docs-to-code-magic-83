import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { JobImpact } from "@/lib/jobs-data";
import { RiskBadge } from "./RiskBadge";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Eye,
  Inbox,
} from "lucide-react";

const columnLabels: Record<string, string> = {
  jobTitle: "Job Title",
  jobCategory: "Category",
  collarType: "Collar",
  mainTasks: "Main Tasks",
  aiExposureLevel: "AI Exposure",
  replacementRiskLevel: "Replacement Risk",
  humanRelevantSkills: "Human-Relevant Skills",
  validationNote: "Validation Note",
  actions: "Action",
};

export function JobsDataTable({
  data,
  onView,
  onResetFilters,
  hasFilters,
}: {
  data: JobImpact[];
  onView: (job: JobImpact) => void;
  onResetFilters: () => void;
  hasFilters: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    mainTasks: false,
    validationNote: false,
  });

  const columns = useMemo<ColumnDef<JobImpact>[]>(
    () => [
      {
        accessorKey: "jobTitle",
        header: "Job Title",
        cell: ({ row }) => (
          <div className="font-medium text-foreground">
            {row.original.jobTitle}
          </div>
        ),
      },
      {
        accessorKey: "jobCategory",
        header: "Category",
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "collarType",
        header: "Collar",
        cell: ({ getValue }) => (
          <span className="inline-flex rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "mainTasks",
        header: "Main Tasks",
        cell: ({ getValue }) => (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="line-clamp-1 block max-w-[260px] text-sm text-muted-foreground">
                  {getValue<string>()}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {getValue<string>()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        accessorKey: "aiExposureLevel",
        header: "AI Exposure",
        cell: ({ getValue }) => (
          <RiskBadge level={getValue<JobImpact["aiExposureLevel"]>()} />
        ),
        sortingFn: (a, b) => {
          const order = { Low: 0, Medium: 1, High: 2 } as const;
          return order[a.original.aiExposureLevel] - order[b.original.aiExposureLevel];
        },
      },
      {
        accessorKey: "replacementRiskLevel",
        header: "Replacement Risk",
        cell: ({ getValue }) => (
          <RiskBadge level={getValue<JobImpact["replacementRiskLevel"]>()} />
        ),
        sortingFn: (a, b) => {
          const order = { Low: 0, Medium: 1, High: 2 } as const;
          return (
            order[a.original.replacementRiskLevel] -
            order[b.original.replacementRiskLevel]
          );
        },
      },
      {
        accessorKey: "humanRelevantSkills",
        header: "Human-Relevant Skills",
        enableSorting: false,
        cell: ({ getValue }) => (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="line-clamp-1 block max-w-[220px] text-sm text-muted-foreground">
                  {getValue<string>()}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {getValue<string>()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        accessorKey: "validationNote",
        header: "Validation Note",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="line-clamp-2 block max-w-[220px] text-xs text-muted-foreground">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(row.original)}
              className="h-8"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View Analysis
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="rounded-lg border border-border/60 bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {totalRows === 0 ? 0 : pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, totalRows)}
          </span>{" "}
          of <span className="font-medium text-foreground">{totalRows}</span> jobs
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="mr-1.5 h-3.5 w-3.5" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={c.getIsVisible()}
                  onCheckedChange={(v) => c.toggleVisibility(!!v)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {columnLabels[c.id] ?? c.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="max-h-[640px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((h) => {
                  const sorted = h.column.getIsSorted();
                  const canSort = h.column.getCanSort();
                  return (
                    <TableHead
                      key={h.id}
                      className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {h.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={h.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 hover:text-foreground"
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {sorted === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(h.column.columnDef.header, h.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-16 text-center"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Inbox className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No matching jobs
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your filters or search keywords.
                    </p>
                    {hasFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="mt-2"
                      >
                        Reset filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Rows per page
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">{pageIndex + 1}</span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {table.getPageCount() || 1}
            </span>
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
