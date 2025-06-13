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
          divisionLeadPercentage: 5.0,
          bonusPoolPercentage: 15.0,
          mrnPercentage: 20.0,
          contracterPercentage: 7.0,
        },
        trainingLinks: [
          "https://sunnyhillfinancial.com/training/financial-planning",
          "https://sunnyhillfinancial.com/training/investment-basics",
        ],
        divisionId: "ORG-SUNNY-001",
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
          divisionLeadPercentage: 6.0,
          bonusPoolPercentage: 12.0,
          mrnPercentage: 18.0,
          contracterPercentage: 4.0,
        },
        trainingLinks: [
          "https://www.primecorporateservices.com/training/business-services",
          "https://www.primecorporateservices.com/training/tax-preparation",
        ],
        divisionId: "ORG-PRIME-002",
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
          divisionLeadPercentage: 5.5,
          bonusPoolPercentage: 20.0,
          mrnPercentage: 15.0,
          contracterPercentage: 2.5,
        },
        trainingLinks: ["https://www.anco.com/training/insurance-basics"],
        divisionId: "ORG-ANCO-003",
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
          divisionLeadPercentage: 8.0,
          bonusPoolPercentage: 18.0,
          mrnPercentage: 15.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [
          "https://weightlessfinancial.com/training/debt-resolution",
        ],
        divisionId: "ORG-WEIGHTLESS-004",
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
          divisionLeadPercentage: 6.0,
          bonusPoolPercentage: 25.0,
          mrnPercentage: 20.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [
          "https://summitretirement.com/training/401k-basics",
          "https://summitretirement.com/training/employee-benefits",
        ],
        divisionId: "ORG-SUMMIT-005",
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
          divisionLeadPercentage: 7.0,
          bonusPoolPercentage: 20.0,
          mrnPercentage: 18.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [],
        divisionId: "ORG-WELLNESS-006",
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
          divisionLeadPercentage: 5.0,
          bonusPoolPercentage: 22.0,
          mrnPercentage: 15.0,
          contracterPercentage: 5.0,
        },
        trainingLinks: [
          "https://www.impacthealthsharing.com/training/health-sharing-basics",
          "https://www.impacthealthsharing.com/training/medical-cost-sharing",
        ],
        divisionId: "ORG-IMPACT-007",
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

    // Get Sunny Hill Financial as the primary company for all users and referrals
    const sunnyHillFinancial = createdCompanies.find(c => c.companyName === "Sunny Hill Financial");
    if (!sunnyHillFinancial || !sunnyHillFinancial.id) {
      throw new Error("Sunny Hill Financial company not created or missing ID - cannot proceed with user/referral seeding");
    }

    const sunnyHillCompanyId = sunnyHillFinancial.id; // Extract ID to ensure it's non-null
    console.log(`🎯 All users and referrals will belong to: ${sunnyHillFinancial.companyName} (ID: ${sunnyHillCompanyId})`);

    // Create test users - ALL belong to Sunny Hill Financial
    // Note: These will be created in DynamoDB, Cognito users need to be created separately with matching IDs
    const users = [
      {
        name: "John Admin",
        email: "admin@test.com",
        phone: "+1234567890",
        address: "123 Admin Street, Admin City, AC 12345",
        teamId: "TEAM-ADMIN-001",
        teamLead: false,
        teamLeadId: null,
        divisionLeadId: null,
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
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
        divisionLeadId: null,
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
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
        divisionLeadId: null,
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        bankInfoDocument: null,
        taxDocument: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: "Sarah DivisionLead",
        email: "divisionlead@test.com",
        phone: "+1234567893",
        address: "321 Division Blvd, Div City, DC 12348",
        teamId: "TEAM-LEADERSHIP-001",
        teamLead: true,
        teamLeadId: null,
        divisionLeadId: null,
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        bankInfoDocument: null,
        taxDocument: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: "Site Admin",
        email: "siteadmin@test.com",
        phone: "+1234567894",
        address: "999 Site Admin Plaza, Admin City, AC 12349",
        teamId: "TEAM-ADMIN-001",
        teamLead: false,
        teamLeadId: null,
        divisionLeadId: null,
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
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
        console.log(`✅ Created user: ${user.name} (${user.email}) - Company: ${sunnyHillFinancial.companyName}`);
      }
    }

    // Training resources for Sunny Hill Financial
    const trainingResources = [
      {
        companyId: sunnyHillCompanyId,
        title: "Getting Started Guide",
        type: "document" as const,
        url: "https://sunnyhillfinancial.com/training/start",
        duration: "10 min",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId,
        title: "Financial Planning Intro Video",
        type: "video" as const,
        url: "https://sunnyhillfinancial.com/training/intro",
        duration: "5:30",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId,
        title: "Investment Basics",
        type: "document" as const,
        url: "https://sunnyhillfinancial.com/training/investment-basics",
        duration: "15 min",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId,
        title: "Retirement Planning Overview",
        type: "video" as const,
        url: "https://sunnyhillfinancial.com/training/retirement-overview",
        duration: "8:45",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    console.log("🎬 Creating training resources...");
    for (const res of trainingResources) {
      await client.models.TrainingResource.create(res);
      console.log(`✅ Created training resource: ${res.title}`);
    }

    // FAQ items for Sunny Hill Financial
    const faqItems = [
      {
        companyId: sunnyHillCompanyId,
        question: "What services does Sunny Hill Financial provide?",
        answer:
          "Sunny Hill Financial offers comprehensive financial planning, investment management, and retirement planning services to help clients achieve their financial goals.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId,
        question: "How are commissions calculated and paid?",
        answer:
          "Commissions are calculated based on the value of the financial products sold and are paid monthly through the MRN platform. Agent commission is 45%, with additional percentages for team leads and division leads.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId,
        question: "What training resources are available?",
        answer:
          "We provide comprehensive training materials including video tutorials, documentation, and hands-on training sessions covering financial planning, investment basics, and sales techniques.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    console.log("❓ Creating FAQ items...");
    for (const faq of faqItems) {
      await client.models.FaqItem.create(faq);
      console.log(`✅ Created FAQ: ${faq.question}`);
    }

    // Create sample referrals - ALL belong to Sunny Hill Financial
    const referrals = [
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
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
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phoneNumber: "+1555123457",
        approximateValue: 45000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_REVIEW" as const,
        notes:
          "Small business owner looking for financial planning and retirement services",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        name: "Michael Brown",
        email: "michael.brown@email.com",
        phoneNumber: "+1555123458",
        approximateValue: 125000.0,
        userId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        status: "PAID" as const,
        notes:
          "Large corporation needing comprehensive employee benefits and retirement planning",
        amount: 6000.0,
        type: "COMMISSION" as const,
        paymentType: "COMMISSION" as const,
        paymentStatus: "PROCESSED" as const,
        period: "2024-01",
        processedAt: new Date().toISOString(),
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phoneNumber: "+1555123459",
        approximateValue: 25000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_PROGRESS" as const,
        notes: "Young professional interested in investment planning and financial education",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
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
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        name: "Jennifer Lee",
        email: "jennifer.lee@email.com",
        phoneNumber: "+1555123461",
        approximateValue: 35000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_REVIEW" as const,
        notes:
          "Family of 4 interested in comprehensive financial planning and college savings plans",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        name: "John Smith",
        email: "john.smith@email.com",
        phoneNumber: "+1555123462",
        approximateValue: 50000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_PROGRESS" as const,
        notes: "Self-employed individual seeking retirement planning and tax-advantaged investment options",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        name: "Lisa Thompson",
        email: "lisa.thompson@email.com",
        phoneNumber: "+1555123463",
        approximateValue: 75000.0,
        userId:
          createdUsers.find((u) => u.email === "agent@test.com")?.id ||
          "fallback-agent-id",
        status: "IN_PROGRESS" as const,
        notes: "Recent widow needing comprehensive financial planning and estate management",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        companyId: sunnyHillCompanyId, // Explicitly Sunny Hill Financial
        name: "Mark Rodriguez",
        email: "mark.rodriguez@email.com",
        phoneNumber: "+1555123464",
        approximateValue: 90000.0,
        userId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          "fallback-teamlead-id",
        status: "IN_REVIEW" as const,
        notes: "Tech startup founder looking for business retirement plans and personal wealth management",
        teamLeadId:
          createdUsers.find((u) => u.email === "teamlead@test.com")?.id ||
          null,
        divisionLeadId:
          createdUsers.find((u) => u.email === "divisionlead@test.com")?.id ||
          null,
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
          `✅ Created referral: ${referral.name} - ${referral.status} (Company: ${sunnyHillFinancial.companyName})`,
        );
      }
    }

    console.log("\n🎉 Seed data creation completed successfully!");
    console.log("\n📊 Companies Created:");
    createdCompanies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.companyName} (ID: ${company.id})`);
    });

    console.log("\n📝 Test Accounts to Create in Cognito:");
    console.log(
      "┌─────────────────────────────────────────────────────────────┐",
    );
    console.log(
      "│ 🔐 Create these Cognito users with proper attributes:      │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ Email: admin@test.com                                       │",
    );
    console.log(
      "│ ├─ Groups: admin                                            │",
    );
    console.log(
      "│ ├─ custom:company: Sunny Hill Financial                    │",
    );
    console.log(
      `│ ├─ custom:companyId: ${sunnyHillCompanyId.padEnd(28)} │`,
    );
    console.log(
      "│ └─ custom:activated: true                                   │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ Email: agent@test.com                                       │",
    );
    console.log(
      "│ ├─ Groups: (none - regular agent)                          │",
    );
    console.log(
      "│ ├─ custom:company: Sunny Hill Financial                    │",
    );
    console.log(
      `│ ├─ custom:companyId: ${sunnyHillCompanyId.padEnd(28)} │`,
    );
    console.log(
      "│ └─ custom:activated: true                                   │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ Email: teamlead@test.com                                    │",
    );
    console.log(
      "│ ├─ Groups: teamLead                                         │",
    );
    console.log(
      "│ ├─ custom:company: Sunny Hill Financial                    │",
    );
    console.log(
      `│ ├─ custom:companyId: ${sunnyHillCompanyId.padEnd(28)} │`,
    );
    console.log(
      "│ └─ custom:activated: true                                   │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ Email: divisionlead@test.com                                │",
    );
    console.log(
      "│ ├─ Groups: divisionLead                                     │",
    );
    console.log(
      "│ ├─ custom:company: Sunny Hill Financial                    │",
    );
    console.log(
      `│ ├─ custom:companyId: ${sunnyHillCompanyId.padEnd(28)} │`,
    );
    console.log(
      "│ └─ custom:activated: true                                   │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ Email: siteadmin@test.com                                   │",
    );
    console.log(
      "│ ├─ Groups: siteAdmin                                        │",
    );
    console.log(
      "│ ├─ custom:company: Sunny Hill Financial                    │",
    );
    console.log(
      `│ ├─ custom:companyId: ${sunnyHillCompanyId.padEnd(28)} │`,
    );
    console.log(
      "│ └─ custom:activated: true                                   │",
    );
    console.log(
      "├─────────────────────────────────────────────────────────────┤",
    );
    console.log(
      "│ 📋 Standard Attributes for All Users:                      │",
    );
    console.log(
      "│ ├─ given_name: (First name from above)                     │",
    );
    console.log(
      "│ ├─ family_name: (Last name from above)                     │",
    );
    console.log(
      "│ ├─ phone_number: (Phone from above)                        │",
    );
    console.log(
      "│ ├─ address: (Address from above)                           │",
    );
    console.log(
      "│ └─ Password: TempPass123!                                   │",
    );
    console.log(
      "└─────────────────────────────────────────────────────────────┘",
    );

    console.log(`\n📊 Summary:`);
    console.log(`├─ ${createdCompanies.length} companies created`);
    console.log(`├─ ${createdUsers.length} users created (all in ${sunnyHillFinancial.companyName})`);
    console.log(`├─ ${trainingResources.length} training resources created`);
    console.log(`├─ ${faqItems.length} FAQ items created`);
    console.log(`└─ ${referrals.length} referrals created (all in ${sunnyHillFinancial.companyName})`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Export for use in other files
export default seedData;
