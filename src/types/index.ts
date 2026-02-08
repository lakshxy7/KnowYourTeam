// src/types/index.ts

export interface User {
  id: string;      
  firstName: string; 
  lastName: string;  
  email: string;
  phone: string;
  city: string;
  country: string;
  avatarLarge: string; 
  avatarThumb: string; 
  jobTitle: string;   
  department: string;  
}


export interface ApiResponse {
  results: any[];
  info: {
    page: number;
    results: number;
  };
}

export interface ProjectMember {
  user: User;
  role: string; 
}

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: User;
  members: ProjectMember[]; 
  createdAt: number;
}