

/* dependencies */
var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var recess = require('gulp-recess');
var header =  require('gulp-header');
var complexity =  require('gulp-complexity');
var ngAnnotate = require('gulp-ng-ngAnnotate');
var templateCache = require('gulp-angular-templatecache');

/*
*first task we will create JS minification, concatenation
* AngularJS inline annotations and template caching.
 *
 * gulp-header will be used to add a comment block to minified file
 * containing project name , author name, license and last update date.
*
* */



var banner = ['/**',
    ' * Instagram with the MEAN Stack',
    ' * (c) 2015 Author Name',
    ' * License: MIT',
    ' * Last Updated: <%= new Date().toUTCString() %>',
    ' */',
    ''].join('\n');


gulp.task('minify',function(){
    var templatesFilter = gulpFilter('clients/views/*.html');

    return gulp.src([
        'client/vendor/angular.js',
        'client/*.js',
        'client/app.js',
        'client/templates.js',
        'client/controllers/*.js',
        'client/services/*.js',
        'client/directives/*.js'
    ])
        .pipe(templatesFilter)
        .pipe(templateCache({root: 'views', module: 'Instagram'}))
        .pipe(templatesFilter.restore())
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(header(banner))
        .pipe(gulp.dest('client'));
});



/*
* Chris Samuel
* Feb 26 2015
* ksamuel.chris@gmail.com
*
* gulpfile.js
*
* In GUlp everything flows from top to bottom . wher eeach .pipe() method
* modifies the output in some shape or form.
*
* at the end of the file there should be a gulp.dest() method.
* This method outputs and saved the file to the dest directory
*
* IMPORTANT: In gulpfiles order matters for concatenation purposes.
*
* example: you need to load angular.js before loading any of the dependencies,modules/library etc.
*
*
* gulp-filter will take a detour to another gulp.src() and convert the HTML templates
* to JS by using the ANgular $templateCache feature.
*
* WE do this cause gulp does not allow you to specify multiple sources per task.
*
* */