import React, { useState, useRef, useEffect } from 'react';
import { ExpandableText, type Chunk } from './ExpandableText';

interface Column {
  id: string;
  word?: string; // The word text that opened this column
  chunks: Chunk[];
  highlightColor: string;
  parentWordId?: string; // ID of the word that opened this column
}

interface ColumnViewProps {
  rootChunks: Chunk[];
}

// Helper function to find a chunk by ID recursively
const findChunkById = (chunks: Chunk[], id: string): Chunk | null => {
  for (const chunk of chunks) {
    if (typeof chunk !== 'string' && chunk.id === id) {
      return chunk;
    }
    if (typeof chunk !== 'string' && chunk.expansion) {
      const found = findChunkById(chunk.expansion, id);
      if (found) return found;
    }
  }
  return null;
};

// Generate a highlight color based on column index
const generateHighlightColor = (index: number): string => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];
  return colors[index % colors.length];
};

export const ColumnView: React.FC<ColumnViewProps> = ({ rootChunks }) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'root', chunks: rootChunks, highlightColor: '#3b82f6' },
  ]);
  const [expansionHistory, setExpansionHistory] = useState<Map<string, string[]>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent scrolling left past the root column
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollLeft < 0) {
        container.scrollLeft = 0;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Find all chunks across all columns to search for clicked word
  const findChunkInColumns = (id: string, columnIndex: number): Chunk | null => {
    // Search in the column where the click happened
    return findChunkById(columns[columnIndex].chunks, id);
  };

  // Helper function to get the chain of parentWordIds from a column index onward
  const getExpansionChain = (fromIndex: number): string[] => {
    return columns.slice(fromIndex).map(col => col.parentWordId).filter(Boolean) as string[];
  };

  // Helper function to restore a chain: given a starting column's chunks and a list of word ids, recursively find each chunk and build the columns array
  const restoreChain = (startingChunks: Chunk[], chain: string[], startColumnIndex: number): Column[] => {
    const restoredColumns: Column[] = [];
    let currentChunks = startingChunks;
    let currentColumnIndex = startColumnIndex;

    for (const wordId of chain) {
      const chunk = findChunkById(currentChunks, wordId);
      if (!chunk || typeof chunk === 'string') break;
      if (!chunk.expansion || chunk.expansion.length === 0) break;

      currentColumnIndex++;
      const highlightColor = generateHighlightColor(currentColumnIndex);

      restoredColumns.push({
        id: chunk.id,
        word: chunk.word,
        chunks: chunk.expansion,
        highlightColor,
        parentWordId: wordId,
      });

      currentChunks = chunk.expansion;
    }

    return restoredColumns;
  };

  const handleWordClick = (id: string, columnIndex: number) => {
    const chunk = findChunkInColumns(id, columnIndex);
    
    if (!chunk || typeof chunk === 'string') return;
    
    if (!chunk.expansion || chunk.expansion.length === 0) return;

    // Check if the clicked word already has a column open to its right
    const nextColumn = columns[columnIndex + 1];
    if (nextColumn?.parentWordId === id) {
      // Save the current chain of parentWordIds from columnIndex+1 onward into expansionHistory
      const chain = getExpansionChain(columnIndex + 1);
      setExpansionHistory(prev => {
        const newMap = new Map(prev);
        newMap.set(id, chain);
        return newMap;
      });

      // Close all columns to the right
      const newColumns = columns.slice(0, columnIndex + 1);
      setColumns(newColumns);
      return;
    }

    // Check if clicking a word that has saved history
    const savedChain = expansionHistory.get(id);
    if (savedChain && savedChain.length > 0) {
      // Restore the full chain: open the clicked word's expansion, then recursively open each saved word in the chain
      const newColumns = columns.slice(0, columnIndex + 1);
      
      // Add the first column (the clicked word's expansion)
      const newColumnIndex = columnIndex + 1;
      const highlightColor = generateHighlightColor(newColumnIndex);
      newColumns.push({
        id: chunk.id,
        word: chunk.word,
        chunks: chunk.expansion,
        highlightColor,
        parentWordId: id,
      });

      // Restore the rest of the chain
      const restoredColumns = restoreChain(chunk.expansion, savedChain, newColumnIndex);
      newColumns.push(...restoredColumns);

      setColumns(newColumns);

      // Clear that history entry after restoring
      setExpansionHistory(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });

      // Scroll to show the restored columns
      setTimeout(() => {
        if (containerRef.current) {
          const scrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
          containerRef.current.scrollTo({
            left: scrollLeft,
            behavior: 'smooth',
          });
        }
      }, 0);
      return;
    }

    // Normal new click: close columns to right, open new column
    const newColumnIndex = columnIndex + 1;
    const highlightColor = generateHighlightColor(newColumnIndex);

    // Replace all columns to the right of the clicked column
    const newColumns = columns.slice(0, columnIndex + 1);
    
    // Add the new column with the expansion
    newColumns.push({
      id: chunk.id,
      word: chunk.word, // Store the word text
      chunks: chunk.expansion,
      highlightColor,
      parentWordId: id, // Track which word opened this column
    });

    setColumns(newColumns);

    // Scroll to show the new column
    setTimeout(() => {
      if (containerRef.current) {
        const scrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
        containerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    }, 0);
  };

  // Build highlighted words map for a column: word ID -> highlight color
  // Words are highlighted in the column where they were clicked (which opened the next column)
  const getHighlightedWords = (columnIndex: number): { [id: string]: string } => {
    const highlightedWords: { [id: string]: string } = {};
    
    // Only check the immediate next column (if it exists)
    const nextColumnIndex = columnIndex + 1;
    if (nextColumnIndex < columns.length) {
      const nextColumn = columns[nextColumnIndex];
      if (nextColumn.parentWordId) {
        // Check if this word exists in the current column
        const wordExists = findChunkById(columns[columnIndex].chunks, nextColumn.parentWordId);
        if (wordExists) {
          highlightedWords[nextColumn.parentWordId] = nextColumn.highlightColor;
        }
      }
    }
    
    return highlightedWords;
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        height: '100vh',
        padding: '20px',
        gap: '20px',
        alignItems: 'flex-start',
      }}
    >
      {columns.map((column, index) => (
        <div
          key={column.id}
          style={{
            minWidth: '300px',
            maxWidth: '400px',
            padding: '20px',
            backgroundColor: `${column.highlightColor}15`, // 15 = ~8% opacity
            borderRadius: '8px',
            border: `1px solid ${column.highlightColor}30`, // 30 = ~19% opacity
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {index > 0 && (
            <div style={{ fontWeight: 'bold', color: column.highlightColor, marginBottom: '12px' }}>
              {column.word}
            </div>
          )}
          <div style={{ lineHeight: 1.6 }}>
            <ExpandableText
              chunks={column.chunks}
              onWordClick={(id) => handleWordClick(id, index)}
              highlightedWords={getHighlightedWords(index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

