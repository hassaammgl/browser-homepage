import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { BookmarkTile } from './components/BookmarkTile';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { FolderModal } from './components/FolderModal';
import { ThemeToggle } from './components/ThemeToggle';
import { SearchBar } from './components/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Bookmark, searchBookmarks, sortBookmarks, moveBookmark } from './utils/bookmarkUtils';

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

  const [isDark, setIsDark] = useLocalStorage('darkMode', false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Bookmark | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const filteredBookmarks = searchBookmarks(bookmarks, searchTerm);
  const displayBookmarks = sortBookmarks(filteredBookmarks);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'
    }`}>
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">
                {formatTime(currentTime)}
              </h1>
              <p className="text-white/80 text-lg">
                {formatDate(currentTime)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
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
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {displayBookmarks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  onDragOver={(e) => handleDragOver(e, bookmark.id)}
                  onDrop={(e) => handleDrop(e, bookmark.id)}
                  className={`${dragOverId === bookmark.id ? 'scale-105' : ''} transition-transform duration-200`}
                >
                  <BookmarkTile
                    item={bookmark}
                    onEdit={setEditingBookmark}
                    onDelete={handleDeleteBookmark}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenFolder={handleOpenFolder}
                    isDragging={draggedItemId === bookmark.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                </div>
              ))}
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
                <button
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