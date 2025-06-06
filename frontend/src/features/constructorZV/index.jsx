import {Navigate, Route, Routes} from "react-router-dom";
import ConstructorZV from "./ConstructorZV";

const ConstructorPointsZV = () => {
  return (
    <Routes>
      <Route index element={<ConstructorZV/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
};

export default ConstructorPointsZV;