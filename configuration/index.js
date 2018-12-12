if (process.env.NODE_ENV === 'test') {
    module.exports = {
      JWT_SECRET: 'vakamakatatest',
      oauth: {
        google: {
          clientID: 'test',
          clientSecret: 'test'
        },
        facebook: {
          clientID: 'test',
          clientSecret: 'test'
        }
      }
    };
  } else {
    module.exports = {
      JWT_SECRET: 'vakamakata',
      oauth: {
        google: {
          clientID: '890644813294-bvuq6cf7lsilohneqvov28oi60sfdmig.apps.googleusercontent.com',
          clientSecret: 'YosUM23QdMNV1MoOVVlm7rHO'
        },
        facebook: {
          clientID: '485850475180066',
          clientSecret: '2209b0faa12bdec0b42e4636327de905'
        }
      }
    };
  }