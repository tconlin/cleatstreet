# Cleat Street iOS App V1

## Install

To run on new machine:

```
git clone {this_github_directory}

npm install 

cd functions/

npm install 

cd ios/

rm -rf build/

rm -rf Pods/

pod install

cd ..

npm run ios

```


## ToDo

- REDUX
- Firebase Functions Error Log: Error serializing return value: TypeError: Converting circular structure to JSON
- Async Storage of user avatar?
- Email verification strategy
- Speed up real time services -- sockets?
    - current rate of 'every minute' seems to be fine because data from sportradar updates at about the same rate.
    (edit: we took it down to 'every 2 minutes' because of sportradar api call boundaries )