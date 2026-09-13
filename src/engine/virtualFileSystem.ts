import type { FSNode, RecycleEntry, VfsData } from '../types';
import {
  HOME,
  SEP,
  baseName,
  canonicalize,
  displayPath,
  joinPath,
  parentPath,
  resolvePath,
  splitPath,
} from './paths';

let seq = 0;
function nid(prefix = 'n'): string {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq.toString(36)}`;
}

export class VirtualFileSystem {
  nodes: Map<string, FSNode>;
  recycle: RecycleEntry[];

  constructor(data?: VfsData) {
    this.nodes = new Map();
    this.recycle = [];
    if (data) {
      for (const node of data.nodes) this.nodes.set(node.id, { ...node });
      this.recycle = data.recycle.map((e) => ({
        ...e,
        node: { ...e.node },
        children: e.children.map((c) => ({ ...c })),
      }));
    }
  }

  static seed(): VirtualFileSystem {
    const vfs = new VirtualFileSystem();
    const now = Date.now();
    const add = (
      id: string,
      name: string,
      type: FSNode['type'],
      parentId: string | null,
      content?: string,
    ) => {
      vfs.nodes.set(id, { id, name, type, parentId, createdAt: now, modifiedAt: now, content });
    };
    add('c-drive', 'C:', 'folder', null);
    add('users', 'Users', 'folder', 'c-drive');
    add('student', 'Student', 'folder', 'users');
    add('desktop', 'Desktop', 'folder', 'student');
    add('documents', 'Documents', 'folder', 'student');
    add('downloads', 'Downloads', 'folder', 'student');
    add('pictures', 'Pictures', 'folder', 'student');
    add('program-files', 'Program Files', 'folder', 'c-drive');
    add('ta-app', 'Terminal Space', 'folder', 'program-files');
    add('windows', 'Windows', 'folder', 'c-drive');
    add('system32', 'System32', 'folder', 'windows');
    add('temp', 'Temp', 'folder', 'c-drive');
    add(
      'readme',
      'readme.txt',
      'file',
      'ta-app',
      'Terminal Space virtual computer. Commands stay in this browser.',
    );
    return vfs;
  }

  toJSON(): VfsData {
    return {
      nodes: [...this.nodes.values()].map((n) => ({ ...n })),
      recycle: this.recycle.map((e) => ({
        ...e,
        node: { ...e.node },
        children: e.children.map((c) => ({ ...c })),
      })),
    };
  }

  get(id: string): FSNode | undefined {
    return this.nodes.get(id);
  }

  root(): FSNode {
    const node = [...this.nodes.values()].find((n) => n.parentId === null);
    if (!node) throw new Error('VFS missing root');
    return node;
  }

  childrenOf(id: string): FSNode[] {
    return [...this.nodes.values()]
      .filter((n) => n.parentId === id)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
  }

  findChild(parentId: string, name: string): FSNode | undefined {
    const needle = name.toLowerCase();
    return this.childrenOf(parentId).find((n) => n.name.toLowerCase() === needle);
  }

  nodePath(id: string): string {
    const parts: string[] = [];
    let cur = this.nodes.get(id);
    while (cur) {
      parts.unshift(cur.name);
      cur = cur.parentId ? this.nodes.get(cur.parentId) : undefined;
    }
    return joinPath(parts);
  }

  findByPath(path: string): FSNode | undefined {
    const canon = canonicalize(path);
    if (canon === 'C:' + SEP || canon === 'C:') return this.root();
    const parts = splitPath(canon);
    let cur: FSNode | undefined = this.root();
    for (let i = 1; i < parts.length; i += 1) {
      if (!cur) return undefined;
      cur = this.findChild(cur.id, parts[i]);
    }
    return cur;
  }

  exists(path: string): boolean {
    return Boolean(this.findByPath(path));
  }

  resolveFrom(cwd: string, target: string): { path: string; node?: FSNode } {
    const path = resolvePath(cwd, target);
    return { path, node: this.findByPath(path) };
  }

  list(path: string): FSNode[] {
    const node = this.findByPath(path);
    if (!node || node.type !== 'folder') return [];
    return this.childrenOf(node.id);
  }

  mkdir(cwd: string, spec: string): { ok: true; path: string } | { ok: false; message: string } {
    const path = resolvePath(cwd, spec);
    if (this.findByPath(path)) {
      return { ok: false, message: `A subdirectory or file ${baseName(path)} already exists.` };
    }
    const parent = this.findByPath(parentPath(path));
    if (!parent || parent.type !== 'folder') {
      return { ok: false, message: 'The system cannot find the path specified.' };
    }
    const now = Date.now();
    const id = nid('dir');
    this.nodes.set(id, {
      id,
      name: baseName(path),
      type: 'folder',
      parentId: parent.id,
      createdAt: now,
      modifiedAt: now,
    });
    parent.modifiedAt = now;
    return { ok: true, path: this.nodePath(id) };
  }

  writeFile(
    cwd: string,
    spec: string,
    content = '',
  ): { ok: true; path: string; created: boolean } | { ok: false; message: string } {
    const path = resolvePath(cwd, spec);
    const existing = this.findByPath(path);
    const now = Date.now();
    if (existing) {
      if (existing.type === 'folder') {
        return { ok: false, message: 'Access is denied.' };
      }
      existing.content = content;
      existing.modifiedAt = now;
      return { ok: true, path: this.nodePath(existing.id), created: false };
    }
    const parent = this.findByPath(parentPath(path));
    if (!parent || parent.type !== 'folder') {
      return { ok: false, message: 'The system cannot find the path specified.' };
    }
    const id = nid('file');
    this.nodes.set(id, {
      id,
      name: baseName(path),
      type: 'file',
      parentId: parent.id,
      createdAt: now,
      modifiedAt: now,
      content,
    });
    parent.modifiedAt = now;
    return { ok: true, path: this.nodePath(id), created: true };
  }

  rename(
    cwd: string,
    fromSpec: string,
    toName: string,
  ): { ok: true; path: string } | { ok: false; message: string } {
    const from = this.findByPath(resolvePath(cwd, fromSpec));
    if (!from) return { ok: false, message: 'The system cannot find the file specified.' };
    if (!toName || /[\\/:*?"<>|]/.test(toName)) {
      return { ok: false, message: 'The filename, directory name, or volume label syntax is incorrect.' };
    }
    if (!from.parentId) return { ok: false, message: 'Access is denied.' };
    const clash = this.findChild(from.parentId, toName);
    if (clash && clash.id !== from.id) {
      return { ok: false, message: `A duplicate file name exists, or the file cannot be found.` };
    }
    from.name = toName;
    from.modifiedAt = Date.now();
    return { ok: true, path: this.nodePath(from.id) };
  }

  copy(
    cwd: string,
    srcSpec: string,
    destSpec: string,
  ): { ok: true; path: string } | { ok: false; message: string } {
    const src = this.findByPath(resolvePath(cwd, srcSpec));
    if (!src) return { ok: false, message: 'The system cannot find the file specified.' };
    if (src.type === 'folder') {
      return { ok: false, message: `${displayPath(this.nodePath(src.id))} is a directory.` };
    }
    let destPath = resolvePath(cwd, destSpec);
    const destNode = this.findByPath(destPath);
    if (destNode?.type === 'folder') {
      destPath = joinPath([...splitPath(destPath), src.name]);
    }
    const written = this.writeFile(cwd, destPath, src.content ?? '');
    if (!written.ok) return written;
    return { ok: true, path: written.path };
  }

  move(
    cwd: string,
    srcSpec: string,
    destSpec: string,
  ): { ok: true; path: string } | { ok: false; message: string } {
    const src = this.findByPath(resolvePath(cwd, srcSpec));
    if (!src) return { ok: false, message: 'The system cannot find the file specified.' };
    if (!src.parentId) return { ok: false, message: 'Access is denied.' };
    let destPath = resolvePath(cwd, destSpec);
    const destNode = this.findByPath(destPath);
    if (destNode?.type === 'folder') {
      destPath = joinPath([...splitPath(destPath), src.name]);
    }
    const newParent = this.findByPath(parentPath(destPath));
    if (!newParent || newParent.type !== 'folder') {
      return { ok: false, message: 'The system cannot find the path specified.' };
    }
    const newName = baseName(destPath);
    const clash = this.findChild(newParent.id, newName);
    if (clash) return { ok: false, message: 'A duplicate file name exists, or the file cannot be found.' };
    if (src.type === 'folder' && this.isAncestor(src.id, newParent.id)) {
      return { ok: false, message: 'The process cannot access the file because it is being used by another process.' };
    }
    src.parentId = newParent.id;
    src.name = newName;
    src.modifiedAt = Date.now();
    newParent.modifiedAt = Date.now();
    return { ok: true, path: this.nodePath(src.id) };
  }

  private isAncestor(folderId: string, nodeId: string): boolean {
    let cur = this.nodes.get(nodeId);
    while (cur) {
      if (cur.id === folderId) return true;
      cur = cur.parentId ? this.nodes.get(cur.parentId) : undefined;
    }
    return false;
  }

  collectTree(id: string): FSNode[] {
    const out: FSNode[] = [];
    const walk = (nid: string) => {
      const node = this.nodes.get(nid);
      if (!node) return;
      out.push(node);
      if (node.type === 'folder') {
        for (const child of this.childrenOf(node.id)) walk(child.id);
      }
    };
    walk(id);
    return out;
  }

  recycleNode(id: string): { ok: true } | { ok: false; message: string } {
    const node = this.nodes.get(id);
    if (!node) return { ok: false, message: 'The system cannot find the file specified.' };
    if (!node.parentId) return { ok: false, message: 'Access is denied.' };
    const tree = this.collectTree(id).map((n) => ({ ...n }));
    const originalPath = this.nodePath(id);
    this.recycle.unshift({
      node: { ...node },
      children: tree.filter((n) => n.id !== id),
      originalParentId: node.parentId,
      originalPath,
      deletedAt: Date.now(),
    });
    for (const item of tree) this.nodes.delete(item.id);
    return { ok: true };
  }

  deletePath(
    cwd: string,
    spec: string,
    opts: { folder?: boolean; recursive?: boolean } = {},
  ): { ok: true; path: string } | { ok: false; message: string } {
    const node = this.findByPath(resolvePath(cwd, spec));
    if (!node) {
      return {
        ok: false,
        message: opts.folder
          ? 'The system cannot find the file specified.'
          : `Could Not Find ${displayPath(resolvePath(cwd, spec))}`,
      };
    }
    if (opts.folder) {
      if (node.type !== 'folder') {
        return { ok: false, message: 'The directory name is invalid.' };
      }
      const kids = this.childrenOf(node.id);
      if (kids.length && !opts.recursive) {
        return { ok: false, message: 'The directory is not empty.' };
      }
    } else if (node.type === 'folder') {
      return { ok: false, message: 'Access is denied.' };
    }
    const path = this.nodePath(node.id);
    const recycled = this.recycleNode(node.id);
    if (!recycled.ok) return recycled;
    return { ok: true, path };
  }

  restore(entryIndex: number): { ok: true; path: string } | { ok: false; message: string } {
    const entry = this.recycle[entryIndex];
    if (!entry) return { ok: false, message: 'That item is no longer in Recycle Bin.' };
    const parent = entry.originalParentId ? this.nodes.get(entry.originalParentId) : undefined;
    if (!parent) {
      return { ok: false, message: 'The original folder is gone. Restore into Student home instead from Explorer.' };
    }
    if (this.findChild(parent.id, entry.node.name)) {
      return { ok: false, message: `A file named ${entry.node.name} already exists in the original folder.` };
    }
    const restoreNode = (n: FSNode) => this.nodes.set(n.id, { ...n, modifiedAt: Date.now() });
    restoreNode(entry.node);
    for (const child of entry.children) restoreNode(child);
    this.recycle.splice(entryIndex, 1);
    return { ok: true, path: this.nodePath(entry.node.id) };
  }

  purge(entryIndex: number): void {
    if (entryIndex >= 0 && entryIndex < this.recycle.length) this.recycle.splice(entryIndex, 1);
  }

  emptyRecycle(): void {
    this.recycle = [];
  }

  cd(cwd: string, spec?: string): { ok: true; path: string } | { ok: false; message: string } {
    if (!spec) return { ok: true, path: canonicalize(cwd || HOME) };
    const path = resolvePath(cwd, spec);
    const node = this.findByPath(path);
    if (!node || node.type !== 'folder') {
      return { ok: false, message: 'The system cannot find the path specified.' };
    }
    return { ok: true, path: this.nodePath(node.id) };
  }

  completions(cwd: string, prefix: string): string[] {
    const node = this.findByPath(cwd);
    if (!node) return [];
    const p = prefix.toLowerCase();
    return this.childrenOf(node.id)
      .map((n) => n.name)
      .filter((name) => name.toLowerCase().startsWith(p));
  }
}

/** Simulated free space, fixed so the listing reads the same every time. */
const FREE_BYTES = 125_829_120_000;

export function formatDirListing(vfs: VirtualFileSystem, path: string): string {
  const node = vfs.findByPath(path);
  if (!node || node.type !== 'folder') return 'File Not Found';
  const items = vfs.childrenOf(node.id);
  const full = vfs.nodePath(node.id);
  const lines = [
    ' Volume in drive C has no label.',
    ' Volume Serial Number is 1A2B-3C4D',
    '',
    ` Directory of ${full}`,
    '',
  ];
  let files = 0;
  let dirs = 0;
  let bytes = 0;

  // Real cmd.exe lists the current and parent directory first.
  const selfStamp = formatStamp(node.modifiedAt);
  lines.push(`${selfStamp}    <DIR>          .`);
  dirs += 1;
  if (node.parentId) {
    lines.push(`${selfStamp}    <DIR>          ..`);
    dirs += 1;
  }

  for (const item of items) {
    const stamp = formatStamp(item.modifiedAt);
    if (item.type === 'folder') {
      dirs += 1;
      lines.push(`${stamp}    <DIR>          ${item.name}`);
    } else {
      files += 1;
      const size = (item.content ?? '').length;
      bytes += size;
      lines.push(`${stamp}            ${String(size).padStart(10, ' ')} ${item.name}`);
    }
  }

  lines.push(`               ${files} File(s) ${group(bytes).padStart(14, ' ')} bytes`);
  lines.push(`               ${dirs} Dir(s)  ${group(FREE_BYTES).padStart(14, ' ')} bytes free`);
  return lines.join('\n');
}

function group(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatLs(vfs: VirtualFileSystem, path: string): string {
  const items = vfs.list(path);
  if (!items.length) return '';
  return items.map((n) => (n.type === 'folder' ? `${n.name}\\` : n.name)).join('  ');
}

function formatStamp(ms: number): string {
  const d = new Date(ms);
  const date = d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${date}  ${time}`;
}

export function pathUnderHome(vfs: VirtualFileSystem, rel: string): boolean {
  return vfs.exists(`${HOME}\\${rel}`);
}
