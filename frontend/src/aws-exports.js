const awsconfig = {
  Auth: {
    region: "eu-north-1", // Your AWS region
    userPoolId: "eu-north-1_rEPjFOUi5", // your User Pool ID
    userPoolWebClientId: "1jdccu8plmmsa3a0u0pluoudu9", // your App Client ID (from Cognito)
    identityPoolId: "eu-north-1:38d23317-b63d-48f2-9843-96f2f074adc0", // your Identity Pool ID
    oauth: {
      domain: "eu-north-1repjfoui5.auth.eu-north-1.amazoncognito.com", // your Cognito domain
      scope: ["email", "openid", "phone"],
      redirectSignIn: "https://main.d6jxhv6dntt98.amplifyapp.com/callback",
      redirectSignOut: "https://main.d6jxhv6dntt98.amplifyapp.com/",
      responseType: "code",
    },
  },
};

export default awsconfig;
