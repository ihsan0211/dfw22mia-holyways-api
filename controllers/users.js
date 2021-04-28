// const { restart } = require("nodemon");
const { User } = require("../models");

exports.getUsers = async (req, res) => {
  try {
    const dataUser = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.send({
      status: "success",
      data: dataUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
