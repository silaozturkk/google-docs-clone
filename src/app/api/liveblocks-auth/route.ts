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

    const orgId = sessionClaims.org_id ?? (sessionClaims as unknown as { o?: { id: string } }).o?.id;


    const isOrganizationMember = 
        !!(document.organizationId && document.organizationId === orgId);
    
    
    if(!isOwner && !isOrganizationMember) {
        return new Response("Unauthorized", { status: 401 });
    }

    const name = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";

    const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Rastgele renk üret
    const hue = Math.floor(nameToNumber) % 360;
    const color = `hsl(${hue}, 80%, 60%)`;

    //liveblocks session oluşturulur.
    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
          name,
          avatar: user.imageUrl,
          color,
        },
      });
      
    //erişim yetkisi verilir.
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
};