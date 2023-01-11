getCurrentVersion();

function changeVersion() {
  var version = localStorage.getItem('docs-version');
  var versionSelector = document.getElementById("arangodb-version");
  version  = versionSelector.options[versionSelector.selectedIndex].value;
  localStorage.setItem('docs-version', version);
  versionSelector.options[versionSelector.options.selectedIndex].selected = true;
  location.reload();
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

  