import React from 'react';
import TkoAccordion from './TkoAccordion';
import getAccordion from './TkoData';

const ListTab = ({ selectedTko }) => {
  const accordion = getAccordion(selectedTko);

  return (
    <div>
      {accordion.map((section, index) => (
        <TkoAccordion key={index} section={section} sectionIndex={index} />
      ))}
    </div>
  );
};

export default ListTab;
