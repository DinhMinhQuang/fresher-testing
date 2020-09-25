const Joi = require("mecore").Joi;
const ResponseCode = require("../../../../../../../constants/ResponseCode");
const Module = require("./Module");

module.exports = [
  {
    method: "PUT",
    path: "/v1/account/update",
    handler: Module,
    options: {
      auth: false,
      tags: ["api", "internal", "v1"],
      validate: {
        payload: Joi.object({
          _id: Joi.string().example("5f6d661ce7dba92c50b67686").allow(),
          banks: Joi.array().allow(),
          phone: Joi.string()
            .regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
            .allow()
            .example("0931329271"),
          fullname: Joi.string().allow().example("Dinh Minh Quang"),
          id: Joi.number().allow().example("1"),
          createdAt: Joi.date().example("2020-09-25T03:38:04.419Z").allow(),
          updatedAt: Joi.date().example("2020-09-25T03:38:04.419Z").allow(),
        }).label("PAYLOAD_TEST"),   
      },
      response: {
        status: {
          [ResponseCode.REQUEST_SUCCESS]: Joi.object({
            userInfo: Joi.object(),
          }).label("SUCCESS"),
          [ResponseCode.REQUEST_FAIL]: Joi.object({
            error: Joi.string(),
          }).label("FAILED"),
        },
      },
    },
  },
];
