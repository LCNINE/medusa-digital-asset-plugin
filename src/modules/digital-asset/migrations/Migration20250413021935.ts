import { Migration } from '@mikro-orm/migrations';

export class Migration20250413021935 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "digital_asset" ("id" text not null, "name" text not null, "mime_type" text not null, "file_url" text not null, "thumbnail_url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_asset_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_asset_deleted_at" ON "digital_asset" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "digital_asset" cascade;`);
  }

}
