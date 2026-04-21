import { prisma } from "./db";

export async function updateDifficulty(
  childId: string,
  topicId: string,
  isCorrect: boolean
): Promise<number> {
  const record = await prisma.childTopicDifficulty.upsert({
    where: { childId_topicId: { childId, topicId } },
    create: { childId, topicId, currentLevel: 3 },
    update: {},
  });

  let { currentLevel, consecutiveCorrect, consecutiveWrong } = record;

  if (isCorrect) {
    consecutiveCorrect++;
    consecutiveWrong = 0;
    if (consecutiveCorrect >= 2 && currentLevel < 5) {
      currentLevel++;
      consecutiveCorrect = 0;
    }
  } else {
    consecutiveWrong++;
    consecutiveCorrect = 0;
    if (consecutiveWrong >= 2 && currentLevel > 1) {
      currentLevel--;
      consecutiveWrong = 0;
    }
  }

  await prisma.childTopicDifficulty.update({
    where: { id: record.id },
    data: { currentLevel, consecutiveCorrect, consecutiveWrong },
  });

  return currentLevel;
}

export async function getCurrentDifficulty(
  childId: string,
  topicId: string
): Promise<number> {
  const record = await prisma.childTopicDifficulty.findUnique({
    where: { childId_topicId: { childId, topicId } },
  });
  return record?.currentLevel ?? 3;
}
