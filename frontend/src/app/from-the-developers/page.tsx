'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Code2, ShieldAlert, Cpu, Database, Flame, Wrench } from 'lucide-react';
import Link from 'next/link';

interface Developer {
  name: string;
  role: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
  github: string;
}

const devs: Developer[] = [
  {
    name: 'Vaibhav',
    role: 'Full-Stack Lead & Project Architect',
    desc: 'Led TATAmart architecture, relational MariaDB schema engineering, secure email verification algorithms, and end-to-end integration workflows.',
    icon: <Cpu className="h-6 w-6 text-indigo-500" />,
    gradient: 'from-indigo-500 to-purple-600',
    github: 'https://github.com'
  },
  {
    name: 'Umang',
    role: 'Core Frontend Engineer',
    desc: 'Crafted the premium glassmorphism theme systems, responsive dashboards, and interactive checkout and billing visuals.',
    icon: <Code2 className="h-6 w-6 text-sky-500" />,
    gradient: 'from-sky-400 to-blue-600',
    github: 'https://github.com'
  },
  {
    name: 'Rishabh',
    role: 'Core Frontend Developer',
    desc: 'Engineered custom page-to-page state caching pipelines, user verification OTP forms, and search engine autocomplete modules.',
    icon: <Flame className="h-6 w-6 text-orange-500" />,
    gradient: 'from-orange-400 to-red-500',
    github: 'https://github.com'
  },
  {
    name: 'Bhabya',
    role: 'Frontend Quality Analyst & Tester',
    desc: 'Conducted interactive UI bug audits, browser responsiveness validation, and guaranteed zero Next.js production build compiler warnings.',
    icon: <ShieldAlert className="h-6 w-6 text-pink-500" />,
    gradient: 'from-pink-500 to-rose-600',
    github: 'https://github.com'
  },
  {
    name: 'Rick',
    role: 'Full-Stack Developer & DevOps',
    desc: 'Assisted in API routing controls, local Windows loopback Direct-IP routing calibrations, and environment stability controls.',
    icon: <Wrench className="h-6 w-6 text-emerald-500" />,
    gradient: 'from-emerald-400 to-teal-600',
    github: 'https://github.com'
  },
  {
    name: 'Dilshad',
    role: 'Core Backend Developer & Lead QA',
    desc: 'Constructed Laravel Eloquent category controllers, automated SKU generation methods, and cURL test integration APIs.',
    icon: <Database className="h-6 w-6 text-violet-500" />,
    gradient: 'from-violet-500 to-indigo-700',
    github: 'https://github.com'
  },
  {
    name: 'Prapti',
    role: 'Backend Security Support',
    desc: 'Calibrated forgot password link dispatches, email logs verification triggers, and review CRUD security verification gates.',
    icon: <Database className="h-6 w-6 text-amber-500" />,
    gradient: 'from-amber-400 to-orange-600',
    github: 'https://github.com'
  },
  {
    name: 'Avinash',
    role: 'Frontend QA & Component Support',
    desc: 'Developed structural visual components, team profile layout sheets, and integrated global circular scrolling monitors.',
    icon: <Code2 className="h-6 w-6 text-purple-500" />,
    gradient: 'from-purple-400 to-pink-600',
    github: 'https://github.com'
  }
];

export default function FromTheDevelopers() {
  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 selection:bg-brand-primary selection:text-white">

      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 relative">
        {/* Curved decorative background glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/5 dark:bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-brand-primary bg-indigo-50 dark:bg-indigo-950/40 px-4 py-1.5 rounded-full mb-6">
            <span>Operational Engineering Core</span>
          </span>
          <h1 className="font-hero text-4xl sm:text-5.5xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 leading-tight">
            From the Developers
          </h1>
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-500 dark:text-zinc-400">
            Meet the elite engineering core responsible for architecting and upgrading the TATAmart Enterprise B2B Marketplace.
          </p>
        </div>

        {/* Developers Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {devs.map((dev, idx) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-[32px] border border-zinc-200/60 bg-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-900 group flex flex-col justify-between"
            >
              <div>
                {/* Visual Avatar Placeholder / Gradient Overlay */}
                <div className={`h-36 w-full rounded-[24px] bg-gradient-to-tr ${dev.gradient} p-4 flex flex-col justify-between relative overflow-hidden mb-6`}>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  
                  {/* Developer Icon */}
                  <div className="h-10 w-10 bg-white/95 dark:bg-zinc-900/95 rounded-xl flex items-center justify-center shadow-md relative z-10 shrink-0">
                    {dev.icon}
                  </div>

                  {/* Initials overlay */}
                  <span className="absolute bottom-2 right-4 text-6xl font-black text-white/10 select-none">
                    {dev.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                <h3 className="font-hero text-lg font-black text-zinc-950 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">
                  {dev.name}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary block mb-4">
                  {dev.role}
                </span>

                <p className="text-xs font-semibold leading-relaxed text-zinc-500 dark:text-zinc-400 mb-6">
                  {dev.desc}
                </p>
              </div>

              {/* Developer Links */}
              <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href={dev.github}
                  target="_blank"
                  className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-brand-primary transition-colors"
                >
                  <Code2 className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
