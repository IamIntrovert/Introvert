import gulp from 'gulp-task-doc';
import replace from 'gulp-replace';
import minimist from 'minimist';
import packageJSON from '../package.json';

const currentVersion = packageJSON.version;

/**
 * Bump version number
 * --version=x.x.x Set the exactly version
 */
gulp.task('bump', ['bump:package', 'bump:android', 'bump:ios']);

// @internal
gulp.task('bump:package', () => {
  const newVersion = getBumped();
  return gulp.src('../package.json')
    .pipe(replace(/"version": "[\d.]+"/, `"version": "${newVersion}"`))
    .pipe(replace(/--app-version [\d.]+/, `--app-version ${newVersion}`))
    .pipe(gulp.dest('..'));
});

// @internal
gulp.task('bump:android', () => {
  const newVersion = getBumped();
  const [major, minor, build] = newVersion.split('.');
  const versionCode = (major * 1000 * 1000) + (minor * 1000) + (build * 1);

  gulp.src('../android/app/build.gradle')
    .pipe(replace(/versionName "[\d.]+"/, `versionName "${newVersion}"`))
    .pipe(replace(/versionCode \d+/, `versionCode ${versionCode}`))
    .pipe(gulp.dest('../android/app'));

  return gulp.src('../android/app/src/main/AndroidManifest.xml')
    .pipe(replace(/versionName="[\d.]+"/, `versionName="${newVersion}"`))
    .pipe(replace(/versionCode="\d+"/, `versionCode="${versionCode}"`))
    .pipe(gulp.dest('../android/app/src/main'));
});

// @internal
gulp.task('bump:ios', () => {
  const v = getBumped();
  return gulp.src('../ios/Blum/Info.plist')
    .pipe(replace(
      /<key>CFBundleShortVersionString<\/key>\n\s+<string>[\d.]+/,
      `<key>CFBundleShortVersionString</key>\n\t<string>${v}`
    ))
    .pipe(replace(
      /<key>CFBundleVersion<\/key>\n\s+<string>[\d.]+/,
      `<key>CFBundleVersion</key>\n\t<string>${v}`
    ))
    .pipe(gulp.dest('../ios/Blum'));
});

function getBumped() {
  const argv = minimist(process.argv.slice(2));
  if (argv.version) {
    // eslint-disable-next-line no-console
    console.log('NEW VERSION', argv.version);
    return argv.version;
  }

  const currentSemVer = currentVersion.split('.');
  currentSemVer[2] = +currentSemVer[2] + 1;

  // eslint-disable-next-line no-console
  console.log('NEW VERSION', currentSemVer.join('.'));
  return currentSemVer.join('.');
}
