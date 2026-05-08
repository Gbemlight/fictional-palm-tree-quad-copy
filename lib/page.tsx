"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Download, 
  Share2, 
  AlertTriangle, 
  RefreshCcw, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { format, subMinutes, parseISO } from "date-fns";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { StatusIndicator } from "../components/dashboard/status-indicator";
import DashboardLayout from "../components/dashboard/layout";
import { mockTransactions, Transaction, type TransactionStatus } from "./dummy-data";
import { cn } from "./utils";
import { toastSuccess } from "../components/ui/toast";

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const tx = React.useMemo(() => mockTransactions.find((t: Transaction) => t.id === id), [id]);

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!isMounted) {
    return <DashboardLayout><div className="min-h-screen" /></DashboardLayout>;
  }

  if (!tx) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">Transaction Not Found</h1>
          <p className="text-neutral-500 mb-8">The transaction you&apos;re looking for doesn&apos;t exist or has been archived.</p>
          <Button onClick={() => router.push("/transactions")}>Back to Transactions</Button>
        </div>
      </DashboardLayout>
    );
  }

  const txDate = parseISO(tx.date); // tx.date is now guaranteed to be a string
  const fee = tx.type === "electricity" ? 100 : 0;
  const total = tx.amount + fee;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toastSuccess("Transaction link copied to clipboard!", "Shared");
  };

  const handleDownload = () => {
    router.push(`/transactions/${tx.reference}/receipt`);
  };

  const similarTxs = mockTransactions
    .filter((t: Transaction) => t.type === tx.type && t.id !== tx.id)
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-primary transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* Status Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-16 w-16 rounded-4xl flex items-center justify-center text-white shadow-2xl",
              tx.status === "success" ? "bg-green-500 shadow-green-500/20" :
              tx.status === "pending" ? "bg-amber-500 shadow-amber-500/20" : "bg-rose-500 shadow-rose-500/20"
            )}>
              {tx.status === "success" ? <CheckCircle2 className="h-8 w-8" /> :
               tx.status === "pending" ? <Clock className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">Transaction</h1>
                <StatusIndicator 
                  status={tx.status as TransactionStatus} 
                  size="sm" 
                  subStatus={tx.status === 'pending' ? 'Processing at bank' : undefined}
                />
              </div>
              <p className="text-sm font-medium text-neutral-500">Ref: {tx.reference}</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="secondary" className="flex-1 md:flex-none rounded-2xl gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button className="flex-1 md:flex-none rounded-2xl gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" /> Receipt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Receipt Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/5 shadow-2xl rounded-[2.5rem]">
              <div className="h-2 w-full bg-linear-to-r from-primary via-secondary to-accent" />
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Amount Paid</p>
                    <p className="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter">₦{total.toLocaleString('en-NG')}</p>
                  </div>
                  <div className="bg-neutral-50 dark:bg-white/5 p-4 rounded-3xl border border-neutral-100 dark:border-white/5">
                    <QRCodeSVG value={tx.id} size={80} bgColor="transparent" fgColor="currentColor" className="text-neutral-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-8 border-t border-dashed border-neutral-200 dark:border-white/10">
                  <DetailItem label="Service" value={`${tx.provider} ${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}`} />
                  <DetailItem label="Reference ID" value={tx.reference} mono />
                  <DetailItem label="Date & Time" value={format(txDate, "MMM dd, yyyy • h:mm a")} />
                  <DetailItem label="Recipient" value={tx.recipient || 'N/A'} mono />
                  <DetailItem label="Payment Method" value={tx.paymentMethod || 'N/A'} />
                  <DetailItem label="Provider" value={tx.provider} />
                </div>

                <div className="space-y-3 pt-8 border-t border-neutral-100 dark:border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500 font-medium">Subtotal</span>
                    <span className="text-neutral-900 dark:text-white font-bold">₦{tx.amount.toLocaleString('en-NG')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500 font-medium">Service Fee</span>
                    <span className="text-neutral-900 dark:text-white font-bold">₦{fee.toLocaleString('en-NG')}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2">
                    <span className="text-neutral-900 dark:text-white font-black">Total</span>
                    <span className="text-primary font-black">₦{total.toLocaleString('en-NG')}</span>
                  </div>
                </div>
              </div>
            </Card>

            {tx.status === 'failed' && (
              <Card className="p-6 bg-rose-500/5 border-rose-500/20 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="text-rose-500 h-6 w-6" />
                  <p className="text-sm font-bold text-rose-500">This transaction failed due to provider timeout.</p>
                </div>
                <Button variant="danger" size="sm" className="rounded-xl gap-2">
                  <RefreshCcw className="h-4 w-4" /> Retry
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column: Timeline & Actions */}
          <div className="space-y-8">
            {/* Timeline */}
            <Card className="p-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/5 rounded-4xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-8">Transaction Timeline</h3>
              <div className="space-y-8 relative">
                <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-neutral-100 dark:bg-white/5" />
                
                <TimelineStep 
                  title="Transaction Initiated" 
                  time={format(subMinutes(txDate, 2), "h:mm a")} 
                  status="completed" 
                />
                <TimelineStep 
                  title="Payment Processing" 
                  time={format(subMinutes(txDate, 1), "h:mm a")} 
                  status={tx.status === 'pending' ? 'active' : 'completed'} 
                />
                <TimelineStep 
                  title={tx.status === 'success' ? 'Transaction Completed' : tx.status === 'failed' ? 'Transaction Failed' : 'Awaiting Provider'} 
                  time={tx.status === 'pending' ? 'Processing...' : format(txDate, "h:mm a")} 
                  status={tx.status === 'success' ? 'completed' : tx.status === 'failed' ? 'failed' : 'pending'} 
                />
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-3">
              <Button variant="secondary" className="w-full justify-between rounded-2xl h-14 px-6 border-neutral-200 dark:border-white/10 dark:bg-white/5">
                <span className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-neutral-400" /> Report an Issue</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Button>
              <Button variant="secondary" className="w-full justify-between rounded-2xl h-14 px-6 border-neutral-200 dark:border-white/10 dark:bg-white/5">
                <span className="flex items-center gap-3"><ExternalLink className="h-5 w-5 text-neutral-400" /> Provider Receipt</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Transactions */}
        <section className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">Similar {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</h2>
            <Link href="/transactions" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarTxs.map((stx: Transaction) => (
              <Link key={stx.id} href={`/transactions/${stx.id}`}>
                <Card className="p-5 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/5 hover:border-primary/50 transition-all rounded-3xl group" key={stx.id}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-2xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center text-lg">
                      {stx.type === 'airtime' ? '📱' : stx.type === 'data' ? '📶' : '💡'}
                    </div>
                    <StatusIndicator status={stx.status as TransactionStatus} size="sm" />
                  </div>
                  <p className="font-bold text-neutral-900 dark:text-white text-sm mb-1">{stx.provider} {stx.type}</p>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">₦{stx.amount.toLocaleString('en-NG')} • {stx.date}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

const DetailItem = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
      <p className={cn(
        "text-sm font-bold text-neutral-900 dark:text-white truncate",
        mono && "font-mono tracking-tighter"
      )}>{value}</p>
    </div>
  );
}

const TimelineStep = ({ title, time, status }: {
  title: string; 
  time: string; 
  status: 'completed' | 'active' | 'pending' | 'failed';
}) => {
  return (
    <div className="flex gap-4 relative">
      <div className="relative z-10">
        {status === 'completed' ? (
          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        ) : status === 'active' ? (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
        ) : status === 'failed' ? (
          <div className="h-6 w-6 rounded-full bg-rose-500 flex items-center justify-center text-white">
            <XCircle className="h-4 w-4" />
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-white/10" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-bold leading-none mb-1",
          status === 'pending' ? "text-neutral-400" : "text-neutral-900 dark:text-white",
          status === 'failed' && "text-rose-500"
        )}>
          {title}
        </p>
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}