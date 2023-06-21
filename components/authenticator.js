const { v3 } = require("uuid");
const axios = require("axios");
let uuid;
let api_url = "https://authserver.mojang.com";

module.exports.getAuth = function (username, password, client_token = null) {
  return new Promise((resolve, reject) => {
    getUUID(username);
    if (!password) {
      const user = {
        access_token: uuid,
        client_token: client_token || uuid,
        uuid,
        name: username,
        user_properties: "{}",
      };

      return resolve(user);
    }

    const requestObject = {
      url: api_url + "/authenticate",
      json: {
        agent: {
          name: "Minecraft",
          version: 1,
        },
        username,
        password,
        clientToken: uuid,
        requestUser: true,
      },
    };

    axios
      .post(requestObject.url, requestObject.json)
      .then((response) => {
        const body = response.data;

        const userProfile = {
          access_token: body.accessToken,
          client_token: body.clientToken,
          uuid: body.selectedProfile.id,
          name: body.selectedProfile.name,
          selected_profile: body.selectedProfile,
          user_properties: parsePropts(body.user.properties),
        };

        resolve(userProfile);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

module.exports.validate = function (accessToken, clientToken) {
  return new Promise((resolve, reject) => {
    const requestObject = {
      url: api_url + "/validate",
      json: {
        accessToken,
        clientToken,
      },
    };

    axios
      .post(requestObject.url, requestObject.json)
      .then((response) => {
        if (!response.data) resolve(true);
        else reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.refreshAuth = function (accessToken, clientToken) {
  return new Promise((resolve, reject) => {
    const requestObject = {
      url: api_url + "/refresh",
      json: {
        accessToken,
        clientToken,
        requestUser: true,
      },
    };

    axios
      .post(requestObject.url, requestObject.json)
      .then((response) => {
        const body = response.data;
        const userProfile = {
          access_token: body.accessToken,
          client_token: getUUID(body.selectedProfile.name),
          uuid: body.selectedProfile.id,
          name: body.selectedProfile.name,
          user_properties: parsePropts(body.user.properties),
        };

        return resolve(userProfile);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.invalidate = function (accessToken, clientToken) {
  return new Promise((resolve, reject) => {
    const requestObject = {
      url: api_url + "/invalidate",
      json: {
        accessToken,
        clientToken,
      },
    };

    axios
      .post(requestObject.url, requestObject.json)
      .then((response) => {
        if (!response.data) return resolve(true);
        else return reject(response.data);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

module.exports.signOut = function (username, password) {
  return new Promise((resolve, reject) => {
    const requestObject = {
      url: api_url + "/signout",
      json: {
        username,
        password,
      },
    };

    axios
      .post(requestObject.url, requestObject.json)
      .then((response) => {
        if (!response.data) return resolve(true);
        else return reject(response.data);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

module.exports.changeApiUrl = function (url) {
  api_url = url;
};

function parsePropts(array) {
  if (array) {
    const newObj = {};
    for (const entry of array) {
      if (newObj[entry.name]) {
        newObj[entry.name].push(entry.value);
      } else {
        newObj[entry.name] = [entry.value];
      }
    }
    return JSON.stringify(newObj);
  } else {
    return "{}";
  }
}

function getUUID(value) {
  if (!uuid) {
    uuid = v3(value, v3.DNS);
  }
  return uuid;
}
