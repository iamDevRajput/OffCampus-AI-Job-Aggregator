import { IngestionService } from "../src/services/ingestion.service";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🚀 Starting Phase 3A Multi-Source Real Job Ingestion Test...\n");

  const start = Date.now();
  const summaries = await IngestionService.runIngestion({
    includePresets: true,
    includeMock: false,
  });

  const totalTime = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✨ Ingestion Completed in ${totalTime}s\n`);

  console.log("--------------------------------------------------------------------------------");
  console.log(
    "Source".padEnd(35) +
      "Type".padEnd(18) +
      "Fetched".padEnd(10) +
      "Created".padEnd(10) +
      "Updated".padEnd(10) +
      "Errors"
  );
  console.log("--------------------------------------------------------------------------------");

  let totalFetched = 0;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (const s of summaries) {
    totalFetched += s.fetchedCount;
    totalCreated += s.newJobsCount;
    totalUpdated += s.updatedCount;

    console.log(
      s.sourceName.slice(0, 33).padEnd(35) +
        s.sourceType.padEnd(18) +
        String(s.fetchedCount).padEnd(10) +
        String(s.newJobsCount).padEnd(10) +
        String(s.updatedCount).padEnd(10) +
        (s.errors.length > 0 ? `${s.errors.length} errs` : "0")
    );
  }

  console.log("--------------------------------------------------------------------------------");
  console.log(
    "TOTALS".padEnd(53) +
      String(totalFetched).padEnd(10) +
      String(totalCreated).padEnd(10) +
      String(totalUpdated)
  );
  console.log("--------------------------------------------------------------------------------\n");

  const totalInDb = await prisma.job.count();
  const activeInDb = await prisma.job.count({ where: { status: "ACTIVE" } });
  const priorityInDb = await prisma.job.count({ where: { isPriorityCompany: true } });
  const distinctCompanies = await prisma.job.groupBy({
    by: ["normalizedCompany"],
  });

  console.log(`📊 Current Database Stats:`);
  console.log(`- Total Real Jobs Stored: ${totalInDb}`);
  console.log(`- Active Jobs: ${activeInDb}`);
  console.log(`- Priority/Target Company Jobs: ${priorityInDb}`);
  console.log(`- Distinct Companies Discovered: ${distinctCompanies.length}`);
}

main()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
