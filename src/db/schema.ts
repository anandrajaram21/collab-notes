import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull().default(''),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const connectedUsers = pgTable('connected_users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  noteId: varchar('note_id', { length: 255 }).references(() => notes.id).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }).notNull(),
  lastSeen: timestamp('last_seen').defaultNow().notNull(),
}); 