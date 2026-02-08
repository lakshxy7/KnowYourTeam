import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types';

interface ProjectsState {
  list: Project[];
}

const initialState: ProjectsState = {
  list: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action: PayloadAction<Project>) => {
      state.list.unshift(action.payload); 
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
  },
});

export const { createProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;