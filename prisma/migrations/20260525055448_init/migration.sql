-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "BoardCode" AS ENUM ('IB', 'AP', 'CAMBRIDGE', 'CBSE', 'ICSE');

-- CreateEnum
CREATE TYPE "FolderItemType" AS ENUM ('QUESTION', 'FLASHCARD', 'NOTE', 'GRAPH');

-- CreateEnum
CREATE TYPE "FlashcardSource" AS ENUM ('AI_GENERATED', 'MANUAL');

-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "primaryBoard" "BoardCode",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "code" "BoardCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicLevel" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "AcademicLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "levelId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIResponse" (
    "id" TEXT NOT NULL,
    "questionSessionId" TEXT NOT NULL,
    "directAnswer" TEXT NOT NULL,
    "structureGuide" JSONB NOT NULL,
    "commonMistakes" JSONB NOT NULL,
    "visuals" JSONB NOT NULL,
    "rawProviderPayload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#0F3226',
    "icon" TEXT NOT NULL DEFAULT 'folder',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FolderItem" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "type" "FolderItemType" NOT NULL,
    "referenceId" TEXT NOT NULL,

    CONSTRAINT "FolderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "linkedSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "source" "FlashcardSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingQuiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "QuizStatus" NOT NULL DEFAULT 'PENDING',
    "answers" JSONB NOT NULL DEFAULT '{}',
    "resultProfile" JSONB NOT NULL DEFAULT '{}',
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "OnboardingQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamificationMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GamificationMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveUserCount" (
    "id" TEXT NOT NULL DEFAULT '1',
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveUserCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Board_code_key" ON "Board"("code");

-- CreateIndex
CREATE INDEX "AcademicLevel_boardId_idx" ON "AcademicLevel"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicLevel_boardId_name_key" ON "AcademicLevel"("boardId", "name");

-- CreateIndex
CREATE INDEX "Subject_boardId_idx" ON "Subject"("boardId");

-- CreateIndex
CREATE INDEX "Subject_levelId_idx" ON "Subject"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_boardId_code_key" ON "Subject"("boardId", "code");

-- CreateIndex
CREATE INDEX "QuestionSession_userId_idx" ON "QuestionSession"("userId");

-- CreateIndex
CREATE INDEX "QuestionSession_boardId_idx" ON "QuestionSession"("boardId");

-- CreateIndex
CREATE INDEX "QuestionSession_createdAt_idx" ON "QuestionSession"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AIResponse_questionSessionId_key" ON "AIResponse"("questionSessionId");

-- CreateIndex
CREATE INDEX "Folder_userId_idx" ON "Folder"("userId");

-- CreateIndex
CREATE INDEX "FolderItem_folderId_idx" ON "FolderItem"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "FolderItem_folderId_type_referenceId_key" ON "FolderItem"("folderId", "type", "referenceId");

-- CreateIndex
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- CreateIndex
CREATE INDEX "Flashcard_userId_idx" ON "Flashcard"("userId");

-- CreateIndex
CREATE INDEX "Flashcard_boardId_idx" ON "Flashcard"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingQuiz_userId_key" ON "OnboardingQuiz"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GamificationMetric_userId_key" ON "GamificationMetric"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "AcademicLevel" ADD CONSTRAINT "AcademicLevel_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "AcademicLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSession" ADD CONSTRAINT "QuestionSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSession" ADD CONSTRAINT "QuestionSession_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSession" ADD CONSTRAINT "QuestionSession_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "AcademicLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSession" ADD CONSTRAINT "QuestionSession_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIResponse" ADD CONSTRAINT "AIResponse_questionSessionId_fkey" FOREIGN KEY ("questionSessionId") REFERENCES "QuestionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderItem" ADD CONSTRAINT "FolderItem_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingQuiz" ADD CONSTRAINT "OnboardingQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamificationMetric" ADD CONSTRAINT "GamificationMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
