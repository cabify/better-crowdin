# @cabify-dev/better-crowdin

Crowdin CLI on steroids.

This CLI is based on [Official CLI](https://support.crowdin.com/cli-tool/) but adding several features
like project translation status, list branches, delete branches, etc.\* Moreover, it offers automatic sync
between git branches and crowdin branch

\*NOTE: Right now this CLI doesn't cover 100% of the features of the official client and error handling
is not polished. Please open PR's if you find something wrong

## Installation

```sh
$ npm install -g @cabify-dev/better-crowdin
```

## Configuration

In order to use inside your project, the easiest way is to have a `crowdin.yml` config file,
with the same shape than the official client one, plus some new config options

```yml
"project_identifier" : "your-project-identifier"
"api_key" : "your-api-key"
"base_path" : "your-base-path"

## New flags
"base_branches": ["master"] # list of git branches that are not generating a Crowdin branch when uploading sources
"skip_validation": ["ja", "en", "es-MX"] # list of languages that will be ignored when calling "better-crowdin status"

"files": [
  {
    "source" : "/t1/**/*",
    "translation" : "/%two_letters_code%/%original_file_name%",
    "languages_mapping" : {
      "two_letters_code" : {
        "ru" : "ros",
        "uk" : "ukr"
      }
  }
]
```

## Basic usage

```sh
$ better-crowdin [command]

Commands:
  better-crowdin delbranch         Delete the current or the given branch
  better-crowdin download          Download translations
  better-crowdin branches all      show all crowdin branches
  better-crowdin files             list sources and translations files

  better-crowdin status            Get translation status of the current branch
                                                                       [default]
  better-crowdin upload sources       Uploads the configured source files
  better-crowdin upload translations  Uploads the configured translations
  better-crowdin sync              Upload sources to crowdin & download translations


Options:
  --version        Show version number                                 [boolean]
  --config         Crowdin configuration file path [crowdin.yml]
  -d, --dry-run    Do not execute write operations on crowdin
  -b, --branch     Crowdin branch to use with command (defaults to current git
                   branch)                                              [string]
  --relative-path  Make "base_path" property relative to config file path
                                                                       [boolean]
  -h               Show help                                           [boolean]
  -p, --porcelain  Print script-aware outputs (no colors, no human friendly
                   info)                                               [boolean]
```

## Advanced usage: Work with feature branches

The main advantage of this client over the official one is the work with crowdin branches integrated
with gitflow (feature branches).

Briefly, the steps to add new keys to crowdin when working with feature branches are:

* When developing a feature branch
  * `better-crowdin upload` everytime you want to add new keys (will take branch name automatically)
  * `better-crowdin download` to download new keys already translated (will take branch name automatically)
* When merging with base branch that has new keys
  * `better-crowdin sync` to upload new base branch keys to your branch & download latest translations
* To check if the feature is fully translated (for instance in a pull request check script)
  * `better-crowdin status`
* After merging with base branch
  * `better-crowdin upload sources` To upload merged base files
  * `better-crowdin upload translations` To upload merged translations
  * `better-crowdin delbranch -b <branch_name>` To remove finished branch
  * `better-crowdin status` To check everything is correct

### Show me the code

1.  Your project has some strings already translated in master branch:

```sh
$ better-crowdin status
> better-crowdin status
- es-ES
   - src/locales/source.json. 10 / 10
- pt-PT
   - src/locales/source.json. 10 / 10
Everything fully translated. Enjoy!
```

2.  Then, you want to develop a feature with new translation keys:

```sh
  $ git checkout -b feature/my-new-feature
  ... (Add new key to "src/locales/source.json")
```

3.  After adding the new keys to the source files, you'll need to sync with crowdin

```sh
$ better-crowdin upload
> better-crowdin upload sources on feature_my-new-feature
- Creating feature_my-new-feature...OK
- src/locales/source.json...OK
```

4.  When content team translate new keys, you'll need to download them

```sh
$ better-crowdin download
> better-crowdin download on feature_my-new-feature
 - Building translations... BUILT
 - Downloading translations
   - src/locales/pt-PT.json
   - src/locales/es-ES.json

$ better-crowdin status
> better-crowdin status on feature_my-new-feature
- es-ES
   - src/locales/source.json. 1 / 1
- pt-PT
   - src/locales/source.json. 1 / 1
Everything fully translated. Enjoy!
```

5.  When someone else add new keys to master, you'll need to sync your branch to keep everything updated

```sh
$ better-crowdin sync
> better-crowdin upload sources on feature_my-new-feature
- Creating feature_my-new-feature...OK
- src/locales/source.json...OK
> better-crowdin download on feature_my-new-feature
 - Building translations... BUILT
 - Downloading translations
   - src/locales/pt-PT.json
   - src/locales/es-ES.json
```

6.  After everything is translated, you decide to merge the branch into master

```sh
  $ git checkout master
  $ git merge feature/my-new-feature (solve merge issues with translations)
```

7.  Then you'll need to sync again with crowdin, to add the feature keys to the main branch

```sh
$ better-crowdin upload sources; better-crowdin upload translations
> better-crowdin upload sources
- src/locales/source.json...OK
> better-crowdin upload translations
 - Uploading es-ES...OK
 - Uploading pt-PT...OK
```

8.  After that, you can remove the unused crowdin branch

```
$ better-crowdin delbranch -b feature_my-new-feature
> better-crowdin delbranch on feature_my-new-feature
OK
```

9.  Then, you can see that the new keys have been added to main branch

```sh
$ better-crowdin status
> better-crowdin status
- es-ES
   - src/locales/source.json. 11 / 11
- pt-PT
   - src/locales/source.json. 11 / 11
Everything fully translated. Enjoy!
```
