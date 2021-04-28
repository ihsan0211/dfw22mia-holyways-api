require("dotenv").config();

const { User } = require("../models");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = req.body;

    const schema = joi.object({
      fullName: joi.string().min(3).required(),
      password: joi.string().required(),
      email: joi.string().email().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.send({
        status: "Failed",
        message: "Email Already Registered",
      });
    }

    const hashStrenght = 10;
    const hashedPassword = await bcrypt.hash(password, hashStrenght);

    const dataUser = await User.create({
      ...data,
      password: hashedPassword,
    });

    const token = jwt.sign(email, process.env.ACCESS_TOKEN);

    res.send({
      status: "Success",
      data: {
        User: {
          fullName: dataUser.fullName,
          token: token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail) {
      return res.send({
        status: "Login Failed",
        message: "Email and Password don't match",
      });
    }

    const isValidPassword = await bcrypt.compare(password, checkEmail.password);

    if (!isValidPassword) {
      return res.send({
        status: "Login Failed",
        message: "Email and Password don't match",
      });
    }
    // const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    const token = jwt.sign({ id: checkEmail.id }, process.env.ACCESS_TOKEN);
    // const token = { accessToken };

    res.send({
      status: "success",
      data: {
        User: {
          id: checkEmail.id,
          name: checkEmail.fullName,
          email: checkEmail.email,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, User) => {
    if (err) return res.sendStatus(403);
    req.User = User;
    next();
  });
};
