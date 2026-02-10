import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PersonForm from '../components/forms/PersonForm';
import { Person } from '../types';
import { Plus, Edit, Search, User, Phone } from 'lucide-react';

const People: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
    } else {
      setEditingPerson(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const handleSubmit = (data: Partial<Person>) => {
    const now = new Date().toISOString();
    
    if (editingPerson) {
      // Update existing person
      const updatedPerson: Person = {
        ...editingPerson,
        ...data,
        updatedAt: now,
      };
      dispatch({ type: 'UPDATE_PERSON', payload: updatedPerson });
    } else {
      // Add new person
      const newPerson: Person = {
        id: Date.now().toString(),
        name: data.name || '',
        role: data.role || '',
        contact: data.contact || '',
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_PERSON', payload: newPerson });
    }
    
    handleCloseModal();
  };

  // Filter people based on search term
  const filteredPeople = state.people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort people alphabetically
  const sortedPeople = [...filteredPeople].sort((a, b) => a.name.localeCompare(b.name));

  // Get active cables for a person
  const getActiveCablesCount = (personId: string): number => {
    // Calculate cable exits minus returns for this person
    const movements = state.movements.filter((m) => m.personId === personId);
    let count = 0;
    
    movements.forEach((movement) => {
      if (movement.type === 'exit') {
        count += movement.quantity;
      } else if (movement.type === 'return') {
        count -= movement.quantity;
      }
    });
    
    return Math.max(0, count); // Ensure we don't return negative values
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">People</h1>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          Add New Person
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search people by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* People List */}
      {sortedPeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPeople.map((person) => {
            const activeCables = getActiveCablesCount(person.id);
            
            return (
              <Card key={person.id}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-500">{person.role}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => handleOpenModal(person)}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span>{person.contact}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-2" />
                    <span>
                      {activeCables === 0
                        ? 'No cables currently assigned'
                        : `${activeCables} cable${activeCables !== 1 ? 's' : ''} currently assigned`}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="text-center py-6">
            <p className="text-gray-500">No people found. Add your first person to get started!</p>
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              className="mt-4"
              onClick={() => handleOpenModal()}
            >
              Add New Person
            </Button>
          </div>
        </Card>
      )}
      
      {/* Person Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPerson ? 'Edit Person' : 'Add New Person'}
        size="md"
      >
        <PersonForm
          initialData={editingPerson || {}}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default People;