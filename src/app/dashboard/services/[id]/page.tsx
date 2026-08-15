import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { serviceRequests, serviceRequestEvents, serviceRequestDocs, serviceQuotes, managedServices } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { IconKey } from "@/lib/data";
import { getCurrentUser } from "@/lib/user-auth";
import { resolveRequestFor } from "@/lib/managed-services";
import UserRequestDetail from "@/components/user-request-detail";

export const dynamic = "force-dynamic";

export default async function MyServiceRequest({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = Number(params.id);
  const req = await resolveRequestFor(user, id);
  if (!req) notFound();

  const [[svc], events, quotes, docs] = await Promise.all([
    db.select({ title: managedServices.title, slug: managedServices.slug, icon: managedServices.icon, requiresLawyer: managedServices.requiresLawyer }).from(managedServices).where(eq(managedServices.id, req.serviceId)).limit(1),
    db.select().from(serviceRequestEvents).where(eq(serviceRequestEvents.requestId, id)).orderBy(desc(serviceRequestEvents.createdAt)),
    db.select().from(serviceQuotes).where(eq(serviceQuotes.requestId, id)).orderBy(desc(serviceQuotes.createdAt)).limit(3),
    db.select().from(serviceRequestDocs).where(eq(serviceRequestDocs.requestId, id)).orderBy(desc(serviceRequestDocs.createdAt)),
  ]);

  const visibleEvents = events.filter((e) => e.visibleToUser);

  const nav = [
    { label: "نمای کلی", icon: "home" as IconKey, href: "/dashboard/client" },
    { label: "پرونده‌های من", icon: "folder" as IconKey, href: "/dashboard/cases" },
    { label: "خدمات من", icon: "briefcase" as IconKey, active: true, href: "/dashboard/services" },
    { label: "اسناد و مدارک", icon: "document" as IconKey, href: "/dashboard/documents" },
    { label: "رزرو مشاوره", icon: "calendar" as IconKey, href: "/consultation" },
    { label: "پیام‌ها", icon: "mail" as IconKey, href: "/support" },
  ];

  const canCancel = ["DRAFT", "SUBMITTED", "REVIEWING", "AWAITING_DOCUMENTS", "QUOTED", "AWAITING_PAYMENT"].includes(req.status);

  return (
    <DashboardShell role="موکل" title={`داشبورد ${user.name}`} nav={nav}>
      <div className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/dashboard/services" className="hover:text-primary">خدمات من</Link>
        <Icon name="chevron" className="h-4 w-4" />
        <span>جزئیات درخواست</span>
      </div>
      <UserRequestDetail
        request={{
          id: req.id,
          requestNumber: req.requestNumber,
          title: req.title,
          status: req.status,
          urgency: req.urgency,
          price: req.price,
          paymentStatus: req.paymentStatus,
          contractStatus: req.contractStatus,
          finalReport: req.finalReport,
          resultFileLabel: req.resultFileLabel,
          description: req.description,
        }}
        service={svc ?? null}
        events={visibleEvents as any}
        quotes={quotes as any}
        docs={docs as any}
        canCancel={canCancel}
      />
    </DashboardShell>
  );
}
