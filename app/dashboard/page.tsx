"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  EyeOff,
  Signal, // For Buy Data
  Smartphone, // For Buy Airtime
  Zap, // For Pay Bills
  ArrowRight,
  Plus,
  Send,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { mockUser, mockTransactions, type Transaction } from '../../lib/dummy-data';
import { StatusIndicator } from "../../components/dashboard/status-indicator";
import { PieChart, Pie, Cell } from 'recharts';

const quickActions = [
  { label: 'Buy Data', icon: Signal, color: 'bg-indigo-500', href: '/buy-data' },
  { label: 'Buy Airtime', icon: Smartphone, color: 'bg-violet-500', href: '/buy-airtime' },
  { label: 'Pay Bills', icon: Zap, color: 'bg-fuchsia-500', href: '/pay-bills' },
  { label: 'Send Money', icon: Send, color: 'bg-emerald-500', href: '/wallet' },
];

const dataUsage = [
  { name: 'Used', value: 8, color: '#6366f1' },
  { name: 'Total', value: 10, color: '#e5e7eb' },
];

const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15 } }),
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const stats = [
    { label: 'Monthly Spend', value: '₦32,000', change: '+12.5%', icon: ArrowUpRight, trend: 'up' },
    { label: 'Volume', value: mockTransactions.length, change: '+4 today', icon: TrendingUp, trend: 'up' },
    { label: 'Savings', value: '₦5,000', change: '-2%', icon: ArrowDownRight, trend: 'down' },
    { label: 'Rewards', value: '₦1,200', change: 'New', icon: Zap, trend: 'up' },
  ];

  const [particles, setParticles] = useState<{width: number, height: number, top: number, left: number, opacity: number}[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate decorative particles only on client to prevent hydration mismatch
    setParticles([...Array(12)].map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-10"
    >
      {/* Hero Wallet Card */}
      <div className="relative rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-700 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-indigo-500/30 overflow-hidden group hover:shadow-indigo-500/40 transition-all duration-500">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-15 mix-blend-overlay" />
        
        {/* Animated Particles - Safe Implementation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${p.width}px`,
                height: `${p.height}px`,
                top: `${p.top}%`,
                left: `${p.left}%`,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Account Balance</span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              {showBalance ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </button>
          </div>
          <div className="text-5xl md:text-7xl font-black tracking-tighter tabular-nums">
            ₦{mounted ? (showBalance ? mockUser.walletBalance.toLocaleString() : "••••••") : "0.00"}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-white/60 bg-white/10 w-fit px-3 py-1 rounded-full mx-auto md:mx-0">
             <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
             Account Active
          </div>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-white text-indigo-700 font-black shadow-xl hover:bg-neutral-50 hover:scale-105 transition-all px-8 py-7 rounded-2xl" size="lg">
            <Link href="/wallet?action=deposit" className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add Money
            </Link>
          </Button>
          <Button asChild variant="secondary" className="bg-white/10 border-white/20 text-white font-bold hover:bg-white/20 transition-all px-8 py-7 rounded-2xl backdrop-blur-md" size="lg">
            <Link href="/wallet?action=transfer" className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Send
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            asChild
            className="group relative flex flex-col items-center justify-center w-full h-32 md:h-36 rounded-4xl bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 text-neutral-900 dark:text-white shadow-sm hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden backdrop-blur-md"
          >
            <Link href={action.href} className="flex flex-col items-center">
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500",
                action.color
              )} />
              <div className="relative z-10 text-4xl mb-3 group-hover:scale-110 transition-transform">
                <action.icon className="h-10 w-10 text-indigo-600 dark:text-white" />
              </div>
              <span className="relative z-10 text-sm font-bold tracking-tight">
                {action.label}
              </span>
            </Link>
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={statsVariants}
            className="bg-white/50 dark:bg-neutral-900/50 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-6 flex flex-col items-center text-center transition-all hover:shadow-md backdrop-blur-md"
          >
            <div className="flex w-full items-start justify-between mb-4">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5">
                <stat.icon className="h-4 w-4 text-neutral-500" />
              </div>
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded-lg",
                stat.trend === 'up' ? "bg-green-100 dark:bg-green-500/10 text-green-600" : "bg-red-100 dark:bg-red-500/10 text-red-600"
              )}>
                {stat.change}
              </span>
            </div>
            <div className="w-full text-left">
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-neutral-900 dark:text-white">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white/50 dark:bg-neutral-900/50 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-neutral-900 dark:text-white uppercase tracking-wider text-sm">Recent Transactions</h3>
            <Link href="/transactions">
              <Button variant="ghost" className="text-xs font-bold text-primary hover:bg-primary/5 gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <ul className="space-y-4">
            {mockTransactions.slice(0, 5).map((tx: Transaction) => (
              <Link href={`/transactions/${tx.id}`} key={tx.id} className="flex items-center p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group">
                <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  {tx.type === 'airtime' ? (
                    <Smartphone className="h-5 w-5 text-violet-500" />
                  ) : tx.type === 'data' ? (
                    <Signal className="h-5 w-5 text-indigo-500" />
                  ) : tx.type === 'electricity' ? (
                    <Zap className="h-5 w-5 text-fuchsia-500" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-emerald-500" /> // Generic icon for other types
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-neutral-900 dark:text-white text-sm truncate">{tx.provider}</div>
                  <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">{tx.date}</div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-black text-neutral-900 dark:text-white">₦{tx.amount}</div>
                  <StatusIndicator status={tx.status} size="sm" />
                </div>
              </Link>
            ))}
          </ul>
        </div>

        {/* Secondary Widgets Column */}
        <div className="space-y-6">
          {/* Data Usage Widget */}
          <div className="bg-white/50 dark:bg-neutral-900/50 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-6 flex flex-col items-center backdrop-blur-md">
            <h3 className="font-black text-neutral-900 dark:text-white uppercase tracking-wider text-sm mb-6 w-full text-left">Data Status</h3>
            {mounted && (
              <div className="relative">
                <PieChart width={160} height={160}>
                  <Pie
                    data={dataUsage}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={5}
                  >
                    {dataUsage.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-neutral-900 dark:text-white">80%</span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Used</span>
                </div>
              </div>
            )}
            <div className="mt-6 text-sm font-bold text-neutral-600 dark:text-neutral-400 flex gap-2 items-baseline">
               <span className="text-primary text-xl font-black">{dataUsage[0].value}GB</span>
               <span>/ {dataUsage[1].value}GB</span>
            </div>
          </div>

          {/* Promo Banner */}
          <motion.div 
            drag="x" 
            dragConstraints={{ left: -20, right: 20 }}
            className="relative rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl overflow-hidden group cursor-grab active:cursor-grabbing"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            <motion.div 
              initial={{ x: 0 }}
              className="relative z-10"
            >
              <Badge className="bg-indigo-100 text-indigo-700 border-none font-black px-3 py-1 mb-4">NEW PROMO</Badge>
              <div className="text-lg font-black leading-tight mb-2">Get 5% cashback on all bill payments!</div>
              <p className="text-xs font-bold text-white/70 mb-6 italic">Swipe for more deals →</p>
              <Button className="w-full bg-indigo-700 hover:bg-indigo-800 border-white/10 text-white font-black rounded-2xl py-6 backdrop-blur-md">Claim Now</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
