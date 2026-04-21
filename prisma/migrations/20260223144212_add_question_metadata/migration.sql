-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "examBoard" TEXT,
ADD COLUMN     "questionType" TEXT;

-- CreateIndex
CREATE INDEX "Question_examBoard_idx" ON "Question"("examBoard");

-- CreateIndex
CREATE INDEX "Question_ageRange_idx" ON "Question"("ageRange");
