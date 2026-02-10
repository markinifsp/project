import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Calendar, User, Filter } from 'lucide-react';

const History: React.FC = () => {
  const { state } = useAppContext();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    personId: '',
    type: '',
  });

  // Apply filters to movements
  const filteredMovements = state.movements.filter((movement) => {
    const movementDate = new Date(movement.date);
    let includeMovement = true;

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      if (movementDate < startDate) {
        includeMovement = false;
      }
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      if (movementDate > endDate) {
        includeMovement = false;
      }
    }

    if (filters.personId && movement.personId !== filters.personId) {
      includeMovement = false;
    }

    if (filters.type && movement.type !== filters.type) {
      includeMovement = false;
    }

    return includeMovement;
  });

  // Sort movements by date (newest first)
  const sortedMovements = [...filteredMovements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      personId: '',
      type: '',
    });
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
        <h1 className="text-2xl font-bold text-gray-900">Movement History</h1>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex items-center mb-4">
          <Filter size={20} className="mr-2 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-700">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Person
            </label>
            <select
              name="personId"
              value={filters.personId}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All People</option>
              {state.people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movement Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
              <option value="return">Return</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      </Card>
      
      {/* Movement History */}
      <Card>
        {sortedMovements.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cable
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Person
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {new Date(movement.date).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          movement.type === 'entry'
                            ? 'success'
                            : movement.type === 'exit'
                            ? 'primary'
                            : 'warning'
                        }
                      >
                        {movement.type === 'entry'
                          ? 'Entry'
                          : movement.type === 'exit'
                          ? 'Exit'
                          : 'Return'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getCableName(movement.cableId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        {getPersonName(movement.personId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No movement history found with the selected filters.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default History;