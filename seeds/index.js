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
      // YOUR USER ID
      author: "60c65c9596667a9a311736d4",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic dicta ipsa et consequuntur iste at repellat officiis ex eum fugiat ducimus tempora modi impedit, animi consectetur voluptatum consequatur cumque repellendus!",
      price,
      geometry: { coordinates: [84.03, 24.95], type: "Point" },
      images: [
        {
          url: "https://res.cloudinary.com/viper/image/upload/v1625223271/Campsites/ecmcvvata2oebhupwvyv.jpg",
          filename: "Campsites/ecmcvvata2oebhupwvyv",
        },
        {
          url: "https://res.cloudinary.com/viper/image/upload/v1624649809/Campsites/jnr7nz5uyb6acuojxsks.jpg",
          filename: "Campsites/jnr7nz5uyb6acuojxsks",
        },
        {
          url: "https://res.cloudinary.com/viper/image/upload/v1624649815/Campsites/c277mcgsc59qjqxdwmm2.jpg",
          filename: "Campsites/c277mcgsc59qjqxdwmm2",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
