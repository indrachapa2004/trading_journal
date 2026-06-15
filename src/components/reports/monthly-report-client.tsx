"use client";

import { useEffect } from "react";

import { PrintReportButton } from "@/components/reports/print-report-button";

export function MonthlyReportClient() {
  useEffect(() => {
    document.title = "Monthly Trading Review";
  }, []);

  return (
    <div className="print:hidden fixed bottom-6 right-6 z-50">
      <PrintReportButton />
    </div>
  );
}
