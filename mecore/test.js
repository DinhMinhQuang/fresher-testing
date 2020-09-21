const NodeRSA = require('node-rsa');
const _ = require('lodash');
const Axios = require('axios');
const CryptoJS = require('crypto-js');
const ShortId = require('shortid');
const Md5 = require('md5');

class MeAPI {
  constructor(config = {
    url: '',
    publicKey: '',
    privateKey: '',
    isSecurity: false,
    'x-api-client': ''
  }) {
    this.config = config;
  }

  ResponseDecrypt(xAPIAction, method, xAPIClient, xAPIKey, xAPIMessage, xAPIValidate, accessToken) {
    let encryptKey;
    try {
      const key = new NodeRSA(this.config.privateKey);
      encryptKey = key.decrypt(xAPIKey, 'utf8');
    } catch (error) {
      throw new Error('Thông tin "x-api-key" không chính xác');
    }
    const objValidate = {
      'x-api-action': xAPIAction,
      method,
      accessToken,
      'x-api-message': xAPIMessage
    };
    console.log(objValidate);
    const validate = Md5(_.values(objValidate) + encryptKey);
    if (validate !== xAPIValidate) {
      throw new Error('Thông tin "x-api-validate" không chính xác');
    }
    let result = null;
    try {
      result = JSON.parse(CryptoJS.AES.decrypt(xAPIMessage, encryptKey).toString(CryptoJS.enc.Utf8));
    } catch (error) {
      throw new Error('Thông tin "x-api-message" không chính xác');
    }
    return result;
  }
  RequestEncrypt(url, method, payload, accessToken) {
    const encryptKey = ShortId.generate();
    const key = new NodeRSA(this.config.publicKey);
    const xAPIKey = key.encrypt(encryptKey, 'base64');
    let body = '';
    const xApiAction = CryptoJS.AES.encrypt(url, encryptKey).toString();
    let xApiMessage = '';
    if (payload) {
      xApiMessage = CryptoJS.AES.encrypt(JSON.stringify(payload), encryptKey).toString();
    }
    const objValidate = {
      xApiAction,
      method,
      accessToken,
      'x-api-message': xApiMessage
    };
    const xAPIValidate = Md5(_.values(objValidate) + encryptKey);
    body = {
      'x-api-message': xApiMessage
    };
    const meAPIHeader = {
      'x-api-client': this.config['x-api-client'],
      'x-api-key': xAPIKey,
      'x-api-action': xApiAction,
      'x-api-validate': xAPIValidate
    };
    if (accessToken !== '') {
      meAPIHeader.Authorization = accessToken;
    }
    return {
      body,
      headers: meAPIHeader
    };
  }
  async Post(pathUrl, payload, accessToken = '', headers = {}) {
    const result = {
      code: -1,
      data: {},
      original: null
    };
    try {
      if (_.isNull(accessToken)) accessToken = '';
      let meAPIHeader = {};
      if (accessToken !== '') {
        meAPIHeader.Authorization = accessToken;
      }
      let body = payload;
      let url = this.config.url + pathUrl;
      if (this.config.isSecurity === true) {
        url = this.config.url;
        const encrypt = this.RequestEncrypt(
          pathUrl,
          'POST',
          payload,
          accessToken
        );
        meAPIHeader = encrypt.headers;
        body = encrypt.body;
      }

      console.log(body, _.merge(meAPIHeader, headers));
      const response = await Axios.post(url, body, {
        headers: _.merge(meAPIHeader, headers)
      });
      if (response.code !== 200) {
        result.code = -response.code;
        result.data = {};
        result.original = response.data;
      }
      let data = response.data;
      if (this.config.isSecurity === true) {
        try {
          const responseHeaders = response.headers;
          data = this.ResponseDecrypt(
            responseHeaders['x-api-action'],
            'POST',
            responseHeaders['x-api-client'],
            responseHeaders['x-api-key'],
            response.data['x-api-message'],
            responseHeaders['x-api-validate'],
            accessToken
          );
        } catch (error) {
          return {
            code: -1,
            data: {
              message: error.message
            },
            original: response.data
          };
        }
      }
      return {
        code: 1,
        data,
        original: response.data
      };
    } catch (error) {
      return {
        code: -2,
        data: {
          message: error.message
        },
        original: error
      };
    }
  }

