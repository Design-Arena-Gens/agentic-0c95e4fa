import { NextRequest, NextResponse } from "next/server";

interface Character {
  name: string;
  description: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const { bookTitle, screenplay } = await req.json();

    if (!bookTitle || !screenplay) {
      return NextResponse.json({ error: "Book title and screenplay are required" }, { status: 400 });
    }

    const characters = generateCharacters(bookTitle, screenplay);

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Error generating characters:", error);
    return NextResponse.json({ error: "Failed to generate characters" }, { status: 500 });
  }
}

function generateCharacters(bookTitle: string, screenplay: string): Character[] {
  // In production, this would analyze the screenplay with AI
  // For demo, we generate archetypal characters

  return [
    {
      name: "Главный Герой",
      role: "Протагонист",
      description: "Храбрый и решительный персонаж, который проходит путь трансформации от обычного человека до героя. Борется со своими внутренними демонами и внешними врагами."
    },
    {
      name: "Наставник",
      role: "Мудрый учитель",
      description: "Опытный и мудрый персонаж, который направляет главного героя на его пути. Обладает знаниями о древних тайнах и секретах мира."
    },
    {
      name: "Антагонист",
      role: "Главный злодей",
      description: "Могущественный противник с собственными мотивами и философией. Представляет темную сторону и вызов, который должен преодолеть герой."
    },
    {
      name: "Союзник",
      role: "Верный друг",
      description: "Преданный спутник героя, который поддерживает его в трудные моменты. Приносит легкость и человечность в историю."
    },
    {
      name: "Таинственная Фигура",
      role: "Катализатор",
      description: "Загадочный персонаж, чьи действия запускают цепь событий. Его истинные намерения раскрываются только в финале."
    }
  ];
}
