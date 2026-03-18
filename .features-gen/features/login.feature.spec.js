// Generated from: features\login.feature
import { test } from "playwright-bdd";

test.describe('Eclinic Login', () => {

  test('User logs in with valid credentials', { tag: ['@login', '@smoke', '@sanity', '@eclinic'] }, async ({ Given, When, Then, page }) => { 
    await Given('user is on the eclinic login page', null, { page }); 
    await When('user logs in with valid credentials'); 
    await Then('user should be redirected to the eclinic home page', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":8,"tags":["@login","@smoke","@sanity","@eclinic"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given user is on the eclinic login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When user logs in with valid credentials","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then user should be redirected to the eclinic home page","stepMatchArguments":[]}]},
]; // bdd-data-end