import React, { useState, useEffect } from 'react';
import { Cable, Movement, Person } from '../../types';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';

interface MovementFormProps {
  type: 'entry' | 'exit' | 'return';
  onSubmit: (data: Partial<Movement>) => void;
  onCancel: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({
  type,
  onSubmit,
  onCancel,
}) => {
  const { state } = useAppContext();
  const [formData, setFormData] = useState<Partial<Movement>>({
    type,
    quantity: 1,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCable, setSelectedCable] = useState<Cable | null>(null);

  // Update selected cable when cableId changes
  useEffect(() => {
    if (formData.cableId) {
      const cable = state.cables.find((c) => c.id === formData.cableId) || null;
      setSelectedCable(cable);
    } else {
      setSelectedCable(null);
    }
  }, [formData.cableId, state.cables]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cableId) {
      newErrors.cableId = 'Cable selection is required';
    }
    
    if (!formData.personId) {
      newErrors.personId = 'Person selection is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    // For exit/return movements, check if there are enough cables available
    if (type === 'exit' && selectedCable && formData.quantity) {
      if (formData.quantity > selectedCable.availableQuantity) {
        newErrors.quantity = `Only ${selectedCable.availableQuantity} cables available`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Convert cables and people to options for Select component
  const cableOptions = state.cables.map((cable) => ({
    value: cable.id,
    label: `${cable.name} (${cable.type}) - Available: ${cable.availableQuantity}`,
  }));

  const peopleOptions = state.people.map((person) => ({
    value: person.id,
    label: `${person.name} - ${person.role}`,
  }));

  const getFormTitle = () => {
    switch (type) {
      case 'entry':
        return 'Add Cable Entry';
      case 'exit':
        return 'Register Cable Exit';
      case 'return':
      case 'utilizacao':
        return 'Registrar Utilização de Cabo';
        return 'Register Cable Return';
      default:
        return 'Cable Movement';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{getFormTitle()}</h3>
      
      <Select
        label="Select Cable"
        id="cableId"
        name="cableId"
        value={formData.cableId || ''}
        options={cableOptions}
        onChange={handleChange}
        error={errors.cableId}
        fullWidth
        required
      />
      
      <Select
        label="Select Person"
        id="personId"
        name="personId"
        value={formData.personId || ''}
        options={peopleOptions}
        onChange={handleChange}
        error={errors.personId}
        fullWidth
        required
      />
      
      <Input
        label="Quantity"
        id="quantity"
        name="quantity"
        type="number"
        min="1"
        value={formData.quantity?.toString() || '1'}
        onChange={handleChange}
        error={errors.quantity}
        fullWidth
        required
      />
      
      <TextArea
        label="Notes"
        id="notes"
        name="notes"
        value={formData.notes || ''}
        onChange={handleChange}
        rows={3}
        fullWidth
      />
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant={type === 'entry' ? 'success' : type === 'exit' ? 'primary' : type === 'return' ? 'warning' : 'danger'}
        >
          {type === 'entry' ? 'Registrar Entrada' :
           type === 'exit' ? 'Registrar Saída' :
           type === 'return' ? 'Registrar Devolução' :
           'Registrar Utilização'}
        </Button>
      </div>
    </form>
  );
};

export default MovementForm;