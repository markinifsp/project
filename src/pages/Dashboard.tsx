import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import MovementForm from '../components/forms/MovementForm';
import { Movement } from '../types';
import { PlusCircle, LogOut, RotateCcw, AlertTriangle, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [modalType, setModalType] = useState<'entry' | 'exit' | 'return' | 'utilizacao' | null>(null);

  // Find low stock cables
  const lowStockCables = state.cables.filter(
    (cable) => cable.availableQuantity <= cable.minQuantity
  );

  // Get recent movements
  const recentMovements = [...state.movements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleOpenModal = (type: 'entry' | 'exit' | 'return' | 'utilizacao') => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSubmitMovement = (data: Partial<Movement>) => {
    // Find the cable
    const cable = state.cables.find((c) => c.id === data.cableId);
    if (!cable) return;
    
    // Calculate new quantities
    let newAvailableQuantity = cable.availableQuantity;
    if (data.type === 'entry') {
      newAvailableQuantity += data.quantity || 0;
    } else if (data.type === 'exit') {
      newAvailableQuantity -= data.quantity || 0;
    } else if (data.type === 'return') {
      newAvailableQuantity += data.quantity || 0;
    }
    
    // Update cable
    const updatedCable = {
      ...cable,
      availableQuantity: newAvailableQuantity,
      updatedAt: new Date().toISOString(),
    };
    
    // Create movement record
    const newMovement: Movement = {
      id: Date.now().toString(),
      cableId: data.cableId || '',
      personId: data.personId || '',
      quantity: data.quantity || 0,
      type: data.type || 'entry',
      date: new Date().toISOString(),
      notes: data.notes || '',
    };
    
    // Dispatch actions
    dispatch({ type: 'ADD_MOVEMENT', payload: newMovement });
    
    // Close modal
    handleCloseModal();
  };

  // Helper function to get person name by ID
  const getPersonName = (personId: string): string => {
    const person = state.people.find((p) => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  // Helper function to get cable name by ID
  const getCableName = (cableId: string): string => {
    const cable = state.cables.find((c) => c.id === cableId);
    return cable ? cable.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant="success" 
            icon={<PlusCircle size={18} />}
            onClick={() => handleOpenModal('entry')}
          >
            Cable Entry
          </Button>
          <Button 
            variant="primary" 
            icon={<LogOut size={18} />}
            onClick={() => handleOpenModal('exit')}
          >
            Cable Exit
          </Button>
          <Button 
            variant="danger" 
            icon={<Package size={18} />}
            onClick={() => handleOpenModal('utilizacao')}
          >
            Utilização
          </Button>
          <Button
            variant="warning" 
            icon={<RotateCcw size={18} />}
            onClick={() => handleOpenModal('return')}
          >
            Return Cabo
          </Button>
        </div>
      </div>
      
      {/* Cable Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.cables.map(cable => (
          <Card key={cable.id} className="bg-white border-blue-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{cable.name}</h3>
                <Badge variant="secondary" size="sm">{cable.type}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Inventory:</span>
                  <span className="font-semibold text-blue-600">{cable.totalQuantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold text-green-600">{cable.availableQuantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Use:</span>
                  <span className="font-semibold text-indigo-600">
                    {cable.totalQuantity - cable.availableQuantity}
                  </span>
                </div>
                {cable.availableQuantity <= cable.minQuantity && (
                  <div className="mt-2 flex items-center text-yellow-600">
                    <AlertTriangle size={16} className="mr-1" />
                    <span className="text-sm">Low Stock Alert</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockCables.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <div className="mr-3 text-yellow-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Low Stock Alert</h3>
              <p className="text-sm text-yellow-700 mt-1">
                The following cables are running low and need replenishment:
              </p>
              <ul className="mt-2 space-y-1">
                {lowStockCables.map((cable) => (
                  <li key={cable.id} className="flex items-center text-sm text-yellow-700">
                    <span className="font-medium">{cable.name}</span>
                    <span className="mx-1">-</span>
                    <span>Available: {cable.availableQuantity}</span>
                    <Badge variant="warning" size="sm" className="ml-2">
                      Min: {cable.minQuantity}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
      
      {/* Recent Activities */}
      <Card title="Recent Activities">
        {recentMovements.length > 0 ? (
          <div className="space-y-4">
            {recentMovements.map((movement) => (
              <div key={movement.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <Badge
                      variant={
                        movement.type === 'entry'
                          ? 'success'
                          : movement.type === 'exit'
                          ? 'primary'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {movement.type === 'entry'
                        ? 'Entry'
                        : movement.type === 'exit'
                        ? 'Exit'
                        : 'Return'}
                    </Badge>
                    <span className="ml-2 font-medium">{getCableName(movement.cableId)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(movement.date).toLocaleString()}
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  <span className="text-gray-600">Quantity: {movement.quantity}</span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-600">Person: {getPersonName(movement.personId)}</span>
                </div>
                {movement.notes && (
                  <div className="mt-1 text-sm text-gray-500">{movement.notes}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        )}
      </Card>
      
      {/* Movement Modal */}
      {modalType && (
        <Modal
          isOpen={!!modalType}
          onClose={handleCloseModal}
          title={
            modalType === 'entry'
              ? 'Add Cable Entry'
              : modalType === 'exit'
              ? 'Register Cable Exit'
              : 'Register Cable Return'
          }
          size="md"
        >
          <MovementForm
            type={modalType}
            onSubmit={handleSubmitMovement}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;