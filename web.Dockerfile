FROM oven/bun

ADD package.json .
ADD bun.lockb .

RUN bun install

ADD . .

RUN DATABASE_URL="postgresql://MaintainMeDB_owner:mDVZRvr1Ff6t@ep-empty-hat-a5dkajbq.us-east-2.aws.neon.tech/MaintainMeDB?sslmode=require" bun run build

CMD bun run start