import { Model } from "@nozbe/watermelondb";
import { date, field, readonly, text } from "@nozbe/watermelondb/decorators";

export class Distortion extends Model {
  static table = "distortions";

  @field("key") key;
  @text("name") name;
  @text("description") description;
  @field("count") count;
}

export class Post extends Model {
  static table = "posts";

  @field("key") key;
  @text("automatic") automatic;
  @text("distortions") distortions;
  @text("challenge") challenge;
  @text("alternative") alternative;

  @readonly @date("created_at") createdAt;
  @readonly @date("updated_at") updatedAt;
}

export class LastPost extends Model {
  static table = "lastposts";

  @field("last") last;
}

export class Trend extends Model {
  static table = "trends";

  @field("key") key;
  @text("data") data;
  @field("min") min;
  @text("labels") labels;
}
