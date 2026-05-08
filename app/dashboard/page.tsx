"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { mockUser, mockTransactions, type Transaction } from '../../lib/dummy-data';
import { PieChart, Pie, Cell } from 'recharts';

const quickActions = [
  { label: 'Buy Data', icon: '📶', color: 'bg-blue-600', shadow: 'hover:shadow-blue-500/40' },
  { label: 'Buy Airtime', icon: '📱', color: 'bg-pink-600', shadow: 'hover:shadow-pink-500/40' },
  { label: 'Pay Bills', icon: '💡', color: 'bg-amber-500', shadow: 'hover:shadow-amber-500/40' },
  { label: 'Send Money', icon: '💸', color: 'bg-emerald-600', shadow: 'hover:shadow-emerald-500/40' },
];

const stats = [
  { label: 'Total Spent (this month)', value: '₦32,000', badge: null },
  { label: 'Transactions Count', value: mockTransactions.length, badge: null },
  { label: 'Saved Amount', value: '₦5,000', badge: 'Saved' },
  { label: 'Cashback Earned', value: '₦1,200', badge: 'Cashback' },
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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Wallet Card */}
      <div className="relative rounded-3xl bg-linear-to-br from-primary via-secondary to-pink-500 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-primary/20 overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="relative z-10 text-center md:text-left space-y-2">
          <div className="text-sm font-bold uppercase tracking-widest opacity-80">Total Wallet Balance</div>
          <div className="text-5xl md:text-6xl font-black tracking-tighter">₦{mockUser.walletBalance.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-xs font-bold text-white/60 bg-white/10 w-fit px-3 py-1 rounded-full mx-auto md:mx-0">
             <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
             Account Active
          </div>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex gap-3">
          <Button className="bg-white text-primary font-black shadow-xl hover:scale-105 transition-all px-8 py-6 rounded-2xl" size="lg">Add Money</Button>
          <Button variant="secondary" className="bg-white/10 border-white/20 text-white font-bold hover:bg-white/20 transition-all px-8 py-6 rounded-2xl backdrop-blur-md" size="lg">Transfer</Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            className={cn(
              "group flex flex-col items-center justify-center h-36 md:h-40 rounded-3xl text-white text-lg font-black shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95",
              action.color,
              action.shadow
            )}
          >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</span>
            {action.label}
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
            className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-6 flex flex-col items-center text-center transition-all hover:shadow-md"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">{stat.label}</div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white mb-3">{stat.value}</div>
            {stat.badge && <Badge className="bg-primary/10 text-primary border-none font-bold px-3 py-1">{stat.badge}</Badge>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-neutral-900 dark:text-white uppercase tracking-wider text-sm">Recent Activity</h3>
            <Button variant="ghost" className="text-xs font-bold text-primary hover:bg-primary/5">View History</Button>
          </div>
          <ul className="space-y-4">
            {mockTransactions.slice(0, 5).map((tx: Transaction) => (
              <li key={tx.id} className="flex items-center p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">
                  {tx.type === 'airtime' ? '📱' : tx.type === 'data' ? '📶' : tx.type === 'electricity' ? '💡' : '📺'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-neutral-900 dark:text-white text-sm truncate">{tx.provider}</div>
                  <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">{tx.date}</div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-black text-neutral-900 dark:text-white">₦{tx.amount}</div>
                  <Badge className={cn(
                    "mt-1 text-[10px] font-black uppercase tracking-tighter px-2 py-0 border-none",
                    tx.status === 'success' ? 'bg-green-100 dark:bg-green-500/20 text-green-600' : 
                    tx.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600' : 
                    'bg-red-100 dark:bg-red-500/20 text-red-600'
                  )}>
                    {tx.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Widgets Column */}
        <div className="space-y-6">
          {/* Data Usage Widget */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-6 flex flex-col items-center">
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
            className="relative rounded-3xl bg-linear-to-br from-accent via-primary to-secondary p-6 text-white shadow-xl overflow-hidden group cursor-grab active:cursor-grabbing"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            <motion.div 
              initial={{ x: 0 }}
              className="relative z-10"
            >
              <Badge className="bg-white text-primary border-none font-black px-3 py-1 mb-4">NEW PROMO</Badge>
              <div className="text-lg font-black leading-tight mb-2">Get 5% cashback on all bill payments!</div>
              <p className="text-xs font-bold text-white/70 mb-6 italic">Swipe for more deals →</p>
              <Button className="w-full bg-black/20 hover:bg-black/30 border-white/10 text-white font-black rounded-2xl py-6 backdrop-blur-md">Claim Now</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
