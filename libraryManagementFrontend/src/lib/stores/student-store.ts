import { create } from 'zustand';
import type { Student } from '@/lib/types';
import { students as mockStudents } from '@/lib/mockData';

interface StudentStore {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  createStudent: (data: Partial<Student>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,

  fetchStudents: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ students: mockStudents, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch students',
      });
    }
  },

  createStudent: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        smartId: `LIB${String(get().students.length + 1001).padStart(4, '0')}`,
        name: data.name || '',
        email: data.email,
        phone: data.phone || '',
        parentPhone: data.parentPhone,
        college: data.college,
        address: data.address,
        branchId: data.branchId || '',
        joiningDate: new Date().toISOString(),
        status: 'active',
        shiftType: data.shiftType,
        trustScore: 5,
      };
      
      set((state) => ({ 
        students: [newStudent, ...state.students],
        isLoading: false 
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create student',
      });
      throw error;
    }
  },

  updateStudent: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 400));
      
      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? { ...student, ...data } : student
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update student',
      });
      throw error;
    }
  },

  deleteStudent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({ 
        students: state.students.filter((student) => student.id !== id),
        isLoading: false 
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete student',
      });
      throw error;
    }
  },
}));
