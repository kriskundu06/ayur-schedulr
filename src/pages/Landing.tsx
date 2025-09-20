import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Users, Star, CheckCircle } from "lucide-react";
import ayursutraLogo from "@/assets/ayursutra-logo-circle.png";

interface LandingProps {
  onGetStarted: () => void;
}

const Landing = ({ onGetStarted }: LandingProps) => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered appointment booking that respects therapy durations and practitioner availability"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Customized therapy recommendations based on your symptoms and wellness goals"
    },
    {
      icon: Users,
      title: "Expert Practitioners",
      description: "Connect with certified Ayurveda practitioners for authentic healing experiences"
    }
  ];

  const therapies = [
    { name: "Panchakarma", icon: "💆", duration: "2h", popularity: 95 },
    { name: "Shirodhara", icon: "🧘‍♀️", duration: "75min", popularity: 88 },
    { name: "Abhyanga", icon: "💆‍♀️", duration: "90min", popularity: 92 },
    { name: "Nasya", icon: "🌬️", duration: "45min", popularity: 75 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-calm opacity-60" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src={ayursutraLogo} 
                alt="AyurSutra Logo" 
                className="w-24 h-24 rounded-full object-cover"
              />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              AyurSutra
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Smart Ayurveda Therapy Scheduling for Holistic Care
            </motion.p>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Experience the ancient wisdom of Ayurveda with modern convenience. 
              Our AI-powered platform connects you with certified practitioners for personalized healing journeys.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-healing hover:bg-primary/90 transition-gentle shadow-warm text-white font-medium px-8 py-3 text-lg"
                >
                  Begin Your Wellness Journey
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/30 hover:bg-primary/10 text-foreground px-8 py-3 text-lg"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose AyurSutra?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining traditional Ayurvedic wisdom with modern technology for the ultimate healing experience
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm h-full">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-healing p-3 rounded-full w-fit mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Therapies Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Popular Therapies
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover authentic Ayurvedic treatments tailored to your unique constitution and wellness needs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {therapies.map((therapy, index) => (
              <motion.div
                key={therapy.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-3">{therapy.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2">{therapy.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{therapy.duration}</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span className="text-sm font-medium text-accent">{therapy.popularity}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <Card className="shadow-warm border-0 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary mr-2" />
                  <span className="text-lg font-medium text-foreground">Ready to start your healing journey?</span>
                </div>
                
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Join thousands who have discovered balance, wellness, and vitality through authentic Ayurvedic care. 
                  Book your consultation today and experience the difference.
                </p>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={onGetStarted}
                    size="lg"
                    className="bg-gradient-healing hover:bg-primary/90 transition-gentle shadow-warm text-white font-medium px-12 py-4 text-lg"
                  >
                    Get Started Now
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Landing;