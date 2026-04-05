"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange>({ from, to });

  React.useEffect(() => {
    setRange({ from, to });
  }, [from, to]);

  function handleSelect(selected: DateRange | undefined) {
    if (!selected) return;
    setRange(selected);
    if (selected.from && selected.to) {
      onChange({ from: selected.from, to: selected.to });
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
          !range.from && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="h-4 w-4" />
        {range.from ? (
          range.to ? (
            <>
              {format(range.from, "yyyy.MM.dd", { locale: ko })} ~{" "}
              {format(range.to, "yyyy.MM.dd", { locale: ko })}
            </>
          ) : (
            format(range.from, "yyyy.MM.dd", { locale: ko })
          )
        ) : (
          "기간 선택"
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          defaultMonth={from}
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={ko}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
}
