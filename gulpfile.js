var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass")(require("sass"));
var del = require("del");
var useref = require("gulp-useref");
var cache = require("gulp-cache");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
// var cssnano = require("gulp-cssnano");
const cleanCSS = require("gulp-clean-css");
var imagemin = require("gulp-imagemin");
var rollup = require("rollup");
var { nodeResolve } = require("@rollup/plugin-node-resolve");
var terser = require("@rollup/plugin-terser");
var path = require("path");
var fs = require("fs");
var replace = require("gulp-replace");
// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", async function () {
  return await gulp
    .src(["app/scss/*.scss", "app/css/*.css"])
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(gulpIf("*.css", cleanCSS()))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Bundle ES6 modules with Rollup
gulp.task("js", async function () {
  try {
    // Ensure dist/js directory exists
    const distJsDir = path.join(__dirname, "dist", "js");
    if (!fs.existsSync(path.join(__dirname, "dist"))) {
      fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
    }
    if (!fs.existsSync(distJsDir)) {
      fs.mkdirSync(distJsDir, { recursive: true });
    }

    const bundle = await rollup.rollup({
      input: path.join(__dirname, "app", "js", "main.js"),
      plugins: [
        nodeResolve({
          // Resolve .js extensions and relative imports
          extensions: ['.js'],
          browser: true,
        }),
      ],
      // Suppress circular dependency warnings - they're handled by ES modules
      onwarn: function(warning, warn) {
        // Skip circular dependency warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        // Use default for everything else
        warn(warning);
      }
    });

    // Generate bundle
    const result = await bundle.write({
      file: path.join(__dirname, "dist", "js", "main.js"),
      format: "iife", // Immediately Invoked Function Expression for browser
      name: "QWERTYBall",
      plugins: [
        terser({
          compress: {
            drop_console: false, // Keep console.logs for debugging
          },
        }),
      ],
    });

    // Bundle generated successfully

    await bundle.close();
    return Promise.resolve();
  } catch (error) {
    console.error("Rollup bundling error:", error);
    throw error;
  }
});

// Static Server + watching scss/html files
// gulp.task(
// 	"serve",
// 	gulp.series("sass", function () {
// 		browserSync.init({
// 			server: "./app/",
// 			port: 3001,
// 			open: false,    // don’t keep popping new tabs
//   			notify: false   // hide the ‘Connected’ toast
// 		});

// 		gulp.watch("app/scss/*.scss", gulp.series("sass"));
// 		gulp.watch("app/*.html").on("change", browserSync.reload);
// 		gulp.watch("app/*.js").on("change", browserSync.reload);
// 		gulp.watch("app/content/**/*").on("change", browserSync.reload);
// 	})
// );
// Static Server + watching scss/html/js files
gulp.task(
  "serve",
  gulp.series("sass", function () {
    browserSync.init({
      server: "./app/",
      port: 3001,
      open: false, // don’t keep popping new tabs
      notify: false, // hide the ‘Connected’ toast
    });

    // Watch styles
    // Recompile only when SCSS changes
    gulp.watch("app/scss/**/*.scss", gulp.series("sass"));

    // Reload when the compiled CSS changes (do NOT re-run sass here)
    gulp.watch("app/css/**/*.css").on("change", browserSync.reload);

    // Watch HTML
    gulp.watch(["app/**/*.html"]).on("change", browserSync.reload);

    // Watch JS (adjust globs to your layout)
    gulp.watch(["app/**/*.js", "app/*.js"]).on("change", browserSync.reload);
  })
);

//images

gulp.task("images", async function () {
  return await gulp
    .src("assets/images/**/*.+(png|jpg|jpeg|gif|svg|ico)")
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest("dist/images"));
});

// Delete The build folder
gulp.task("clean", async function (done) {
  await del.sync("dist");
  done();
});

// Use ref

gulp.task("useref", async function () {
  return await gulp
    .src("app/*.html")
    .pipe(useref({
      // Don't process JS files - rollup already bundled them
      searchPath: "app",
      noAssets: true // Don't copy assets, just process HTML
    }))
    // Minifies only if it's a CSS file
    .pipe(gulpIf("*.css", cleanCSS()))
    .pipe(gulp.dest("dist"));
});

// Remove type="module" from script tags after bundling
gulp.task("removeModuleType", async function () {
  return await gulp
    .src("dist/*.html")
    .pipe(
      replace(
        /type="module"/g,
        ''
      )
    )
    .pipe(gulp.dest("dist"));
});

//Copy Files from folder
gulp.task("copyFiles", async () => {
  return await gulp.src(["app/content/**/*"]).pipe(gulp.dest("dist/content"));
});

// Build The outcome

gulp.task(
  "build",
  gulp.series(
    "clean",
    "sass",
    "js",
    "useref",
    "removeModuleType",
    "images",
    "copyFiles",
    function (done) {
      done();
    }
  )
);

gulp.task("default", gulp.series("serve"));

var realFavicon = require("gulp-real-favicon");
var fs = require("fs");

// File where the favicon markups are stored
var FAVICON_DATA_FILE = "faviconData.json";

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task("generate-favicon", function (done) {
  realFavicon.generateFavicon(
    {
      masterPicture: "assets/images/master_picture.png",
      dest: "dist/images/icons",
      iconsPath: "/",
      design: {
        ios: {
          pictureAspect: "backgroundAndMargin",
          backgroundColor: "#ffffff",
          margin: "14%",
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {
          design: "raw",
        },
        windows: {
          pictureAspect: "noChange",
          backgroundColor: "#da532c",
          onConflict: "override",
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: "backgroundAndMargin",
          margin: "17%",
          backgroundColor: "#ffffff",
          themeColor: "#ffffff",
          manifest: {
            display: "standalone",
            orientation: "notSet",
            onConflict: "override",
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: "silhouette",
          themeColor: "#5bbad5",
        },
      },
      settings: {
        scalingAlgorithm: "Mitchell",
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: FAVICON_DATA_FILE,
    },
    function () {
      done();
    }
  );
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task("inject-favicon-markups", function () {
  return gulp
    .src(["dist/*.html", "dist/misc/*.html"])
    .pipe(
      realFavicon.injectFaviconMarkups(
        JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code
      )
    )
    .pipe(gulp.dest("dist"));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task("check-for-favicon-update", function (done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
});
