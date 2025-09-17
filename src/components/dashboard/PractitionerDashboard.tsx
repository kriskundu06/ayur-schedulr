import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, LogOut, CheckCircle, XCircle, Shield, TrendingUp, Activity } from "lucide-react";
import AppointmentCalendar, { AppointmentEvent } from "@/components/calendar/AppointmentCalendar";
import AISuggestions from "@/components/ai/AISuggestions";
import { motion } from "framer-motion";

interface PractitionerDashboardProps {
  user: { username: string; role: "patient" | "practitioner"; fullName?: string };
  onLogout: () => void;
}

const PractitionerDashboard = ({ user, onLogout }: PractitionerDashboardProps) => {
  const [events, setEvents] = useState<AppointmentEvent[]>([
    {
      id: '1',
      title: 'Panchakarma - Sarah Johnson',
      start: new Date(Date.now() + 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      therapyType: 'panchakarma',
      patientName: 'Sarah Johnson',
      notes: 'Initial detox session, check allergies',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Consultation - Mike Chen',
      start: new Date(Date.now() + 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
      therapyType: 'consultation',
      patientName: 'Mike Chen',
      notes: 'Follow-up for digestive issues',
      status: 'confirmed'
    },
    {
      id: '3',
      title: 'Abhyanga - Emma Wilson',
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      therapyType: 'abhyanga',
      patientName: 'Emma Wilson',
      notes: 'Stress relief session',
      status: 'scheduled'
    }
  ]);

  const handleSelectEvent = (event: AppointmentEvent) => {
    console.log('Selected appointment:', event);
  };

  const handleApproveAppointment = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'confirmed' as const }
          : event
      )
    );
  };

  const handleDeclineAppointment = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'cancelled' as const }
          : event
      )
    );
  };

  const pendingAppointments = events.filter(event => event.status === 'scheduled');

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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Practitioner Dashboard</h1>
                <p className="text-sm text-muted-foreground">Healing through Ayurveda wisdom</p>
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
              onSelectSlot={() => {}}
              onSelectEvent={handleSelectEvent}
              userRole="practitioner"
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold text-foreground">{events.length}</p>
                        <p className="text-xs text-muted-foreground">Total Bookings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {events.filter(e => e.status === 'scheduled').length}
                        </p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Practice Insights */}
            <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Practice Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Today's Sessions</span>
                  <span className="text-sm font-medium text-foreground">
                    {events.filter(e => 
                      new Date(e.start).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="text-sm font-medium text-foreground">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Most Popular</span>
                  <span className="text-sm font-medium text-primary">Abhyanga</span>
                </div>
              </CardContent>
            </Card>

            {/* Pending Appointments */}
            <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5 text-primary" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Review and approve patient requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingAppointments.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">All appointments reviewed</p>
                    <p className="text-xs text-muted-foreground">No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingAppointments.map((event, index) => (
                      <motion.div 
                        key={event.id} 
                        className="p-3 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg border border-accent/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-sm text-foreground">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.patientName} • {new Date(event.start).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.start).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(event.end).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {event.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                "{event.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveAppointment(event.id)}
                              className="w-full bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeclineAppointment(event.id)}
                              className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Decline
                            </Button>
                          </motion.div>
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
              userRole="practitioner"
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PractitionerDashboard;