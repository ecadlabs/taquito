# Docker to run Taquito integration tests
FROM node

COPY tsconfig.base.json /taquito/
COPY ./integration-tests /taquito/integration-tests/

WORKDIR /taquito/integration-tests

RUN npm install

CMD ["npm", "run", "originate-known-contracts-and-run-test"]