import React, { useState, useEffect } from 'react';
import { Plus, Settings as SettingsIcon, Grid, List } from 'lucide-react';
import { BookmarkTile } from './components/BookmarkTile';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { FolderModal } from './components/FolderModal';
import { SettingsModal } from './components/SettingsModal';
import { ThemeToggle } from './components/ThemeToggle';
import { SearchBar } from './components/SearchBar';
import { WeatherWidget } from './components/WeatherWidget';
import { AnalogClock } from './components/AnalogClock';
import { QuoteWidget } from './components/QuoteWidget';
import { useLocalStorage } from './hooks/useLocalStorage';
import { searchBookmarks, sortBookmarks, moveBookmark } from './utils/bookmarkUtils';
import { Bookmark, Settings } from './types';

const defaultSettings: Settings = {
  theme: 'dark',
  backgroundType: 'gradient',
  backgroundColor: 'from-blue-400 via-purple-500 to-pink-500',
  tileSize: 'medium',
  gridColumns: 4,
  showClock: true,
  showWeather: true,
  showQuickLinks: true,
  clockType: 'digital',
  searchEngine: 'google',
  viewMode: 'grid',
};

function App() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', [
    {
      id: '1',
      title: 'Google',
      url: 'https://google.com',
      type: 'bookmark' as const,
      isFavorite: true,
    },
    {
      id: '2',
      title: 'GitHub',
      url: 'https://github.com',
      type: 'bookmark' as const,
    },
    {
      id: '4',
      title: 'YouTube',
      url: 'https://youtube.com',
      type: 'bookmark' as const,
    },
    {
      id: '5',
      title: 'Twitter',
      url: 'https://twitter.com',
      type: 'bookmark' as const,
    },
    {
      id: '6',
      title: 'Reddit',
      url: 'https://reddit.com',
      type: 'bookmark' as const,
    },
    {
      id: '7',
      title: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      type: 'bookmark' as const,
    },
    {
      id: '3',
      title: 'Work',
      type: 'folder' as const,
      items: [
        {
          id: '3-1',
          title: 'Gmail',
          url: 'https://gmail.com',
          type: 'bookmark' as const,
        },
        {
          id: '3-2',
          title: 'Slack',
          url: 'https://slack.com',
          type: 'bookmark' as const,
        },
        {
          id: '3-3',
          title: 'Notion',
          url: 'https://notion.so',
          type: 'bookmark' as const,
        },
      ],
    },
  ]);

  const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Bookmark | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const filteredBookmarks = searchBookmarks(bookmarks, searchTerm);
  const sortedBookmarks = sortBookmarks(filteredBookmarks);
  
  // Separate pinned and regular bookmarks
  const pinnedBookmarks = sortedBookmarks.filter(b => b.isPinned);
  const regularBookmarks = sortedBookmarks.filter(b => !b.isPinned);
  const displayBookmarks = [...pinnedBookmarks, ...regularBookmarks];

  const folders = bookmarks.filter(b => b.type === 'folder');

  const handleSaveBookmark = (bookmark: Bookmark) => {
    if (editingBookmark) {
      // Update existing bookmark
      setBookmarks(bookmarks.map(b => {
        if (b.id === bookmark.id) {
          return bookmark;
        }
        // Update within folders too
        if (b.type === 'folder' && b.items) {
          const updatedItems = b.items.map(item => 
            item.id === bookmark.id ? bookmark : item
          );
          return { ...b, items: updatedItems };
        }
        return b;
      }));
    } else {
      // Add new bookmark
      if (bookmark.folderId) {
        // Add to folder
        setBookmarks(bookmarks.map(b => {
          if (b.id === bookmark.folderId && b.type === 'folder') {
            return {
              ...b,
              items: [...(b.items || []), { ...bookmark, folderId: undefined }]
            };
          }
          return b;
        }));
      } else {
        // Add to root
        setBookmarks([...bookmarks, bookmark]);
      }
    }
    setEditingBookmark(null);
  };

  const handleDeleteBookmark = (id: string) => {
    // Remove from root
    const newBookmarks = bookmarks.filter(b => b.id !== id);
    
    // Remove from folders
    const updatedBookmarks = newBookmarks.map(b => {
      if (b.type === 'folder' && b.items) {
        return {
          ...b,
          items: b.items.filter(item => item.id !== id)
        };
      }
      return b;
    });
    
    setBookmarks(updatedBookmarks);
  };

  const handleToggleFavorite = (id: string) => {
    const toggleInArray = (items: Bookmark[]): Bookmark[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        if (item.type === 'folder' && item.items) {
          return { ...item, items: toggleInArray(item.items) };
        }
        return item;
      });
    };
    
    setBookmarks(toggleInArray(bookmarks));
  };

  const handleTogglePin = (id: string) => {
    const toggleInArray = (items: Bookmark[]): Bookmark[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isPinned: !item.isPinned };
        }
        if (item.type === 'folder' && item.items) {
          return { ...item, items: toggleInArray(item.items) };
        }
        return item;
      });
    };
    
    setBookmarks(toggleInArray(bookmarks));
  };

  const handleOpenFolder = (folder: Bookmark) => {
    setSelectedFolder(folder);
    setIsFolderModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== targetId) {
      setBookmarks(moveBookmark(bookmarks, draggedItemId, targetId));
    }
    setDraggedItemId(null);
    setDragOverId(null);
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
  };

  const handleExportBookmarks = () => {
    const dataStr = JSON.stringify({ bookmarks, settings }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookmarks-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBookmarks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.bookmarks) {
            setBookmarks(data.bookmarks);
          }
          if (data.settings) {
            setSettings({ ...defaultSettings, ...data.settings });
          }
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const formatTime = (date: Date) => {
    return settings.clockType === 'digital' 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'gradient':
        return `bg-gradient-to-br ${settings.backgroundColor}`;
      case 'color':
        return '';
      case 'image':
        return settings.backgroundImage ? '' : `bg-gradient-to-br ${settings.backgroundColor}`;
      default:
        return `bg-gradient-to-br ${settings.backgroundColor}`;
    }
  };

  const getGridColumns = () => {
    const cols = settings.gridColumns;
    return `grid-cols-2 sm:grid-cols-${Math.min(cols, 3)} md:grid-cols-${Math.min(cols, 4)} lg:grid-cols-${Math.min(cols, 5)} xl:grid-cols-${cols}`;
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${getBackgroundStyle()}`}
      style={settings.backgroundType === 'color' ? { backgroundColor: settings.backgroundColor } : 
             settings.backgroundType === 'image' && settings.backgroundImage ? { 
               backgroundImage: `url(${settings.backgroundImage})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             } : {}}
    >
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start space-x-6">
              {/* Clock Widget */}
              {settings.showClock && (
                <div className="text-white">
                  {settings.clockType === 'digital' ? (
                    <>
                      <h1 className="text-4xl font-bold mb-2">
                        {formatTime(currentTime)}
                      </h1>
                      <p className="text-white/80 text-lg">
                        {formatDate(currentTime)}
                      </p>
                    </>
                  ) : (
                    <AnalogClock />
                  )}
                </div>
              )}
              
              {/* Weather Widget */}
              {settings.showWeather && (
                <WeatherWidget />
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSettings({ ...settings, viewMode: settings.viewMode === 'grid' ? 'list' : 'grid' })}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white"
                title={`Switch to ${settings.viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {settings.viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
              <ThemeToggle 
                isDark={settings.theme === 'dark'} 
                onToggle={() => setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })} 
              />
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white"
                title="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white"
                title="Add bookmark or folder"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            settings={settings}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Quote Widget */}
          {!searchTerm && (
            <div className="mb-8">
              <QuoteWidget className="max-w-2xl mx-auto" />
            </div>
          )}
          
          {/* Pinned Bookmarks */}
          {settings.showQuickLinks && pinnedBookmarks.length > 0 && !searchTerm && (
            <div className="mb-8">
              <h2 className="text-white text-lg font-semibold mb-4 flex items-center">
                <span>Pinned</span>
              </h2>
              <div className={`grid ${getGridColumns()} gap-4`}>
                {pinnedBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    onDragOver={(e) => handleDragOver(e, bookmark.id)}
                    onDrop={(e) => handleDrop(e, bookmark.id)}
                    className={`${dragOverId === bookmark.id ? 'scale-105' : ''} transition-transform duration-200`}
                  >
                    <BookmarkTile
                      item={bookmark}
                      settings={settings}
                      onEdit={setEditingBookmark}
                      onDelete={handleDeleteBookmark}
                      onToggleFavorite={handleToggleFavorite}
                      onTogglePin={handleTogglePin}
                      onOpenFolder={handleOpenFolder}
                      isDragging={draggedItemId === bookmark.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* All Bookmarks */}
          {displayBookmarks.length > 0 ? (
            <div>
              {(settings.showQuickLinks && pinnedBookmarks.length > 0 && !searchTerm) && (
                <h2 className="text-white text-lg font-semibold mb-4">All Bookmarks</h2>
              )}
              <div className={settings.viewMode === 'grid' ? `grid ${getGridColumns()} gap-4` : 'space-y-2'}>
                {(searchTerm ? displayBookmarks : regularBookmarks).map((bookmark) => (
                  <div
                    key={bookmark.id}
                    onDragOver={(e) => handleDragOver(e, bookmark.id)}
                    onDrop={(e) => handleDrop(e, bookmark.id)}
                    className={`${dragOverId === bookmark.id ? 'scale-105' : ''} transition-transform duration-200`}
                  >
                    <BookmarkTile
                      item={bookmark}
                      settings={settings}
                      onEdit={setEditingBookmark}
                      onDelete={handleDeleteBookmark}
                      onToggleFavorite={handleToggleFavorite}
                      onTogglePin={handleTogglePin}
                      onOpenFolder={handleOpenFolder}
                      isDragging={draggedItemId === bookmark.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                {searchTerm ? 'No results found' : 'Welcome to your homepage'}
              </h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `No bookmarks or folders match "${searchTerm}"`
                  : 'Add your first bookmark or folder to get started'
                }
              </p>
              {!searchTerm && (
                <div
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Add Bookmark
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetSettings={handleResetSettings}
        onExportBookmarks={handleExportBookmarks}
        onImportBookmarks={handleImportBookmarks}
      />

      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBookmark(null);
        }}
        onSave={handleSaveBookmark}
        editingBookmark={editingBookmark}
        folders={folders}
      />

      <AddBookmarkModal
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSave={handleSaveBookmark}
        editingBookmark={editingBookmark}
        folders={folders}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setSelectedFolder(null);
        }}
        folder={selectedFolder}
        onEditBookmark={setEditingBookmark}
        onDeleteBookmark={handleDeleteBookmark}
        onToggleFavorite={handleToggleFavorite}
        onTogglePin={handleTogglePin}
        onAddBookmark={() => {
          setEditingBookmark({
            id: '',
            title: '',
            url: '',
            type: 'bookmark',
            folderId: selectedFolder?.id,
          });
          setIsFolderModalOpen(false);
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        draggedItemId={draggedItemId}
      />
    </div>
  );
}

export default App;