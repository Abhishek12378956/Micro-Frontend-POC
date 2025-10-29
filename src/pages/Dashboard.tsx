import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mail, Zap, Box } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Micro-Frontend Architecture POC</h1>
        <p className="mt-2 text-muted-foreground">
          A modular, scalable architecture demonstration with React
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Host Application</CardTitle>
            <CardDescription>
              Main wrapper managing design system and shared components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Micro-apps:</span>
                <span className="font-medium">2 Loaded</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Chat Application</CardTitle>
            <CardDescription>
              Standalone micro-frontend for messaging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Users:</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unread:</span>
                <span className="font-medium">3 messages</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Email Application</CardTitle>
            <CardDescription>
              Standalone micro-frontend for email management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Emails:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unread:</span>
                <span className="font-medium">3 emails</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
            <Zap className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="mt-4">Architecture Features</CardTitle>
          <CardDescription>
            Key capabilities of this micro-frontend implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Modular Design</h4>
              <p className="text-sm text-muted-foreground">
                Each application is independently developed and maintained
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Shared Design System</h4>
              <p className="text-sm text-muted-foreground">
                Consistent UI/UX across all micro-frontends
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Event-Based Communication</h4>
              <p className="text-sm text-muted-foreground">
                Loose coupling via event bus for inter-app messaging
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Scalable Architecture</h4>
              <p className="text-sm text-muted-foreground">
                Easy to add new micro-frontends without affecting existing ones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
