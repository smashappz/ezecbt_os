import { Database, Q } from "@nozbe/watermelondb";
import safeStringify from "fast-safe-stringify";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { Distortion, LastPost, Post, Trend } from "./models";
import schema from "./schema";
import { APP_NAME, getDayFirstTs, getMonthFirstTs, getMonths } from "../utils";

export const database = new Database({
  actionsEnabled: true,
  adapter: new SQLiteAdapter({
    dbName: APP_NAME,
    schema
  }),
  modelClasses: [Distortion, LastPost, Post, Trend]
});

export const distortionsCollection = database.collections.get("distortions");
export const lastPostsCollection = database.collections.get("lastposts");
export const postsCollection = database.collections.get("posts");
export const trendsCollection = database.collections.get("trends");

export const createPost = async (
  alternative,
  automatic,
  challenge,
  distortions,
  distList,
  lastPosts,
  callback
) => {
  const lastPost = lastPosts[0];
  const last = lastPost.last;
  let newEntry;

  const chartTrends = await trendsCollection
    .query(Q.where("key", "6 MONTHS"))
    .fetch();

  const heatTrends = await trendsCollection
    .query(Q.where("key", "3 MONTHS"))
    .fetch();

  database.action(async action => {
    newEntry = await postsCollection.create(p => {
      p.alternative = alternative;
      p.automatic = automatic;
      p.challenge = challenge;
      p.distortions = distortions;
      p.key = last;
    });

    lastPost.update(p => {
      p.last = last + 1;
    });

    distortions.split("+").map(async d => {
      if (!d) {
        return;
      }

      for (const e of distList) {
        if (e.key === d) {
          e.update(f => {
            f.count += 1;
          });
          break;
        }
      }
    });

    const chart = chartTrends[0];
    const heat = heatTrends[0];

    const chartData = JSON.parse(chart.data);
    const heatData = JSON.parse(heat.data);

    chartData.push(getMonthFirstTs());
    heatData.push(getDayFirstTs());

    await chart.update(c => {
      c.data = safeStringify(chartData);
    });

    await heat.update(h => {
      h.data = safeStringify(heatData);
    });

    updateTrends();
    callback && callback();
  });

  return newEntry;
};

export const deletePost = async (post, callback) => {
  const chartTrends = await trendsCollection
    .query(Q.where("key", "6 MONTHS"))
    .fetch();

  const heatTrends = await trendsCollection
    .query(Q.where("key", "3 MONTHS"))
    .fetch();

  const distList = await distortionsCollection.query().fetch();

  await database.action(async () => {
    post.distortions.split("+").map(async d => {
      if (!d) {
        return;
      }

      for (const e of distList) {
        if (e.key === d) {
          e.update(f => {
            f.count -= 1;
          });
          break;
        }
      }
    });

    const chart = chartTrends[0];
    const heat = heatTrends[0];

    let chartData = JSON.parse(chart.data);
    let heatData = JSON.parse(heat.data);

    if (chartData === "[]" || !Array.isArray(chartData)) {
      chartData = [];
    }

    if (heatData === "[]" || !Array.isArray(heatData)) {
      heatData = [];
    }

    const created = post.createdAt;
    let date = new Date(
      Date.UTC(created.getFullYear(), created.getMonth(), 1)
    ).getTime();
    let index = chartData.indexOf(date);

    if (index > -1) {
      chartData.splice(index, 1);
    }

    date = new Date(
      Date.UTC(created.getFullYear(), created.getMonth(), created.getDate())
    ).getTime();

    index = heatData.indexOf(date);

    if (index > -1) {
      heatData.splice(index, 1);
    }

    await chart.update(c => {
      c.data = safeStringify(chartData);
    });

    await heat.update(h => {
      h.data = safeStringify(heatData);
    });

    await post.destroyPermanently();
    callback && callback();
  });
};

