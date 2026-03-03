import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#000000] p-10">
      <div className="w-full max-w-md">
        <Card variant="interactive" accent accentPosition="left" padding="lg">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>QuickPay Dashboard Preview</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-white text-3xl font-bold">₦12,500</p>
            <p className="text-white/70">Last updated: today</p>
          </CardContent>

          <CardFooter>
            <Button variant="secondary">History</Button>
            <Button>Top Up</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}