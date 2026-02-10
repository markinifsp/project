import React, { useState } from 'react';
import { Cable } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';

interface CableFormProps {
  initialData?: Partial<Cable>;
  onSubmit: (data: Partial<Cable>) => void;
  onCancel: () => void;
}

const CableForm: React.FC<CableFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Cable>>({
    name: '',
    type: '',
    totalQuantity: 0,
    availableQuantity: 0,
    minQuantity: 1,
    notes: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // For number fields, convert to number
    if (name === 'totalQuantity' || name === 'availableQuantity' || name === 'minQuantity') {
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
    
    if (!formData.name) {
      newErrors.name = 'Cable name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Cable type is required';
    }
    
    if (formData.totalQuantity === undefined || formData.totalQuantity < 0) {
      newErrors.totalQuantity = 'Total quantity must be a positive number';
    }

    if (formData.minQuantity === undefined || formData.minQuantity < 0) {
      newErrors.minQuantity = 'Minimum quantity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // If this is a new cable, set available quantity to match total quantity
      if (!initialData.id) {
        formData.availableQuantity = formData.totalQuantity;
      }
      
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Cable Name"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        fullWidth
        required
      />
      
      <Input
        label="Cable Type"
        id="type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        error={errors.type}
        fullWidth
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Total Quantity"
          id="totalQuantity"
          name="totalQuantity"
          type="number"
          min="0"
          value={formData.totalQuantity?.toString()}
          onChange={handleChange}
          error={errors.totalQuantity}
          fullWidth
          required
        />
        
        <Input
          label="Minimum Quantity"
          id="minQuantity"
          name="minQuantity"
          type="number"
          min="0"
          value={formData.minQuantity?.toString()}
          onChange={handleChange}
          error={errors.minQuantity}
          fullWidth
          required
        />
      </div>
      
      <TextArea
        label="Notes"
        id="notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={3}
        fullWidth
      />
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData.id ? 'Update Cable' : 'Add Cable'}
        </Button>
      </div>
    </form>
  );
};

export default CableForm;