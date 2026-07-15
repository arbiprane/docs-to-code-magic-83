import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export type Filters = {
  search: string;
  risk: string;
  exposure: string;
  collar: string;
  category: string;
};

export const emptyFilters: Filters = {
  search: "",
  risk: "all",
  exposure: "all",
  collar: "all",
  category: "all",
};

export function FilterBar({
  filters,
  categories,
  onChange,
  onReset,
}: {
  filters: Filters;
  categories: string[];
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  const isFiltered =
    filters.search !== "" ||
    filters.risk !== "all" ||
    filters.exposure !== "all" ||
    filters.collar !== "all" ||
    filters.category !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search job title, category, or tasks…"
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-nowrap">
        <Select
          value={filters.risk}
          onValueChange={(v) => onChange({ ...filters, risk: v })}
        >
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="High">High Risk</SelectItem>
            <SelectItem value="Medium">Medium Risk</SelectItem>
            <SelectItem value="Low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.exposure}
          onValueChange={(v) => onChange({ ...filters, exposure: v })}
        >
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="AI Exposure" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exposure</SelectItem>
            <SelectItem value="High">High Exposure</SelectItem>
            <SelectItem value="Medium">Medium Exposure</SelectItem>
            <SelectItem value="Low">Low Exposure</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.collar}
          onValueChange={(v) => onChange({ ...filters, collar: v })}
        >
          <SelectTrigger className="w-full lg:w-[150px]">
            <SelectValue placeholder="Collar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collars</SelectItem>
            <SelectItem value="White Collar">White Collar</SelectItem>
            <SelectItem value="Blue Collar">Blue Collar</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.category}
          onValueChange={(v) => onChange({ ...filters, category: v })}
        >
          <SelectTrigger className="w-full lg:w-[170px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-4 w-4" /> Reset
        </Button>
      )}
    </div>
  );
}
