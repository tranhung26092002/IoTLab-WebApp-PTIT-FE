import React from 'react';
import AppLayout from '../components/AppLayout';
import { Hero } from '../components/about/Hero';
import { Stats } from '../components/about/Stats';
import { Mission } from '../components/about/Mission';
import { Facilities } from '../components/about/Facilities';
import { Team } from '../components/about/Team';

const About: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Hero />
        <Stats />
        <Mission />
        <Facilities />
        <Team />
      </div>
    </AppLayout>
  );
};

export default About;