export async function generateData() {
  const data = await distortionsCollection.query().fetch();

  if (data.length > 0) {
    return;
  }

  const distortions = [];

  distortions.push({
    key: "allOrNothing",
    name: "All or nothing thinking",
    description:
      "Things are seen regarding two mutually exclusive categories with no shades of gray in " +
      'between+Example: "I lost my job, so my life is over"'
  });

  distortions.push({
    key: "alwaysRight",
    name: "Always being right",
    description:
      "Being wrong is unthinkable. Actively trying to prove one's actions or thoughts to be correct, " +
      "and sometimes prioritizing self-interest over the feelings of another person.+" +
      'Example: "I always judge each and every situation correctly'
  });

  distortions.push({
    key: "catastrophizing",
    name: "Catastrophizing",
    description:
      "Focusing on the worst possible outcome, however unlikely, or thinking that a situation is " +
      "unbearable or impossible when it is really just uncomfortable+" +
      'Example: "If I fail this test, I will never pass school, and I will be a total failure in life'
  });

  distortions.push({
    key: "disqualifying",
    name: "Disqualifying the positive",
    description:
      "Positive experiences that conflict with the individual’s negative views are discounted+" +
      'Example: "I got lucky in that class and that’s why I got a good grade"'
  });

  distortions.push({
    key: "emotional",
    name: "Emotional reasoning",
    description:
      " Making decisions and arguments based on how you feel rather than objective reality+" +
      'Example: "I know my spouse is being unfaithful because I feel jealous"'
  });

  distortions.push({
    key: "change",
    name: "Fallacy of change",
    description:
      "Relying on social control to obtain cooperative actions from another person+" +
      "Example: \"If I improve my partner's appearance and behavior, our lives will be better"
  });

  distortions.push({
    key: "fairness",
    name: "Fallacy of fairness",
    description:
      "The belief that life should be fair. When life is perceived to be unfair, an angry emotional " +
      "state is produced which may lead to attempts to correct the situation+" +
      "Example: \"It's not fair that my coworker has gotten a promotion when I've been with the company longer"
  });

  distortions.push({
    key: "fortune",
    name: "Fortune telling",
    description:
      "Predicting how things will turn out before they happen+" +
      'Example: "I will never find love or have a committed and happy relationship"'
  });

  distortions.push({
    key: "labeling",
    name: "Labeling and mislabeling",
    description:
      "A form of overgeneralization; attributing a person's actions to his or her character instead of " +
      "to an attribute. Rather than assuming the behavior to be accidental or otherwise extrinsic, " +
      "one assigns a label to someone or something that is based on the inferred character of that " +
      "person or thing.+" +
      'Example: "I\'m an utter fool for failing my assignment"'
  });

  distortions.push({
    key: "mindReading",
    name: "Mind reading",
    description:
      "Assuming the thoughts and intentions of others+" +
      'Example: "She hasn\'t returned my call so she must hate me"'
  });

  distortions.push({
    key: "minimization",
    name: "Minimization",
    description:
      "Positive characteristics or experiences are treated as real but insignificant+" +
      'Example: "I was lucky to pass the test"'
  });

  distortions.push({
    key: "overgeneralization",
    name: "Overgeneralization",
    description:
      "Taking isolated cases and using them to make wide generalizations+" +
      'Example: "Nobody talked to me at last night\'s party, so I must be boring"'
  });

  distortions.push({
    key: "personalization",
    name: "Personalization, blame, or attribution",
    description:
      "Assuming you are completely or directly responsible for a negative outcome. When applied " +
      "to others consistently, blame is the distortion.+" +
      'Example: "My parents are to blame for my hangups around the opposite sex"'
  });

  distortions.push({
    key: "selective",
    name: "Selective abstraction",
    description:
      "Focusing exclusively on certain, usually negative or upsetting, aspects of something " +
      "while ignoring the rest+" +
      'Example: "I thought my presentation was well received until one person made a few criticisms"'
  });

  distortions.push({
    key: "should",
    name: "“Should” statements",
    description:
      'Concentrating on what you think "should" or “ought to be” rather than the actual situation ' +
      "you are faced with or having rigid rules which you always apply no matter the circumstances+" +
      'Example: "I\'m an adult and should be able to fly on a planewithout any fear"'
  });

  await database.action(async action => {
    distortionsCollection.create(d => {
      d.key = distortions[0].key;
      d.name = distortions[0].name;
      d.description = distortions[0].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[1].key;
      d.name = distortions[1].name;
      d.description = distortions[1].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[2].key;
      d.name = distortions[2].name;
      d.description = distortions[2].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[3].key;
      d.name = distortions[3].name;
      d.description = distortions[3].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[4].key;
      d.name = distortions[4].name;
      d.description = distortions[4].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[5].key;
      d.name = distortions[5].name;
      d.description = distortions[5].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[6].key;
      d.name = distortions[6].name;
      d.description = distortions[6].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[7].key;
      d.name = distortions[7].name;
      d.description = distortions[7].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[8].key;
      d.name = distortions[8].name;
      d.description = distortions[8].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[9].key;
      d.name = distortions[9].name;
      d.description = distortions[9].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[10].key;
      d.name = distortions[10].name;
      d.description = distortions[10].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[11].key;
      d.name = distortions[11].name;
      d.description = distortions[11].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[12].key;
      d.name = distortions[12].name;
      d.description = distortions[12].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[13].key;
      d.name = distortions[13].name;
      d.description = distortions[13].description;
      d.count = 0;
    });
    distortionsCollection.create(d => {
      d.key = distortions[14].key;
      d.name = distortions[14].name;
      d.description = distortions[14].description;
      d.count = 0;
    });

    lastPostsCollection.create(p => {
      p.last = 0;
    });

    trendsCollection.create(t => {
      t.data = "[]";
      t.key = "3 MONTHS";
      t.labels = "";
      t.min = getMonthFirstTs(-2);
    });

    trendsCollection.create(t => {
      t.data = "[]";
      t.key = "6 MONTHS";
      t.labels = safeStringify(getMonths(-5));
      t.min = getMonthFirstTs(-5);
    });
  });
}

