# NUvention-teamB.github.io

# Set up

## React Native
Install React Native client first. We recommend install it globally by using:
```
npm install -g react-native-cli
```
Note that you need to have node and watchman installed first. Detailed instructions can be found at:
https://facebook.github.io/react-native/docs/getting-started.html

To develop this app, you will need to install the following SKDs: AWS React Native SDK and Facebook React Native SDK.

## aws-sdk-react-native
https://github.com/awslabs/aws-sdk-react-native
Please follow more in-depth instructions as suggested by this post:
https://github.com/awslabs/aws-sdk-react-native/issues/35

## react-native-fbsdk
Following the instructions
https://github.com/facebook/react-native-fbsdk

## Xcode
When you build the app, you'll get a bunch of exceptions due to mis-matchings of AWS SDK versions, delete those 'if statements' and the conditional code.

## Run
Run the app using
```
react-native run-ios
```

To log app output for detailed information and debugging, run:
```
react-native log-ios
```

# Contact information
If you run into any issues, please contact one of the following developers:
dinomujkic2017@u.northwestern.edu
christopherli2017@u.northwestern.edu
