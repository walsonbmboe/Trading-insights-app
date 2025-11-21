const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_rEPjFOUi5",
      userPoolClientId: "1jdccu8plmmsa3a0u0pluoudu9",
      identityPoolId: "eu-north-1:38d23317-b63d-48f2-9843-96f2f074adc0",
      loginWith: {
        oauth: {
          domain: "eu-north-1repjfoui5.auth.eu-north-1.amazoncognito.com",
          scopes: ["email", "openid", "phone"],
          redirectSignIn: [
            "https://main.d6jxhv6dntt98.amplifyapp.com/callback"
          ],
          redirectSignOut: [
            "https://main.d6jxhv6dntt98.amplifyapp.com/"
          ],
          responseType: "code"
        }
      }
    }
  }
};

export default awsconfig;

