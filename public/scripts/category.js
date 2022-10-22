/* eslint-disable @typescript-eslint/indent */
function createCategory(fields) {
    fetch('/api/categories', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function updateCategory(fields) {
    fetch(`/api/categories/${fields.categoryName}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function deleteCategory(fields) {
    fetch(`/api/categories/${fields.categoryName}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function viewAllCategories(fields) {
    fetch('/api/categories')
      .then(showResponse)
      .catch(showResponse);
}

function viewFreetsInCategory(fields) {
  fetch(`api/categories/${fields.categoryName}/freets`)
    .then(showResponse)
    .catch(showResponse);
}

function addCategoryFreet(fields) {
  fetch(`api/categories/${fields.categoryName}/freets`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteCategoryFreet(fields) {
  fetch(`api/categories/${fields.categoryName}/freets`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
