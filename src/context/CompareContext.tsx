import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  comparedProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const { showToast } = useToast();

  const isInCompare = (productId: string) => {
    return comparedProducts.some(p => p.id === productId);
  };

  const addToCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return;
    }

    if (comparedProducts.length >= 4) {
      showToast('You can compare a maximum of 4 products at once.', 'warning');
      return;
    }

    setComparedProducts(prev => [...prev, product]);
    showToast(`Added "${product.name}" to comparison.`, 'info');
  };

  const removeFromCompare = (productId: string) => {
    setComparedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedProducts,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isCompareModalOpen,
        openCompareModal: () => setIsCompareModalOpen(true),
        closeCompareModal: () => setIsCompareModalOpen(false)
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
