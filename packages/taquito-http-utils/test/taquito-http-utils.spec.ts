import { HttpBackend } from '../src/taquito-http-utils';

describe('HttpBackend test', () => {
  const httpBackend: HttpBackend = new HttpBackend();

  it('Should be able to instantiate an HttpBackend object', (done) => {
    expect(httpBackend).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(httpBackend.timeout).toEqual(30000);
    done();
  });

  it('Should be able to pass timeout to HttpBackend constructor and override default', async (done) => {
    const http: HttpBackend = new HttpBackend(15000);

    expect(http).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(http.timeout).toEqual(15000);
    done();
  });

  it('Should serialize object while repsecting non-zero values.', async (done) => {
    const httpRequestQuery = {
      delegate: ['tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN', 'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e'],
      max_priority: 1,
    };
    const response = httpBackend['serialize'](httpRequestQuery);
    expect(response).toEqual(
      '?delegate=tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN&delegate=tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e&max_priority=1'
    );
    done();
  });

  it('Should serialize object while repsecting zero values.', async (done) => {
    const httpRequestQuery = {
      delegate: ['tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN', 'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e'],
      max_priority: 0,
    };
    const response = httpBackend['serialize'](httpRequestQuery);
    expect(response).toEqual(
      '?delegate=tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN&delegate=tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e&max_priority=0'
    );
    done();
  });
});
