import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsersFromApi } from '../../services/api';
import { User } from '../../types';


interface DirectoryState {
  users: User[];
  page: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DirectoryState = {
  users: [],
  page: 1,
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'directory/fetchUsers',
  async (page: number) => {
    const rawData = await fetchUsersFromApi(page);
    

    const formattedUsers: User[] = rawData.map((item: any) => ({
      id: item.login.uuid,
      firstName: item.name.first,
      lastName: item.name.last,
      email: item.email,
      phone: item.phone,
      city: item.location.city,
      country: item.location.country,
      avatarLarge: item.picture.large,
      avatarThumb: item.picture.thumbnail,
      department: ['Engineering', 'Sales', 'Marketing', 'HR'][Math.floor(Math.random() * 4)],
      jobTitle: 'Employee',
    }));

    return formattedUsers;
  }
);


const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {

    resetDirectory: (state) => {
      state.users = [];
      state.page = 1;
      state.status: 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';

        const newUsers = action.payload.filter(
          (newUser) => !state.users.some((existingUser) => existingUser.id === newUser.id)
        );
        state.users = [...state.users, ...newUsers];
        state.page += 1; 
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { resetDirectory } = directorySlice.actions;
export default directorySlice.reducer;