import { useEffect, useRef } from "react";
import { X, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogStore } from "@/store/useLogStore";
import { useServiceStore } from "@/store/useServiceStore";

interface LogViewerProps {
  className?: string;
}

export function LogViewer({ className }: LogViewerProps) {
  const { entries, activeServiceId, setActiveService, clearLogs, clearServiceLogs } =
    useLogStore();
  const { services } = useServiceStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  const filteredEntries = activeServiceId
    ? entries.filter((e) => e.serviceId === activeServiceId)
    : entries;

  useEffect(() => {
    if (autoScrollRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredEntries.length]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    autoScrollRef.current = atBottom;
  };

  const serviceName = activeServiceId
    ? services.find((s) => s.id === activeServiceId)?.label ?? activeServiceId
    : null;

  return (
    <div className={cn("flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {serviceName ? `Logs: ${serviceName}` : "All Logs"}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            ({filteredEntries.length})
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {activeServiceId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearServiceLogs(activeServiceId)}
              className="h-7 px-2 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
          {activeServiceId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveService(null)}
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              All
            </Button>
          )}
          {!activeServiceId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLogs}
              className="h-7 px-2 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed"
      >
        {filteredEntries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">No log output yet</p>
              <p className="text-xs mt-1 opacity-60">
                Click the Logs button on a service to view its output
              </p>
            </div>
          </div>
        ) : (
          filteredEntries.map((entry, i) => (
            <div key={i} className="flex gap-2 hover:bg-secondary/30 rounded px-1 py-px">
              <span className="text-muted-foreground flex-shrink-0 select-none">
                {entry.timestamp}
              </span>
              {!activeServiceId && (
                <span className="text-accent flex-shrink-0 select-none">
                  [{entry.serviceId.slice(0, 8)}]
                </span>
              )}
              <span className="whitespace-pre-wrap break-all text-foreground">
                {entry.line}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
