"use client";

import { useState } from "react";
import { Film, BookOpen, Users, Video, Clapperboard, Loader2 } from "lucide-react";

interface Character {
  name: string;
  description: string;
  role: string;
}

interface Scene {
  number: number;
  description: string;
  dialogue: string;
  imagePrompt: string;
}

interface MovieData {
  screenplay?: string;
  characters?: Character[];
  scenes?: Scene[];
  videoUrl?: string;
}

export default function Home() {
  const [bookTitle, setBookTitle] = useState("");
  const [stage, setStage] = useState<"input" | "screenplay" | "characters" | "scenes" | "video" | "complete">("input");
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<MovieData>({});
  const [progress, setProgress] = useState("");

  const generateMovie = async () => {
    if (!bookTitle.trim()) return;

    setLoading(true);
    setStage("screenplay");
    setProgress("Создаю сценарий по произведению...");

    try {
      // Generate screenplay
      const screenplayRes = await fetch("/api/generate-screenplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookTitle }),
      });
      const screenplayData = await screenplayRes.json();
      setMovieData((prev) => ({ ...prev, screenplay: screenplayData.screenplay }));

      setStage("characters");
      setProgress("Создаю персонажей...");

      // Generate characters
      const charactersRes = await fetch("/api/generate-characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookTitle, screenplay: screenplayData.screenplay }),
      });
      const charactersData = await charactersRes.json();
      setMovieData((prev) => ({ ...prev, characters: charactersData.characters }));

      setStage("scenes");
      setProgress("Создаю видео сцены...");

      // Generate scenes
      const scenesRes = await fetch("/api/generate-scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenplay: screenplayData.screenplay }),
      });
      const scenesData = await scenesRes.json();
      setMovieData((prev) => ({ ...prev, scenes: scenesData.scenes }));

      setStage("video");
      setProgress("Собираю фильм...");

      // Assemble movie
      const movieRes = await fetch("/api/assemble-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenes: scenesData.scenes,
          title: bookTitle
        }),
      });
      const movieResData = await movieRes.json();
      setMovieData((prev) => ({ ...prev, videoUrl: movieResData.videoUrl }));

      setStage("complete");
      setProgress("Фильм готов!");
    } catch (error) {
      console.error("Error generating movie:", error);
      setProgress("Произошла ошибка. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setBookTitle("");
    setStage("input");
    setMovieData({});
    setProgress("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Book to Movie AI</h1>
          </div>
          <p className="text-xl text-gray-300">
            Создайте полную экранизацию любого литературного произведения
          </p>
        </header>

        {stage === "input" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <label htmlFor="bookTitle" className="block text-lg font-semibold mb-3">
                Введите название произведения:
              </label>
              <input
                id="bookTitle"
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Например: Война и мир, 1984, Гарри Поттер..."
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyDown={(e) => e.key === "Enter" && generateMovie()}
              />
            </div>
            <button
              onClick={generateMovie}
              disabled={!bookTitle.trim() || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Clapperboard className="w-6 h-6" />
              Создать фильм
            </button>
          </div>
        )}

        {stage !== "input" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                {loading && <Loader2 className="w-6 h-6 animate-spin" />}
                Прогресс создания фильма
              </h2>
              <div className="space-y-4">
                <ProgressStep icon={<BookOpen />} label="Сценарий" active={stage === "screenplay"} completed={["characters", "scenes", "video", "complete"].includes(stage)} />
                <ProgressStep icon={<Users />} label="Персонажи" active={stage === "characters"} completed={["scenes", "video", "complete"].includes(stage)} />
                <ProgressStep icon={<Video />} label="Видео сцены" active={stage === "scenes"} completed={["video", "complete"].includes(stage)} />
                <ProgressStep icon={<Film />} label="Сборка фильма" active={stage === "video"} completed={stage === "complete"} />
              </div>
              {progress && (
                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <p className="text-center font-semibold">{progress}</p>
                </div>
              )}
            </div>

            {movieData.screenplay && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Сценарий
                </h3>
                <div className="bg-black/30 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{movieData.screenplay}</pre>
                </div>
              </div>
            )}

            {movieData.characters && movieData.characters.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  Персонажи
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {movieData.characters.map((char, idx) => (
                    <div key={idx} className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-bold text-lg text-purple-300">{char.name}</h4>
                      <p className="text-sm text-gray-400 mb-2">{char.role}</p>
                      <p className="text-sm">{char.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movieData.scenes && movieData.scenes.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Video className="w-6 h-6" />
                  Сцены ({movieData.scenes.length})
                </h3>
                <div className="space-y-4">
                  {movieData.scenes.slice(0, 5).map((scene) => (
                    <div key={scene.number} className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-bold text-purple-300 mb-2">Сцена {scene.number}</h4>
                      <p className="text-sm mb-2">{scene.description}</p>
                      {scene.dialogue && (
                        <p className="text-xs text-gray-400 italic">{scene.dialogue}</p>
                      )}
                    </div>
                  ))}
                  {movieData.scenes.length > 5 && (
                    <p className="text-center text-gray-400">... и еще {movieData.scenes.length - 5} сцен</p>
                  )}
                </div>
              </div>
            )}

            {stage === "complete" && movieData.videoUrl && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Film className="w-6 h-6" />
                  Готовый фильм
                </h3>
                <div className="bg-black rounded-lg overflow-hidden mb-4">
                  <video controls className="w-full" src={movieData.videoUrl}>
                    Ваш браузер не поддерживает воспроизведение видео.
                  </video>
                </div>
                <a
                  href={movieData.videoUrl}
                  download={`${bookTitle}-movie.mp4`}
                  className="block w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold text-center transition-all"
                >
                  Скачать фильм
                </a>
              </div>
            )}

            <button
              onClick={resetProcess}
              className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition-all"
            >
              Создать новый фильм
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressStep({ icon, label, active, completed }: { icon: React.ReactNode; label: string; active: boolean; completed: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${active ? "bg-purple-600/30 border-2 border-purple-400" : completed ? "bg-green-600/20 border-2 border-green-400" : "bg-gray-700/20"}`}>
      <div className={`w-8 h-8 flex items-center justify-center ${completed ? "text-green-400" : active ? "text-purple-400" : "text-gray-500"}`}>
        {icon}
      </div>
      <span className="font-semibold">{label}</span>
      {completed && <span className="ml-auto text-green-400">✓</span>}
      {active && !completed && <Loader2 className="ml-auto w-5 h-5 animate-spin text-purple-400" />}
    </div>
  );
}
