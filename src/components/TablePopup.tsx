"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ICOP_TABLES } from "@/lib/icop-tables";

interface TablePopupProps {
  tableId: string;
}

export function TablePopup({ tableId }: TablePopupProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const table = ICOP_TABLES[tableId];

  if (!table) {
    return <span className="font-mono text-xs">{tableId}</span>;
  }

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popupWidth = 480;
    let left = rect.left + rect.width / 2 - popupWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));
    let top = rect.top - 8;
    if (top < 200) {
      top = rect.bottom + 8;
    }
    setPosition({ top, left });
  }, []);

  function showPopup() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updatePosition();
    setVisible(true);
  }

  function hidePopup() {
    timeoutRef.current = setTimeout(() => setVisible(false), 200);
  }

  function keepOpen() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  const popupContent = visible && position && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={popupRef}
          className="fixed z-[9999] rounded-lg border bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
          style={{
            top: position.top,
            left: position.left,
            width: "480px",
            maxHeight: "400px",
            transform: "translateY(-100%)",
          }}
          onMouseEnter={keepOpen}
          onMouseLeave={hidePopup}
        >
          <div className="mb-2">
            <div className="text-sm font-bold">{tableId}: {table.title}</div>
            <div className="text-xs text-muted-foreground">{table.section}</div>
          </div>
          <div className="overflow-auto" style={{ maxHeight: "320px" }}>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  {table.headers.map((h, i) => (
                    <th
                      key={i}
                      className="sticky top-0 border border-gray-200 bg-gray-50 px-2 py-1 text-left font-semibold dark:border-gray-700 dark:bg-gray-800"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border border-gray-200 px-2 py-1 dark:border-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <span
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={showPopup}
      onMouseLeave={hidePopup}
    >
      <span className="cursor-help border-b border-dashed border-blue-500 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
        {tableId}
      </span>
      {popupContent}
    </span>
  );
}

export function parseTableReferences(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /Table \d+\.\d+/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<TablePopup key={match.index} tableId={match[0]} />);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
