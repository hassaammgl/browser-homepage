import React from 'react';
import { ExternalLink, Star, MoreVertical, Folder } from 'lucide-react';

interface BookmarkTileProps {
  item: {
    id: string;
    title: string;
    url?: string;
    type: 'bookmark' | 'folder';
    isFavorite?: boolean;
    favicon?: string;
    items?: any[];
  };
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenFolder: (folder: any) => void;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}

export const BookmarkTile: React.FC<BookmarkTileProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenFolder,
  isDragging,
  onDragStart,
  onDragEnd,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
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
  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${item.isFavorite ? 'ring-2 ring-yellow-400' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
    >
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="mb-3 flex-shrink-0">
          {item.type === 'folder' ? (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {item.url && !faviconError ? (
                <img
                  src={getFavicon(item.url)}
                  alt={`${item.title} favicon`}
                  className="w-8 h-8 rounded"
                  onLoad={() => setFaviconLoaded(true)}
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <ExternalLink className="w-6 h-6 text-gray-500" />
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
      </div>
    </div>
  );
};