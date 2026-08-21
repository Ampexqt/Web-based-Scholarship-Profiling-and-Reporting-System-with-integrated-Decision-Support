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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, FileText, LogOut, CheckCircle, History } from "lucide-react"
import logo from "@/assets/logo.png"

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

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
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
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
                    <SidebarMenuButton size="lg" render={<Link to="/admin" />} isActive={location.pathname === '/admin'} tooltip="Overview">
                      <LayoutDashboard />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/applications" />} isActive={location.pathname.startsWith('/admin/applications')} tooltip="Applications">
                      <FileText />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/decision-support" />} isActive={location.pathname.startsWith('/admin/decision-support')} tooltip="Decision Support">
                      <CheckCircle />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">Decision Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/reports" />} isActive={location.pathname.startsWith('/admin/reports')} tooltip="Reports">
                      <FileText />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/audit-logs" />} isActive={location.pathname.startsWith('/admin/audit-logs')} tooltip="Audit Logs">
                      <History />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">Audit Logs</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
{/*
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" render={<Link to="/admin/staff-management" />} isActive={location.pathname.startsWith('/admin/staff-management')} tooltip="Staff Accounts">
                      <Users />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">Staff Accounts</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  */}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger render={
                    <SidebarMenuButton size="lg" className="text-destructive hover:text-destructive group-data-[collapsible=icon]:!text-destructive" tooltip="Sign Out" />
                  }>
                    <LogOut />
                    <span className="text-sm group-data-[collapsible=icon]:hidden">Sign Out</span>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px] p-8">
                    <div className="flex flex-col items-center text-center space-y-5">
                      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <LogOut className="w-8 h-8 text-destructive" strokeWidth={2.5} />
                      </div>
                      <div className="space-y-2">
                        <AlertDialogTitle className="text-2xl font-bold tracking-tight">Sign Out</AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-muted-foreground">
                          Are you sure you want to log out? You will need to enter your credentials to access the dashboard again.
                        </AlertDialogDescription>
                      </div>
                    </div>
                    <AlertDialogFooter className="flex w-full gap-3 sm:space-x-0 mt-8">
                      <AlertDialogCancel className="flex-1 h-12 text-base font-semibold border-2 rounded-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => navigate('/login')}
                        className="flex-1 h-12 text-base font-semibold bg-destructive text-white hover:bg-destructive/90 shadow-sm rounded-xl">
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
