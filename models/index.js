"use strict";
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
// model import
const User = require("./User");
const Post = require("./Post");
const ProfileImage = require("./ProfileImage");
const PostImage = require("./PostImage");
const ChatRoom = require("./ChatRoom");
const ChatMessage = require("./ChatMessage");
const Review = require("./Review");
const UserAddress = require("./UserAddress");
const District = require("./District");

const db = {};

// db connection
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Post = Post;
db.ProfileImage = ProfileImage;
db.PostImage = PostImage;
db.ChatRoom = ChatRoom;
db.ChatMessage = ChatMessage;
db.Review = Review;
db.UserAddress = UserAddress;
db.District = District;

User.init(sequelize);
Post.init(sequelize);
ProfileImage.init(sequelize);
PostImage.init(sequelize);
ChatRoom.init(sequelize);
ChatMessage.init(sequelize);
Review.init(sequelize);
UserAddress.init(sequelize);
District.init(sequelize);

District.associate(db);
Post.associate(db);
ProfileImage.associate(db);
PostImage.associate(db);
ChatRoom.associate(db);
ChatMessage.associate(db);
Review.associate(db);
UserAddress.associate(db);
District.associate(db);

module.exports = db;
