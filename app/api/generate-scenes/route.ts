import { NextRequest, NextResponse } from "next/server";

interface Scene {
  number: number;
  description: string;
  dialogue: string;
  imagePrompt: string;
}

export async function POST(req: NextRequest) {
  try {
    const { screenplay } = await req.json();

    if (!screenplay) {
      return NextResponse.json({ error: "Screenplay is required" }, { status: 400 });
    }

    const scenes = parseScreenplayToScenes(screenplay);

    return NextResponse.json({ scenes });
  } catch (error) {
    console.error("Error generating scenes:", error);
    return NextResponse.json({ error: "Failed to generate scenes" }, { status: 500 });
  }
}

function parseScreenplayToScenes(screenplay: string): Scene[] {
  // In production, this would use AI to break down screenplay into visual scenes
  // For demo, we create structured scenes

  const sceneDescriptions = [
    {
      description: "Открывающий кадр: панорамный вид на мир истории, устанавливающий атмосферу",
      dialogue: "Начало великого путешествия...",
      imagePrompt: "cinematic wide shot of epic landscape, dramatic lighting, movie opening scene"
    },
    {
      description: "Знакомство с главным героем в его обычной жизни, до начала приключений",
      dialogue: "Это я, до того как все изменилось",
      imagePrompt: "close-up portrait of main character, thoughtful expression, cinematic lighting"
    },
    {
      description: "Встреча с наставником или получение призыва к приключению",
      dialogue: "Твоя судьба зовет тебя",
      imagePrompt: "two characters meeting, mysterious atmosphere, dramatic shadows"
    },
    {
      description: "Первое испытание или столкновение с опасностью",
      dialogue: "Нет пути назад!",
      imagePrompt: "action scene, dynamic movement, intense lighting, cinematic angle"
    },
    {
      description: "Момент сомнения и внутренней борьбы героя",
      dialogue: "Смогу ли я это сделать?",
      imagePrompt: "character in darkness, contemplative mood, emotional lighting"
    },
    {
      description: "Обретение силы и решимости продолжить путь",
      dialogue: "Я готов встретить свою судьбу",
      imagePrompt: "hero standing tall, empowering pose, sunrise lighting, epic composition"
    },
    {
      description: "Кульминационная битва или финальное противостояние",
      dialogue: "Сейчас решается все!",
      imagePrompt: "epic battle scene, dynamic action, dramatic lighting, wide cinematic shot"
    },
    {
      description: "Разрешение конфликта и новое начало",
      dialogue: "Это только начало...",
      imagePrompt: "peaceful ending scene, sunset, character looking toward horizon, hopeful mood"
    }
  ];

  return sceneDescriptions.map((scene, index) => ({
    number: index + 1,
    description: scene.description,
    dialogue: scene.dialogue,
    imagePrompt: scene.imagePrompt
  }));
}
