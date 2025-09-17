import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Clock, User, LogOut, Heart, Activity, Zap } from "lucide-react";
import AppointmentCalendar, { AppointmentEvent } from "@/components/calendar/AppointmentCalendar";
import BookingModal from "@/components/booking/BookingModal";
import AISuggestions from "@/components/ai/AISuggestions";
import { motion } from "framer-motion";

interface PatientDashboardProps {
  user: { username: string; role: "patient" | "practitioner"; fullName?: string };
  onLogout: () => void;
}

const PatientDashboard = ({ user, onLogout }: PatientDashboardProps) => {
  const [events, setEvents] = useState<AppointmentEvent[]>([
    {
      id: '1',
      title: 'Panchakarma Therapy',
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      therapyType: 'panchakarma',
      patientName: user.fullName || 'Current User',
      notes: 'Initial detox session',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Follow-up Consultation',
      start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      therapyType: 'consultation',
      patientName: user.fullName || 'Current User',
      notes: '',
      status: 'scheduled'
    }
  ]);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setIsBookingModalOpen(true);
  };

  const handleSelectEvent = (event: AppointmentEvent) => {
    console.log('Selected event:', event);
  };

  const handleBooking = (booking: {
    therapyType: string;
    patientName: string;
    notes: string;
    start: Date;
    end: Date;
  }) => {
    const therapyNames: Record<string, string> = {
      consultation: 'Initial Consultation',
      panchakarma: 'Panchakarma Therapy',
      abhyanga: 'Abhyanga Massage',
      shirodhara: 'Shirodhara',
      nasya: 'Nasya Treatment',
      basti: 'Basti Therapy'
    };

    const newEvent: AppointmentEvent = {
      id: Date.now().toString(),
      title: therapyNames[booking.therapyType] || booking.therapyType,
      start: booking.start,
      end: booking.end,
      therapyType: booking.therapyType,
      patientName: booking.patientName,
      notes: booking.notes,
      status: 'scheduled'
    };

    setEvents(prev => [...prev, newEvent]);
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-sm shadow-gentle border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-gradient-healing p-2 rounded-lg shadow-gentle">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Patient Dashboard</h1>
                <p className="text-sm text-muted-foreground">Your wellness journey awaits</p>
              </div>
            </motion.div>
            <Button 
              onClick={onLogout} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calendar */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AppointmentCalendar
              events={events}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              userRole="patient"
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Quick Actions */}
            <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Plus className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-gradient-healing hover:bg-primary/90 transition-gentle shadow-gentle"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full border-border/50 hover:bg-accent/20">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Appointments
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Therapy Recommendations */}
            <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Heart className="w-5 h-5 text-primary" />
                  Wellness Recommendations
                </CardTitle>
                <CardDescription>Personalized therapy suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Stress Relief</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shirodhara therapy recommended for relaxation</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">Energy Balance</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Abhyanga massage for vitality</p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No appointments scheduled</p>
                    <p className="text-xs text-muted-foreground">Book your first session to begin</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.slice(0, 3).map((event, index) => (
                      <motion.div 
                        key={event.id} 
                        className="p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border/30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <p className="font-medium text-sm text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.start).toLocaleDateString()} at{" "}
                          {new Date(event.start).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            event.status === 'confirmed' ? 'bg-primary/20 text-primary' :
                            event.status === 'scheduled' ? 'bg-accent/20 text-accent' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <AISuggestions 
              existingEvents={events}
              userRole="patient"
            />
          </motion.div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedSlot={selectedSlot}
        onBooking={handleBooking}
        patientName="Current User"
      />
    </div>
  );
};

export default PatientDashboard;