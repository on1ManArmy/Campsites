const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "60c65c9596667a9a311736d4",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic dicta ipsa et consequuntur iste at repellat officiis ex eum fugiat ducimus tempora modi impedit, animi consectetur voluptatum consequatur cumque repellendus!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/viper/image/upload/v1624635977/Campsites/ymbeegoiflgyexqa2yfc.jpg",
          filename: "Campsites/ymbeegoiflgyexqa2yfc",
        },
        {
          url: "https://res.cloudinary.com/viper/image/upload/v1624635985/Campsites/mqwhfflud3yigtxrxwua.jpg",
          filename: "Campsites/mqwhfflud3yigtxrxwua",
        },
        {
          url: "https://res.cloudinary.com/viper/image/upload/v1624635992/Campsites/faltpmbrrkd4sfj6ya4w.jpg",
          filename: "Campsites/faltpmbrrkd4sfj6ya4w",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
