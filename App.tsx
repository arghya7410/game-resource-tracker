
import React, { useState, useEffect, useCallback } from 'react';
import { TrackedItem, AppView, ItemType, Material } from './types';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ItemForm from './components/ItemForm';
import ItemDetailView from './components/ItemDetailView';
import ImageModal from './components/ImageModal'; 

const APP_STORAGE_KEY = 'gachaResourceTrackerData';

const App: React.FC = () => {
  const [items, setItems] = useState<TrackedItem[]>(() => {
    const storedData = localStorage.getItem(APP_STORAGE_KEY);
    try {
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error("Error parsing localStorage data:", error);
        return [];
    }
  });
  const [currentView, setCurrentView] = useState<AppView>({ type: 'dashboard' });
  const [globalModalImageUrl, setGlobalModalImageUrl] = useState<string | null>(null); 

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const navigateToDashboard = useCallback(() => setCurrentView({ type: 'dashboard' }), []);
  const navigateToAddItem = useCallback(() => setCurrentView({ type: 'addItem' }), []);
  const navigateToEditItem = useCallback((itemId: string) => setCurrentView({ type: 'editItem', itemId }), []);
  const navigateToViewItem = useCallback((itemId: string) => setCurrentView({ type: 'viewItem', itemId }), []);

  const handleItemSubmit = useCallback((itemData: Omit<TrackedItem, 'id' | 'materials'> & { id?: string }) => {
    setItems(prevItems => {
      if (itemData.id) { // Editing existing item
        // Preserve existing materials when editing item details
        const existingItem = prevItems.find(i => i.id === itemData.id);
        const materials = existingItem ? existingItem.materials : [];
        const totalMaterialsScreenshotUrl = existingItem ? existingItem.totalMaterialsScreenshotUrl : undefined;

        return prevItems.map(i => 
            i.id === itemData.id ? 
            { ...i, ...itemData, materials, totalMaterialsScreenshotUrl } : 
            i
        );
      } else { // Adding new item
        const newItem: TrackedItem = {
          ...itemData,
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          materials: [], // New items start with no materials
          totalMaterialsScreenshotUrl: undefined, // Ensure this is initialized
        };
        return [...prevItems, newItem];
      }
    });
    navigateToDashboard();
  }, [navigateToDashboard]);
  
  const handleItemDelete = useCallback((itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item and all its materials?")) {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      // If the currently viewed/edited item is deleted, navigate to dashboard
      if ((currentView.type === 'viewItem' && currentView.itemId === itemId) || 
          (currentView.type === 'editItem' && currentView.itemId === itemId)) {
        navigateToDashboard();
      }
    }
  }, [navigateToDashboard, currentView]);

  const handleUpdateSingleItem = useCallback((updatedItem: TrackedItem) => {
    setItems(prevItems => prevItems.map(i => i.id === updatedItem.id ? updatedItem : i));
  }, []);


  const renderView = () => {
    const itemToEdit = currentView.type === 'editItem' ? items.find(i => i.id === currentView.itemId) : undefined;
    const itemToView = currentView.type === 'viewItem' ? items.find(i => i.id === currentView.itemId) : undefined;

    switch (currentView.type) {
      case 'addItem':
        return <ItemForm onSubmit={handleItemSubmit} onCancel={navigateToDashboard} />;
      case 'editItem':
        return itemToEdit ? <ItemForm item={itemToEdit} onSubmit={handleItemSubmit} onCancel={navigateToDashboard} /> : <div className="p-6 text-center text-red-400">Item not found for editing. <button onClick={navigateToDashboard} className="text-sky-400 hover:underline">Go to Dashboard</button></div>;
      case 'viewItem':
        return itemToView ? <ItemDetailView item={itemToView} onUpdateItem={handleUpdateSingleItem} onBack={navigateToDashboard} /> : <div className="p-6 text-center text-red-400">Item not found for viewing. <button onClick={navigateToDashboard} className="text-sky-400 hover:underline">Go to Dashboard</button></div>;
      case 'dashboard':
      default:
        return <DashboardView 
                  items={items} 
                  onAddItem={navigateToAddItem} 
                  onViewItem={navigateToViewItem}
                  onEditItem={navigateToEditItem}
                  onDeleteItem={handleItemDelete}
                />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header onNavigateToDashboard={navigateToDashboard} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-slate-800 text-center p-4 text-sm text-slate-400 border-t border-slate-700">
        Gacha Resource Tracker &copy; {new Date().getFullYear()}
      </footer>
      {globalModalImageUrl && <ImageModal imageUrl={globalModalImageUrl} onClose={() => setGlobalModalImageUrl(null)} />}
    </div>
  );
};

export default App;
