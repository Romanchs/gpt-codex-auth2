import ChangeStatusModal from './ChangeStatusModal';
import DeleteTkoModal from './DeleteTkoModal';
import ChangeDueDateModal from './ChangeDueDateModal';
import RestartProcessModal from './RestartProcessModal';

const TechModalHandler = ({ data, handleClose }) => {
  return (
    <>
      <ChangeStatusModal data={data} handleClose={handleClose} />
      <DeleteTkoModal data={data} handleClose={handleClose} />
      <ChangeDueDateModal data={data} handleClose={handleClose} />
      <RestartProcessModal data={data} handleClose={handleClose} />
    </>
  );
};

export default TechModalHandler;
