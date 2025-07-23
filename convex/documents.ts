//verileri getiriyoruz.
"use client"
import { ConvexError, v } from "convex/values"; 
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { title } from "process";
import { Search } from "lucide-react";
// burda giris yapan kullanıcının kimliğini alıyoruz.
// kullanıcı giris yapmamıssa hata fırlatıyoruz
// giris yaptıysak documents koleksiyonuna yeni bir kayıt ekliyoruz
// title, ownerId, initialContent kısımlarını tutuyor.


//belgeyi eklemek için kullanılıyor.
export const create = mutation({
    args: { title: v.optional(v.string()), initialContent: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unathorized");
        }

        const organizationId = (user.organization_id ?? undefined) as 
            | string 
            | undefined;

        return await ctx.db.insert("documents", {
            title: args.title ?? "Untitled coument",
            ownerId: user.subject,
            organizationId,
            initialContent: args.initialContent,
        });
    },
});

//sayfalama için kullanılıyor.
//eger search parametresi varsa search indexini kullanıyoruz.
//eger kullanıcı giris yapmamıssa hata fırlatıyoruz.
// organizasyon içideyse ona gröe filtreleme yapıyoruz.
export const get = query({
    args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
    handler: async (ctx, {search, paginationOpts}) => {
        const user = await ctx.auth.getUserIdentity();
        
        if(!user) {
            throw new ConvexError("Unathorized");
        }
        
        const organizationId = (user.organization_id ?? undefined) as 
            | string 
            | undefined;

        // search within organization
        if (search && organizationId) {
            return await ctx.db
                .query("documents")
                .withSearchIndex("search_title", (q) => 
                    q.search("title", search).eq("organizationId", organizationId)
                )
                .paginate(paginationOpts);
        }
        
        //personal search
        if (search) {
            return await ctx.db 
                .query("documents")
                .withSearchIndex("search_title", (q) => 
                    q.search("title", search).eq("ownerId", user.subject)
                )
                .paginate(paginationOpts);
        }

        // all docs inside organization
        if (organizationId) {
            return await ctx.db
                .query("documents")
                .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
                .paginate(paginationOpts);
        }

        // all personal docs
        return await ctx.db
            .query("documents")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
            .paginate(paginationOpts);
    },
});

// document silmek için kullanılıyor.
// sadece sahibi silebilir.


// butun kontroller yapıldıktan sonra document siliniyor.
// bir sirkete ait mi ona bakılır. ilk olarak.
export const removeById = mutation ({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unathorized");
        }   

        // kullanıcı bir organizasyon içinde ise 
        // ona organizasyon idsi atanıyor. değilse undefined dönüyor.
        const organizationId = (user.organization_id ?? undefined) as 
            | string 
            | undefined;

        const document = await ctx.db.get(args.id);

        if (document?.ownerId !== user.subject) {
            throw new ConvexError("Document not found");
        }

        const isOwner = document?.ownerId === user.subject;
        const isOrganizationMember = 
            !!(document.organizationId && document.organizationId === organizationId);

        // kullanıcının sahibi değilse ve organizasyon içinde değilse hata fırlatıyoruz.
        if (!isOwner && !isOrganizationMember) {
            throw new ConvexError("Unathorized");
        }

        return await ctx.db.delete(args.id);
    },
});


export const updateById = mutation ({
    args: { id: v.id("documents"), title: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unathorized");
        }   

        const organizationId = (user.organization_id ?? undefined) as 
            | string 
            | undefined;

            
        const document = await ctx.db.get(args.id);

        if (document?.ownerId !== user.subject) {
            throw new ConvexError("Document not found");
        }

        const isOwner = document.ownerId === user.subject;
        const isOrganizationMember = 
            !!(document.organizationId && document.organizationId === organizationId);

        if (!isOwner && !isOrganizationMember) {
            throw new ConvexError("Unathorized");
        }


        return await ctx.db.patch(args.id, { title: args.title });
    },
});

// belgenin id sine göre veritabanından alınmasını sağlar.
export const getById = query({
    args: { id: v.id("documents") },
    handler: async (ctx, { id })  => {
        return await ctx.db.get(id);
        
    },
});