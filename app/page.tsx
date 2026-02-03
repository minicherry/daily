'use client'
import Image from "next/image";
import { BookOpenText } from 'lucide-react';
import Card from "@/components/Card";
import { useState } from "react";
import { toast } from "sonner"

export default function Home() {
  const [email, setEmail] = useState('');
  const handleSubscribe = async () => {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }).then(res => res.json()).then(data => {
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success('Thank you for subscribing!');
      }
    }).catch(err => {
      toast.error(err)
    }).finally(() => {
      setEmail('')
    })
  };
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <BookOpenText />
          <h1 className="text-2xl font-bold">Daily News</h1>
        </div>
        <nav className="flex items-center gap-6">
          <a href="/" className="hover:text-gray-500"></a>
          <a href="/" className="hover:text-gray-500"></a>
        </nav>
      </header>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Daily Briefs of AI</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Get the latest news and updates on AI
          </p>
        </div>
        <div className="text-center flex items-center justify-center gap-4">
          <input type="email" placeholder="Enter your email" className="border border-gray-300 rounded-md px-4 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="bg-black text-white px-4 py-2 rounded-md" onClick={handleSubscribe}>Subscribe</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <Card title="AI" description="Description 1" />
          <Card title="Startups" description="Description 2" />
          <Card title="Tech" description="Description 3" />
        </div>
      </div>
    </div>
  );
}
