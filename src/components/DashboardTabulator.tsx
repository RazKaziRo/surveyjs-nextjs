'use client'

import { useEffect, useState } from "react";
import { data, json } from "../../data/dashboard_data";

import jsPDF from "jspdf";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);
// import * as XLSX from "xlsx";

import { Tabulator } from "survey-analytics/survey.analytics.tabulator";
import { Model } from "survey-core";
import "survey-analytics/survey.analytics.tabulator.css";
import "tabulator-tables/dist/css/tabulator.min.css";

export default function DashboardTabulator() {
  const [vizPanel, setVizPanel] = useState<Tabulator | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!vizPanel) {
      const survey = new Model(json);
      const newVizPanel = new Tabulator(survey, data, {
        jspdf: jsPDF,
        // xlsx: XLSX
      });
      setVizPanel(newVizPanel);
    }
  }, [vizPanel]);

  useEffect(() => {
    if (vizPanel && isClient) {
      vizPanel.render("summaryContainer");
    }
  }, [vizPanel, isClient]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return <div style={{ height: "80vh", width: "100%" }} id="summaryContainer"></div>;
}
