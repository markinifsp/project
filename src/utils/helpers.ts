import { Cable, Movement, Person } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format date to localized string
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Calculate the total number of cables in use
export const calculateCablesInUse = (cable: Cable): number => {
  return cable.totalQuantity - cable.availableQuantity;
};

// Check if a cable is low in stock
export const isLowStock = (cable: Cable): boolean => {
  return cable.availableQuantity <= cable.minQuantity;
};

// Get the active cables for a person
export const getActiveCablesForPerson = (
  personId: string,
  movements: Movement[]
): number => {
  const personMovements = movements.filter((m) => m.personId === personId);
  let count = 0;
  
  personMovements.forEach((movement) => {
    if (movement.type === 'exit') {
      count += movement.quantity;
    } else if (movement.type === 'return') {
      count -= movement.quantity;
    }
  });
  
  return Math.max(0, count);
};

// Filter movements by date range
export const filterMovementsByDateRange = (
  movements: Movement[],
  startDate: Date | null,
  endDate: Date | null
): Movement[] => {
  return movements.filter((movement) => {
    const movementDate = new Date(movement.date);
    
    if (startDate && movementDate < startDate) {
      return false;
    }
    
    if (endDate) {
      // Set the end date to the end of the day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      if (movementDate > endOfDay) {
        return false;
      }
    }
    
    return true;
  });
};

// Group movements by cable
export const groupMovementsByCable = (
  movements: Movement[],
  cables: Cable[]
): Record<string, Movement[]> => {
  const grouped: Record<string, Movement[]> = {};
  
  movements.forEach((movement) => {
    if (!grouped[movement.cableId]) {
      grouped[movement.cableId] = [];
    }
    
    grouped[movement.cableId].push(movement);
  });
  
  return grouped;
};

// Get person name by ID
export const getPersonName = (
  personId: string,
  people: Person[]
): string => {
  const person = people.find((p) => p.id === personId);
  return person ? person.name : 'Unknown';
};

// Get cable name by ID
export const getCableName = (
  cableId: string,
  cables: Cable[]
): string => {
  const cable = cables.find((c) => c.id === cableId);
  return cable ? cable.name : 'Unknown';
};