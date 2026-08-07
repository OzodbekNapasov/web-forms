import { useState, useCallback } from "react";
import { Survey } from "@/types/survey";

export function useUndoRedoStore(initialState: Survey) {
  const [history, setHistory] = useState<Survey[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const presentState = history[currentIndex] || initialState;

  const pushState = useCallback((nextState: Survey) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.slice(0, currentIndex + 1);
      return [...updatedHistory, nextState];
    });
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentIndex, history.length]);

  return {
    state: presentState,
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
