import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import Notepad from "../components/Notepad";
import CanvasEditor from "../components/CanvasEditor";
import OurStory from "../components/OurStory";
import { Menu } from "lucide-react";

const Dashboard = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState("notes");
  const [activeTabId, setActiveTabId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load user-scoped cache immediately on user session resolution
  useEffect(() => {
    if (!user) return;
    try {
      const cached = localStorage.getItem(`connect_items_${user.id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setItems(parsed);
        // Set first note as active if none is currently selected
        if (parsed.length > 0) {
          const firstNote = parsed.find((i) => i.type === "note");
          if (firstNote) {
            setActiveTabId(firstNote.id);
          }
        }
      }
    } catch (e) {
      console.warn("Could not read local cache:", e);
    }
  }, [user]);

  // Sync cache changes securely
  useEffect(() => {
    if (!user || items.length === 0) return;
    const stableItems = items.filter((item) => !String(item.id).startsWith("temp-"));
    localStorage.setItem(`connect_items_${user.id}`, JSON.stringify(stableItems));
  }, [items, user]);

  // Set dynamic browser tab title based on active view type
  useEffect(() => {
    switch (viewType) {
      case "notes":
        document.title = "Notepad - Connect";
        break;
      case "canvas":
        document.title = "Documents - Connect";
        break;
      case "story":
        document.title = "Behind the Spark ✨ - Connect";
        break;
      default:
        document.title = "Connect - Workspace";
    }
  }, [viewType]);

  // Fetch Items on user load & set up Real-time channel
  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        setItems((prev) => {
          const tempItem = prev.find((i) => String(i.id).startsWith("temp-"));
          if (!tempItem) {
            if (data?.length > 0) {
              const firstNote = data.find((i) => i.type === "note");
              if (firstNote) {
                setActiveTabId((prevActive) => prevActive || firstNote.id);
              }
            }
            return data || [];
          }

          const newestNote = data.find((i) => i.type === "note");
          if (newestNote) {
            const exists = prev.some((i) => i.id === newestNote.id);
            if (!exists) {
              setActiveTabId((prevActive) => (prevActive === tempItem.id ? newestNote.id : prevActive));
              return prev.map((item) => (item.id === tempItem.id ? newestNote : item));
            }
          }

          return data || [];
        });
      }
    };

    fetchItems();

    const channel = supabase
      .channel(`user-data-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "items",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login", { replace: true });
    } catch (e) {
      alert("Logout failed: " + e.message);
    }
  };

  const addNewTab = async () => {
    const tempId = `temp-${Date.now()}`;
    const newNote = {
      id: tempId,
      title: "New Note",
      content: "",
      type: "note",
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    // Keep backups in case of DB insertion errors
    const backupItems = [...items];
    const backupActiveTabId = activeTabId;

    // Optimistically update local states immediately
    setItems((prev) => [newNote, ...prev]);
    setActiveTabId(tempId);

    try {
      const { data, error } = await supabase
        .from("items")
        .insert([
          {
            title: "New Note",
            content: "",
            type: "note",
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        const realNote = data[0];
        setItems((prev) =>
          prev.map((item) => (item.id === tempId ? realNote : item))
        );
        setActiveTabId((prevActive) => (prevActive === tempId ? realNote.id : prevActive));
      }
    } catch (e) {
      // Rollback on error
      setItems(backupItems);
      setActiveTabId(backupActiveTabId);
      alert("Error creating note: " + e.message);
    }
  };

  const updateNoteContent = async (id, newContent, newTitle) => {
    const backupItems = [...items];
    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, content: newContent, title: newTitle }
            : item
        )
      );

      const { error } = await supabase
        .from("items")
        .update({ content: newContent, title: newTitle })
        .eq("id", id);

      if (error) throw error;
    } catch (e) {
      // Rollback
      setItems(backupItems);
      alert("Update failed: " + e.message);
    }
  };

  const getStoragePathFromUrl = (url) => {
    const parts = url.split("/storage/v1/object/public/documents/");
    return parts.length > 1 ? parts[1] : null;
  };

  const deleteItem = async (id) => {
    const itemToDelete = items.find((item) => item.id === id);
    if (!itemToDelete) return;

    const backupItems = [...items];
    const backupActiveTabId = activeTabId;

    try {
      // Optimistic delete
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (activeTabId === id) setActiveTabId(null);

      // Delete from DB
      const { error: dbError } = await supabase
        .from("items")
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      // Delete from Storage if it has a file URL
      if (itemToDelete.type !== "note" && itemToDelete.url) {
        const path = getStoragePathFromUrl(itemToDelete.url);
        if (path) {
          await supabase.storage.from("documents").remove([path]);
        }
      }
    } catch (e) {
      // Rollback
      setItems(backupItems);
      setActiveTabId(backupActiveTabId);
      alert("Delete failed: " + e.message);
    }
  };

  const renameItem = async (id, newTitle) => {
    const backupItems = [...items];
    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: newTitle } : item
        )
      );

      const { error } = await supabase
        .from("items")
        .update({ title: newTitle })
        .eq("id", id);

      if (error) throw error;
    } catch (e) {
      // Rollback
      setItems(backupItems);
      alert("Rename failed: " + e.message);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !user) return;
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    try {
      setUploadProgress(20);
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(70);
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(fileName);

      let fileType = "doc";
      if (file.type.includes("pdf")) {
        fileType = "pdf";
      } else if (file.type.includes("image")) {
        fileType = "image";
      }

      const { error: dbError } = await supabase.from("items").insert([
        {
          title: file.name,
          type: fileType,
          url: publicUrl,
          user_id: user.id,
        },
      ]);

      if (dbError) throw dbError;
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      alert("Upload error: " + error.message);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Mobile Logic */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-300 ease-out z-50`}
      >
        <Sidebar
          userEmail={user.user_metadata?.display_name || "User"}
          setViewType={(v) => {
            setViewType(v);
            setIsSidebarOpen(false);
          }}
          viewType={viewType}
          onLogout={handleLogout}
        />
      </div>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-xl transition"
          >
            <Menu size={24} className="text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/connect.png" alt="Connect Logo" className="w-6 h-6 object-contain rounded" />
            <span className="font-extrabold text-blue-400 text-lg tracking-tight">Connect</span>
          </div>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {viewType === "notes" ? (
            <Notepad
              tabs={items.filter((i) => i.type === "note")}
              activeTabId={activeTabId}
              setActiveTabId={setActiveTabId}
              onAddTab={addNewTab}
              onUpdate={updateNoteContent}
              onDelete={deleteItem}
            />
          ) : viewType === "canvas" ? (
            <CanvasEditor
              items={items.filter((i) => i.type !== "note")}
              onDelete={deleteItem}
              onFileUpload={handleFileUpload}
              uploadProgress={uploadProgress}
              onUpdateTitle={renameItem}
            />
          ) : (
            <OurStory />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
