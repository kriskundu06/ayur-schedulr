import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Calendar, User } from "lucide-react";
import { AppointmentEvent } from "@/components/calendar/AppointmentCalendar";
import moment from "moment";

interface SuggestedSlot {
  start: Date;
  end: Date;
  confidence: number;
  reason: string;
}

interface AISuggestionsProps {
  events: AppointmentEvent[];
  therapyDuration: number; // in minutes
  onSelectSuggestion: (slot: { start: Date; end: Date }) => void;
  className?: string;
}

const AISuggestions = ({ events, therapyDuration, onSelectSuggestion, className }: AISuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<SuggestedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateSuggestions();
  }, [events, therapyDuration]);

  const generateSuggestions = () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestions = findAvailableSlots();
      setSuggestions(suggestions);
      setIsLoading(false);
    }, 1000);
  };

  const findAvailableSlots = (): SuggestedSlot[] => {
    const suggestions: SuggestedSlot[] = [];
    const now = moment();
    const endOfWeek = moment().add(7, 'days');
    
    // Working hours: 8 AM to 8 PM
    const workingHours = { start: 8, end: 20 };
    
    // Check each day for available slots
    for (let day = now.clone(); day.isBefore(endOfWeek); day.add(1, 'day')) {
      if (day.day() === 0) continue; // Skip Sundays
      
      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = day.clone().hour(hour).minute(minute).second(0);
          const slotEnd = slotStart.clone().add(therapyDuration, 'minutes');
          
          // Skip past slots
          if (slotStart.isBefore(now)) continue;
          
          // Check if slot conflicts with existing events
          const hasConflict = events.some(event => {
            const eventStart = moment(event.start);
            const eventEnd = moment(event.end);
            
            return (
              (slotStart.isBefore(eventEnd) && slotEnd.isAfter(eventStart)) ||
              (eventStart.isBefore(slotEnd) && eventEnd.isAfter(slotStart))
            );
          });
          
          if (!hasConflict && suggestions.length < 5) {
            let confidence = 0.8;
            let reason = "Available slot";
            
            // Boost confidence for preferred times
            if (hour >= 9 && hour <= 17) {
              confidence += 0.1;
              reason = "Optimal time slot";
            }
            
            // Boost confidence for today/tomorrow
            if (slotStart.isSame(now, 'day')) {
              confidence += 0.1;
              reason = "Available today";
            } else if (slotStart.isSame(now.clone().add(1, 'day'), 'day')) {
              confidence += 0.05;
              reason = "Available tomorrow";
            }
            
            suggestions.push({
              start: slotStart.toDate(),
              end: slotEnd.toDate(),
              confidence: Math.min(confidence, 1),
              reason
            });
          }
        }
      }
    }
    
    // Sort by confidence and time
    return suggestions
      .sort((a, b) => {
        if (b.confidence !== a.confidence) {
          return b.confidence - a.confidence;
        }
        return moment(a.start).diff(moment(b.start));
      })
      .slice(0, 3);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.8) return "bg-blue-500";
    return "bg-yellow-500";
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-gentle-pulse" />
            AI Suggestions
          </CardTitle>
          <CardDescription>Finding optimal appointment slots...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Suggestions
        </CardTitle>
        <CardDescription>
          Smart recommendations for your {therapyDuration}-minute session
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No available slots found for the next 7 days.</p>
            <p className="text-sm">Try selecting a different therapy duration.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:shadow-gentle transition-all cursor-pointer group"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}% match
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {suggestion.reason}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        {moment(suggestion.start).format('ddd, MMM D')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-primary" />
                        {moment(suggestion.start).format('h:mm A')} - {moment(suggestion.end).format('h:mm A')}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-gentle"
                  >
                    Select
                  </Button>
                </div>
                
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${getConfidenceColor(suggestion.confidence)}`}
                      style={{ width: `${suggestion.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={generateSuggestions}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Refresh Suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;