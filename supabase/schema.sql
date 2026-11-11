-- Execute in Supabase SQL editor. Service role only: no public policies.
create extension if not exists pgcrypto;
create table if not exists public.events(id uuid primary key default gen_random_uuid(),slug text unique not null,status text not null default 'registration' check(status in ('registration','drawn','closed')),created_at timestamptz not null default now());
create table if not exists public.participants(id uuid primary key default gen_random_uuid(),event_id uuid not null references public.events(id) on delete cascade,discord_id text not null,address_ciphertext text not null,wishes text not null default '',anonymous_code text not null default upper(substr(encode(gen_random_bytes(5),'hex'),1,8)),created_at timestamptz not null default now(),unique(event_id,discord_id),unique(event_id,anonymous_code));
create table if not exists public.assignments(event_id uuid not null references public.events(id),giver_id uuid not null references public.participants(id),recipient_id uuid not null references public.participants(id),primary key(event_id,giver_id),unique(event_id,recipient_id),check(giver_id<>recipient_id));
alter table public.events enable row level security;alter table public.participants enable row level security;alter table public.assignments enable row level security;
insert into public.events(slug) values('christmas-2026') on conflict(slug) do nothing;
-- SECURITY DEFINER runs transactionally. The API alone may invoke this RPC using service role.
create or replace function public.draw_christmas_2026() returns integer language plpgsql security definer set search_path=public as $$
declare eid uuid; n integer; ids uuid[]; shuffled uuid[]; i integer; j integer; tmp uuid;
begin
 select id into eid from events where slug='christmas-2026' and status='registration' for update;
 if eid is null then raise exception 'Event already drawn or unavailable';end if;
 select array_agg(id order by id) into ids from participants where event_id=eid;
 n:=coalesce(array_length(ids,1),0);
 if n<5 then raise exception 'At least five participants required';end if;
 shuffled:=ids;
 -- Fisher-Yates with cryptographic randomness from pgcrypto, unbiased via rejection sampling.
 for i in reverse n..2 loop
   loop
     declare r bigint; lim bigint;
     begin
       lim:=4294967296 - (4294967296 % i);
       r:=('x'||encode(gen_random_bytes(4),'hex'))::bit(32)::bigint;
       if r<lim then j:=(r % i)+1;exit;end if;
     end;
   end loop;
   tmp:=shuffled[i];shuffled[i]:=shuffled[j];shuffled[j]:=tmp;
 end loop;
 -- Repair fixed points by a cyclic rotation of the fixed-point recipients.
 -- If exactly one fixed point, swap its recipient with another position.
 declare fixed integer[]:=array[]::integer[]; k integer; begin
   for i in 1..n loop if shuffled[i]=ids[i] then fixed:=array_append(fixed,i);end if;end loop;
   k:=coalesce(array_length(fixed,1),0);
   if k=1 then i:=fixed[1];j:=case when i=1 then 2 else 1 end;tmp:=shuffled[i];shuffled[i]:=shuffled[j];shuffled[j]:=tmp;
   elsif k>1 then tmp:=shuffled[fixed[1]];for i in 1..k-1 loop shuffled[fixed[i]]:=shuffled[fixed[i+1]];end loop;shuffled[fixed[k]]:=tmp;end if;
 end;
 for i in 1..n loop insert into assignments(event_id,giver_id,recipient_id) values(eid,ids[i],shuffled[i]);end loop;
 update events set status='drawn' where id=eid;
 return n;
end $$;
revoke all on function public.draw_christmas_2026() from public,anon,authenticated;
