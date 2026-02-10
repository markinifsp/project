import React, { useState } from 'react';
import { Person } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface PersonFormProps {
  initialData?: Partial<Person>;
  onSubmit: (data: Partial<Person>) => void;
  onCancel: () => void;
}

const PersonForm: React.FC<PersonFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Person>>({
    name: '',
    role: '',
    contact: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.contact) {
      newErrors.contact = 'Contact information is required';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        fullWidth
        required
      />
      
      <Input
        label="Role"
        id="role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        error={errors.role}
        fullWidth
        required
      />
      
      <Input
        label="Contact"
        id="contact"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        error={errors.contact}
        fullWidth
        required
      />
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData.id ? 'Update Person' : 'Add Person'}
        </Button>
      </div>
    </form>
  );
};

export default PersonForm;