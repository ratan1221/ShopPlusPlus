
import { RiAdminFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Layers3, LayoutDashboard, ShoppingBasket } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export const adminSidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboard size={36} strokeWidth={2.25} />
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
    icon: <ShoppingBasket size={36} />

  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/admin/orders',
    icon: <Layers3 size={36} />
  }
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  return (
    <nav className="mt-8 flex-col flex gap-2">
      {
        adminSidebarMenuItems.map(menuItem => (
          <div key={menuItem.id} onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
            className="flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        )
        )}

    </nav>
  )
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return <>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2 mt-5 mb-5">
              <RiAdminFill size={30} />
              <span>Admin Panel</span>
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </div>
      </SheetContent>

    </Sheet>
    <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
      <div onClick={() => navigate('/admin/dashboard')}
        className="flex items-center gap-2 cursor-pointer">
        <RiAdminFill size={36} />
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <MenuItems />
    </aside>

  </>
}

export default AdminSidebar;
