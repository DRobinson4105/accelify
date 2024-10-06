const bcrypt = require('bcrypt');

const companies = [
    { name: "Ace Athletics", industry: "Sports Equipment", programStart: "2022-05-15" },
    { name: "AlphaAccessories", industry: "Accessory Subscription", programStart: "2022-09-06" },
    { name: "AlphaApparel", industry: "Clothing Retailer", programStart: "2022-05-03" },
    { name: "AlphaArt", industry: "Art Subscription Box", programStart: "2022-05-09" },
    { name: "Artisan Oven", industry: "Artisanal Bakery", programStart: "2022-03-18" },
    { name: "ArtisanArmor", industry: "Custom Jewelry", programStart: "2022-03-24" },
    { name: "Artistic Expressions", industry: "Art Supplies", programStart: "2022-03-19" },
    { name: "BetaBaking", industry: "Baking Subscription", programStart: "2022-09-11" },
    { name: "BetaBeauty", industry: "Beauty Product Subscription", programStart: "2022-05-14" },
    { name: "BitzBooks", industry: "Online Bookstore", programStart: "2022-03-01" },
    { name: "BloomBox Flowers", industry: "Flower Delivery", programStart: "2022-03-22" },
    { name: "Bountiful Books", industry: "Bookstore", programStart: "2022-05-17" },
    { name: "BravoBites", industry: "Meal Delivery Service", programStart: "2022-05-05" },
    { name: "Bright Beginnings", industry: "Child Care Services", programStart: "2022-03-28" },
    { name: "Brilliant Blooms", industry: "Floral Arrangements", programStart: "2022-03-01" },
    { name: "CharlieChargers", industry: "Phone Accessories", programStart: "2022-05-07" },
    { name: "Chic Chocolates", industry: "Chocolate Shop", programStart: "2022-05-19" },
    { name: "ChiCheese", industry: "Cheese Subscription", programStart: "2022-08-22" },
    { name: "ChiChocolates", industry: "Chocolate Subscription", programStart: "2022-04-24" },
    { name: "Creative Coding", industry: "Coding Education", programStart: "2022-03-30" },
    { name: "DeltaDecor", industry: "Home Decor Retailer", programStart: "2022-05-09" },
    { name: "DeltaDesigns", industry: "Home Decor Subscription", programStart: "2022-05-24" },
    { name: "DeltaDrinks", industry: "Drink Subscription", programStart: "2022-09-21" },
    { name: "Dynamic Drones", industry: "Drone Technology", programStart: "2022-05-21" },
    { name: "EchoEducation", industry: "Online Learning Platform", programStart: "2022-05-11" },
    { name: "Eco-Friendly Cleaning Solutions", industry: "Cleaning Services", programStart: "2022-03-05" },
    { name: "EcoEase Solutions", industry: "Eco-friendly Products", programStart: "2022-03-23" },
    { name: "Elegant Events", industry: "Event Planning", programStart: "2022-04-01" },
    { name: "EpsilonEco", industry: "Eco-Friendly Product Subscription", programStart: "2022-09-26" },
    { name: "EpsilonEducation", industry: "Online Learning Subscription", programStart: "2022-05-29" },
    { name: "Esteemed Education", industry: "Private School", programStart: "2022-05-23" },
    { name: "EtaEntertainment", industry: "Movie Ticket Subscription", programStart: "2022-06-08" },
    { name: "EtaEscapeRooms", industry: "Escape Room Subscription", programStart: "2022-10-06" },
    { name: "Fantastic Furnishings", industry: "Furniture Store", programStart: "2022-05-25" },
    { name: "FarmFresh", industry: "Organic Food Delivery", programStart: "2022-03-07" },
    { name: "Fashion Forward", industry: "Clothing Retail", programStart: "2022-04-03" },
    { name: "Fit For Life", industry: "Health and Fitness", programStart: "2022-03-17" },
    { name: "FitFam Fitness", industry: "Health and Fitness", programStart: "2022-03-28" },
    { name: "FitFusion", industry: "Fitness App", programStart: "2022-03-26" },
    { name: "FoxtrotFitness", industry: "Gym Chain", programStart: "2022-05-13" },
    { name: "GammaGames", industry: "Board Game Subscription", programStart: "2022-05-19" },
    { name: "GammaGardening", industry: "Gardening Subscription", programStart: "2022-09-16" },
    { name: "GigaBytes Tech", industry: "IT Services", programStart: "2022-04-01" },
    { name: "GigaGadgets", industry: "Electronics Retailer", programStart: "2022-03-05" },
    { name: "Glamorous Gaming", industry: "Video Game Store", programStart: "2022-05-27" },
    { name: "Global Goods", industry: "Fair Trade Imports", programStart: "2022-04-05" },
    { name: "GlowGuru", industry: "Skincare Products", programStart: "2022-03-28" },
    { name: "GolfGenius", industry: "Golf Equipment", programStart: "2022-05-15" },
    { name: "Gourmet Grub", industry: "Meal Delivery Service", programStart: "2022-03-12" },
    { name: "Green Thumb Gardening", industry: "Landscaping Services", programStart: "2022-03-22" },
    { name: "GreenGlow", industry: "Eco-friendly Cleaning Products", programStart: "2022-03-14" },
    { name: "Harmonious Homes", industry: "Interior Design", programStart: "2022-05-29" },
    { name: "Healthy Habits", industry: "Health and Wellness", programStart: "2022-04-07" },
    { name: "HomeHaven", industry: "Home Decor Subscription Box", programStart: "2022-03-30" },
    { name: "HotelHaven", industry: "Hotel Booking Platform", programStart: "2022-05-17" },
    { name: "Innovative Ideas", industry: "Creative Consulting", programStart: "2022-04-09" },
    { name: "InspireInnovations", industry: "Technology Incubator", programStart: "2022-05-19" },
    { name: "Inspiring Instruments", industry: "Musical Instrument Store", programStart: "2022-05-31" },
    { name: "IotaIceCream", industry: "Ice Cream Subscription", programStart: "2022-06-18" },
    { name: "IotaImprov", industry: "Improv Class Subscription", programStart: "2022-10-16" },
    { name: "Joyful Jewels", industry: "Jewelry Store", programStart: "2022-06-02" },
    { name: "Joyful Journeys", industry: "Travel Agency", programStart: "2022-04-11" },
    { name: "JunoJewelry", industry: "Fine Jewelry Retailer", programStart: "2022-05-21" },
    { name: "KaleidoscopeKids", industry: "Children's Clothing Retailer", programStart: "2022-05-23" },
    { name: "KappaKids", industry: "Children's Book Subscription", programStart: "2022-06-23" },
    { name: "KappaKnitting", industry: "Knitting Subscription", programStart: "2022-10-21" },
    { name: "KidKonnect", industry: "Educational Toys", programStart: "2022-04-01" },
    { name: "Knowledge Navigators", industry: "Tutoring Services", programStart: "2022-04-13" },
    { name: "Knowledgeable Knits", industry: "Yarn Store", programStart: "2022-06-04" },
    { name: "LambdaLanguages", industry: "Language Learning Subscription", programStart: "2022-10-26" },
    { name: "LambdaLiterature", industry: "Literary Magazine Subscription", programStart: "2022-06-28" },
    { name: "LuxeLashes", industry: "False Eyelashes", programStart: "2022-04-03" },
    { name: "LuxeLuggage", industry: "Luggage Retailer", programStart: "2022-05-25" },
    { name: "Luxurious Luggage", industry: "Luggage Store", programStart: "2022-06-06" },
    { name: "Luxury Living", industry: "Real Estate", programStart: "2022-04-15" },
    { name: "Marvelous Maps", industry: "Map Store", programStart: "2022-06-08" },
    { name: "MegaMovies", industry: "Streaming Service", programStart: "2022-03-10" },
    { name: "Mindful Meditation", industry: "Mental Health Services", programStart: "2022-03-24" },
    { name: "MindMeld", industry: "Team Collaboration Software", programStart: "2022-03-18" },
    { name: "MindMeld Therapy", industry: "Mental Health Services", programStart: "2022-04-03" },
    { name: "Motivational Mentors", industry: "Life Coaching", programStart: "2022-04-17" },
    { name: "MuMusic", industry: "Music Streaming Subscription", programStart: "2022-07-03" },
    { name: "MuMystery", industry: "Mystery Box Subscription", programStart: "2022-11-01" },
    { name: "MuseMusic", industry: "Music Streaming Service", programStart: "2022-05-27" },
    { name: "MysticMoods", industry: "Candles and Aromatherapy", programStart: "2022-04-05" },
    { name: "NanoNails", industry: "Nail Polish Subscription", programStart: "2022-03-15" },
    { name: "Natural Necessities", industry: "Organic Groceries", programStart: "2022-04-19" },
    { name: "NatureNook", industry: "Plant Subscription Box", programStart: "2022-04-07" },
    { name: "Novel Notions", industry: "Idea Lab", programStart: "2022-06-10" },
    { name: "NovelNotions", industry: "Innovative Products Retailer", programStart: "2022-05-29" },
    { name: "NuNotebooks", industry: "Notebook Subscription", programStart: "2022-11-06" },
    { name: "NuNutrition", industry: "Health Supplement Subscription", programStart: "2022-07-08" },
    { name: "OmegaOutdoors", industry: "Outdoor Gear Subscription", programStart: "2022-05-04" },
    { name: "OmegaOuterwear", industry: "Outerwear Subscription", programStart: "2022-09-01" },
    { name: "OmicronOrganics", industry: "Organic Produce Subscription", programStart: "2022-07-18" },
    { name: "Optimal Organics", industry: "Organic Farming", programStart: "2022-06-12" },
    { name: "Optimal Outcomes", industry: "Management Consulting", programStart: "2022-04-21" },
    { name: "OptimisticOutdoors", industry: "Outdoor Gear Retailer", programStart: "2022-05-31" },
    { name: "OptimumOptics", industry: "Eyewear", programStart: "2022-04-09" },
    { name: "Pet Palace", industry: "Pet Supplies", programStart: "2022-03-07" },
    { name: "PetPalace", industry: "Pet Supplies", programStart: "2022-03-16" },
    { name: "PhiFitness", industry: "Fitness App", programStart: "2022-04-19" },
    { name: "PhiPhotography", industry: "Photography App Subscription", programStart: "2022-08-17" },
    { name: "PicoPets", industry: "Pet Toy Subscription", programStart: "2022-03-20" },
    { name: "PioneerPhones", industry: "Cell Phone Retailer", programStart: "2022-06-02" },
    { name: "PiPizza", industry: "Pizza Subscription", programStart: "2022-07-23" },
    { name: "Precise Prints", industry: "Art Printing", programStart: "2022-06-14" },
    { name: "Premier Printing", industry: "Printing Services", programStart: "2022-04-23" },
    { name: "PremiumPens", industry: "Writing Instruments", programStart: "2022-04-11" },
    { name: "PsiPlants", industry: "Plant Subscription", programStart: "2022-08-27" },
    { name: "PsiSocks", industry: "Sock Subscription", programStart: "2022-04-29" },
    { name: "Quality Quilting", industry: "Quilting Supplies", programStart: "2022-06-16" },
    { name: "Quality Quilts", industry: "Home Decor", programStart: "2022-04-25" },
    { name: "QuantaCoffee", industry: "Coffee Subscription", programStart: "2022-03-25" },
    { name: "QuillQuotes", industry: "Inspirational Quotes Retailer", programStart: "2022-06-04" },
    { name: "QuirkyQuills Writing", industry: "Content Writing", programStart: "2022-03-25" },
    { name: "QuirkyQuilts", industry: "Quilt Subscription Box", programStart: "2022-04-13" },
    { name: "Radiant Robotics", industry: "Robotics Education", programStart: "2022-06-18" },
    { name: "RadiantReads", industry: "Book Club Subscription", programStart: "2022-06-06" },
    { name: "RadiantReady", industry: "Emergency Preparedness Kits", programStart: "2022-04-15" },
    { name: "Restful Retreats", industry: "Bed and Breakfast", programStart: "2022-04-27" },
    { name: "RhoRamen", industry: "Instant Noodle Subscription", programStart: "2022-03-30" },
    { name: "RhoRings", industry: "Jewelry Subscription", programStart: "2022-07-28" },
    { name: "SapphireStationery", industry: "Stationery Retailer", programStart: "2022-06-08" },
    { name: "Savvy Savers", industry: "Financial Planning", programStart: "2022-03-26" },
    { name: "SavvySocks", industry: "Sock Subscription", programStart: "2022-04-17" },
    { name: "Sensational Spices", industry: "Spice Shop", programStart: "2022-06-20" },
    { name: "SigmaShoes", industry: "Shoe Subscription", programStart: "2022-04-04" },
    { name: "SigmaSweets", industry: "Dessert Subscription", programStart: "2022-08-02" },
    { name: "SkyHigh Adventures", industry: "Adventure Tourism", programStart: "2022-04-05" },
    { name: "Smart Homes", industry: "Home Automation", programStart: "2022-03-15" },
    { name: "SmartSips", industry: "Coffee Subscription", programStart: "2022-03-22" },
    { name: "StyleSavvy", industry: "Fashion Subscription Box", programStart: "2022-03-10" },
    { name: "Sustainable Solutions", industry: "Environmental Consulting", programStart: "2022-04-29" },
    { name: "Talented Tailors", industry: "Clothing Alterations", programStart: "2022-05-01" },
    { name: "TauTea", industry: "Tea Subscription", programStart: "2022-04-09" },
    { name: "TauTies", industry: "Tie Subscription", programStart: "2022-08-07" },
    { name: "Tech Titans", industry: "Technology Consulting", programStart: "2022-03-10" },
    { name: "TechTonic", industry: "IT Consulting", programStart: "2022-03-12" },
    { name: "ThetaTech", industry: "Tech Gadget Subscription", programStart: "2022-06-13" },
    { name: "ThetaTheater", industry: "Theater Ticket Subscription", programStart: "2022-10-11" },
    { name: "Trendy Totes", industry: "Tote Bag Store", programStart: "2022-06-22" },
    { name: "TrendyTech", industry: "Consumer Electronics Retailer", programStart: "2022-06-10" },
    { name: "TrendyTees", industry: "T-Shirt Subscription Box", programStart: "2022-04-19" },
    { name: "Ultimate Universes", industry: "Science Fiction Bookstore", programStart: "2022-06-24" },
    { name: "Ultimate University", industry: "Online Education", programStart: "2022-05-03" },
    { name: "UltimateUniversity", industry: "Online Education Platform", programStart: "2022-06-12" },
    { name: "UltimateUtensils", industry: "Kitchen Tools", programStart: "2022-04-21" },
    { name: "UpsilonUndergarments", industry: "Undergarment Subscription", programStart: "2022-08-12" },
    { name: "UpsilonUnderwear", industry: "Underwear Subscription", programStart: "2022-04-14" },
    { name: "Vibrant Vases", industry: "Vase Store", programStart: "2022-06-26" },
    { name: "Vibrant Visions", industry: "Graphic Design", programStart: "2022-05-05" },
    { name: "VibrantVinyls", industry: "Record Subscription", programStart: "2022-04-23" },
    { name: "Virtuoso Virtual Assistants", industry: "Virtual Assistance", programStart: "2022-03-27" },
    { name: "VirtuosoViolins", industry: "Musical Instruments Retailer", programStart: "2022-06-14" },
    { name: "VitalVibes", industry: "Health and Wellness Supplements", programStart: "2022-03-20" },
    { name: "WholesomeWatches", industry: "Watch Retailer", programStart: "2022-06-16" },
    { name: "WholesomeWhisk", industry: "Baking Supplies", programStart: "2022-04-25" },
    { name: "Wise Watches", industry: "Watch Store", programStart: "2022-06-28" },
    { name: "Wise Words", industry: "Writing Services", programStart: "2022-05-07" },
    { name: "Xcellent Xeriscaping", industry: "Landscape Design", programStart: "2022-05-09" },
    { name: "Xceptional Xeroxing", industry: "Copy Center", programStart: "2022-06-30" },
    { name: "XiXylophoneOrchestra", industry: "Xylophone Orchestra Subscription", programStart: "2022-11-11" },
    { name: "XiXylophones", industry: "Musical Instrument Subscription", programStart: "2022-07-13" },
    { name: "XpressoXpress", industry: "Coffee Shop Chain", programStart: "2022-06-18" },
    { name: "XtremeXercise", industry: "Fitness Equipment", programStart: "2022-04-27" },
    { name: "YogaYonder", industry: "Yoga Apparel", programStart: "2022-04-29" },
    { name: "YogaYurt", industry: "Yoga Studio", programStart: "2022-06-20" },
    { name: "Youthful Yarns", industry: "Children's Bookstore", programStart: "2022-07-02" },
    { name: "Youthful Yogis", industry: "Yoga Studio", programStart: "2022-05-11" },
    { name: "Zen Zoology", industry: "Pet Adoption Services", programStart: "2022-05-13" },
    { name: "Zen Zumba", industry: "Dance Studio", programStart: "2022-07-04" },
    { name: "ZenZenith", industry: "Executive Coaching", programStart: "2022-06-22" },
    { name: "ZenZone", industry: "Meditation App", programStart: "2022-05-01" },
    { name: "ZetaZen", industry: "Meditation App Subscription", programStart: "2022-06-03" },
    { name: "ZetaZumba", industry: "Fitness Class Subscription", programStart: "2022-10-01" },
    { name: "ZipZap Deliveries", industry: "Food Delivery", programStart: "2022-03-15" }
  ];
  

