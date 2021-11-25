import { MainviewModule } from './mainview.module';

describe('MainviewModule', () => {
  let mainviewModule: MainviewModule;

  beforeEach(() => {
    mainviewModule = new MainviewModule();
  });

  it('should create an instance', () => {
    expect(mainviewModule).toBeTruthy();
  });
});
