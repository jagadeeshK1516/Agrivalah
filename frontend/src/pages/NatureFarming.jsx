import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, Leaf, MessageSquare, Microscope, Tractor, Wind, Zap, MessageCircle } from 'lucide-react';
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const gettingStartedTopics = [
  { title: "Jeevamrutam", description: "Learn to prepare and use this microbial culture to enrich your soil.", icon: Leaf, link: "/article/jeevamrutam" },
  { title: "Beejamrutam", description: "A guide to treating seeds for better germination and disease protection.", icon: Microscope, link: "/article/beejamrutam" },
  { title: "Neemastra", description: "Effective, natural pest control using neem-based solutions.", icon: Zap, link: "/article/neemastra" },
  { title: "Agniastra", description: "A powerful organic pesticide for tackling tougher pest infestations.", icon: Wind, link: "/article/agniastra" },
];

const cropCalendars = {
  haryana: [
    { crop: "Wheat (Rabi)", sowing: "Oct-Nov", inputs: "Jeevamrutam, Ghanjeevamrutam", harvest: "Mar-Apr" },
    { crop: "Mustard (Rabi)", sowing: "Sep-Oct", inputs: "Beejamrutam, Neemastra", harvest: "Feb-Mar" },
  ],
  punjab: [
    { crop: "Rice (Kharif)", sowing: "Jun-Jul", inputs: "Jeevamrutam, Pest traps", harvest: "Oct-Nov" },
    { crop: "Maize (Kharif)", sowing: "Jun-Jul", inputs: "Agniastra, FYM", harvest: "Sep-Oct" },
  ],
};

export default function NatureFarmingPage() {
  useScrollToTop();
  const [activeState, setActiveState] = React.useState('haryana');

  return (
    <div className="min-h-screen py-16">
       <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto px-4">
        <Badge className="bg-green-100 text-green-800 mb-4 text-md  transition-colors duration-300 hover:bg-green-600 hover:text-white">
          <BookOpen className="w-4 h-4 mr-2" />
          AgriZone: Nature Farming
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Grow Organic with Confidence</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Insurance, traceability, and real results. Master nature farming with our proven SOPs, expert guidance, and community support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
            <Download className="w-5 h-5 mr-2" />
            Download All SOPs
          </Button>
          <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
            Join Training
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Getting Started Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Getting Started with Organic Inputs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gettingStartedTopics.map(topic => (
              <Card key={topic.title} className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <topic.icon className="w-8 h-8 text-green-700" />
                  </div>
                  <CardTitle>{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <Button variant="link" className="text-green-600">Read Article</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seasonal Crop Calendars Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Seasonal Crop Calendars</h2>
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 rounded-full p-1 flex space-x-1">
              <Button onClick={() => setActiveState('haryana')} variant={activeState === 'haryana' ? 'default' : 'ghost'} className="rounded-full">Haryana</Button>
              <Button onClick={() => setActiveState('punjab')} variant={activeState === 'punjab' ? 'default' : 'ghost'} className="rounded-full">Punjab</Button>
            </div>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {cropCalendars[activeState].map(cal => (
                  <AccordionItem key={cal.crop} value={cal.crop}>
                    <AccordionTrigger className="text-lg font-semibold">{cal.crop}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        <li><strong>Sowing Window:</strong> {cal.sowing}</li>
                        <li><strong>Key Inputs:</strong> {cal.inputs}</li>
                        <li><strong>Harvest Period:</strong> {cal.harvest}</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Residue & Compliance */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-10">Residue & Compliance</h2>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Export Checklist</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Maximum Residue Level (MRL) compliance</li>
                  <li>Phytosanitary certification</li>
                  <li>Organic certification (e.g., NPOP, USDA)</li>
                  <li>Traceability documentation</li>
                </ul>
                <Button variant="outline" className="mt-4 w-full">Download Full Guide</Button>
              </CardContent>
            </Card>
          </section>

          {/* Model Farms */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-10">Model Farms</h2>
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Inspiration from our Partners</CardTitle></CardHeader>
              <CardContent>
                <div className="relative h-48 bg-cover bg-center rounded-lg" style={{backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400')"}}>
                   <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                   <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold">Green Valley International School</p>
                      <p className="text-sm">Showcasing urban organic farming.</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Ask an Expert Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">Ask an Expert</h2>
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader><CardTitle>Have a Question?</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input placeholder="Your Pincode" />
                <Textarea placeholder="Your question about nature farming..." />
                <div className="flex justify-between items-center">
                   <Button>Submit Question</Button>
                   <Button variant="secondary" className="bg-green-100 text-green-800"><MessageSquare className="w-4 h-4 mr-2" /> Quick WhatsApp</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}