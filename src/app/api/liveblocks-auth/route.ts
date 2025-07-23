// kullanıcı yetkisi konrol edilir.

// 1-kullanıcının kimliği clerk ile doğrulanır
// 2-kullanıcının belgeye erişim yetkisi kontrol edilir
// 3-kullanıcının belgeye erişim yetkisi varsa Liveblocks session oluşturulur
// 4-Liveblocks session oluşturulur.yani erişim yetkisi.


import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import {auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

// env dosyasından alınan bilgilerke Convex ve Liveblocks istemcileri olusturur.
//"!" null olamaz demektir
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks= new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// kullanıcı bilgileri alınır. oturum yoksa hata döner.
// giris yapılmıssa kullanıcı bilgileri alınır.
// convex üxerinden belgeyi getirir
// belge bulunamadiysa reddeder.
// organizasyon id si çıkarılır.
// organizasyon id si belgeye erişim yetkisi kontrol edilir.

export async function POST( req: Request) {
    const {sessionClaims} = await auth();
    if(!sessionClaims) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    console.log({ sessionClaims });
    if(!user) {
        return new Response("Unauthorized", {status: 401});
    }

    const { room } = await req.json();
    const document = await convex.query(api.documents.getById, {id: room});


    if(!document) {
        return new Response("Unauthorized", { status: 401 });
    }

    
    const isOwner = document.ownerId === user.id;

    const orgId = sessionClaims.org_id ?? (sessionClaims as any).o?.id;


    const isOrganizationMember = 
        !!(document.organizationId && document.organizationId === orgId);
    
    
    if(!isOwner && !isOrganizationMember) {
        return new Response("Unauthorized", { status: 401 });
    }
    //liveblocks session oluşturulur.
    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Anonymous",
          avatar: user.imageUrl,
        },
      });
      console.log("userInfo.name", `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());

    //erişim yetkisi verilir.
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
};