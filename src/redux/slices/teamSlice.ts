import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface TeamState {
  savedUsers: User[];
}

const initialState: TeamState = {
  savedUsers: [],
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addToTeam: (state, action: PayloadAction<User>) => {
    
      const exists = state.savedUsers.some(u => u.id === action.payload.id);
      if (!exists) {
        state.savedUsers.push(action.payload);
      }
    },
    removeFromTeam: (state, action: PayloadAction<string>) => {
      state.savedUsers = state.savedUsers.filter(user => user.id !== action.payload);
    },
  },
});

export const { addToTeam, removeFromTeam } = teamSlice.actions;
export default teamSlice.reducer;