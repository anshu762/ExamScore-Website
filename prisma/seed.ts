import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const boards = [
    {
      code: "IB" as const,
      name: "International Baccalaureate",
      description:
        "The International Baccalaureate (IB) offers high-quality programs of international education to a worldwide community of schools.",
      levels: [
        { name: "MYP 5", order: 1 },
        { name: "DP1", order: 2 },
        { name: "DP2", order: 3 },
      ],
    },
    {
      code: "AP" as const,
      name: "Advanced Placement",
      description:
        "The Advanced Placement (AP) program enables students to take college-level courses and exams while still in high school.",
      levels: [{ name: "AP", order: 1 }],
    },
    {
      code: "CAMBRIDGE" as const,
      name: "Cambridge International",
      description:
        "Cambridge International prepares school students for life, helping them develop an informed curiosity and a lasting passion for learning.",
      levels: [
        { name: "IGCSE", order: 1 },
        { name: "AS Level", order: 2 },
        { name: "A Level", order: 3 },
      ],
    },
    {
      code: "CBSE" as const,
      name: "Central Board of Secondary Education",
      description:
        "CBSE is a national level board of education in India for public and private schools, controlled and managed by the Government of India.",
      levels: [
        { name: "Grade 9", order: 1 },
        { name: "Grade 10", order: 2 },
        { name: "Grade 11", order: 3 },
        { name: "Grade 12", order: 4 },
      ],
    },
    {
      code: "ICSE" as const,
      name: "Indian Certificate of Secondary Education",
      description:
        "ICSE is a private board of school education in India conducting the Indian Certificate of Secondary Education examination.",
      levels: [
        { name: "Grade 9", order: 1 },
        { name: "Grade 10", order: 2 },
      ],
    },
  ];

  const subjectsByBoard: Record<string, string[]> = {
    IB: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English Literature",
      "Economics",
      "Business",
      "History",
      "Geography",
      "Psychology",
      "Computer Science",
      "Sociology",
      "Environmental Systems",
    ],
    AP: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English Literature",
      "Economics",
      "Psychology",
      "History",
      "Computer Science",
      "Political Science",
      "Environmental Systems",
    ],
    CAMBRIDGE: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English Literature",
      "Economics",
      "Business",
      "History",
      "Geography",
      "Psychology",
      "Computer Science",
      "Sociology",
      "Political Science",
      "Environmental Systems",
    ],
    CBSE: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English Literature",
      "Economics",
      "History",
      "Geography",
      "Computer Science",
      "Political Science",
    ],
    ICSE: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English Literature",
      "Economics",
      "History",
      "Geography",
      "Computer Science",
    ],
  };

  for (const boardData of boards) {
    const board = await prisma.board.upsert({
      where: { code: boardData.code },
      update: {
        name: boardData.name,
        description: boardData.description,
      },
      create: {
        code: boardData.code,
        name: boardData.name,
        description: boardData.description,
      },
    });

    console.log(`Upserted board: ${board.name}`);

    for (const levelData of boardData.levels) {
      await prisma.academicLevel.upsert({
        where: {
          boardId_name: { boardId: board.id, name: levelData.name },
        },
        update: { order: levelData.order },
        create: {
          boardId: board.id,
          name: levelData.name,
          order: levelData.order,
        },
      });

      console.log(`  Upserted level: ${levelData.name}`);
    }

    const subjectNames = subjectsByBoard[boardData.code] ?? [];
    for (const subjectName of subjectNames) {
      const code = subjectName
        .toUpperCase()
        .replace(/\s+/g, "_")
        .replace(/[^A-Z_]/g, "");

      await prisma.subject.upsert({
        where: {
          boardId_code: { boardId: board.id, code },
        },
        update: { name: subjectName },
        create: {
          boardId: board.id,
          name: subjectName,
          code,
        },
      });

      console.log(`  Upserted subject: ${subjectName}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
