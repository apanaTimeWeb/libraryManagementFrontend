import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarCollapsed: boolean;
  modals: {
    createBranch: boolean;
    editBranch: boolean;
    deactivateBranch: boolean;
    createUser: boolean;
    editUser: boolean;
    resetPassword: boolean;
    sendAnnouncement: boolean;
    auditDiff: boolean;
  };
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modal: keyof UIStore['modals']) => void;
  closeModal: (modal: keyof UIStore['modals']) => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      modals: {
        createBranch: false,
        editBranch: false,
        deactivateBranch: false,
        createUser: false,
        editUser: false,
        resetPassword: false,
        sendAnnouncement: false,
        auditDiff: false,
      },
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      openModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: true }
      })),
      closeModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: false }
      })),
      closeAllModals: () => set((state) => ({
        modals: Object.keys(state.modals).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {} as UIStore['modals'])
      })),
    }),
    { 
      name: 'ui-storage',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed })
    }
  )
);
