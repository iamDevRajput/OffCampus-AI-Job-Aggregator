import cron from "node-cron";
import { IngestionService } from "../src/services/ingestion.service";
import { prisma } from "../src/lib/prisma";

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/30 * * * *"; // Default every 30 minutes

console.log("=================================================");
console.log("🤖 OffCampus AI Job Ingestion Background Worker");
console.log(`⏱️ Schedule: ${CRON_SCHEDULE}`);
console.log(`🕒 Started at: ${new Date().toISOString()}`);
console.log("=================================================");

async function executeIngestionCycle() {
  console.log(`\n[${new Date().toLocaleTimeString()}] 🚀 Triggering automated job ingestion cycle...`);
  try {
    const summaries = await IngestionService.runIngestion();
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Ingestion cycle finished!`);

    let totalFetched = 0;
    let totalNew = 0;
    let totalUpdated = 0;

    for (const s of summaries) {
      totalFetched += s.fetchedCount;
      totalNew += s.newJobsCount;
      totalUpdated += s.updatedCount;
      console.log(
        `  -> [${s.sourceType}] ${s.sourceName}: Fetched ${s.fetchedCount}, New: ${s.newJobsCount}, Updated: ${s.updatedCount}, Errors: ${s.errors.length} (${s.durationMs}ms)`
      );
    }

    console.log(`📊 Summary: ${totalFetched} jobs checked | ${totalNew} new jobs added | ${totalUpdated} updated\n`);
  } catch (err: any) {
    console.error(`[${new Date().toLocaleTimeString()}] ❌ Ingestion cycle error:`, err);
  }
}

// 1. Run immediately on worker start
executeIngestionCycle();

// 2. Schedule recurring cron
const task = cron.schedule(CRON_SCHEDULE, () => {
  executeIngestionCycle();
});

// 3. Graceful shutdown
const handleExit = async (signal: string) => {
  console.log(`\nReceived ${signal}. Stopping worker cleanly...`);
  task.stop();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));
