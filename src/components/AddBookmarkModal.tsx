import React from 'react';
import { X, Bookmark, Folder } from 'lucide-react';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookmark: any) => void;
  editingBookmark?: any;
  folders: any[];
}

export const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBookmark,
  folders,
}) => {
  const [title, setTitle] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [type, setType] = React.useState<'bookmark' | 'folder'>('bookmark');
  const [folderId, setFolderId] = React.useState('');

  React.useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title);
      setUrl(editingBookmark.url || '');
      setType(editingBookmark.type);
      setFolderId(editingBookmark.folderId || '');
    } else {
      setTitle('');
      setUrl('');
      setType('bookmark');
      setFolderId('');
    }
  }, [editingBookmark, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const bookmark = {
      id: editingBookmark?.id || Date.now().toString(),
      title: title.trim(),
      type,
      ...(type === 'bookmark' && { url: url.trim() }),
      ...(type === 'folder' && { items: editingBookmark?.items || [] }),
      folderId: folderId || undefined,
      isFavorite: editingBookmark?.isFavorite || false,
    };

    onSave(bookmark);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingBookmark ? 'Edit' : 'Add'} {type === 'folder' ? 'Folder' : 'Bookmark'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                type === 'bookmark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
              onClick={() => setType('bookmark')}
            >
              <Bookmark className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Bookmark</span>
            </button>
            <button
              type="button"
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                type === 'folder'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
              onClick={() => setType('folder')}
            >
              <Folder className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Folder</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={type === 'folder' ? 'Folder name' : 'Bookmark title'}
              required
            />
          </div>

          {type === 'bookmark' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com"
                required
              />
            </div>
          )}

          {folders.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add to folder (optional)
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingBookmark ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};