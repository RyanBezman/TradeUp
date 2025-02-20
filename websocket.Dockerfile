FROM oven/bun

ADD package.json .
ADD bun.lockb .

RUN bun install

ADD . .

CMD DATABASE_URL="postgresql://MaintainMeDB_owner:npg_eVLDAu5TbXk9@ep-empty-hat-a5dkajbq.us-east-2.aws.neon.tech/MaintainMeDB?sslmode=require" bun src/db/websocket.ts