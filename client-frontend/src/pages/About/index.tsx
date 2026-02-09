import React from 'react';
import { useAboutLogic } from './AboutPage.logic';
import { AboutTemplate } from './AboutPage.template';

const AboutPage: React.FC = () => {
  const state = useAboutLogic();
  return <AboutTemplate state={state} />;
};

export default AboutPage;
