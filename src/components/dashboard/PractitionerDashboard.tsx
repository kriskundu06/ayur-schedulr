import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppointmentCalendar, { AppointmentEvent } from "@/components/calendar/AppointmentCalendar";
import { User } from "@/components/auth/LoginForm";
import { 
  Calendar, 
  Clock, 
  Heart, 
  LogOut, 
  User as UserIcon, 
  CheckCircle, 
  XCircle,
  Users,
  Activity
} from "lucide-react";
import moment from "moment";

interface PractitionerDashboardProps {
  user: User;
  onLogout: () => void;
}

const PractitionerDashboard = ({ user, onLogout }: PractitionerDashboardProps) => {
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load demo events
  useEffect(() => {
    const demoEvents: AppointmentEvent[] = [
      {
        id: '1',
        title: 'Panchakarma - Sarah Johnson',
        start: moment().add(1, 'days').hour(10).minute(0).toDate(),
        end: moment().add(1, 'days').hour(12).minute(0).toDate(),
        therapyType: 'panchakarma',
        patientName: 'Sarah Johnson',
        notes: 'Initial detox session, check allergies',
        status: 'scheduled',
        practitionerName: user.fullName
      },
      {
        id: '2',
        title: 'Consultation - Mike Chen',
        start: moment().add(1, 'days').hour(14).minute(0).toDate(),
        end: moment().add(1, 'days').hour(15).minute(0).toDate(),
        therapyType: 'consultation',
        patientName: 'Mike Chen',
        notes: 'Follow-up for digestive issues',
        status: 'confirmed',
        practitionerName: user.fullName
      },
      {
        id: '3',
        title: 'Abhyanga - Emma Wilson',
        start: moment().add(2, 'days').hour(9).minute(0).toDate(),
        end: moment().add(2, 'days').hour(10).minute(30).toDate(),
        therapyType: 'abhyanga',
        patientName: 'Emma Wilson',
        notes: 'Stress relief session',
        status: 'scheduled',
        practitionerName: user.fullName
      },
      {
        id: '4',
        title: 'Shirodhara - David Kim',
        start: moment().add(3, 'days').hour(11).minute(0).toDate(),
        end: moment().add(3, 'days').hour(12).minute(15).toDate(),
        therapyType: 'shirodhara',
        patientName: 'David Kim',
        notes: 'Anxiety management',
        status: 'scheduled',
        practitionerName: user.fullName
      }
    ];
    setEvents(demoEvents);
  }, [user]);

  const handleEventSelect = (event: AppointmentEvent) => {
    console.log('Selected appointment:', event);
    // Here you would open an appointment details modal
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

  const todaysAppointments = events.filter(event => 
    moment(event.start).isSame(selectedDate, 'day')
  ).sort((a, b) => moment(a.start).diff(moment(b.start)));

  const pendingAppointments = events.filter(event => 
    event.status === 'scheduled' && moment(event.start).isAfter(moment())
  );

  const stats = {
    today: todaysAppointments.length,
    pending: pendingAppointments.length,
    thisWeek: events.filter(event => 
      moment(event.start).isBetween(moment().startOf('week'), moment().endOf('week'))
    ).length
  };

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
                <p className="text-sm text-muted-foreground">Practitioner Portal</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-gentle animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  <p className="text-2xl font-bold text-foreground">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-full">
                  <Clock className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/50 rounded-full">
                  <Activity className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">{stats.thisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <AppointmentCalendar
              events={events}
              onSelectSlot={() => {}} // Practitioner doesn't book
              onSelectEvent={handleEventSelect}
              userRole="practitioner"
              className="animate-slide-up"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            {pendingAppointments.length > 0 && (
              <Card className="shadow-gentle animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent-foreground" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>Appointments waiting for confirmation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{appointment.patientName}</p>
                            <p className="text-xs text-muted-foreground">{appointment.title}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Clock className="w-3 h-3" />
                        {moment(appointment.start).format('MMM D, h:mm A')}
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mb-3">{appointment.notes}</p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApproveAppointment(appointment.id)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeclineAppointment(appointment.id)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Today's Schedule */}
            <Card className="shadow-gentle animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>{moment(selectedDate).format('dddd, MMMM D, YYYY')}</CardDescription>
              </CardHeader>
              <CardContent>
                {todaysAppointments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments today</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaysAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{appointment.patientName}</span>
                          </div>
                          <Badge variant={
                            appointment.status === 'confirmed' ? 'default' : 
                            appointment.status === 'scheduled' ? 'secondary' : 'outline'
                          }>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {moment(appointment.start).format('h:mm A')} - {moment(appointment.end).format('h:mm A')}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{appointment.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-gentle animate-slide-up">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Patient Records
                </Button>
                <Button variant="outline" className="w-full">
                  <Activity className="w-4 h-4 mr-2" />
                  Treatment Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDashboard;