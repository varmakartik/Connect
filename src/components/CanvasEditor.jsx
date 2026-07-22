import React, { useState, useMemo, useCallback } from "react";
import ConfirmModal from "./canvas/ConfirmModal";
import SelectionBar from "./canvas/SelectionBar";
import RocketProgressConsole from "./canvas/RocketProgressConsole";
import DocumentCard from "./canvas/DocumentCard";
import CanvasToolbar from "./canvas/CanvasToolbar";
import CanvasEmptyState from "./canvas/CanvasEmptyState";
import CanvasGrid from "./canvas/CanvasGrid";

const CanvasEditor = ({
  items = [],
  onDelete,
  onDeleteMultiple,
  onFileUpload,
  onCancelUpload,
  onCancelFile,
  uploadProgress,
  onUpdateTitle,
  isDarkMode = true,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [codeMode, setCodeMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [items, searchQuery]
  );

  const isSelected = useCallback((id) => selectedIds.includes(id), [selectedIds]);

  const toggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => {
      if (prev) setSelectedIds([]);
      return !prev;
    });
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  }, [selectedIds, filteredItems]);

  const handleDownload = useCallback(async (url, filename) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "document";
      link.target = "_blank";
      link.click();
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileUpload(Array.from(e.dataTransfer.files));
      }
    },
    [onFileUpload]
  );

  const handleStartEditing = useCallback((item) => {
    setEditingId(item.id);
    setTempTitle(item.title || "");
  }, []);

  const handleSaveTitle = useCallback(
    (id) => {
      onUpdateTitle(id, tempTitle);
      setEditingId(null);
    },
    [onUpdateTitle, tempTitle]
  );

  const handleCancelEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* TOOLBAR COMPONENT */}
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        codeMode={codeMode}
        setCodeMode={setCodeMode}
        isSelectMode={isSelectMode}
        toggleSelectMode={toggleSelectMode}
        filteredCount={filteredItems.length}
        isDarkMode={isDarkMode}
      />

      {/* ROCKET PROGRESS CONSOLE */}
      {uploadProgress && (
        <div className="p-4 border-b border-slate-800/50">
          <RocketProgressConsole
            progress={uploadProgress}
            onCancelUpload={onCancelUpload}
            onCancelFile={onCancelFile}
          />
        </div>
      )}

      {/* MAIN DOCUMENT AREA */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {filteredItems.length === 0 ? (
          <CanvasEmptyState
            onFileUpload={onFileUpload}
            isDragging={isDragging}
            isDarkMode={isDarkMode}
          />
        ) : (
          <CanvasGrid isDarkMode={isDarkMode}>
            {filteredItems.map((item) => (
              <DocumentCard
                key={item.id}
                item={item}
                codeMode={codeMode}
                isSelectMode={isSelectMode}
                selected={isSelected(item.id)}
                isDeleting={deletingId === item.id}
                onToggleSelect={toggleSelect}
                onStartEditing={handleStartEditing}
                onSaveTitle={handleSaveTitle}
                onCancelEditing={handleCancelEditing}
                isEditing={editingId === item.id}
                tempTitle={tempTitle}
                setTempTitle={setTempTitle}
                onConfirmDelete={(id) => {
                  setItemToDelete(item);
                  setShowDeleteModal(true);
                }}
                onDownload={handleDownload}
                isDarkMode={isDarkMode}
              />
            ))}
          </CanvasGrid>
        )}
      </div>

      {/* SELECTION BAR */}
      {isSelectMode && (
        <SelectionBar
          selectedCount={selectedIds.length}
          totalCount={filteredItems.length}
          onSelectAll={handleSelectAll}
          onDeleteBatch={() => setShowBatchDeleteModal(true)}
          onDeleteAll={() => setShowDeleteAllModal(true)}
          onCancel={toggleSelectMode}
        />
      )}

      {/* CONFIRM MODALS */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (itemToDelete) {
            setDeletingId(itemToDelete.id);
            setShowDeleteModal(false);
            await onDelete(itemToDelete.id);
            setDeletingId(null);
          }
        }}
        title="Delete Document?"
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Document"
        isDanger={true}
      />

      <ConfirmModal
        isOpen={showBatchDeleteModal}
        onClose={() => setShowBatchDeleteModal(false)}
        onConfirm={async () => {
          setShowBatchDeleteModal(false);
          await onDeleteMultiple(selectedIds);
          setSelectedIds([]);
          setIsSelectMode(false);
        }}
        title="Delete Selected Items?"
        message={`Are you sure you want to delete ${selectedIds.length} selected document(s)?`}
        confirmText="Delete Selected"
        isDanger={true}
      />

      <ConfirmModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={async () => {
          setShowDeleteAllModal(false);
          const allIds = filteredItems.map((i) => i.id);
          await onDeleteMultiple(allIds);
          setSelectedIds([]);
          setIsSelectMode(false);
        }}
        title="Delete ALL Documents?"
        message="Are you sure you want to delete ALL documents in this view? This action is permanent."
        confirmText="Delete All Documents"
        isDanger={true}
      />
    </div>
  );
};

export default React.memo(CanvasEditor);
