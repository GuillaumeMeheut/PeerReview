-- =============================================================================
-- PeerReview — Seed Script
-- Migrates the hardcoded mock-data.ts content into the database
-- =============================================================================
-- NOTE: This uses deterministic UUIDs so that references are stable and
-- the seed script is idempotent (can be re-run with ON CONFLICT DO NOTHING).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Exercise 1: Refactor UserProfile component
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  '15728c8e-2642-469f-a581-c0c402962e48',
  'Refactor UserProfile component and extract hooks',
  'This PR refactors the UserProfile component by extracting data fetching logic into a custom hook `useUserProfile`, splitting the monolithic component into smaller sub-components, and improving type safety throughout. The goal is to improve readability, testability, and adherence to the single responsibility principle.',
  'Junior',
  array['React', 'TypeScript'],
  array['refactor', 'readability'],
  'alex-chen',
  'main',
  'refactor/user-profile-hooks',
  array[
    'The `catch (err: any)` pattern — most reviewers focus on component structure and miss the type safety issue in the hook.',
    'Null safety: the `user` can be null when passed to child components, which would cause a runtime error.',
    'Race conditions in useEffect when userId changes before the previous fetch completes.'
  ]
) on conflict (id) do nothing;

-- Exercise 1 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('54dd9b4c-aa0e-4298-ac94-f2431c87081c', '15728c8e-2642-469f-a581-c0c402962e48', 'src/hooks/useUserProfile.ts', 38, 0, 0),
  ('9abba3ac-2b2a-424a-8a4c-e8bf1edb655f', '15728c8e-2642-469f-a581-c0c402962e48', 'src/components/UserProfile.tsx', 18, 45, 1),
  ('57cc591d-d28b-46f5-929f-4c224a906ca8', '15728c8e-2642-469f-a581-c0c402962e48', 'src/components/UserAvatar.tsx', 22, 0, 2),
  ('f42bb4e5-4594-43c1-ba96-57fcc97566e9', '15728c8e-2642-469f-a581-c0c402962e48', 'src/components/UserStats.tsx', 28, 0, 3)
on conflict (id) do nothing;

