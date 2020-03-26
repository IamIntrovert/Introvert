// @flow
import { saveHelper } from '../common/utils';

const FIRST_RUN_KEY = 'FIRST_RUN_KEY';

export async function saveInstallationFlag(value: boolean) {
  await saveHelper.saveFlag(FIRST_RUN_KEY, value);
}

export async function isFirstRun(): Promise<boolean> {
  return !(await saveHelper.getFlag(FIRST_RUN_KEY));
}
