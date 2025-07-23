"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
    return await convex.query(api.documents.getByIds, { ids });
};
    

export async function getUsers() {
    const { sessionClaims } = await auth();
    const clerk = await clerkClient();

    // Organization ID'yi hem org_id hem de o.id'den al
    const organizationId = sessionClaims?.org_id || (sessionClaims?.o as any)?.id;
    console.log("getUsers organizationId", organizationId);

    if (!organizationId) {
        throw new Error("Organization ID bulunamadı.");
    }

    const response = await clerk.users.getUserList({
        organizationId: [organizationId],
    });

    const users = response.data.map((user) => ({
        id: user.id,
        name:
            user.fullName
            || user.username
            || [user.firstName, user.lastName].filter(Boolean).join(" ")
            || user.primaryEmailAddress?.emailAddress
            || "Anonymous",
        avatar: user.imageUrl,
    }));
    return users;
}