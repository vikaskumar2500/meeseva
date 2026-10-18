import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { ServiceModel } from '../modules/services/service.model.js';
import { UserModel } from '../modules/users/user.model.js';
import { ApplicationModel } from '../modules/applications/application.model.js';
import { TrackingModel } from '../modules/tracking/tracking.model.js';
import { DocumentModel } from '../modules/documents/document.model.js';

const servicesData = [
  {
    id: 1,
    name: 'Income Certificate',
    description:
      'Official certification of annual household income for educational scholarships, welfare schemes, and subsidies.',
    category: 'Certificates & Revenue',
    department: 'Revenue & Disaster Management Department',
    eligibility: [
      'Permanent resident of state',
      'Household income within notified limits',
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / Voter ID',
      'Salary Certificate / Income Affidavit',
      'Passport size photo',
    ],
    fees: 45,
    processingTime: '7 days',
    rating: 4.8,
    reviewCount: 3420,
    popular: true,
    tags: ['revenue', 'income', 'scholarship', 'certificate', 'subsidy'],
  },
  {
    id: 2,
    name: 'Caste & Community Certificate',
    description:
      'Issuance of SC/ST/OBC/EWS caste certificate for reservation benefits in education, jobs, and government programs.',
    category: 'Certificates & Revenue',
    department: 'Social Welfare & Revenue Department',
    eligibility: [
      'Applicant belonging to recognized backward or scheduled category',
      'Resident of the state',
    ],
    requiredDocuments: [
      'Father / Relative Caste Certificate',
      'Aadhaar Card',
      'School Leaving Certificate',
      'Ration Card',
    ],
    fees: 50,
    processingTime: '15 days',
    rating: 4.7,
    reviewCount: 2890,
    popular: true,
    tags: ['caste', 'community', 'reservation', 'welfare', 'certificate'],
  },
  {
    id: 3,
    name: 'Residence / Domicile Certificate',
    description:
      'Verification of state residency for university admissions, domicile quota, and government employment.',
    category: 'Certificates & Revenue',
    department: 'Revenue Department',
    eligibility: ['Continuous residency in state for at least 5 years'],
    requiredDocuments: [
      'Electricity Bill / Property Tax Receipt',
      'Aadhaar Card',
      'Birth Certificate / School Study Certificate',
    ],
    fees: 35,
    processingTime: '5 days',
    rating: 4.6,
    reviewCount: 1980,
    popular: true,
    tags: ['residence', 'domicile', 'address', 'education', 'jobs'],
  },
  {
    id: 4,
    name: 'Food Security (Ration Card) Application',
    description:
      'Application for new White/Pink Ration Card or member addition for subsidized food grains and PDS benefits.',
    category: 'Food & Civil Supplies',
    department: 'Civil Supplies & Consumer Affairs',
    eligibility: [
      'Families residing in state without existing active ration card in any other state',
    ],
    requiredDocuments: [
      'Family Head Aadhaar Card',
      'All Members Aadhaar Cards',
      'Proof of Residence',
      'Income Declaration',
    ],
    fees: 60,
    processingTime: '21 days',
    rating: 4.5,
    reviewCount: 4510,
    popular: true,
    tags: ['ration', 'food', 'pds', 'civil supplies', 'welfare'],
  },
  {
    id: 5,
    name: 'Birth Certificate Issuance',
    description:
      'Registration and issuance of official birth certificate for newborns or delayed birth registrations.',
    category: 'Civic & Municipal Services',
    department: 'Municipal Administration & Urban Development',
    eligibility: [
      'Birth occurred within the municipal or panchayat jurisdiction',
    ],
    requiredDocuments: [
      'Hospital Discharge Summary / Form-1',
      'Parents Aadhaar Cards',
      'Marriage Certificate of parents',
    ],
    fees: 30,
    processingTime: '3-7 days',
    rating: 4.9,
    reviewCount: 5200,
    popular: true,
    tags: ['birth', 'vital records', 'civic', 'children', 'certificate'],
  },
  {
    id: 6,
    name: 'Death Certificate Issuance',
    description:
      'Registration and legal issuance of death certificate for insurance, property succession, and legal claims.',
    category: 'Civic & Municipal Services',
    department: 'Municipal Administration & Urban Development',
    eligibility: ['Next of kin or legal heir of deceased'],
    requiredDocuments: [
      'Doctor Death Confirmation Report',
      'Cremation/Burial Receipt',
      'Aadhaar Card of Deceased and Applicant',
    ],
    fees: 30,
    processingTime: '3-5 days',
    rating: 4.8,
    reviewCount: 1650,
    popular: false,
    tags: ['death', 'legal', 'insurance', 'succession', 'civic'],
  },
  {
    id: 7,
    name: 'Land Record Copy (ROR-1B & Pahani)',
    description:
      'Certified digitised copies of land title deeds, patta passbook entries, and survey inspection records.',
    category: 'Land & Agriculture',
    department: 'Department of Land Administration',
    eligibility: ['Land owner, cultivator, or authorized legal representative'],
    requiredDocuments: [
      'Passbook Number or Survey/Khata Number',
      'Applicant ID Proof',
    ],
    fees: 25,
    processingTime: 'Instant / 24 hours',
    rating: 4.7,
    reviewCount: 6800,
    popular: true,
    tags: ['land', 'pahani', 'revenue', 'agriculture', 'property'],
  },
  {
    id: 8,
    name: 'Agriculture Rythu Bharosa / Crop Loan Subsidy',
    description:
      'Direct financial subsidy and input support for registered farmer landholders and tenant farmers.',
    category: 'Land & Agriculture',
    department: 'Agriculture and Cooperation Department',
    eligibility: ['Owner of agricultural land with valid Pattadar Passbook'],
    requiredDocuments: [
      'Pattadar Passbook',
      'Bank Account Passbook / IFSC',
      'Aadhaar Card with mobile linking',
    ],
    fees: 0,
    processingTime: '10 days',
    rating: 4.9,
    reviewCount: 7120,
    popular: true,
    tags: ['farmer', 'agriculture', 'subsidy', 'crop', 'direct transfer'],
  },
  {
    id: 9,
    name: 'Old Age & Social Security Pension Scheme',
    description:
      'Monthly DBT pension support for senior citizens aged 60+, widows, and persons with disabilities.',
    category: 'Social Welfare & Pensions',
    department: 'Panchayat Raj & Rural Development',
    eligibility: [
      'Age 60+ (Old Age) or certified disability 40%+',
      'BPL household',
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Age Proof / Voter ID',
      'Disability Certificate (if applicable)',
      'Bank Passbook',
    ],
    fees: 0,
    processingTime: '20 days',
    rating: 4.8,
    reviewCount: 3100,
    popular: true,
    tags: ['pension', 'senior citizens', 'welfare', 'dbt', 'monthly support'],
  },
  {
    id: 10,
    name: 'Driving License Renewal & Duplicate',
    description:
      'Online application for renewal of expired driving license or re-issue of lost Smart Card driving license.',
    category: 'Transport & Vehicles',
    department: 'Transport Department',
    eligibility: ['Holding an expired or damaged valid driving license'],
    requiredDocuments: [
      'Existing DL Copy',
      'Medical Fitness Certificate (Form 1A if age 40+)',
      'Aadhaar Card',
    ],
    fees: 400,
    processingTime: '7 days',
    rating: 4.4,
    reviewCount: 4200,
    popular: true,
    tags: ['transport', 'driving license', 'rto', 'renewal', 'vehicles'],
  },
  {
    id: 11,
    name: 'New Commercial Water & Sewerage Connection',
    description:
      'Sanction and meter installation for water supply and municipal sewerage pipeline.',
    category: 'Utilities & Infrastructure',
    department: 'Water Works & Sewerage Board',
    eligibility: ['Property owner or registered lease tenant with owner NOC'],
    requiredDocuments: [
      'Property Tax Receipt',
      'Building Approved Plan',
      'Aadhaar Card of Applicant',
    ],
    fees: 1500,
    processingTime: '14 days',
    rating: 4.3,
    reviewCount: 890,
    popular: false,
    tags: ['water', 'utilities', 'infrastructure', 'connection', 'meter'],
  },
  {
    id: 12,
    name: 'Trade License Registration & Renewal',
    description:
      'Municipal trade license approval to legally operate commercial stores, workshops, and business premises.',
    category: 'Business & Commercial',
    department: 'Municipal Corporation Commercial Tax',
    eligibility: ['Registered business owner operating in municipal zone'],
    requiredDocuments: [
      'Rental Agreement / Property Title',
      'Fire NOC (if applicable)',
      'PAN / GSTIN',
      'ID Proof',
    ],
    fees: 2500,
    processingTime: '10 days',
    rating: 4.6,
    reviewCount: 1420,
    popular: false,
    tags: ['trade', 'business', 'license', 'commercial', 'municipal'],
  },
];

