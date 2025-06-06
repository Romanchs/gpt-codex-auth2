import { useParams } from 'react-router-dom';

import DefaultDirectory from './Default/DefaultDirectory';
import GridAccessProvider from './GridAccessProvider/GridAccessProvider';
import Suppliers from './Suppliers/Suppliers';
import Companies from './Companies';
import ZBinding from './ZBinding';
import BsusAggregatedGroup from './BsusAggregatedGroup';
import SpecialMeteringGridArea from './SpecialMeteringGridArea';

const Directory = () => {
  const { id } = useParams();
  switch (id) {
    case 'suppliers':
      return <Suppliers />;
    case 'gridAccessProvider':
      return <GridAccessProvider />;
    case 'companies':
      return <Companies />;
    case 'z-binding':
      return <ZBinding />;
    case 'bsusAggregatedGroup':
      return <BsusAggregatedGroup />;
    case 'specialMeteringGridArea':
      return <SpecialMeteringGridArea />;
    default:
      return <DefaultDirectory />;
  }
};

export default Directory;
