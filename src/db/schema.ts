import {
  pgTable,
  serial,
  text,
  integer,
  real,
  boolean,
  timestamp,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";

export const caseStatus = pgEnum("case_status", [
  "new",
  "reviewing",
  "matched",
  "active",
  "closed",
]);

export const consultationType = pgEnum("consultation_type", [
  "chat",
  "voice",
  "video",
]);

export const consultationStatus = pgEnum("consultation_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

/* ------------------------------ Lawyers ------------------------------ */
export const lawyers = pgTable("lawyers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  avatarColor: text("avatar_color").notNull().default("#15365d"),
  title: text("title").notNull().default("وکیل پایه یک دادگستری"),
  licenseNo: text("license_no").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  gender: text("gender").notNull().default("male"),
  experienceYears: integer("experience_years").notNull().default(0),
  specialties: text("specialties").array().notNull().default([]),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  caseCount: integer("case_count").notNull().default(0),
  priceChat: integer("price_chat").notNull().default(0),
  priceVoice: integer("price_voice").notNull().default(0),
  priceVideo: integer("price_video").notNull().default(0),
  verified: boolean("verified").notNull().default(true),
  topRated: boolean("top_rated").notNull().default(false),
  fastResponder: boolean("fast_responder").notNull().default(false),
  contractExpert: boolean("contract_expert").notNull().default(false),
  responseTime: text("response_time").notNull().default("کمتر از یک ساعت"),
  bio: text("bio").notNull().default(""),
  about: text("about").notNull().default(""),
  services: text("services").array().notNull().default([]),
  views: integer("views").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------ Reviews ------------------------------ */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  lawyerId: integer("lawyer_id")
    .notNull()
    .references(() => lawyers.id, { onDelete: "cascade" }),
  clientName: text("client_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  service: text("service"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------ Contracts ------------------------------ */
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull().default("file"),
  description: text("description").notNull(),
  useCase: text("use_case").notNull(),
  risks: text("risks").array().notNull().default([]),
  keyClauses: text("key_clauses").array().notNull().default([]),
  samplePrice: integer("sample_price").notNull().default(0),
  customPrice: integer("custom_price").notNull().default(0),
  popular: boolean("popular").notNull().default(false),
  steps: text("steps").array().notNull().default([]),
});

/* ------------------------------ Articles (Knowledge) ------------------------------ */
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  readTime: integer("read_time").notNull().default(5),
  author: text("author").notNull().default("تیم تحریریه شریفمند"),
  authorRole: text("author_role").notNull().default("پژوهشگر حقوق"),
  views: integer("views").notNull().default(0),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

/* ------------------------------ Q&A ------------------------------ */
export const qaQuestions = pgTable("qa_questions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  question: text("question").notNull(),
  body: text("body").notNull().default(""),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  lawyerName: text("lawyer_name").notNull(),
  lawyerTitle: text("lawyer_title").notNull().default("وکیل پایه یک"),
  verified: boolean("verified").notNull().default(true),
  helpful: integer("helpful").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------ Cases ------------------------------ */
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull().unique(),
  trackingToken: text("tracking_token").notNull().unique(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  city: text("city").notNull(),
  stage: text("stage").notNull().default("ثبت اولیه"),
  budget: text("budget"),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  status: caseStatus("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------ Consultations ------------------------------ */
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  lawyerName: text("lawyer_name"),
  lawyerId: integer("lawyer_id"),
  type: consultationType("type").notNull().default("chat"),
  duration: integer("duration").notNull().default(30),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  subject: text("subject").notNull(),
  scheduledAt: text("scheduled_at"),
  price: numeric("price", { precision: 12, scale: 0 }).notNull().default("0"),
  status: consultationStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------ Support tickets ------------------------------ */
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Lawyer = typeof lawyers.$inferSelect;
export type Contract = typeof contracts.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type QaQuestion = typeof qaQuestions.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type Review = typeof reviews.$inferSelect;

/* ------------------------------ Page views (tracking) ------------------------------ */
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull().unique(),
  views: integer("views").notNull().default(0),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
});
export type PageView = typeof pageViews.$inferSelect;

/* ------------------------------ Users (auth) ------------------------------ */
export const users = pgTable("app_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email").unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("client"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;

/* ------------------------------ Documents (client uploads) ------------------------------ */
export const documents = pgTable("app_documents", {
  id: serial("id").primaryKey(),
  userPhone: text("user_phone").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull().default("مدرک"),
  size: integer("size").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Document = typeof documents.$inferSelect;
