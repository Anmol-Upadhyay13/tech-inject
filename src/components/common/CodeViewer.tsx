import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: string;
  filename?: string;
  dependencies?: string[];
  maxHeight?: string;
  showLineNumbers?: boolean;
}

export function CodeViewer({
  code,
  language = 'tsx',
  filename,
  dependencies,
  maxHeight = '520px',
  showLineNumbers = true,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  // Lightweight high-fidelity syntax highlighter token parser
  const renderHighlightedLine = (line: string) => {
    // Comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return <span className="text-slate-400 italic">{line}</span>;
    }

    // Simple regex replacements for rich developer highlighting
    const parts = line.split(/(\b(?:import|from|export|default|const|let|var|function|return|interface|type|extends|as|boolean|string|number|any|void|true|false|null|undefined|typeof)\b|[<>/="'`{}[\]();,:])/g);

    return parts.map((part, idx) => {
      if (
        ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'return', 'interface', 'type', 'extends', 'as'].includes(part)
      ) {
        return <span key={idx} className="text-indigo-400 font-semibold">{part}</span>;
      }
      if (['boolean', 'string', 'number', 'any', 'void'].includes(part)) {
        return <span key={idx} className="text-emerald-400">{part}</span>;
      }
      if (['true', 'false', 'null', 'undefined'].includes(part)) {
        return <span key={idx} className="text-amber-400">{part}</span>;
      }
      if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`')) {
        return <span key={idx} className="text-emerald-300">{part}</span>;
      }
      if (/^[A-Z][a-zA-Z0-9]+$/.test(part)) {
        return <span key={idx} className="text-sky-300 font-medium">{part}</span>;
      }
      if (['<', '>', '/', '=', '{', '}', '(', ')', '[', ']'].includes(part)) {
        return <span key={idx} className="text-slate-400">{part}</span>;
      }
      return <span key={idx} className="text-slate-100">{part}</span>;
    });
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg text-slate-100">
      {/* Top File Tab Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          {filename?.endsWith('.sh') ? (
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span className="font-mono text-slate-300 font-medium">{filename || `example.${language}`}</span>
          <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {dependencies && dependencies.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="text-slate-400">Deps:</span>
              <span className="font-mono text-slate-300">{dependencies.join(', ')}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer font-medium text-xs shadow-2xs"
            aria-label="Copy source code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div
        className="overflow-x-auto p-4 text-xs font-mono leading-relaxed"
        style={{ maxHeight }}
      >
        <pre className="table w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-slate-900/40">
                {showLineNumbers && (
                  <td className="table-cell select-none pr-4 text-right text-slate-400 font-mono text-[11px] w-8 align-top">
                    {index + 1}
                  </td>
                )}
                <td className="table-cell whitespace-pre align-top">
                  {renderHighlightedLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </pre>
      </div>
    </div>
  );
}
