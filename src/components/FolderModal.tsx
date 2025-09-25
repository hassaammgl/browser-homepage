import React from 'react';
import { X, Plus } from 'lucide-react';
import { BookmarkTile } from './BookmarkTile';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: any;
  onEditBookmark: (bookmark: any) => void;
  onDeleteBookmark: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAddBookmark: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  draggedItemId: string | null;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  folder,
  onEditBookmark,
  onDeleteBookmark,
  onToggleFavorite,
  onTogglePin,
  onAddBookmark,
  onDragStart,
  onDragEnd,
  draggedItemId,
}) => {
  if (!isOpen || !folder) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {folder.title}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onAddBookmark}
              className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {folder.items && folder.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {folder.items.map((item: any) => (
                <BookmarkTile
                  key={item.id}
                  item={item}
                  onEdit={onEditBookmark}
                  onDelete={onDeleteBookmark}
                  onToggleFavorite={onToggleFavorite}
                  onTogglePin={onTogglePin}
                  onOpenFolder={() => {}}
                  settings={{ tileSize: 'medium', viewMode: 'grid' } as any}
                  isDragging={draggedItemId === item.id}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No bookmarks yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Add your first bookmark to this folder
              </p>
              <button
                onClick={onAddBookmark}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Bookmark
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};