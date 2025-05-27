
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { TimeSlot } from '@/types/schedule';

interface TimeSlotManagerProps {
  timeSlots: TimeSlot[];
  onUpdate: () => void;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const daysOfWeek = [
  { value: 'monday' as DayOfWeek, label: 'Monday' },
  { value: 'tuesday' as DayOfWeek, label: 'Tuesday' },
  { value: 'wednesday' as DayOfWeek, label: 'Wednesday' },
  { value: 'thursday' as DayOfWeek, label: 'Thursday' },
  { value: 'friday' as DayOfWeek, label: 'Friday' },
  { value: 'saturday' as DayOfWeek, label: 'Saturday' },
  { value: 'sunday' as DayOfWeek, label: 'Sunday' },
];

export const TimeSlotManager: React.FC<TimeSlotManagerProps> = ({ timeSlots, onUpdate }) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    days: [] as DayOfWeek[],
    max_capacity: 20,
    description: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      start_time: '',
      end_time: '',
      days: [],
      max_capacity: 20,
      description: '',
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.start_time || !formData.end_time || formData.days.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing time slot
        const { error } = await supabase
          .from('program_time_slots')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Time slot updated successfully",
        });
      } else {
        // Create new time slot
        const { error } = await supabase
          .from('program_time_slots')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Time slot created successfully",
        });
      }

      resetForm();
      setIsCreating(false);
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('Error saving time slot:', error);
      toast({
        title: "Error",
        description: "Failed to save time slot",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (slot: TimeSlot) => {
    setFormData({
      name: slot.name,
      start_time: slot.start_time,
      end_time: slot.end_time,
      days: slot.days as DayOfWeek[],
      max_capacity: slot.max_capacity,
      description: slot.description || '',
    });
    setEditingId(slot.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this time slot? This will also remove all student assignments to this slot.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('program_time_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Time slot deleted successfully",
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete time slot",
        variant: "destructive",
      });
    }
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Program Time Slots</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsCreating(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Time Slot' : 'Create New Time Slot'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Beginners"
                />
              </div>
              <div>
                <Label htmlFor="max_capacity">Max Capacity *</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_capacity: parseInt(e.target.value) || 0 }))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Days of Week *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {daysOfWeek.map(day => (
                  <Badge
                    key={day.value}
                    variant={formData.days.includes(day.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleDayToggle(day.value)}
                  >
                    {day.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the time slot"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeSlots.map((slot) => (
          <Card key={slot.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{slot.name}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(slot)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(slot.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Time:</strong> {slot.start_time} - {slot.end_time}</p>
                <p><strong>Capacity:</strong> {slot.max_capacity} students</p>
                <div>
                  <strong>Days:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {slot.days.map(day => (
                      <Badge key={day} variant="secondary" className="text-xs">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                {slot.description && (
                  <p className="text-sm text-gray-600">{slot.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
