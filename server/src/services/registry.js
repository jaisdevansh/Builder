export const registryComponents = {
  '/registry/index.ts': {
    name: 'index.ts',
    code: `export { default as Navbar } from './components/Navbar';
export { default as Hero } from './components/Hero';
export { default as Features } from './components/Features';
export { default as Portfolio } from './components/Portfolio';
export { default as Pricing } from './components/Pricing';
export { default as Testimonials } from './components/Testimonials';
export { default as Contact } from './components/Contact';
export { default as Footer } from './components/Footer';
`
  },
  '/registry/components/Navbar.tsx': {
    name: 'Navbar.tsx',
    code: `import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ logo = "Logo", links = [] }: { logo?: string, links?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultLinks = links.length > 0 ? links : ['Home', 'Portfolio', 'Features', 'Pricing', 'Testimonials', 'Contact'];

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = link.toLowerCase();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav id="home" className="w-full border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 font-extrabold text-2xl tracking-tighter text-white bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            {logo}
          </div>
          <div className="hidden md:flex space-x-8">
            {defaultLinks.map(link => (
              <a 
                key={link} 
                href={\`#\${link.toLowerCase()}\`}
                onClick={(e) => handleLinkClick(e, link)}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold tracking-wide"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="hidden md:flex">
            <a 
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'Contact')}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md transform hover:scale-105"
            >
              Get in Touch
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-white/5 px-6 pt-4 pb-6 space-y-3">
          {defaultLinks.map(link => (
            <a 
              key={link} 
              href={\`#\${link.toLowerCase()}\`}
              onClick={(e) => handleLinkClick(e, link)}
              className="block py-2 text-base font-semibold text-zinc-400 hover:text-white"
            >
              {link}
            </a>
          ))}
          <a 
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'Contact')}
            className="block w-full text-center bg-white text-zinc-950 font-bold py-3 rounded-xl text-sm mt-4"
          >
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  );
}
`
  },
  '/registry/components/Hero.tsx': {
    name: 'Hero.tsx',
    code: `import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ 
  title = "Build Faster", 
  subtitle = "Accelerate your workflow with AI", 
  ctaText = "Start Now",
  badgeText = "Premium Website Builder",
  bgImageUrl = ""
}: { 
  title?: string, 
  subtitle?: string, 
  ctaText?: string,
  badgeText?: string,
  bgImageUrl?: string
}) {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-zinc-950 px-6 py-24 sm:py-32 lg:px-8 min-h-[90vh] flex items-center">
      {bgImageUrl ? (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src={bgImageUrl} alt="background" className="w-full h-full object-cover opacity-20 filter blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]"></div>
      )}
      
      <div className="mx-auto max-w-3xl text-center relative z-10">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-8 hover:border-indigo-500/30 transition-colors">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            {badgeText}
          </div>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl mb-8 leading-none bg-clip-text bg-gradient-to-b from-white to-zinc-400">
          {title}
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed text-zinc-400 mb-12 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <a 
            href="#contact"
            onClick={scrollToContact}
            className="rounded-xl bg-white text-zinc-950 px-8 py-4 text-sm font-bold shadow-lg hover:bg-zinc-200 transition-all flex items-center gap-2 transform hover:scale-105"
          >
            {ctaText} <ArrowRight className="w-4.5 h-4.5 text-zinc-950" />
          </a>
        </div>
      </div>
    </div>
  );
}
`
  },
  '/registry/components/Features.tsx': {
    name: 'Features.tsx',
    code: `import React from 'react';
import { Star, Shield, Zap, Sparkles, Film, Paintbrush, Play, Volume2 } from 'lucide-react';

const iconMap = {
  Star,
  Shield,
  Zap,
  Sparkles,
  Film,
  Paintbrush
};

export default function Features({ 
  title = "Key Features", 
  subtitle = "What we bring to the table", 
  features = [] 
}: { 
  title?: string, 
  subtitle?: string, 
  features?: { title: string, description: string, iconName?: string }[] 
}) {
  const defaultFeatures = features.length > 0 ? features : [
    { title: "Pro Editing & Pacing", description: "Seamless transitions, dialogue tightening, and storytelling that keeps viewers hooked till the last second.", iconName: "Film" },
    { title: "High-End Color Grading", description: "Color correction and artistic grading that defines the cinematic atmosphere and sets the mood.", iconName: "Paintbrush" },
    { title: "Sound Design & SFX", description: "Immersive audio soundscapes, ambient noise removal, and impactful custom sound effects.", iconName: "Zap" }
  ];

  return (
    <div id="features" className="bg-zinc-950 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-wider">{subtitle}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {defaultFeatures.map((feat, idx) => {
            const iconName = feat.iconName || (idx === 0 ? "Film" : idx === 1 ? "Paintbrush" : "Zap");
            // @ts-ignore
            const IconComp = iconMap[iconName] || iconMap.Star;
            return (
              <div 
                key={idx} 
                className="group relative rounded-3xl bg-zinc-900/20 border border-white/5 p-8 hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
`
  },
  '/registry/components/Portfolio.tsx': {
    name: 'Portfolio.tsx',
    code: `import React, { useState, useEffect } from 'react';
import { Play, X, Loader2, Volume2, Pause } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  category: string;
  duration: string;
  imageUrl: string;
}

export default function Portfolio({ 
  title = "Selected Projects", 
  subtitle = "Portfolio & works", 
  projects = [] 
}: { 
  title?: string, 
  subtitle?: string, 
  projects?: Project[] 
}) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const defaultProjects = projects.length > 0 ? projects : [
    { title: "Cyberpunk Cinematic Showcase", description: "Vibrant neon color grading and high-energy transitions.", category: "Commercial", duration: "1:45", imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80" },
    { title: "Echoes of Silence (Music Video)", description: "Slow-paced narrative flow with emotional depth and shadow play.", category: "Music Video", duration: "3:20", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80" },
    { title: "The Last Nomad (Documentary)", description: "Raw, documentary-style storytelling highlighting remote lifestyles.", category: "Documentary", duration: "5:12", imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80" }
  ];

  useEffect(() => {
    let interval: any;
    if (activeProject && !loading && isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeProject, loading, isPlaying]);

  const openProject = (p: Project) => {
    setActiveProject(p);
    setLoading(true);
    setIsPlaying(false);
    setProgress(0);
    setTimeout(() => {
      setLoading(false);
      setIsPlaying(true);
    }, 1500);
  };

  return (
    <div id="portfolio" className="bg-zinc-950 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-wider">{subtitle}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {defaultProjects.map((p, idx) => (
            <div 
              key={idx} 
              onClick={() => openProject(p)}
              className="group cursor-pointer rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-950">
                <img 
                  src={p.imageUrl} 
                  alt={p.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="h-6 w-6 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-xs font-mono text-white px-2 py-1 rounded">
                  {p.duration}
                </span>
                <span className="absolute top-3 left-3 bg-indigo-600 text-xs font-semibold text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {p.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-zinc-400">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video bg-black flex flex-col items-center justify-center relative">
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                  <span className="text-zinc-400 font-medium">Loading high-definition preview...</span>
                </div>
              ) : (
                <div className="w-full h-full relative flex items-center justify-center">
                  <img src={activeProject.imageUrl} className="w-full h-full object-cover opacity-35 filter blur-[2px]" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          {activeProject.category}
                        </span>
                        <h4 className="text-2xl font-bold text-white mt-3">{activeProject.title}</h4>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-950/80 backdrop-blur border border-white/5 rounded-xl p-4 mt-auto w-full max-w-xl mx-auto">
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-4 overflow-hidden cursor-pointer">
                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-100" style={{ width: \`\${progress}%\` }} />
                      </div>
                      <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-4">
                          <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-indigo-400 transition-colors">
                            {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
                          </button>
                          <span className="text-xs font-mono text-zinc-400">
                            0:{(Math.floor(progress * 0.05)).toString().padStart(2, '0')} / {activeProject.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Volume2 className="h-5 w-5" />
                          <span className="text-xs uppercase font-semibold">1080p HD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`
  },
  '/registry/components/Pricing.tsx': {
    name: 'Pricing.tsx',
    code: `import React, { useState } from 'react';
import { Check, CreditCard, Lock, ShieldCheck, Loader2 } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  yearlyPrice: string;
  features: string[];
  popular: boolean;
  ctaText: string;
}

export default function Pricing({ 
  title = "Pricing Packages", 
  subtitle = "Choose what fits your workflow", 
  plans = [] 
}: { 
  title?: string, 
  subtitle?: string, 
  plans?: Plan[] 
}) {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentStep, setPaymentStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvc: '' });

  const defaultPlans = plans.length > 0 ? plans : [
    { name: "Starter Cut", price: "299", yearlyPrice: "239", features: ["1 Video Project (Up to 3 mins)", "1080p Output Resolution", "Color Grading included", "2 Rounds of Revisions", "3-5 Days Turnaround"], popular: false, ctaText: "Get Started" },
    { name: "Pro Production", price: "799", yearlyPrice: "639", features: ["4 Video Projects / Month", "Up to 4K Output Resolution", "Advanced Color & Sound Design", "Unlimited Revisions", "Priority 48h Delivery", "Dedicated Editor"], popular: true, ctaText: "Upgrade to Pro" },
    { name: "Enterprise Flow", price: "1899", yearlyPrice: "1519", features: ["Unlimited Video Projects", "Full Content Retainer", "Custom Graphics & VFX", "24/7 Slack Support", "12-hour Rush Delivery Option"], popular: false, ctaText: "Contact Sales" }
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
    }, 2000);
  };

  const closeCheckout = () => {
    setSelectedPlan(null);
    setPaymentStep('form');
    setForm({ name: '', email: '', card: '', expiry: '', cvc: '' });
  };

  return (
    <div id="pricing" className="bg-zinc-950 py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-wider">{subtitle}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</p>
          
          <div className="mt-8 flex justify-center items-center gap-3">
            <span className={\`text-sm \${!isYearly ? 'text-white font-medium' : 'text-zinc-500'}\`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 bg-zinc-800 rounded-full p-1 transition-colors duration-300 focus:outline-none"
            >
              <div 
                className={\`w-6 h-6 bg-indigo-500 rounded-full transition-transform duration-300 transform \${isYearly ? 'translate-x-6' : 'translate-x-0'}\`} 
              />
            </button>
            <span className={\`text-sm flex items-center gap-1.5 \${isYearly ? 'text-white font-medium' : 'text-zinc-500'}\`}>
              Yearly 
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mt-16">
          {defaultPlans.map((plan, idx) => {
            const currentPrice = isYearly ? plan.yearlyPrice : plan.price;
            return (
              <div 
                key={idx} 
                className={\`flex flex-col justify-between rounded-3xl p-8 bg-zinc-900/40 border transition-all duration-300 relative \${
                  plan.popular 
                    ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.2)] transform md:-translate-y-2' 
                    : 'border-white/5 hover:border-white/10 hover:shadow-xl'
                }\`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">\${currentPrice}</span>
                    <span className="text-sm text-zinc-400">/{isYearly ? 'yr' : 'mo'}</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-zinc-300 text-sm">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className={\`mt-10 w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 \${
                    plan.popular 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }\`}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
            {paymentStep !== 'success' && (
              <button 
                onClick={closeCheckout}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}

            {paymentStep === 'form' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-6 w-6 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">Complete Checkout</h3>
                </div>
                <div className="mb-6 p-4 bg-zinc-950 border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">{selectedPlan.name} ({isYearly ? 'Yearly' : 'Monthly'})</span>
                    <span className="text-white font-bold">\${isYearly ? selectedPlan.yearlyPrice : selectedPlan.price}</span>
                  </div>
                </div>
                
                <form onSubmit={handlePay} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Himanshu Chaurasia"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="himanshu@chaurasia.com"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Card Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      value={form.card}
                      onChange={e => setForm({...form, card: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Expiry</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={form.expiry}
                        onChange={e => setForm({...form, expiry: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">CVC</label>
                      <input 
                        type="password" 
                        required
                        placeholder="•••"
                        maxLength={3}
                        value={form.cvc}
                        onChange={e => setForm({...form, cvc: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-500 text-xs mt-2">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Payments are secured with end-to-end 256-bit encryption</span>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-6"
                  >
                    <span>Secure Payment of \${\$isYearly ? selectedPlan.yearlyPrice : selectedPlan.price}</span>
                  </button>
                </form>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mb-6" />
                <h4 className="text-xl font-bold text-white mb-2">Processing Payment...</h4>
                <p className="text-sm text-zinc-400">Verifying secure card authorization details...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="flex flex-col items-center justify-center py-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-80">
                  <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-ping top-4 left-6" />
                  <div className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce top-10 right-8" />
                  <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping bottom-12 left-10" />
                  <div className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-bounce bottom-6 right-16" />
                </div>
                
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="h-12 w-12" />
                </div>
                <h4 className="text-2xl font-extrabold text-white mb-2">Payment Confirmed!</h4>
                <p className="text-zinc-300 text-sm max-w-sm mb-8">
                  Thank you! You are now subscribed to the <strong className="text-white font-bold">{selectedPlan.name}</strong>. Himanshu's team will contact you shortly to begin onboarding.
                </p>
                <button 
                  onClick={closeCheckout}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl transition-colors border border-white/5"
                >
                  Return to Portfolio
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`
  },
  '/registry/components/Testimonials.tsx': {
    name: 'Testimonials.tsx',
    code: `import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

export default function Testimonials({ 
  title = "What Clients Say", 
  subtitle = "Reviews from top creators", 
  reviews = [] 
}: { 
  title?: string, 
  subtitle?: string, 
  reviews?: Review[] 
}) {
  const defaultReviews = reviews.length > 0 ? reviews : [
    { name: "Sarah Johnson", role: "Creative Director, Velo Media", comment: "Himanshu transformed our commercial campaign completely. His speed, color choices, and transitions brought the story to life. Highly recommend!", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    { name: "Alex Rivera", role: "Indie Film Producer", comment: "Working with Himanshu on our short film was seamless. He understood the dramatic tension we needed and delivered ahead of schedule.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { name: "Marcus Chen", role: "Tech YouTuber (2M Subs)", comment: "Finding a reliable video editor who understands YouTube rhythm is hard. Himanshu nailed our retention cuts and editing flow.", rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
  ];

  return (
    <div id="testimonials" className="bg-zinc-950 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-wider">{subtitle}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {defaultReviews.map((r, idx) => (
            <div 
              key={idx} 
              className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 hover:border-white/10 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 italic text-sm leading-relaxed">"{r.comment}"</p>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                <div>
                  <h4 className="text-white font-bold text-sm">{r.name}</h4>
                  <p className="text-xs text-zinc-500">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`
  },
  '/registry/components/Contact.tsx': {
    name: 'Contact.tsx',
    code: `import React, { useState } from 'react';
import { Mail, Phone, Loader2 } from 'lucide-react';

export default function Contact({ 
  title = "Let's Collaborate", 
  subtitle = "Get in touch for rates", 
  email = "himanshu@chaurasia.com", 
  phone = "+91 98765 43210" 
}: { 
  title?: string, 
  subtitle?: string, 
  email?: string, 
  phone?: string 
}) {
  const [form, setForm] = useState({ name: '', email: '', project: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast("Message sent successfully! Himanshu will respond within 24 hours.");
      setForm({ name: '', email: '', project: '', details: '' });
      setTimeout(() => {
        setToast(null);
      }, 4000);
    }, 1500);
  };

  return (
    <div id="contact" className="bg-zinc-950 py-24 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),rgba(255,255,255,0))]"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-wider">{subtitle}</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</p>
            <p className="mt-6 text-base text-zinc-400 max-w-md">
              Looking for professional video editing, color grading, or motion graphic services? Shoot a message, and let's craft something memorable.
            </p>
            
            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Email Me</p>
                  <a href={\`mailto:\${email}\`} className="text-white hover:text-indigo-400 font-medium text-sm transition-colors">{email}</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Call Me</p>
                  <a href={\`tel:\${phone}\`} className="text-white hover:text-indigo-400 font-medium text-sm transition-colors">{phone}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Project Type</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Music Video, Commercial"
                    value={form.project}
                    onChange={e => setForm({...form, project: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Project Details</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell me about your project, raw footage size, timeline..."
                  value={form.details}
                  onChange={e => setForm({...form, details: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending Proposal...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-indigo-500/30 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-sm">
          <div className="h-8 w-8 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center shrink-0">
            ✓
          </div>
          <span className="text-sm font-medium text-zinc-300">{toast}</span>
        </div>
      )}
    </div>
  );
}
`
  },
  '/registry/components/Footer.tsx': {
    name: 'Footer.tsx',
    code: `import React from 'react';

export default function Footer({ 
  logo = "Logo", 
  text = "© 2026 Himanshu Chaurasia. All rights reserved." 
}: { 
  logo?: string, 
  text?: string 
}) {
  const scrollToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    const homeSec = document.getElementById('home');
    if (homeSec) {
      homeSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">
            Twitter
          </a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">
            YouTube
          </a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">
            Instagram
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0 flex flex-col md:flex-row items-center gap-4">
          <a href="#home" onClick={scrollToHome} className="font-extrabold text-xl tracking-tighter text-white">
            {logo}
          </a>
          <p className="text-center text-xs leading-5 text-zinc-500">
            {text}
          </p>
        </div>
      </div>
    </footer>
  );
}
`
  }
};