  async Get(pathUrl, accessToken = '', headers = {}) {
    const result = {
      code: -1,
      data: {},
      original: null
    };
    try {
      if (_.isNull(accessToken)) accessToken = '';
      let meAPIHeader = {};
      if (accessToken !== '') {
        meAPIHeader.Authorization = accessToken;
      }
      let url = this.config.url + pathUrl;
      if (this.config.isSecurity === true) {
        url = this.config.url;
        const encrypt = this.RequestEncrypt(
          pathUrl,
          'GET',
          '',
          accessToken
        );
        meAPIHeader = encrypt.headers;
      }
      const response = await Axios.get(url, {
        headers: _.merge(meAPIHeader, headers)
      });
      if (response.code !== 200) {
        result.code = -response.code;
        result.data = {};
        result.original = response.data;
      }
      let data = response.data;
      if (this.config.isSecurity === true) {
        try {
          const responseHeaders = response.headers;
          data = this.ResponseDecrypt(
            responseHeaders['x-api-action'],
            'GET',
            responseHeaders['x-api-client'],
            responseHeaders['x-api-key'],
            response.data['x-api-message'],
            responseHeaders['x-api-validate'],
            accessToken
          );
        } catch (error) {
          return {
            code: -1,
            data: {
              message: error.message
            },
            original: response.data
          };
        }
      }
      return {
        code: 1,
        data,
        original: response.data
      };
    } catch (error) {
      return {
        code: -2,
        data: {
          message: error.message
        },
        original: error
      };
    }
  }
}
(async () => {
  const app = {
    publicKey: '-----BEGIN PUBLIC KEY-----\n' +
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKi\n' +
      'wIhTJpAi1XnbfOSrW/Ebw6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQ==\n' +
      '-----END PUBLIC KEY-----',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
      'MIIBPAIBAAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKiwIhTJpAi1XnbfOSrW/Eb\n' +
      'w6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQJBAJSfTrSCqAzyAo59Ox+m\n' +
      'Q1ZdsYWBhxc2084DwTHM8QN/TZiyF4fbVYtjvyhG8ydJ37CiG7d9FY1smvNG3iDC\n' +
      'dwECIQDygv2UOuR1ifLTDo4YxOs2cK3+dAUy6s54mSuGwUeo4QIhAK7SiYDyGwGo\n' +
      'CwqjOdgOsQkJTGoUkDs8MST0MtmPAAs9AiEAjLT1/nBhJ9V/X3f9eF+g/bhJK+8T\n' +
      'KSTV4WE1wP0Z3+ECIA9E3DWi77DpWG2JbBfu0I+VfFMXkLFbxH8RxQ8zajGRAiEA\n' +
      '8Ly1xJ7UW3up25h9aa9SILBpGqWtJlNQgfVKBoabzsU=\n' +
      '-----END RSA PRIVATE KEY-----'
  };

  const meAPI = new MeAPI({
    url: 'http://127.0.0.1:3000',
    publicKey: app.publicKey,
    privateKey: app.privateKey,
    isSecurity: true,
    'x-api-client': 'app'
  });
  const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIsImp0aSI6ImUxMmQzYTVkLWYzMmUtNDRkZC1iMzczLWJlYTZmYTYwYWM5NyIsImlhdCI6MTU4NjQwMTc3NSwiZXhwIjoxNTg2NDA1Mzc1fQ.o02GjY0I9voFtNgQ3Y_E48jzEoEwlry3cnXx9M7C21s';

  const response = await meAPI.Post('/v1/Transfer/GetRecipientName/CardNumber', {
    cardNumber: '9704160000000001',
    swiftCode: 'ASCBVNVX'
  }, accessToken);

  console.log(response);

  // const response = await meAPI.Get('/v1/Ocb/Utility/BankCode/Napas', accessToken);

  // console.log(response);
})();
