import * as firebaseAmin from 'firebase-admin';
const configFirebase = require('../fcm/config.json');

firebaseAmin.initializeApp({
  credential: firebaseAmin.credential.cert(configFirebase),
});

export const verifyTokenFirebase = async (token: string) => {
  const auth = await firebaseAmin.auth().verifyIdToken(token);

  const user = await firebaseAmin.auth().getUser(auth.uid);

  return user;
};

export default firebaseAmin;
