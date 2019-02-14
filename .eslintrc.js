module.exports = {
    "env": {
         "mocha":true
	},
    "extends": "airbnb-base",
    "rules": {
    "prefer-destructuring": ["warn", {"object": true, "array": false}],
    "no-plusplus": ["warn"],
    "max-len": ["warn"]

  }
};
