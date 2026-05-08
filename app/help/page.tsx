"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown,
  Send,
  X,
  Bot,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: string;
  onClick?: () => void;
  highlight?: boolean;
}

interface FAQItemProps {
  faq: {
    id: string;
    category: string;
    question: string;
    answer: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "getting-started", label: "Getting Started" },
  { id: "payments", label: "Payments" },
  { id: "wallet", label: "Wallet" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "account", label: "Account" },
];

const FAQS = [
  {
    id: "faq-1",
    category: "getting-started",
    question: "How do I create a QuickPay account?",
    answer: "Download the app or visit our website and click 'Sign Up'. You'll need a valid phone number and email address to verify your identity.",
  },
  {
    id: "faq-2",
    category: "payments",
    question: "What bills can I pay with QuickPay?",
    answer: "You can pay for electricity (PHCN), Cable TV (DSTV/GOTV), Internet data, and Airtime for all major Nigerian networks.",
  },
  {
    id: "faq-3",
    category: "wallet",
    question: "How do I fund my wallet?",
    answer: "Go to your Dashboard, click 'Add Money', and select your preferred method: Bank Transfer or Debit Card.",
  },
  {
    id: "faq-4",
    category: "troubleshooting",
    question: "My transaction is pending, what should I do?",
    answer: "Transactions can sometimes take up to 30 minutes to process during bank peak hours. If it remains pending after that, please contact support with your reference ID.",
  },
  {
    id: "faq-5",
    category: "account",
    question: "How do I reset my transaction PIN?",
    answer: "Navigate to Settings > Security > Reset PIN. You will need to verify your identity via OTP to set a new PIN.",
  },
];

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [expandedFaq, setExpandedFaq] = React.useState<string | null>(null);
  const [chatOpen, setChatOpen] = React.useState(false);

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2"
          >
            <HelpCircle size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
            How can we help?
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <Input 
              placeholder="Search for answers..." 
              className="pl-12 h-14 rounded-2xl border-neutral-200 dark:border-white/10 dark:bg-neutral-900 shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SupportCard 
            icon={<Mail className="text-blue-500" />} 
            title="Email Support" 
            desc="Response within 24h"
            action="Email Us"
          />
          <SupportCard 
            icon={<Phone className="text-emerald-500" />} 
            title="Phone Support" 
            desc="Mon-Fri, 9am - 5pm"
            action="Call Now"
          />
          <SupportCard 
            icon={<MessageCircle className="text-primary" />} 
            title="Live Chat" 
            desc="Chat with our bot"
            action="Start Chat"
            onClick={() => setChatOpen(true)}
            highlight
          />
        </div>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-bold transition-all",
                  activeCategory === cat.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/10"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <FAQItem 
                  key={faq.id} 
                  faq={faq} 
                  isExpanded={expandedFaq === faq.id}
                  onToggle={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                />
              ))
            ) : (
              <p className="text-center text-neutral-500 py-10">No questions found matching your search.</p>
            )}
          </div>
        </section>
      </div>

      {/* Dummy Chat Widget */}
      <AnimatePresence>
        {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function SupportCard({ icon, title, desc, action, onClick, highlight }: SupportCardProps) {
  return (
    <Card 
      variant={highlight ? "elevated" : "default"}
      className={cn(
        "p-6 text-center space-y-4 cursor-pointer group hover:border-primary/50 transition-all rounded-4xl",
        highlight && "border-primary/20 bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-neutral-900 dark:text-white uppercase tracking-wider text-xs mb-1">{title}</h3>
        <p className="text-xs text-neutral-500">{desc}</p>
      </div>
      <Button variant={highlight ? "primary" : "secondary"} size="sm" className="w-full rounded-xl">
        {action}
      </Button>
    </Card>
  );
}

function FAQItem({ faq, isExpanded, onToggle }: FAQItemProps) {
  const [feedback, setFeedback] = React.useState<null | 'yes' | 'no'>(null);

  return (
    <Card className="p-0 overflow-hidden border-neutral-200 dark:border-white/5 rounded-3xl">
      <button 
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <span className="font-bold text-neutral-900 dark:text-white pr-4">{faq.question}</span>
        <ChevronDown className={cn("h-5 w-5 text-neutral-400 transition-transform duration-300", isExpanded && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 space-y-6">
              <div className="h-px w-full bg-neutral-100 dark:bg-white/5" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {faq.answer}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Was this helpful?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFeedback('yes')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      feedback === 'yes' ? "bg-green-500 text-white" : "bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-green-500"
                    )}
                  >
                    <ThumbsUp size={14} /> Yes
                  </button>
                  <button 
                    onClick={() => setFeedback('no')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      feedback === 'no' ? "bg-rose-500 text-white" : "bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-rose-500"
                    )}
                  >
                    <ThumbsDown size={14} /> No
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = React.useState([
    { role: 'bot', text: 'Hi! I am the QuickPay assistant. How can I help you today?' }
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated bot logic
    setTimeout(() => {
      let botText = "I'm not sure about that. Would you like me to connect you to a human agent?";
      const lower = input.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi")) botText = "Hello! I can help you with bill payments or wallet issues.";
      if (lower.includes("wallet")) botText = "To fund your wallet, go to the Dashboard and click 'Add Money'.";
      if (lower.includes("fail") || lower.includes("pending")) botText = "I'm sorry to hear that. Please provide your transaction reference (e.g., QKP-123456).";
      
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-100 w-95 h-137.5 max-w-[calc(100vw-2rem)] bg-white dark:bg-neutral-900 shadow-2xl rounded-3xl border border-neutral-200 dark:border-white/10 flex flex-col overflow-hidden"
    >
      {/* Chat Header */}
      <div className="p-4 bg-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-wider">QuickBot</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold opacity-80 uppercase">Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Chat Body */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: m.role === 'bot' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex items-end gap-2",
              m.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
              m.role === 'bot' ? "bg-primary/10 text-primary" : "bg-neutral-200 dark:bg-white/10 text-neutral-500"
            )}>
              {m.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
            </div>
            <div className={cn(
              "p-3.5 rounded-2xl text-sm max-w-[80%] font-medium",
              m.role === 'bot' 
                ? "bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-neutral-200 rounded-bl-none" 
                : "bg-primary text-white rounded-br-none shadow-lg shadow-primary/20"
            )}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Bot size={14} /></div>
            <div className="bg-neutral-100 dark:bg-white/5 p-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i} 
                    className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative"
        >
          <input 
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}