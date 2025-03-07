import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ArrowUpRight, ArrowDownRight, Users, Receipt } from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to SplitEase, your personal expense tracking and bill splitting app.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Owed to You</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">$240.00</div>
              <p className="text-xs text-muted-foreground">
                From 3 friends
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total You Owe</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">$120.50</div>
              <p className="text-xs text-muted-foreground">
                To 2 friends
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Friends</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                2 pending invitations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                3 unsettled
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your most recent expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be populated with actual transaction data */}
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Dinner at Restaurant</p>
                    <p className="text-sm text-muted-foreground">Split with Alex, John</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-500">-$45.00</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Movie Tickets</p>
                    <p className="text-sm text-muted-foreground">Split with Sarah</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">+$24.00</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Groceries</p>
                    <p className="text-sm text-muted-foreground">Split with Roommates</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">+$32.50</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Friend Balances</CardTitle>
              <CardDescription>Who owes you and who you owe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be populated with actual friend data */}
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      A
                    </div>
                    <p className="font-medium">Alex Smith</p>
                  </div>
                  <p className="font-medium text-green-500">+$120.00</p>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      J
                    </div>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <p className="font-medium text-green-500">+$85.50</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      S
                    </div>
                    <p className="font-medium">Sarah Johnson</p>
                  </div>
                  <p className="font-medium text-red-500">-$65.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 