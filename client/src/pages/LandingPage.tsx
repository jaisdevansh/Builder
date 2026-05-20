import React, { memo } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import DemoSection from '../components/sections/DemoSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PricingSection from '../components/sections/PricingSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import Footer from '../components/layout/Footer';

const MemoizedNavbar = memo(Navbar);
const MemoizedHero = memo(HeroSection);
const MemoizedDemo = memo(DemoSection);
const MemoizedFeatures = memo(FeaturesSection);
const MemoizedPricing = memo(PricingSection);
const MemoizedTestimonials = memo(TestimonialsSection);
const MemoizedFooter = memo(Footer);

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      
      <MemoizedNavbar />
      
      <main className="flex-1 flex flex-col items-center w-full">
        <MemoizedHero />
        <MemoizedDemo />
        <MemoizedFeatures />
        <MemoizedTestimonials />
        <MemoizedPricing />
      </main>
      
      <MemoizedFooter />
    </div>
  );
};

export default LandingPage;
