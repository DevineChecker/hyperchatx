import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Bot, User, Copy, Check, RotateCcw, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Message } from "@/lib/groq";
import { GROQ_MODELS } from "@/lib/groq";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function preprocessLatex(content: string): string {
  content = content.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `$$${inner}$$`);
  content = content.replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner}$`);
  return content;
}

interface ChatMessageProps {
  message: Message;
  index: number;
  onRollback?: (index: number) => void;
  onRegenerate?: (index: number, model: string) => void;
  currentModel?: string;
}

export function ChatMessage({ message, index, onRollback, onRegenerate, currentModel }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 py-4 px-4 ${isUser ? "" : "bg-card/50"}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser ? "bg-secondary" : "bg-primary/15"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-secondary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="prose-chat text-foreground text-[0.935rem]">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {preprocessLatex(message.content)}
            </ReactMarkdown>
          )}
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {!isUser && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          )}
          {onRollback && (
            <button
              onClick={() => onRollback(index)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Rollback to this message (remove all messages after)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rollback
            </button>
          )}
          {!isUser && onRegenerate && currentModel && (
            <div className="inline-flex items-center gap-1.5">
              <button
                onClick={() => onRegenerate(index, currentModel)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Regenerate with current model"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
              <Select
                onValueChange={(model) => onRegenerate(index, model)}
              >
                <SelectTrigger className="h-6 w-auto min-w-[120px] text-xs bg-secondary border-border text-muted-foreground px-2 py-0">
                  <SelectValue placeholder="Change model" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {GROQ_MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs focus:bg-secondary">
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 py-4 px-4 bg-card/50">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-primary/15">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex items-center gap-1 pt-2">
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
