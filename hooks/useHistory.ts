"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface HistoryOptions {
  limit?: number;
  batchMs?: number;
}

interface SetStateOpts {
  batch?: boolean;
}

type SetStateFn<S> = (nextOrFn: S | ((prev: S) => S), opts?: SetStateOpts) => void;

interface HistoryControls {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistoryState<S>(
  initial: S,
  { limit = 60, batchMs = 500 }: HistoryOptions = {}
): [S, SetStateFn<S>, HistoryControls] {
  const [state, _setState] = useState<S>(initial);
  const past = useRef<S[]>([]);
  const future = useRef<S[]>([]);
  const lastCommitTs = useRef(0);
  const batchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPrev = useRef<S | null>(null);
  const [, force] = useState(0);

  const commit = useCallback((prev: S) => {
    past.current.push(prev);
    if (past.current.length > limit) past.current.shift();
    future.current = [];
    force((x) => x + 1);
  }, [limit]);

  const setState: SetStateFn<S> = useCallback((nextOrFn, opts = {}) => {
    _setState((prev) => {
      const next = typeof nextOrFn === "function" ? (nextOrFn as (p: S) => S)(prev) : nextOrFn;
      if (next === prev) return prev;
      const now = Date.now();
      if (opts.batch) {
        if (!batchTimer.current) {
          pendingPrev.current = prev;
        }
        clearTimeout(batchTimer.current!);
        batchTimer.current = setTimeout(() => {
          if (pendingPrev.current !== null) {
            commit(pendingPrev.current);
            pendingPrev.current = null;
          }
          batchTimer.current = null;
        }, batchMs);
      } else {
        if (batchTimer.current) {
          clearTimeout(batchTimer.current);
          batchTimer.current = null;
          if (pendingPrev.current !== null) {
            commit(pendingPrev.current);
            pendingPrev.current = null;
          }
        }
        commit(prev);
      }
      lastCommitTs.current = now;
      return next;
    });
  }, [commit, batchMs]);

  const undo = useCallback(() => {
    if (batchTimer.current) {
      clearTimeout(batchTimer.current);
      batchTimer.current = null;
      if (pendingPrev.current !== null) {
        commit(pendingPrev.current);
        pendingPrev.current = null;
      }
    }
    _setState((prev) => {
      if (past.current.length === 0) return prev;
      const last = past.current.pop()!;
      future.current.push(prev);
      force((x) => x + 1);
      return last;
    });
  }, [commit]);

  const redo = useCallback(() => {
    _setState((prev) => {
      if (future.current.length === 0) return prev;
      const next = future.current.pop()!;
      past.current.push(prev);
      force((x) => x + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditable = target?.isContentEditable || tag === "INPUT" || tag === "TEXTAREA";
      if (isEditable) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((e.key === "z" && e.shiftKey) || e.key === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  return [state, setState, {
    undo, redo,
    canUndo: past.current.length > 0 || pendingPrev.current !== null,
    canRedo: future.current.length > 0,
  }];
}
