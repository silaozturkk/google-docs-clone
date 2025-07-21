//verileri getiriyoruz.
"use client"
import { ConvexError, v } from "convex/values"; 
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
// burda giris yapan kullanıcının kimliğini alıyoruz.
// kullanıcı giris yapmamıssa hata fırlatıyoruz
// giris yaptıysak documents koleksiyonuna yeni bir kayıt ekliyoruz
// title, ownerId, initialContent kısımlarını tutuyor.

export const create = mutation({
    args: { title: v.optional(v.string()), initialContent: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unathorized");
        }

        return await ctx.db.insert("documents", {
            title: args.title ?? "Untitled coument",
            ownerId: user.subject,
            initialContent: args.initialContent,
        });
    },
});

//sayfalama için kullanılıyor.
export const get = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        return await ctx.db.query("documents").paginate(args.paginationOpts);
    },
});