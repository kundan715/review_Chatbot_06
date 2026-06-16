// backend/seed/seedData.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const Review = require("../models/Review");
const path = require("path");

// i load env manually here because this script runs standalone, not through server.js


dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// ── PRODUCTS DATA ───────────────────────────────────────────────────
const products = [
  {
    name: "iPhone 15",
    brand: "Apple",
    category: "Smartphone",
  },
  {
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Smartphone",
  },
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
  },
  {
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptop",
  },
  {
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "Smartphone",
  },
];

// ── REVIEWS DATA ────────────────────────────────────────────────────
// i removed productId from inside review objects
// productId gets attached during the map step below using real objectid
const fakeUserId = new mongoose.Types.ObjectId();

const getReviews = (key) => {
  const allReviews = {
    p1: [
      {
        userId: fakeUserId,
        username: "rahul_tech",
        review:
          "battery life is honestly very good, i get full day easily with moderate use. camera is outstanding especially portrait mode. build quality feels premium. only issue is it gets slightly warm during long gaming sessions.",
        rating: 5,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "priya_reviews",
        review:
          "camera is amazing for photos and videos. dynamic island is useful once you get used to it. battery drains faster when 5g is on. charging speed is slow compared to android phones at this price.",
        rating: 4,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "mohit_s",
        review:
          "overpriced for what it offers. android phones give better specs at lower price. but ios is smooth and app ecosystem is great. battery is decent not great. heats up during gaming no doubt.",
        rating: 3,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "sneha_k",
        review:
          "switched from android and loving it. face id is fast and reliable. camera colors are natural unlike samsung which oversaturates. battery easily lasts my full work day. no complaints.",
        rating: 5,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "arjun_gadgets",
        review:
          "gaming performance is top notch, pubg and cod run perfectly. yes it heats a bit during long sessions but thats normal for any phone. display is bright and smooth. worth buying.",
        rating: 4,
      },
    ],

    p2: [
      {
        userId: new mongoose.Types.ObjectId(),
        username: "vikram_tech",
        review:
          "display is absolutely stunning, best screen i have seen on any phone. camera zoom is insane for this price. battery life is average, barely makes it through full day with heavy use. gets warm while gaming.",
        rating: 4,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "ananya_m",
        review:
          "galaxy ai features are actually useful, circle to search saves lot of time. camera is great but sometimes oversaturates colors. battery could be better. build quality is solid.",
        rating: 4,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "rohit_gadget",
        review:
          "heating issue is real during gaming. played bgmi for 30 mins and phone was noticably hot. performance is great otherwise. display is best in class. camera is excellent in daylight.",
        rating: 3,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "deepika_r",
        review:
          "very satisfied with purchase. network connectivity is excellent, never drops signal. camera night mode is impressive. battery lasts my full day with normal use. no major complaints.",
        rating: 5,
      },
    ],

    p3: [
      {
        userId: new mongoose.Types.ObjectId(),
        username: "music_lover_raj",
        review:
          "noise cancellation is best i have ever experienced. flight from delhi to mumbai felt like sitting in silent room. battery lasts 30 hours easily. sound quality is rich and detailed. worth every rupee.",
        rating: 5,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "kartik_audio",
        review:
          "anc is outstanding no doubt. but after 2 hours of wearing my ears feel uncomfortable. sound is excellent. call quality is clear. connection is stable with no dropouts. bit expensive but quality justifies it.",
        rating: 4,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "neha_works",
        review:
          "perfect for work from home. blocks out all background noise during calls. battery life is incredible, charges once in two days with my usage. build feels premium. touch controls take time to learn.",
        rating: 5,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "sameer_m",
        review:
          "sound quality is good but bass is slightly less for my taste. anc works great. battery is excellent. a bit heavy for long use. overall good product but there are cheaper alternatives with similar quality.",
        rating: 3,
      },
    ],

    p4: [
      {
        userId: new mongoose.Types.ObjectId(),
        username: "dev_kundan",
        review:
          "battery life is unreal, i get 14 to 16 hours on single charge with coding and browsing. no fan means completely silent. performance is smooth for development work. best laptop i have ever used.",
        rating: 5,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "designer_preet",
        review:
          "figma and photoshop run perfectly with no lag. display is gorgeous for design work. battery easily lasts full work day. gets slightly warm during heavy rendering but no thermal throttling noticed.",
        rating: 5,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "college_student_v",
        review:
          "expensive but worth it for college. battery life means i never carry charger to campus. lightweight and easy to carry. macos takes adjustment if coming from windows. overall excellent machine.",
        rating: 4,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "rahul_codes",
        review:
          "runs docker and multiple apps without slowing down. fan less design is genius, stays cool even under load. keyboard is comfortable for long coding sessions. only wish it had more ports.",
        rating: 4,
      },
    ],

    p5: [
      {
        userId: new mongoose.Types.ObjectId(),
        username: "speed_freak_a",
        review:
          "fastest charging i have seen, 100w charger fills phone in 25 minutes. performance is flagship level. display is smooth at 120hz. battery easily lasts full day. excellent value for money.",
        rating: 5,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "techie_priya",
        review:
          "camera is good but not at iphone or samsung level. charging speed is the best feature. gaming performance is excellent with no major heating. software is clean and smooth. good flagship killer.",
        rating: 4,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        username: "normal_user_s",
        review:
          "battery life is great, network connectivity is solid. camera is decent for everyday use. heats a little during gaming but nothing alarming. build quality feels premium. happy with purchase.",
        rating: 4,
      },
    ],
  };

  return allReviews[key] || [];
};
// ── SEED FUNCTION ───────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected for seeding...");

    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log("cleared old products and reviews");

    // i insert products one by one so i get back real _id for each
    const p1 = await Product.create({ name: "iPhone 15", brand: "Apple", category: "Smartphone" });
    const p2 = await Product.create({ name: "Samsung Galaxy S24", brand: "Samsung", category: "Smartphone" });
    const p3 = await Product.create({ name: "Sony WH-1000XM5", brand: "Sony", category: "Headphones" });
    const p4 = await Product.create({ name: "MacBook Air M2", brand: "Apple", category: "Laptop" });
    const p5 = await Product.create({ name: "OnePlus 12", brand: "OnePlus", category: "Smartphone" });

    console.log("inserted 5 products");

    // now i have real objectids directly - no mapping needed
    console.log("p1 id:", p1._id);

    const allReviews = [
      // iphone 15
      { productId: p1._id, userId: new mongoose.Types.ObjectId(), username: "rahul_tech", review: "battery life is honestly very good, i get full day easily with moderate use. camera is outstanding especially portrait mode. build quality feels premium. only issue is it gets slightly warm during long gaming sessions.", rating: 5 },
      { productId: p1._id, userId: new mongoose.Types.ObjectId(), username: "priya_reviews", review: "camera is amazing for photos and videos. dynamic island is useful once you get used to it. battery drains faster when 5g is on. charging speed is slow compared to android phones at this price.", rating: 4 },
      { productId: p1._id, userId: new mongoose.Types.ObjectId(), username: "mohit_s", review: "overpriced for what it offers. android phones give better specs at lower price. but ios is smooth and app ecosystem is great. battery is decent not great. heats up during gaming no doubt.", rating: 3 },
      { productId: p1._id, userId: new mongoose.Types.ObjectId(), username: "sneha_k", review: "switched from android and loving it. face id is fast and reliable. camera colors are natural unlike samsung which oversaturates. battery easily lasts my full work day. no complaints.", rating: 5 },
      { productId: p1._id, userId: new mongoose.Types.ObjectId(), username: "arjun_gadgets", review: "gaming performance is top notch, pubg and cod run perfectly. yes it heats a bit during long sessions but thats normal for any phone. display is bright and smooth. worth buying.", rating: 4 },

      // samsung galaxy s24
      { productId: p2._id, userId: new mongoose.Types.ObjectId(), username: "vikram_tech", review: "display is absolutely stunning, best screen i have seen on any phone. camera zoom is insane for this price. battery life is average, barely makes it through full day with heavy use. gets warm while gaming.", rating: 4 },
      { productId: p2._id, userId: new mongoose.Types.ObjectId(), username: "ananya_m", review: "galaxy ai features are actually useful, circle to search saves lot of time. camera is great but sometimes oversaturates colors. battery could be better. build quality is solid.", rating: 4 },
      { productId: p2._id, userId: new mongoose.Types.ObjectId(), username: "rohit_gadget", review: "heating issue is real during gaming. played bgmi for 30 mins and phone was noticably hot. performance is great otherwise. display is best in class. camera is excellent in daylight.", rating: 3 },
      { productId: p2._id, userId: new mongoose.Types.ObjectId(), username: "deepika_r", review: "very satisfied with purchase. network connectivity is excellent, never drops signal. camera night mode is impressive. battery lasts my full day with normal use. no major complaints.", rating: 5 },

      // sony headphones
      { productId: p3._id, userId: new mongoose.Types.ObjectId(), username: "music_lover_raj", review: "noise cancellation is best i have ever experienced. flight from delhi to mumbai felt like sitting in silent room. battery lasts 30 hours easily. sound quality is rich and detailed. worth every rupee.", rating: 5 },
      { productId: p3._id, userId: new mongoose.Types.ObjectId(), username: "kartik_audio", review: "anc is outstanding no doubt. but after 2 hours of wearing my ears feel uncomfortable. sound is excellent. call quality is clear. connection is stable with no dropouts. bit expensive but quality justifies it.", rating: 4 },
      { productId: p3._id, userId: new mongoose.Types.ObjectId(), username: "neha_works", review: "perfect for work from home. blocks out all background noise during calls. battery life is incredible, charges once in two days with my usage. build feels premium. touch controls take time to learn.", rating: 5 },
      { productId: p3._id, userId: new mongoose.Types.ObjectId(), username: "sameer_m", review: "sound quality is good but bass is slightly less for my taste. anc works great. battery is excellent. a bit heavy for long use. overall good product but there are cheaper alternatives with similar quality.", rating: 3 },

      // macbook air m2
      { productId: p4._id, userId: new mongoose.Types.ObjectId(), username: "dev_kundan", review: "battery life is unreal, i get 14 to 16 hours on single charge with coding and browsing. no fan means completely silent. performance is smooth for development work. best laptop i have ever used.", rating: 5 },
      { productId: p4._id, userId: new mongoose.Types.ObjectId(), username: "designer_preet", review: "figma and photoshop run perfectly with no lag. display is gorgeous for design work. battery easily lasts full work day. gets slightly warm during heavy rendering but no thermal throttling noticed.", rating: 5 },
      { productId: p4._id, userId: new mongoose.Types.ObjectId(), username: "college_student_v", review: "expensive but worth it for college. battery life means i never carry charger to campus. lightweight and easy to carry. macos takes adjustment if coming from windows. overall excellent machine.", rating: 4 },
      { productId: p4._id, userId: new mongoose.Types.ObjectId(), username: "rahul_codes", review: "runs docker and multiple apps without slowing down. fan less design is genius, stays cool even under load. keyboard is comfortable for long coding sessions. only wish it had more ports.", rating: 4 },

      // oneplus 12
      { productId: p5._id, userId: new mongoose.Types.ObjectId(), username: "speed_freak_a", review: "fastest charging i have seen, 100w charger fills phone in 25 minutes. performance is flagship level. display is smooth at 120hz. battery easily lasts full day. excellent value for money.", rating: 5 },
      { productId: p5._id, userId: new mongoose.Types.ObjectId(), username: "techie_priya", review: "camera is good but not at iphone or samsung level. charging speed is the best feature. gaming performance is excellent with no major heating. software is clean and smooth. good flagship killer.", rating: 4 },
      { productId: p5._id, userId: new mongoose.Types.ObjectId(), username: "normal_user_s", review: "battery life is great, network connectivity is solid. camera is decent for everyday use. heats a little during gaming but nothing alarming. build quality feels premium. happy with purchase.", rating: 4 },
    ];

    console.log("sample review productId:", allReviews[0].productId);

    await Review.insertMany(allReviews);
    console.log(`inserted ${allReviews.length} reviews`);

    console.log("seeding completed succesfuly");
    console.log("product ids for reference:");
    console.log(`  iPhone 15 -> ${p1._id}`);
    console.log(`  Samsung Galaxy S24 -> ${p2._id}`);
    console.log(`  Sony WH-1000XM5 -> ${p3._id}`);
    console.log(`  MacBook Air M2 -> ${p4._id}`);
    console.log(`  OnePlus 12 -> ${p5._id}`);

    process.exit(0);
  } catch (error) {
    console.error("seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();