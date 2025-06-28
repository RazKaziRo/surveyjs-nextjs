'use client'

import { useEffect, useState } from "react";
import { data, json } from "../../data/dashboard_data";
import { VisualizationPanel } from "survey-analytics";
import "survey-analytics/survey.analytics.css";
import { Model } from "survey-core";

export default function Dashboard() {
  const [vizPanel, setVizPanel] = useState<VisualizationPanel | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!vizPanel) {
      const survey = new Model(json);
      const newVizPanel = new VisualizationPanel(survey.getAllQuestions(), data);
      setVizPanel(newVizPanel);
    }
  }, [vizPanel]);

  useEffect(() => {
    if (vizPanel && isClient) {
      vizPanel.render("surveyVizPanel");
      return () => {
        vizPanel?.clear();
      }
    }
  }, [vizPanel, isClient]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return <div id="surveyVizPanel" style={{"margin": "auto", "width": "100%", "maxWidth": "1400px"}}></div>;
}
