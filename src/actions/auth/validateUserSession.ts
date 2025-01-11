"use server";

import { db } from "@/db";
import { activeUsers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function validateUserSession(email: string, sessionToken: string) {
  const result = await db
    .select({
      sessionToken: activeUsers.sessionToken,
      email: activeUsers.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      city: users.city,
      state: users.state,
      zip: users.zip,
      id: users.id,
      job: users.job,
    })
    .from(activeUsers)
    .innerJoin(users, eq(activeUsers.email, users.email))
    .where(
      and(
        eq(activeUsers.email, email),
        eq(activeUsers.sessionToken, sessionToken)
      )
    );

  return result.length > 0 ? result[0] : null;
}
