import {Navigate, Route, Routes} from "react-router-dom";
import ProcessManager from "./ProcessManager";
import RegisterDetails from "./Register/RegisterDetails";

const ProcessManagers = () => {
  return (
    <Routes>
      <Route index element={<ProcessManager/>}/>
      <Route path={'/:uid'} element={<RegisterDetails/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
};

export default ProcessManagers;