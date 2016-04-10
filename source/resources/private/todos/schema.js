module.exports = {
  body: {
    properties: {
      id: {
        type: 'integer'
      },
      text: {
        type: 'string'
      },
      complete: {
        type: 'string',
      },
      created_at: {
        type: 'string',
      },
      updated_at: {
        type: 'string',
      },
      links: {
        user_id: {
          type: 'integer'
        }
      }
    }
  }
};
