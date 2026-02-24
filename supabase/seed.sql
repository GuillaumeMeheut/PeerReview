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
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed, senior_example)
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
  ],
  E'The refactoring direction is solid — extracting the fetch logic into a hook follows SRP well. However, there are a few issues:\n\n1. **Type safety**: `catch (err: any)` should be `catch (err: unknown)` with proper type narrowing: `err instanceof Error ? err.message : ''Unknown error''`.\n\n2. **Null guard removed**: The original had `if (!user) return null` which protected downstream components. Now `UserAvatar` and `UserStats` receive a potentially null `user`. Either add the guard back or make the child components handle null.\n\n3. **Race condition**: If `userId` changes rapidly, stale responses could overwrite fresh ones. Consider an AbortController or a ref-based cleanup.\n\n4. **Minor**: The inline prop type `{ userId: string }` works but a named interface is better for documentation and reuse across tests.\n\nOverall: Approve with requested changes on items 1 and 2.'
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
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed, senior_example)
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
  ],
  E'This PR has a good foundation — cache + retry is a common and valuable pattern. But there are several production-readiness issues:\n\n1. **Unbounded cache**: The `Map` cache has no eviction policy or max size. In production, this will grow indefinitely. Add either an LRU eviction policy or a max entry count.\n\n2. **Cache key design**: Using just the endpoint string as cache key is fragile. It should include query parameters, and potentially headers that affect response content (like `Accept-Language`).\n\n3. **Retry scope**: `withRetry` retries on ALL errors. It should only retry on network errors and 5xx responses. Add: `if (axios.isAxiosError(err) && err.response && err.response.status < 500) throw err;`\n\n4. **Breaking change**: `apiPost` was removed. If any module imports it, this PR breaks them. Either keep it, or this PR should update all callers.\n\n5. **Testing**: The singleton `apiCache` leaks state between tests. The `beforeEach(() => apiCache.clear())` is a workaround but fragile. Consider injecting the cache dependency.\n\nRequest changes on items 1, 3, and 4. The rest are improvements for a follow-up.'
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
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed, senior_example)
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
  ],
  E'The adoption of Server Actions here is a great step forward for performance. However, there are a few critical issues to address:\n\n1. **Missing Directive**: The `actions.ts` file needs the `"use server";` directive at the very top. Without it, the function will run on the client or throw an error.\n\n2. **Validation**: We are reading `formData.get(''message'')` and inserting it directly. We must validate and sanitize this input on the server, as client-side validation can be bypassed.\n\n3. **Cache Invalidation**: After a successful insertion, we need to call `revalidatePath(''/guestbook'')` so the page reflects the new entry immediately.\n\n4. **UX/Feedback**: Consider using React''s `useActionState` to handle error messages and `useFormStatus` to show a pending loading state on the submit button. Currently, the user gets no feedback if it fails.\n\nPlease address the `use server` directive, validation, and revalidation at a minimum before we merge.'
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
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed, senior_example)
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
  ],
  E'Good initiative on migrating to `next/image` to improve web vitals! However, improper configuration can actually hurt performance and layout.\n\n1. **Layout Shift (CLS) Risk**: You are using `fill={true}`, but the parent `<div className="aspect-square">` needs `relative` positioning (i.e. `className="aspect-square relative"`). Otherwise, the image will fill the nearest relative ancestor or the whole page.\n\n2. **Performance (LCP) Risk**: Adding `priority={true}` inside the `.map` loop means *all* images will be preloaded. This starves the network. Only the first 1 or 2 images that are immediately visible in the viewport should have `priority`.\n\n3. **Missing `sizes` Prop**: Since you are using `fill`, Next.js doesn''t know how wide the image will be at different breakpoints. It will default to 100vw, generating very large images for mobile devices. Please add a `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` prop.\n\nPlease fix these issues so we can reap the performance benefits!'
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
-- Exercise 5: Fix AI-generated Shopping Cart component
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed, senior_example)
values (
  'e59a8c1f-9b2f-4a39-9d93-1941dfab1111',
  'Fix AI-generated Shopping Cart React anti-patterns',
  'An AI generated this Shopping Cart component. It contains several common React anti-patterns frequently produced by LLMs: subtly mutating state directly, using an unnecessary `useEffect` for derived state, and using array indices as `key`s in a dynamic list.',
  'Junior',
  array['React', 'TypeScript'],
  array['react', 'state-management', 'anti-patterns', 'ai-generated'],
  'ai-assistant',
  'main',
  'feature/ai-shopping-cart',
  array[
    'People often miss the array index being used as a key in the `.map()` because it ''works'' visually until an item is deleted from the middle of the list.',
    'The unnecessary `useEffect` for derived state is frequently missed because it seems to successfully update the total, even though it causes an extra render cycle.'
  ],
  E'Good effort on this component, but there are a few classic React anti-patterns here we need to clean up:\n\n1. **Derived State**: You don''t need a `useEffect` and a separate `total` state variable. This causes an unnecessary extra render. You can simply derive it during render: `const total = items.reduce(...)`.\n2. **State Mutation**: In `removeItem`, you''re subtly mutating the state array: `newItems.splice(index, 1)`. Use `setItems(prev => prev.filter(item => item.id !== id))` instead.\n3. **List Keys**: Using `index` as a key in `items.map((item, index) => ...)` will cause bugs when items are removed. Always use a stable identifier like `item.id`.\n\nCan you update these to follow React best practices?'
) on conflict (id) do nothing;

