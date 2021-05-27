import { GraphQLClient } from 'graphql-request';

// const DOMAIN = {
//   development: 'http://localhost:3000',
//   production: 'https://api.agileseason.com'
// }[process.env.NODE_ENV];

const DOMAIN_API = process.env.VUE_APP_API_URL;

const ENDPOINT = DOMAIN_API + '/graphql';

export default {
  // ---------------------------------
  // User
  // ---------------------------------

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

  // ---------------------------------
  // GitHub
  // ---------------------------------

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

  async fetchAssignableUsers(token, boardId, repositoryFullName) {
    const query = `
      query($boardId:Int!, $repositoryFullName:String!) {
        items:githubAssignableUsers(boardId: $boardId, repositoryFullName: $repositoryFullName) {
          login
          avatarUrl
        }
      }
    `;
    const vars = { boardId, repositoryFullName };
    const data = await this.client(token).request(query, vars);
    this.log('githubAssignableUsers', data);

    return data?.items;
  },

  async fetchLabels(token, boardId, repositoryFullName) {
    const query = `
      query($boardId:Int!, $repositoryFullName:String!) {
        items:githubLabels(boardId: $boardId, repositoryFullName: $repositoryFullName) {
          name
          color
          description
        }
      }
    `;
    const vars = { boardId, repositoryFullName };
    const data = await this.client(token).request(query, vars);
    this.log('githubLabels', data);

    return data?.items;
  },

  async fetchUsers(search) {
    const query = `
      query($search:String!) {
        items:githubSearchUsers(search: $search) {
          login
          avatarUrl
        }
      }
    `;
    const vars = { search };
    const data = await this.client().request(query, vars);
    this.log('githubSearchUsers', data);

    return data?.items;
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
          isOwner
          columns {
            id name position
            issues {
              id
              number
              title
              position
              url
              repositoryName
              labels { name color }
              assignees { login avatarUrl }
              isClosed
              isBody
              commentsCount
              color
            }
          }
          repositories {
            id
            name
            fullName
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
          isOwner
          repositories {
            id
            name
            fullName
            isPrivate
            installationId
            installationAccessTokenUrl
            issuesCount
          }
          invites {
            id username avatarUrl token
          }
          memberships {
            id username avatarUrl isOwner
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

  async updateBoard(token, { id, name }) {
    const query = `
      mutation($id:Int!, $name:String!) {
        action:updateBoard(input: { id: $id, name: $name }) {
          id
          name
          errors
        }
      }
    `;
    const vars = { id, name };
    const data = await this.client(token).request(query, vars);
    this.log('updateBoard', data);

    return data?.action;
  },

  async destroyBoard(token, { id }) {
    const query = `
      mutation($id:Int!) {
        destroyBoard(input: { id: $id }) {
          errors
        }
      }
    `;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log('destroyBoard', data);

    return data?.destroyBoard;
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
          issues { id }
        }
      }
    `;
    const vars = { name, boardId };
    const data = await this.client(token).request(query, vars);
    this.log('createColumn', data, vars);

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
    const data = await this.client(token).request(query, vars);
    this.log('updateColumnPositions', data, vars);

    return data?.action;
  },

  async moveIssues(token, { boardId, columnId, issueIds }) {
    const query = `
      mutation($boardId:Int!, $columnId:Int!, $issueIds:[Int!]!) {
        action:moveIssues(
          input: { boardId: $boardId, columnId: $columnId, issueIds: $issueIds }
        ) {
          errors
        }
      }
    `;
    const vars = { boardId, columnId, issueIds };
    const data = await this.client(token).request(query, vars);
    this.log('moveIssue', data, vars);

    return data?.action;
  },

  // ---------------------------------
  // Issue
  // ---------------------------------

  async fetchIssue(token, { boardId, id }) {
    const query = `
      mutation($boardId:Int!, $id:Int!) {
        action:syncIssue(input: { boardId: $boardId, id: $id }) {
          issue {
            id
            number
            title
            body
            position
            url
            repositoryName
            repositoryFullName
            columnId
            isClosed
            isArchived
            createdAt
            createdAgo
            labels { name color }
            author { login url avatarUrl }
            assignees { login url avatarUrl }
            color
          }
          errors
        }
      }
    `;
    const vars = { boardId, id };
    const data = await this.client(token).request(query, vars);
    this.log('fetchIssue', data, vars);

    return data?.action;
  },

  async fetchIssueComments(token, { boardId, id }) {
    const query = `
      query($boardId:Int!, $id:Int!) {
        comments(boardId: $boardId, id: $id) {
          id
          nodeId
          body
          createdAt
          createdAgo
          author { url login avatarUrl }
        }
      }
    `;
    const vars = { boardId, id };
    const data = await this.client(token).request(query, vars);
    this.log('fetchIssueComments', data, vars);

    return data?.comments;
  },

  async createIssue(token, { boardId, columnId, repositoryId, title, body, position, assignees, labels, color }) {
    const query = `
      mutation(
        $boardId:Int!,
        $columnId:Int!,
        $repositoryId:Int!,
        $title:String!,
        $body:String,
        $position:String,
        $assignees:[String],
        $labels:[String],
        $color:String
      ) {
        createIssue(input: {
          boardId: $boardId,
          columnId: $columnId,
          repositoryId: $repositoryId,
          title: $title,
          body: $body,
          position: $position,
          assignees: $assignees,
          labels: $labels,
          color: $color
        }) {
          issue {
            id
            number
            title
            body
            position
            url
            repositoryName
            isClosed
            isArchived
            createdAt
            createdAgo
            labels { name color }
            assignees { login url avatarUrl }
            author { login url avatarUrl }
            columnId
            isBody
            commentsCount
            color
          }
          errors
        }
      }
    `;
    const assigneesLogins = assignees ? assignees.map(v => v.login) : null;
    const labelsNames = labels ? labels.map(v => v.name) : null;
    const vars = { boardId, columnId, repositoryId, title, body, position, assignees: assigneesLogins, labels: labelsNames, color };
    const data = await this.client(token).request(query, vars);
    this.log('createIssue', data, vars);

    return data?.createIssue;
  },

  async updateIssue(token, { id, boardId, title, body, assignees, labels, color }) {
    const query = `
      mutation($id:Int!, $boardId:Int!, $title:String, $body:String, $assignees:[String], $labels:[String], $color:String) {
        updateIssue(input: {
          id: $id,
          boardId: $boardId,
          title: $title,
          body: $body,
          assignees: $assignees,
          labels: $labels,
          color: $color
        }) {
          issue {
            id
            number
            title
            labels { name color }
            assignees { login url avatarUrl }
            color
            isClosed
            isArchived
          }
          errors
        }
      }
    `;
    const assigneesLogins = assignees ? assignees.map(v => v.login) : null;
    const labelsNames = labels ? labels.map(v => v.name) : null;
    const vars = { id, boardId, title, body, assignees: assigneesLogins, labels: labelsNames, color };
    const data = await this.client(token).request(query, vars);
    this.log('updateIssue', data, vars);

    return data?.updateIssue;
  },

  async updateIssueState(token, { id, boardId, isClosed, isArchived }) {
    const query = `
      mutation($id:Int!, $boardId:Int!, $isClosed:Boolean, $isArchived:Boolean) {
        action:updateIssue(input: {
          id: $id,
          boardId: $boardId,
          isClosed: $isClosed,
          isArchived: $isArchived
        }) {
          issue {
            id
            number
            title
            labels { name color }
            assignees { login url avatarUrl }
            color
            isClosed
            isArchived
          }
          errors
        }
      }
    `;
    const vars = { id, boardId, isClosed, isArchived };
    const data = await this.client(token).request(query, vars);
    this.log('updateIssueState', data, vars);

    return data?.action;
  },

  async createComment(token, { boardId, repositoryFullName, issueId, body }) {
    const query = `
      mutation($boardId:Int!, $repositoryFullName:String!, $issueId:Int!, $body:String!) {
        action:createComment(input: {
          boardId: $boardId,
          repositoryFullName: $repositoryFullName,
          issueId: $issueId,
          body: $body
        }) {
          comment {
            id
            nodeId
            body
            createdAt
            createdAgo
            author { url login avatarUrl }
          }
          errors
        }
      }
    `;
    const vars = { boardId, repositoryFullName, issueId, body };
    const data = await this.client(token).request(query, vars);
    this.log('closeIssue', data, vars);

    return data?.action;
  },

  // ---------------------------------
  // Invites
  // ---------------------------------
  async createInvite(token, { boardId, login, avatarUrl }) {
    const query = `
      mutation($boardId:Int!, $username:String!, $avatarUrl:String!) {
        action:createInvite(input: {
          boardId: $boardId,
          username: $username,
          avatarUrl: $avatarUrl
        }) {
          id
          username
          avatarUrl
          token
          errors
        }
      }
    `;
    const vars = { boardId, username: login, avatarUrl };
    const data = await this.client(token).request(query, vars);
    this.log('createInvite', data, vars);

    return data?.action;
  },

  async fetchInvite({ token }) {
    const query = `
      query($token:String!) {
        invite(token: $token) {
          id
          username
          boardName
        }
      }
    `;
    const vars = { token };
    const data = await this.client().request(query, vars);
    this.log('fetchInvite', data, vars);

    return data?.invite;
  },

  async acceptInvite(token, { inviteId }) {
    const query = `
      mutation($inviteId:Int!) {
        action:createMembership(input: { inviteId: $inviteId }) {
          boardId
          errors
        }
      }
    `;
    const vars = { inviteId };
    const data = await this.client(token).request(query, vars);
    this.log('acceptInvite', data, vars);

    return data?.action;
  },

  async destroyInvite(token, { boardId, id }) {
    const query = `
      mutation($boardId:Int!, $id:Int!) {
        action:destroyInvite(input: {
          boardId: $boardId,
          id: $id
        }) {
          errors
        }
      }
    `;
    const vars = { boardId, id };
    const data = await this.client(token).request(query, vars);
    this.log('destroyInvite', data, vars);

    return data?.action;
  },

  async destroyMembership(token, { boardId, id }) {
    const query = `
      mutation($boardId:Int!, $id:Int!) {
        action:destroyMembership(input: {
          boardId: $boardId,
          id: $id
        }) {
          errors
        }
      }
    `;
    const vars = { boardId, id };
    const data = await this.client(token).request(query, vars);
    this.log('destroyMembership', data, vars);

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

  log(query, data, vars) {
    if (!process.env.NODE_ENV == 'development') { return; }

    console.log(`%c${query}`, 'color:#4db6ac');
    if (data != null) {
      console.log(JSON.stringify({ data }, undefined, 2));
    } else {
      console.log('%cData is NULL!', 'color:#ff80ab');
    }
    if (vars) {
      console.log(`%c${JSON.stringify({ vars }, undefined, 2)}`, 'color:#64b5f6;');
    }
  }
};
