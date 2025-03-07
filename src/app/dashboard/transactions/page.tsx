import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Plus, Receipt, Check, Clock, Filter } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unsettled">Unsettled</TabsTrigger>
              <TabsTrigger value="settled">Settled</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {/* Transaction cards would be dynamically generated */}
              <TransactionCard
                title="Dinner at Restaurant"
                date="March 5, 2023"
                amount={135}
                category="Food"
                participants={[
                  { name: "Alex Smith", amount: 45, isPaid: false },
                  { name: "John Doe", amount: 45, isPaid: true },
                  { name: "You", amount: 45, isPaid: true }
                ]}
                isSettled={false}
              />
              <TransactionCard
                title="Movie Tickets"
                date="March 2, 2023"
                amount={48}
                category="Entertainment"
                participants={[
                  { name: "Sarah Johnson", amount: 24, isPaid: true },
                  { name: "You", amount: 24, isPaid: true }
                ]}
                isSettled={true}
              />
              <TransactionCard
                title="Groceries"
                date="February 28, 2023"
                amount={97.5}
                category="Food"
                participants={[
                  { name: "Alex Smith", amount: 32.5, isPaid: false },
                  { name: "Emily Davis", amount: 32.5, isPaid: false },
                  { name: "You", amount: 32.5, isPaid: true }
                ]}
                isSettled={false}
              />
              <TransactionCard
                title="Utility Bills"
                date="February 25, 2023"
                amount={120}
                category="Utilities"
                participants={[
                  { name: "Michael Brown", amount: 60, isPaid: true },
                  { name: "You", amount: 60, isPaid: true }
                ]}
                isSettled={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="unsettled" className="mt-4">
            <div className="space-y-4">
              <TransactionCard
                title="Dinner at Restaurant"
                date="March 5, 2023"
                amount={135}
                category="Food"
                participants={[
                  { name: "Alex Smith", amount: 45, isPaid: false },
                  { name: "John Doe", amount: 45, isPaid: true },
                  { name: "You", amount: 45, isPaid: true }
                ]}
                isSettled={false}
              />
              <TransactionCard
                title="Groceries"
                date="February 28, 2023"
                amount={97.5}
                category="Food"
                participants={[
                  { name: "Alex Smith", amount: 32.5, isPaid: false },
                  { name: "Emily Davis", amount: 32.5, isPaid: false },
                  { name: "You", amount: 32.5, isPaid: true }
                ]}
                isSettled={false}
              />
            </div>
          </TabsContent>

          <TabsContent value="settled" className="mt-4">
            <div className="space-y-4">
              <TransactionCard
                title="Movie Tickets"
                date="March 2, 2023"
                amount={48}
                category="Entertainment"
                participants={[
                  { name: "Sarah Johnson", amount: 24, isPaid: true },
                  { name: "You", amount: 24, isPaid: true }
                ]}
                isSettled={true}
              />
              <TransactionCard
                title="Utility Bills"
                date="February 25, 2023"
                amount={120}
                category="Utilities"
                participants={[
                  { name: "Michael Brown", amount: 60, isPaid: true },
                  { name: "You", amount: 60, isPaid: true }
                ]}
                isSettled={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

interface Participant {
  name: string;
  amount: number;
  isPaid: boolean;
}

interface TransactionCardProps {
  title: string;
  date: string;
  amount: number;
  category: string;
  participants: Participant[];
  isSettled: boolean;
}

function TransactionCard({ title, date, amount, category, participants, isSettled }: TransactionCardProps) {
  const totalParticipants = participants.length;
  const paidParticipants = participants.filter(p => p.isPaid).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{date} • {category}</CardDescription>
          </div>
          <div className="flex items-center">
            {isSettled ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="mr-1 h-3 w-3" />
                Settled
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <Clock className="mr-1 h-3 w-3" />
                Pending
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="font-bold">${amount.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Participants</span>
              <span>{paidParticipants} of {totalParticipants} paid</span>
            </div>

            <div className="space-y-1">
              {participants.map((participant, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{participant.name}</span>
                  <div className="flex items-center">
                    <span className="mr-2">${participant.amount.toFixed(2)}</span>
                    {participant.isPaid ? (
                      <span className="text-green-500">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="text-amber-500">
                        <Clock className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 