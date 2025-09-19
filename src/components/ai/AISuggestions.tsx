import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lightbulb, Clock, Calendar, Sparkles, Search, Heart } from "lucide-react";
import moment from "moment";
import { AppointmentEvent } from "@/components/calendar/AppointmentCalendar";
import { motion } from "framer-motion";

interface AISuggestionsProps {
  existingEvents: AppointmentEvent[];
  userRole: "patient" | "practitioner";
}

const AISuggestions = ({ existingEvents, userRole }: AISuggestionsProps) => {
  const [symptomInput, setSymptomInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // AI logic to suggest next available slots
  const suggestions = useMemo(() => {
    const now = moment();
    const suggestedSlots = [];
    
    // Generate next 5 available time slots
    for (let i = 1; i <= 5; i++) {
      const potentialTime = now.clone().add(i, 'days').hour(10).minute(0).second(0);
      
      // Check if this time conflicts with existing events
      const hasConflict = existingEvents.some(event => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);
        const slotEnd = potentialTime.clone().add(1, 'hour');
        
        return potentialTime.isBetween(eventStart, eventEnd, null, '[]') ||
               slotEnd.isBetween(eventStart, eventEnd, null, '[]') ||
               (potentialTime.isSameOrBefore(eventStart) && slotEnd.isSameOrAfter(eventEnd));
      });
      
      if (!hasConflict) {
        suggestedSlots.push({
          time: potentialTime.toDate(),
          duration: '1 hour',
          confidence: Math.floor(Math.random() * 30) + 70 // 70-100% confidence
        });
      }
      
      if (suggestedSlots.length >= 3) break;
    }
    
    return suggestedSlots;
  }, [existingEvents]);

  // AI therapy recommendations based on symptoms
  const getTherapyRecommendation = (symptoms: string) => {
    const symptomLower = symptoms.toLowerCase();
    
    if (symptomLower.includes('stress') || symptomLower.includes('anxiety') || symptomLower.includes('tension')) {
      return {
        therapy: 'Shirodhara',
        reason: 'Continuous oil pouring therapy for deep relaxation and stress relief',
        duration: '75 minutes',
        icon: '🧘‍♀️'
      };
    }
    
    if (symptomLower.includes('pain') || symptomLower.includes('muscle') || symptomLower.includes('joint')) {
      return {
        therapy: 'Abhyanga Massage',
        reason: 'Therapeutic oil massage to relieve muscle tension and joint pain',
        duration: '90 minutes',
        icon: '💆‍♀️'
      };
    }
    
    if (symptomLower.includes('detox') || symptomLower.includes('cleanse') || symptomLower.includes('toxin')) {
      return {
        therapy: 'Panchakarma Therapy',
        reason: 'Complete detoxification and cleansing treatment',
        duration: '120 minutes',
        icon: '💆'
      };
    }
    
    if (symptomLower.includes('sinus') || symptomLower.includes('congestion') || symptomLower.includes('headache')) {
      return {
        therapy: 'Nasya Treatment',
        reason: 'Nasal therapy for respiratory and sinus relief',
        duration: '45 minutes',
        icon: '🌬️'
      };
    }
    
    return {
      therapy: 'Initial Consultation',
      reason: 'Comprehensive assessment to determine the best treatment plan',
      duration: '60 minutes',
      icon: '🩺'
    };
  };

  const handleSymptomAnalysis = () => {
    if (!symptomInput.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const currentRecommendation = symptomInput ? getTherapyRecommendation(symptomInput) : null;

  return (
    <div className="space-y-6">
      {/* AI Therapy Recommendations - Patient Only */}
      {userRole === 'patient' && (
        <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Wellness Assistant
            </CardTitle>
            <CardDescription>Describe your symptoms for personalized therapy recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., I'm feeling stressed and have shoulder tension..."
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  className="flex-1 border-border/50 focus:border-primary"
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleSymptomAnalysis}
                    disabled={!symptomInput.trim() || isAnalyzing}
                    className="bg-gradient-healing hover:bg-primary/90"
                  >
                    {isAnalyzing ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {currentRecommendation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{currentRecommendation.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      {currentRecommendation.therapy}
                      <Badge variant="secondary" className="text-xs">
                        AI Recommended
                      </Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentRecommendation.reason}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Duration: {currentRecommendation.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Time Slot Suggestions */}
      <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lightbulb className="w-5 h-5 text-primary" />
            {userRole === 'patient' ? 'Available Time Slots' : 'Scheduling Insights'}
          </CardTitle>
          <CardDescription>
            {userRole === 'patient' ? 'AI-suggested optimal appointment times' : 'Smart scheduling recommendations'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="text-center py-4">
              <Calendar className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No available slots found</p>
              <p className="text-xs text-muted-foreground">Try scheduling for next week</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div 
                  key={index} 
                  className="p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/20 p-1.5 rounded-md">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {moment(suggestion.time).format('dddd, MMM Do')}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {moment(suggestion.time).format('h:mm A')} • {suggestion.duration}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        suggestion.confidence >= 90 ? 'bg-primary/20 text-primary' :
                        suggestion.confidence >= 80 ? 'bg-accent/20 text-accent' :
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      {suggestion.confidence}% optimal
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISuggestions;