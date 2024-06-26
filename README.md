# playwrightAutomationFramework

The configuration for testing is set so that screenshots are captured only when failures occur

```
use: {
trace: "retain-on-failure",
browserName: "chromium",
screenshot: "on",
headless: true,
},
```

To run all tests, use the below command

```
npx playwright test
```

To run Cucumber files, use the below command

```
npx cucumber-js --exit
```

To generate cucumber-report, use the below command

```
npx cucumber-js --tags @Regression --exit --format html:cucumber-report.html
```

Tests which have been optimized using POM model

* [X] itemActions.spec.js
* [X] loginTests.spec.js
* [X] navBarContent.spec.js
* [ ] negativeTests.spec.js
* [ ] purchasingItems.spec.js
* [ ] searchBar.spec.js

Cucumber Tests:

* [ ] itemActions.spec.js
* [X] loginTests.spec.js
* [ ] navBarContent.spec.js
* [ ] negativeTests.spec.js
* [ ] purchasingItems.spec.js
* [ ] searchBar.spec.js

Working on currently adding more tests. Will include the following features in the framework soon:

* API Testing
  * Add the capability in package.json >> scripts
* End to end testing including UI and API flows
  * Add the capability in package.json >> scripts
* Cross browser testing

TO-DO:

* [ ] Add console.log statements to all tests as the first line
* [ ] Add tagging for all tests
* [ ] Add corresponding scripts
* [ ] Add connection to Jenkins
* [ ] Can we have Jenkins results shared in Github as a screenshot!?
