import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Buildify AI has completely transformed our workflow. What used to take days now takes minutes. The generated code is incredibly clean and ready for production.",
    author: "Sarah Jenkins",
    role: "Frontend Lead at TechFlow",
    avatar: "SJ",
    color: "bg-blue-500"
  },
  {
    quote: "The ability to just describe what I want and see the UI appear with perfect Tailwind classes is magical. It's like having a senior engineer pairing with you 24/7.",
    author: "David Chen",
    role: "Founder, StartupX",
    avatar: "DC",
    color: "bg-purple-500"
  },
  {
    quote: "We've replaced our entire prototyping phase with Buildify AI. The Framer Motion integration out of the box makes the designs feel premium instantly.",
    author: "Emily Rodriguez",
    role: "Product Designer",
    avatar: "ER",
    color: "bg-emerald-500"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="w-full max-w-7xl mx-auto px-6 py-20 z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Loved by developers.
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          See what teams are saying about the future of UI development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-8 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-sm flex flex-col justify-between"
          >
            <div className="mb-6 relative">
              <svg className="absolute -top-4 -left-4 w-8 h-8 text-white/5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-zinc-300 leading-relaxed relative z-10 italic">
                "{testimonial.quote}"
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-auto">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${testimonial.color}`}>
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">{testimonial.author}</h4>
                <p className="text-zinc-500 text-xs">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
