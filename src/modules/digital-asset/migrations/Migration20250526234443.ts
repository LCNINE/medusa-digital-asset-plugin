import { Migration } from "@mikro-orm/migrations";

export class Migration20250526234443 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "digital_asset_license" cascade;`);
    this.addSql(`drop table if exists "digital_asset" cascade;`);

    this.addSql(
      `create table if not exists "digital_asset" ("id" text not null, "name" text not null, "mime_type" text not null, "file_id" text not null, "file_url" text not null, "thumbnail_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_asset_pkey" primary key ("id"));`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_digital_asset_deleted_at" ON "digital_asset" (deleted_at) WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `create table if not exists "digital_asset_license" ("id" text not null, "digital_asset_id" text not null, "customer_id" text not null, "order_item_id" text null, "is_exercised" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_asset_license_pkey" primary key ("id"));`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_digital_asset_license_digital_asset_id" ON "digital_asset_license" (digital_asset_id) WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_digital_asset_license_deleted_at" ON "digital_asset_license" (deleted_at) WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `alter table if exists "digital_asset_license" add constraint "digital_asset_license_digital_asset_id_foreign" foreign key ("digital_asset_id") references "digital_asset" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "digital_asset_license" drop constraint if exists "digital_asset_license_digital_asset_id_foreign";`,
    );

    this.addSql(`drop table if exists "digital_asset" cascade;`);

    this.addSql(`drop table if exists "digital_asset_license" cascade;`);
  }
}
