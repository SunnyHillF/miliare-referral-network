import { generateClient } from "aws-amplify/data";
import type { Schema } from "./resource";

// Use API key authentication for seed scripts
const client = generateClient<Schema>({
  authMode: "apiKey",
});

export async function seedData() {
  console.log("🌱 Starting data seeding...");

  try {
    // Create test companies based on companyMeta.tsx
    const companies = [
      {
        companyName: "Sunny Hill Financial",
        contactEmail: "admin@sunnyhillfinancial.com",
        website: "https://sunnyhillfinancial.com",
        status: "ACTIVE",
        description:
          "Comprehensive financial planning, investment, and retirement services",
        compensation: {
          agentPercentage: 45.0,
          teamLeadPercentage: 8.0,
          orgLeadPercentage: 5.0,
          bonusPoolPercentage: 15.0,
          mrnPercentage: 20.0,
          contracterPercentage: 7.0,
        },
        trainingLinks: [
          "https://sunnyhillfinancial.com/training/financial-planning",
          "https://sunnyhillfinancial.com/training/investment-basics",
        ],
        orgId: "ORG-SUNNY-001",
        webhookApiKeyHash: "test-webhook-hash-sunny",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyName: "Prime Corporate Services",
        contactEmail: "contact@primecorporateservices.com",
        website: "https://www.primecorporateservices.com",
        status: "ACTIVE",
        description:
          "Business services including tax preparation, bookkeeping, and estate planning",
        compensation: {
          agentPercentage: 50.0,
          teamLeadPercentage: 10.0,
          orgLeadPercentage: 6.0,
          bonusPoolPercentage: 12.0,
          mrnPercentage: 18.0,
          contracterPercentage: 4.0,
        },
        trainingLinks: [
          "https://www.primecorporateservices.com/training/business-services",
          "https://www.primecorporateservices.com/training/tax-preparation",
        ],
        orgId: "ORG-PRIME-002",
        webhookApiKeyHash: "test-webhook-hash-prime",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyName: "ANCO Insurance",
        contactEmail: "info@anco.com",
        website: "https://www.anco.com",
        status: "ACTIVE",
        description:
          "Insurance solutions including employee benefits and business insurance",
        compensation: {
          agentPercentage: 48.0,
          teamLeadPercentage: 9.0,
          orgLeadPercentage: 5.5,
          bonusPoolPercentage: 20.0,
          mrnPercentage: 15.0,
          contracterPercentage: 2.5,
        },
        trainingLinks: ["https://www.anco.com/training/insurance-basics"],
        orgId: "ORG-ANCO-003",
        webhookApiKeyHash: "test-webhook-hash-anco",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyName: "Weightless Financial",
        contactEmail: "support@weightlessfinancial.com",
        website: "https://weightlessfinancial.com",
        status: "ACTIVE",
        description:
          "Debt resolution, financial education, and credit repair services",
        compensation: {
          agentPercentage: 42.0,
          teamLeadPercentage: 12.0,
          orgLeadPercentage: 8.0,
          bonusPoolPercentage: 18.0,
          mrnPercentage: 15.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [
          "https://weightlessfinancial.com/training/debt-resolution",
        ],
        orgId: "ORG-WEIGHTLESS-004",
        webhookApiKeyHash: "test-webhook-hash-weightless",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyName: "Summit Retirement Plans",
        contactEmail: "admin@summitretirement.com",
        website: "https://summitretirement.com",
        status: "ACTIVE",
        description: "401k, retirement plans, and employee benefits specialist",
        compensation: {
          agentPercentage: 52.0,
          teamLeadPercentage: 12.0,
          orgLeadPercentage: 6.0,
          bonusPoolPercentage: 25.0,
          mrnPercentage: 20.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [
          "https://summitretirement.com/training/401k-basics",
          "https://summitretirement.com/training/employee-benefits",
        ],
        orgId: "ORG-SUMMIT-005",
        webhookApiKeyHash: "test-webhook-hash-summit",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyName: "Wellness for the Workforce",
        contactEmail: "contact@wellnessfortheworkforce.com",
        website: "https://wellnessfortheworkforce.com",
        status: "ACTIVE",
        description:
          "Healthcare, wellness programs, and employee benefits solutions",
        compensation: {
          agentPercentage: 40.0,
          teamLeadPercentage: 10.0,
          orgLeadPercentage: 7.0,
          bonusPoolPercentage: 20.0,
          mrnPercentage: 18.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [],
        orgId: "ORG-WELLNESS-006",
        webhookApiKeyHash: "test-webhook-hash-wellness",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyName: "Impact Health Sharing",
        contactEmail: "info@impacthealthsharing.com",
        website: "https://www.impacthealthsharing.com",
        status: "ACTIVE",
        description:
          "Health sharing and healthcare alternative solutions for medical cost sharing",
        compensation: {
          agentPercentage: 45.0,
          teamLeadPercentage: 8.0,
          orgLeadPercentage: 5.0,
          bonusPoolPercentage: 22.0,
          mrnPercentage: 15.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [
          "https://www.impacthealthsharing.com/training/health-sharing-basics",
          "https://www.impacthealthsharing.com/training/medical-cost-sharing",
        ],
        orgId: "ORG-IMPACT-007",
        webhookApiKeyHash: "test-webhook-hash-impact",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    console.log("📊 Creating companies...");
    const createdCompanies = [];
    for (const companyData of companies) {
      const { data: company } = await client.models.Company.create(companyData);
      if (company) {
        createdCompanies.push(company);
        console.log(`✅ Created company: ${company.companyName}`);
      }
    }

    // Create test users (Note: These will be created in DynamoDB, but you'll need to create Cognito users separately)
    // We'll let DynamoDB auto-generate IDs and then update referrals with the actual IDs
    const users = [
      {
        name: "John Admin",
        email: "admin@test.com",
        phone: "+1234567890",
        address: "123 Admin Street, Admin City, AC 12345",
        teamId: "TEAM-ADMIN-001",
        teamLead: false,
        teamLeadId: null,
        orgLeadId: null,
        companyId: createdCompanies[0]?.id || "default-company-id",
        bankInfoDocument: null,
        taxDocument: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: "Jane Agent",
        email: "agent@test.com",
        phone: "+1234567891",
        address: "456 Agent Avenue, Agent City, AC 12346",
        teamId: "TEAM-SALES-001",
        teamLead: false,
        teamLeadId: null,
        orgLeadId: null,
        companyId: createdCompanies[0]?.id || "default-company-id",
        bankInfoDocument: null,
        taxDocument: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: "Mike TeamLead",
        email: "teamlead@test.com",
        phone: "+1234567892",
        address: "789 Lead Lane, Lead City, LC 12347",
        teamId: "TEAM-SALES-001",
        teamLead: true,
        teamLeadId: null,
        orgLeadId: null,
        companyId: createdCompanies[0]?.id || "default-company-id",
        bankInfoDocument: null,
        taxDocument: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: "Sarah OrgLead",
        email: "orglead@test.com",
        phone: "+1234567893",
        address: "321 Organization Blvd, Org City, OC 12348",
        teamId: "TEAM-LEADERSHIP-001",
        teamLead: true,
        teamLeadId: null,
        orgLeadId: null,
        companyId: createdCompanies[0]?.id || "default-company-id",
        bankInfoDocument: null,
        taxDocument: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    console.log("👥 Creating users...");
    const createdUsers = [];
    for (const userData of users) {
      const { data: user } = await client.models.User.create(userData);
      if (user) {
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      }
    }

    // Training resources for each company
    const trainingResources = [
      {
        companyId: createdCompanies[0]?.id || "default-company-id",
        title: "Getting Started Guide",
        type: "document" as const,
        url: "https://sunnyhillfinancial.com/training/start",
        duration: "10 min",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[0]?.id || "default-company-id",
        title: "Intro Video",
        type: "video" as const,
        url: "https://sunnyhillfinancial.com/training/intro",
        duration: "5:30",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[1]?.id || "default-company-id",
        title: "Business Formation Basics",
        type: "document" as const,
        url: "https://www.primecorporateservices.com/training/business-basics",
        duration: "8 min",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[1]?.id || "default-company-id",
        title: "Prime Services Overview",
        type: "video" as const,
        url: "https://www.primecorporateservices.com/training/overview",
        duration: "6:00",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    console.log("🎬 Creating training resources...");
    for (const res of trainingResources) {
      await client.models.TrainingResource.create(res);
    }

    // FAQ items for companies
    const faqItems = [
      {
        companyId: createdCompanies[0]?.id || "default-company-id",
        question: "What services does Sunny Hill provide?",
        answer:
          "Sunny Hill Financial offers comprehensive planning, investment, and retirement services.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[1]?.id || "default-company-id",
        question: "How are Prime Corporate Services commissions paid?",
        answer:
          "Commissions are calculated on each service package and paid monthly through MRN.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    console.log("❓ Creating FAQ items...");
    for (const faq of faqItems) {
      await client.models.FaqItem.create(faq);
    }

    // Create sample referrals across different companies
    const referrals = [
      {
        companyId: createdCompanies[0]?.id || "default-company-id", // Sunny Hill Financial
        name: "Robert Johnson",
        email: "robert.johnson@email.com",
        phoneNumber: "+1555123456",
        approximateValue: 85000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_PROGRESS" as const,
        notes:
          "Interested in comprehensive retirement planning and investment portfolio management",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        orgLeadId:
          createdUsers.find((u) => u.email === "orglead@test.com")?.id ||
          "fallback-orglead-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[1]?.id || "default-company-id", // Prime Corporate Services
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phoneNumber: "+1555123457",
        approximateValue: 45000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_REVIEW" as const,
        notes:
          "Small business owner looking for tax preparation and bookkeeping services",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        orgLeadId:
          createdUsers.find((u) => u.email === "orglead@test.com")?.id ||
          "fallback-orglead-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[2]?.id || "default-company-id", // ANCO Insurance
        name: "Michael Brown",
        email: "michael.brown@email.com",
        phoneNumber: "+1555123458",
        approximateValue: 125000.0,
        userId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        status: "PAID" as const,
        notes:
          "Large corporation needing comprehensive employee benefits package",
        amount: 6000.0,
        type: "COMMISSION" as const,
        paymentType: "COMMISSION" as const,
        paymentStatus: "PROCESSED" as const,
        period: "2024-01",
        processedAt: new Date().toISOString(),
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        orgLeadId:
          createdUsers.find((u) => u.email === "orglead@test.com")?.id ||
          "fallback-orglead-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[3]?.id || "default-company-id", // Weightless Financial
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phoneNumber: "+1555123459",
        approximateValue: 15000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_PROGRESS" as const,
        notes: "Needs debt consolidation and credit repair services",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        orgLeadId:
          createdUsers.find((u) => u.email === "orglead@test.com")?.id ||
          "fallback-orglead-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[4]?.id || "default-company-id", // Summit Retirement Plans
        name: "David Martinez",
        email: "david.martinez@email.com",
        phoneNumber: "+1555123460",
        approximateValue: 200000.0,
        userId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        status: "PAID" as const,
        notes: "Mid-size company implementing new 401k plan for 150 employees",
        amount: 10000.0,
        type: "COMMISSION" as const,
        paymentType: "COMMISSION" as const,
        paymentStatus: "PROCESSED" as const,
        period: "2024-01",
        processedAt: new Date().toISOString(),
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        orgLeadId:
          createdUsers.find((u) => u.email === "orglead@test.com")?.id ||
          "fallback-orglead-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: createdCompanies[6]?.id || "default-company-id", // Impact Health Sharing
        name: "Jennifer Lee",
        email: "jennifer.lee@email.com",
        phoneNumber: "+1555123461",
        approximateValue: 35000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_REVIEW" as const,
        notes:
          "Family of 4 interested in health sharing plan as alternative to traditional insurance",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        orgLeadId:
          createdUsers.find((u) => u.email === "orglead@test.com")?.id ||
          "fallback-orglead-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    console.log("📋 Creating referrals...");
    for (const referralData of referrals) {
      const { data: referral } =
        await client.models.Referral.create(referralData);
      if (referral) {
        console.log(
          `✅ Created referral: ${referral.name} - ${referral.status}`,
        );
      }
    }

    console.log("\n🎉 Seed data creation completed successfully!");
    console.log("\n📊 Companies Created:");
    createdCompanies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.companyName} (ID: ${company.id})`);
    });

    console.log("\n📝 Test Accounts Created:");
    console.log(
      "┌─────────────────────────────────────────────────────────────┐",
    );
    console.log(
      "│ NOTE: You need to create these Cognito users manually:     │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ Email: admin@test.com     | Role: Admin                     │",
    );
    console.log(
      "│ Email: agent@test.com     | Role: Agent                     │",
    );
    console.log(
      "│ Email: teamlead@test.com  | Role: Team Lead                 │",
    );
    console.log(
      "│ Email: orglead@test.com   | Role: Organization Lead         │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ Password: TempPass123!    | (for all test accounts)        │",
    );
    console.log(
      `│ Primary Company: ${createdCompanies[0]?.companyName || "Sunny Hill Financial"}                    │`,
    );
    console.log(
      "│ Company ID: " +
        (createdCompanies[0]?.id || "See output above").padEnd(43) +
        "│",
    );
    console.log(
      "└─────────────────────────────────────────────────────────────┘",
    );
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Export for use in other files
export default seedData;
