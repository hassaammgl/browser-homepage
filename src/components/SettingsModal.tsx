import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Upload, RotateCcw } from 'lucide-react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onResetSettings: () => void;
  onExportBookmarks: () => void;
  onImportBookmarks: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onExportBookmarks,
  onImportBookmarks,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'layout' | 'widgets' | 'data'>('appearance');

  if (!isOpen) return null;

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpdateSettings({
          ...settings,
          backgroundType: 'image',
          backgroundImage: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const gradientOptions = [
    'from-blue-400 via-purple-500 to-pink-500',
    'from-green-400 via-blue-500 to-purple-600',
    'from-yellow-400 via-red-500 to-pink-500',
    'from-purple-400 via-pink-500 to-red-500',
    'from-indigo-400 via-purple-500 to-pink-500',
    'from-gray-700 via-gray-900 to-black',
  ];

  const colorOptions = [
    '#3B82F6', '#8B5CF6', '#EF4444', '#10B981',
    '#F59E0B', '#EC4899', '#6366F1', '#14B8A6',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 dark:bg-gray-800 p-4">
            <nav className="space-y-2">
              {[
                { id: 'appearance', label: 'Appearance' },
                { id: 'layout', label: 'Layout' },
                { id: 'widgets', label: 'Widgets' },
                { id: 'data', label: 'Data' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        settings.theme === 'light'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        settings.theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Background</h3>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => onUpdateSettings({ ...settings, backgroundType: 'gradient' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          settings.backgroundType === 'gradient'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Gradient
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, backgroundType: 'color' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          settings.backgroundType === 'color'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Solid Color
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, backgroundType: 'image' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          settings.backgroundType === 'image'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Image
                      </button>
                    </div>

                    {settings.backgroundType === 'gradient' && (
                      <div className="grid grid-cols-3 gap-2">
                        {gradientOptions.map((gradient, index) => (
                          <button
                            key={index}
                            onClick={() => onUpdateSettings({ ...settings, backgroundColor: gradient })}
                            className={`h-12 rounded-lg bg-gradient-to-r ${gradient} border-2 ${
                              settings.backgroundColor === gradient ? 'border-white' : 'border-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {settings.backgroundType === 'color' && (
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => onUpdateSettings({ ...settings, backgroundColor: color })}
                            className={`h-12 rounded-lg border-2 ${
                              settings.backgroundColor === color ? 'border-white' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}

                    {settings.backgroundType === 'image' && (
                      <div>
                        <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> background image
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleBackgroundImageUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tile Size</h3>
                  <div className="flex space-x-4">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => onUpdateSettings({ ...settings, tileSize: size as any })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors capitalize ${
                          settings.tileSize === size
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Grid Columns</h3>
                  <div className="flex space-x-4">
                    {[2, 3, 4, 5, 6].map((cols) => (
                      <button
                        key={cols}
                        onClick={() => onUpdateSettings({ ...settings, gridColumns: cols as any })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          settings.gridColumns === cols
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">View Mode</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => onUpdateSettings({ ...settings, viewMode: 'grid' })}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        settings.viewMode === 'grid'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => onUpdateSettings({ ...settings, viewMode: 'list' })}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        settings.viewMode === 'list'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'widgets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Clock Widget</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show current time and date</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showClock}
                      onChange={(e) => onUpdateSettings({ ...settings, showClock: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {settings.showClock && (
                  <div className="ml-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Clock Type</h4>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => onUpdateSettings({ ...settings, clockType: 'digital' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          settings.clockType === 'digital'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Digital
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, clockType: 'analog' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          settings.clockType === 'analog'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Analog
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weather Widget</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show current weather conditions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showWeather}
                      onChange={(e) => onUpdateSettings({ ...settings, showWeather: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Links</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show pinned bookmarks at top</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showQuickLinks}
                      onChange={(e) => onUpdateSettings({ ...settings, showQuickLinks: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Search Engine</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'google', name: 'Google' },
                      { id: 'duckduckgo', name: 'DuckDuckGo' },
                      { id: 'brave', name: 'Brave' },
                      { id: 'bing', name: 'Bing' },
                    ].map((engine) => (
                      <button
                        key={engine.id}
                        onClick={() => onUpdateSettings({ ...settings, searchEngine: engine.id as any })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          settings.searchEngine === engine.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {engine.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Backup & Restore</h3>
                  <div className="space-y-4">
                    <button
                      onClick={onExportBookmarks}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Export Bookmarks
                    </button>
                    <div>
                      <label className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-center">
                        Import Bookmarks
                        <input
                          type="file"
                          accept=".json"
                          onChange={onImportBookmarks}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reset</h3>
                  <button
                    onClick={onResetSettings}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Default</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};