FROM oven/bun

ADD package.json .
ADD bun.lockb .

RUN bun install

ADD . .

CMD bun src/db/websocket.ts