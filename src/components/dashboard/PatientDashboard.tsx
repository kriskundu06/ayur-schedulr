import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppointmentCalendar, { AppointmentEvent } from "@/components/calendar/AppointmentCalendar";
import BookingModal from "@/components/booking/BookingModal";
import AISuggestions from "@/components/ai/AISuggestions";
import { User } from "@/components/auth/LoginForm";
import { Calendar, Clock, Heart, LogOut, User as UserIcon } from "lucide-react";
import moment from "moment";

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

const PatientDashboard = ({ user, onLogout }: PatientDashboardProps) => {
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedTherapyDuration, setSelectedTherapyDuration] = useState(60);

  // Load demo events
  useEffect(() => {
    const demoEvents: AppointmentEvent[] = [
      {
        id: '1',
        title: 'Panchakarma Therapy',
        start: moment().add(2, 'days').hour(10).minute(0).toDate(),
        end: moment().add(2, 'days').hour(12).minute(0).toDate(),
        therapyType: 'panchakarma',
        patientName: user.fullName || 'You',
        notes: 'Initial detox session',
        status: 'confirmed'
      },
      {
        id: '2',
        title: 'Follow-up Consultation',
        start: moment().add(5, 'days').hour(14).minute(0).toDate(),
        end: moment().add(5, 'days').hour(15).minute(0).toDate(),
        therapyType: 'consultation',
        patientName: user.fullName || 'You',
        notes: '',
        status: 'scheduled'
      }
    ];
    setEvents(demoEvents);
  }, [user]);

  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setShowBookingModal(true);
  };

  const handleBooking = (booking: {
    therapyType: string;
    patientName: string;
    notes: string;
    start: Date;
    end: Date;
  }) => {
    const newEvent: AppointmentEvent = {
      id: Date.now().toString(),
      title: getTherapyName(booking.therapyType),
      start: booking.start,
      end: booking.end,
      therapyType: booking.therapyType,
      patientName: booking.patientName,
      notes: booking.notes,
      status: 'scheduled'
    };

    setEvents(prev => [...prev, newEvent]);
  };

  const getTherapyName = (therapyType: string) => {
    const therapyNames: Record<string, string> = {
      consultation: 'Initial Consultation',
      panchakarma: 'Panchakarma Therapy',
      abhyanga: 'Abhyanga Massage',
      shirodhara: 'Shirodhara',
      nasya: 'Nasya Treatment',
      basti: 'Basti Therapy'
    };
    return therapyNames[therapyType] || therapyType;
  };

  const upcomingAppointments = events
    .filter(event => moment(event.start).isAfter(moment()))
    .sort((a, b) => moment(a.start).diff(moment(b.start)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-gentle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-healing rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">AyurVeda Clinic</h1>
                <p className="text-sm text-muted-foreground">Patient Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.fullName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="transition-gentle"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <AppointmentCalendar
              events={events}
              onSelectSlot={handleSlotSelect}
              onSelectEvent={(event) => console.log('Selected event:', event)}
              userRole="patient"
              className="animate-slide-up"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <Card className="shadow-gentle animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming appointments</p>
                    <Button
                      size="sm"
                      className="mt-3 bg-gradient-healing hover:bg-primary/90"
                      onClick={() => setShowBookingModal(true)}
                    >
                      Book Now
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{appointment.title}</h4>
                          <Badge variant={
                            appointment.status === 'confirmed' ? 'default' : 
                            appointment.status === 'scheduled' ? 'secondary' : 'outline'
                          }>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {moment(appointment.start).format('MMM D, h:mm A')}
                        </div>
                        {appointment.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{appointment.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <AISuggestions
              events={events}
              therapyDuration={selectedTherapyDuration}
              onSelectSuggestion={handleSlotSelect}
              className="animate-slide-up"
            />

            {/* Quick Actions */}
            <Card className="shadow-gentle animate-slide-up">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gradient-healing hover:bg-primary/90 transition-gentle"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Health Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedSlot={selectedSlot}
        onBooking={handleBooking}
        patientName={user.fullName}
      />
    </div>
  );
};

export default PatientDashboard;