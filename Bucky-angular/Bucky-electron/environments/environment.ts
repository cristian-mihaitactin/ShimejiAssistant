// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  baseApiUrl: "https://localhost:5001",
  config: "development",
  default_user: {
    username: "Guest",
    email : "",
    buckyProfile: {
      id: '8919e40e-d588-42f2-a0a8-4afb9ad1589b',
      isMainProfile: true,
      name: 'Bucky',
      description: 'Default profile',
      behaviours: [
        {
          actionType: '0',
          actionTypeString: 'standby',
          imageBytes: ''
        },
        {
          actionType: '1',
          actionTypeString: 'notification',
          imageBytes: ''
        },
        {
          actionType: '2',
          actionTypeString: 'dragged',
          imageBytes: ''
        },
        {
          actionType: '4',
          actionTypeString: 'attention',
          imageBytes: ''
        },
        {
          actionType: '8',
          actionTypeString: 'bow',
          imageBytes: ''
        }
      ]
  },
    pluginsInstalled: "[]"
  },
  default_buckyProfile: {
    id: '8919e40e-d588-42f2-a0a8-4afb9ad1589b',
    isMainProfile: true,
    behaviours: [
      {
        actionType: '0',
        actionTypeString: 'standby',
        imageBytes: ''
      },
      {
        actionType: '1',
        actionTypeString: 'notification',
        imageBytes: ''
      },
      {
        actionType: '2',
        actionTypeString: 'dragged',
        imageBytes: ''
      },
      {
        actionType: '4',
        actionTypeString: 'attention',
        imageBytes: ''
      },
      {
        actionType: '8',
        actionTypeString: 'bow',
        imageBytes: ''
      }
    ],
    name: 'Bucky',
    description: 'Default profile'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
