'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

interface NewLinkContextValue {
  isOpen: boolean;
  openNewLinkDrawer: () => void;
  closeNewLinkDrawer: () => void;
  onLinkCreated: (callback: () => void) => () => void;
  notifyLinkCreated: () => void;
}

const NewLinkContext = createContext<NewLinkContextValue | null>(null);

export function NewLinkProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const linkCreatedCallbacks = useRef<Set<() => void>>(new Set());

  const openNewLinkDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeNewLinkDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onLinkCreated = useCallback((callback: () => void) => {
    linkCreatedCallbacks.current.add(callback);
    return () => {
      linkCreatedCallbacks.current.delete(callback);
    };
  }, []);

  const notifyLinkCreated = useCallback(() => {
    linkCreatedCallbacks.current.forEach((callback) => callback());
  }, []);

  return (
    <NewLinkContext.Provider
      value={{
        isOpen,
        openNewLinkDrawer,
        closeNewLinkDrawer,
        onLinkCreated,
        notifyLinkCreated,
      }}
    >
      {children}
    </NewLinkContext.Provider>
  );
}

export function useNewLink() {
  const context = useContext(NewLinkContext);
  if (!context) {
    throw new Error('useNewLink must be used within a NewLinkProvider');
  }
  return context;
}
