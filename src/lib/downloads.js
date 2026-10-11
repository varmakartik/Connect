import { supabase } from "../supabaseClient";
import { getStoragePathFromUrl } from "./storage";
import { createZip } from "./zip";

const BUCKET = "documents";

export const saveBlob = (blob, filename) => {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
};

const safeName = (name, fallback) =>
  (name || fallback).replace(/[\\/:*?"<>|]+/g, "_").trim() || fallback;

// Avoid two entries with the same path inside one archive ("a.png", "a (2).png")
const uniquePath = (path, used) => {
  if (!used.has(path)) {
    used.add(path);
    return path;
  }
  const dot = path.lastIndexOf(".");
  const slash = path.lastIndexOf("/");
  const hasExt = dot > slash + 1;
  const base = hasExt ? path.slice(0, dot) : path;
  const ext = hasExt ? path.slice(dot) : "";
  let n = 2;
  while (used.has(`${base} (${n})${ext}`)) n++;
  const next = `${base} (${n})${ext}`;
  used.add(next);
  return next;
};

const fetchFileBlob = async (item) => {
  const path = getStoragePathFromUrl(item.url);
  if (!path) throw new Error(`No storage path for "${item.title}"`);
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw error;
  return data;
};

/**
 * Expand the chosen items (files and folders) into flat zip entries,
 * recursing through folder contents using each item's folder_id.
 */
const collectEntries = (rootItems, allItems) => {
  const files = [];
  const emptyDirs = [];
  const visited = new Set();

  const walk = (item, prefix) => {
    if (visited.has(item.id)) return;
    visited.add(item.id);

    if (item.type === "folder") {
      const dir = `${prefix}${safeName(item.title, "Folder")}/`;
      const children = allItems.filter((i) => i.folder_id === item.id);
      if (children.length === 0) emptyDirs.push(dir);
      children.forEach((child) => walk(child, dir));
    } else if (item.url) {
      files.push({ item, path: `${prefix}${safeName(item.title, "file")}` });
    }
  };

  rootItems.forEach((item) => walk(item, ""));
  return { files, emptyDirs };
};

/**
 * Download files/folders as a single .zip. A lone file is downloaded as-is.
 * @returns {{ downloaded: number, failed: string[] }}
 */
export const downloadItems = async (rootItems, allItems, zipName, onProgress) => {
  const { files, emptyDirs } = collectEntries(rootItems, allItems);

  if (files.length === 0 && emptyDirs.length === 0) {
    return { downloaded: 0, failed: [] };
  }

  if (files.length === 1 && emptyDirs.length === 0 && rootItems[0]?.type !== "folder") {
    const blob = await fetchFileBlob(files[0].item);
    saveBlob(blob, safeName(files[0].item.title, "file"));
    return { downloaded: 1, failed: [] };
  }

  const used = new Set();
  const entries = emptyDirs.map((dir) => ({ path: uniquePath(dir, used) }));
  const failed = [];
  let done = 0;

  // A few parallel fetches; storage downloads are the slow part
  const queue = [...files];
  const worker = async () => {
    while (queue.length > 0) {
      const { item, path } = queue.shift();
      try {
        const data = await fetchFileBlob(item);
        entries.push({ path: uniquePath(path, used), data });
      } catch (err) {
        console.error("Zip download failed:", item.title, err);
        failed.push(item.title);
      }
      done++;
      onProgress?.(done, files.length);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, files.length) }, worker));

  if (entries.length === 0) return { downloaded: 0, failed };

  const zip = await createZip(entries);
  saveBlob(zip, `${safeName(zipName, "Connect")}.zip`);
  return { downloaded: files.length - failed.length, failed };
};
