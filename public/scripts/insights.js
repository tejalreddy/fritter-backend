/* eslint-disable @typescript-eslint/indent */
function inputInsights(fields) {
    fetch('/api/insights', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function getInsights(fields) {
    fetch('/api/insights')
      .then(showResponse)
      .catch(showResponse);
}

function getInsightsForDate(fields) {
    fetch(`/api/insights/${fields.date}`)
      .then(showResponse)
      .catch(showResponse);
}

