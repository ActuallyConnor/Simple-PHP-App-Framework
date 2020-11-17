// Gulp file for scaffolding the project structure
const { emitWarning } = process;
process.emitWarning =
    (warning, type, code, ...extraArgs) =>
        code !== 'DEP0097' && emitWarning(warning, type, code, ...extraArgs);

var gulp = require('gulp'),
    filter = require('gulp-filter'),
    plugin = require('gulp-load-plugins')();

// Place custom JS here, files will be concantonated, minified if ran with --production
// Scss files will be concantonated, minified if ran with --production
const SOURCE = {
    scripts: 'assets/scripts/js/**/*.js',
    styles: 'assets/styles/scss/**/*.scss'
}

const ASSETS = {
    styles: 'assets/styles/',
    scripts: 'assets/scripts/',
    all: 'assets/'
};

const JSHINT_CONFIG = {
    "node": true,
    "globals": {
        "document": true,
        "jQuery": true
    }
};

// GULP FUNCTIONS
// JSHint, concat, and minify JavaScript
gulp.task('scripts', function() {
    
    // Use a custom filter so we only lint custom JS
    const CUSTOMFILTER = filter(ASSETS.scripts + 'js/**/*.js', {restore: true});
    
    return gulp.src(SOURCE.scripts)
    .pipe(plugin.plumber(function(error) {
        console.log(error.message);
        this.emit('end');
    }))
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.babel({
        presets: ['@babel/preset-env'],
        compact: true,
        ignore: ['what-input.js']
    }))
    .pipe(CUSTOMFILTER)
    .pipe(plugin.jshint(JSHINT_CONFIG))
    .pipe(plugin.jshint.reporter('jshint-stylish'))
    .pipe(CUSTOMFILTER.restore)
    .pipe(plugin.concat('scripts.js'))
    .pipe(plugin.uglify())
    .pipe(plugin.sourcemaps.write('.')) // Creates sourcemap for minified JS
    .pipe(gulp.dest(ASSETS.scripts))
});

// Compile Sass, Autoprefix and minify
gulp.task('styles', function() {
    return gulp.src(SOURCE.styles)
    .pipe(plugin.plumber(function(error) {
        console.log(error.message);
        this.emit('end');
    }))
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.sass())
    .pipe(plugin.cssnano())
    .pipe(plugin.sourcemaps.write('.'))
    .pipe(gulp.dest(ASSETS.styles))
});

// Watch files for changes (without Browser-Sync)
gulp.task('watch', function() {
    
    // Watch .scss files
    gulp.watch(SOURCE.styles, gulp.parallel('styles'));
    
    // Watch scripts files
    gulp.watch(SOURCE.scripts, gulp.parallel('scripts'));
    
});

// Run styles and scripts
gulp.task('default', gulp.parallel('styles', 'scripts'));

