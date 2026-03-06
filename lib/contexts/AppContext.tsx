import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBook: any | null;
  setSelectedBook: (book: any | null) => void;
  notificationMessage: string | null;
  notificationType: 'success' | 'error' | 'info' | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info' | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    // Auto-clear after 5 seconds
    setTimeout(() => clearNotification(), 5000);
  };

  const clearNotification = () => {
    setNotificationMessage(null);
    setNotificationType(null);
  };

  const value: AppContextType = {
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    selectedBook,
    setSelectedBook,
    notificationMessage,
    notificationType,
    showNotification,
    clearNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
