import mongoose from "mongoose";
import Category from "./src/models/categorymodel.js";

async function addSubCategoriesToEntertainment() {
  try {
    await mongoose.connect("mongodb://localhost:27017/NewsPortal");

    // 🔍 Step 1: Check if the category exists
    const found = await Category.findOne({ slug: "entertainment" });

    if (!found) {
      console.error("❌ Category with slug 'entertainment' not found.");
      const all = await Category.find({}, { name: 1, slug: 1 });
      console.table(all.map(({ name, slug }) => ({ name, slug })));
      await mongoose.connection.close();
      return;
    }

    console.log("✅ Found Category:", found.name);

    // 🛠 Step 2: Now perform the update
    const result = await Category.updateOne(
      { slug: "entertainment" },
      {
        $set: {
          subCategories: [
            "Filmy Entertainment",
            "Gossip",
            "Gallery",
            "Bollywood/Hollywood",
            "Singing",
          ],
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Subcategories added successfully!");
    } else {
      console.log("⚠️ No update made (maybe subcategories already set).");
    }

    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating categories:", error);
  }
}

addSubCategoriesToEntertainment();
// db.categories.updateOne(
//   { slug: "entertainment" },
//   {
//     $set: {
//       subCategories: [
//         "Filmy Entertainment",
//         "Gossip",
//         "Gallery",
//         "Bollywood/Hollywood",
//         "Singing"
//       ]
//     }
//   }
