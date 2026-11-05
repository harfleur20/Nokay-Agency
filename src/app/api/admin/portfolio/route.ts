import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { requireRoles } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0,max) : ""; }
function safeUrl(value: string) { if (!value) return null; try { const url = new URL(value); return ["https:","http:"].includes(url.protocol) ? url.toString() : null; } catch { return null; } }

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({error:"unauthorized"},{status:401});
  const items = await prisma.portfolioItem.findMany({orderBy:{createdAt:"desc"},take:200});
  return NextResponse.json({items});
}

export async function POST(request: Request) {
  const admin = await requireRoles(["SUPER_ADMIN","ADMIN"]);
  if (!admin) return NextResponse.json({error:"unauthorized"},{status:401});
  let body: Record<string,unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({error:"invalid_payload"},{status:400}); }
  const slug=clean(body.slug,100).toLowerCase(); const title=clean(body.title,160);
  const summary=clean(body.summary,3000); const category=clean(body.category,100);
  const imageRaw=clean(body.imageUrl,1000); const projectRaw=clean(body.projectUrl,1000);
  const imageUrl=safeUrl(imageRaw); const projectUrl=safeUrl(projectRaw);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || title.length<2 || summary.length<10 || category.length<2 || (imageRaw && !imageUrl) || (projectRaw && !projectUrl)) {
    return NextResponse.json({error:"invalid_fields"},{status:400});
  }
  try {
    const item=await prisma.portfolioItem.create({data:{slug,title,summary,category,imageUrl,projectUrl,isConcept:body.isConcept===true,published:body.published===true}});
    await prisma.auditLog.create({data:{actorId:admin.id,action:"portfolio.created",entity:"PortfolioItem",entityId:item.id}});
    return NextResponse.json({item},{status:201});
  } catch { return NextResponse.json({error:"slug_already_exists_or_database_error"},{status:409}); }
}

export async function PATCH(request: Request) {
  const admin = await requireRoles(["SUPER_ADMIN","ADMIN"]);
  if (!admin) return NextResponse.json({error:"unauthorized"},{status:401});
  let body: Record<string,unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({error:"invalid_payload"},{status:400}); }
  const id=clean(body.id,100);
  const data: {title?:string;summary?:string;category?:string;imageUrl?:string|null;projectUrl?:string|null;isConcept?:boolean;published?:boolean}={};
  if(typeof body.title==="string") data.title=clean(body.title,160);
  if(typeof body.summary==="string") data.summary=clean(body.summary,3000);
  if(typeof body.category==="string") data.category=clean(body.category,100);
  if(typeof body.imageUrl==="string"){const raw=clean(body.imageUrl,1000);data.imageUrl=raw?safeUrl(raw):null;if(raw&&!data.imageUrl)return NextResponse.json({error:"invalid_image_url"},{status:400});}
  if(typeof body.projectUrl==="string"){const raw=clean(body.projectUrl,1000);data.projectUrl=raw?safeUrl(raw):null;if(raw&&!data.projectUrl)return NextResponse.json({error:"invalid_project_url"},{status:400});}
  if(typeof body.isConcept==="boolean") data.isConcept=body.isConcept;
  if(typeof body.published==="boolean") data.published=body.published;
  if(!id||Object.keys(data).length===0)return NextResponse.json({error:"invalid_fields"},{status:400});
  try {
    const item=await prisma.portfolioItem.update({where:{id},data});
    await prisma.auditLog.create({data:{actorId:admin.id,action:"portfolio.updated",entity:"PortfolioItem",entityId:id,metadata:data}});
    return NextResponse.json({item});
  } catch { return NextResponse.json({error:"item_not_found_or_database_error"},{status:404}); }
}
