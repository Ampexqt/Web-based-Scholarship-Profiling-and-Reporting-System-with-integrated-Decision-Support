import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarFooter, 
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, FileText, Settings, LogOut, CheckCircle } from "lucide-react"
import logo from "@/assets/logo.png"

export default function AdminLayout() {
  const location = useLocation()
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen overflow-hidden bg-background w-full">
        <Sidebar collapsible="icon" className="border-r border-border">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" render={<Link to="/admin" />}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent">
                    <img src={logo} alt="ZPPSU Logo" className="size-8 object-contain" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">ZPPSU Admin</span>
                    <span className="truncate text-xs text-muted-foreground">Scholarships</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="py-2">
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin" />} isActive={location.pathname === '/admin'}>
                      <LayoutDashboard className="w-5 h-5 mr-1" />
                      <span className="text-sm">Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/applications" />} isActive={location.pathname.startsWith('/admin/applications')}>
                      <FileText className="w-5 h-5 mr-1" />
                      <span className="text-sm">Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/verifications" />} isActive={location.pathname.startsWith('/admin/verifications')}>
                      <CheckCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm">Decision Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/reports" />} isActive={location.pathname.startsWith('/admin/reports')}>
                      <Users className="w-5 h-5 mr-1" />
                      <span className="text-sm">Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-2">
             <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" className="text-destructive hover:text-destructive">
                    <LogOut className="w-5 h-5 mr-1" />
                    <span className="text-sm">Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto bg-muted/20 relative">
          <div className="h-14 flex items-center px-4 border-b border-border bg-background sticky top-0 z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </div>
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
