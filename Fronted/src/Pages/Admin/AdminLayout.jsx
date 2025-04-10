import { Outlet } from "react-router-dom";
import SideBar from "../../Components/SideBar";

const AdminLayout = () => {
  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-2 h-[90vh]">
        <SideBar />
      </div>
      <div className="col-span-10 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;