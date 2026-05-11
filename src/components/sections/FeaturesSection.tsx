import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, LayoutTemplate, Box } from 'lucide-react';

const features = [
  {
    icon: <Code2 className="w-6 h-6 text-blue-400" />,
    title: "Production-Ready Code",
    description: "Generate clean, modern React code using Tailwind CSS that you can directly copy into your codebase.",
    color: "from-blue-500/20 to-blue-500/0"
  },
  {
    icon: <LayoutTemplate className="w-6 h-6 text-purple-400" />,
    title: "Live Preview",
    description: "Instantly see what you build with our integrated Sandpack preview environment.",
    color: "from-purple-500/20 to-purple-500/0"
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Instant Iterations",
    description: "Modify the generated code in our Monaco editor and watch the UI update in milliseconds.",
    color: "from-amber-500/20 to-amber-500/0"
  },
  {
    icon: <Box className="w-6 h-6 text-emerald-400" />,
    title: "Component Library",
    description: "Access a vast library of pre-built, premium UI components to kickstart your development.",
    color: "from-emerald-500/20 to-emerald-500/0"
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-6 py-32 z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Everything you need to ship faster.
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          We've combined the best developer tools into one seamless AI-powered workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative rounded-2xl border border-white/10 bg-zinc-900/40 p-8 hover:bg-zinc-900/60 transition-colors overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${feature.color} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