export const updatePost = (
  post,
  alternative,
  automatic,
  challenge,
  distortions,
  distList,
  callback
) => {
  const newDistortions = distortions.split("+");
  const oldDistortions = post.distortions.split("+");

  database.action(async () => {
    newDistortions.map(async d => {
      if (!d) {
        return;
      }

      const exists = oldDistortions.filter(o => o === d).length > 0;

      if (exists) {
        return;
      }

      for (const e of distList) {
        if (e.key === d) {
          e.update(f => {
            f.count += 1;
          });
          break;
        }
      }
    });

    oldDistortions.map(async d => {
      if (!d) {
        return;
      }

      const exists = newDistortions.filter(n => n === d).length > 0;

      if (exists) {
        return;
      }

      for (const e of distList) {
        if (e.key === d) {
          e.update(f => {
            f.count -= 1;
          });
          break;
        }
      }
    });

    await post.update(p => {
      p.alternative = alternative;
      p.automatic = automatic;
      p.challenge = challenge;
      p.distortions = distortions;
    });

    updateTrends();
    callback && callback();
  });
};

export const updateTrends = async () => {
  try {
    const trends = await trendsCollection.query().fetch();

    if (trends.length === 0) {
      generateData();
      return;
    }

    const chartTrends = trends.filter(e => e.key === "6 MONTHS");
    const heatTrends = trends.filter(e => e.key === "3 MONTHS");

    const chart = chartTrends[0];
    const heat = heatTrends[0];

    let chartData = JSON.parse(chart.data);
    let heatData = JSON.parse(heat.data);

    if (chartData === "[]" || !Array.isArray(chartData)) {
      chartData = [];
    }

    if (heatData === "[]" || !Array.isArray(heatData)) {
      heatData = [];
    }

    let chartLabels = chart.labels;
    const chartMin = getMonthFirstTs(-5);

    let chartUpdate = () => {};
    let heatUpdate = () => {};
    let update = false;

    if (chartMin > chart.min) {
      chartData = chartData.filter(e => e >= chartMin);
      chartLabels = safeStringify(getMonths(-5));
      update = true;

      chartUpdate = async () =>
        await chart.update(c => {
          c.data = safeStringify(chartData);
          c.labels = chartLabels;
          c.min = chartMin;
        });
    }

    const heatMin = getMonthFirstTs(-2);

    if (heatMin > heat.min) {
      heatData = heatData.filter(e => e >= heatMin);
      update = true;

      heatUpdate = async () =>
        await heat.update(h => {
          h.data = safeStringify(heatData);
          h.min = heatMin;
        });
    }

    if (update) {
      database.action(() => {
        chartUpdate();
        heatUpdate();
      });
    }
  } catch (e) {}
};
