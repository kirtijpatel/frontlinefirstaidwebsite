create table public.contact_submissions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  form_type text not null check (form_type in ('contact', 'training')),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254),
  organization text not null default '' check (char_length(organization) <= 160),
  subject text not null default '' check (char_length(subject) <= 100),
  message text not null default '' check (char_length(message) <= 5000),
  group_size text not null default '' check (char_length(group_size) <= 80),
  preferred_timeframe text not null default '' check (char_length(preferred_timeframe) <= 120),
  topics text[] not null default '{}'::text[] check (cardinality(topics) <= 10),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  source text not null default 'website' check (source = 'website')
);

alter table public.contact_submissions enable row level security;

revoke all on public.contact_submissions from anon, authenticated;
revoke all on sequence public.contact_submissions_id_seq from anon, authenticated;
grant usage on schema public to anon;
grant insert on public.contact_submissions to anon;
grant usage on sequence public.contact_submissions_id_seq to anon;

create policy "website visitors can submit forms"
on public.contact_submissions
for insert
to anon
with check (
  status = 'new'
  and source = 'website'
  and form_type in ('contact', 'training')
  and char_length(trim(first_name)) between 1 and 80
  and char_length(trim(last_name)) between 1 and 80
  and char_length(trim(email)) between 3 and 254
  and position('@' in email) > 1
  and char_length(organization) <= 160
  and char_length(subject) <= 100
  and char_length(message) <= 5000
  and char_length(group_size) <= 80
  and char_length(preferred_timeframe) <= 120
  and cardinality(topics) <= 10
  and (form_type <> 'training' or char_length(trim(organization)) between 1 and 160)
  and (form_type <> 'contact' or (
    char_length(trim(subject)) between 1 and 100
    and char_length(trim(message)) between 1 and 5000
  ))
);

create index contact_submissions_new_created_at_idx
on public.contact_submissions (created_at desc)
where status = 'new';

comment on table public.contact_submissions is
  'Website contact and training requests. Public visitors may insert but cannot read or modify submissions.';
