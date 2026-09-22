import { SourceType } from "@prisma/client";

export interface CompanyRegistryEntry {
  canonicalIndex: number;
  companyId: string;
  name: string;
  slug: string;
  careerUrl: string;
  officialWebsite: string;
  industry: string;
  country: string;
  primaryLocations: string[];
  aliases: string[];
  verifiedAts?: {
    atsType: SourceType;
    boardToken: string;
    apiUrl?: string;
  };
}

export const COMPANIES_REGISTRY: CompanyRegistryEntry[] = [
  {
    "canonicalIndex": 1,
    "companyId": "CMP-000001",
    "name": "TCS",
    "slug": "tcs",
    "careerUrl": "https://www.tcs.com/careers",
    "officialWebsite": "https://www.tcs.com",
    "industry": "IT Services & Consulting",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Delhi NCR"
    ],
    "aliases": [
      "Tata Consultancy Services",
      "Tata Consultancy Services Ltd",
      "TCS India"
    ]
  },
  {
    "canonicalIndex": 2,
    "companyId": "CMP-000002",
    "name": "Infosys",
    "slug": "infosys",
    "careerUrl": "https://www.infosys.com/careers/",
    "officialWebsite": "https://www.infosys.com",
    "industry": "IT Services & Consulting",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Pune",
      "Hyderabad",
      "Chennai",
      "Noida"
    ],
    "aliases": [
      "Infosys Limited",
      "Infosys Ltd",
      "Infosys BPM"
    ]
  },
  {
    "canonicalIndex": 3,
    "companyId": "CMP-000003",
    "name": "Wipro",
    "slug": "wipro",
    "careerUrl": "https://careers.wipro.com/",
    "officialWebsite": "https://www.wipro.com",
    "industry": "IT Services & Consulting",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Pune",
      "Chennai",
      "Gurgaon"
    ],
    "aliases": [
      "Wipro Limited",
      "Wipro Technologies",
      "Wipro Enterprises"
    ]
  },
  {
    "canonicalIndex": 4,
    "companyId": "CMP-000004",
    "name": "HCLTech",
    "slug": "hcltech",
    "careerUrl": "https://www.hcltech.com/careers",
    "officialWebsite": "https://www.hcltech.com",
    "industry": "IT Services & Consulting",
    "country": "India",
    "primaryLocations": [
      "Noida",
      "Bengaluru",
      "Chennai",
      "Hyderabad",
      "Pune"
    ],
    "aliases": [
      "HCL Tech",
      "HCL Technologies",
      "HCL Technologies Ltd",
      "HCL"
    ]
  },
  {
    "canonicalIndex": 5,
    "companyId": "CMP-000005",
    "name": "Tech Mahindra",
    "slug": "tech-mahindra",
    "careerUrl": "https://careers.techmahindra.com/",
    "officialWebsite": "https://www.techmahindra.com",
    "industry": "IT Services & Consulting",
    "country": "India",
    "primaryLocations": [
      "Pune",
      "Mumbai",
      "Bengaluru",
      "Hyderabad",
      "Noida"
    ],
    "aliases": [
      "TechM",
      "Tech Mahindra Limited",
      "Tech Mahindra Ltd"
    ]
  },
  {
    "canonicalIndex": 6,
    "companyId": "CMP-000006",
    "name": "Cognizant",
    "slug": "cognizant",
    "careerUrl": "https://careers.cognizant.com/",
    "officialWebsite": "https://www.cognizant.com",
    "industry": "IT Services & Consulting",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Kolkata"
    ],
    "aliases": [
      "Cognizant Technology Solutions",
      "CTS",
      "Cognizant India"
    ]
  },
  {
    "canonicalIndex": 7,
    "companyId": "CMP-000007",
    "name": "Capgemini",
    "slug": "capgemini",
    "careerUrl": "https://www.capgemini.com/careers/",
    "officialWebsite": "https://www.capgemini.com",
    "industry": "IT Services & Consulting",
    "country": "France",
    "primaryLocations": [
      "Bengaluru",
      "Mumbai",
      "Pune",
      "Hyderabad",
      "Gurgaon"
    ],
    "aliases": [
      "Capgemini Technology Services",
      "Capgemini Engineering",
      "Capgemini India"
    ]
  },
  {
    "canonicalIndex": 8,
    "companyId": "CMP-000008",
    "name": "Accenture",
    "slug": "accenture",
    "careerUrl": "https://www.accenture.com/in-en/careers",
    "officialWebsite": "https://www.accenture.com",
    "industry": "Management Consulting & IT Services",
    "country": "Ireland",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Mumbai",
      "Pune",
      "Gurgaon",
      "Chennai"
    ],
    "aliases": [
      "Accenture India",
      "Accenture Solutions",
      "Accenture Services"
    ]
  },
  {
    "canonicalIndex": 9,
    "companyId": "CMP-000009",
    "name": "IBM",
    "slug": "ibm",
    "careerUrl": "https://www.ibm.com/careers",
    "officialWebsite": "https://www.ibm.com",
    "industry": "Enterprise Tech & Cloud",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Mumbai",
      "Pune",
      "Gurgaon"
    ],
    "aliases": [
      "IBM India",
      "International Business Machines",
      "IBM India Pvt Ltd"
    ]
  },
  {
    "canonicalIndex": 10,
    "companyId": "CMP-000010",
    "name": "LTIMindtree",
    "slug": "ltimindtree",
    "careerUrl": "https://www.ltimindtree.com/careers/",
    "officialWebsite": "https://www.ltimindtree.com",
    "industry": "IT Services & Consulting",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Mumbai",
      "Pune",
      "Chennai",
      "Hyderabad"
    ],
    "aliases": [
      "LTI Mindtree",
      "LTI",
      "Mindtree",
      "LTM",
      "Larsen & Toubro Infotech"
    ]
  },
  {
    "canonicalIndex": 11,
    "companyId": "CMP-000011",
    "name": "Mphasis",
    "slug": "mphasis",
    "careerUrl": "https://careers.mphasis.com/",
    "officialWebsite": "https://www.mphasis.com",
    "industry": "IT Services & Cloud Solutions",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Pune",
      "Chennai",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "Mphasis Limited",
      "Mphasis Ltd",
      "Mphasis Corporation"
    ]
  },
  {
    "canonicalIndex": 12,
    "companyId": "CMP-000012",
    "name": "Persistent Systems",
    "slug": "persistent-systems",
    "careerUrl": "https://www.persistent.com/careers/",
    "officialWebsite": "https://www.persistent.com",
    "industry": "Digital Engineering & Enterprise Modernization",
    "country": "India",
    "primaryLocations": [
      "Pune",
      "Bengaluru",
      "Hyderabad",
      "Nagpur",
      "Goa"
    ],
    "aliases": [
      "Persistent",
      "Persistent Systems Ltd"
    ]
  },
  {
    "canonicalIndex": 13,
    "companyId": "CMP-000013",
    "name": "Hexaware Technologies",
    "slug": "hexaware-technologies",
    "careerUrl": "https://hexaware.com/careers/",
    "officialWebsite": "https://hexaware.com",
    "industry": "IT Services & Automation",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Chennai",
      "Pune",
      "Bengaluru",
      "Noida"
    ],
    "aliases": [
      "Hexaware",
      "Hexaware Tech"
    ]
  },
  {
    "canonicalIndex": 14,
    "companyId": "CMP-000014",
    "name": "Zensar Technologies",
    "slug": "zensar-technologies",
    "careerUrl": "https://www.zensar.com/careers",
    "officialWebsite": "https://www.zensar.com",
    "industry": "IT Services & Digital Solutions",
    "country": "India",
    "primaryLocations": [
      "Pune",
      "Bengaluru",
      "Hyderabad",
      "Mumbai"
    ],
    "aliases": [
      "Zensar",
      "Zensar Tech"
    ]
  },
  {
    "canonicalIndex": 15,
    "companyId": "CMP-000015",
    "name": "Birlasoft",
    "slug": "birlasoft",
    "careerUrl": "https://www.birlasoft.com/careers",
    "officialWebsite": "https://www.birlasoft.com",
    "industry": "IT Services & Digital Transformation",
    "country": "India",
    "primaryLocations": [
      "Pune",
      "Noida",
      "Bengaluru",
      "Chennai",
      "Hyderabad"
    ],
    "aliases": [
      "Birlasoft Limited",
      "KPIT Birlasoft",
      "CK Birla Group"
    ]
  },
  {
    "canonicalIndex": 16,
    "companyId": "CMP-000016",
    "name": "Coforge",
    "slug": "coforge",
    "careerUrl": "https://www.coforge.com/careers",
    "officialWebsite": "https://www.coforge.com",
    "industry": "IT Solutions & Digital Services",
    "country": "India",
    "primaryLocations": [
      "Noida",
      "Bengaluru",
      "Hyderabad",
      "Mumbai",
      "Pune"
    ],
    "aliases": [
      "NIIT Technologies",
      "Coforge Ltd",
      "Coforge Limited"
    ]
  },
  {
    "canonicalIndex": 17,
    "companyId": "CMP-000017",
    "name": "Mastek",
    "slug": "mastek",
    "careerUrl": "https://mastek.com/careers/",
    "officialWebsite": "https://mastek.com",
    "industry": "Digital Commerce & Enterprise Cloud",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Pune",
      "Ahmedabad",
      "Chennai"
    ],
    "aliases": [
      "Mastek Limited",
      "Mastek Ltd"
    ]
  },
  {
    "canonicalIndex": 18,
    "companyId": "CMP-000018",
    "name": "Cyient",
    "slug": "cyient",
    "careerUrl": "https://www.cyient.com/careers",
    "officialWebsite": "https://www.cyient.com",
    "industry": "Engineering & Technology Solutions",
    "country": "India",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru",
      "Pune",
      "Noida"
    ],
    "aliases": [
      "Cyient Limited",
      "Infotech Enterprises"
    ]
  },
  {
    "canonicalIndex": 19,
    "companyId": "CMP-000019",
    "name": "Sonata Software",
    "slug": "sonata-software",
    "careerUrl": "https://www.sonata-software.com/careers",
    "officialWebsite": "https://www.sonata-software.com",
    "industry": "Modernization & Cloud Engineering",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Pune"
    ],
    "aliases": [
      "Sonata",
      "Sonata Software Ltd"
    ]
  },
  {
    "canonicalIndex": 20,
    "companyId": "CMP-000020",
    "name": "KPIT Technologies",
    "slug": "kpit-technologies",
    "careerUrl": "https://www.kpit.com/careers/",
    "officialWebsite": "https://www.kpit.com",
    "industry": "Automotive Software & Mobility",
    "country": "India",
    "primaryLocations": [
      "Pune",
      "Bengaluru",
      "Kochi"
    ],
    "aliases": [
      "KPIT",
      "KPIT Cummins"
    ]
  },
  {
    "canonicalIndex": 21,
    "companyId": "CMP-000021",
    "name": "Tata Elxsi",
    "slug": "tata-elxsi",
    "careerUrl": "https://www.tataelxsi.com/careers",
    "officialWebsite": "https://www.tataelxsi.com",
    "industry": "Design & Technology Services",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Thiruvananthapuram",
      "Pune",
      "Chennai"
    ],
    "aliases": [
      "Tata Elxsi Limited"
    ]
  },
  {
    "canonicalIndex": 22,
    "companyId": "CMP-000022",
    "name": "Quest Global",
    "slug": "quest-global",
    "careerUrl": "https://www.quest-global.com/careers/",
    "officialWebsite": "https://www.quest-global.com",
    "industry": "Engineering Services",
    "country": "Singapore",
    "primaryLocations": [
      "Bengaluru",
      "Thiruvananthapuram",
      "Belagavi",
      "Hyderabad"
    ],
    "aliases": [
      "QuEST Global Engineering",
      "Quest Global Services"
    ]
  },
  {
    "canonicalIndex": 23,
    "companyId": "CMP-000023",
    "name": "Cybage Software",
    "slug": "cybage-software",
    "careerUrl": "https://www.cybage.com/careers",
    "officialWebsite": "https://www.cybage.com",
    "industry": "Product Engineering & IT Services",
    "country": "India",
    "primaryLocations": [
      "Pune",
      "Hyderabad",
      "Gandhinagar"
    ],
    "aliases": [
      "Cybage"
    ]
  },
  {
    "canonicalIndex": 24,
    "companyId": "CMP-000024",
    "name": "Zoho Corporation",
    "slug": "zoho-corporation",
    "careerUrl": "https://www.zoho.com/careers/",
    "officialWebsite": "https://www.zoho.com",
    "industry": "Enterprise SaaS & Cloud Software",
    "country": "India",
    "primaryLocations": [
      "Chennai",
      "Tenkasi",
      "Salem",
      "Renigunta"
    ],
    "aliases": [
      "Zoho",
      "ZOHO Corp",
      "AdventNet"
    ]
  },
  {
    "canonicalIndex": 25,
    "companyId": "CMP-000025",
    "name": "Freshworks",
    "slug": "freshworks",
    "careerUrl": "https://www.freshworks.com/company/careers/",
    "officialWebsite": "https://www.freshworks.com",
    "industry": "Customer Engagement & Enterprise SaaS",
    "country": "United States",
    "primaryLocations": [
      "Chennai",
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "Freshworks Inc",
      "Freshdesk"
    ],
    "verifiedAts": {
      "atsType": "SMART_RECRUITERS",
      "boardToken": "Freshworks"
    }
  },
  {
    "canonicalIndex": 26,
    "companyId": "CMP-000026",
    "name": "Amazon",
    "slug": "amazon",
    "careerUrl": "https://www.amazon.jobs/",
    "officialWebsite": "https://www.amazon.com",
    "industry": "Cloud Computing, E-Commerce & AI",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Chennai",
      "Delhi NCR",
      "Pune",
      "Mumbai"
    ],
    "aliases": [
      "Amazon Development Centre",
      "Amazon Web Services",
      "AWS",
      "Amazon India"
    ]
  },
  {
    "canonicalIndex": 27,
    "companyId": "CMP-000027",
    "name": "Microsoft",
    "slug": "microsoft",
    "careerUrl": "https://careers.microsoft.com/",
    "officialWebsite": "https://www.microsoft.com",
    "industry": "Operating Systems, Cloud & Enterprise Software",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Noida",
      "Gurgaon"
    ],
    "aliases": [
      "Microsoft India",
      "Microsoft Corporation",
      "Microsoft IDC"
    ]
  },
  {
    "canonicalIndex": 28,
    "companyId": "CMP-000028",
    "name": "Google",
    "slug": "google",
    "careerUrl": "https://careers.google.com/",
    "officialWebsite": "https://www.google.com",
    "industry": "Search, Cloud, AI & Consumer Internet",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Gurgaon",
      "Mumbai"
    ],
    "aliases": [
      "Alphabet",
      "Google India",
      "Google LLC"
    ]
  },
  {
    "canonicalIndex": 29,
    "companyId": "CMP-000029",
    "name": "Meta",
    "slug": "meta",
    "careerUrl": "https://www.metacareers.com/",
    "officialWebsite": "https://www.meta.com",
    "industry": "Social Platforms, VR & AI",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "Facebook",
      "Meta Platforms",
      "Meta India"
    ]
  },
  {
    "canonicalIndex": 30,
    "companyId": "CMP-000030",
    "name": "Adobe",
    "slug": "adobe",
    "careerUrl": "https://www.adobe.com/careers.html",
    "officialWebsite": "https://www.adobe.com",
    "industry": "Creative Software & Digital Experience",
    "country": "United States",
    "primaryLocations": [
      "Noida",
      "Bengaluru"
    ],
    "aliases": [
      "Adobe Systems",
      "Adobe India"
    ]
  },
  {
    "canonicalIndex": 31,
    "companyId": "CMP-000031",
    "name": "Oracle",
    "slug": "oracle",
    "careerUrl": "https://www.oracle.com/careers/",
    "officialWebsite": "https://www.oracle.com",
    "industry": "Database, Cloud Infrastructure & ERP",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Noida",
      "Mumbai",
      "Pune"
    ],
    "aliases": [
      "Oracle India",
      "Oracle Financial Services",
      "OFSS"
    ]
  },
  {
    "canonicalIndex": 32,
    "companyId": "CMP-000032",
    "name": "SAP",
    "slug": "sap",
    "careerUrl": "https://www.sap.com/about/careers.html",
    "officialWebsite": "https://www.sap.com",
    "industry": "Enterprise Application Software",
    "country": "Germany",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon",
      "Pune",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "SAP Labs",
      "SAP Labs India",
      "SAP SE"
    ]
  },
  {
    "canonicalIndex": 33,
    "companyId": "CMP-000033",
    "name": "Salesforce",
    "slug": "salesforce",
    "careerUrl": "https://www.salesforce.com/company/careers/",
    "officialWebsite": "https://www.salesforce.com",
    "industry": "CRM & Enterprise Cloud Software",
    "country": "United States",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru",
      "Mumbai",
      "Gurgaon",
      "Pune"
    ],
    "aliases": [
      "Salesforce.com",
      "Salesforce India"
    ]
  },
  {
    "canonicalIndex": 34,
    "companyId": "CMP-000034",
    "name": "Dell Technologies",
    "slug": "dell-technologies",
    "careerUrl": "https://jobs.dell.com/",
    "officialWebsite": "https://www.dell.com",
    "industry": "Computer Hardware & Cloud Infrastructure",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Gurgaon"
    ],
    "aliases": [
      "Dell",
      "Dell EMC",
      "Dell India"
    ]
  },
  {
    "canonicalIndex": 35,
    "companyId": "CMP-000035",
    "name": "HP Inc.",
    "slug": "hp-inc",
    "careerUrl": "https://jobs.hp.com/",
    "officialWebsite": "https://www.hp.com",
    "industry": "Personal Systems & Printing Solutions",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Chennai",
      "Gurgaon"
    ],
    "aliases": [
      "HP",
      "Hewlett-Packard",
      "HP India"
    ]
  },
  {
    "canonicalIndex": 36,
    "companyId": "CMP-000036",
    "name": "Cisco Systems",
    "slug": "cisco-systems",
    "careerUrl": "https://jobs.cisco.com/",
    "officialWebsite": "https://www.cisco.com",
    "industry": "Networking Hardware, Security & Cloud",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Chennai",
      "Delhi NCR",
      "Mumbai"
    ],
    "aliases": [
      "Cisco",
      "Cisco India"
    ]
  },
  {
    "canonicalIndex": 37,
    "companyId": "CMP-000037",
    "name": "Intel",
    "slug": "intel",
    "careerUrl": "https://jobs.intel.com/",
    "officialWebsite": "https://www.intel.com",
    "industry": "Semiconductors & Computing Hardware",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "Intel Corporation",
      "Intel India"
    ]
  },
  {
    "canonicalIndex": 38,
    "companyId": "CMP-000038",
    "name": "Qualcomm",
    "slug": "qualcomm",
    "careerUrl": "https://www.qualcomm.com/company/careers",
    "officialWebsite": "https://www.qualcomm.com",
    "industry": "Semiconductors & Wireless Telecommunications",
    "country": "United States",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru",
      "Chennai",
      "Noida"
    ],
    "aliases": [
      "Qualcomm India",
      "Qualcomm Technologies"
    ]
  },
  {
    "canonicalIndex": 39,
    "companyId": "CMP-000039",
    "name": "NVIDIA",
    "slug": "nvidia",
    "careerUrl": "https://www.nvidia.com/en-us/about-nvidia/careers/",
    "officialWebsite": "https://www.nvidia.com",
    "industry": "Accelerated Computing, GPU & AI Hardware",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Pune",
      "Hyderabad",
      "Gurgaon"
    ],
    "aliases": [
      "Nvidia Graphics",
      "NVIDIA India"
    ]
  },
  {
    "canonicalIndex": 40,
    "companyId": "CMP-000040",
    "name": "Samsung R&D Institute India",
    "slug": "samsung-rd-institute-india",
    "careerUrl": "https://www.samsung.com/in/careers/",
    "officialWebsite": "https://www.samsung.com",
    "industry": "Consumer Electronics & Semiconductor R&D",
    "country": "South Korea",
    "primaryLocations": [
      "Bengaluru",
      "Noida"
    ],
    "aliases": [
      "Samsung",
      "Samsung Electronics",
      "SRI-B",
      "SRI-D",
      "Samsung R&D"
    ]
  },
  {
    "canonicalIndex": 41,
    "companyId": "CMP-000041",
    "name": "Broadcom (VMware)",
    "slug": "broadcom-vmware",
    "careerUrl": "https://careers.broadcom.com/",
    "officialWebsite": "https://www.broadcom.com",
    "industry": "Semiconductors & Infrastructure Software",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Pune"
    ],
    "aliases": [
      "Broadcom",
      "VMware",
      "VMware Software India"
    ]
  },
  {
    "canonicalIndex": 42,
    "companyId": "CMP-000042",
    "name": "ServiceNow",
    "slug": "servicenow",
    "careerUrl": "https://www.servicenow.com/careers.html",
    "officialWebsite": "https://www.servicenow.com",
    "industry": "Cloud Computing & Digital Workflow",
    "country": "United States",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru"
    ],
    "aliases": [
      "ServiceNow India"
    ]
  },
  {
    "canonicalIndex": 43,
    "companyId": "CMP-000043",
    "name": "Uber",
    "slug": "uber",
    "careerUrl": "https://www.uber.com/careers/",
    "officialWebsite": "https://www.uber.com",
    "industry": "Mobility, Delivery & Autonomous Tech",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "Uber India",
      "Uber Technologies"
    ]
  },
  {
    "canonicalIndex": 44,
    "companyId": "CMP-000044",
    "name": "Ola Cabs",
    "slug": "ola-cabs",
    "careerUrl": "https://www.olacabs.com/careers",
    "officialWebsite": "https://www.olacabs.com",
    "industry": "Ride-Hailing & Mobility",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Ola",
      "ANI Technologies"
    ]
  },
  {
    "canonicalIndex": 45,
    "companyId": "CMP-000045",
    "name": "Swiggy",
    "slug": "swiggy",
    "careerUrl": "https://careers.swiggy.com/",
    "officialWebsite": "https://www.swiggy.com",
    "industry": "On-Demand Delivery & Quick Commerce",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "Bundl Technologies",
      "Swiggy India"
    ]
  },
  {
    "canonicalIndex": 46,
    "companyId": "CMP-000046",
    "name": "Zomato",
    "slug": "zomato",
    "careerUrl": "https://www.zomato.com/careers",
    "officialWebsite": "https://www.zomato.com",
    "industry": "Food Tech & Dining Discovery",
    "country": "India",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "Zomato Media",
      "Zomato Limited"
    ]
  },
  {
    "canonicalIndex": 47,
    "companyId": "CMP-000047",
    "name": "Flipkart",
    "slug": "flipkart",
    "careerUrl": "https://www.flipkart.com/careers",
    "officialWebsite": "https://www.flipkart.com",
    "industry": "E-Commerce & Digital Payments",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Flipkart Internet",
      "Flipkart India"
    ]
  },
  {
    "canonicalIndex": 48,
    "companyId": "CMP-000048",
    "name": "Myntra",
    "slug": "myntra",
    "careerUrl": "https://careers.myntra.com/",
    "officialWebsite": "https://www.myntra.com",
    "industry": "Fashion E-Commerce",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Myntra Designs"
    ]
  },
  {
    "canonicalIndex": 49,
    "companyId": "CMP-000049",
    "name": "PhonePe",
    "slug": "phonepe",
    "careerUrl": "https://www.phonepe.com/careers/",
    "officialWebsite": "https://www.phonepe.com",
    "industry": "Digital Payments & Financial Services",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Pune",
      "Mumbai"
    ],
    "aliases": [
      "PhonePe Private Limited"
    ]
  },
  {
    "canonicalIndex": 50,
    "companyId": "CMP-000050",
    "name": "Paytm",
    "slug": "paytm",
    "careerUrl": "https://jobs.paytm.com/",
    "officialWebsite": "https://paytm.com",
    "industry": "Fintech, Payments & E-Commerce",
    "country": "India",
    "primaryLocations": [
      "Noida",
      "Bengaluru"
    ],
    "aliases": [
      "One97 Communications",
      "Paytm Payments Bank"
    ]
  },
  {
    "canonicalIndex": 51,
    "companyId": "CMP-000051",
    "name": "Razorpay",
    "slug": "razorpay",
    "careerUrl": "https://razorpay.com/jobs/",
    "officialWebsite": "https://razorpay.com",
    "industry": "Payment Gateway & Banking Tech",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Razorpay Software",
      "Razorpay Payments"
    ]
  },
  {
    "canonicalIndex": 52,
    "companyId": "CMP-000052",
    "name": "CRED",
    "slug": "cred",
    "careerUrl": "https://careers.cred.club/",
    "officialWebsite": "https://cred.club",
    "industry": "Fintech & Premium Rewards Platform",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Dreamplug Technologies",
      "CRED Club"
    ],
    "verifiedAts": {
      "atsType": "LEVER",
      "boardToken": "cred"
    }
  },
  {
    "canonicalIndex": 53,
    "companyId": "CMP-000053",
    "name": "Zerodha",
    "slug": "zerodha",
    "careerUrl": "https://zerodha.com/careers/",
    "officialWebsite": "https://zerodha.com",
    "industry": "Discount Broking & Wealth Tech",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Zerodha Broking Ltd"
    ]
  },
  {
    "canonicalIndex": 54,
    "companyId": "CMP-000054",
    "name": "PolicyBazaar",
    "slug": "policybazaar",
    "careerUrl": "https://www.policybazaar.com/careers/",
    "officialWebsite": "https://www.policybazaar.com",
    "industry": "Insurtech & Financial Aggregation",
    "country": "India",
    "primaryLocations": [
      "Gurgaon"
    ],
    "aliases": [
      "PB Fintech",
      "PolicyBazaar Insurance Brokers"
    ]
  },
  {
    "canonicalIndex": 55,
    "companyId": "CMP-000055",
    "name": "BYJU'S",
    "slug": "byjus",
    "careerUrl": "https://careers.byjus.com/",
    "officialWebsite": "https://byjus.com",
    "industry": "EdTech & Learning Platforms",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Byjus",
      "Think & Learn Pvt Ltd"
    ]
  },
  {
    "canonicalIndex": 56,
    "companyId": "CMP-000056",
    "name": "Unacademy",
    "slug": "unacademy",
    "careerUrl": "https://unacademy.com/careers",
    "officialWebsite": "https://unacademy.com",
    "industry": "EdTech & Test Prep",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Sorting Hat Technologies",
      "Unacademy Group"
    ]
  },
  {
    "canonicalIndex": 57,
    "companyId": "CMP-000057",
    "name": "Udaan",
    "slug": "udaan",
    "careerUrl": "https://udaan.com/careers",
    "officialWebsite": "https://udaan.com",
    "industry": "B2B E-Commerce & Supply Chain",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Hiveloop Technology",
      "Udaan B2B"
    ]
  },
  {
    "canonicalIndex": 58,
    "companyId": "CMP-000058",
    "name": "Meesho",
    "slug": "meesho",
    "careerUrl": "https://careers.meesho.com/",
    "officialWebsite": "https://www.meesho.com",
    "industry": "Social Commerce & Marketplace",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Fashnear Technologies",
      "Meesho Inc"
    ],
    "verifiedAts": {
      "atsType": "LEVER",
      "boardToken": "meesho"
    }
  },
  {
    "canonicalIndex": 59,
    "companyId": "CMP-000059",
    "name": "Delhivery",
    "slug": "delhivery",
    "careerUrl": "https://www.delhivery.com/careers",
    "officialWebsite": "https://www.delhivery.com",
    "industry": "Logistics & Supply Chain Services",
    "country": "India",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru"
    ],
    "aliases": [
      "Delhivery Limited",
      "Delhivery Ltd"
    ]
  },
  {
    "canonicalIndex": 60,
    "companyId": "CMP-000060",
    "name": "Nykaa",
    "slug": "nykaa",
    "careerUrl": "https://www.nykaa.com/careers",
    "officialWebsite": "https://www.nykaa.com",
    "industry": "Beauty & Lifestyle E-Commerce",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Gurgaon"
    ],
    "aliases": [
      "FSN E-Commerce Ventures",
      "Nykaa E-Retail"
    ]
  },
  {
    "canonicalIndex": 61,
    "companyId": "CMP-000061",
    "name": "BigBasket",
    "slug": "bigbasket",
    "careerUrl": "https://www.bigbasket.com/careers/",
    "officialWebsite": "https://www.bigbasket.com",
    "industry": "Online Grocery & Quick Commerce",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Supermarket Grocery Supplies",
      "Innovative Retail Concepts"
    ]
  },
  {
    "canonicalIndex": 62,
    "companyId": "CMP-000062",
    "name": "Urban Company",
    "slug": "urban-company",
    "careerUrl": "https://careers.urbancompany.com/",
    "officialWebsite": "https://www.urbancompany.com",
    "industry": "Home Services & Tech Marketplace",
    "country": "India",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru"
    ],
    "aliases": [
      "UrbanClap",
      "Urban Company Ltd"
    ]
  },
  {
    "canonicalIndex": 63,
    "companyId": "CMP-000063",
    "name": "Dream11 (Dream Sports)",
    "slug": "dream11",
    "careerUrl": "https://dreamsports.group/careers/",
    "officialWebsite": "https://dreamsports.group",
    "industry": "Sports Tech & Gaming",
    "country": "India",
    "primaryLocations": [
      "Mumbai"
    ],
    "aliases": [
      "Dream11",
      "Dream Sports",
      "Sporta Technologies"
    ]
  },
  {
    "canonicalIndex": 64,
    "companyId": "CMP-000064",
    "name": "MakeMyTrip",
    "slug": "makemytrip",
    "careerUrl": "https://careers.makemytrip.com/",
    "officialWebsite": "https://www.makemytrip.com",
    "industry": "Online Travel & Ticketing",
    "country": "India",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru"
    ],
    "aliases": [
      "MakeMyTrip India",
      "MMT",
      "Goibibo"
    ]
  },
  {
    "canonicalIndex": 65,
    "companyId": "CMP-000065",
    "name": "CARS24",
    "slug": "cars24",
    "careerUrl": "https://www.cars24.com/careers/",
    "officialWebsite": "https://www.cars24.com",
    "industry": "AutoTech & Pre-Owned Car Marketplace",
    "country": "India",
    "primaryLocations": [
      "Gurgaon"
    ],
    "aliases": [
      "Cars24 Services"
    ]
  },
  {
    "canonicalIndex": 66,
    "companyId": "CMP-000066",
    "name": "Lenskart",
    "slug": "lenskart",
    "careerUrl": "https://careers.lenskart.com/",
    "officialWebsite": "https://www.lenskart.com",
    "industry": "Eyewear Retail & Direct-to-Consumer",
    "country": "India",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru"
    ],
    "aliases": [
      "Lenskart Solutions"
    ]
  },
  {
    "canonicalIndex": 67,
    "companyId": "CMP-000067",
    "name": "Ather Energy",
    "slug": "ather-energy",
    "careerUrl": "https://www.atherenergy.com/careers",
    "officialWebsite": "https://www.atherenergy.com",
    "industry": "Electric Vehicles & Clean Mobility",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Hosur"
    ],
    "aliases": [
      "Ather",
      "Ather Energy Pvt Ltd"
    ]
  },
  {
    "canonicalIndex": 68,
    "companyId": "CMP-000068",
    "name": "Ola Electric",
    "slug": "ola-electric",
    "careerUrl": "https://olaelectric.com/careers",
    "officialWebsite": "https://olaelectric.com",
    "industry": "Electric Two-Wheelers & Battery Tech",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Krishnagiri"
    ],
    "aliases": [
      "Ola Electric Mobility"
    ]
  },
  {
    "canonicalIndex": 69,
    "companyId": "CMP-000069",
    "name": "HDFC Bank",
    "slug": "hdfc-bank",
    "careerUrl": "https://www.hdfcbank.com/personal/about-us/careers",
    "officialWebsite": "https://www.hdfcbank.com",
    "industry": "Banking & Financial Services",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Chennai",
      "Noida",
      "Bengaluru"
    ],
    "aliases": [
      "HDFC Bank Limited"
    ]
  },
  {
    "canonicalIndex": 70,
    "companyId": "CMP-000070",
    "name": "ICICI Bank",
    "slug": "icici-bank",
    "careerUrl": "https://www.icicicareers.com/",
    "officialWebsite": "https://www.icicibank.com",
    "industry": "Banking & Financial Services",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Hyderabad",
      "Bengaluru"
    ],
    "aliases": [
      "ICICI Bank Limited"
    ]
  },
  {
    "canonicalIndex": 71,
    "companyId": "CMP-000071",
    "name": "Axis Bank",
    "slug": "axis-bank",
    "careerUrl": "https://www.axisbank.com/careers",
    "officialWebsite": "https://www.axisbank.com",
    "industry": "Banking & Financial Services",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Kolkata",
      "Bengaluru"
    ],
    "aliases": [
      "Axis Bank Limited"
    ]
  },
  {
    "canonicalIndex": 72,
    "companyId": "CMP-000072",
    "name": "Kotak Mahindra Bank",
    "slug": "kotak-mahindra-bank",
    "careerUrl": "https://www.kotak.com/en/careers.html",
    "officialWebsite": "https://www.kotak.com",
    "industry": "Banking & Financial Services",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Noida",
      "Bengaluru"
    ],
    "aliases": [
      "Kotak Mahindra",
      "Kotak Bank"
    ]
  },
  {
    "canonicalIndex": 73,
    "companyId": "CMP-000073",
    "name": "State Bank of India",
    "slug": "state-bank-of-india",
    "careerUrl": "https://bank.sbi/web/careers",
    "officialWebsite": "https://bank.sbi",
    "industry": "Public Sector Banking",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Pan India"
    ],
    "aliases": [
      "SBI",
      "State Bank"
    ]
  },
  {
    "canonicalIndex": 74,
    "companyId": "CMP-000074",
    "name": "IndusInd Bank",
    "slug": "indusind-bank",
    "careerUrl": "https://www.indusind.com/in/en/personal/careers.html",
    "officialWebsite": "https://www.indusind.com",
    "industry": "Banking & Financial Services",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Pune",
      "Gurgaon"
    ],
    "aliases": [
      "IndusInd Bank Limited"
    ]
  },
  {
    "canonicalIndex": 75,
    "companyId": "CMP-000075",
    "name": "Bank of Baroda",
    "slug": "bank-of-baroda",
    "careerUrl": "https://www.bankofbaroda.in/careers",
    "officialWebsite": "https://www.bankofbaroda.in",
    "industry": "Public Sector Banking",
    "country": "India",
    "primaryLocations": [
      "Vadodara",
      "Mumbai",
      "Pan India"
    ],
    "aliases": [
      "BOB",
      "Bank of Baroda Ltd"
    ]
  },
  {
    "canonicalIndex": 76,
    "companyId": "CMP-000076",
    "name": "IDFC FIRST Bank",
    "slug": "idfc-first-bank",
    "careerUrl": "https://www.idfcfirstbank.com/careers",
    "officialWebsite": "https://www.idfcfirstbank.com",
    "industry": "Banking & Financial Services",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "IDFC First",
      "IDFC First Bank Limited"
    ]
  },
  {
    "canonicalIndex": 77,
    "companyId": "CMP-000077",
    "name": "Bajaj Finserv",
    "slug": "bajaj-finserv",
    "careerUrl": "https://www.bajajfinserv.in/careers",
    "officialWebsite": "https://www.bajajfinserv.in",
    "industry": "Financial Services & Lending",
    "country": "India",
    "primaryLocations": [
      "Pune",
      "Bengaluru"
    ],
    "aliases": [
      "Bajaj Finance",
      "Bajaj Finserv Limited",
      "Bajaj Housing Finance"
    ]
  },
  {
    "canonicalIndex": 78,
    "companyId": "CMP-000078",
    "name": "Aditya Birla Capital",
    "slug": "aditya-birla-capital",
    "careerUrl": "https://careers.adityabirlacapital.com/",
    "officialWebsite": "https://www.adityabirlacapital.com",
    "industry": "Financial Services & Asset Management",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "ABC",
      "ABC (Aditya Birla Capital)",
      "Aditya Birla Finance",
      "Aditya Birla Group"
    ]
  },
  {
    "canonicalIndex": 79,
    "companyId": "CMP-000079",
    "name": "Tata Capital",
    "slug": "tata-capital",
    "careerUrl": "https://www.tatacapital.com/careers.html",
    "officialWebsite": "https://www.tatacapital.com",
    "industry": "Financial Services & Wealth Management",
    "country": "India",
    "primaryLocations": [
      "Mumbai"
    ],
    "aliases": [
      "Tata Capital Financial Services"
    ]
  },
  {
    "canonicalIndex": 80,
    "companyId": "CMP-000080",
    "name": "HDFC Life",
    "slug": "hdfc-life",
    "careerUrl": "https://www.hdfclife.com/careers",
    "officialWebsite": "https://www.hdfclife.com",
    "industry": "Life Insurance",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "HDFC Life Insurance",
      "HDFC Standard Life"
    ]
  },
  {
    "canonicalIndex": 81,
    "companyId": "CMP-000081",
    "name": "ICICI Prudential Life",
    "slug": "icici-prudential-life",
    "careerUrl": "https://www.iciciprulife.com/careers.html",
    "officialWebsite": "https://www.iciciprulife.com",
    "industry": "Life Insurance",
    "country": "India",
    "primaryLocations": [
      "Mumbai"
    ],
    "aliases": [
      "ICICI Prudential",
      "ICICI Pru Life"
    ]
  },
  {
    "canonicalIndex": 82,
    "companyId": "CMP-000082",
    "name": "SBI Life Insurance",
    "slug": "sbi-life-insurance",
    "careerUrl": "https://www.sbilife.co.in/en/careers",
    "officialWebsite": "https://www.sbilife.co.in",
    "industry": "Life Insurance",
    "country": "India",
    "primaryLocations": [
      "Mumbai"
    ],
    "aliases": [
      "SBI Life"
    ]
  },
  {
    "canonicalIndex": 83,
    "companyId": "CMP-000083",
    "name": "LIC of India",
    "slug": "lic-of-india",
    "careerUrl": "https://licindia.in/careers",
    "officialWebsite": "https://licindia.in",
    "industry": "Life Insurance & Investments",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Pan India"
    ],
    "aliases": [
      "LIC",
      "Life Insurance Corporation of India"
    ]
  },
  {
    "canonicalIndex": 84,
    "companyId": "CMP-000084",
    "name": "Deloitte India",
    "slug": "deloitte-india",
    "careerUrl": "https://www2.deloitte.com/in/en/careers.html",
    "officialWebsite": "https://www2.deloitte.com",
    "industry": "Audit, Consulting & Advisory Services",
    "country": "United Kingdom",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru",
      "Mumbai",
      "Gurgaon"
    ],
    "aliases": [
      "Deloitte",
      "Deloitte Consulting",
      "Deloitte Touche Tohmatsu",
      "Deloitte India"
    ]
  },
  {
    "canonicalIndex": 85,
    "companyId": "CMP-000085",
    "name": "EY India",
    "slug": "ey-india",
    "careerUrl": "https://www.ey.com/en_in/careers",
    "officialWebsite": "https://www.ey.com",
    "industry": "Assurance, Tax & Advisory Services",
    "country": "United Kingdom",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "EY",
      "Ernst & Young",
      "Ernst and Young",
      "EY India"
    ]
  },
  {
    "canonicalIndex": 86,
    "companyId": "CMP-000086",
    "name": "KPMG India",
    "slug": "kpmg-india",
    "careerUrl": "https://home.kpmg/in/en/home/careers.html",
    "officialWebsite": "https://home.kpmg",
    "industry": "Audit, Tax & Advisory Services",
    "country": "Netherlands",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru",
      "Gurgaon",
      "Pune"
    ],
    "aliases": [
      "KPMG",
      "KPMG Advisory",
      "KPMG India"
    ]
  },
  {
    "canonicalIndex": 87,
    "companyId": "CMP-000087",
    "name": "PwC India",
    "slug": "pwc-india",
    "careerUrl": "https://www.pwc.in/careers.html",
    "officialWebsite": "https://www.pwc.in",
    "industry": "Tax, Advisory & Assurance Services",
    "country": "United Kingdom",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon",
      "Mumbai",
      "Kolkata"
    ],
    "aliases": [
      "PwC",
      "PricewaterhouseCoopers",
      "PwC US Advisory",
      "PwC AC",
      "PwC India"
    ]
  },
  {
    "canonicalIndex": 88,
    "companyId": "CMP-000088",
    "name": "McKinsey & Company",
    "slug": "mckinsey-and-company",
    "careerUrl": "https://www.mckinsey.com/careers",
    "officialWebsite": "https://www.mckinsey.com",
    "industry": "Management & Strategy Consulting",
    "country": "United States",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru",
      "Mumbai"
    ],
    "aliases": [
      "McKinsey",
      "McKinsey Digital"
    ]
  },
  {
    "canonicalIndex": 89,
    "companyId": "CMP-000089",
    "name": "Boston Consulting Group",
    "slug": "boston-consulting-group",
    "careerUrl": "https://careers.bcg.com/",
    "officialWebsite": "https://www.bcg.com",
    "industry": "Management & Strategy Consulting",
    "country": "United States",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru",
      "Gurgaon"
    ],
    "aliases": [
      "BCG",
      "Boston Consulting"
    ]
  },
  {
    "canonicalIndex": 90,
    "companyId": "CMP-000090",
    "name": "Bain & Company",
    "slug": "bain-and-company",
    "careerUrl": "https://www.bain.com/careers/",
    "officialWebsite": "https://www.bain.com",
    "industry": "Management & Strategy Consulting",
    "country": "United States",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru",
      "Mumbai"
    ],
    "aliases": [
      "Bain"
    ]
  },
  {
    "canonicalIndex": 91,
    "companyId": "CMP-000091",
    "name": "Grant Thornton Bharat",
    "slug": "grant-thornton-bharat",
    "careerUrl": "https://www.grantthornton.in/careers/",
    "officialWebsite": "https://www.grantthornton.in",
    "industry": "Accounting & Financial Advisory",
    "country": "India",
    "primaryLocations": [
      "Delhi NCR",
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "Grant Thornton",
      "GT Bharat"
    ]
  },
  {
    "canonicalIndex": 92,
    "companyId": "CMP-000092",
    "name": "Genpact",
    "slug": "genpact",
    "careerUrl": "https://www.genpact.com/careers",
    "officialWebsite": "https://www.genpact.com",
    "industry": "Business Process Management & Digital Transformation",
    "country": "United States",
    "primaryLocations": [
      "Gurgaon",
      "Hyderabad",
      "Bengaluru",
      "Noida"
    ],
    "aliases": [
      "Genpact India",
      "GE Capital"
    ]
  },
  {
    "canonicalIndex": 93,
    "companyId": "CMP-000093",
    "name": "WNS Global Services",
    "slug": "wns-global-services",
    "careerUrl": "https://www.wns.com/careers",
    "officialWebsite": "https://www.wns.com",
    "industry": "BPO & Analytics Solutions",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Pune",
      "Gurgaon"
    ],
    "aliases": [
      "WNS",
      "WNS Global"
    ]
  },
  {
    "canonicalIndex": 94,
    "companyId": "CMP-000094",
    "name": "EXL Service",
    "slug": "exl-service",
    "careerUrl": "https://www.exlservice.com/careers",
    "officialWebsite": "https://www.exlservice.com",
    "industry": "Operations Management & Analytics",
    "country": "United States",
    "primaryLocations": [
      "Noida",
      "Gurgaon",
      "Bengaluru"
    ],
    "aliases": [
      "EXL",
      "EXLService"
    ]
  },
  {
    "canonicalIndex": 95,
    "companyId": "CMP-000095",
    "name": "Concentrix",
    "slug": "concentrix",
    "careerUrl": "https://careers.concentrix.com/",
    "officialWebsite": "https://www.concentrix.com",
    "industry": "Customer Experience Solutions & Technology",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon",
      "Hyderabad",
      "Pune"
    ],
    "aliases": [
      "Concentrix Services",
      "CNX"
    ]
  },
  {
    "canonicalIndex": 96,
    "companyId": "CMP-000096",
    "name": "Teleperformance",
    "slug": "teleperformance",
    "careerUrl": "https://www.teleperformance.com/en-us/careers/",
    "officialWebsite": "https://www.teleperformance.com",
    "industry": "Digital Business Services & CX",
    "country": "France",
    "primaryLocations": [
      "Gurgaon",
      "Mumbai",
      "Jaipur",
      "Hyderabad"
    ],
    "aliases": [
      "Teleperformance India",
      "TP"
    ]
  },
  {
    "canonicalIndex": 97,
    "companyId": "CMP-000097",
    "name": "[24]7.ai",
    "slug": "24-7-ai",
    "careerUrl": "https://www.247.ai/careers",
    "officialWebsite": "https://www.247.ai",
    "industry": "Conversational AI & Customer Engagement",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "24/7.ai",
      "247.ai",
      "24/7 Customer"
    ]
  },
  {
    "canonicalIndex": 98,
    "companyId": "CMP-000098",
    "name": "Firstsource Solutions",
    "slug": "firstsource-solutions",
    "careerUrl": "https://www.firstsource.com/careers/",
    "officialWebsite": "https://www.firstsource.com",
    "industry": "Business Process Management",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru",
      "Chennai"
    ],
    "aliases": [
      "Firstsource"
    ]
  },
  {
    "canonicalIndex": 99,
    "companyId": "CMP-000099",
    "name": "Sutherland Global Services",
    "slug": "sutherland-global-services",
    "careerUrl": "https://www.sutherlandglobal.com/careers",
    "officialWebsite": "https://www.sutherlandglobal.com",
    "industry": "Digital Transformation & Customer Engagement",
    "country": "United States",
    "primaryLocations": [
      "Chennai",
      "Bengaluru",
      "Hyderabad",
      "Kochi"
    ],
    "aliases": [
      "Sutherland",
      "Sutherland Global"
    ]
  },
  {
    "canonicalIndex": 100,
    "companyId": "CMP-000100",
    "name": "Justdial",
    "slug": "justdial",
    "careerUrl": "https://www.justdial.com/careers",
    "officialWebsite": "https://www.justdial.com",
    "industry": "Local Search Engine & Hyperlocal Marketplace",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru",
      "Delhi NCR"
    ],
    "aliases": [
      "Just Dial",
      "Justdial Ltd"
    ]
  },
  {
    "canonicalIndex": 101,
    "companyId": "CMP-000101",
    "name": "Info Edge (Naukri.com)",
    "slug": "info-edge-naukri-com",
    "careerUrl": "https://www.infoedge.in/careers",
    "officialWebsite": "https://www.infoedge.in",
    "industry": "Internet Classifieds & Recruitment Tech",
    "country": "India",
    "primaryLocations": [
      "Noida"
    ],
    "aliases": [
      "Info Edge",
      "Naukri",
      "Naukri.com",
      "InfoEdge"
    ]
  },
  {
    "canonicalIndex": 102,
    "companyId": "CMP-000102",
    "name": "IndiaMART",
    "slug": "indiamart",
    "careerUrl": "https://www.indiamart.com/careers/",
    "officialWebsite": "https://www.indiamart.com",
    "industry": "B2B E-Commerce Marketplace",
    "country": "India",
    "primaryLocations": [
      "Noida"
    ],
    "aliases": [
      "IndiaMART InterMESH"
    ]
  },
  {
    "canonicalIndex": 103,
    "companyId": "CMP-000103",
    "name": "Shiprocket",
    "slug": "shiprocket",
    "careerUrl": "https://www.shiprocket.in/careers/",
    "officialWebsite": "https://www.shiprocket.in",
    "industry": "E-Commerce Logistics & Shipping Automation",
    "country": "India",
    "primaryLocations": [
      "Gurgaon"
    ],
    "aliases": [
      "BigFoot Retail Solutions",
      "Shiprocket India"
    ]
  },
  {
    "canonicalIndex": 104,
    "companyId": "CMP-000104",
    "name": "BlackBuck",
    "slug": "blackbuck",
    "careerUrl": "https://www.blackbuck.com/careers",
    "officialWebsite": "https://www.blackbuck.com",
    "industry": "Logistics Tech & Trucking Marketplace",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Zinka Logistics Solutions",
      "BlackBuck Logistics"
    ]
  },
  {
    "canonicalIndex": 105,
    "companyId": "CMP-000105",
    "name": "PharmEasy",
    "slug": "pharmeasy",
    "careerUrl": "https://pharmeasy.in/careers/",
    "officialWebsite": "https://pharmeasy.in",
    "industry": "HealthTech & Online Pharmacy",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "API Holdings",
      "PharmEasy India"
    ]
  },
  {
    "canonicalIndex": 106,
    "companyId": "CMP-000106",
    "name": "Tata 1mg",
    "slug": "tata-1mg",
    "careerUrl": "https://www.1mg.com/careers",
    "officialWebsite": "https://www.1mg.com",
    "industry": "Digital Health & E-Pharmacy",
    "country": "India",
    "primaryLocations": [
      "Gurgaon"
    ],
    "aliases": [
      "1mg",
      "Tata 1mg Technologies"
    ]
  },
  {
    "canonicalIndex": 107,
    "companyId": "CMP-000107",
    "name": "Cult.fit",
    "slug": "cult-fit",
    "careerUrl": "https://www.cult.fit/careers",
    "officialWebsite": "https://www.cult.fit",
    "industry": "Fitness Tech & Preventive Healthcare",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Cure.fit",
      "Cultfit Healthcare"
    ]
  },
  {
    "canonicalIndex": 108,
    "companyId": "CMP-000108",
    "name": "Licious",
    "slug": "licious",
    "careerUrl": "https://www.licious.in/careers",
    "officialWebsite": "https://www.licious.in",
    "industry": "Direct-to-Consumer Meat & Seafood",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Delightful Gourmet",
      "Licious Fresh"
    ]
  },
  {
    "canonicalIndex": 109,
    "companyId": "CMP-000109",
    "name": "Zetwerk",
    "slug": "zetwerk",
    "careerUrl": "https://www.zetwerk.com/careers",
    "officialWebsite": "https://www.zetwerk.com",
    "industry": "Custom Manufacturing & Global Supply Chain",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Zetwerk Manufacturing"
    ]
  },
  {
    "canonicalIndex": 110,
    "companyId": "CMP-000110",
    "name": "Innovaccer",
    "slug": "innovaccer",
    "careerUrl": "https://innovaccer.com/careers",
    "officialWebsite": "https://innovaccer.com",
    "industry": "Health Cloud & Healthcare Data Analytics",
    "country": "United States",
    "primaryLocations": [
      "Noida",
      "Bengaluru"
    ],
    "aliases": [
      "Innovaccer Inc"
    ]
  },
  {
    "canonicalIndex": 111,
    "companyId": "CMP-000111",
    "name": "Postman",
    "slug": "postman",
    "careerUrl": "https://www.postman.com/careers/",
    "officialWebsite": "https://www.postman.com",
    "industry": "API Development & Collaboration Platform",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Postman Inc",
      "Postdot Technologies"
    ]
  },
  {
    "canonicalIndex": 112,
    "companyId": "CMP-000112",
    "name": "Chargebee",
    "slug": "chargebee",
    "careerUrl": "https://www.chargebee.com/careers/",
    "officialWebsite": "https://www.chargebee.com",
    "industry": "Subscription Billing & Revenue Management",
    "country": "United States",
    "primaryLocations": [
      "Chennai",
      "Bengaluru"
    ],
    "aliases": [
      "Chargebee Inc"
    ]
  },
  {
    "canonicalIndex": 113,
    "companyId": "CMP-000113",
    "name": "Darwinbox",
    "slug": "darwinbox",
    "careerUrl": "https://darwinbox.com/careers",
    "officialWebsite": "https://darwinbox.com",
    "industry": "HR Tech & Human Capital Management SaaS",
    "country": "India",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru"
    ],
    "aliases": [
      "Darwinbox Digital Solutions"
    ]
  },
  {
    "canonicalIndex": 114,
    "companyId": "CMP-000114",
    "name": "BrowserStack",
    "slug": "browserstack",
    "careerUrl": "https://www.browserstack.com/careers",
    "officialWebsite": "https://www.browserstack.com",
    "industry": "Software Testing & Cloud Infrastructure",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "BrowserStack Inc"
    ]
  },
  {
    "canonicalIndex": 115,
    "companyId": "CMP-000115",
    "name": "Druva",
    "slug": "druva",
    "careerUrl": "https://www.druva.com/careers/",
    "officialWebsite": "https://www.druva.com",
    "industry": "Cloud Data Protection & Resilience SaaS",
    "country": "United States",
    "primaryLocations": [
      "Pune",
      "Bengaluru"
    ],
    "aliases": [
      "Druva Inc"
    ],
    "verifiedAts": {
      "atsType": "GREENHOUSE",
      "boardToken": "druva"
    }
  },
  {
    "canonicalIndex": 116,
    "companyId": "CMP-000116",
    "name": "MoEngage",
    "slug": "moengage",
    "careerUrl": "https://www.moengage.com/careers/",
    "officialWebsite": "https://www.moengage.com",
    "industry": "Customer Engagement & Omnichannel Marketing",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "MoEngage Inc"
    ]
  },
  {
    "canonicalIndex": 117,
    "companyId": "CMP-000117",
    "name": "CleverTap",
    "slug": "clevertap",
    "careerUrl": "https://clevertap.com/careers/",
    "officialWebsite": "https://clevertap.com",
    "industry": "Customer Lifecycle Management & Retention Cloud",
    "country": "United States",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "CleverTap Inc",
      "WizRocket"
    ]
  },
  {
    "canonicalIndex": 118,
    "companyId": "CMP-000118",
    "name": "Icertis",
    "slug": "icertis",
    "careerUrl": "https://www.icertis.com/company/careers/",
    "officialWebsite": "https://www.icertis.com",
    "industry": "Contract Intelligence & Enterprise Software",
    "country": "United States",
    "primaryLocations": [
      "Pune"
    ],
    "aliases": [
      "Icertis Inc"
    ]
  },
  {
    "canonicalIndex": 119,
    "companyId": "CMP-000119",
    "name": "Whatfix",
    "slug": "whatfix",
    "careerUrl": "https://whatfix.com/careers/",
    "officialWebsite": "https://whatfix.com",
    "industry": "Digital Adoption Solutions (DAS)",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Whatfix Inc",
      "Quickleap Tech"
    ]
  },
  {
    "canonicalIndex": 120,
    "companyId": "CMP-000120",
    "name": "Yellow.ai",
    "slug": "yellow-ai",
    "careerUrl": "https://yellow.ai/careers/",
    "officialWebsite": "https://yellow.ai",
    "industry": "Enterprise Conversational AI & Agentic Chat",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Yellow Messenger",
      "Yellow.ai Inc"
    ]
  },
  {
    "canonicalIndex": 121,
    "companyId": "CMP-000121",
    "name": "Haptik",
    "slug": "haptik",
    "careerUrl": "https://haptik.ai/careers",
    "officialWebsite": "https://haptik.ai",
    "industry": "Conversational Commerce & AI Assistants",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "Jio Haptik",
      "Haptik Infotech"
    ]
  },
  {
    "canonicalIndex": 122,
    "companyId": "CMP-000122",
    "name": "upGrad",
    "slug": "upgrad",
    "careerUrl": "https://www.upgrad.com/careers/",
    "officialWebsite": "https://www.upgrad.com",
    "industry": "Higher Education & Professional Upskilling",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "upGrad Education Pvt Ltd"
    ]
  },
  {
    "canonicalIndex": 123,
    "companyId": "CMP-000123",
    "name": "Vedantu",
    "slug": "vedantu",
    "careerUrl": "https://vedantu.com/careers",
    "officialWebsite": "https://vedantu.com",
    "industry": "Interactive Live Online Tutoring",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Vedantu Innovations"
    ]
  },
  {
    "canonicalIndex": 124,
    "companyId": "CMP-000124",
    "name": "Physics Wallah",
    "slug": "physics-wallah",
    "careerUrl": "https://www.pw.live/careers",
    "officialWebsite": "https://www.pw.live",
    "industry": "Affordable EdTech & Test Preparation",
    "country": "India",
    "primaryLocations": [
      "Noida"
    ],
    "aliases": [
      "PW",
      "PhysicsWallah"
    ]
  },
  {
    "canonicalIndex": 125,
    "companyId": "CMP-000125",
    "name": "Simplilearn",
    "slug": "simplilearn",
    "careerUrl": "https://www.simplilearn.com/careers",
    "officialWebsite": "https://www.simplilearn.com",
    "industry": "Digital Skills Training & Certification",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Simplilearn Solutions"
    ]
  },
  {
    "canonicalIndex": 126,
    "companyId": "CMP-000126",
    "name": "Great Learning",
    "slug": "great-learning",
    "careerUrl": "https://www.mygreatlearning.com/careers",
    "officialWebsite": "https://www.mygreatlearning.com",
    "industry": "Professional Education & Degree Programs",
    "country": "India",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon"
    ],
    "aliases": [
      "Great Lakes E-Learning"
    ]
  },
  {
    "canonicalIndex": 127,
    "companyId": "CMP-000127",
    "name": "Walmart Global Tech India",
    "slug": "walmart-global-tech-india",
    "careerUrl": "https://tech.walmart.com/careers",
    "officialWebsite": "https://tech.walmart.com",
    "industry": "Retail Tech & Supply Chain Engineering",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Chennai",
      "Gurgaon"
    ],
    "aliases": [
      "Walmart Labs",
      "Walmart Global Tech",
      "Walmart India"
    ]
  },
  {
    "canonicalIndex": 128,
    "companyId": "CMP-000128",
    "name": "Target Corporation India",
    "slug": "target-corporation-india",
    "careerUrl": "https://india.target.com/careers",
    "officialWebsite": "https://india.target.com",
    "industry": "Retail Engineering & Merchandising Analytics",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Target India",
      "Target In India"
    ]
  },
  {
    "canonicalIndex": 129,
    "companyId": "CMP-000129",
    "name": "Goldman Sachs",
    "slug": "goldman-sachs",
    "careerUrl": "https://www.goldmansachs.com/careers/",
    "officialWebsite": "https://www.goldmansachs.com",
    "industry": "Investment Banking & Quantitative Technology",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "Goldman Sachs India",
      "GS"
    ]
  },
  {
    "canonicalIndex": 130,
    "companyId": "CMP-000130",
    "name": "Morgan Stanley",
    "slug": "morgan-stanley",
    "careerUrl": "https://www.morganstanley.com/careers",
    "officialWebsite": "https://www.morganstanley.com",
    "industry": "Investment Banking, Wealth Management & Fintech",
    "country": "United States",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "Morgan Stanley India",
      "MS"
    ]
  },
  {
    "canonicalIndex": 131,
    "companyId": "CMP-000131",
    "name": "JPMorgan Chase",
    "slug": "jpmorgan-chase",
    "careerUrl": "https://careers.jpmorgan.com/",
    "officialWebsite": "https://www.jpmorganchase.com",
    "industry": "Financial Services & Global Investment Banking",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "JPMC",
      "JPMorgan",
      "J.P. Morgan",
      "JPMorgan Chase Bank"
    ]
  },
  {
    "canonicalIndex": 132,
    "companyId": "CMP-000132",
    "name": "Barclays",
    "slug": "barclays",
    "careerUrl": "https://home.barclays/careers/",
    "officialWebsite": "https://home.barclays",
    "industry": "Universal Banking & Capital Markets",
    "country": "United Kingdom",
    "primaryLocations": [
      "Pune",
      "Noida",
      "Chennai"
    ],
    "aliases": [
      "Barclays Global Service Centre",
      "Barclays India"
    ]
  },
  {
    "canonicalIndex": 133,
    "companyId": "CMP-000133",
    "name": "Deutsche Bank",
    "slug": "deutsche-bank",
    "careerUrl": "https://careers.db.com/",
    "officialWebsite": "https://www.db.com",
    "industry": "Investment Banking & Corporate Finance",
    "country": "Germany",
    "primaryLocations": [
      "Pune",
      "Bengaluru",
      "Mumbai"
    ],
    "aliases": [
      "DB",
      "Deutsche Bank Group"
    ]
  },
  {
    "canonicalIndex": 134,
    "companyId": "CMP-000134",
    "name": "HSBC",
    "slug": "hsbc",
    "careerUrl": "https://www.hsbc.com/careers",
    "officialWebsite": "https://www.hsbc.com",
    "industry": "International Banking & Financial Markets",
    "country": "United Kingdom",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru",
      "Kolkata",
      "Pune"
    ],
    "aliases": [
      "HSBC Global Service Centres",
      "HSBC India"
    ]
  },
  {
    "canonicalIndex": 135,
    "companyId": "CMP-000135",
    "name": "Citi",
    "slug": "citi",
    "careerUrl": "https://jobs.citi.com/",
    "officialWebsite": "https://www.citi.com",
    "industry": "Global Consumer Banking & Institutional Clients",
    "country": "United States",
    "primaryLocations": [
      "Mumbai",
      "Pune",
      "Chennai",
      "Bengaluru"
    ],
    "aliases": [
      "Citigroup",
      "Citibank",
      "Citi India"
    ]
  },
  {
    "canonicalIndex": 136,
    "companyId": "CMP-000136",
    "name": "American Express",
    "slug": "american-express",
    "careerUrl": "https://www.americanexpress.com/en-us/careers/",
    "officialWebsite": "https://www.americanexpress.com",
    "industry": "Payment Cards & Premium Financial Services",
    "country": "United States",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru"
    ],
    "aliases": [
      "Amex",
      "American Express India"
    ]
  },
  {
    "canonicalIndex": 137,
    "companyId": "CMP-000137",
    "name": "Standard Chartered",
    "slug": "standard-chartered",
    "careerUrl": "https://www.sc.com/en/careers/",
    "officialWebsite": "https://www.sc.com",
    "industry": "Cross-Border Banking & Wealth Management",
    "country": "United Kingdom",
    "primaryLocations": [
      "Chennai",
      "Bengaluru"
    ],
    "aliases": [
      "Standard Chartered Bank",
      "StanChart",
      "SCB"
    ]
  },
  {
    "canonicalIndex": 138,
    "companyId": "CMP-000138",
    "name": "UBS",
    "slug": "ubs",
    "careerUrl": "https://www.ubs.com/careers",
    "officialWebsite": "https://www.ubs.com",
    "industry": "Wealth Management & Investment Advisory",
    "country": "Switzerland",
    "primaryLocations": [
      "Pune",
      "Mumbai",
      "Hyderabad"
    ],
    "aliases": [
      "UBS India",
      "UBS Business Solutions"
    ]
  },
  {
    "canonicalIndex": 139,
    "companyId": "CMP-000139",
    "name": "Nomura",
    "slug": "nomura",
    "careerUrl": "https://www.nomura.com/careers/",
    "officialWebsite": "https://www.nomura.com",
    "industry": "Financial Services & Global Markets",
    "country": "Japan",
    "primaryLocations": [
      "Mumbai"
    ],
    "aliases": [
      "Nomura Services India",
      "Nomura Group"
    ]
  },
  {
    "canonicalIndex": 140,
    "companyId": "CMP-000140",
    "name": "BNY",
    "slug": "bny",
    "careerUrl": "https://www.bny.com/careers",
    "officialWebsite": "https://www.bny.com",
    "industry": "Securities Servicing & Investment Management",
    "country": "United States",
    "primaryLocations": [
      "Pune",
      "Chennai"
    ],
    "aliases": [
      "BNY Mellon",
      "Bank of New York Mellon"
    ]
  },
  {
    "canonicalIndex": 141,
    "companyId": "CMP-000141",
    "name": "State Street",
    "slug": "state-street",
    "careerUrl": "https://www.statestreet.com/careers",
    "officialWebsite": "https://www.statestreet.com",
    "industry": "Institutional Asset Servicing & Custody",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Pune"
    ],
    "aliases": [
      "State Street Syntel",
      "State Street Corporation"
    ]
  },
  {
    "canonicalIndex": 142,
    "companyId": "CMP-000142",
    "name": "Fidelity Investments",
    "slug": "fidelity-investments",
    "careerUrl": "https://jobs.fidelity.com/",
    "officialWebsite": "https://www.fidelity.com",
    "industry": "Financial Planning & Mutual Funds",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Chennai"
    ],
    "aliases": [
      "FMR India",
      "Fidelity India"
    ]
  },
  {
    "canonicalIndex": 143,
    "companyId": "CMP-000143",
    "name": "Northern Trust",
    "slug": "northern-trust",
    "careerUrl": "https://www.northerntrust.com/careers",
    "officialWebsite": "https://www.northerntrust.com",
    "industry": "Wealth Management & Asset Servicing",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Pune"
    ],
    "aliases": [
      "Northern Trust India",
      "Northern Trust Operating Services"
    ]
  },
  {
    "canonicalIndex": 144,
    "companyId": "CMP-000144",
    "name": "BNP Paribas India Solutions",
    "slug": "bnp-paribas-india-solutions",
    "careerUrl": "https://in.jobs.bnpparibas/",
    "officialWebsite": "https://www.bnpparibas.com",
    "industry": "Investment Banking & Custody Services",
    "country": "France",
    "primaryLocations": [
      "Mumbai",
      "Chennai",
      "Bengaluru"
    ],
    "aliases": [
      "BNP Paribas",
      "BNP Paribas India"
    ]
  },
  {
    "canonicalIndex": 145,
    "companyId": "CMP-000145",
    "name": "Wells Fargo",
    "slug": "wells-fargo",
    "careerUrl": "https://www.wellsfargo.com/about/careers/",
    "officialWebsite": "https://www.wellsfargo.com",
    "industry": "Diversified Financial Services",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Chennai"
    ],
    "aliases": [
      "Wells Fargo India Solutions",
      "Wells Fargo Bank"
    ]
  },
  {
    "canonicalIndex": 146,
    "companyId": "CMP-000146",
    "name": "Bank of America",
    "slug": "bank-of-america",
    "careerUrl": "https://careers.bankofamerica.com/",
    "officialWebsite": "https://www.bankofamerica.com",
    "industry": "Global Banking & Wealth Management",
    "country": "United States",
    "primaryLocations": [
      "Mumbai",
      "Hyderabad",
      "Chennai",
      "Gurgaon"
    ],
    "aliases": [
      "BofA",
      "BofA Securities",
      "Bank of America India"
    ]
  },
  {
    "canonicalIndex": 147,
    "companyId": "CMP-000147",
    "name": "Synchrony",
    "slug": "synchrony",
    "careerUrl": "https://www.synchronycareers.com/",
    "officialWebsite": "https://www.synchrony.com",
    "industry": "Consumer Financial Services",
    "country": "United States",
    "primaryLocations": [
      "Hyderabad"
    ],
    "aliases": [
      "Synchrony Financial",
      "Synchrony India"
    ]
  },
  {
    "canonicalIndex": 148,
    "companyId": "CMP-000148",
    "name": "Visa",
    "slug": "visa",
    "careerUrl": "https://usa.visa.com/careers.html",
    "officialWebsite": "https://www.visa.com",
    "industry": "Digital Payments & Global Payment Network",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Mumbai"
    ],
    "aliases": [
      "Visa Inc",
      "Visa India"
    ]
  },
  {
    "canonicalIndex": 149,
    "companyId": "CMP-000149",
    "name": "Mastercard",
    "slug": "mastercard",
    "careerUrl": "https://careers.mastercard.com/",
    "officialWebsite": "https://www.mastercard.com",
    "industry": "Payment Processing & Cyber Intelligence",
    "country": "United States",
    "primaryLocations": [
      "Pune",
      "Gurgaon",
      "Vadodara"
    ],
    "aliases": [
      "Mastercard India",
      "Mastercard Inc"
    ]
  },
  {
    "canonicalIndex": 150,
    "companyId": "CMP-000150",
    "name": "PayPal",
    "slug": "paypal",
    "careerUrl": "https://www.paypal.com/us/webapps/mpp/jobs",
    "officialWebsite": "https://www.paypal.com",
    "industry": "Digital Wallets & Payment Infrastructure",
    "country": "United States",
    "primaryLocations": [
      "Chennai",
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "PayPal India",
      "PayPal Inc"
    ]
  },
  {
    "canonicalIndex": 151,
    "companyId": "CMP-000151",
    "name": "Fiserv",
    "slug": "fiserv",
    "careerUrl": "https://www.fiserv.com/en/about-fiserv/careers.html",
    "officialWebsite": "https://www.fiserv.com",
    "industry": "Fintech & Payments Solutions",
    "country": "United States",
    "primaryLocations": [
      "Noida",
      "Bengaluru",
      "Pune",
      "Chennai"
    ],
    "aliases": [
      "Fiserv India"
    ]
  },
  {
    "canonicalIndex": 152,
    "companyId": "CMP-000152",
    "name": "FIS Global",
    "slug": "fis-global",
    "careerUrl": "https://jobs.fisglobal.com/",
    "officialWebsite": "https://www.fisglobal.com",
    "industry": "Financial Technology & Merchant Solutions",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Pune",
      "Gurgaon",
      "Chennai"
    ],
    "aliases": [
      "FIS",
      "Fidelity Information Services"
    ]
  },
  {
    "canonicalIndex": 153,
    "companyId": "CMP-000153",
    "name": "ADP",
    "slug": "adp",
    "careerUrl": "https://jobs.adp.com/",
    "officialWebsite": "https://www.adp.com",
    "industry": "Human Capital Management & Payroll Tech",
    "country": "United States",
    "primaryLocations": [
      "Hyderabad",
      "Chennai",
      "Pune"
    ],
    "aliases": [
      "Automatic Data Processing",
      "ADP India"
    ]
  },
  {
    "canonicalIndex": 154,
    "companyId": "CMP-000154",
    "name": "Publicis Sapient",
    "slug": "publicis-sapient",
    "careerUrl": "https://www.publicissapient.com/careers",
    "officialWebsite": "https://www.publicissapient.com",
    "industry": "Digital Business Transformation Consulting",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Gurgaon",
      "Noida"
    ],
    "aliases": [
      "Sapient",
      "Sapient Consulting",
      "Publicis"
    ]
  },
  {
    "canonicalIndex": 155,
    "companyId": "CMP-000155",
    "name": "EPAM Systems",
    "slug": "epam-systems",
    "careerUrl": "https://www.epam.com/careers",
    "officialWebsite": "https://www.epam.com",
    "industry": "Digital Product Development & Software Engineering",
    "country": "United States",
    "primaryLocations": [
      "Hyderabad",
      "Bengaluru",
      "Pune",
      "Gurgaon"
    ],
    "aliases": [
      "EPAM",
      "EPAM Systems India"
    ]
  },
  {
    "canonicalIndex": 156,
    "companyId": "CMP-000156",
    "name": "Globant",
    "slug": "globant",
    "careerUrl": "https://www.globant.com/careers",
    "officialWebsite": "https://www.globant.com",
    "industry": "Digital Solutions & Cognitive Technologies",
    "country": "Luxembourg",
    "primaryLocations": [
      "Pune",
      "Bengaluru"
    ],
    "aliases": [
      "Globant India"
    ]
  },
  {
    "canonicalIndex": 157,
    "companyId": "CMP-000157",
    "name": "Thoughtworks",
    "slug": "thoughtworks",
    "careerUrl": "https://www.thoughtworks.com/careers",
    "officialWebsite": "https://www.thoughtworks.com",
    "industry": "Custom Software Development & Technology Consulting",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Pune",
      "Hyderabad",
      "Gurgaon",
      "Chennai"
    ],
    "aliases": [
      "ThoughtWorks Technologies"
    ],
    "verifiedAts": {
      "atsType": "GREENHOUSE",
      "boardToken": "thoughtworks"
    }
  },
  {
    "canonicalIndex": 158,
    "companyId": "CMP-000158",
    "name": "GlobalLogic",
    "slug": "globallogic",
    "careerUrl": "https://www.globallogic.com/careers/",
    "officialWebsite": "https://www.globallogic.com",
    "industry": "Digital Product Engineering",
    "country": "United States",
    "primaryLocations": [
      "Noida",
      "Gurgaon",
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "GlobalLogic India",
      "Hitachi Group"
    ]
  },
  {
    "canonicalIndex": 159,
    "companyId": "CMP-000159",
    "name": "Endava",
    "slug": "endava",
    "careerUrl": "https://www.endava.com/careers",
    "officialWebsite": "https://www.endava.com",
    "industry": "Next-Gen Technology Services & Cloud Modernization",
    "country": "United Kingdom",
    "primaryLocations": [
      "Pune"
    ],
    "aliases": [
      "Endava Limited"
    ]
  },
  {
    "canonicalIndex": 160,
    "companyId": "CMP-000160",
    "name": "Luxoft",
    "slug": "luxoft",
    "careerUrl": "https://www.luxoft.com/careers",
    "officialWebsite": "https://www.luxoft.com",
    "industry": "Digital Strategy & Software Engineering",
    "country": "Switzerland",
    "primaryLocations": [
      "Bengaluru",
      "Pune",
      "Chennai"
    ],
    "aliases": [
      "Luxoft India",
      "DXC Luxoft"
    ]
  },
  {
    "canonicalIndex": 161,
    "companyId": "CMP-000161",
    "name": "DXC Technology",
    "slug": "dxc-technology",
    "careerUrl": "https://jobs.dxc.technology/",
    "officialWebsite": "https://www.dxc.com",
    "industry": "IT Modernization & Enterprise Services",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Chennai",
      "Hyderabad",
      "Noida"
    ],
    "aliases": [
      "DXC",
      "CSC",
      "Hewlett Packard Enterprise Services"
    ]
  },
  {
    "canonicalIndex": 162,
    "companyId": "CMP-000162",
    "name": "NTT DATA",
    "slug": "ntt-data",
    "careerUrl": "https://www.nttdata.com/global/en/careers",
    "officialWebsite": "https://www.nttdata.com",
    "industry": "IT Services & Telecommunications Consulting",
    "country": "Japan",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Noida",
      "Pune",
      "Chennai"
    ],
    "aliases": [
      "NTT Data Services",
      "NTT"
    ]
  },
  {
    "canonicalIndex": 163,
    "companyId": "CMP-000163",
    "name": "Fujitsu",
    "slug": "fujitsu",
    "careerUrl": "https://www.fujitsu.com/global/about/careers/",
    "officialWebsite": "https://www.fujitsu.com",
    "industry": "Information & Communications Technology",
    "country": "Japan",
    "primaryLocations": [
      "Pune",
      "Bengaluru",
      "Noida",
      "Hyderabad"
    ],
    "aliases": [
      "Fujitsu Consulting India"
    ]
  },
  {
    "canonicalIndex": 164,
    "companyId": "CMP-000164",
    "name": "Atos",
    "slug": "atos",
    "careerUrl": "https://atos.net/en/careers",
    "officialWebsite": "https://atos.net",
    "industry": "Digital Transformation & Managed Services",
    "country": "France",
    "primaryLocations": [
      "Mumbai",
      "Pune",
      "Bengaluru",
      "Chennai"
    ],
    "aliases": [
      "Atos Syntel",
      "Atos India"
    ]
  },
  {
    "canonicalIndex": 165,
    "companyId": "CMP-000165",
    "name": "Unisys",
    "slug": "unisys",
    "careerUrl": "https://careers.unisys.com/",
    "officialWebsite": "https://www.unisys.com",
    "industry": "Enterprise IT Solutions & Security",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "Unisys India"
    ]
  },
  {
    "canonicalIndex": 166,
    "companyId": "CMP-000166",
    "name": "CGI",
    "slug": "cgi",
    "careerUrl": "https://www.cgi.com/en/careers",
    "officialWebsite": "https://www.cgi.com",
    "industry": "IT & Business Consulting Services",
    "country": "Canada",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad",
      "Chennai",
      "Mumbai"
    ],
    "aliases": [
      "CGI Information Systems",
      "CGI India"
    ]
  },
  {
    "canonicalIndex": 167,
    "companyId": "CMP-000167",
    "name": "Infogain",
    "slug": "infogain",
    "careerUrl": "https://www.infogain.com/careers/",
    "officialWebsite": "https://www.infogain.com",
    "industry": "Digital Experience & Platform Engineering",
    "country": "United States",
    "primaryLocations": [
      "Noida",
      "Bengaluru",
      "Mumbai",
      "Pune"
    ],
    "aliases": [
      "Infogain Corporation"
    ]
  },
  {
    "canonicalIndex": 168,
    "companyId": "CMP-000168",
    "name": "Virtusa",
    "slug": "virtusa",
    "careerUrl": "https://www.virtusa.com/careers/",
    "officialWebsite": "https://www.virtusa.com",
    "industry": "Digital Business Strategy & IT Consulting",
    "country": "United States",
    "primaryLocations": [
      "Hyderabad",
      "Chennai",
      "Bengaluru",
      "Pune"
    ],
    "aliases": [
      "Virtusa Consulting Services"
    ]
  },
  {
    "canonicalIndex": 169,
    "companyId": "CMP-000169",
    "name": "Synechron",
    "slug": "synechron",
    "careerUrl": "https://www.synechron.com/careers",
    "officialWebsite": "https://www.synechron.com",
    "industry": "Digital Transformation Consulting for Financial Services",
    "country": "United States",
    "primaryLocations": [
      "Pune",
      "Bengaluru",
      "Hyderabad",
      "Mumbai"
    ],
    "aliases": [
      "Synechron Technologies"
    ]
  },
  {
    "canonicalIndex": 170,
    "companyId": "CMP-000170",
    "name": "UST",
    "slug": "ust",
    "careerUrl": "https://www.ust.com/en/careers",
    "officialWebsite": "https://www.ust.com",
    "industry": "Digital Transformation & Technology Solutions",
    "country": "United States",
    "primaryLocations": [
      "Thiruvananthapuram",
      "Kochi",
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "UST Global",
      "UST Inc"
    ]
  },
  {
    "canonicalIndex": 171,
    "companyId": "CMP-000171",
    "name": "Xoriant",
    "slug": "xoriant",
    "careerUrl": "https://www.xoriant.com/careers",
    "officialWebsite": "https://www.xoriant.com",
    "industry": "Software Product Engineering & IT Services",
    "country": "United States",
    "primaryLocations": [
      "Pune",
      "Mumbai",
      "Bengaluru",
      "Gurgaon"
    ],
    "aliases": [
      "Xoriant Solutions"
    ]
  },
  {
    "canonicalIndex": 172,
    "companyId": "CMP-000172",
    "name": "Nagarro",
    "slug": "nagarro",
    "careerUrl": "https://www.nagarro.com/en/careers",
    "officialWebsite": "https://www.nagarro.com",
    "industry": "Digital Product Engineering & Technology Advisory",
    "country": "Germany",
    "primaryLocations": [
      "Gurgaon",
      "Jaipur",
      "Bengaluru",
      "Pune"
    ],
    "aliases": [
      "Nagarro Software"
    ]
  },
  {
    "canonicalIndex": 173,
    "companyId": "CMP-000173",
    "name": "Newgen Software",
    "slug": "newgen-software",
    "careerUrl": "https://newgensoft.com/careers/",
    "officialWebsite": "https://newgensoft.com",
    "industry": "Low-Code Application Platform & Enterprise Content",
    "country": "India",
    "primaryLocations": [
      "Noida",
      "Delhi NCR"
    ],
    "aliases": [
      "Newgen",
      "Newgen Software Technologies"
    ]
  },
  {
    "canonicalIndex": 174,
    "companyId": "CMP-000174",
    "name": "Ramco Systems",
    "slug": "ramco-systems",
    "careerUrl": "https://www.ramco.com/careers",
    "officialWebsite": "https://www.ramco.com",
    "industry": "Enterprise Cloud Software & Global Payroll",
    "country": "India",
    "primaryLocations": [
      "Chennai"
    ],
    "aliases": [
      "Ramco"
    ]
  },
  {
    "canonicalIndex": 175,
    "companyId": "CMP-000175",
    "name": "Subex",
    "slug": "subex",
    "careerUrl": "https://www.subex.com/careers/",
    "officialWebsite": "https://www.subex.com",
    "industry": "Telecom AI & Digital Trust Solutions",
    "country": "India",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Subex Limited",
      "Subex Azure"
    ]
  },
  {
    "canonicalIndex": 176,
    "companyId": "CMP-000176",
    "name": "Intellect Design Arena",
    "slug": "intellect-design-arena",
    "careerUrl": "https://www.intellectdesign.com/careers",
    "officialWebsite": "https://www.intellectdesign.com",
    "industry": "Financial Technology & Core Banking Architecture",
    "country": "India",
    "primaryLocations": [
      "Chennai",
      "Mumbai",
      "Gurgaon"
    ],
    "aliases": [
      "Intellect",
      "Intellect Design"
    ]
  },
  {
    "canonicalIndex": 177,
    "companyId": "CMP-000177",
    "name": "Josh Technology Group",
    "slug": "josh-technology-group",
    "careerUrl": "https://www.joshtechnologygroup.com/careers",
    "officialWebsite": "https://www.joshtechnologygroup.com",
    "industry": "High-Performance Software Engineering",
    "country": "India",
    "primaryLocations": [
      "Gurgaon"
    ],
    "aliases": [
      "Josh Technology",
      "JTG"
    ]
  },
  {
    "canonicalIndex": 178,
    "companyId": "CMP-000178",
    "name": "ThoughtSpot",
    "slug": "thoughtspot",
    "careerUrl": "https://www.thoughtspot.com/careers",
    "officialWebsite": "https://www.thoughtspot.com",
    "industry": "AI-Powered Analytics & Search Intelligence",
    "country": "United States",
    "primaryLocations": [
      "Bengaluru",
      "Hyderabad"
    ],
    "aliases": [
      "ThoughtSpot Inc"
    ]
  },
  {
    "canonicalIndex": 179,
    "companyId": "CMP-000179",
    "name": "Rakuten India",
    "slug": "rakuten-india",
    "careerUrl": "https://rakuten.careers/",
    "officialWebsite": "https://rakuten.today",
    "industry": "E-Commerce, FinTech & Telecommunications R&D",
    "country": "Japan",
    "primaryLocations": [
      "Bengaluru"
    ],
    "aliases": [
      "Rakuten",
      "Rakuten Symphony"
    ]
  },
  {
    "canonicalIndex": 180,
    "companyId": "CMP-000180",
    "name": "PayU",
    "slug": "payu",
    "careerUrl": "https://corporate.payu.com/careers/",
    "officialWebsite": "https://corporate.payu.com",
    "industry": "Digital Payments & Merchant Gateway Services",
    "country": "Netherlands",
    "primaryLocations": [
      "Gurgaon",
      "Bengaluru",
      "Mumbai"
    ],
    "aliases": [
      "PayU Payments",
      "PayU India"
    ],
    "verifiedAts": {
      "atsType": "SMART_RECRUITERS",
      "boardToken": "PayU"
    }
  },
  {
    "canonicalIndex": 181,
    "companyId": "CMP-000181",
    "name": "Blinkit",
    "slug": "blinkit",
    "careerUrl": "https://careers.blinkit.com/",
    "officialWebsite": "https://blinkit.com",
    "industry": "Quick Commerce & Instant Delivery",
    "country": "India",
    "primaryLocations": [
      "Gurgaon"
    ],
    "aliases": [
      "Grofers",
      "Blinkit Commerce"
    ]
  },
  {
    "canonicalIndex": 182,
    "companyId": "CMP-000182",
    "name": "Zepto",
    "slug": "zepto",
    "careerUrl": "https://www.zeptonow.com/careers",
    "officialWebsite": "https://www.zeptonow.com",
    "industry": "10-Minute Grocery & Quick Commerce",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru"
    ],
    "aliases": [
      "KiranaKart Technologies",
      "Zepto Now"
    ]
  },
  {
    "canonicalIndex": 183,
    "companyId": "CMP-000183",
    "name": "Reliance Retail",
    "slug": "reliance-retail",
    "careerUrl": "https://www.ril.com/careers",
    "officialWebsite": "https://www.ril.com",
    "industry": "Omnichannel Consumer Retail & Supply Chain",
    "country": "India",
    "primaryLocations": [
      "Mumbai",
      "Bengaluru",
      "Delhi NCR"
    ],
    "aliases": [
      "Reliance Retail Limited",
      "RIL",
      "Reliance Brands",
      "JioMart"
    ]
  }
];
