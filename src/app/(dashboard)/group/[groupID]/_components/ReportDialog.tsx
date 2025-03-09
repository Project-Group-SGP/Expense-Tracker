// components/GroupReportDialog.tsx
"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CategoryTypes } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateGroupReport } from "../group";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TbReportAnalytics } from "react-icons/tb";
import { motion } from "framer-motion";

// Custom hook for media query if not already available in your project
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);
  
  React.useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    
    // Initial check
    updateMatch();
    
    // Listen for changes
    media.addEventListener("change", updateMatch);
    return () => media.removeEventListener("change", updateMatch);
  }, [query]);
  
  return matches;
};

interface GroupReportDialogProps {
  groupId: string;
}

// Form validation schema
const formSchema = z
  .object({
    reportType: z.enum([
      "last_month",
      "last_3_months",
      "last_6_months",
      "custom",
    ]),
    reportFormat: z.enum(["pdf", "excel", "csv"]),
    includeCharts: z.boolean().default(true),
    isDetailed: z.boolean().default(false),
    includeMemberDetails: z.boolean().default(false),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    selectedCategories: z.array(z.nativeEnum(CategoryTypes)).default([]),
  })
  .refine(
    (data) => {
      // Validate date range when custom is selected
      if (data.reportType === "custom") {
        if (!data.startDate || !data.endDate) {
          return false;
        }
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"],
    }
  );

// Enhanced Report Button Component
function EnhancedReportButton() {
  const [isHovered, setIsHovered] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 10 }
  };
  
  return (
    <DialogTrigger asChild>
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-block"
      >
        <Button 
          variant="outline" 
          className={`relative overflow-hidden transition-all duration-300 ${
            isHovered ? "bg-primary/10 border-primary" : ""
          } ${isMobile ? "px-3 py-2 h-9" : "px-4 py-2 h-10"}`}
        >
          <div className="flex items-center gap-2">
            <motion.div
              variants={iconVariants}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <TbReportAnalytics className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-primary`} />
            </motion.div>
            
            {!isMobile && (
              <span className="font-medium">
                Generate Report
              </span>
            )}
            
            {isHovered && !isMobile && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0"
                style={{ zIndex: -1 }}
              />
            )}
          </div>
        </Button>
      </motion.div>
    </DialogTrigger>
  );
}

export function GroupReportDialog({ groupId }: GroupReportDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Initialize the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportType: "last_month",
      reportFormat: "pdf",
      includeCharts: true,
      isDetailed: false,
      includeMemberDetails: false,
      startDate: undefined,
      endDate: undefined,
      selectedCategories: [],
    },
  });

  const watchReportType = form.watch("reportType");
  const watchReportFormat = form.watch("reportFormat");

  const handleGenerateReport = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const reportParams = {
        groupId,
        reportType: values.reportType,
        reportFormat: values.reportFormat,
        includeCharts: values.includeCharts,
        isDetailed: values.isDetailed,
        includeMemberDetails: values.includeMemberDetails,
        startDate: values.startDate,
        endDate: values.endDate,
        selectedCategories: values.selectedCategories,
      };

      const result = await generateGroupReport(
        reportParams.groupId,
        reportParams.reportType,
        reportParams.startDate,
        reportParams.endDate,
        reportParams.reportFormat,
        reportParams.includeCharts,
        reportParams.isDetailed,
        reportParams.selectedCategories,
        reportParams.includeMemberDetails
      );

      const link = document.createElement("a");
      link.href = `data:${result.mimeType};base64,${result.buffer}`;
      link.download = `${result.name || "group"}_report.${
        result.fileExtension
      }`;
      link.click();

      setIsOpen(false);
    } catch (error) {
      console.error("Error generating group report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <EnhancedReportButton />
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Group Report</DialogTitle>
          <DialogDescription>
            Configure your group report settings and generate the report.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGenerateReport)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Period</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="last_3_months">
                        Last 3 Months
                      </SelectItem>
                      <SelectItem value="last_6_months">
                        Last 6 Months
                      </SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchReportType === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="reportFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="includeCharts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={watchReportFormat !== "pdf"}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Charts (PDF only)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDetailed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Detailed Report</FormLabel>
                      <FormDescription>
                        Includes comprehensive transaction history
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeMemberDetails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Member Splits</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <TbReportAnalytics className="w-4 h-4" />
                      </motion.div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <TbReportAnalytics className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" 
                  style={{ zIndex: 0 }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}