import { getAccordionVirtual } from './TkoDataVirtual';
import TkoVirtualAccordion from './TkoVirtualAccordion';

const VirtualTkoAccordion = ({ selectedTko }) => {
  const accordion = getAccordionVirtual(selectedTko);
  return (
    <div>
      {accordion?.map((section, index) => (
        <TkoVirtualAccordion key={index} section={section} sectionIndex={index} />
      ))}
    </div>
  );
};

export default VirtualTkoAccordion;
