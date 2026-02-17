import { notFound } from "next/navigation";
import { getPullRequest } from "@/lib/mock-data";
import { ReviewLayout } from "@/components/review/review-layout";

type Params = Promise<{ id: string }>;

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Params;
}) {
    const { id } = await params;
    const pr = getPullRequest(id);

    if (!pr) {
        notFound();
    }

    return <ReviewLayout pr={pr}>{children}</ReviewLayout>;
}
