import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for exploring the AI capabilities.',
    features: ['10 AI Generations per month', 'Basic UI Components', 'Community Support', 'Standard Export'],
    buttonText: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For professionals building real products.',
    features: ['Unlimited AI Generations', 'Premium Component Library', 'Priority Support', 'Full Project Export', 'Custom Themes'],
    buttonText: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: '/mo',
    description: 'For teams shipping at the speed of thought.',
    features: ['Everything in Pro', 'Collaborative Workspace', 'Shared Component Library', 'Dedicated Account Manager', 'Custom Integrations'],
    buttonText: 'Contact Sales',
    popular: false,
  }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto px-6 py-32 z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Simple, transparent pricing.
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Start for free, upgrade when you need more power.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative rounded-3xl border p-8 flex flex-col h-full bg-zinc-900/40 backdrop-blur-sm transition-all ${
              plan.popular 
                ? 'border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-105 z-10' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-zinc-400 min-h-[40px]">{plan.description}</p>
            </div>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{plan.price}</span>
              {plan.period && <span className="text-zinc-500 font-medium">{plan.period}</span>}
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
              plan.popular 
                ? 'bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}>
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
