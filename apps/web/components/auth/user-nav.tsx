"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { LogOut, User as UserIcon, Sparkles, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"

export interface UserSubscription {
    isPremium: boolean;
    credits: number;
}

export function UserNav({ user, subscription }: { user: User, subscription: UserSubscription | null }) {
    const router = useRouter()
    const supabase = createClient()


    const handleSignOut = async () => {
        posthog.capture("user_signed_out", {
            user_id: user.id,
        })
        posthog.reset()
        await supabase.auth.signOut()
        router.refresh()
    }

    const handleManageSubscription = async () => {
        const res = await fetch("/api/stripe/portal", { method: "POST" })
        const data: { url?: string } = await res.json()
        if (data.url) window.location.href = data.url
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground pb-1">
                            {user.email}
                        </p>
                        <div className="pt-1 border-t flex items-center gap-1.5 mt-1">
                            {subscription?.isPremium ? (
                                <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> Premium
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> {subscription?.credits ?? 0} AI Credits
                                </span>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {subscription?.isPremium ? (
                    <DropdownMenuItem onClick={handleManageSubscription}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Manage Subscription</span>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => router.push("/premium")}>
                        <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                        <span>Upgrade to Pro</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
