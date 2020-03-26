import gulp from 'gulp-task-doc';
import './bump';
import './install';

gulp.task('help', gulp.help());

// @internal
gulp.task('default', ['help']);
