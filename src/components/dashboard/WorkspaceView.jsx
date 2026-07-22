import React, { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy-load subcomponents to decrease initial bundle size and boost performance
const Notepad = lazy(() => import("../Notepad"));
const CanvasEditor = lazy(() => import("../CanvasEditor"));
const OurStory = lazy(() => import("../OurStory"));
const LinkVault = lazy(() => import("../LinkVault"));

const SubcomponentLoader = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-slate-400">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
    <span className="text-xs font-semibold tracking-wider">Loading Workspace...</span>
  </div>
);

const WorkspaceView = ({
  viewType,
  items,
  activeTabId,
  setActiveTabId,
  addNewTab,
  updateNoteContent,
  deleteItem,
  deleteMultipleItems,
  handleFileUpload,
  handleCancelUpload,
  handleCancelFile,
  uploadProgress,
  renameItem,
  addLinkItem,
  isDarkMode,
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <Suspense fallback={<SubcomponentLoader />}>
        {viewType === "notes" ? (
          <Notepad
            tabs={items.filter((i) => i.type === "note")}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
            onAddTab={addNewTab}
            onUpdate={updateNoteContent}
            onDelete={deleteItem}
            isDarkMode={isDarkMode}
          />
        ) : viewType === "canvas" ? (
          <CanvasEditor
            items={items.filter((i) => i.type !== "note" && i.type !== "link")}
            onDelete={deleteItem}
            onDeleteMultiple={deleteMultipleItems}
            onFileUpload={handleFileUpload}
            onCancelUpload={handleCancelUpload}
            onCancelFile={handleCancelFile}
            uploadProgress={uploadProgress}
            onUpdateTitle={renameItem}
            isDarkMode={isDarkMode}
          />
        ) : viewType === "links" ? (
          <LinkVault
            items={items}
            onAddLink={addLinkItem}
            onDeleteLink={deleteItem}
            isDarkMode={isDarkMode}
          />
        ) : (
          <OurStory />
        )}
      </Suspense>
    </div>
  );
};

export default React.memo(WorkspaceView);