-- Exercise 1, File 1 — useUserProfile.ts chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('d7c3efc1-5b15-41a2-848f-a945b6856005', '54dd9b4c-aa0e-4298-ac94-f2431c87081c', '@@ -0,0 +1,38 @@',
'[
  {"type":"added","content":"import { useState, useEffect } from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { User } from \"../types/user\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"import { fetchUser } from \"../api/users\";","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"interface UseUserProfileReturn {","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  user: User | null;","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"  loading: boolean;","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"  error: string | null;","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"export function useUserProfile(userId: string): UseUserProfileReturn {","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"  const [user, setUser] = useState<User | null>(null);","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"  const [loading, setLoading] = useState(true);","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"  const [error, setError] = useState<string | null>(null);","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"  useEffect(() => {","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"    const loadUser = async () => {","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"      try {","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"        setLoading(true);","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"        const data = await fetchUser(userId);","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"        setUser(data);","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"      } catch (err: any) {","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"        setError(err.message || \"Failed to load user\");","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"      } finally {","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"        setLoading(false);","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"      }","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"    };","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"    loadUser();","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"  }, [userId]);","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"  return { user, loading, error };","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":33}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 1, File 2 — UserProfile.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('c39ce75a-813f-4d6d-81b7-10b0767c5bbc', '9abba3ac-2b2a-424a-8a4c-e8bf1edb655f', '@@ -1,52 +1,25 @@',
'[
  {"type":"removed","content":"import React, { useState, useEffect } from \"react\";","oldLineNumber":1,"newLineNumber":null},
  {"type":"removed","content":"import { User } from \"../types/user\";","oldLineNumber":2,"newLineNumber":null},
  {"type":"removed","content":"import { fetchUser } from \"../api/users\";","oldLineNumber":3,"newLineNumber":null},
  {"type":"added","content":"import React from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { useUserProfile } from \"../hooks/useUserProfile\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"import { UserAvatar } from \"./UserAvatar\";","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"import { UserStats } from \"./UserStats\";","oldLineNumber":null,"newLineNumber":4},
  {"type":"unchanged","content":"","oldLineNumber":4,"newLineNumber":5},
  {"type":"removed","content":"interface UserProfileProps {","oldLineNumber":5,"newLineNumber":null},
  {"type":"removed","content":"  userId: string;","oldLineNumber":6,"newLineNumber":null},
  {"type":"removed","content":"}","oldLineNumber":7,"newLineNumber":null},
  {"type":"removed","content":"","oldLineNumber":8,"newLineNumber":null},
  {"type":"removed","content":"export function UserProfile({ userId }: UserProfileProps) {","oldLineNumber":9,"newLineNumber":null},
  {"type":"removed","content":"  const [user, setUser] = useState<User | null>(null);","oldLineNumber":10,"newLineNumber":null},
  {"type":"removed","content":"  const [loading, setLoading] = useState(true);","oldLineNumber":11,"newLineNumber":null},
  {"type":"removed","content":"  const [error, setError] = useState<string | null>(null);","oldLineNumber":12,"newLineNumber":null},
  {"type":"removed","content":"","oldLineNumber":13,"newLineNumber":null},
  {"type":"removed","content":"  useEffect(() => {","oldLineNumber":14,"newLineNumber":null},
  {"type":"removed","content":"    const loadUser = async () => {","oldLineNumber":15,"newLineNumber":null},
  {"type":"removed","content":"      try {","oldLineNumber":16,"newLineNumber":null},
  {"type":"removed","content":"        setLoading(true);","oldLineNumber":17,"newLineNumber":null},
  {"type":"removed","content":"        const data = await fetchUser(userId);","oldLineNumber":18,"newLineNumber":null},
  {"type":"removed","content":"        setUser(data);","oldLineNumber":19,"newLineNumber":null},
  {"type":"removed","content":"      } catch (err: any) {","oldLineNumber":20,"newLineNumber":null},
  {"type":"removed","content":"        setError(err.message || \"Failed to load user\");","oldLineNumber":21,"newLineNumber":null},
  {"type":"removed","content":"      } finally {","oldLineNumber":22,"newLineNumber":null},
  {"type":"removed","content":"        setLoading(false);","oldLineNumber":23,"newLineNumber":null},
  {"type":"removed","content":"      }","oldLineNumber":24,"newLineNumber":null},
  {"type":"removed","content":"    };","oldLineNumber":25,"newLineNumber":null},
  {"type":"removed","content":"    loadUser();","oldLineNumber":26,"newLineNumber":null},
  {"type":"removed","content":"  }, [userId]);","oldLineNumber":27,"newLineNumber":null},
  {"type":"added","content":"export function UserProfile({ userId }: { userId: string }) {","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"  const { user, loading, error } = useUserProfile(userId);","oldLineNumber":null,"newLineNumber":7},
  {"type":"unchanged","content":"","oldLineNumber":28,"newLineNumber":8},
  {"type":"unchanged","content":"  if (loading) {","oldLineNumber":29,"newLineNumber":9},
  {"type":"removed","content":"    return <div className=\"loading-spinner\">Loading...</div>;","oldLineNumber":30,"newLineNumber":null},
  {"type":"added","content":"    return <div className=\"animate-pulse\">Loading profile...</div>;","oldLineNumber":null,"newLineNumber":10},
  {"type":"unchanged","content":"  }","oldLineNumber":31,"newLineNumber":11},
  {"type":"unchanged","content":"","oldLineNumber":32,"newLineNumber":12},
  {"type":"unchanged","content":"  if (error) {","oldLineNumber":33,"newLineNumber":13},
  {"type":"removed","content":"    return <div className=\"error-message\">{error}</div>;","oldLineNumber":34,"newLineNumber":null},
  {"type":"added","content":"    return <div className=\"text-red-500\">{error}</div>;","oldLineNumber":null,"newLineNumber":14},
  {"type":"unchanged","content":"  }","oldLineNumber":35,"newLineNumber":15},
  {"type":"unchanged","content":"","oldLineNumber":36,"newLineNumber":16},
  {"type":"removed","content":"  if (!user) return null;","oldLineNumber":37,"newLineNumber":null},
  {"type":"removed","content":"","oldLineNumber":38,"newLineNumber":null},
  {"type":"unchanged","content":"  return (","oldLineNumber":39,"newLineNumber":17},
  {"type":"removed","content":"    <div className=\"user-profile\">","oldLineNumber":40,"newLineNumber":null},
  {"type":"removed","content":"      <img src={user.avatar} alt={user.name} className=\"avatar\" />","oldLineNumber":41,"newLineNumber":null},
  {"type":"removed","content":"      <h2 className=\"user-name\">{user.name}</h2>","oldLineNumber":42,"newLineNumber":null},
  {"type":"removed","content":"      <p className=\"user-email\">{user.email}</p>","oldLineNumber":43,"newLineNumber":null},
  {"type":"removed","content":"      <div className=\"user-stats\">","oldLineNumber":44,"newLineNumber":null},
  {"type":"removed","content":"        <span>Posts: {user.postsCount}</span>","oldLineNumber":45,"newLineNumber":null},
  {"type":"removed","content":"        <span>Followers: {user.followersCount}</span>","oldLineNumber":46,"newLineNumber":null},
  {"type":"removed","content":"      </div>","oldLineNumber":47,"newLineNumber":null},
  {"type":"removed","content":"    </div>","oldLineNumber":48,"newLineNumber":null},
  {"type":"added","content":"    <div className=\"flex flex-col gap-6 p-6\">","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"      <UserAvatar user={user} />","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"      <UserStats user={user} />","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"    </div>","oldLineNumber":null,"newLineNumber":21},
  {"type":"unchanged","content":"  );","oldLineNumber":49,"newLineNumber":22},
  {"type":"unchanged","content":"}","oldLineNumber":50,"newLineNumber":23}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 1, File 3 — UserAvatar.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('b34c58d7-d215-4ced-b404-0fb755879e0a', '57cc591d-d28b-46f5-929f-4c224a906ca8', '@@ -0,0 +1,22 @@',
'[
  {"type":"added","content":"import React from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { User } from \"../types/user\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"interface UserAvatarProps {","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"  user: User;","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"export function UserAvatar({ user }: UserAvatarProps) {","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    <div className=\"flex items-center gap-4\">","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"      <img","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"        src={user.avatar}","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"        alt={user.name}","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"        className=\"w-16 h-16 rounded-full\"","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"      />","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"      <div>","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"        <h2 className=\"text-xl font-semibold\">{user.name}</h2>","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"        <p className=\"text-muted-foreground\">{user.email}</p>","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"      </div>","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"    </div>","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":22}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 1, File 4 — UserStats.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('ea3c7495-b130-4d5a-9496-fb7d0317f012', 'f42bb4e5-4594-43c1-ba96-57fcc97566e9', '@@ -0,0 +1,28 @@',
'[
  {"type":"added","content":"import React from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { User } from \"../types/user\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"interface UserStatsProps {","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"  user: User;","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"export function UserStats({ user }: UserStatsProps) {","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    <div className=\"grid grid-cols-3 gap-4\">","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"      <div className=\"text-center\">","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"        <p className=\"text-2xl font-bold\">{user.postsCount}</p>","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"        <p className=\"text-sm text-muted-foreground\">Posts</p>","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"      </div>","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"      <div className=\"text-center\">","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"        <p className=\"text-2xl font-bold\">{user.followersCount}</p>","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"        <p className=\"text-sm text-muted-foreground\">Followers</p>","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"      </div>","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"      <div className=\"text-center\">","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"        <p className=\"text-2xl font-bold\">{user.followingCount}</p>","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"        <p className=\"text-sm text-muted-foreground\">Following</p>","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"      </div>","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"    </div>","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":25}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 1 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('e2e79080-2cf8-4e7a-8b2e-4835611c86c5', '15728c8e-2642-469f-a581-c0c402962e48',
 'Unsafe `any` type in catch block',
 'The `catch (err: any)` in `useUserProfile.ts` uses an unsafe `any` type. This should use `unknown` and narrow the type before accessing `.message`.',
 'critical', '      } catch (err: any) {', 0),
('0fd92fea-d4c4-4da9-b8d7-b0939079ba7b', '15728c8e-2642-469f-a581-c0c402962e48',
 'Missing error boundary for null user',
 'The original component had a `if (!user) return null` guard that was removed in the refactor, but the new version renders `<UserAvatar user={user} />` where `user` can still be `null`.',
 'critical', '      <UserAvatar user={user} />', 1),
('6980e6fd-e016-403c-8c9a-2753f48757c6', '15728c8e-2642-469f-a581-c0c402962e48',
 'Missing cleanup for async effect',
 'The `useEffect` in `useUserProfile` does not handle component unmount. If the component unmounts before the fetch completes, it will try to set state on an unmounted component.',
 'suggestion', null, 2),
('715ca78f-ac43-45fb-8c2f-77793e7a193b', '15728c8e-2642-469f-a581-c0c402962e48',
 'Prop interface simplified without TypeDoc',
 'Replacing `UserProfileProps` interface with inline `{ userId: string }` is fine, but inline types are harder to reuse and document. Consider keeping the named interface.',
 'nitpick', null, 3)
on conflict (id) do nothing;


-- ---------------------------------------------------------------------------
-- Exercise 2: Add caching layer to API service
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63',
  'Add caching layer to API service with retry logic',
  'Introduces a caching mechanism for API responses using a Map-based in-memory cache with TTL (time-to-live) expiration. Also adds retry logic with exponential backoff for failed requests. This aims to reduce redundant network calls and improve resilience against transient failures.',
  'Mid',
  array['TypeScript', 'Node.js'],
  array['performance', 'architecture'],
  'sarah-park',
  'main',
  'feature/api-cache-retry',
  array[
    'Unbounded cache growth — this is the most impactful issue but easy to overlook because the code looks clean.',
    'The removed `apiPost` function — deletion is easy to miss in a diff review when you''re focused on additions.',
    'Retry logic that fires on 4xx errors — the retry function itself is well-written, but the lack of error-type filtering is the real issue.'
  ]
) on conflict (id) do nothing;

-- Exercise 2 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('14965c71-3a17-421c-8e56-4ef531aa18c6', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63', 'src/services/api-cache.ts', 52, 0, 0),
  ('5a2a51ed-686f-46e5-a66e-5a6efd109647', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63', 'src/services/api-client.ts', 34, 12, 1),
  ('5a2a51ed-686f-46e5-a66e-5a6efd109648', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63', 'src/services/__tests__/api-cache.test.ts', 44, 0, 2),
  ('5a2a51ed-686f-46e5-a66e-5a6efd109649', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63', 'src/services/api-client.test.ts', 8, 3, 3)
on conflict (id) do nothing;

-- Exercise 2, File 1 — api-cache.ts chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('05feff1b-285d-43f4-8211-4ff25318ca56', '14965c71-3a17-421c-8e56-4ef531aa18c6', '@@ -0,0 +1,52 @@',
'[
  {"type":"added","content":"interface CacheEntry<T> {","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"  data: T;","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"  timestamp: number;","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"  ttl: number;","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"class ApiCache {","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"  private cache = new Map<string, CacheEntry<any>>();","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"  private defaultTTL = 5 * 60 * 1000; // 5 minutes","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"  get<T>(key: string): T | null {","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"    const entry = this.cache.get(key);","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"    if (!entry) return null;","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"    if (Date.now() - entry.timestamp > entry.ttl) {","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"      this.cache.delete(key);","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"      return null;","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"    }","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"    return entry.data as T;","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"  set<T>(key: string, data: T, ttl?: number): void {","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"    this.cache.set(key, {","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"      data,","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"      timestamp: Date.now(),","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"      ttl: ttl || this.defaultTTL,","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"    });","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"  invalidate(key: string): void {","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"    this.cache.delete(key);","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"  clear(): void {","oldLineNumber":null,"newLineNumber":35},
  {"type":"added","content":"    this.cache.clear();","oldLineNumber":null,"newLineNumber":36},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":37},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":38},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":39},
  {"type":"added","content":"export const apiCache = new ApiCache();","oldLineNumber":null,"newLineNumber":40}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 2, File 2 — api-client.ts chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('05feff1b-285d-43f4-8211-4ff25318ca58', '5a2a51ed-686f-46e5-a66e-5a6efd109647', '@@ -1,22 +1,44 @@',
'[
  {"type":"removed","content":"import axios from \"axios\";","oldLineNumber":1,"newLineNumber":null},
  {"type":"added","content":"import axios, { AxiosRequestConfig } from \"axios\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { apiCache } from \"./api-cache\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"unchanged","content":"","oldLineNumber":2,"newLineNumber":3},
  {"type":"unchanged","content":"const BASE_URL = process.env.API_BASE_URL;","oldLineNumber":3,"newLineNumber":4},
  {"type":"unchanged","content":"","oldLineNumber":4,"newLineNumber":5},
  {"type":"removed","content":"export async function apiGet<T>(endpoint: string): Promise<T> {","oldLineNumber":5,"newLineNumber":null},
  {"type":"removed","content":"  const response = await axios.get(`${BASE_URL}${endpoint}`);","oldLineNumber":6,"newLineNumber":null},
  {"type":"removed","content":"  return response.data;","oldLineNumber":7,"newLineNumber":null},
  {"type":"removed","content":"}","oldLineNumber":8,"newLineNumber":null},
  {"type":"added","content":"const MAX_RETRIES = 3;","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"async function withRetry<T>(","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"  fn: () => Promise<T>,","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"  retries = MAX_RETRIES","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"): Promise<T> {","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"  for (let i = 0; i <= retries; i++) {","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"    try {","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"      return await fn();","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"    } catch (err) {","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"      if (i === retries) throw err;","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"    }","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"  throw new Error(\"Retry failed\");","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":21},
  {"type":"unchanged","content":"","oldLineNumber":9,"newLineNumber":22},
  {"type":"removed","content":"export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {","oldLineNumber":10,"newLineNumber":null},
  {"type":"removed","content":"  const response = await axios.post(`${BASE_URL}${endpoint}`, data);","oldLineNumber":11,"newLineNumber":null},
  {"type":"removed","content":"  return response.data;","oldLineNumber":12,"newLineNumber":null},
  {"type":"added","content":"export async function apiGet<T>(","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"  endpoint: string,","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"  config?: AxiosRequestConfig","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"): Promise<T> {","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"  const cacheKey = endpoint;","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"  const cached = apiCache.get<T>(cacheKey);","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"  if (cached) return cached;","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"  const data = await withRetry(async () => {","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"    const response = await axios.get(`${BASE_URL}${endpoint}`, config);","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"    return response.data as T;","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":35},
  {"type":"added","content":"  apiCache.set(cacheKey, data);","oldLineNumber":null,"newLineNumber":36},
  {"type":"added","content":"  return data;","oldLineNumber":null,"newLineNumber":37},
  {"type":"unchanged","content":"}","oldLineNumber":13,"newLineNumber":38}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 2, File 3 — api-cache.test.ts chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('05feff1b-285d-43f4-8211-4ff25318ca59', '5a2a51ed-686f-46e5-a66e-5a6efd109648', '@@ -0,0 +1,44 @@',
'[
  {"type":"added","content":"import { apiCache } from \"../api-cache\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"describe(\"ApiCache\", () => {","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"  beforeEach(() => {","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"    apiCache.clear();","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"  it(\"should store and retrieve cached values\", () => {","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"    apiCache.set(\"key1\", { name: \"test\" });","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    expect(apiCache.get(\"key1\")).toEqual({ name: \"test\" });","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"  it(\"should return null for missing keys\", () => {","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"    expect(apiCache.get(\"nonexistent\")).toBeNull();","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"  it(\"should expire entries after TTL\", () => {","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"    jest.useFakeTimers();","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"    apiCache.set(\"key1\", \"value\", 1000);","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"    jest.advanceTimersByTime(1001);","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"    expect(apiCache.get(\"key1\")).toBeNull();","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"    jest.useRealTimers();","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"  it(\"should invalidate specific keys\", () => {","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"    apiCache.set(\"key1\", \"value1\");","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"    apiCache.set(\"key2\", \"value2\");","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"    apiCache.invalidate(\"key1\");","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"    expect(apiCache.get(\"key1\")).toBeNull();","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"    expect(apiCache.get(\"key2\")).toBe(\"value2\");","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"  it(\"should clear all entries\", () => {","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"    apiCache.set(\"key1\", \"value1\");","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"    apiCache.set(\"key2\", \"value2\");","oldLineNumber":null,"newLineNumber":35},
  {"type":"added","content":"    apiCache.clear();","oldLineNumber":null,"newLineNumber":36},
  {"type":"added","content":"    expect(apiCache.get(\"key1\")).toBeNull();","oldLineNumber":null,"newLineNumber":37},
  {"type":"added","content":"    expect(apiCache.get(\"key2\")).toBeNull();","oldLineNumber":null,"newLineNumber":38},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":39},
  {"type":"added","content":"});","oldLineNumber":null,"newLineNumber":40}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 2, File 4 — api-client.test.ts chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('73575eb4-24c0-4d35-a686-93d37739f836', '5a2a51ed-686f-46e5-a66e-5a6efd109649', '@@ -5,10 +5,15 @@',
'[
  {"type":"unchanged","content":"import { apiGet } from \"./api-client\";","oldLineNumber":5,"newLineNumber":5},
  {"type":"added","content":"import { apiCache } from \"./api-cache\";","oldLineNumber":null,"newLineNumber":6},
  {"type":"unchanged","content":"","oldLineNumber":6,"newLineNumber":7},
  {"type":"unchanged","content":"describe(\"apiGet\", () => {","oldLineNumber":7,"newLineNumber":8},
  {"type":"added","content":"  beforeEach(() => {","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    apiCache.clear();","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":12},
  {"type":"removed","content":"  it(\"should fetch data from endpoint\", async () => {","oldLineNumber":8,"newLineNumber":null},
  {"type":"added","content":"  it(\"should fetch data and cache it\", async () => {","oldLineNumber":null,"newLineNumber":13},
  {"type":"unchanged","content":"    const mockData = { id: 1, name: \"Test\" };","oldLineNumber":9,"newLineNumber":14},
  {"type":"removed","content":"    axios.get.mockResolvedValue({ data: mockData });","oldLineNumber":10,"newLineNumber":null},
  {"type":"added","content":"    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });","oldLineNumber":null,"newLineNumber":15},
  {"type":"unchanged","content":"","oldLineNumber":11,"newLineNumber":16},
  {"type":"removed","content":"    const result = await apiGet(\"/users\");","oldLineNumber":12,"newLineNumber":null},
  {"type":"added","content":"    const result = await apiGet<typeof mockData>(\"/users\");","oldLineNumber":null,"newLineNumber":17},
  {"type":"unchanged","content":"    expect(result).toEqual(mockData);","oldLineNumber":13,"newLineNumber":18},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"    // Second call should use cache","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"    const cachedResult = await apiGet<typeof mockData>(\"/users\");","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"    expect(cachedResult).toEqual(mockData);","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"    expect(axios.get).toHaveBeenCalledTimes(1);","oldLineNumber":null,"newLineNumber":23},
  {"type":"unchanged","content":"  });","oldLineNumber":14,"newLineNumber":24},
  {"type":"unchanged","content":"});","oldLineNumber":15,"newLineNumber":25}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 2 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('73575eb4-24c0-4d35-a686-93d37739f837', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63',
 'Unbounded cache growth — no max size',
 'The Map-based cache has no maximum size limit. In a long-running Node.js process, this will cause unbounded memory growth as every unique endpoint accumulates entries.',
 'critical', '  private cache = new Map<string, CacheEntry<any>>();', 0),
('159c3c11-9454-4b28-8a5d-69360cf3b383', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63',
 'Cache key ignores query parameters',
 '`const cacheKey = endpoint` means `/users?page=1` and `/users?page=2` would collide if they share the same endpoint string, or if the endpoint includes query params, the cache would not be invalidated properly.',
 'critical', '  const cacheKey = endpoint;', 1),
('159c3c11-9454-4b28-8a5d-69360cf3b384', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63',
 'Retry logic on all errors — including 4xx',
 'The retry logic retries on ALL errors, including 400/401/403/404 responses. Client errors should not be retried — only 5xx or network errors should trigger retries.',
 'critical', null, 2),
('159c3c11-9454-4b28-8a5d-69360cf3b385', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63',
 'Module-level singleton creates testing issues',
 '`export const apiCache = new ApiCache()` creates a module-level singleton. This makes tests share mutable state and can lead to flaky tests. Consider dependency injection or a factory pattern.',
 'suggestion', null, 3),
('159c3c11-9454-4b28-8a5d-69360cf3b386', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63',
 'Missing `apiPost` function',
 'The original `apiPost` was removed entirely without replacement. This is likely a breaking change for other modules that depended on it.',
 'critical', 'export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {', 4),
('159c3c11-9454-4b28-8a5d-69360cf3b387', 'fef0e9b8-2fed-4f1c-afad-1f3b201cfb63',
 'Unsafe `as T` type assertion',
 '`return entry.data as T` and `return response.data as T` bypass TypeScript''s type checking. Runtime validation (e.g., with Zod) would be safer.',
 'nitpick', null, 5)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Exercise 3: Implement Next.js Server Actions for Guestbook
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  '71c4c95f-6a68-450b-85d8-5bd552c67bfa',
  'Migrate Guestbook form to Next.js Server Actions',
  'This PR migrates a traditional client-side form submission to use Next.js Server Actions. It aims to reduce client-side JavaScript and improve progressive enhancement by using native form actions.',
  'Mid',
  array['Next.js', 'React', 'TypeScript'],
  array['server components', 'forms'],
  'michael-j',
  'main',
  'feature/server-actions-guestbook',
  array[
    'Missing `use server` directive in the actions file.',
    'Lack of server-side validation or sanitation for the form data.',
    'Not calling `revalidatePath` to refresh the cached guestbook entries after submission.',
    'Improper error handling that doesn''t return a serializable state to the client.'
  ]
) on conflict (id) do nothing;

-- Exercise 3 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('b9e6e812-78d1-4db5-b384-cd974421b53e', '71c4c95f-6a68-450b-85d8-5bd552c67bfa', 'src/app/guestbook/page.tsx', 25, 30, 0),
  ('c4c20fcb-8af7-4e6f-a885-3b95a125ba11', '71c4c95f-6a68-450b-85d8-5bd552c67bfa', 'src/app/guestbook/actions.ts', 15, 0, 1)
on conflict (id) do nothing;

-- Exercise 3, File 1 — page.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('f2a6372a-6379-45d2-b6ab-e12484a2228b', 'b9e6e812-78d1-4db5-b384-cd974421b53e', '@@ -1,30 +1,25 @@',
'[
  {"type":"removed","content":"\"use client\";","oldLineNumber":1,"newLineNumber":null},
  {"type":"removed","content":"import { useState } from \"react\";","oldLineNumber":2,"newLineNumber":null},
  {"type":"removed","content":"import { useRouter } from \"next/navigation\";","oldLineNumber":3,"newLineNumber":null},
  {"type":"added","content":"import { addEntry } from \"./actions\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"unchanged","content":"","oldLineNumber":4,"newLineNumber":2},
  {"type":"removed","content":"export default function Guestbook() {","oldLineNumber":5,"newLineNumber":null},
  {"type":"removed","content":"  const [message, setMessage] = useState(\"\");","oldLineNumber":6,"newLineNumber":null},
  {"type":"removed","content":"  const [loading, setLoading] = useState(false);","oldLineNumber":7,"newLineNumber":null},
  {"type":"removed","content":"  const router = useRouter();","oldLineNumber":8,"newLineNumber":null},
  {"type":"removed","content":"","oldLineNumber":9,"newLineNumber":null},
  {"type":"removed","content":"  const handleSubmit = async (e: React.FormEvent) => {","oldLineNumber":10,"newLineNumber":null},
  {"type":"removed","content":"    e.preventDefault();","oldLineNumber":11,"newLineNumber":null},
  {"type":"removed","content":"    setLoading(true);","oldLineNumber":12,"newLineNumber":null},
  {"type":"removed","content":"    await fetch(\"/api/guestbook\", {","oldLineNumber":13,"newLineNumber":null},
  {"type":"removed","content":"      method: \"POST\",","oldLineNumber":14,"newLineNumber":null},
  {"type":"removed","content":"      body: JSON.stringify({ message }),","oldLineNumber":15,"newLineNumber":null},
  {"type":"removed","content":"    });","oldLineNumber":16,"newLineNumber":null},
  {"type":"removed","content":"    setMessage(\"\");","oldLineNumber":17,"newLineNumber":null},
  {"type":"removed","content":"    router.refresh();","oldLineNumber":18,"newLineNumber":null},
  {"type":"removed","content":"    setLoading(false);","oldLineNumber":19,"newLineNumber":null},
  {"type":"removed","content":"  };","oldLineNumber":20,"newLineNumber":null},
  {"type":"added","content":"export default async function Guestbook() {","oldLineNumber":null,"newLineNumber":3},
  {"type":"unchanged","content":"","oldLineNumber":21,"newLineNumber":4},
  {"type":"unchanged","content":"  return (","oldLineNumber":22,"newLineNumber":5},
  {"type":"removed","content":"    <form onSubmit={handleSubmit} className=\"flex flex-col gap-4\">","oldLineNumber":23,"newLineNumber":null},
  {"type":"removed","content":"      <input","oldLineNumber":24,"newLineNumber":null},
  {"type":"removed","content":"        value={message}","oldLineNumber":25,"newLineNumber":null},
  {"type":"removed","content":"        onChange={(e) => setMessage(e.target.value)}","oldLineNumber":26,"newLineNumber":null},
  {"type":"removed","content":"        placeholder=\"Leave a message\"","oldLineNumber":27,"newLineNumber":null},
  {"type":"removed","content":"      />","oldLineNumber":28,"newLineNumber":null},
  {"type":"removed","content":"      <button disabled={loading}>Submit</button>","oldLineNumber":29,"newLineNumber":null},
  {"type":"added","content":"    <form action={addEntry} className=\"flex flex-col gap-4\">","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"      <input","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"        name=\"message\"","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"        placeholder=\"Leave a message\"","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"        required","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"      />","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"      <button type=\"submit\">Submit</button>","oldLineNumber":null,"newLineNumber":12},
  {"type":"unchanged","content":"    </form>","oldLineNumber":30,"newLineNumber":13},
  {"type":"unchanged","content":"  );","oldLineNumber":31,"newLineNumber":14},
  {"type":"unchanged","content":"}","oldLineNumber":32,"newLineNumber":15}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 3, File 2 — actions.ts chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('e612ea2c-47ea-4ff7-baba-211c4c8adcf0', 'c4c20fcb-8af7-4e6f-a885-3b95a125ba11', '@@ -0,0 +1,15 @@',
'[
  {"type":"added","content":"import { db } from \"../lib/db\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"export async function addEntry(formData: FormData) {","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"  const message = formData.get(\"message\");","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"  ","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  try {","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"    await db.guestbook.create({","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"      data: {","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"        message: message as string,","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"      }","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"    });","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"    return { success: true };","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"  } catch (error) {","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"    return { error: \"Failed to add entry\" };","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":16}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 3 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('f4b6ad72-8d99-4c5e-ba48-5248bfb361a9', '71c4c95f-6a68-450b-85d8-5bd552c67bfa',
 'Missing `"use server"` directive',
 'The `actions.ts` file exports a function meant to be a Server Action, but it lacks the `"use server";` directive at the top of the file. Without it, Next.js will not treat it as a valid server action.',
 'critical', 'export async function addEntry(formData: FormData) {', 0),
('a2f14ea3-2a31-4e78-9e12-b5e1ab8b7921', '71c4c95f-6a68-450b-85d8-5bd552c67bfa',
 'Missing server-side validation',
 'The input `message` is extracted from `FormData` and cast to `string` without checking if it''s empty, too long, or maliciously crafted. Server Actions require robust validation (e.g., using Zod).',
 'critical', '        message: message as string,', 1),
('2c8cd114-1e05-4f3b-b6d8-7e3f4e1f7f6a', '71c4c95f-6a68-450b-85d8-5bd552c67bfa',
 'Missing `revalidatePath`',
 'After a successful form submission, the UI will not automatically update to show the new guestbook entry unless `revalidatePath(''/guestbook'')` is called.',
 'critical', '    return { success: true };', 2),
('6fa3a91b-8f3e-4b47-b893-9c8f8b89e3a6', '71c4c95f-6a68-450b-85d8-5bd552c67bfa',
 'No loading state or client feedback',
 'The `button` doesn''t use `useFormStatus` to show a pending state, so users might submit multiple times thinking it didn''t work. Also, the returned errors/success states are not being read or displayed in `page.tsx`.',
 'suggestion', '      <button type=\"submit\">Submit</button>', 3)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Exercise 4: Optimize images with next/image
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  'bc7eb9b7-3b95-4dc2-a725-ebd024a1b025',
  'Implement next/image for product gallery',
  'This PR replaces standard `<img>` tags with Next.js `<Image>` components to improve Core Web Vitals, specifically LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift).',
  'Junior',
  array['Next.js', 'React'],
  array['performance', 'ui'],
  'emily-w',
  'main',
  'perf/next-image-optimization',
  array[
    'Using `fill` without `position: relative` on the parent container, causing the image to break out of its layout.',
    'Missing the `sizes` attribute on responsive images, which leads to the browser downloading unnecessarily large images on mobile.',
    'Applying `priority` to all images in a map loop, which defeats the purpose of prioritizing only the LCP element.'
  ]
) on conflict (id) do nothing;

-- Exercise 4 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('d1f8876c-3e3a-4ef4-9e33-727c9c279eb0', 'bc7eb9b7-3b95-4dc2-a725-ebd024a1b025', 'src/components/ProductGallery.tsx', 15, 12, 0)
on conflict (id) do nothing;

-- Exercise 4, File 1 — ProductGallery.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('f8cc90c3-f66f-42e5-beaf-2cd7a80b001a', 'd1f8876c-3e3a-4ef4-9e33-727c9c279eb0', '@@ -1,20 +1,23 @@',
'[
  {"type":"removed","content":"import React from \"react\";","oldLineNumber":1,"newLineNumber":null},
  {"type":"added","content":"import Image from \"next/image\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"unchanged","content":"","oldLineNumber":2,"newLineNumber":2},
  {"type":"unchanged","content":"interface ProductGalleryProps {","oldLineNumber":3,"newLineNumber":3},
  {"type":"unchanged","content":"  images: { id: string; url: string; alt: string }[];","oldLineNumber":4,"newLineNumber":4},
  {"type":"unchanged","content":"}","oldLineNumber":5,"newLineNumber":5},
  {"type":"unchanged","content":"","oldLineNumber":6,"newLineNumber":6},
  {"type":"unchanged","content":"export function ProductGallery({ images }: ProductGalleryProps) {","oldLineNumber":7,"newLineNumber":7},
  {"type":"unchanged","content":"  return (","oldLineNumber":8,"newLineNumber":8},
  {"type":"unchanged","content":"    <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">","oldLineNumber":9,"newLineNumber":9},
  {"type":"unchanged","content":"      {images.map((img, index) => (","oldLineNumber":10,"newLineNumber":10},
  {"type":"removed","content":"        <div key={img.id} className=\"aspect-square overflow-hidden bg-gray-100 rounded-lg\">","oldLineNumber":11,"newLineNumber":null},
  {"type":"removed","content":"          <img","oldLineNumber":12,"newLineNumber":null},
  {"type":"removed","content":"            src={img.url}","oldLineNumber":13,"newLineNumber":null},
  {"type":"removed","content":"            alt={img.alt}","oldLineNumber":14,"newLineNumber":null},
  {"type":"removed","content":"            className=\"w-full h-full object-cover\"","oldLineNumber":15,"newLineNumber":null},
  {"type":"removed","content":"          />","oldLineNumber":16,"newLineNumber":null},
  {"type":"added","content":"        <div key={img.id} className=\"aspect-square overflow-hidden bg-gray-100 rounded-lg\">","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"          <Image","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"            src={img.url}","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"            alt={img.alt}","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"            fill","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"            className=\"object-cover\"","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"            priority={true}","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"          />","oldLineNumber":null,"newLineNumber":18},
  {"type":"unchanged","content":"        </div>","oldLineNumber":17,"newLineNumber":19},
  {"type":"unchanged","content":"      ))}","oldLineNumber":18,"newLineNumber":20},
  {"type":"unchanged","content":"    </div>","oldLineNumber":19,"newLineNumber":21},
  {"type":"unchanged","content":"  );","oldLineNumber":20,"newLineNumber":22},
  {"type":"unchanged","content":"}","oldLineNumber":21,"newLineNumber":23}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 4 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('f8cc90c3-f66f-42e5-beaf-2cd7a80b0013', 'bc7eb9b7-3b95-4dc2-a725-ebd024a1b025',
 'Missing `sizes` attribute',
 'When using `fill`, Next.js doesn''t know the display size beforehand. Without `sizes`, it will default to fetching large 100vw images, hurting mobile performance.',
 'critical', '            fill', 2)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Exercise 5: Implement Search functionality with URL params
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  'e5270c3e-bc0d-4521-82d2-88849646b5a5',
  'Implement Search functionality with URL params',
  'This PR adds a search page that filters a list of products based on the `q` query parameter. It extracts the search input and results display into smaller client components, utilizing Next.js `useSearchParams` and `useRouter`.',
  'Mid',
  array['Next.js', 'React', 'TypeScript'],
  array['performance', 'client components', 'routing'],
  'ryan-d',
  'main',
  'feature/search-params',
  array[
    'Missing `<Suspense>` boundary around the component using `useSearchParams`.',
    'Using a standard `<a>` tag instead of Next.js `<Link>` for internal navigation, which causes a full page reload.'
  ]) on conflict (id) do nothing;

-- Exercise 5 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('b9a13f28-d8f1-4e1b-8c88-9d32b5f7e6a1', 'e5270c3e-bc0d-4521-82d2-88849646b5a5', 'src/app/search/page.tsx', 12, 0, 0),
  ('c28d1e44-1fbc-49b0-a7d1-3e5f2a96c4d7', 'e5270c3e-bc0d-4521-82d2-88849646b5a5', 'src/components/SearchInput.tsx', 26, 0, 1),
  ('d9e72b4c-9f8d-4e2b-a5d6-b8c3f7e1a6b4', 'e5270c3e-bc0d-4521-82d2-88849646b5a5', 'src/components/SearchResults.tsx', 37, 0, 2)
on conflict (id) do nothing;

-- Exercise 5, File 1 — page.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('e4d8fbac-1f2e-4a6c-9d8a-bc3e4f7a1b5c', 'b9a13f28-d8f1-4e1b-8c88-9d32b5f7e6a1', '@@ -0,0 +1,12 @@',
'[
  {"type":"added","content":"import { SearchInput } from \"@/components/SearchInput\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { SearchResults } from \"@/components/SearchResults\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"export default function SearchPage() {","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"    <main className=\"p-8 max-w-4xl mx-auto\">","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"      <h1 className=\"text-3xl font-bold mb-6\">Search Products</h1>","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"      <SearchInput />","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"      <SearchResults />","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    </main>","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":12}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 5, File 2 — SearchInput.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('f8a2c1d3-4e8b-49d7-8f5c-a2b1e3c4d5f6', 'c28d1e44-1fbc-49b0-a7d1-3e5f2a96c4d7', '@@ -0,0 +1,26 @@',
'[
  {"type":"added","content":"\"use client\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { useRouter, useSearchParams } from \"next/navigation\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"import { useState } from \"react\";","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"export function SearchInput() {","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  const router = useRouter();","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"  const searchParams = useSearchParams();","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"  const [query, setQuery] = useState(searchParams.get(\"q\") || \"\");","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"  const handleSearch = (e: React.FormEvent) => {","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"    e.preventDefault();","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"    router.push(`/search?q=${encodeURIComponent(query)}`);","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"  };","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"    <form onSubmit={handleSearch} className=\"flex gap-2 mb-8\">","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"      <input ","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"        value={query}","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"        onChange={(e) => setQuery(e.target.value)}","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"        placeholder=\"Search for a product...\"","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"        className=\"border border-gray-300 p-2 rounded w-full max-w-md\"","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"      />","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"      <button type=\"submit\" className=\"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded\">","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"        Search","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"      </button>","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"    </form>","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":27}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 5, File 3 — SearchResults.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', 'd9e72b4c-9f8d-4e2b-a5d6-b8c3f7e1a6b4', '@@ -0,0 +1,37 @@',
'[
  {"type":"added","content":"\"use client\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { useSearchParams } from \"next/navigation\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"import { useEffect, useState } from \"react\";","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"interface Product { id: string; name: string; description: string; price: number; }","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"export function SearchResults() {","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"  const searchParams = useSearchParams();","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"  const q = searchParams.get(\"q\");","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"  const [results, setResults] = useState<Product[]>([]);","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"  const [loading, setLoading] = useState(false);","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"  useEffect(() => {","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"    if (!q) return;","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"    setLoading(true);","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"    fetch(`/api/search?q=${encodeURIComponent(q)}`)","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"      .then(res => res.json())","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"      .then(data => {","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"        setResults(data);","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"      })","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"      .finally(() => setLoading(false));","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"  }, [q]);","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"  if (!q) return <p className=\"text-gray-500\">Enter a search term to find products.</p>;","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"  if (loading) return <p className=\"text-gray-500 animate-pulse\">Loading results for \"{q}\"...</p>;","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"    <div className=\"grid gap-4 md:grid-cols-2\">","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"      {results.map((item) => (","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"        <div key={item.id} className=\"border p-4 rounded-lg bg-white shadow-sm flex flex-col\">","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"          <h3 className=\"font-bold text-lg\">{item.name}</h3>","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"          <p className=\"text-sm text-gray-600 mt-1 mb-4 flex-grow\">{item.description}</p>","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"          <a href={`/product/${item.id}`} className=\"text-blue-600 hover:text-blue-800 font-medium self-start\">","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"            View Details →","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"          </a>","oldLineNumber":null,"newLineNumber":35},
  {"type":"added","content":"        </div>","oldLineNumber":null,"newLineNumber":36},
  {"type":"added","content":"      ))}","oldLineNumber":null,"newLineNumber":37},
  {"type":"added","content":"    </div>","oldLineNumber":null,"newLineNumber":38},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":39},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":40}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 5 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('b2c3d4e5-f6a7-48b9-8c1d-2e3f4a5b6c7d', 'e5270c3e-bc0d-4521-82d2-88849646b5a5',
 'Missing Suspense around `useSearchParams`',
 'In `page.tsx`, `<SearchResults />` is not wrapped in a `<Suspense>` boundary. Because it uses `useSearchParams()`, Next.js will de-opt the entire page to client-side rendering.',
 'critical', '      <SearchResults />', 0),
('c3d4e5f6-a7b8-49c0-9d2e-3f4a5b6c7d8e', 'e5270c3e-bc0d-4521-82d2-88849646b5a5',
 'Using regular `<a>` tag for internal navigation',
 'The component uses `<a href="...">` which triggers a full browser reload. For single-page application navigation, `import Link from "next/link"` and use `<Link href="...">` should be used.',
 'critical', '          <a href={`/product/${item.id}`} className=\"text-blue-600 hover:text-blue-800 font-medium self-start\">', 1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Exercise 6: Fix polling hook and immutable state in React
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  'a6f3b2c1-d4e5-4f6a-8b9c-0d1e2f3a4b5c',
  'Fix polling hook and immutable state in React',
  'This PR adds a generic `usePolling` hook to fetch data at regular intervals, and a `DataGrid` component that displays the metrics and allows client-side sorting.',
  'Mid',
  array['React', 'TypeScript'],
  array['hooks', 'performance', 'state'],
  'jessica-w',
  'main',
  'feature/metrics-polling',
  array[
    'Passing an inline function to a hook that expects it as a dependency, causing infinite re-rendering / effect thrashing.',
    'Mutating an array directly using `.sort()` instead of creating a copy first.'
  ]) on conflict (id) do nothing;

-- Exercise 6 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('b7c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e', 'a6f3b2c1-d4e5-4f6a-8b9c-0d1e2f3a4b5c', 'src/hooks/usePolling.ts', 22, 0, 0),
  ('c8d9e0f1-a2b3-4c4d-5e6f-7a8b9c0d1e2f', 'a6f3b2c1-d4e5-4f6a-8b9c-0d1e2f3a4b5c', 'src/components/DataGrid.tsx', 30, 0, 1)
on conflict (id) do nothing;

-- Exercise 6, File 1 — usePolling.ts chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('d9e0f1a2-b3c4-4d5e-6f7a-8b9c0d1e2f3a', 'b7c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e', '@@ -0,0 +1,22 @@',
'[
  {"type":"added","content":"import { useState, useEffect } from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"export function usePolling<T>(fetchData: () => Promise<T>, delay: number) {","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"  const [data, setData] = useState<T | null>(null);","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  useEffect(() => {","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"    let active = true;","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"    const tick = async () => {","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"      const result = await fetchData();","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"      if (active) setData(result);","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"    };","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"    tick();","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"    const id = setInterval(tick, delay);","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"    return () => {","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"      active = false;","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"      clearInterval(id);","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"    };","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"  }, [fetchData, delay]);","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"  return data;","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":23}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 6, File 2 — DataGrid.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('e0f1a2b3-c4d5-4e6f-7a8b-9c0d1e2f3a4b', 'c8d9e0f1-a2b3-4c4d-5e6f-7a8b9c0d1e2f', '@@ -0,0 +1,30 @@',
'[
  {"type":"added","content":"import React, { useState } from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { usePolling } from \"../hooks/usePolling\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"import { fetchMetrics } from \"../api/metrics\";","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"export function DataGrid({ endpoint }: { endpoint: string }) {","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  const [sortDesc, setSortDesc] = useState(true);","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"  const data = usePolling(() => fetchMetrics(endpoint), 5000);","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"  if (!data) return <div className=\"p-4\">Loading metrics...</div>;","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"  const handleToggleSort = () => {","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"    setSortDesc(!sortDesc);","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"    data.sort((a: any, b: any) => sortDesc ? a.value - b.value : b.value - a.value);","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"  };","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"    <div className=\"border rounded-lg p-6 max-w-2xl\">","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"      <div className=\"flex justify-between items-center mb-4\">","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"        <h2 className=\"text-xl font-bold\">System Metrics</h2>","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"        <button onClick={handleToggleSort} className=\"bg-gray-100 px-3 py-1 rounded\">","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"          Sort {sortDesc ? \"Ascending\" : \"Descending\"}","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"        </button>","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"      </div>","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"      <div className=\"flex flex-col gap-2\">","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"        {data.map((item: any) => (","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"          <div key={item.id} className=\"flex justify-between bg-gray-50 p-3\">","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"            <span>{item.name}</span>","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"            <span className=\"font-mono\">{item.value}</span>","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"          </div>","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"        ))}","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"      </div>","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"    </div>","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":35}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 6 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a6f3b2c1-d4e5-4f6a-8b9c-0d1e2f3a4b5c',
 'Effect Thrashing / Infinite Loop Risk',
 'The `fetchData` arrow function passed to `usePolling` is recreated on every render. Because it is in the `useEffect` dependency array in `usePolling`, the effect tears down and restarts constantly, ruining the polling interval and causing excessive API calls. Wrap it in `useCallback`.',
 'critical', '  const data = usePolling(() => fetchMetrics(endpoint), 5000);', 0),
('a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', 'a6f3b2c1-d4e5-4f6a-8b9c-0d1e2f3a4b5c',
 'Direct State Mutation',
 'Calling `data.sort(...)` mutates the array directly. React requires state to be treated as immutable. You should clone the array first: `[...data].sort(...)`.',
 'critical', '    data.sort((a: any, b: any) => sortDesc ? a.value - b.value : b.value - a.value);', 1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Exercise 7: Add Stripe Checkout integration
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)
values (
  'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f',
  'Add Stripe Checkout integration for premium subscriptions',
  'This PR adds a Stripe Checkout integration for the premium subscription tier. It introduces a new payment service, an API route to create checkout sessions, and a webhook handler to process Stripe events after successful payments.',
  'Mid',
  array['TypeScript', 'Next.js', 'Stripe'],
  array['security', 'payments', 'api'],
  'david-k',
  'main',
  'feature/stripe-checkout',
  array[
    'The Stripe secret API key is hardcoded directly in the source code instead of using environment variables — this is a critical security vulnerability.',
    'The webhook handler does not verify the Stripe signature, meaning anyone can send fake webhook events.',
    'No idempotency key is used when creating checkout sessions, which could lead to duplicate charges on retries.'
  ]
) on conflict (id) do nothing;

-- Exercise 7 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('e4b8f2c3-5d6e-47f9-ab1c-2d3e4f5a6b7c', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f', 'src/lib/stripe.ts', 18, 0, 0),
  ('f5c9a3d4-6e7f-48a0-bc2d-3e4f5a6b7c8d', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f', 'src/app/api/checkout/route.ts', 32, 0, 1),
  ('a6d0b4e5-7f8a-49b1-cd3e-4f5a6b7c8d9e', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f', 'src/app/api/webhooks/stripe/route.ts', 38, 0, 2)
on conflict (id) do nothing;

-- Exercise 7, File 1 — stripe.ts chunk (Stripe client initialization with hardcoded key)
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('b7e1c5f9-8a2b-4c3d-de4f-5a6b7c8d9e0f', 'e4b8f2c3-5d6e-47f9-ab1c-2d3e4f5a6b7c', '@@ -0,0 +1,18 @@',
'[
  {"type":"added","content":"import Stripe from \"stripe\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"// Initialize Stripe client","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"const stripe = new Stripe(\"sk_live_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ\", {","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"  apiVersion: \"2024-04-10\",","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"});","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"export const PREMIUM_PRICE_ID = \"price_1ABC123DEF456\";","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"export async function createCheckoutSession(userId: string, email: string) {","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"  return stripe.checkout.sessions.create({","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"    customer_email: email,","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"    line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"    mode: \"subscription\",","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"    metadata: { userId },","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"  });","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":19}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 7, File 2 — checkout/route.ts chunk (API route to create session)
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('c8f2d6a0-9b3c-4d4e-ef5a-6b7c8d9e0f1a', 'f5c9a3d4-6e7f-48a0-bc2d-3e4f5a6b7c8d', '@@ -0,0 +1,32 @@',
'[
  {"type":"added","content":"import { NextRequest, NextResponse } from \"next/server\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import { createCheckoutSession } from \"@/lib/stripe\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"import { getServerSession } from \"next-auth\";","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"import { authOptions } from \"@/lib/auth\";","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"export async function POST(req: NextRequest) {","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"  try {","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"    const session = await getServerSession(authOptions);","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    if (!session?.user) {","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"      return NextResponse.json({ error: \"Unauthorized\" }, { status: 401 });","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"    }","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"    const { priceId } = await req.json();","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"    const checkoutSession = await createCheckoutSession(","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"      session.user.id,","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"      session.user.email!","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"    );","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"    return NextResponse.json({ url: checkoutSession.url });","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"  } catch (error) {","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"    console.error(\"Checkout error:\", error);","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"    return NextResponse.json(","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"      { error: \"Failed to create checkout session\" },","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"      { status: 500 }","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"    );","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":29}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 7, File 3 — webhooks/stripe/route.ts chunk (webhook handler without signature verification)
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('d9a3e7b1-0c4d-4e5f-fa6b-7c8d9e0f1a2b', 'a6d0b4e5-7f8a-49b1-cd3e-4f5a6b7c8d9e', '@@ -0,0 +1,38 @@',
'[
  {"type":"added","content":"import { NextRequest, NextResponse } from \"next/server\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"import Stripe from \"stripe\";","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"import { db } from \"@/lib/db\";","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"export async function POST(req: NextRequest) {","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  const body = await req.json();","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"  const event = body as Stripe.Event;","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"  try {","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    switch (event.type) {","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"      case \"checkout.session.completed\": {","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"        const session = event.data.object as Stripe.Checkout.Session;","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"        const userId = session.metadata?.userId;","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"        if (userId) {","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"          await db.user.update({","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"            where: { id: userId },","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"            data: {","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"              isPremium: true,","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"              stripeCustomerId: session.customer as string,","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"              stripeSubscriptionId: session.subscription as string,","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"            },","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"          });","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"        }","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"        break;","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"      }","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"      default:","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"        console.log(`Unhandled event type: ${event.type}`);","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"    }","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"    return NextResponse.json({ received: true });","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"  } catch (error) {","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"    console.error(\"Webhook error:\", error);","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"    return NextResponse.json({ error: \"Webhook failed\" }, { status: 500 });","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"  }","oldLineNumber":null,"newLineNumber":35},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":36}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 7 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('e0b4f8c2-1d5e-4a6f-8b9c-2d3e4f5a6b7c', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f',
 'Hardcoded Stripe secret API key',
 'The Stripe secret key `sk_live_...` is hardcoded directly in the source code. This is a critical security vulnerability — secret keys should never be committed to version control. Use `process.env.STRIPE_SECRET_KEY` and store the key in environment variables.',
 'critical', 'const stripe = new Stripe("sk_live_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ", {', 0),
('f1c5a9d3-2e6f-4b7a-9c0d-3e4f5a6b7c8d', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f',
 'Missing webhook signature verification',
 'The webhook handler parses the body with `req.json()` and casts it directly to `Stripe.Event` without verifying the signature using `stripe.webhooks.constructEvent(body, sig, webhookSecret)`. This allows anyone to send fake webhook events and grant themselves premium access.',
 'critical', '  const event = body as Stripe.Event;', 1),
('a2d6b0e4-3f7a-4c8b-ad1e-4f5a6b7c8d9e', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f',
 'Non-null assertion on user email',
 'Using `session.user.email!` (non-null assertion) is unsafe. If `email` is `null` or `undefined`, this will pass `undefined` to the Stripe API, which may cause an unclear error. Add a proper null check and return an error response.',
 'critical', '      session.user.email!', 2),
('b3e7c1f5-4a8b-4d9c-be2f-5a6b7c8d9e0f', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f',
 'Unused `priceId` from request body',
 'The route destructures `priceId` from the request body but never uses it — `createCheckoutSession` uses the hardcoded `PREMIUM_PRICE_ID` instead. Either use the provided `priceId` (with validation) or remove it from the destructuring to avoid confusion.',
 'suggestion', '    const { priceId } = await req.json();', 3),
('c4f8d2a6-5b9c-4e0d-cf3a-6b7c8d9e0f1a', 'd3a7f1b2-4c5e-46d8-9a0b-1e2f3c4d5e6f',
 'No idempotency key for checkout session creation',
 'The checkout session is created without an idempotency key. If the client retries due to a network timeout, this could create duplicate checkout sessions. Pass an `idempotencyKey` option based on the user ID and a timestamp or request ID.',
 'suggestion', null, 4)
on conflict (id) do nothing;
