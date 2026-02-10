import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import CableForm from '../components/forms/CableForm';
import { Cable } from '../types';
import { Plus, Edit, Search } from 'lucide-react';

const Cables: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCable, setEditingCable] = useState<Cable | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (cable?: Cable) => {
    if (cable) {
      setEditingCable(cable);
    } else {
      setEditingCable(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCable(null);
  };

  const handleSubmit = (data: Partial<Cable>) => {
    const now = new Date().toISOString();
    
    if (editingCable) {
      // Update existing cable
      const updatedCable: Cable = {
        ...editingCable,
        ...data,
        updatedAt: now,
      };
      dispatch({ type: 'UPDATE_CABLE', payload: updatedCable });
    } else {
      // Add new cable
      const newCable: Cable = {
        id: Date.now().toString(),
        name: data.name || '',
        type: data.type || '',
        totalQuantity: data.totalQuantity || 0,
        availableQuantity: data.totalQuantity || 0,
        minQuantity: data.minQuantity || 1,
        notes: data.notes || '',
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_CABLE', payload: newCable });
    }
    
    handleCloseModal();
  };

  // Filter cables based on search term
  const filteredCables = state.cables.filter(
    (cable) =>
      cable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cable.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort cables alphabetically
  const sortedCables = [...filteredCables].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cables</h1>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          Add New Cable
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
          placeholder="Search cables by name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Cables List */}
      {sortedCables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCables.map((cable) => (
            <Card key={cable.id} className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cable.name}</h3>
                    <p className="text-sm text-gray-500">{cable.type}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => handleOpenModal(cable)}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="mt-4 space-y-3 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Total Quantity:</span>
                    <span className="font-semibold">{cable.totalQuantity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Available:</span>
                    <span className="font-semibold">
                      {cable.availableQuantity}
                      {cable.availableQuantity <= cable.minQuantity && (
                        <Badge variant="warning" size="sm" className="ml-2">
                          Low Stock
                        </Badge>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">In Use:</span>
                    <span className="font-semibold">
                      {cable.totalQuantity - cable.availableQuantity}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Minimum Quantity:</span>
                    <span className="font-semibold">{cable.minQuantity}</span>
                  </div>
                </div>
                
                {cable.notes && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500">Notes:</h4>
                    <p className="mt-1 text-sm text-gray-600">{cable.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-6">
            <p className="text-gray-500">No cables found. Add your first cable to get started!</p>
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              className="mt-4"
              onClick={() => handleOpenModal()}
            >
              Add New Cable
            </Button>
          </div>
        </Card>
      )}
      
      {/* Cable Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCable ? 'Edit Cable' : 'Add New Cable'}
        size="md"
      >
        <CableForm
          initialData={editingCable || {}}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Cables;