import React from 'react';

/**
 * Parse markdown links and render them as clickable elements
 * Handles format: [text](url)
 */
export function renderMessageWithLinks(content: string): React.ReactNode {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = content.matchAll(linkPattern);
  const matchArray = Array.from(matches);

  if (matchArray.length === 0) {
    return content;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of matchArray) {
    const matchIndex = match.index ?? 0;

    // Add text before the link
    if (matchIndex > lastIndex) {
      parts.push(content.slice(lastIndex, matchIndex));
    }

    const [fullMatch, linkText, linkUrl] = match;

    // Create clickable link
    parts.push(
      <a
        key={matchIndex}
        href={linkUrl}
        className="text-chrono-blue hover:text-chrono-purple underline underline-offset-2 transition-colors"
        onClick={(e) => {
          // For internal coordinate links, navigate properly
          if (linkUrl.startsWith('/?')) {
            e.preventDefault();
            window.location.href = linkUrl;
          }
        }}
      >
        {linkText}
      </a>
    );

    lastIndex = matchIndex + fullMatch.length;
  }

  // Add remaining text after the last link
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}
