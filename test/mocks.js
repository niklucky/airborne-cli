class TestController {
  start(params) {
    this.params = params;
    return params;
  }
}

export const config = {
  version: '0.0.0'
};

export const controllers = {
  TestController
};

export const connections = {
  mysql: {
    test: true
  }
};
