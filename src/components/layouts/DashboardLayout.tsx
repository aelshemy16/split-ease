"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      name: 'Friends',
      href: '/dashboard/friends',
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      name: 'Transactions',
      href: '/dashboard/transactions',
      icon: <Receipt className="mr-2 h-4 w-4" />,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={`flex items-center rounded-lg px-3 py-2 transition-all ${isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'
          }`}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-background border-r">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-xl font-bold">SplitEase</h1>
        </div>

        <div className="flex-1 overflow-auto py-4 px-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">User Name</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 border-b bg-background z-10">
        <div className="flex h-full items-center px-4 justify-between">
          <h1 className="text-xl font-bold">SplitEase</h1>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-14 items-center border-b px-4 justify-between">
                <h1 className="text-xl font-bold">SplitEase</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-4 px-3">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <div key={item.name} onClick={() => setIsMobileMenuOpen(false)}>
                      <NavItem item={item} />
                    </div>
                  ))}
                </nav>
              </div>
              <div className="border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium">User Name</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden h-14" /> {/* Spacer for mobile header */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 