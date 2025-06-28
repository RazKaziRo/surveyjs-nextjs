'use client'

import { useState, useEffect } from "react";
import { ICreatorOptions } from "survey-creator-core";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
// Enable Ace Editor in the JSON Editor tab
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-searchbox";

import { json as defaultJson } from "../../data/survey_json";

const defaultCreatorOptions: ICreatorOptions = {
  showTranslationTab: true
};

export default function SurveyCreatorWidget(props: { json?: Object, options?: ICreatorOptions }) {
  const [creator, setCreator] = useState<SurveyCreator | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!creator) {
      const newCreator = new SurveyCreator(props.options || defaultCreatorOptions);
      newCreator.saveSurveyFunc = (no: number, callback: (num: number, status: boolean) => void) => {
        console.log(JSON.stringify(newCreator?.JSON));
        callback(no, true);
      };
      setCreator(newCreator);
    }
  }, [creator, props.options]);

  useEffect(() => {
    if (creator) {
      creator.JSON = props.json || defaultJson;
    }
  }, [creator, props.json]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!creator) {
    return <div>Initializing...</div>;
  }

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
