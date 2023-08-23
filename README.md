# Example for using query params with Angular reactive forms

Fork of the angular reactive-form example code. 
Shows an example how to store data from a reactive form as query params.

Can be used per example for search forms, to allow a user to share it's url, or simply to retrieve his search param after routing to another page.

## Enhancements 

- ❌ Add type information (which convention should be used?)
    - [bool]true,[date]2023-0719
    - [b|d]val
    - other ?
- ❌ Add nested formGroups to test this part
- ❌ Unsubscribe of observables ? Simple way could be to create observable on angular lifecycle "on destroy"
- ❌ Tests
    - ✅ utils functions
    - ✅ abstract control observable piping
    - ❌ FormQueryParamService testing with mocking router route.

