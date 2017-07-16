var gulp = require('gulp'),
    sass = require('gulp-sass'),
	concat  = require('gulp-concat'),
	htmlmin = require('gulp-htmlmin'),
	cssmin  = require('gulp-minify-css'),
	amdOptimize = require('amd-optimize');
	
var Q = require('q');

gulp.task('testSass', function(){
    var deferred = Q.defer();
	console.log(' it is entering testSass...');
    setTimeout(function(){
        gulp.src('src/css/hello.scss')
	    .pipe(sass())
	    .pipe(gulp.dest('src/css'))
	    deferred.resolve();
		console.log(' it is handling testSass...');
    }, 1000);	
    return deferred.promise; 
});

gulp.task('testSassNext', [ 'testSass' ], function(){	
	var deferred = Q.defer();
	console.log(' it is entering testSassNext...');
    setTimeout(function(){
        gulp.src('src/css/hello2.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
		deferred.resolve();
		console.log(' it is handling testSassNext...');
    }, 1000);	
    return deferred.promise; 	
});

gulp.task('default',[ 'testSass', 'testSassNext' ], function(){
	console.log(' it is handling default...');	
});
//gulp.task('default',[ 'watch1' ]); //[ 'testSass', 'watch1' ]);

gulp.task( 'watch1', [ 'default' ], function(){
    // return gulp.watch( 'src/css/hello.scss', ['testSass'] );
	console.log(' it is handling watch1...');
    gulp.watch( 'src/css/hello.scss', [ 'testSass' ], function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');	
    });	    
} );

gulp.task( 'testHtmlmin', [ 'watch1' ], function(){
	var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
	
	gulp.src(['src/html/*.html', '!requireTest.html'])
		.pipe(htmlmin(options))
		.pipe(gulp.dest('dist/html'));
	
});

gulp.task( 'testCssmin', [ 'testHtmlmin' ], function () {
	var options = {
		advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
		compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
		keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
		keepSpecialComments: '*'
		//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    };
	
	gulp.src('src/css/*.css')
		.pipe(cssmin(options))
		.pipe(gulp.dest('dist/css'));
	
});

gulp.task( 'testConcat', [ 'testCssmin' ], function () {
	gulp.src(['src/js/*.js', '!src/js/main.js'])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
	
});

gulp.task( 'testRequire', [ 'testConcat' ], function () {
	gulp.src('src/js/lib/*.js') 
		.pipe(amdOptimize('src/js/main')) //主入口文件 
		//.pipe(concat('main-new.js')) //合并后的文件，如何合并后的文件和主入口名一样，构建后便只有一个文件 
		.pipe(gulp.dest('dist/js')); //输出目录
});




