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
    this.log('githubInstallations', data);

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
    this.log('githubRepositories', data);

    return data?.githubRepositories;
  },

  // ---------------------------------
  // Board
  // ---------------------------------

  async createBoard(token, { name, repositories }) {
    const query = `
      mutation($name:String!, $repositories:[RepositoryInput!]!) {
        createBoard(input: { name: $name, repositories: $repositories }) {
          id
          name
        }
      }
    `;
    const vars = { name, repositories };
    const data = await this.client(token).request(query, vars);
    this.log('createBoard', data);

    return data?.createBoard;
  },

  async fetchBoard(token, { id }) {
    const query = `
      query($id:Int!) {
        board(id: $id) {
          id
          name
          columns {
            id name position
            issues {
              id
              number
              title
              position
              url
              repositoryName
              isClosed
              labels { name color }
            }
          }
        }
      }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('board', data);

    return data?.board;
  },

  async fetchBoardSettings(token, { id }) {
    const query = `
      query($id:Int!) {
        boardSettings:board(id: $id) {
          id
          name
          repositories {
            id
            name
            fullName
            isPrivate
            installationId
            installationAccessTokenUrl
            issuesCount
          }
        }
      }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('boardSettings', data);

    return data?.boardSettings;
  },

  async saveBoardSettings(token, { id, repositories }) {
    const query = `
      mutation($id:Int!, $repositories:[RepositoryInput!]!) {
        saveBoardSettings(input: { id: $id, repositories: $repositories }) {
          id
          errors
        }
      }
    `;
    const data = await this.client(token).request(query, { id, repositories });
    this.log('saveBoardSettings', data);

    return data?.saveBoardSettings;
  },

  async syncBoardIssues(token, { id, repository }) {
    const query = `
      mutation($id:Int!, $repository:RepositoryInput!) {
        syncBoardIssues(input: { id: $id, repository: $repository }) {
          issuesCount
          errors
        }
      }
    `;
    const data = await this.client(token).request(query, { id, repository });
    this.log('saveBoardSettings', data);

    return data?.syncBoardIssues;
  },

  // ---------------------------------
  // Column
  // ---------------------------------

  async createColumn(token, { name, boardId }) {
    const query = `
      mutation($name:String!, $boardId:Int!) {
        createColumn(input: { name: $name, boardId: $boardId }) {
          id
          name
          position
        }
      }
    `;
    const vars = { name, boardId };
    const data = await this.client(token).request(query, vars);
    this.log('createColumn', data);

    return data?.createColumn;
  },

  async updateColumnPositions(token, { boardId, columns }) {
    const query = `
      mutation($boardId:Int!, $ids:[Int!]!, $positions:[Int!]!) {
        action:updateColumnPositions(
          input: { boardId: $boardId, ids: $ids, positions: $positions }
        ) {
          errors
        }
      }
    `;
    const ids = columns.map(v => v.id);
    const positions = columns.map(v => v.position);
    const vars = { boardId, ids, positions };
    console.log(vars);
    const data = await this.client(token).request(query, vars);
    this.log('updateColumnPositions', data);

    return data?.action;
  },

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
