
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cog, Bot, Zap, Users, Trophy } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-robotics-navy text-white py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4896&q=80')`
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-robotics-navy/60" />
      
      <div className="absolute left-0 top-0 opacity-10">
        <Cog size={200} className="text-white animate-gear-spin" />
      </div>
      <div className="absolute right-0 bottom-0 opacity-10">
        <Cog size={150} className="text-white animate-gear-spin" style={{ animationDirection: 'reverse' }} />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            <span className="text-robotics-accent">Robotics</span> Classes
          </h1>
          
          <p className="text-xl md:text-2xl mb-8">
            Hands-on STEAM education through VEX robotics by VEX Certified Instructor
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg mb-8">
            <h2 className="font-display font-bold text-2xl mb-6 text-robotics-accent">Our STEAM Approach: Learning That Connects the Dots</h2>
            <p className="text-lg leading-relaxed">
              In our robotics classes, we go beyond just building and coding—we bring the full power of STEAM (Science, Technology, Engineering, Arts, and Math) into every session. Students not only learn how robots move and think, but also why design matters, how to solve real-world problems creatively, and how teamwork and critical thinking turn ideas into action. It's hands-on learning that's fun, challenging, and built for the future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Bot className="text-robotics-accent mb-4 mx-auto" size={48} />
              <h3 className="font-bold text-xl mb-2">VEX Robotics</h3>
              <p>Professional-grade robotics platform used in schools worldwide</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Users className="text-robotics-accent mb-4 mx-auto" size={48} />
              <h3 className="font-bold text-xl mb-2">Small Classes</h3>
              <p>Personalized attention with maximum 4 students per class</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Trophy className="text-robotics-accent mb-4 mx-auto" size={48} />
              <h3 className="font-bold text-xl mb-2">Competition Ready</h3>
              <p>Prepare for VEX IQ competitions and robotics tournaments</p>
            </div>
          </div>
          
          <Link to="/registration">
            <Button size="lg" className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy font-bold text-lg px-8 py-4">
              <Zap className="mr-2" size={24} />
              Register for Classes Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
