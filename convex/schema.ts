//veri tabanı tablosu olusturduk.
//arama ve filtreleme kısmını optimize ettik

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // bir documents tablosu olusturduk
    documents: defineTable({
        title: v.string(),
        initialContent: v.optional(v.string()),
        ownerId: v.string(),
        roomId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
    })
        .index("by_owner_id", ["ownerId"])
        .index("by_organization_id", ["organizationId"])
        .searchIndex("search_title",{
            searchField: "title",
            filterFields: ["ownerId","organizationId"],
        }),
});