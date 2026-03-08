"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const words = [
  { word: "stajyer", lang: "Turkish" },
  { word: "intern", lang: "English" },
  { word: "stagiaire", lang: "French" },
  { word: "praktikant", lang: "German" },
  { word: "実習生", lang: "Japanese" },
  { word: "인턴", lang: "Korean" },
  { word: "стажёр", lang: "Russian" },
  { word: "becario", lang: "Spanish" },
  { word: "estagiário", lang: "Portuguese" },
  { word: "tirocinante", lang: "Italian" },
];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block min-w-[200px] sm:min-w-[280px] text-center align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index].word}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="inline-block text-accent underline decoration-accent/40 decoration-2 underline-offset-8"
        >
          {words[index].word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
