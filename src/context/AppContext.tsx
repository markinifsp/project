import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, Cable, Movement, Person } from '../types';

// Initial state
const initialState: AppState = {
  cables: [],
  people: [],
  movements: [],
};

// Action types
type Action =
  | { type: 'ADD_CABLE'; payload: Cable }
  | { type: 'UPDATE_CABLE'; payload: Cable }
  | { type: 'ADD_PERSON'; payload: Person }
  | { type: 'UPDATE_PERSON'; payload: Person }
  | { type: 'ADD_MOVEMENT'; payload: Movement }
  | { type: 'LOAD_DATA'; payload: AppState };

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_CABLE':
      return {
        ...state,
        cables: [...state.cables, action.payload],
      };
    case 'UPDATE_CABLE':
      return {
        ...state,
        cables: state.cables.map((cable) =>
          cable.id === action.payload.id ? action.payload : cable
        ),
      };
    case 'ADD_PERSON':
      return {
        ...state,
        people: [...state.people, action.payload],
      };
    case 'UPDATE_PERSON':
      return {
        ...state,
        people: state.people.map((person) =>
          person.id === action.payload.id ? action.payload : person
        ),
      };
    case 'ADD_MOVEMENT': {
      const movement = action.payload;
      const cable = state.cables.find(c => c.id === movement.cableId);
      const person = state.people.find(p => p.id === movement.personId);
      if (!cable || !person) return state;
      const updatedCables = [...state.cables];
      const updatedPeople = [...state.people];
      const cableIndex = updatedCables.findIndex(c => c.id === movement.cableId);
      const personIndex = updatedPeople.findIndex(p => p.id === movement.personId);

      if (!updatedPeople[personIndex].cabosEmUso) {
        updatedPeople[personIndex].cabosEmUso = {};
      }

      switch (movement.type) {
        case 'entry':
          updatedCables[cableIndex].availableQuantity += movement.quantity;
          updatedCables[cableIndex].totalQuantity += movement.quantity;
          break;
        case 'exit':
          if (movement.quantity > updatedCables[cableIndex].availableQuantity) return state;
          updatedCables[cableIndex].availableQuantity -= movement.quantity;
          updatedPeople[personIndex].cabosEmUso[movement.cableId] =
            (updatedPeople[personIndex].cabosEmUso[movement.cableId] || 0) + movement.quantity;
          break;
        case 'return':
          if ((updatedPeople[personIndex].cabosEmUso[movement.cableId] || 0) < movement.quantity) return state;
          updatedCables[cableIndex].availableQuantity += movement.quantity;
          updatedPeople[personIndex].cabosEmUso[movement.cableId] -= movement.quantity;
          break;
        case 'utilizacao':
          if ((updatedPeople[personIndex].cabosEmUso[movement.cableId] || 0) < movement.quantity) return state;
          updatedCables[cableIndex].totalQuantity -= movement.quantity;
          updatedPeople[personIndex].cabosEmUso[movement.cableId] -= movement.quantity;
          break;
      }

      return {
        ...state,
        cables: updatedCables,
        people: updatedPeople,
        movements: [...state.movements, movement],
      };
    }
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('cableManagementData');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cableManagementData', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};