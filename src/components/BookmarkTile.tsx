import React from 'react';
import { ExternalLink, Star, MoreVertical, Folder, Pin } from 'lucide-react';
import { Settings } from '../types';

interface BookmarkTileProps {
  item: {
    id: string;
    title: string;
    url?: string;
    type: 'bookmark' | 'folder';
    isFavorite?: boolean;
    favicon?: string;
    items?: any[];
    isPinned?: boolean;
  };
  settings: Settings;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenFolder: (folder: any) => void;
  onTogglePin: (id: string) => void;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}

export const BookmarkTile: React.FC<BookmarkTileProps> = ({
  item,
  settings,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenFolder,
  onTogglePin,
  isDragging,
  onDragStart,
  onDragEnd,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ x: 0, y: 0 });
  const [faviconError, setFaviconError] = React.useState(false);
  const [faviconLoaded, setFaviconLoaded] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.type === 'folder') {
      onOpenFolder(item);
    } else if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const getHighResFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://${domain}/favicon.ico`;
    } catch {
      return null;
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleContextMenuAction = (action: () => void) => {
    action();
    setShowContextMenu(false);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(false);
      setShowMenu(false);
    };
    
    if (showContextMenu || showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu, showMenu]);

  const getTileSize = () => {
    switch (settings.tileSize) {
      case 'small': return 'p-3';
      case 'large': return 'p-6';
      default: return 'p-4';
    }
  };

  const getIconSize = () => {
    switch (settings.tileSize) {
      case 'small': return 'w-8 h-8';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getInnerIconSize = () => {
    switch (settings.tileSize) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  if (settings.viewMode === 'list') {
    return (
      <div
        className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
          isDragging ? 'opacity-50' : ''
        } ${item.isFavorite ? 'ring-2 ring-yellow-400' : ''} ${item.isPinned ? 'ring-2 ring-blue-400' : ''}`}
        draggable
        onDragStart={(e) => onDragStart(e, item.id)}
        onDragEnd={onDragEnd}
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        <div className="flex items-center p-3 space-x-3">
          <div className="flex-shrink-0">
            {item.type === 'folder' ? (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Folder className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {item.url && !faviconError ? (
                  <img
                    src={getFavicon(item.url)}
                    alt={`${item.title} favicon`}
                    className="w-5 h-5 rounded"
                    onLoad={() => setFaviconLoaded(true)}
                    onError={() => setFaviconError(true)}
                  />
                ) : (
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {item.title}
            </h3>
            {item.type === 'folder' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.items?.length || 0} items
              </p>
            )}
            {item.url && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {item.url}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {item.isPinned && <Pin className="w-3 h-3 text-blue-400" />}
            {item.isFavorite && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${item.isFavorite ? 'ring-2 ring-yellow-400' : ''} ${item.isPinned ? 'ring-2 ring-blue-400' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      <div className={`${getTileSize()} h-full flex flex-col items-center justify-center text-center`}>
        {/* Icon */}
        <div className="mb-3 flex-shrink-0">
          {item.type === 'folder' ? (
            <div className={`${getIconSize()} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
              <Folder className={`${getInnerIconSize()} text-white`} />
            </div>
          ) : (
            <div className={`${getIconSize()} bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden`}>
              {item.url && !faviconError ? (
                <img
                  src={getFavicon(item.url)}
                  alt={`${item.title} favicon`}
                  className={`${settings.tileSize === 'small' ? 'w-5 h-5' : settings.tileSize === 'large' ? 'w-10 h-10' : 'w-8 h-8'} rounded`}
                  onLoad={() => setFaviconLoaded(true)}
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <ExternalLink className={`${getInnerIconSize()} text-gray-500`} />
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
          {item.title}
        </h3>

        {/* Subtitle for folders */}
        {item.type === 'folder' && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.items?.length || 0} items
          </p>
        )}

        {/* Favorite star */}
        {item.isFavorite && (
          <Star className="absolute top-2 left-2 w-4 h-4 text-yellow-400 fill-current" />
        )}
        
        {/* Pin indicator */}
        {item.isPinned && (
          <Pin className="absolute top-2 left-8 w-4 h-4 text-blue-400 fill-current" />
        )}

        {/* Menu button */}
        <button
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Menu dropdown */}
        {showMenu && (
          <div className="absolute top-8 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-50 min-w-[120px]">
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
                setShowMenu(false);
              }}
            >
              Edit
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
                setShowMenu(false);
              }}
            >
              {item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(item.id);
                setShowMenu(false);
              }}
            >
              {item.isPinned ? 'Unpin' : 'Pin to top'}
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
                setShowMenu(false);
              }}
            >
              Delete
            </button>
          </div>
        )}
        
        {/* Context Menu */}
        {showContextMenu && (
          <div 
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-50 min-w-[120px]"
            style={{ 
              left: contextMenuPosition.x, 
              top: contextMenuPosition.y,
              transform: 'translate(-50%, -10px)'
            }}
          >
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleContextMenuAction(() => onEdit(item))}
            >
              Edit
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleContextMenuAction(() => onToggleFavorite(item.id))}
            >
              {item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleContextMenuAction(() => onTogglePin(item.id))}
            >
              {item.isPinned ? 'Unpin' : 'Pin to top'}
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleContextMenuAction(() => onDelete(item.id))}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};