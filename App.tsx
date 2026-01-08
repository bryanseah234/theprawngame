import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Settings,
  Play,
  Sparkles,
  Heart,
  Users,
  Zap,
} from "lucide-react";
import { QUESTIONS } from "./constants";
import { Question, ViewState, Theme, CardSetOption } from "./types";
import { Button } from "./components/Button";
import { GameCard } from "./components/GameCard";

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const DEFAULT_CARD_SETS: CardSetOption[] = [
  {
    id: "Wildcards",
    name: "Wildcards",
    description: "Fun action prompts & dares",
    enabled: true,
  },
  {
    id: "Deep Questions",
    name: "Deep Questions",
    description: "Thought-provoking conversation starters",
    enabled: true,
  },
  {
    id: "Relationships",
    name: "Relationships",
    description: "Questions about connections & love",
    enabled: true,
  },
  {
    id: "Self Reflection",
    name: "Self Reflection",
    description: "Questions to understand yourself better",
    enabled: true,
  },
];

const getIconForCardSet = (id: string) => {
  switch (id) {
    case "Wildcards":
      return <Sparkles size={18} />;
    case "Deep Questions":
      return <Zap size={18} />;
    case "Relationships":
      return <Heart size={18} />;
    case "Self Reflection":
      return <Users size={18} />;
    default:
      return <Sparkles size={18} />;
  }
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("classic");
  const [view, setView] = useState<ViewState>("splash");
  const [cardSets, setCardSets] = useState<CardSetOption[]>(DEFAULT_CARD_SETS);
  const [deck, setDeck] = useState<Question[]>([]);
  const [history, setHistory] = useState<Question[]>([]);
  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (theme === "midnight") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#0a0a0a";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#F5F5F5";
    }
  }, [theme]);

  const initializeDeck = useCallback(() => {
    const enabledCategories = cardSets
      .filter((s) => s.enabled)
      .map((s) => s.id);

    let filtered = QUESTIONS.filter((q) => {
      if (q.category) {
        return enabledCategories.includes(q.category);
      }
      if (q.wildcard && enabledCategories.includes("Wildcards")) {
        return true;
      }
      return enabledCategories.length > 0;
    });

    const shuffled = shuffleArray(filtered);
    const first = shuffled.pop() || null;

    setDeck(shuffled);
    setCurrentCard(first);
    setHistory([]);
    setIsFlipped(false);
  }, [cardSets]);

  const startGame = () => {
    initializeDeck();
    setView("game");
  };

  const toggleCardSet = (id: string) => {
    setCardSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, enabled: !set.enabled } : set,
      ),
    );
  };

  const nextCard = () => {
    if (!currentCard) return;

    setHistory((prev) => [...prev, currentCard]);

    if (deck.length > 0) {
      const nextDeck = [...deck];
      const next = nextDeck.pop() || null;
      setDeck(nextDeck);
      setCurrentCard(next);
      setIsFlipped(false);
    } else {
      setCurrentCard(null);
    }
  };

  const prevCard = () => {
    if (history.length === 0) return;

    const previousHistory = [...history];
    const previousCard = previousHistory.pop();
    setHistory(previousHistory);

    if (currentCard) {
      setDeck((prev) => [...prev, currentCard]);
    }

    setCurrentCard(previousCard || null);
    setIsFlipped(false);
  };

  useEffect(() => {
    if (view === "game") {
      initializeDeck();
    }
  }, [cardSets]);

  const hasEnabledCardSet = cardSets.some((set) => set.enabled);

  return (
    <div
      className={`min-h-screen min-h-[100dvh] w-full overflow-y-auto overflow-x-hidden flex flex-col transition-colors duration-500 hide-scrollbar ${theme === "classic" ? "text-black bg-[#F5F5F5]" : "text-white bg-[#0a0a0a]"}`}
    >
      <header className="h-14 sm:h-16 shrink-0 sticky top-0 z-20 flex items-center justify-center px-4 backdrop-blur-sm bg-inherit">
        <span
          className={`font-bold text-lg sm:text-xl tracking-tighter text-center ${theme === "classic" ? "text-wnrs-red" : "text-white"}`}
        >
          THE PRAWN GAME
        </span>

        <div className="absolute right-4 flex items-center gap-2">
          {view === "game" && (
            <Button variant="icon" onClick={() => setView("splash")}>
              <Settings size={18} className="sm:w-5 sm:h-5" />
            </Button>
          )}
          <Button
            variant="icon"
            onClick={() =>
              setTheme((prev) => (prev === "classic" ? "midnight" : "classic"))
            }
          >
            {theme === "classic" ? (
              <Moon size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <Sun size={18} className="sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          {view === "splash" && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center w-full max-w-md mx-auto px-4 sm:px-6 py-6"
            >
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Card Options
                  </h2>
                  <p className="opacity-60 text-sm sm:text-base">
                    Choose which card sets to include in the game.
                  </p>
                </div>

                <div className="w-full space-y-2 sm:space-y-3">
                  {cardSets.map((cardSet) => (
                    <motion.div
                      key={cardSet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 sm:p-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer
                        ${theme === "classic" ? "bg-gray-100 hover:bg-gray-200" : "bg-wnrs-darkgrey hover:bg-gray-800"}`}
                      onClick={() => toggleCardSet(cardSet.id)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                            cardSet.enabled
                              ? "bg-wnrs-red text-white"
                              : theme === "classic"
                                ? "bg-gray-300 text-gray-500"
                                : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {getIconForCardSet(cardSet.id)}
                        </div>
                        <div>
                          <span className="font-medium block text-sm sm:text-base">
                            {cardSet.name}
                          </span>
                          <span className="text-xs opacity-60 hidden sm:block">
                            {cardSet.description}
                          </span>
                        </div>
                      </div>

                      <button
                        className={`w-10 sm:w-12 h-6 sm:h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2
                          ${
                            cardSet.enabled
                              ? theme === "classic"
                                ? "bg-wnrs-red"
                                : "bg-white"
                              : "bg-gray-400"
                          }`}
                      >
                        <motion.div
                          className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-5 h-5 bg-white rounded-full shadow-sm"
                          animate={{ x: cardSet.enabled ? 16 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          style={{
                            backgroundColor:
                              cardSet.enabled && theme === "midnight"
                                ? "black"
                                : "white",
                          }}
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="w-full mt-6 sm:mt-8 pb-safe">
                <Button
                  fullWidth
                  onClick={startGame}
                  disabled={!hasEnabledCardSet}
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Game <Play size={18} fill="currentColor" />
                  </span>
                </Button>
              </div>
            </motion.div>
          )}

          {view === "game" && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
            >
              <div className="flex-1 flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
                <GameCard
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped((prev) => !prev)}
                  theme={theme}
                />
              </div>

              <div className="shrink-0 w-full py-4 sm:py-6 pb-safe">
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <Button
                    variant="icon"
                    onClick={prevCard}
                    disabled={history.length === 0}
                    className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border border-current opacity-80 hover:opacity-100 disabled:opacity-20 flex items-center justify-center"
                  >
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                  </Button>

                  <div className="text-center min-w-[60px]">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-40">
                      {deck.length} Left
                    </span>
                  </div>

                  <Button
                    variant="icon"
                    onClick={nextCard}
                    className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor:
                        theme === "classic" ? "#C31C23" : "#FFFFFF",
                      color: theme === "classic" ? "#FFFFFF" : "#000000",
                    }}
                  >
                    <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
