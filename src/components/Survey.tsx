'use client'

import { useState, useEffect } from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import 'survey-core/survey-core.css'
import { json } from '../../data/survey_json.js'
  
export default function SurveyComponent() {
  const [isClient, setIsClient] = useState(false);
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    setIsClient(true);
    const surveyModel = new Model(json);
    setModel(surveyModel);
  }, []);

  if (!isClient || !model) {
    return <div>Loading...</div>;
  }

  return (
    <Survey model={model}/>
  );
}
