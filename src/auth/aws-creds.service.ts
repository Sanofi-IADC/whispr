// Needed for the amazon cognito to work with nodejs
// https://www.npmjs.com/package/amazon-cognito-identity-js#setup
import 'cross-fetch/polyfill';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
@Injectable()
export class AWSCredsService {
  private aws: typeof AWS;

  constructor(private configService: ConfigService) {
    this.aws = AWS;
  }

  public async authenticate(): Promise<void> {
    const authenticationData = {
      Username: this.configService.get('COGNITO_ADMIN_USER'),
      Password: this.configService.get('COGNITO_ADMIN_PW')
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID'), // Your user pool id here
      ClientId: this.configService.get('COGNITO_CLIENT_ID_ADMIN') // Your client id here
    };
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: this.configService.get('COGNITO_ADMIN_USER'),
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    const authDetails = await AWSCredsService.getCognitoUserSession(cognitoUser, authenticationDetails);
    this.aws.config.region = this.configService.get('COGNITO_REGION');
    const cognitoConfig = {
      IdentityPoolId: this.configService.get('COGNITO_IDENTITY_POOL_ID'), // your identity pool id here
      Logins: {}
    };
    cognitoConfig.Logins[
      `cognito-idp.eu-west-1.amazonaws.com/${this.configService.get('COGNITO_USER_POOL_ID')}`
    ] = authDetails.getIdToken().getJwtToken();
    const credentials = new AWS.CognitoIdentityCredentials(cognitoConfig);
    this.aws.config.credentials = credentials;

    return new Promise((resolve, reject) => {
      credentials.refresh(async (error) => {
        if (error) {
          Logger.error(error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private static getCognitoUserSession(
    cognitoUser: CognitoUser,
    authenticationDetails: AuthenticationDetails
  ): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          Logger.error(err);
          reject(err);
        }
      });
    });
  }

  async getAWS(): Promise<typeof AWS> {
    const credentials = this.aws.config.credentials as AWS.CognitoIdentityCredentials;
    if (!credentials || !credentials.needsRefresh || credentials.needsRefresh() || !credentials.expireTime) {
      if (!this.configService.get('AWS_CONTAINER_CREDENTIALS_RELATIVE_URI')) {
        await this.authenticate();
      }
    }
    return this.aws;
  }
}
