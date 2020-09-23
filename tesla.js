const axios = require('axios')
async function RenewPassword (email, pass) {
    return axios
        .post('https://owner-api.teslamotors.com/oauth/token', {
                "grant_type": "password",
                'client_secret' : 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3',
                'client_id' : '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384',
                'email' : `${email}`,
                'password' : `${pass}`
    }
    )
            .then((res) => {
                    console.log(`statusCode: ${res.statusCode}`);
                    return res.data;
                })
              .catch((error) => {
                console.error(error)
              })

}

async function RenewRefresh (refresh) {
    return axios
        .post('https://owner-api.teslamotors.com/oauth/token', {
                "grant_type": "refresh_token",
                'client_secret' : 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3',
                'client_id' : '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384',
                'refresh_token' : `${refresh}`
    }
    )
            .then((res) => {
                    console.log(`statusCode: ${res.statusCode}`);
                    return res.data
                })
              .catch((error) => {
                console.error(error)
              })
}

async function listcars (token) {
    return axios
        .get('https://owner-api.teslamotors.com/api/1/vehicles', {
                headers: {'Authorization': `Bearer ${token}`}
    }
    )
            .then((res) => {
                    console.log(`statusCode: ${res.statusCode}`);
                    return res.data
                })
              .catch((error) => {
                console.error(error)
              })
}

async function tesla_command (token, id, command) {
  return axios
      .post('https://owner-api.teslamotors.com/api/1/vehicles/' + id + '/command/' + command, null,{
                headers: {'Authorization': `Bearer ${token}`}
})
          .then((res) => {
                  console.log(`statusCode: ${res.statusCode}`);
                  return res.data
              })
            .catch((error) => {
              console.error(error)
            })
}

async function tesla_state (token, id, data) {
  return axios
      .get('https://owner-api.teslamotors.com/api/1/vehicles/' + id +'/'+ data, {
              headers: {'Authorization': `Bearer ${token}`}
  }
  )
          .then((res) => {
                  console.log(`statusCode: ${res.statusCode}`);
                  return res.data
              })
            .catch((error) => {
              console.error(error)
            })
}
module.exports = { RenewPassword, RenewRefresh, listcars, tesla_command, tesla_state }