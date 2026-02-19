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