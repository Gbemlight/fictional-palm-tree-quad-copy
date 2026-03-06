"use client";
import { motion } from "framer-motion";
// ...existing code...
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { mockUser, mockTransactions } from '../../lib/dummy-data';
import { PieChart, Pie, Cell } from 'recharts';

const quickActions = [
  { label: 'Buy Data', icon: '📶', color: 'bg-blue-500' },
  { label: 'Buy Airtime', icon: '📱', color: 'bg-pink-500' },
  { label: 'Pay Bills', icon: '💡', color: 'bg-yellow-500' },
  { label: 'Send Money', icon: '💸', color: 'bg-green-500' },
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
  return (
    <div className="min-h-screen bg-[#000000]/80 text-white p-4 md:p-8 space-y-6">
      {/* Hero Wallet Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col items-center text-white shadow-lg">
        <div className="text-lg font-medium mb-2">Wallet Balance</div>
        <div className="text-4xl font-bold mb-4">₦{mockUser.walletBalance.toLocaleString()}</div>
        <Button className="bg-white text-indigo-600 font-semibold shadow-lg hover:scale-105 hover:shadow-indigo-400 transition" size="lg">Add Money</Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Button
            key={action.label}
            className={`flex flex-col items-center justify-center h-32 text-white text-lg font-semibold ${action.color} shadow-lg hover:scale-105 hover:shadow-xl transition duration-200`}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
          >
            <span className="text-3xl mb-2">{action.icon}</span>
            {action.label}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={statsVariants}
            className="flex-1 bg-[#18181b] rounded-xl shadow p-4 flex flex-col items-center border border-white/10"
          >
            <div className="text-sm text-white mb-1">{stat.label}</div>
            <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
            {stat.badge && <Badge>{stat.badge}</Badge>}
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#18181b] rounded-xl shadow p-4 border border-white/10">
        <div className="font-semibold mb-3 text-white">Recent Transactions</div>
        <ul className="divide-y divide-white/10">
          {mockTransactions.slice(0, 5).map((tx: any) => (
            <li key={tx.id} className="flex items-center py-3">
              <span className="text-2xl mr-3">{tx.type === 'airtime' ? '📱' : tx.type === 'data' ? '📶' : tx.type === 'electricity' ? '💡' : '📺'}</span>
              <div className="flex-1">
                <div className="font-medium text-white">{tx.provider}</div>
                <div className="text-xs text-gray-400">{tx.date}</div>
              </div>
              <div className="font-semibold mr-3 text-white">₦{tx.amount}</div>
              <Badge className={`ml-2 ${tx.status === 'success' ? 'bg-green-100 text-green-700' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{tx.status}</Badge>
            </li>
          ))}
        </ul>
      </div>

      {/* Data Usage Widget */}
      <div className="bg-[#18181b] rounded-xl shadow p-4 flex flex-col items-center border border-white/10">
        <div className="font-semibold mb-2 text-white">Data Usage</div>
        <PieChart width={120} height={120}>
          <Pie
            data={dataUsage}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            startAngle={90}
            endAngle={450}
          >
            {dataUsage.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="mt-2 text-sm text-white">{dataUsage[0].value}GB used / {dataUsage[1].value}GB total</div>
      </div>

      {/* Promo Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 p-6 flex items-center justify-between text-white shadow-lg">
        <div className="text-lg font-bold">Get 5% cashback on all purchases!</div>
        <Badge className="bg-white text-pink-600 font-semibold">Promo</Badge>
      </div>
    </div>
  );
}
