import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone").unique().notNull(),
  address1: varchar("address1").notNull(),
  address2: varchar("address2"),
  city: varchar("city").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 10 }).notNull(),
  salt: varchar("salt").notNull(),
  active: boolean("active").notNull().default(true),
  job: varchar("job"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const balances = pgTable("balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  asset: varchar("asset").notNull(),
  balance: numeric("balance").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  side: varchar("side", { length: 4 }).notNull(),
  orderType: varchar("order_type", { length: 6 }).notNull(),
  baseAsset: varchar("base_asset").notNull(), // what you want to buy
  quoteAsset: varchar("quote_asset").notNull(), // what asset youre using to buy
  price: numeric("price").notNull(),
  amount: numeric("amount").notNull(),
  filledAmount: numeric("filled_amount").notNull().default("0.0"), // how much has been filled
  status: varchar("status", { length: 10 }).default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const historicalOrders = pgTable("historicalOrders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  orderType: varchar("order_type", { length: 6 }).notNull(),
  side: varchar("side", { length: 4 }).notNull(),
  baseAsset: varchar("base_asset").notNull(),
  quoteAsset: varchar("quote_asset").notNull(),
  price: numeric("price").notNull(), // The final price the order was traded at
  amount: numeric("amount").notNull(), // how much of the baseAsset was traded
  status: varchar("status", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const fills = pgTable("fills", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  filledAmount: numeric("filled_amount").notNull(),
  price: numeric("price").notNull(),
  filledAt: timestamp("filled_at").notNull().defaultNow(),
});

export const activeUsers = pgTable("activeUsers", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  sessionToken: varchar("sessionToken").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