async function seed() {
  try {
    console.info('Connecting to MongoDB database:', env.MONGODB_URI);
    await mongoose.connect(env.MONGODB_URI);

    // 1. Services Catalog
    console.info('Cleaning and seeding government services catalog...');
    await ServiceModel.deleteMany({});
    await ServiceModel.insertMany(servicesData);
    console.info(`✓ Seeded ${servicesData.length} services`);

    // 2. Demo Users
    console.info('Cleaning and seeding demo users...');
    await UserModel.deleteMany({
      email: { $in: ['citizen@meeseva.gov.in', 'officer@meeseva.gov.in'] },
    });

    const citizenPasswordHash = await bcrypt.hash('Citizen@123', 10);
    const officerPasswordHash = await bcrypt.hash('Officer@123', 10);

    const citizenUser = await UserModel.create({
      desiredLoginId: 'ramesh.citizen',
      fullName: 'Ramesh Kumar',
      email: 'citizen@meeseva.gov.in',
      phone: '9876543210',
      passwordHash: citizenPasswordHash,
      role: 'citizen',
      otpVerified: true,
      aadhaar: 'XXXX-XXXX-4321',
      address: 'Flat 402, Shanti Nilayam, Jubilee Hills',
      district: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500033',
    });

    const officerUser = await UserModel.create({
      desiredLoginId: 'lakshmi.officer',
      fullName: 'Smt. Lakshmi Devi',
      email: 'officer@meeseva.gov.in',
      phone: '9876543211',
      passwordHash: officerPasswordHash,
      role: 'officer',
      otpVerified: true,
      district: 'Hyderabad',
      state: 'Telangana',
    });
    console.info('✓ Seeded demo citizen and officer users');

    // 3. Demo Applications & Tracking History
    console.info('Cleaning and seeding demo applications and tracking timelines...');
    await ApplicationModel.deleteMany({ userId: citizenUser._id });

    // App 1: Approved Income Certificate
    const app1 = await ApplicationModel.create({
      userId: citizenUser._id,
      applicationType: 'Income Certificate',
      title: 'Income Certificate for Education Scholarship',
      status: 'approved',
      payload: {
        applicantName: 'Ramesh Kumar',
        fatherName: 'Venkat Kumar',
        annualIncome: 180000,
        occupation: 'Private Sector Employee',
        rationCardNumber: 'WAP123456789',
        purpose: 'Higher Education Scholarship Scheme',
      },
    });

    await TrackingModel.create([
      {
        applicationId: app1._id,
        status: 'submitted',
        note: 'Application submitted online with Aadhaar and Salary certificate.',
        updatedBy: citizenUser._id,
      },
      {
        applicationId: app1._id,
        status: 'in_review',
        note: 'Documents verified and found satisfactory by Village Revenue Officer.',
        updatedBy: officerUser._id,
      },
      {
        applicationId: app1._id,
        status: 'approved',
        note: 'Approved by Tahsildar. Digital Certificate #TG-REV-2026-90412 issued.',
        updatedBy: officerUser._id,
      },
    ]);

    // App 2: Under Review Caste Certificate
    const app2 = await ApplicationModel.create({
      userId: citizenUser._id,
      applicationType: 'Caste & Community Certificate',
      title: 'OBC Community Certificate Application',
      status: 'in_review',
      payload: {
        applicantName: 'Ramesh Kumar',
        fatherName: 'Venkat Kumar',
        casteCategory: 'OBC',
        subCaste: 'Yadava',
        purpose: 'Public Examination and State Quota Application',
      },
    });

    await TrackingModel.create([
      {
        applicationId: app2._id,
        status: 'submitted',
        note: 'Application filed online with family school certificates.',
        updatedBy: citizenUser._id,
      },
      {
        applicationId: app2._id,
        status: 'in_review',
        note: 'Under scrutiny at Mandal Revenue Office for community verification.',
        updatedBy: officerUser._id,
      },
    ]);

    // App 3: Newly Submitted Ration Card
    const app3 = await ApplicationModel.create({
      userId: citizenUser._id,
      applicationType: 'Food Security (Ration Card) Application',
      title: 'New Food Security Card Registration',
      status: 'submitted',
      payload: {
        familyHead: 'Ramesh Kumar',
        totalMembers: 4,
        gasConnection: 'Single Cylinder',
        residenceType: 'Rented',
      },
    });

    await TrackingModel.create([
      {
        applicationId: app3._id,
        status: 'submitted',
        note: 'Online application acknowledgment generated. Pending document queue.',
        updatedBy: citizenUser._id,
      },
    ]);
    console.info('✓ Seeded 3 applications across submitted, in_review, and approved statuses');

    // 4. Demo Digital Locker Documents
    console.info('Cleaning and seeding digital document locker...');
    await DocumentModel.deleteMany({ userId: citizenUser._id });

    await DocumentModel.create([
      {
        userId: citizenUser._id,
        name: 'Aadhaar Card',
        type: 'aadhaar',
        issuer: 'UIDAI - Government of India',
        documentNumber: 'XXXX-XXXX-4321',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
        fileMimetype: 'application/pdf',
        fileSize: 1048576,
        verificationStatus: 'verified',
        remarks: 'Digitally verified against UIDAI vault',
      },
      {
        userId: citizenUser._id,
        name: 'Salary & Income Proof',
        type: 'certificate',
        issuer: 'Revenue Authority / Employer',
        documentNumber: 'INC-PROOF-2026',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        fileMimetype: 'application/pdf',
        fileSize: 524288,
        verificationStatus: 'verified',
        remarks: 'Validated with Form 16 submission',
      },
      {
        userId: citizenUser._id,
        name: 'Secondary School Study Certificate',
        type: 'certificate',
        issuer: 'State Board of Secondary Education',
        documentNumber: 'SSC-TG-2018-490',
        fileUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
        fileMimetype: 'application/pdf',
        fileSize: 819200,
        verificationStatus: 'verified',
        remarks: 'Permanent record matched',
      },
    ]);
    console.info('✓ Seeded 3 verified documents in citizen document locker');

    console.info('\n🎉 Full demo database successfully seeded!');
    console.info('--------------------------------------------------');
    console.info('👤 Citizen Login:  citizen@meeseva.gov.in / Citizen@123');
    console.info('👮 Officer Login:  officer@meeseva.gov.in / Officer@123');
    console.info('📄 Sample App IDs:');
    console.info(`   - ${app1._id} (Approved - Income Certificate)`);
    console.info(`   - ${app2._id} (In Review - Caste Certificate)`);
    console.info(`   - ${app3._id} (Submitted - Ration Card)`);
    console.info('--------------------------------------------------\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
