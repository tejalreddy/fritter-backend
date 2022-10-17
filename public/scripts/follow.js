/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function followUser(fields) {
  fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  fetch('/api/follows', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
