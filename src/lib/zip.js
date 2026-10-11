// Minimal ZIP writer (STORE method, no compression). Documents are mostly PDFs and
// images that are already compressed, so deflating them again gains little and
// keeping this dependency-free keeps the bundle small.

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const toDosDateTime = (date) => {
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day =
    ((Math.max(date.getFullYear(), 1980) - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();
  return { time, day };
};

/**
 * Build a ZIP Blob.
 * @param {{ path: string, data: Blob | ArrayBuffer | Uint8Array }[]} entries
 *   `path` uses "/" separators; a trailing "/" with no data marks an empty directory.
 */
export const createZip = async (entries) => {
  const encoder = new TextEncoder();
  const { time, day } = toDosDateTime(new Date());
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.path);
    let bytes;
    if (!entry.data) bytes = new Uint8Array(0);
    else if (entry.data instanceof Uint8Array) bytes = entry.data;
    else if (entry.data instanceof ArrayBuffer) bytes = new Uint8Array(entry.data);
    else bytes = new Uint8Array(await entry.data.arrayBuffer());

    const crc = crc32(bytes);
    const size = bytes.length;

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true); // version needed
    local.setUint16(6, 0x0800, true); // UTF-8 file names
    local.setUint16(8, 0, true); // STORE
    local.setUint16(10, time, true);
    local.setUint16(12, day, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, size, true);
    local.setUint32(22, size, true);
    local.setUint16(26, nameBytes.length, true);
    local.setUint16(28, 0, true);

    const header = new DataView(new ArrayBuffer(46));
    header.setUint32(0, 0x02014b50, true);
    header.setUint16(4, 20, true); // version made by
    header.setUint16(6, 20, true);
    header.setUint16(8, 0x0800, true);
    header.setUint16(10, 0, true);
    header.setUint16(12, time, true);
    header.setUint16(14, day, true);
    header.setUint32(16, crc, true);
    header.setUint32(20, size, true);
    header.setUint32(24, size, true);
    header.setUint16(28, nameBytes.length, true);
    header.setUint32(38, entry.path.endsWith("/") ? 0x10 : 0, true); // directory attr
    header.setUint32(42, offset, true);

    chunks.push(local, nameBytes, bytes);
    central.push(header, nameBytes);
    offset += 30 + nameBytes.length + size;
  }

  const centralSize = central.reduce((acc, part) => acc + part.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...chunks, ...central, end], { type: "application/zip" });
};
