import React from 'react';
import { useHelpLogic } from './HelpPage.logic';
import { HelpTemplate } from './HelpPage.template';

const HelpPage: React.FC = () => {
  const state = useHelpLogic();
  return <HelpTemplate state={state} />;
};

export default HelpPage;
