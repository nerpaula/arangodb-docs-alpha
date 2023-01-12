getCurrentVersion();

function changeVersion() {
  var oldVersion = localStorage.getItem('docs-version');
  var versionSelector = document.getElementById("arangodb-version");
  var newVersion  = versionSelector.options[versionSelector.selectedIndex].value;
  localStorage.setItem('docs-version', newVersion);
  versionSelector.options[versionSelector.options.selectedIndex].selected = true;

  var oldUrl = window.location.href;
  var newUrl = oldUrl.replace(oldVersion, newVersion)
  location.href = newUrl;
}

function getCurrentVersion() {
  var version = localStorage.getItem('docs-version');
  var versionSelector = document.getElementById("arangodb-version");
  for(let option of versionSelector.options) {
    if (option.value == version) {
      option.selected = true;
    }
  }
}

  