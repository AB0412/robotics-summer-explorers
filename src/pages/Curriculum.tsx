
import React from 'react';
import CurriculumSection from '@/components/sections/CurriculumSection';
import CurriculumFlyer from '@/components/flyer/CurriculumFlyer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Curriculum = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="overview">Curriculum Overview</TabsTrigger>
            <TabsTrigger value="flyer">Downloadable Flyer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <CurriculumSection />
          </TabsContent>
          
          <TabsContent value="flyer">
            <CurriculumFlyer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Curriculum;
