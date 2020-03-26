import gulp from 'gulp-task-doc';
import Validate from 'git-validate';

/**
 * Install default git pre-commit hook
 */
gulp.task('hooks-install', () => {
  Validate.installScript('lint', 'eslint src');
  Validate.installScript('flow-check', 'yarn flow src');
  Validate.installScript('test', 'test');
  Validate.configureHook('pre-commit', ['lint', 'flow-check', 'test'], true);
  Validate.installHooks(['pre-commit']);
});
