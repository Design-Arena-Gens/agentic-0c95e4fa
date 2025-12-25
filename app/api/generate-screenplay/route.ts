import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { bookTitle } = await req.json();

    if (!bookTitle) {
      return NextResponse.json({ error: "Book title is required" }, { status: 400 });
    }

    // Simulated AI screenplay generation
    const screenplay = generateScreenplay(bookTitle);

    return NextResponse.json({ screenplay });
  } catch (error) {
    console.error("Error generating screenplay:", error);
    return NextResponse.json({ error: "Failed to generate screenplay" }, { status: 500 });
  }
}

function generateScreenplay(bookTitle: string): string {
  // In production, this would call OpenAI or Anthropic API
  // For demo purposes, we generate a structured screenplay

  const screenplays: { [key: string]: string } = {
    default: `ЭКРАНИЗАЦИЯ: ${bookTitle.toUpperCase()}

СЦЕНА 1 - НАЧАЛО
INT. ГЛАВНАЯ ЛОКАЦИЯ - ДЕНЬ

Камера медленно открывает мир истории. Мы видим главного героя в момент, который изменит его жизнь навсегда.

ГЛАВНЫЙ ГЕРОЙ
(задумчиво)
Это начало моего путешествия.

СЦЕНА 2 - ВСТРЕЧА С НАСТАВНИКОМ
EXT. ТАИНСТВЕННОЕ МЕСТО - ВЕЧЕР

Появляется мудрый наставник, который откроет герою глаза на истинную природу его мира.

НАСТАВНИК
Ты готов узнать правду?

ГЛАВНЫЙ ГЕРОЙ
Я всегда был готов.

СЦЕНА 3 - ИСПЫТАНИЕ
EXT. ОПАСНАЯ ТЕРРИТОРИЯ - ДЕНЬ

Герой сталкивается с первым серьезным испытанием. Напряжение достигает пика.

ГЛАВНЫЙ ГЕРОЙ
(решительно)
Я не отступлю!

СЦЕНА 4 - ТЕМНАЯ НОЧЬ ДУШИ
INT. УБЕЖИЩЕ - НОЧЬ

Момент отчаяния. Герой теряет надежду и сомневается в своих силах.

ГЛАВНЫЙ ГЕРОЙ
(с болью)
Может, я не тот, кто нужен...

СЦЕНА 5 - ВОЗРОЖДЕНИЕ
EXT. МЕСТО СИЛЫ - РАССВЕТ

Герой находит в себе силы продолжить. Музыка нарастает.

ГЛАВНЫЙ ГЕРОЙ
(с новой решимостью)
Я знаю, что должен сделать.

СЦЕНА 6 - ФИНАЛЬНАЯ БИТВА
EXT. КУЛЬМИНАЦИОННОЕ МЕСТО - ДЕНЬ

Эпическое противостояние. Все ставки на столе.

ГЛАВНЫЙ ГЕРОЙ
Это конец твоей тирании!

АНТАГОНИСТ
Ты ничего не понимаешь!

СЦЕНА 7 - РАЗРЕШЕНИЕ
EXT. МИРНАЯ ЛОКАЦИЯ - ЗАКАТ

Мир восстановлен. Герой изменился и вырос.

ГЛАВНЫЙ ГЕРОЙ
(размышляя)
Это было только начало новой истории.

КОНЕЦ

ТИТРЫ
Основано на произведении "${bookTitle}"`,
  };

  return screenplays[bookTitle.toLowerCase()] || screenplays.default;
}
