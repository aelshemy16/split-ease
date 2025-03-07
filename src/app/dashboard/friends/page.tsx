import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Plus, UserPlus, Mail, Copy, Check } from 'lucide-react';

export default function FriendsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Friends</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Friend
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="all">All Friends</TabsTrigger>
            <TabsTrigger value="owe-you">Owe You</TabsTrigger>
            <TabsTrigger value="you-owe">You Owe</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Friend cards would be dynamically generated */}
              <FriendCard
                name="Alex Smith"
                email="alex@example.com"
                balance={120}
                direction="positive"
              />
              <FriendCard
                name="John Doe"
                email="john@example.com"
                balance={85.5}
                direction="positive"
              />
              <FriendCard
                name="Sarah Johnson"
                email="sarah@example.com"
                balance={65}
                direction="negative"
              />
              <FriendCard
                name="Emily Davis"
                email="emily@example.com"
                balance={0}
                direction="neutral"
              />
              <FriendCard
                name="Michael Brown"
                email="michael@example.com"
                balance={42.75}
                direction="positive"
              />
            </div>
          </TabsContent>

          <TabsContent value="owe-you" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FriendCard
                name="Alex Smith"
                email="alex@example.com"
                balance={120}
                direction="positive"
              />
              <FriendCard
                name="John Doe"
                email="john@example.com"
                balance={85.5}
                direction="positive"
              />
              <FriendCard
                name="Michael Brown"
                email="michael@example.com"
                balance={42.75}
                direction="positive"
              />
            </div>
          </TabsContent>

          <TabsContent value="you-owe" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FriendCard
                name="Sarah Johnson"
                email="sarah@example.com"
                balance={65}
                direction="negative"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Invite a Friend</CardTitle>
            <CardDescription>
              Send an invitation to a friend to join SplitEase and connect with you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Friend's Email
                </label>
                <div className="flex space-x-2">
                  <Input id="email" placeholder="friend@example.com" />
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invite
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">
                  Or share this invite link
                </label>
                <div className="flex space-x-2">
                  <Input readOnly value="https://splitease.app/invite/abc123" />
                  <Button variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

interface FriendCardProps {
  name: string;
  email: string;
  balance: number;
  direction: 'positive' | 'negative' | 'neutral';
}

function FriendCard({ name, email, balance, direction }: FriendCardProps) {
  const getBalanceDisplay = () => {
    if (direction === 'neutral') return '$0.00';
    return `${direction === 'positive' ? '+' : '-'}$${Math.abs(balance).toFixed(2)}`;
  };

  const getBalanceColor = () => {
    if (direction === 'neutral') return 'text-muted-foreground';
    return direction === 'positive' ? 'text-green-500' : 'text-red-500';
  };

  const getBalanceText = () => {
    if (direction === 'neutral') return 'All settled up';
    return direction === 'positive' ? 'Owes you' : 'You owe';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm">{getBalanceText()}</span>
          <span className={`font-bold ${getBalanceColor()}`}>
            {getBalanceDisplay()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm">View Details</Button>
        <Button variant="outline" size="sm">Settle Up</Button>
      </CardFooter>
    </Card>
  );
} 