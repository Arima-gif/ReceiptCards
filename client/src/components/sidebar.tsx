import { Receipt, Clock, Download, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const menuItems = [
    { icon: Receipt, label: "All Receipts", active: true, testId: "nav-all-receipts" },
    { icon: Clock, label: "Pending Approval", active: false, testId: "nav-pending" },
    { icon: Download, label: "Scheduled Exports", active: false, testId: "nav-schedules" },
    { icon: Settings, label: "Settings", active: false, testId: "nav-settings" },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary flex items-center" data-testid="app-title">
          <Receipt className="mr-2 h-5 w-5" />
          Receipt Manager
        </h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a
                  href="#"
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  data-testid={item.testId}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
