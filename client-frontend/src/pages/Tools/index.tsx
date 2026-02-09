import React from 'react';
import { useToolsLogic } from './ToolsPage.logic';
import { ToolsTemplate } from './ToolsPage.template';

const ToolsPage: React.FC = () => {
  const state = useToolsLogic();
  return <ToolsTemplate state={state} />;
};

export default ToolsPage;
