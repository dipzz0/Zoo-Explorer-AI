import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Heart, History, Ticket } from "lucide-react";

export function ProfileMenu() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initial = (profile?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-10 w-10 rounded-full font-semibold text-primary-foreground shadow-md hover:scale-105 transition-transform" style={{ background: "var(--gradient-sunset)" }}>
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="font-semibold text-foreground">{profile?.name || "Visitor"}</div>
          <div className="text-xs font-normal text-muted-foreground truncate">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/favorites"><Heart className="mr-2 h-4 w-4" />Favorites</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/history"><History className="mr-2 h-4 w-4" />Scan History</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/tickets"><Ticket className="mr-2 h-4 w-4" />My Tickets</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => { await signOut(); navigate({ to: "/auth", search: { redirect: location.pathname } }); }} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
