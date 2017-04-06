var gulp         = require('gulp'),
		concat       = require('gulp-concat'),
		sourcemaps   = require('gulp-sourcemaps'),
		ngAnnotate   = require('gulp-ng-annotate'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		minifycss    = require('gulp-minify-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concatCss    = require('gulp-concat-css'),
		nodemon      = require('gulp-nodemon'),
		uglifyjs     = require('gulp-uglifyjs'),
		uglify       = require('gulp-uglify'),
		imagemin     = require('gulp-imagemin'),
		order        = require('gulp-order'),
		useref       = require('gulp-useref'),
		gulpif       = require('gulp-if'),
		gutil        = require('gulp-util'),
		ftp          = require('vinyl-ftp');

/** Default task list auto apdate page, compile sass and minifi css **/
gulp.task('browser-sync', [
						'styles',
						'vendorCss'
						], function() {
	browserSync.init({
			server: {
					baseDir: "./app"
			},
			notify: false,
			files: ['./app/index.html','./app/components/**/*.html','./app/components/**/*.js','./app/app.js','./app/assets/css/*.css']
	});
});


gulp.task('styles', function () {
	gulp.src('app/assets/sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(minifycss(''))
	.pipe(gulp.dest('app/assets/css'));
});

gulp.task('vendorCss', function () {
	return gulp.src('app/assets/libs/**/*.css')
		.pipe(concatCss("vendor.css"))   
		.pipe(minifycss('')) 
		.pipe(rename("vendor.min.css"))
		.pipe(gulp.dest('app/assets/css'));
});

gulp.task('watch', function () {
	gulp.watch('app/assets/sass/*.sass', ['styles']);
	gulp.watch('app/libs/**/*.js', ['js']);
	gulp.watch('app/**/*.html');		
});
gulp.task('default', ['watch','browser-sync']);
/** Default task list auto apdate page, compile sass and minifi css **/



/** FTP Configuration **/
var ftpConfig = {
	user: '',  // or process.env.FTP_USER  and call task FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy
	password: '', // or  process.env.FTP_PWD and call task FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy
	host: '', 
	port: '',
	localFilesGlob: ['./dist/**'],
	remoteFolder: '/home/ftpuser'
};

// host: 192.168.1.236,
// port: 20,
// user: ftpuser,
// password: TY9A_gShS5aq?!&Q

function getFtpConnection() {  
	return ftp.create({
		host: ftpConfig.host,
		port: ftpConfig.port,
		user: ftpConfig.user,
		password: ftpConfig.password,
		parallel: 5,
		log: gutil.log
	});
};

/**
 * Deploy task.
 * Copies the new files to the server
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
*/
gulp.task('ftp-deploy', function() {
	var conn = getFtpConnection();
	return gulp.src(ftpConfig.localFilesGlob, { base: './dist/', buffer: false })
		.pipe( conn.newer( ftpConfig.remoteFolder ) )
		.pipe( conn.dest( ftpConfig.remoteFolder ) );
});

/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('ftp-deploy-watch', function() {
	var conn = getFtpConnection();
	gulp.watch(ftpConfig.localFilesGlob)
	.on('change', function(event) {
		console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);
		return gulp.src( [event.path], { base: '.', buffer: false } )
			.pipe( conn.newer( ftpConfig.remoteFolder ) )
			.pipe( conn.dest( ftpConfig.remoteFolder ) )
		;
	});
});


gulp.task('build', ['scripts','static']);

gulp.task('scripts', function(){
	return gulp.src('app/**/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifycss('')))
		.pipe(gulp.dest('dist'));
});

gulp.task('static', function(){
	gulp.src('app/assets/fonts/**/*')
		.pipe(gulp.dest('dist/assets/fonts/'));
	gulp.src('app/assets/img/**/*')
		.pipe(imagemin(''))
		.pipe(gulp.dest('dist/assets/img/'));
	gulp.src('app/assets/css/font-awesome/**/*')
		.pipe(gulp.dest('dist/assets/css/font-awesome'));
	gulp.src('app/three-render/texture/**/*')
		.pipe(imagemin(''))
		.pipe(gulp.dest('dist/three-render/texture/'));
	gulp.src('app/static-json/**/*.json')
		.pipe(gulp.dest('dist/static-json/'));
});