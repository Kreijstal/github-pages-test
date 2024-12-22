// Personalization options and defaults
const defaultOptions = {
    headerText: "Comments",
    subheaderText: "Share your thoughts below!",
    avatarDefault: "https://secure.gravatar.com/avatar/default?s=164&d=identicon",
    formTitle: "Create Your Comment",
    previewTitle: "Preview",
    contributionText: "Want to add your own comment? You can contribute by:",
    contributionSteps: [
        "Editing the comments.toml file",
        "Adding your comment using TOML format with markdown support",
        "Creating a pull request"
    ]
};

export class PersonalizationAPI {
    constructor(options = {}) {
        this.options = { ...defaultOptions, ...options };
    }

    getHeaderText() {
        return this.options.headerText;
    }

    getSubheaderText() {
        return this.options.subheaderText;
    }

    getFormTitle() {
        return this.options.formTitle;
    }

    getPreviewTitle() {
        return this.options.previewTitle;
    }

    getDefaultAvatar() {
        return this.options.avatarDefault;
    }

    getContributionText() {
        return this.options.contributionText;
    }

    getContributionSteps() {
        return this.options.contributionSteps;
    }
}
