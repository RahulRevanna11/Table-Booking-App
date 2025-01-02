"use client";

import React from "react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

const buttonVariants = ({ variant }: { variant: string }) => {
  switch (variant) {
    case "outline":
      return "border border-gray-300 text-gray-700";
    case "ghost":
      return "bg-transparent hover:bg-gray-100 text-gray-700";
    default:
      return "";
  }
};

export type CalendarProps = Omit<DayPickerProps, "classNames"> & {
  className?: string;
};

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      {...props}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-white hover:bg-primary-dark focus:bg-primary-dark",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50",
        day_disabled: "text-muted-foreground opacity-50",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
    />
  );
}