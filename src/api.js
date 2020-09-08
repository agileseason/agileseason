import { GraphQLClient } from 'graphql-request';

const DOMAIN = {
  development: 'http://localhost:3000',
  production: 'https://api.agileseason.com'
}[process.env.NODE_ENV];

const ENDPOINT = DOMAIN + '/graphql';

export default {
  async fetchProfile(token) {
    const query = `
      query {
        user {
          id
          username
          avatarUrl
          boards { id name }
        }
      }
    `;
    const data = await this.client(token).request(query);
    this.log('user', data);

    return data?.user;
  },

  async fetchInstallactions(token, page = 1) {
    const query = `
      query($page:Int!) {
        githubInstallations(page: $page) {
          totalCount
          items {
            id
            accessTokensUrl
            account {
              id
              login
              avatarUrl
              type
            }
          }
        }
      }
    `;
    const vars = { page };
    const data = await this.client(token).request(query, vars);
    this.log('user', data);

    return data?.githubInstallations;
  },

  async fetchRepositories(token, installationId, page = 1) {
    const query = `
      query($installationId:Int!, $page:Int!) {
        githubRepositories(installationId: $installationId, page: $page) {
          totalCount
          items {
            id
            name
            fullName
            isPrivate
          }
        }
      }
    `;
    const vars = { installationId, page };
    const data = await this.client(token).request(query, vars);
    this.log('user', data);

    return data?.githubRepositories;
  },

  // async login(email, password) {
  //   const query = `
  //     query($email:String!, $password:String!) {
  //       user:signIn(email: $email, password: $password) {
  //         email
  //         token
  //         defaultCurrency { name }
  //       }
  //     }
  //   `;
  //   const vars = { email, password };
  //   const data = await this.client().request(query, vars);
  //   this.log('login', data);

  //   return data;
  // },

  // ---------------------------------
  // Helpers
  // ---------------------------------

  client(token) {
    return new GraphQLClient(ENDPOINT, { headers: this.headers(token) });
  },

  headers(token) {
    if (process.env.NODE_ENV == 'development') {
      console.log(`Token: ${token}`);
    }

    return token ? { authorization: `Bearer ${token}` } : {};
  },

  log(query, data) {
    if (!process.env.NODE_ENV == 'development') { return; }

    if (data != null) {
      console.log(query, JSON.stringify(data, undefined, 2));
    } else {
      console.log(query, 'Data is NULL!');
    }
  }
};
