
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageSquare, UserCheck, Shield, BarChart2 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-campus-600 to-campus-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-4 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Your Voice Matters
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-lg">
                CampusVoice provides a safe platform for students to raise concerns, share ideas, and make a difference in their academic institution.
              </p>
              <div className="pt-4 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-campus-800 hover:bg-gray-100">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl">
                <img 
                  src="https://placehold.co/600x400/2080ff/FFFFFF?text=CampusVoice" 
                  alt="CampusVoice Platform"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Bridging the Communication Gap
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md card-hover">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-campus-50 flex items-center justify-center text-campus-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium">Share Your Concerns</h3>
                <p className="text-gray-600">
                  Submit issues or suggestions anonymously or with your identity.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md card-hover">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium">Track Resolution</h3>
                <p className="text-gray-600">
                  Monitor the status of your submissions in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md card-hover">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium">Guaranteed Privacy</h3>
                <p className="text-gray-600">
                  Your identity is protected when you choose to remain anonymous.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md card-hover">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium">Data-Driven Insights</h3>
                <p className="text-gray-600">
                  Administration uses analytics to improve campus services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join the CampusVoice community and contribute to building a better campus environment.
          </p>
          <Button asChild size="lg" className="font-medium">
            <Link to="/login" className="flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
