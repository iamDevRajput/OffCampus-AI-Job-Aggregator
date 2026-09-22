import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CompanyConnectionService } from "@/services/company-connection.service";
import { ConnectionStatus } from "@prisma/client";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id },
          { companyId: id.toUpperCase() },
          { slug: id.toLowerCase() },
        ],
      },
      include: {
        connections: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: `Company "${id}" not found.` }, { status: 404 });
    }

    const connectedAts = company.connections.find((c) => c.status === ConnectionStatus.CONNECTED);

    if (!connectedAts) {
      return NextResponse.json({
        success: false,
        isExternal: true,
        message: "Automatic ingestion is not available for this career page.",
        careerUrl: company.careerUrl,
      });
    }

    // Run real ATS ingestion via IngestionService
    const result = await CompanyConnectionService.syncCompany(company.id);

    return NextResponse.json({
      success: result.success,
      isExternal: false,
      message: `Successfully synchronized jobs for ${company.name}`,
      summary: result.summary,
      activeJobs: result.activeJobs,
    });
  } catch (err: any) {
    console.error("[Company Refresh API] Error:", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to refresh company jobs",
    }, { status: 500 });
  }
}
