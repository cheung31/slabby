create table "public"."api_keys" (
    "id" uuid not null default uuid_generate_v4(),
    "description" character varying,
    "redirect_url" character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone,
    "deleted_at" timestamp with time zone
);


alter table "public"."api_keys" enable row level security;

create table "public"."things" (
    "id" uuid not null default uuid_generate_v4(),
    "image_url" character varying,
    "external_url" character varying,
    "title" character varying,
    "description" text,
    "content_date" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "deleted_at" timestamp with time zone,
    "external_id" text,
    "type" text not null,
    "external_source" text not null
);


alter table "public"."things" enable row level security;

CREATE UNIQUE INDEX api_keys_pkey ON public.api_keys USING btree (id);

CREATE UNIQUE INDEX external_source_id ON public.things USING btree (external_source, external_id);

CREATE INDEX idx_external_source_id ON public.things USING btree (external_source, external_id);

CREATE INDEX idx_type ON public.things USING btree (type);

CREATE UNIQUE INDEX things_pkey ON public.things USING btree (id);

alter table "public"."api_keys" add constraint "api_keys_pkey" PRIMARY KEY using index "api_keys_pkey";

alter table "public"."things" add constraint "things_pkey" PRIMARY KEY using index "things_pkey";

alter table "public"."things" add constraint "external_source_id" UNIQUE using index "external_source_id";

create policy "Enable READ access to all users"
on "public"."api_keys"
as permissive
for select
to public
using (true);


create policy "Enable READ access to all users"
on "public"."things"
as permissive
for select
to public
using (true);


create policy "Enable UPDATE access to all users"
on "public"."things"
as permissive
for update
to public
using (true)
with check (true);


create policy "Enable WRITE access to all users"
on "public"."things"
as permissive
for insert
to public
with check (true);



