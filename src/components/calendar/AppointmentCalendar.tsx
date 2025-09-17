import { useState, useMemo } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const localizer = momentLocalizer(moment);

export interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  therapyType: string;
  patientName?: string;
  practitionerName?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface AppointmentCalendarProps {
  events: AppointmentEvent[];
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (event: AppointmentEvent) => void;
  userRole: 'patient' | 'practitioner';
  className?: string;
}

const AppointmentCalendar = ({ 
  events, 
  onSelectSlot, 
  onSelectEvent, 
  userRole,
  className 
}: AppointmentCalendarProps) => {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());

  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = '#10b981'; // Default green
    
    switch (event.status) {
      case 'scheduled':
        backgroundColor = '#f59e0b'; // Amber
        break;
      case 'confirmed':
        backgroundColor = '#10b981'; // Green
        break;
      case 'completed':
        backgroundColor = '#6b7280'; // Gray
        break;
      case 'cancelled':
        backgroundColor = '#ef4444'; // Red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
      }
    };
  };

  const calendarFormats = useMemo(() => ({
    dayHeaderFormat: 'dddd, MMM DD',
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => 
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
    agendaTimeFormat: 'HH:mm',
  }), []);

  return (
    <div className={cn("bg-card rounded-lg shadow-gentle", className)}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {userRole === 'patient' ? 'Book Appointment' : 'Manage Appointments'}
            </h2>
          </div>
          
          {userRole === 'patient' && (
            <Button
              onClick={() => onSelectSlot({ start: new Date(), end: new Date() })}
              className="bg-gradient-healing hover:bg-primary/90 transition-gentle"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex gap-2">
          {(['month', 'week', 'day'] as View[]).map((viewName) => (
            <Button
              key={viewName}
              variant={view === viewName ? "default" : "outline"}
              size="sm"
              onClick={() => setView(viewName)}
              className="capitalize"
            >
              {viewName}
            </Button>
          ))}
        </div>

        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            onSelectSlot={onSelectSlot}
            onSelectEvent={onSelectEvent}
            selectable={userRole === 'patient'}
            eventPropGetter={eventStyleGetter}
            formats={calendarFormats}
            step={30}
            timeslots={2}
            min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
            max={new Date(0, 0, 0, 20, 0, 0)} // 8 PM
            className="ayurveda-calendar"
            components={{
              toolbar: ({ label, onNavigate, onView }) => (
                <div className="flex justify-between items-center mb-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onNavigate('PREV')}>
                      ←
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onNavigate('NEXT')}>
                      →
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <div className="opacity-0">placeholder</div>
                </div>
              ),
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default AppointmentCalendar;