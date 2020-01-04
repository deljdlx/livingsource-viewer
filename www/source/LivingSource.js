
let LivingSource = function (selector) {
    this.selector = selector;
    this.versions;
    this.metadata;
    this.versionsIndexes;
    this.currentVersion;
    this.nextVersion;
    this.diffComponent;
    this.versionSelectorElement;


    this.theme = 'ace/theme/dracula';
};

LivingSource.prototype.loadMetadata = function (metadata) {
    this.metadata = metadata;
};


LivingSource.prototype.loadVersions = function (versions) {
    this.versions = versions;
    this.versionsIndexes = [];
    for (let index in this.versions) {
        this.versionsIndexes.push(index);
    }

    this.currentVersion = this.getVersionByIndex(0);
    this.nextVersion = this.getVersionByIndex(1);

};

LivingSource.prototype.getVersionByIndex = function (index) {
    return this.versions[
        this.versionsIndexes[index]
        ];
};

LivingSource.prototype.render = function () {
    if (this.diffComponent) {
        this.diffComponent.destroy();
    }

    let mode = this.getMode(this.source);

    this.diffComponent = new AceDiff({
        mode: mode,
        element: this.selector,
        theme: this.theme, // Setting theme works just like with Ace
        left: {
            content: this.currentVersion.content,
        },
        right: {
            content: this.nextVersion.content,
        },
    });

    this.gotoFirstDiff();

};

LivingSource.prototype.gotoFirstDiff = function() {
    let leftLines = this.currentVersion.content.split('\n');
    let rightLines = this.nextVersion.content.split('\n');

    let rightIndex = 0;

    for(let leftIndex = 0 ; leftIndex < leftLines.length ; leftIndex++) {

        rightIndex = leftIndex;

        let leftLine = leftLines[leftIndex];
        let rightLine = rightLines[rightIndex];

        if(leftLine == rightLine) {

        }
        else {

            this.diffComponent.editors.left.ace.focus();
            this.diffComponent.editors.left.ace.moveCursorTo(leftIndex, 0);

            this.diffComponent.editors.right.ace.focus();
            this.diffComponent.editors.right.ace.moveCursorTo(rightIndex, 0);


            this.diffComponent.editors.left.ace.resize(true);
            this.diffComponent.editors.left.ace.scrollToLine(rightIndex+20, true, true, function () {});


            this.diffComponent.editors.right.ace.resize(true);
            this.diffComponent.editors.right.ace.scrollToLine(rightIndex+20, true, true, function () {});

            break;
        }
    }
};



LivingSource.prototype.renderVersion = function (versionIndex) {

    if (versionIndex == 0) {
        this.currentVersion = this.getVersionByIndex(0);
        this.nextVersion = this.getVersionByIndex(0);
    } else {
        this.currentVersion = this.getVersionByIndex(versionIndex - 1);
        this.nextVersion = this.getVersionByIndex(versionIndex);
    }

    this.render();
};

LivingSource.prototype.getMode = function () {

    //console.log(this.metadata);
    if (this.metadata.mime == 'text/x-php') {
        return "ace/mode/php";
    }
    return null;
};

LivingSource.prototype.generateNavbar = function (selector) {
    let navbarContainer = document.querySelector(selector);
    navbarContainer.innerHTML = '';



    let buttonPrevious = document.createElement('button');
    buttonPrevious.innerHTML = '-';
    buttonPrevious.addEventListener('click', function() {
        this.versionSelectorElement.value--;
        this.renderVersion(this.versionSelectorElement.value);
    }.bind(this));
    navbarContainer.appendChild(buttonPrevious);

    this.versionSelectorElement = document.createElement('select');

    for (let index = 0; index < this.versionsIndexes.length; index++) {
        let timestamp = this.versionsIndexes[index];

        let option = document.createElement('option');
        option.setAttribute('value', index);
        option.textContent = this.getVersionByIndex(index).name;
        this.versionSelectorElement.appendChild(option);
    }

    navbarContainer.appendChild(this.versionSelectorElement);
    this.versionSelectorElement.addEventListener('change', function(event) {
        this.renderVersion(event.currentTarget.value);
    }.bind(this));

    let buttonNext = document.createElement('button');
    buttonNext.innerHTML = '+';
    buttonNext.addEventListener('click', function() {
        this.versionSelectorElement.value++;
        this.renderVersion(this.versionSelectorElement.value);
    }.bind(this));
    navbarContainer.appendChild(buttonNext);
};


