/* eslint-disable @typescript-eslint/indent */
function likeFreet(fields) {
    fetch('/api/likes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function unlikeFreet(fields) {
    fetch('/api/likes', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}
