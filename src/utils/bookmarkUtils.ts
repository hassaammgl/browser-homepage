import { Bookmark } from '../types';

export function searchBookmarks(bookmarks: Bookmark[], searchTerm: string): Bookmark[] {
  if (!searchTerm.trim()) return bookmarks;

  const term = searchTerm.toLowerCase();
  return bookmarks.filter(bookmark => {
    const matchesTitle = bookmark.title.toLowerCase().includes(term);
    const matchesUrl = bookmark.url?.toLowerCase().includes(term);
    const matchesItems = bookmark.type === 'folder' && 
      bookmark.items?.some(item => 
        item.title.toLowerCase().includes(term) || 
        item.url?.toLowerCase().includes(term)
      );

    return matchesTitle || matchesUrl || matchesItems;
  });
}

export function sortBookmarks(bookmarks: Bookmark[]): Bookmark[] {
  return [...bookmarks].sort((a, b) => {
    // Favorites first
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    
    // Then folders
    if (a.type === 'folder' && b.type === 'bookmark') return -1;
    if (a.type === 'bookmark' && b.type === 'folder') return 1;
    
    // Finally alphabetical
    return a.title.localeCompare(b.title);
  });
}

export function moveBookmark(
  bookmarks: Bookmark[],
  draggedId: string,
  targetId: string
): Bookmark[] {
  const newBookmarks = [...bookmarks];
  const draggedIndex = newBookmarks.findIndex(b => b.id === draggedId);
  const targetIndex = newBookmarks.findIndex(b => b.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) return bookmarks;

  const [draggedItem] = newBookmarks.splice(draggedIndex, 1);
  newBookmarks.splice(targetIndex, 0, draggedItem);

  return newBookmarks;
}