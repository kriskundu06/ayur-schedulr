import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Clock, User, FileText } from "lucide-react";
import moment from "moment";

interface TherapyType {
  id: string;
  name: string;
  duration: number; // in minutes
  description: string;
  price?: number;
}

const therapyTypes: TherapyType[] = [
  { id: 'consultation', name: 'Initial Consultation', duration: 60, description: 'Comprehensive health assessment' },
  { id: 'panchakarma', name: 'Panchakarma Therapy', duration: 120, description: 'Full detoxification treatment' },
  { id: 'abhyanga', name: 'Abhyanga Massage', duration: 90, description: 'Therapeutic oil massage' },
  { id: 'shirodhara', name: 'Shirodhara', duration: 75, description: 'Continuous oil pouring therapy' },
  { id: 'nasya', name: 'Nasya Treatment', duration: 45, description: 'Nasal administration therapy' },
  { id: 'basti', name: 'Basti Therapy', duration: 60, description: 'Medicated enema treatment' },
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: { start: Date; end: Date } | null;
  onBooking: (booking: {
    therapyType: string;
    patientName: string;
    notes: string;
    start: Date;
    end: Date;
  }) => void;
  patientName?: string;
}

const BookingModal = ({ isOpen, onClose, selectedSlot, onBooking, patientName = "" }: BookingModalProps) => {
  const [selectedTherapy, setSelectedTherapy] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [customPatientName, setCustomPatientName] = useState(patientName);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const selectedTherapyData = therapyTypes.find(t => t.id === selectedTherapy);

  const calculateEndTime = (start: Date, duration: number) => {
    return moment(start).add(duration, 'minutes').toDate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !selectedTherapy || !customPatientName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Calculate proper end time based on therapy duration
    const therapyData = therapyTypes.find(t => t.id === selectedTherapy);
    const endTime = therapyData 
      ? calculateEndTime(selectedSlot.start, therapyData.duration)
      : selectedSlot.end;

    const booking = {
      therapyType: selectedTherapy,
      patientName: customPatientName.trim(),
      notes: notes.trim(),
      start: selectedSlot.start,
      end: endTime,
    };

    // Simulate booking process
    setTimeout(() => {
      onBooking(booking);
      toast({
        title: "Appointment booked!",
        description: `Your ${selectedTherapyData?.name} session is scheduled.`,
      });
      
      // Reset form
      setSelectedTherapy("");
      setNotes("");
      setCustomPatientName(patientName);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  if (!selectedSlot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Book Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">Selected Time Slot</p>
            <p className="text-lg">
              {moment(selectedSlot.start).format('dddd, MMMM Do, YYYY')}
            </p>
            <p className="text-muted-foreground">
              {moment(selectedSlot.start).format('h:mm A')} - 
              {selectedTherapyData 
                ? moment(calculateEndTime(selectedSlot.start, selectedTherapyData.duration)).format('h:mm A')
                : moment(selectedSlot.end).format('h:mm A')
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="therapy">Therapy Type *</Label>
            <Select value={selectedTherapy} onValueChange={setSelectedTherapy}>
              <SelectTrigger>
                <SelectValue placeholder="Select therapy type" />
              </SelectTrigger>
              <SelectContent>
                {therapyTypes.map((therapy) => (
                  <SelectItem key={therapy.id} value={therapy.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{therapy.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {therapy.duration} min • {therapy.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTherapyData && (
              <p className="text-sm text-muted-foreground">
                Duration: {selectedTherapyData.duration} minutes
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Name *
            </Label>
            <Input
              id="patientName"
              value={customPatientName}
              onChange={(e) => setCustomPatientName(e.target.value)}
              placeholder="Enter patient name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or symptoms to discuss..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-healing hover:bg-primary/90 transition-gentle"
              disabled={isLoading}
            >
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;