-- Exercise 5 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('f68b9d2e-0a30-4b40-ae04-2052efbc2222', 'e59a8c1f-9b2f-4a39-9d93-1941dfab1111', 'src/components/ShoppingCart.tsx', 52, 0, 0)
on conflict (id) do nothing;

-- Exercise 5, File 1 — ShoppingCart.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('a79c0e3f-1b41-4c51-bf15-3163f0cd3333', 'f68b9d2e-0a30-4b40-ae04-2052efbc2222', '@@ -0,0 +1,52 @@',
'[
  {"type":"added","content":"import React, { useState, useEffect } from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"interface CartItem {","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"  id: string;","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"  name: string;","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  price: number;","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"export function ShoppingCart() {","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"  const [items, setItems] = useState<CartItem[]>([","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"    { id: \"1\", name: \"Laptop\", price: 999 },","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"    { id: \"2\", name: \"Mouse\", price: 49 },","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"  ]);","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"  const [total, setTotal] = useState(0);","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"  // Calculate total price","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"  useEffect(() => {","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"    let newTotal = 0;","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"    for (let i = 0; i < items.length; i++) {","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"      newTotal += items[i].price;","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"    }","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"    setTotal(newTotal);","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"  }, [items]);","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"  const removeItem = (index: number) => {","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"    const newItems = items;","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"    newItems.splice(index, 1);","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"    setItems([...newItems]);","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"  };","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"    <div className=\"p-4 border rounded-lg\">","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"      <h2 className=\"text-xl font-bold mb-4\">Cart ({items.length} items)</h2>","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"      <ul className=\"space-y-2 mb-4\">","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"        {items.map((item, index) => (","oldLineNumber":null,"newLineNumber":35},
  {"type":"added","content":"          <li key={index} className=\"flex justify-between items-center p-2 bg-gray-50 rounded\">","oldLineNumber":null,"newLineNumber":36},
  {"type":"added","content":"            <span>{item.name} - ${item.price}</span>","oldLineNumber":null,"newLineNumber":37},
  {"type":"added","content":"            <button","oldLineNumber":null,"newLineNumber":38},
  {"type":"added","content":"              onClick={() => removeItem(index)}","oldLineNumber":null,"newLineNumber":39},
  {"type":"added","content":"              className=\"text-red-500 hover:text-red-700\"","oldLineNumber":null,"newLineNumber":40},
  {"type":"added","content":"            >","oldLineNumber":null,"newLineNumber":41},
  {"type":"added","content":"              Remove","oldLineNumber":null,"newLineNumber":42},
  {"type":"added","content":"            </button>","oldLineNumber":null,"newLineNumber":43},
  {"type":"added","content":"          </li>","oldLineNumber":null,"newLineNumber":44},
  {"type":"added","content":"        ))}","oldLineNumber":null,"newLineNumber":45},
  {"type":"added","content":"      </ul>","oldLineNumber":null,"newLineNumber":46},
  {"type":"added","content":"      <div className=\"text-lg font-bold border-t pt-2\">","oldLineNumber":null,"newLineNumber":47},
  {"type":"added","content":"        Total: ${total}","oldLineNumber":null,"newLineNumber":48},
  {"type":"added","content":"      </div>","oldLineNumber":null,"newLineNumber":49},
  {"type":"added","content":"    </div>","oldLineNumber":null,"newLineNumber":50},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":51},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":52}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 5 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('b80d1f40-2c52-4d62-c026-427401de4444', 'e59a8c1f-9b2f-4a39-9d93-1941dfab1111',
 'Unnecessary `useEffect` for derived state',
 'Using `useEffect` to calculate the total price when `items` changes causes an unnecessary extra render. This value should be derived directly during the render cycle without `useEffect`.',
 'critical', '  useEffect(() => {', 0),
('c91e2051-3d63-4e73-d137-538512ef5555', 'e59a8c1f-9b2f-4a39-9d93-1941dfab1111',
 'Direct state mutation',
 'Assigning `newItems = items` and calling `splice()` subtly mutates the original state array before spreading it. You should use `.filter()` or create a true copy first.',
 'critical', '    newItems.splice(index, 1);', 1),
('da2f3162-4e74-4f84-e248-649623f06666', 'e59a8c1f-9b2f-4a39-9d93-1941dfab1111',
 'Using array index as key',
 'Using `index` as a list key in a dynamic list where items can be removed will cause React to incorrectly reuse DOM nodes, leading to rendering bugs. `item.id` should be used instead.',
 'critical', '          <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">', 2)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Exercise 6: Fix AI-generated Stale Closure & Infinite Loop
-- ---------------------------------------------------------------------------
insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed, senior_example)
values (
  'ebcd9a21-8b3e-4c40-ace4-2195f0ac7122',
  'Fix AI-generated Stale Closure & Infinite Loop',
  'This AI-generated search component has two major flaws common with LLM code: it uses a `setInterval` that captures a stale closure of a state variable, and it includes an inline object in a `useEffect` dependency array, triggering excessive re-renders/API calls.',
  'Mid',
  array['React', 'TypeScript'],
  array['react', 'hooks', 'performance', 'ai-generated'],
  'ai-assistant',
  'main',
  'feature/ai-stale-closure',
  array[
    'The stale closure in `setInterval` or `setTimeout` is notoriously difficult to spot in code review.',
    'Inline objects in dependency arrays look harmless but silently break referential equality, causing infinite loops.'
  ],
  E'There are two critical hook issues here:\n\n1. **Stale Closure**: Your `setInterval` in `startPolling` only captures the value of `query` from the render cycle where it was created. It will forever use that initial value. You should either put the interval inside a `useEffect` with `query` as a dependency, or use a ref.\n2. **Referential Equality Loop**: In `useEffect`, you are passing `{ query, limit: 10 }` directly into the dependency array (or a function that returns it). Because it creates a *new object reference* on every render, the `useEffect` runs infinitely. Memoize the object with `useMemo` or deconstruct its primitives into the dependency array.\n\nPlease fix the infinite loop and stale data issues.'
) on conflict (id) do nothing;

-- Exercise 6 — Files
insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values
  ('d8a94e50-13a8-4bb9-bd89-8d727b1f5555', 'ebcd9a21-8b3e-4c40-ace4-2195f0ac7122', 'src/components/SearchWithPolling.tsx', 56, 0, 0)
on conflict (id) do nothing;

-- Exercise 6, File 1 — SearchWithPolling.tsx chunk
insert into public.file_chunks (id, file_id, header, lines, sort_order) values
('f1a23b40-8c5d-4a1e-ab71-3312c4d57777', 'd8a94e50-13a8-4bb9-bd89-8d727b1f5555', '@@ -0,0 +1,56 @@',
'[
  {"type":"added","content":"import React, { useState, useEffect } from \"react\";","oldLineNumber":null,"newLineNumber":1},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":2},
  {"type":"added","content":"export function SearchWithPolling() {","oldLineNumber":null,"newLineNumber":3},
  {"type":"added","content":"  const [query, setQuery] = useState(\"\");","oldLineNumber":null,"newLineNumber":4},
  {"type":"added","content":"  const [results, setResults] = useState<string[]>([]);","oldLineNumber":null,"newLineNumber":5},
  {"type":"added","content":"  const [isPolling, setIsPolling] = useState(false);","oldLineNumber":null,"newLineNumber":6},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":7},
  {"type":"added","content":"  const startPolling = () => {","oldLineNumber":null,"newLineNumber":8},
  {"type":"added","content":"    setIsPolling(true);","oldLineNumber":null,"newLineNumber":9},
  {"type":"added","content":"    setInterval(() => {","oldLineNumber":null,"newLineNumber":10},
  {"type":"added","content":"      console.log(\"Polling for:\", query);","oldLineNumber":null,"newLineNumber":11},
  {"type":"added","content":"      fetch(`/api/search?q=${query}`)","oldLineNumber":null,"newLineNumber":12},
  {"type":"added","content":"        .then(res => res.json())","oldLineNumber":null,"newLineNumber":13},
  {"type":"added","content":"        .then(data => setResults(data));","oldLineNumber":null,"newLineNumber":14},
  {"type":"added","content":"    }, 5000);","oldLineNumber":null,"newLineNumber":15},
  {"type":"added","content":"  };","oldLineNumber":null,"newLineNumber":16},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":17},
  {"type":"added","content":"  const searchConfig = {","oldLineNumber":null,"newLineNumber":18},
  {"type":"added","content":"    term: query,","oldLineNumber":null,"newLineNumber":19},
  {"type":"added","content":"    limit: 10,","oldLineNumber":null,"newLineNumber":20},
  {"type":"added","content":"    filters: [\"active\"]","oldLineNumber":null,"newLineNumber":21},
  {"type":"added","content":"  };","oldLineNumber":null,"newLineNumber":22},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":23},
  {"type":"added","content":"  useEffect(() => {","oldLineNumber":null,"newLineNumber":24},
  {"type":"added","content":"    if (searchConfig.term) {","oldLineNumber":null,"newLineNumber":25},
  {"type":"added","content":"      fetch(`/api/search?q=${searchConfig.term}&limit=${searchConfig.limit}`)","oldLineNumber":null,"newLineNumber":26},
  {"type":"added","content":"        .then(res => res.json())","oldLineNumber":null,"newLineNumber":27},
  {"type":"added","content":"        .then(data => setResults(data));","oldLineNumber":null,"newLineNumber":28},
  {"type":"added","content":"    }","oldLineNumber":null,"newLineNumber":29},
  {"type":"added","content":"  }, [searchConfig]);","oldLineNumber":null,"newLineNumber":30},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":31},
  {"type":"added","content":"  return (","oldLineNumber":null,"newLineNumber":32},
  {"type":"added","content":"    <div className=\"p-4\">","oldLineNumber":null,"newLineNumber":33},
  {"type":"added","content":"      <input","oldLineNumber":null,"newLineNumber":34},
  {"type":"added","content":"        type=\"text\"","oldLineNumber":null,"newLineNumber":35},
  {"type":"added","content":"        value={query}","oldLineNumber":null,"newLineNumber":36},
  {"type":"added","content":"        onChange={(e) => setQuery(e.target.value)}","oldLineNumber":null,"newLineNumber":37},
  {"type":"added","content":"        placeholder=\"Search...\"","oldLineNumber":null,"newLineNumber":38},
  {"type":"added","content":"        className=\"border p-2 rounded mr-2\"","oldLineNumber":null,"newLineNumber":39},
  {"type":"added","content":"      />","oldLineNumber":null,"newLineNumber":40},
  {"type":"added","content":"      <button ","oldLineNumber":null,"newLineNumber":41},
  {"type":"added","content":"        onClick={startPolling}","oldLineNumber":null,"newLineNumber":42},
  {"type":"added","content":"        disabled={isPolling}","oldLineNumber":null,"newLineNumber":43},
  {"type":"added","content":"        className=\"bg-blue-500 text-white p-2 rounded disabled:opacity-50\"","oldLineNumber":null,"newLineNumber":44},
  {"type":"added","content":"      >","oldLineNumber":null,"newLineNumber":45},
  {"type":"added","content":"        Start Polling","oldLineNumber":null,"newLineNumber":46},
  {"type":"added","content":"      </button>","oldLineNumber":null,"newLineNumber":47},
  {"type":"added","content":"","oldLineNumber":null,"newLineNumber":48},
  {"type":"added","content":"      <ul className=\"mt-4 space-y-2\">","oldLineNumber":null,"newLineNumber":49},
  {"type":"added","content":"        {results.map((r, i) => (","oldLineNumber":null,"newLineNumber":50},
  {"type":"added","content":"          <li key={i} className=\"p-2 bg-gray-100 rounded\">{r}</li>","oldLineNumber":null,"newLineNumber":51},
  {"type":"added","content":"        ))}","oldLineNumber":null,"newLineNumber":52},
  {"type":"added","content":"      </ul>","oldLineNumber":null,"newLineNumber":53},
  {"type":"added","content":"    </div>","oldLineNumber":null,"newLineNumber":54},
  {"type":"added","content":"  );","oldLineNumber":null,"newLineNumber":55},
  {"type":"added","content":"}","oldLineNumber":null,"newLineNumber":56}
]'::jsonb, 0)
on conflict (id) do nothing;

-- Exercise 6 — Expected Issues
insert into public.exercise_expected_issues (id, exercise_id, title, description, severity, line, sort_order) values
('a1b2c3d4-e5f6-4a1b-8c2d-9e8f7a6b5c4d', 'ebcd9a21-8b3e-4c40-ace4-2195f0ac7122',
 'Infinite Loop in useEffect',
 '`searchConfig` is redefined as a new object on every render. Because it is in the `useEffect` dependency array, it triggers the effect on every render, which calls `setResults`, triggering another render—an infinite loop.',
 'critical', '  }, [searchConfig]);', 0),
('b2c3d4e5-f6a1-4b2c-8d3e-0f9a8b7c6d5e', 'ebcd9a21-8b3e-4c40-ace4-2195f0ac7122',
 'Stale Closure in setInterval',
 'The `query` variable inside `setInterval` is bound to the render scope when `startPolling` was called. It will always be empty (or whatever its value was at the time).',
 'critical', '    setInterval(() => {', 1),
('c3d4e5f6-a1b2-4c3d-8e4f-1a0b9c8d7e6f', 'ebcd9a21-8b3e-4c40-ace4-2195f0ac7122',
 'No clearInterval on unmount',
 'The `setInterval` is never cleared. It will continue running even after the component unmounts, potentially causing memory leaks and React state warnings.',
 'critical', '    setInterval(() => {', 2)
on conflict (id) do nothing;