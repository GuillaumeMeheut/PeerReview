-- Allow users to view user_reviews if they are linked to a solution
create policy "Users can view reviews linked to solutions"
  on public.user_reviews for select
  using (exists (
    select 1 from public.solutions
    where solutions.user_review_id = user_reviews.id
  ));

-- Allow users to view review_comments if they are linked to a solution
create policy "Users can view review comments linked to solutions"
  on public.review_comments for select
  using (exists (
    select 1 from public.user_reviews
    join public.solutions on solutions.user_review_id = user_reviews.id
    where user_reviews.id = review_comments.review_id
  ));
