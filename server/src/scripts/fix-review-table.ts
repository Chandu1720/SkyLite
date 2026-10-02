import prisma from '../config/database';

async function checkAndFixReviewTable() {
  const cols: any = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'Review' OR table_name = 'review';
  `);
  console.log('Current Review columns:', cols);

  const existingColNames = cols.map((c: any) => c.column_name);

  if (!existingColNames.includes('source')) {
    console.log('Adding column source...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "source" TEXT DEFAULT 'GOOGLE';`);
  }
  if (!existingColNames.includes('avatarUrl')) {
    console.log('Adding column avatarUrl...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;`);
  }
  if (!existingColNames.includes('relativeTime')) {
    console.log('Adding column relativeTime...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "relativeTime" TEXT;`);
  }
  if (!existingColNames.includes('googleReviewId')) {
    console.log('Adding column googleReviewId...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "googleReviewId" TEXT;`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Review_googleReviewId_key" ON "Review"("googleReviewId");`);
  }

  const updatedCols: any = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'Review' OR table_name = 'review';
  `);
  console.log('Updated Review columns:', updatedCols);

  process.exit(0);
}

checkAndFixReviewTable().catch(e => {
  console.error(e);
  process.exit(1);
});
