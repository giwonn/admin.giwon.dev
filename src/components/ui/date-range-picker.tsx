"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);

  function handleFromSelect(selected: Date | undefined) {
    if (!selected) return;
    const newFrom = selected > to ? to : selected;
    onChange({ from: newFrom, to });
    setOpenFrom(false);
  }

  function handleToSelect(selected: Date | undefined) {
    if (!selected) return;
    const newTo = selected < from ? from : selected;
    onChange({ from, to: newTo });
    setOpenTo(false);
  }

  return (
    <div className="flex items-center gap-1">
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger
          className={cn(
            "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {format(from, "yyyy.MM.dd", { locale: ko })}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            defaultMonth={from}
            selected={from}
            onSelect={handleFromSelect}
            locale={ko}
            disabled={{ after: to }}
          />
        </PopoverContent>
      </Popover>

      <span className="text-sm text-gray-500">~</span>

      <Popover open={openTo} onOpenChange={setOpenTo}>
        <PopoverTrigger
          className={cn(
            "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {format(to, "yyyy.MM.dd", { locale: ko })}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            defaultMonth={to}
            selected={to}
            onSelect={handleToSelect}
            locale={ko}
            disabled={{ before: from, after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
