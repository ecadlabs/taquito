# Docker to run Taquito integration tests
FROM node:20

COPY tsconfig.base.json /taquito/
COPY ./integration-tests /taquito/integration-tests/

WORKDIR /taquito/integration-tests

RUN npm install

CMD ["npm", "run", "originate-known-contracts-and-run-test"]