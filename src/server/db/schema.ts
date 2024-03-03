import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `studyhive_${name}`);

export const posts = createTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  usersToCourses: many(usersToCourses),
  answers: many(answers),
  questions: many(questions),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  })
);

export const courses = createTable(
  "courses",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    instructorName: varchar("instructorName", { length: 255 }).notNull(),
  },
);

export const courseRelations = relations(courses, ({ many }) => ({
  usersToCourses: many(usersToCourses),
  courseMaterials: many(courseMaterials),
}));

export const usersToCourses = createTable("usersToCourses", {
    userID: varchar("userID", { length: 255 }).notNull(),
    courseID: varchar("courseID", { length: 255 }).notNull(),
  }, (t) => ({
    pk: primaryKey({columns: [t.userID, t.courseID]}),
  }),
);

export const usersToCoursesRelations = relations(usersToCourses, ({ one }) => ({
  course: one(courses, {
    fields: [usersToCourses.courseID],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [usersToCourses.userID],
    references: [users.id],
  }),
}));

export const courseMaterials = createTable(
  "materials",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey(),
    courseID: varchar("courseID", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    term: varchar("term", { length: 255 }),
  },
);

export const courseMaterialRelations = relations(courseMaterials, ({ one }) => ({
  course: one(courses, {
    fields: [courseMaterials.id],
    references: [courses.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const questions = createTable(
  "question",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey(),
    materialID: varchar("materialID", { length: 255 }).notNull(),
    content: varchar("content", { length: 511 }).notNull(),
    postedBy: varchar("postedBy", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
);

export const questionRelations = relations(questions, ({ one }) => ({
  user: one(users, {
    fields: [questions.postedBy],
    references: [users.id],
  }),
}));

export const answers = createTable(
  "answer",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey(),
    questionID: varchar("questionID", { length: 255 }).notNull(),
    content: varchar("content", { length: 511 }).notNull(),
    postedBy: varchar("postedBy", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
);

export const answerRelations = relations(answers, ({ one }) => ({
  user: one(users, {
    fields: [answers.postedBy],
    references: [users.id],
  }),
}));
