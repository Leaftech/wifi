'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['*.js']
        },
        jsdoc: {
            dist: {
                src: ['*.js'],
                options: {
                    destination: 'docs'
                }
            }
        },
        shell: {
            lintCommits: {
                command: 'node_modules/conventional-changelog-lint/distribution/cli.js --edit'
            },
            bumpRecommend: {
                command: 'node_modules/conventional-recommended-bump/cli.js -p angular'
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'chore(main): add new version tag for version v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'docs',
                    keepalive: true
                }
            }
        }
    });



    // Default task(s).
    grunt.registerTask('default', ['jshint', 'grunt-shell', 'jsdoc', 'connect']);

};
