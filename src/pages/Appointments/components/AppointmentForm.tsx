export default function AppointmentForm({ onComplete }: AppointmentFormProps) {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    type: 'sales' as AppointmentType,
    notes: '',
    status: 'scheduled' as AppointmentStatus,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('User is not authenticated');
      return;
    }

    if (!selectedContact) {
      setError('No contact selected');
      return;
    }

    if (!formData.date || !formData.time) {
      setError('Date and time are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const appointmentDate = new Date(`${formData.date}T${formData.time}`);

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          account_id: selectedContact.id,
          date: appointmentDate.toISOString(),
          duration: formData.duration,
          type: formData.type,
          notes: formData.notes,
          status: formData.status,
          user_id: user.id,
        }]);

      if (appointmentError) throw appointmentError;

      onComplete();
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ContactSelector
        onSelect={setSelectedContact}
        selectedContact={selectedContact}
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Rest of the form UI */}
    </form>
  );
}
