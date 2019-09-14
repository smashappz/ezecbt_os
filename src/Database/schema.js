import { appSchema, tableSchema } from "@nozbe/watermelondb";

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "distortions",
      columns: [
        { name: "key", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "count", type: "number" }
      ]
    }),
    tableSchema({
      name: "lastposts",
      columns: [{ name: "last", type: "number" }]
    }),
    tableSchema({
      name: "posts",
      columns: [
        { name: "key", type: "number", isIndexed: true },
        { name: "automatic", type: "string" },
        { name: "distortions", type: "string", isIndexed: true },
        { name: "challenge", type: "string", isOptional: true },
        { name: "alternative", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" }
      ]
    }),
    tableSchema({
      name: "trends",
      columns: [
        { name: "key", type: "string", isIndexed: true },
        { name: "data", type: "string" },
        { name: "min", type: "number" },
        { name: "labels", type: "string", isOptional: true }
      ]
    })
  ]
});

export default schema;
