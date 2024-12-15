import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {

  const [openSidebar, setOpenSideBar] = useState(false);


  return (
    <div className="flex min-h-screen w-full">
      {/*admin sidebar*/}
      <AdminSidebar open={openSidebar} setOpen={setOpenSideBar} />
      <div className="flex flex-1 flex-col">
        {/*admin header */}
        <AdminHeader setOpen={setOpenSideBar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
