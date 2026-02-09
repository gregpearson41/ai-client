import React from 'react';
import { useDashboardLogic } from './DashboardPage.logic';
import { DashboardTemplate } from './DashboardPage.template';

const DashboardPage: React.FC = () => {
  const state = useDashboardLogic();
  return <DashboardTemplate state={state} />;
};

export default DashboardPage;
