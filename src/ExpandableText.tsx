import React from 'react';

export type Chunk = string | { word: string; expansion: Chunk[]; id: string };

interface ExpandableTextProps {
  chunks: Chunk[];
  onWordClick: (id: string) => void;
  highlightedWords?: { [id: string]: string }; // id -> color mapping
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ chunks, onWordClick, highlightedWords = {} }) => {
  return (
    <>
      {chunks.map((chunk, index) => {
        if (typeof chunk === 'string') {
          return (
            <span key={index} style={{ color: 'lightgrey' }}>
              {chunk}
            </span>
          );
        } else {
          const highlightColor = highlightedWords[chunk.id];
          return (
            <span
              key={chunk.id}
              onClick={() => onWordClick(chunk.id)}
              style={{
                color: highlightColor || 'white',
                textDecoration: 'underline',
                cursor: 'pointer',
                backgroundColor: highlightColor ? `${highlightColor}40` : 'transparent', // 40 = 25% opacity in hex
                padding: highlightColor ? '2px 4px' : '0',
                borderRadius: highlightColor ? '3px' : '0',
              }}
            >
              {chunk.word}
            </span>
          );
        }
      })}
    </>
  );
};

