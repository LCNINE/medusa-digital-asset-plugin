import { Migration } from '@mikro-orm/migrations';

export class Migration20250424014112 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "digital_asset_license" ("id" text not null, "digital_asset_id_id" text not null, "customer_id" text not null, "order_item_id" text not null, "is_exercised" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_asset_license_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_asset_license_digital_asset_id_id" ON "digital_asset_license" (digital_asset_id_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_asset_license_deleted_at" ON "digital_asset_license" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "digital_asset_license" add constraint "digital_asset_license_digital_asset_id_id_foreign" foreign key ("digital_asset_id_id") references "digital_asset" ("id") on update cascade;`);

    this.addSql(`alter table if exists "digital_asset" alter column "thumbnail_url" type text using ("thumbnail_url"::text);`);
    this.addSql(`alter table if exists "digital_asset" alter column "thumbnail_url" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "digital_asset_license" cascade;`);

    this.addSql(`alter table if exists "digital_asset" alter column "thumbnail_url" type text using ("thumbnail_url"::text);`);
    this.addSql(`alter table if exists "digital_asset" alter column "thumbnail_url" set not null;`);
  }

}
