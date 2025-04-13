import { Outlet } from "react-router-dom";
import SideBar from "../../Components/SideBar";

const AdminLayout = () => {
  return (
    <div className="grid grid-cols-12">
      <div className="xl:col-span-2 hidden xl:block h-[90vh]">
        <SideBar />
      </div>
      <div className="xl:col-span-10 col-span-12 p-4">
        <div className="xl:hidden">
        <SideBar />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;