const industries = [
        {
          "id": "67020366cc7d72ce56e5ad9e",
          "name": "Sports Equipment"
        },
        {
          "id": "67020366cc7d72ce56e5ad9f",
          "name": "Accessory Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ada0",
          "name": "Clothing Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ada1",
          "name": "Art Subscription Box"
        },
        {
          "id": "67020366cc7d72ce56e5ada2",
          "name": "Artisanal Bakery"
        },
        {
          "id": "67020366cc7d72ce56e5ada3",
          "name": "Custom Jewelry"
        },
        {
          "id": "67020366cc7d72ce56e5ada4",
          "name": "Art Supplies"
        },
        {
          "id": "67020366cc7d72ce56e5ada5",
          "name": "Baking Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ada6",
          "name": "Beauty Product Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ada7",
          "name": "Online Bookstore"
        },
        {
          "id": "67020366cc7d72ce56e5ada8",
          "name": "Flower Delivery"
        },
        {
          "id": "67020366cc7d72ce56e5ada9",
          "name": "Bookstore"
        },
        {
          "id": "67020366cc7d72ce56e5adaa",
          "name": "Meal Delivery Service"
        },
        {
          "id": "67020366cc7d72ce56e5adab",
          "name": "Child Care Services"
        },
        {
          "id": "67020366cc7d72ce56e5adac",
          "name": "Floral Arrangements"
        },
        {
          "id": "67020366cc7d72ce56e5adad",
          "name": "Phone Accessories"
        },
        {
          "id": "67020366cc7d72ce56e5adae",
          "name": "Chocolate Shop"
        },
        {
          "id": "67020366cc7d72ce56e5adaf",
          "name": "Cheese Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adb0",
          "name": "Chocolate Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adb1",
          "name": "Coding Education"
        },
        {
          "id": "67020366cc7d72ce56e5adb2",
          "name": "Home Decor Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5adb3",
          "name": "Home Decor Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adb4",
          "name": "Drink Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adb5",
          "name": "Drone Technology"
        },
        {
          "id": "67020366cc7d72ce56e5adb6",
          "name": "Online Learning Platform"
        },
        {
          "id": "67020366cc7d72ce56e5adb7",
          "name": "Cleaning Services"
        },
        {
          "id": "67020366cc7d72ce56e5adb8",
          "name": "Eco-friendly Products"
        },
        {
          "id": "67020366cc7d72ce56e5adb9",
          "name": "Event Planning"
        },
        {
          "id": "67020366cc7d72ce56e5adba",
          "name": "Eco-Friendly Product Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adbb",
          "name": "Online Learning Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adbc",
          "name": "Private School"
        },
        {
          "id": "67020366cc7d72ce56e5adbd",
          "name": "Movie Ticket Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adbe",
          "name": "Escape Room Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adbf",
          "name": "Furniture Store"
        },
        {
          "id": "67020366cc7d72ce56e5adc0",
          "name": "Organic Food Delivery"
        },
        {
          "id": "67020366cc7d72ce56e5adc1",
          "name": "Clothing Retail"
        },
        {
          "id": "67020366cc7d72ce56e5adc2",
          "name": "Health and Fitness"
        },
        {
          "id": "67020366cc7d72ce56e5adc3",
          "name": "Fitness App"
        },
        {
          "id": "67020366cc7d72ce56e5adc4",
          "name": "Gym Chain"
        },
        {
          "id": "67020366cc7d72ce56e5adc5",
          "name": "Board Game Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adc6",
          "name": "Gardening Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adc7",
          "name": "IT Services"
        },
        {
          "id": "67020366cc7d72ce56e5adc8",
          "name": "Electronics Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5adc9",
          "name": "Video Game Store"
        },
        {
          "id": "67020366cc7d72ce56e5adca",
          "name": "Fair Trade Imports"
        },
        {
          "id": "67020366cc7d72ce56e5adcb",
          "name": "Skincare Products"
        },
        {
          "id": "67020366cc7d72ce56e5adcc",
          "name": "Golf Equipment"
        },
        {
          "id": "67020366cc7d72ce56e5adcd",
          "name": "Landscaping Services"
        },
        {
          "id": "67020366cc7d72ce56e5adce",
          "name": "Eco-friendly Cleaning Products"
        },
        {
          "id": "67020366cc7d72ce56e5adcf",
          "name": "Interior Design"
        },
        {
          "id": "67020366cc7d72ce56e5add0",
          "name": "Health and Wellness"
        },
        {
          "id": "67020366cc7d72ce56e5add1",
          "name": "Home Decor Subscription Box"
        },
        {
          "id": "67020366cc7d72ce56e5add2",
          "name": "Hotel Booking Platform"
        },
        {
          "id": "67020366cc7d72ce56e5add3",
          "name": "Creative Consulting"
        },
        {
          "id": "67020366cc7d72ce56e5add4",
          "name": "Technology Incubator"
        },
        {
          "id": "67020366cc7d72ce56e5add5",
          "name": "Musical Instrument Store"
        },
        {
          "id": "67020366cc7d72ce56e5add6",
          "name": "Ice Cream Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5add7",
          "name": "Improv Class Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5add8",
          "name": "Jewelry Store"
        },
        {
          "id": "67020366cc7d72ce56e5add9",
          "name": "Travel Agency"
        },
        {
          "id": "67020366cc7d72ce56e5adda",
          "name": "Fine Jewelry Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5addb",
          "name": "Children's Clothing Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5addc",
          "name": "Children's Book Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5addd",
          "name": "Knitting Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adde",
          "name": "Educational Toys"
        },
        {
          "id": "67020366cc7d72ce56e5addf",
          "name": "Tutoring Services"
        },
        {
          "id": "67020366cc7d72ce56e5ade0",
          "name": "Yarn Store"
        },
        {
          "id": "67020366cc7d72ce56e5ade1",
          "name": "Language Learning Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ade2",
          "name": "Literary Magazine Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ade3",
          "name": "False Eyelashes"
        },
        {
          "id": "67020366cc7d72ce56e5ade4",
          "name": "Luggage Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ade5",
          "name": "Luggage Store"
        },
        {
          "id": "67020366cc7d72ce56e5ade6",
          "name": "Real Estate"
        },
        {
          "id": "67020366cc7d72ce56e5ade7",
          "name": "Map Store"
        },
        {
          "id": "67020366cc7d72ce56e5ade8",
          "name": "Streaming Service"
        },
        {
          "id": "67020366cc7d72ce56e5ade9",
          "name": "Mental Health Services"
        },
        {
          "id": "67020366cc7d72ce56e5adea",
          "name": "Team Collaboration Software"
        },
        {
          "id": "67020366cc7d72ce56e5adeb",
          "name": "Life Coaching"
        },
        {
          "id": "67020366cc7d72ce56e5adec",
          "name": "Music Streaming Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5aded",
          "name": "Mystery Box Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adee",
          "name": "Music Streaming Service"
        },
        {
          "id": "67020366cc7d72ce56e5adef",
          "name": "Candles and Aromatherapy"
        },
        {
          "id": "67020366cc7d72ce56e5adf0",
          "name": "Nail Polish Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adf1",
          "name": "Organic Groceries"
        },
        {
          "id": "67020366cc7d72ce56e5adf2",
          "name": "Plant Subscription Box"
        },
        {
          "id": "67020366cc7d72ce56e5adf3",
          "name": "Idea Lab"
        },
        {
          "id": "67020366cc7d72ce56e5adf4",
          "name": "Innovative Products Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5adf5",
          "name": "Notebook Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adf6",
          "name": "Health Supplement Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adf7",
          "name": "Outdoor Gear Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adf8",
          "name": "Outerwear Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adf9",
          "name": "Organic Produce Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5adfa",
          "name": "Organic Farming"
        },
        {
          "id": "67020366cc7d72ce56e5adfb",
          "name": "Management Consulting"
        },
        {
          "id": "67020366cc7d72ce56e5adfc",
          "name": "Outdoor Gear Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5adfd",
          "name": "Eyewear"
        },
        {
          "id": "67020366cc7d72ce56e5adfe",
          "name": "Pet Supplies"
        },
        {
          "id": "67020366cc7d72ce56e5adff",
          "name": "Fitness App"
        },
        {
          "id": "67020366cc7d72ce56e5ae00",
          "name": "Photography App Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae01",
          "name": "Pet Toy Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae02",
          "name": "Cell Phone Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ae03",
          "name": "Pizza Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae04",
          "name": "Art Printing"
        },
        {
          "id": "67020366cc7d72ce56e5ae05",
          "name": "Printing Services"
        },
        {
          "id": "67020366cc7d72ce56e5ae06",
          "name": "Writing Instruments"
        },
        {
          "id": "67020366cc7d72ce56e5ae07",
          "name": "Sock Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae08",
          "name": "Quilting Supplies"
        },
        {
          "id": "67020366cc7d72ce56e5ae09",
          "name": "Home Decor"
        },
        {
          "id": "67020366cc7d72ce56e5ae0a",
          "name": "Coffee Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae0b",
          "name": "Inspirational Quotes Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ae0c",
          "name": "Content Writing"
        },
        {
          "id": "67020366cc7d72ce56e5ae0d",
          "name": "Quilt Subscription Box"
        },
        {
          "id": "67020366cc7d72ce56e5ae0e",
          "name": "Robotics Education"
        },
        {
          "id": "67020366cc7d72ce56e5ae0f",
          "name": "Book Club Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae10",
          "name": "Emergency Preparedness Kits"
        },
        {
          "id": "67020366cc7d72ce56e5ae11",
          "name": "Bed and Breakfast"
        },
        {
          "id": "67020366cc7d72ce56e5ae12",
          "name": "Instant Noodle Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae13",
          "name": "Jewelry Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae14",
          "name": "Stationery Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ae15",
          "name": "Financial Planning"
        },
        {
          "id": "67020366cc7d72ce56e5ae16",
          "name": "Spice Shop"
        },
        {
          "id": "67020366cc7d72ce56e5ae17",
          "name": "Shoe Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae18",
          "name": "Dessert Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae19",
          "name": "Adventure Tourism"
        },
        {
          "id": "67020366cc7d72ce56e5ae1a",
          "name": "Home Automation"
        },
        {
          "id": "67020366cc7d72ce56e5ae1b",
          "name": "Environmental Consulting"
        },
        {
          "id": "67020366cc7d72ce56e5ae1c",
          "name": "Clothing Alterations"
        },
        {
          "id": "67020366cc7d72ce56e5ae1d",
          "name": "Tea Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae20",
          "name": "Tie Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae21",
          "name": "Technology Consulting"
        },
        {
          "id": "67020366cc7d72ce56e5ae22",
          "name": "IT Consulting"
        },
        {
          "id": "67020366cc7d72ce56e5ae23",
          "name": "Tech Gadget Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae24",
          "name": "Theater Ticket Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae25",
          "name": "Tote Bag Store"
        },
        {
          "id": "67020366cc7d72ce56e5ae26",
          "name": "Consumer Electronics Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ae27",
          "name": "Science Fiction Bookstore"
        },
        {
          "id": "67020366cc7d72ce56e5ae28",
          "name": "Online Education"
        },
        {
          "id": "67020366cc7d72ce56e5ae29",
          "name": "Kitchen Tools"
        },
        {
          "id": "67020366cc7d72ce56e5ae2a",
          "name": "Undergarment Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae2b",
          "name": "Vase Store"
        },
        {
          "id": "67020366cc7d72ce56e5ae2c",
          "name": "Graphic Design"
        },
        {
          "id": "67020366cc7d72ce56e5ae2d",
          "name": "Record Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae2e",
          "name": "Virtual Assistance"
        },
        {
          "id": "67020366cc7d72ce56e5ae2f",
          "name": "Musical Instruments Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ae30",
          "name": "Health and Wellness Supplements"
        },
        {
          "id": "67020366cc7d72ce56e5ae31",
          "name": "Watch Retailer"
        },
        {
          "id": "67020366cc7d72ce56e5ae32",
          "name": "Baking Supplies"
        },
        {
          "id": "67020366cc7d72ce56e5ae33",
          "name": "Watch Store"
        },
        {
          "id": "67020366cc7d72ce56e5ae34",
          "name": "Writing Services"
        },
        {
          "id": "67020366cc7d72ce56e5ae35",
          "name": "Landscape Design"
        },
        {
          "id": "67020366cc7d72ce56e5ae36",
          "name": "Copy Center"
        },
        {
          "id": "67020366cc7d72ce56e5ae37",
          "name": "Xylophone Orchestra Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae38",
          "name": "Musical Instrument Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae39",
          "name": "Coffee Shop Chain"
        },
        {
          "id": "67020366cc7d72ce56e5ae3a",
          "name": "Fitness Equipment"
        },
        {
          "id": "67020366cc7d72ce56e5ae3b",
          "name": "Yoga Apparel"
        },
        {
          "id": "67020366cc7d72ce56e5ae3c",
          "name": "Yoga Studio"
        },
        {
          "id": "67020366cc7d72ce56e5ae3d",
          "name": "Children's Bookstore"
        },
        {
          "id": "67020366cc7d72ce56e5ae3e",
          "name": "Pet Adoption Services"
        },
        {
          "id": "67020366cc7d72ce56e5ae3f",
          "name": "Dance Studio"
        },
        {
          "id": "67020366cc7d72ce56e5ae40",
          "name": "Executive Coaching"
        },
        {
          "id": "67020366cc7d72ce56e5ae41",
          "name": "Meditation App"
        },
        {
          "id": "67020366cc7d72ce56e5ae42",
          "name": "Meditation App Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae43",
          "name": "Fitness Class Subscription"
        },
        {
          "id": "67020366cc7d72ce56e5ae44",
          "name": "Food Delivery"
        }
    ];

    async function generateCompanyData() {
      const data = await Promise.all(
        companies.map(async (company) => {
          // Hash the company name for the password
          const hashedPassword = await bcrypt.hash(company.name, 10);
    
          // Find the industry ID for the given company
          const industry = industries.find(ind => ind.name === company.industry);
    
          return {
            _id: { "$oid": generateObjectId() },
            companyName: company.name,
            email: `${company.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            password: hashedPassword,
            programStartDate: new Date(company.programStart), // Use ISO format for MongoDB
            industryId: industry ? { "$oid": industry.id } : null
          };
        })
      );
    
      // Output as JSON
      console.log(JSON.stringify(data, null, 2));
    }
    
    // Helper function to generate a random ObjectId (like MongoDB _id)
    function generateObjectId() {
      const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
      return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
        (Math.random() * 16 | 0).toString(16)
      ).toLowerCase();
    }
    
    // Run the function
    generateCompanyData();